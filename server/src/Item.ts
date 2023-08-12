import { ServerPlayer } from "./ServerPlayer";

export enum Stat {
    HP
}

export interface Effect {
    stat: Stat;
    value: number;
}

export enum Target {
    SELF
}

export interface NetworkItem {
    id: number;
    name: string;
    description: string;
    frame: string;
    effects: NetworkItemEffect[];
    target: string;
    cooldown: number;
}

interface NetworkItemEffect {
    stat: string;
    value: number;
}

export class Item {
    id: number;
    name: string;
    description: string;
    frame: string;
    effects: Effect[];
    target: Target;
    cooldown: number;

    constructor(
        id: number, name: string, description: string, frame: string, 
        cooldown: number, target: Target, effects: Effect[]
    ) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.frame = frame;
        this.target = target;
        this.effects = effects;
        this.cooldown = cooldown;
    }

    getNetworkData(): NetworkItem {
        const effects = this.effects.map(effect => {
            return {
                'stat': Stat[effect.stat],
                'value': effect.value
            }
        });
        return {
            'id': this.id,
            'name': this.name,
            'frame': this.frame,
            'description': this.description,
            'effects': effects,
            'target': Target[this.target],
            'cooldown': this.cooldown
        }
    }

    applyEffect(target: ServerPlayer) {
        this.effects.forEach(effect => {
            switch (effect.stat) {
                case Stat.HP:
                    target.heal(effect.value);
                    break;
            }
        });
    }
}