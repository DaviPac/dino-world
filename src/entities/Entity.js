export default class Entity extends Phaser.Physics.Arcade.Sprite {
    static nextId = 1;

    constructor(scene, x, y, sprite, frame = 0) {
        super(scene, x, y, sprite, frame);
        this.scene = scene;
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setImmovable(true);
        this.setDepth(y + (this.displayHeight / 2));
        this.id = Entity.nextId++;
    }

    drop(drop, ammount = 1) {
        for (let i = 0; i < ammount; i++) {
            let offsetX = Phaser.Math.Between(-20, 20);
            let offsetY = Phaser.Math.Between(10, 25);
            let dropX = this.x + offsetX;
            let dropY = this.y + offsetY;
            
            this.scene.objects.push(new drop(this.scene, dropX, dropY));
        }
    }

    destroy() {
        if (this.scene.objects) {
            let index = this.scene.objects.indexOf(this);
            if (index !== -1) this.scene.objects.splice(index, 1);
            super.destroy();
        }
    }
}