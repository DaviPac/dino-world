import Entity from "./Entity.js";
import WoodLog from "./WoodLog.js";

export default class Tree extends Entity {
    constructor(scene, x, y) {
        super(scene, x, y, 'tree', 3);
        this.body.setSize(20, 15).setOffset(6, 33);
        this.collide = true;
        scene.physics.add.collider(scene.player, this);
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
            this.drop(WoodLog, 3);
        }
    }
}