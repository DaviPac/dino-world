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

        this.speed = 160;
        this.lastDirection = 'down';
    }

    createAnims() {
        this.anims.create({ key: 'walk_down', frames: this.anims.generateFrameNumbers('player_walk', { start: 0, end: 5 }), frameRate: 10, repeat: -1 });
        this.anims.create({ key: 'walk_up', frames: this.anims.generateFrameNumbers('player_walk', { start: 6, end: 11 }), frameRate: 10, repeat: -1 });
        this.anims.create({ key: 'walk_side', frames: this.anims.generateFrameNumbers('player_walk', { start: 12, end: 17 }), frameRate: 10, repeat: -1 });
        this.anims.create({ key: 'idle_down', frames: this.anims.generateFrameNumbers('player_idle', { start: 0, end: 3 }), frameRate: 5, repeat: -1 });
        this.anims.create({ key: 'idle_up', frames: this.anims.generateFrameNumbers('player_idle', { start: 4, end: 7 }), frameRate: 5, repeat: -1 });
        this.anims.create({ key: 'idle_side', frames: this.anims.generateFrameNumbers('player_idle', { start: 8, end: 11 }), frameRate: 5, repeat: -1 });
    }

    update(cursors, dpadState) {
        this.setVelocity(0);

        const leftPressed = cursors.left.isDown || dpadState.left;
        const rightPressed = cursors.right.isDown || dpadState.right;
        const upPressed = cursors.up.isDown || dpadState.up;
        const downPressed = cursors.down.isDown || dpadState.down;

        let isMoving = false;

        this.setVelocity(0);

        // Movimento Horizontal
        if (!leftPressed && this.lastDirection != 'left') this.flipX = false;
        if (leftPressed && !rightPressed) {
            this.setVelocityX(-this.speed);
            if (!upPressed && !downPressed) {
                this.lastDirection = 'left';
                this.flipX = true; // Espelha o sprite para a esquerda
            }
            isMoving = true;
        } else if (rightPressed && !leftPressed) {
            this.setVelocityX(this.speed);
            if (!upPressed && !downPressed) {
                this.lastDirection = 'right';
                this.flipX = false;
            }
            isMoving = true;
        }

        // Movimento Vertical
        if (upPressed && !downPressed) {
            this.setVelocityY(-this.speed);
            if (!isMoving) this.lastDirection = 'up';
            isMoving = true;
        } else if (downPressed && !upPressed) {
            this.setVelocityY(this.speed);
            if (!isMoving) this.lastDirection = 'down';
            isMoving = true;
        }

        this.body.velocity.normalize().scale(this.speed);
        this.updateAnims(leftPressed || rightPressed || upPressed || downPressed);

    }

    updateAnims(isMoving) {
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