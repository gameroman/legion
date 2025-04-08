interface VFXConfig {
    frameRate?: number;
    yoffset?: number;
    xoffset?: number;
    scale?: number;
    shake?: boolean;
}

export const VFXconfig: Record<string, VFXConfig>    = {
    fire_1_explosion: {
        frameRate: 30,
        yoffset: 100,
    },
    fire_2_explosion: {
        yoffset: 100,
        frameRate: 30,
        xoffset: -25,
    },
    fire_3_explosion: {
        frameRate: 30,
        shake: true,
        yoffset: 100,
    },
    fireball_1: {
        scale: 0.2,
        frameRate: 30,
    },
    fireball_2: {
        scale: 0.2,
        frameRate: 30,
    },
    fireball_3: {
        scale: 0.2,
        frameRate: 30,
    },
    potion_heal: {
        scale: 2,
    }
}

export const fireLevels = [1,2,3];
export const terrainFireLevels = [1];
export const chargedFireLevels = [1,2];