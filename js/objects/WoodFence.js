import GameObject from "./GameObject.js";

export default class WoodFence extends GameObject {
    constructor(scene, x, y) {
        super(scene, x, y, 'fence-wood', 25);
        this.body.setSize(10, 12).setOffset(3, 5);
        this.collide = true;
        //this.hp = 3;
        scene.physics.add.collider(scene.player, this);
        this.setDepth(y - 2);
    }
}