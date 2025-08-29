import GameObject from "./GameObject.js";

export default class CollectableObject extends GameObject {
    constructor(scene, x, y, sprite, collectableItem, frame = 0) {
        super(scene, x, y, sprite, frame);
        this.collectableItem = collectableItem;
        scene.physics.add.overlap(scene.player, this, () => this.collect(scene.player), null, scene);
        this.setDepth(5);
        this.setSize(20, 20);
        this.collectable = true;
    }

    collect(user) {
        if (user.inventory.items.length >= user.inventory.limit) return;
        user.inventory.items.push(new this.collectableItem());
        let index = this.scene.objects.indexOf(this);
        if (index !== -1) this.scene.objects.splice(index, 1);
        this.destroy();
    }
}