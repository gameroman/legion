import { Team } from './Team';
import { Item, NetworkItem } from './Item';

export type ActionType = 'move' | 'attack';
export class ServerPlayer {
    num;
    frame;
    x;
    y;
    team: Team | null = null;
    hp;
    maxHP;
    distance;
    atk;
    def;
    cooldowns;
    cooldown: number = 0;
    cooldownTimer: NodeJS.Timeout | null = null;
    canAct = false;
    inventory: Map<Item, number> = new Map<Item, number>();

    constructor(num: number, frame: string, x: number, y: number) {
        this.num = num;
        this.frame = frame;
        this.x = x;
        this.y = y;
        this.maxHP = 100;
        this.hp = this.maxHP;
        this.distance = 3;
        this.atk = 10;
        this.def = 10;
        this.cooldowns = {
            'move': 500,
            'attack': 500
        };
        this.setCooldown(this.cooldowns.move);

//         Every level up, a character gains:
//         Attack: +2 and +10% of current attack
//         Defense: +3 and +8% of current defense

// Written as formulas, these might be:

//     New Attack = Current Attack + 2 + Current Attack * 0.10
//     New Defense = Current Defense + 3 + Current Defense * 0.08
    }

    getPlacementData(includePersonal = false): playerNetworkData {
        const data: playerNetworkData = {
            'frame': this.frame,
            'x': this.x,
            'y': this.y,
            'hp': this.maxHP,
        }
        if (includePersonal) {
            data['distance'] = this.distance;
            data['cooldown'] = this.cooldown;
            data['inventory'] = this.getNetworkInventory();
        }
        return data;
    }

    getNetworkInventory(): NetworkInventory[] {
        // Map every item to its network data
        return [...this.inventory.entries()].map(([item, quantity]) => {
            return {
                'item': item.getNetworkData(),
                'quantity': quantity
            }
        });
    }

    canMoveTo(x: number, y: number) {
        // Check if (x, y) is within a circle of radius `this.distance` from (this.gridX, this.gridY)
        return Math.pow(x - this.x, 2) + Math.pow(y - this.y, 2) <= Math.pow(this.distance, 2);
    }

    isNextTo(x: number, y: number) {
        return (Math.abs(x - this.x) <= 1 && Math.abs(y - this.y) <= 1);
    }

    isAlive() {
        return this.hp > 0;
    }

    updatePos(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    distanceTo(x: number, y: number) {
        return Math.sqrt(Math.pow(x - this.x, 2) + Math.pow(y - this.y, 2));
    }

    dealDamage(damage: number) {
        this.hp -= damage;
        if (this.hp < 0) {
            this.hp = 0;
        }
    }

    getHP() {
        return this.hp;
    } 

    getCooldown(action: ActionType): number {
        return this.cooldowns[action];
    }
    
    setCooldown(duration: number) {
        this.canAct = false;
        this.cooldown = duration;
        if (this.cooldownTimer) {
            clearTimeout(this.cooldownTimer);
        }
        this.cooldownTimer = setTimeout(() => {
            this.canAct = true;
        }, duration);
    }

    setTeam(team: Team) {
        this.team = team;
    }

    addItem(item: Item, quantity: number) {
        const currentQuantity = this.inventory.get(item) || 0;
        this.inventory.set(item, currentQuantity + quantity);
    }
}

interface playerNetworkData {
    frame: string;
    x: number;
    y: number;
    hp: number;
    distance?: number;
    cooldown?: number;
    inventory?: NetworkInventory[];
}

interface NetworkInventory {
    item: NetworkItem;
    quantity: number;
}