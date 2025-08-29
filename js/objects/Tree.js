import GameObject from "./GameObject.js";
import WoodLog from "./WoodLog.js";

export default class Tree extends GameObject {
    constructor(scene, x, y) {
        super(scene, x, y, 'tree', 3);
        this.body.setSize(20, 15).setOffset(6, 33);
        this.collide = true;
        this.hp = 3;
        this.setDepth(y + 15);
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

        if (this.hp == 0) {
            this.setFrame(4);
            let offsetX = Phaser.Math.Between(-20, 20);
            let offsetY = Phaser.Math.Between(10, 25);
            let dropX = this.x + offsetX;
            let dropY = this.y + offsetY;

            this.scene.objects.push(new WoodLog(this.scene, dropX, dropY));
        }
    }
}