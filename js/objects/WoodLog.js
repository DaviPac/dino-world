import WoodLogItem from "./items/WoodLog.js";

export default class WoodLog extends Phaser.Physics.Arcade.Sprite {
    static nextId = 1;

    constructor(scene, x, y) {
        super(scene, x, y, 'basic-tools-icons', 0);
        this.scene = scene;
        scene.add.existing(this);
        scene.physics.add.existing(this);
        scene.physics.add.overlap(scene.player, this, () => this.collect(scene.player), null, scene);
        this.setDepth(5);
        this.setSize(20, 20);
        this.collectable = true;
        this.id = WoodLog.nextId++;
    }

    collect(user) {
        user.inventory.items.push(new WoodLogItem());
        let index = this.scene.objects.indexOf(this);
        if (index !== -1) this.scene.objects.splice(index, 1);
        this.destroy();
    }
}