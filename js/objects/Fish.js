import FishItem from "./items/FishItem.js";

export default class Fish extends Phaser.Physics.Arcade.Sprite {
    static nextId = 1;

    constructor(scene, x, y) {
        super(scene, x, y, 'fish-icon');
        this.scene = scene;
        scene.add.existing(this);
        scene.physics.add.existing(this);
        scene.physics.add.overlap(scene.player, this, () => this.collect(scene.player), null, scene);
        this.setDepth(5);
        this.setSize(20, 20);
        this.collectable = true;
        this.id = Fish.nextId++;
    }

    collect(user) {
        if (user.inventory.items.length >= user.inventory.limit) return;
        console.log("COLLECTING");
        user.inventory.items.push(new FishItem());
        let index = this.scene.objects.indexOf(this);
        if (index !== -1) this.scene.objects.splice(index, 1);
        this.destroy();
    }
}