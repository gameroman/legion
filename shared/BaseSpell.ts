import { Target, Effect, SpellData } from "./types";

export class BaseSpell {
    id: number = -1;
    name: string = '';
    description: string = '';
    cost: number = 0;
    target: Target = Target.SINGLE;
    effects: Effect[] = [];
    frame: string = '';
    animation: string = '';
    size: number = 0;
    cooldown: number = 0;
    castTime: number = 0;
    shake: boolean = false;
    sfx: string = '';
    score: number= 0;
    
    constructor(props: SpellData) {
        Object.assign(this, props);
    }
}