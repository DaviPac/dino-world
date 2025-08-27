export default class Tree extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'tree', 3);
        this.scene = scene;
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setImmovable(true);
        this.body.setSize(20, 39).setOffset(6, 23);
        this.setDepth(10);
        this.collide = true;
    }

    onAxeHit() {
        this.setFrame(4);
    }
}