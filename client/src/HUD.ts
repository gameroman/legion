export class HUD extends Phaser.Scene
{
    Arena;

    constructor() {
        super({ key: 'HUD' });
    }

    create() {
        this.Arena = this.scene.get('Arena'); 

        // this.cameras.main.setZoom(1);
    }
}