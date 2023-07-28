import { ServerPlayer, ActionType } from './ServerPlayer';

type Comparator<T> = (a: T, b: T) => number;

const highestHpComparator: Comparator<ServerPlayer> = (a, b) => a.hp - b.hp;
const lowestHpComparator: Comparator<ServerPlayer> = (a, b) => b.hp - a.hp;

enum AIType {
    Opportunist,
    Hunter,
    Equalizer,
    Defender
}

export class AIServerPlayer extends ServerPlayer {
    AItype: AIType;
    target: ServerPlayer | null = null;
    retargetRate: number = 0;
    retargetCount: number = 0;

    constructor(num: number, frame: string, x: number, y: number) {
        super(num, frame, x, y);

        const random = Math.floor(Math.random() * 4) + 1;
        switch (random) {
            case 1:
                this.AItype = AIType.Opportunist;
                break;
            case 2:
                this.AItype = AIType.Hunter;
                break;
            case 3:
                this.AItype = AIType.Equalizer;
                break;
            case 4:
                this.AItype = AIType.Defender;
                break;
            default:
                this.AItype = AIType.Opportunist;
                break;
        }

        // Assign a random value between 1 and 10 to retargetCount
        this.retargetRate = 3; // Math.floor(Math.random() * 10) + 1;
        this.retargetCount = this.retargetRate;

        this.AItype = AIType.Opportunist; // TODO: remove

        const cooldown = this.getCooldown('move');
        this.setCooldown(cooldown);
    }

    getCooldown(action: ActionType) {
        // Return a random number between 1 and 1.3 times the cooldown
        return Math.floor(this.cooldowns[action] * (1 + Math.random() * 0.3));
    }

    takeAction() {
        if (!this.canAct) return;

        // Opportunist: attacks if adjacent, otherwise moves towards closest enemy
        // Hunter: targets the enemy with the lowest HP
        // Equalizer: targets the enemy with the highest HP
        // Defender: targets enemy closest to lowest HP ally

        this.determineTarget();
        if(!this.target) return;

        if (this.isNextTo(this.target!.x, this.target!.y)) {
            this.attack(this.target!);
        } else {
            this.moveTowards(this.target!.x, this.target!.y);
        }

        this.retargetCount--;
        if (this.retargetCount <= 0) {
            this.target = null;
            this.retargetCount = this.retargetRate;
        }
    }

    determineTarget() {
        if(this.target && this.target.isAlive()) return;
        // console.log('Determining target');

        switch (this.AItype) {
            case AIType.Opportunist:
                this.opportunistTarget();
                break;
            case AIType.Hunter:
                this.hunterTarget();
                break;
            // case AIType.Equalizer:
            //     this.equalizer();
            //     break;
            // case AIType.Defender:
            //     this.defender();
            //     break;
            default:
                this.opportunistTarget();
                break;
        }
    }

    getOptimalTarget(targets: ServerPlayer[], comparator: Comparator<ServerPlayer>) {
        let optimalTarget: ServerPlayer | null = null;
        targets.forEach(target => {
            if (!optimalTarget || comparator(target, optimalTarget) > 0) {
                optimalTarget = target;
            }
        });
        return optimalTarget;
    }

    opportunistTarget() {
        let targets = this.team?.game.listAdjacentEnemies(this);
        if (targets?.length === 0) {
            targets = this.team?.game.listAllEnemies(this);
        }
        this.target = this.getOptimalTarget(targets!, lowestHpComparator);
        // console.log(`opportunist target: ${this.target!.num} at (${this.target!.x}, ${this.target!.y})`);
    }

    hunterTarget() {
        const targets = this.team?.game.listAllEnemies(this);
        const target = this.getOptimalTarget(targets!, lowestHpComparator);
        if (target) {
            this.attack(target);
        }
    }

    // equalizer() {
    //     const targets = this.team?.game.listAllEnemies(this);
    //     const target = this.getOptimalTarget(targets!, highestHpComparator);
    //     if (target) {
    //         this.attack(target);
    //     }
    // }

    // defender() {
    //     const target = this.getClosestEnemyToLowestHPAlly();
    //     if (target) {
    //         this.attack(target);
    //     }
    // }

    attack(target: ServerPlayer) {
        const data = {
            num: this.num,
            target: target.num,
        }
        this.team?.game.processAttack(data, this.team);
    }

    moveTowards(x: number, y: number) {
        const tiles = this.team?.game.listCellsInRange(this.x, this.y, this.distance);
        
        // Find the tile with the lowest distance to (x, y)
        let closestTile = tiles![0];
        let closestDistance = Math.pow(tiles![0].x - x, 2) + Math.pow(tiles![0].y - y, 2);
        for(let i = 1; i < tiles!.length; i++) {
            const nextTo = (Math.abs(x - tiles![i].x) <= 1 && Math.abs(y - tiles![i].y) <= 1);
            if (nextTo) {
                closestTile = tiles![i];
                break;
            } 
            const distance = Math.pow(tiles![i].x - x, 2) + Math.pow(tiles![i].y - y, 2);
            if (distance < closestDistance) {
                closestTile = tiles![i];
                closestDistance = distance;
            }
        }

        const data = {
            num: this.num,
            tile: closestTile,
        }
        this.team?.game.processMove(data, this.team);
    }
}