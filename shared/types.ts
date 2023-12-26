export enum Stat {
    HP,
    MP,
    ATK,
    DEF,
    SPATK,
    SPDEF,
    NONE
}

export enum Target {
    SELF,
    AOE,
    SINGLE
}

export enum EffectDirection {
    PLUS,
    MINUS,
}

export class EffectModifier {
    stat;
    value;
    direction;

    constructor(stat: Stat, value: number, direction: EffectDirection) {
        this.stat = stat;
        this.value = value;
        this.direction = direction;
    }
}

export class EffectModifiers {
    casterModifier;
    targetModifier;

    constructor(casterModifier: EffectModifier, targetModifier: EffectModifier) {
        this.casterModifier = casterModifier;
        this.targetModifier = targetModifier;
    }
}

export interface Effect {
    stat: Stat;
    value: number;
    modifiers?: EffectModifiers;
    onKO?: boolean;
}


export interface SpellData {
    id: number;
    name: string;
    description: string;
    frame: string;
    sfx: string;
    animation: string;
    cooldown: number;
    castTime: number;
    cost: number;
    target: Target;
    size: number;
    effects: Effect[];
    shake: boolean;
    score: number;
    yoffset?: number;
}

export interface ItemData {
    id: number;
    name: string;
    description: string;
    frame: string;
    sfx: string;
    animation: string;
    cooldown: number;
    target: Target;
    size: number;
    effects: Effect[];
    price: number;
}

export enum Class {
    WARRIOR,
    WHITE_MAGE,
    BLACK_MAGE,
    THIEF
}