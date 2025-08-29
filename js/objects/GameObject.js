export default class GameObject extends Phaser.Physics.Arcade.Sprite {
    static nextId = 1;

    constructor(scene, x, y, sprite, frame = 0) {
        super(scene, x, y, sprite, frame);
        this.scene = scene;
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setImmovable(true);
        this.setDepth(y + (this.displayHeight / 2));
        this.id = GameObject.nextId++;
    }
}