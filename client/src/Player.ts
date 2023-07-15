export class Player extends Phaser.GameObjects.Container {
    sprite;
    numKey;

    constructor(scene, x, y, num, texture, isPlayer) {
        super(scene, x, y);

        // Create the sprite using the given key and add it to the container
        this.sprite = scene.add.sprite(0, 0, texture);
        this.add(this.sprite);

        // Create a text object to display the player's name and score, and add it to the container
        if (isPlayer) {
            this.numKey = scene.add.text(30, 70, num, { fontSize: '16px', color: '#fff', stroke: '#000', strokeThickness: 3 }).setOrigin(1,1);
            this.add(this.numKey);
        } else {
            this.sprite.flipX = true;
        }

        // Add the container to the scene
        scene.add.existing(this);
        this.setDepth(3);

        this.sprite.play(`${texture}_anim`);
    }
}
