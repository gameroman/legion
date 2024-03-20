import { Target, Rarity } from "./enums";
import { Effect, ConsumableData } from "./interfaces";


export class BaseItem {
    id: number = -1;
    name: string = '';
    description: string = '';
    frame: string = '';
    effects: Effect[] = [];
    target: Target = Target.SINGLE;
    cooldown: number = 0;
    animation: string = '';
    sfx: string = '';
    size: number = 1;
    price: number = 0;
    rarity: Rarity = Rarity.COMMON;

    constructor(props: ConsumableData) {
        Object.assign(this, props);
    }
}
