import WoodLog from "./WoodLog.js";

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
        this.hp = 3;
    }

    onAxeHit() {
        this.hp--;

        this.scene.tweens.add({
            targets: this,
            x: this.x + 1,
            y: this.y,
            duration: 40,
            yoyo: true,
            repeat: 2
        });

        this.scene.sound.play('axe-tree', { volume: 0.8 });

        if (this.hp <= 0) {
            this.setFrame(4);
            this.setSize(20, 25).setOffset(6, 37);
            let offsetX = Phaser.Math.Between(-20, 20);
            let offsetY = Phaser.Math.Between(10, 25);
            let dropX = this.x + offsetX;
            let dropY = this.y + offsetY;

            this.scene.objects.push(new WoodLog(this.scene, dropX, dropY));
        }
    }
}