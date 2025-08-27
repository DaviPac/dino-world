import Axe from "./items/axe.js";
import FishingRod from "./items/FishingRod.js";

export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'player_idle');

        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        this.setCollideWorldBounds(true);
        this.setScale(1.3);
        this.setSize(12, 7).setOffset(10, 19);
        this.setDepth(10);

        this.speed = 80;
        this.lastDirection = 'down';
        this.isAttacking = false;
        this.axeHit = false;
        this.axe = false;
        this.hasHit = false;
        this.canMove = true;

        this.inventory = [new Axe(), new FishingRod()];
        this.inventoryIndex = 0;

        Object.defineProperty(this, "facing", {
            get: () => this.lastDirection,
            set: (value) => { this.lastDirection = value; }
        });
        Object.defineProperty(this, "equippedItem", {
            get: () => this.inventory[this.inventoryIndex],
            set: (value) => { this.inventory[this.inventoryIndex] = value }
        });
    }

    useEquippedItem() {
        if (!this.isAttacking && this.inventory[this.inventoryIndex] && this.inventory[this.inventoryIndex].use) {
            this.inventory[this.inventoryIndex].use(this);
        }
    }

    swingAxe() {
        this.isAttacking = true;
        this.setVelocity(0);

        let animKey = 'axe_down';
        if (this.lastDirection === 'left' || this.lastDirection === 'right') {
            animKey = 'axe_side';
        } else if (this.lastDirection === 'up') {
            animKey = 'axe_up';
        }
        
        this.anims.play(animKey, true);

        this.removeAllListeners('animationupdate');

        this.on('animationupdate', (anim, frame) => {
            if (frame.index === 3) {
                this.axeHit = true;
            }
        }, this);

        this.once('animationcomplete', () => {
            this.isAttacking = false;
            this.axeHit = false;
            this.removeAllListeners('animationupdate');
        });
    }

    fish() {
        this.isAttacking = true;
        this.setVelocity(0);

        let animKey = 'fish_down';
        if (this.lastDirection === 'left' || this.lastDirection === 'right') {
            animKey = 'fish_side';
        } else if (this.lastDirection === 'up') {
            animKey = 'fish_up';
        }
        
        this.anims.play(animKey, true);

        this.removeAllListeners('animationupdate');

        this.once('animationcomplete', () => {
            this.removeAllListeners('animationupdate');
            this.catchFish();
        });
    }

    catchFish() {

        let animKey = 'catch_fish_down';
        if (this.lastDirection === 'left' || this.lastDirection === 'right') {
            animKey = 'catch_fish_side';
        } else if (this.lastDirection === 'up') {
            animKey = 'catch_fish_up';
        }
        
        this.anims.play(animKey, true);

        this.removeAllListeners('animationupdate');

        this.once('animationcomplete', () => {
            this.isAttacking = false;
            this.removeAllListeners('animationupdate');
        });
    }

    update(cursors, dpadState) {
        if (this.isAttacking) {
            this.setVelocity(0);
            return;
        }

        const leftPressed = cursors.left.isDown || dpadState.left;
        const rightPressed = cursors.right.isDown || dpadState.right;
        const upPressed = cursors.up.isDown || dpadState.up;
        const downPressed = cursors.down.isDown || dpadState.down;
        const usePressed = cursors.space.isDown || dpadState.use;
        const onePressed = cursors.one.isDown;
        const twoPressed = cursors.two.isDown;

        if (onePressed) this.inventoryIndex = 0;
        if (twoPressed) this.inventoryIndex = 1;

        if (usePressed) this.useEquippedItem();

        let isMoving = false;

        this.setVelocity(0);

        // Movimento Horizontal
        if (!leftPressed && this.lastDirection != 'left') this.flipX = false;
        if (leftPressed && !rightPressed && this.canMove) {
            this.setVelocityX(-this.speed);
            if (!upPressed && !downPressed) {
                this.lastDirection = 'left';
                this.flipX = true; // Espelha o sprite para a esquerda
            }
            isMoving = true;
        } else if (rightPressed && !leftPressed && this.canMove) {
            this.setVelocityX(this.speed);
            if (!upPressed && !downPressed) {
                this.lastDirection = 'right';
                this.flipX = false;
            }
            isMoving = true;
        }

        // Movimento Vertical
        if (upPressed && !downPressed && this.canMove) {
            this.setVelocityY(-this.speed);
            if (!isMoving) this.lastDirection = 'up';
            isMoving = true;
        } else if (downPressed && !upPressed && this.canMove) {
            this.setVelocityY(this.speed);
            if (!isMoving) this.lastDirection = 'down';
            isMoving = true;
        }

        if (usePressed && this.canMove) {
            if (this.equippedItem && this.equippedItem.use) this.equippedItem.use(this);
        }

        this.body.velocity.normalize().scale(this.speed);
        this.updateAnims(isMoving);

    }

    createAnims() {
        this.anims.create({ key: 'walk_down', frames: this.anims.generateFrameNumbers('player_walk', { start: 0, end: 5 }), frameRate: 10, repeat: -1 });
        this.anims.create({ key: 'walk_up', frames: this.anims.generateFrameNumbers('player_walk', { start: 6, end: 11 }), frameRate: 10, repeat: -1 });
        this.anims.create({ key: 'walk_side', frames: this.anims.generateFrameNumbers('player_walk', { start: 12, end: 17 }), frameRate: 10, repeat: -1 });

        this.anims.create({ key: 'idle_down', frames: this.anims.generateFrameNumbers('player_idle', { start: 0, end: 3 }), frameRate: 5, repeat: -1 });
        this.anims.create({ key: 'idle_up', frames: this.anims.generateFrameNumbers('player_idle', { start: 4, end: 7 }), frameRate: 5, repeat: -1 });
        this.anims.create({ key: 'idle_side', frames: this.anims.generateFrameNumbers('player_idle', { start: 8, end: 11 }), frameRate: 5, repeat: -1 });

        this.anims.create({ key: 'axe_down', frames: this.anims.generateFrameNumbers('player_axe', { start: 0, end: 5 }), frameRate: 5, repeat: 0 });
        this.anims.create({ key: 'axe_up', frames: this.anims.generateFrameNumbers('player_axe', { start: 6, end: 11 }), frameRate: 5, repeat: 0 });
        this.anims.create({ key: 'axe_side', frames: this.anims.generateFrameNumbers('player_axe', { start: 12, end: 17 }), frameRate: 5, repeat: 0 });

        this.anims.create({ key: 'fish_down', frames: this.anims.generateFrameNumbers('player_fish_idle', { start: 0, end: 3 }), frameRate: 3, repeat: 3 });
        this.anims.create({ key: 'fish_up', frames: this.anims.generateFrameNumbers('player_fish_idle', { start: 4, end: 7 }), frameRate: 3, repeat: 3 });
        this.anims.create({ key: 'fish_side', frames: this.anims.generateFrameNumbers('player_fish_idle', { start: 8, end: 11 }), frameRate: 3, repeat: 3 });

        this.anims.create({ key: 'catch_fish_down', frames: this.anims.generateFrameNumbers('player_fish_captured', { start: 0, end: 3 }), frameRate: 3, repeat: 0 });
        this.anims.create({ key: 'catch_fish_up', frames: this.anims.generateFrameNumbers('player_fish_captured', { start: 4, end: 7 }), frameRate: 3, repeat: 0 });
        this.anims.create({ key: 'catch_fish_side', frames: this.anims.generateFrameNumbers('player_fish_captured', { start: 8, end: 11 }), frameRate: 3, repeat: 0 });
    }

    updateAnims(isMoving) {
        if (this.isAttacking) return;
        if (isMoving) {
            if (this.lastDirection === 'left' || this.lastDirection === 'right') {
                this.anims.play('walk_side', true);
            } else if (this.lastDirection === 'up') {
                this.anims.play('walk_up', true);
            } else {
                this.anims.play('walk_down', true);
            }
        } else {
            if (this.lastDirection === 'left' || this.lastDirection === 'right') {
                this.anims.play('idle_side', true);
            } else if (this.lastDirection === 'up') {
                this.anims.play('idle_up', true);
            } else {
                this.anims.play('idle_down', true);
            }
        }
    }
}