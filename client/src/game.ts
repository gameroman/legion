import * as Phaser from 'phaser';
import { HUD } from './HUD';
import { Arena } from './Arena';

const config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    backgroundColor: '#2d2d2d',
    parent: 'scene',
    pixelArt: true,
    scene: [Arena, HUD]
};

const game = new Phaser.Game(config);