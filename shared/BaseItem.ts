import { Target, Effect } from "./types";

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

    constructor(
        id: number, name: string, description: string, frame: string, sfx: string, animation: string,
        cooldown: number, target: Target, effects: Effect[]
    ) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.frame = frame;
        this.target = target;
        this.effects = effects;
        this.cooldown = cooldown;
        this.animation = animation;
        this.sfx = sfx;
    }
}
