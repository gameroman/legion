
export class EffectModifier {
    stat;
    value;
    direction;

    constructor(stat, value, direction) {
        this.stat = stat;
        this.value = value;
        this.direction = direction;
    }
}

export class EffectModifiers {
    casterModifier;
    targetModifier;

    constructor(casterModifier, targetModifier) {
        this.casterModifier = casterModifier;
        this.targetModifier = targetModifier;
    }
}

export enum EffectDirection {
    PLUS,
    MINUS
}

export class Spell {
    id;
    name;
    description;
    cost;
    target;
    effects;
    frame;

    constructor(id, name, description, frame, cost, target, effects) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.frame = frame;
        this.cost = cost;
        this.target = target;
        this.effects = effects;
    }
}