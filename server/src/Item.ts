export enum Stat {
    HP
}

export interface ItemEffect {
    stat: Stat;
    value: number;
}

export interface NetworkItem {
    id: number;
    name: string;
    description: string;
    frame: string;
    effects: NetworkItemEffect[];
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
    effects: ItemEffect[];

    constructor(id: number, name: string, description: string, frame: string, effects: ItemEffect[]) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.frame = frame;
        this.effects = effects;
    }

    getNetworkData(): NetworkItem {
        const effectsStrings = {
            [Stat.HP]: 'HP'
        };
        const effects = this.effects.map(effect => {
            return {
                'stat': effectsStrings[effect.stat],
                'value': effect.value
            }
        });
        return {
            'id': this.id,
            'name': this.name,
            'frame': this.frame,
            'description': this.description,
            'effects': effects
        }
    }
}