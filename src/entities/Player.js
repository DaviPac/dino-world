import PlayerAnimator from "../systems/PlayerAnimator.js";
import Inventory from "./Inventory.js";
import Axe from "./items/Axe.js";
import FishingRod from "./items/FishingRod.js";

export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, inputHandler) {
        super(scene, x, y, 'player_idle');

        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        this.setCollideWorldBounds(true);
        this.setScale(1.3);
        this.setSize(12, 7).setOffset(10, 19);
        this.setDepth(y);

        this.speed = 80;
        this.lastDirection = 'down';

        this.inventory = new Inventory([new Axe(), new FishingRod()]);

        this.inputHandler = inputHandler;
        this.animator = new PlayerAnimator(this);
    }

    get facing() { return this.lastDirection };

    update() {
        if (this.isAttacking) return;
        this.setDepth(this.y);

        const moveVector = this.inputHandler.moveVector;
        this.setVelocity(moveVector.x * this.speed, moveVector.y * this.speed);

        if (this.inputHandler.inventory1Pressed) this.inventory.setSelectedIndex(0);
        if (this.inputHandler.inventory2Pressed) this.inventory.setSelectedIndex(1);
        if (this.inputHandler.inventory3Pressed) this.inventory.setSelectedIndex(2);
        if (this.inputHandler.inventory4Pressed) this.inventory.setSelectedIndex(3);
        if (this.inputHandler.inventory5Pressed) this.inventory.setSelectedIndex(4);
        if (this.inputHandler.inventory6Pressed) this.inventory.setSelectedIndex(5);
        if (this.inputHandler.inventory7Pressed) this.inventory.setSelectedIndex(6);
        if (this.inputHandler.inventory8Pressed) this.inventory.setSelectedIndex(7);
        if (this.inputHandler.inventory9Pressed) this.inventory.setSelectedIndex(8);

        if (this.inputHandler.usePressed) {
            const item = this.inventory.equippedItem;
            if (item && item.use) {
                item.use(this);
            }
        }

        if (moveVector.length()) {
            if (Math.abs(moveVector.x) > Math.abs(moveVector.y)) {
                this.lastDirection = moveVector.x > 0 ? 'right' : 'left';
            } else if (Math.abs(moveVector.y) > Math.abs(moveVector.x)){
                this.lastDirection = moveVector.y > 0 ? 'down' : 'up';
            }
        }
        
        this.flipX = this.lastDirection === 'left';

        this.animator.update();
    }
}