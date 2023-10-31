import { Target, Effect, ItemData } from "./types";

export class BaseItem {
    id: number;
    name: string;
    description: string;
    frame: string;
    effects: Effect[];
    target: Target;
    cooldown: number;
    animation: string;
    sfx: string;
    size: number = 1;
    price: number = 0;

    constructor(props: ItemData) {
        Object.assign(this, props);
    }
}
