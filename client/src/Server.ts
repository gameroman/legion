class ServerPlayer {
    frame;
    x;
    y;
    hp;
    maxHP;
    distance;

    constructor(frame, x, y) {
        this.frame = frame;
        this.x = x;
        this.y = y;
        this.maxHP = 100;
        this.hp = this.maxHP;
        this.distance = 4;
    }

    getPlacementData(includePersonal = false) {
        return {
            'frame': this.frame,
            'x': this.x,
            'y': this.y,
            'distance': includePersonal ? this.distance : 0,
            'hp': this.maxHP,
        }
    }

    canMoveTo(x: number, y: number) {
        // Check if (x, y) is within a circle of radius `this.distance` from (this.gridX, this.gridY)
        return Math.pow(x - this.x, 2) + Math.pow(y - this.y, 2) <= Math.pow(this.distance, 2);
    }

    isNextTo(x: number, y: number) {
        return (Math.abs(x - this.x) <= 1 && Math.abs(y - this.y) <= 1);
    }

    updatePos(x, y) {
        this.x = x;
        this.y = y;
    }

    dealDamage(damage) {
        this.hp -= damage;
        if (this.hp < 0) {
            this.hp = 0;
        }
    }

    getHP() {
        return this.hp;
    }
}

export class Server
{
    players: ServerPlayer[] = [];
    opponents: ServerPlayer[] = [];
    gridMap: Map<string, ServerPlayer> = new Map<string, ServerPlayer>();

    constructor() {
        this.players.push(new ServerPlayer('warrior_1', 4, 4));
        this.players.push(new ServerPlayer('mage_1', 18, 2));
        this.players.push(new ServerPlayer('warrior_2', 18, 6));
        this.opponents.push(new ServerPlayer('warrior_3', 3, 4));
        this.opponents.push(new ServerPlayer('mage_2', 1, 2));
        this.opponents.push(new ServerPlayer('warrior_4', 1, 6));

        this.players.forEach(player => {
            this.gridMap.set(`${player.x},${player.y}`, player);
        });
        this.opponents.forEach(player => {
            this.gridMap.set(`${player.x},${player.y}`, player);
        });
    }

    getPlacementData() {
        const data = {
            'player': {
                'team': this.players.map(player => player.getPlacementData(true))
            },
            'opponent': {
                'team': this.opponents.map(player => player.getPlacementData())
            }
        }
        return data;
    }

    isFree(gridX, gridY) {
        const isFree = !this.gridMap[`${gridX},${gridY}`];
        return isFree;
    }

    processMove({tile, num}) {
        if (!this.isFree(tile.x, tile.y)) return;
        const player = this.players[num - 1];
        if (!player.canMoveTo(tile.x, tile.y)) return;
        player.updatePos(tile.x, tile.y);
        return {
            isPlayer: true,
            tile,
            num
        };
    }

    processAttack({num, target}) {
        const player = this.players[num - 1];
        const opponent = this.opponents[target - 1];
        if (!player.isNextTo(opponent.x, opponent.y)) return;
        const damage = 10;
        opponent.dealDamage(damage);
        return {
            isPlayer: true,
            target,
            num,
            damage,
            hp: opponent.getHP()
        };
    }
}