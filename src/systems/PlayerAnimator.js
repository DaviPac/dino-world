export default class PlayerAnimator {
    constructor(player) {
        this.player = player;
        this.createAnimations();
    }

    createAnimations() {
        this.player.anims.create({ key: 'walk_down', frames: this.player.anims.generateFrameNumbers('player_walk', { start: 0, end: 5 }), frameRate: 10, repeat: -1 });
        this.player.anims.create({ key: 'walk_up', frames: this.player.anims.generateFrameNumbers('player_walk', { start: 6, end: 11 }), frameRate: 10, repeat: -1 });
        this.player.anims.create({ key: 'walk_side', frames: this.player.anims.generateFrameNumbers('player_walk', { start: 12, end: 17 }), frameRate: 10, repeat: -1 });

        this.player.anims.create({ key: 'idle_down', frames: this.player.anims.generateFrameNumbers('player_idle', { start: 0, end: 3 }), frameRate: 5, repeat: -1 });
        this.player.anims.create({ key: 'idle_up', frames: this.player.anims.generateFrameNumbers('player_idle', { start: 4, end: 7 }), frameRate: 5, repeat: -1 });
        this.player.anims.create({ key: 'idle_side', frames: this.player.anims.generateFrameNumbers('player_idle', { start: 8, end: 11 }), frameRate: 5, repeat: -1 });

        this.player.anims.create({ key: 'axe_down', frames: this.player.anims.generateFrameNumbers('player_axe', { start: 0, end: 5 }), frameRate: 5, repeat: 0 });
        this.player.anims.create({ key: 'axe_up', frames: this.player.anims.generateFrameNumbers('player_axe', { start: 6, end: 11 }), frameRate: 5, repeat: 0 });
        this.player.anims.create({ key: 'axe_side', frames: this.player.anims.generateFrameNumbers('player_axe', { start: 12, end: 17 }), frameRate: 5, repeat: 0 });

        this.player.anims.create({ key: 'fish_down', frames: this.player.anims.generateFrameNumbers('player_fish_idle', { start: 0, end: 3 }), frameRate: 3, repeat: 3 });
        this.player.anims.create({ key: 'fish_up', frames: this.player.anims.generateFrameNumbers('player_fish_idle', { start: 4, end: 7 }), frameRate: 3, repeat: 3 });
        this.player.anims.create({ key: 'fish_side', frames: this.player.anims.generateFrameNumbers('player_fish_idle', { start: 8, end: 11 }), frameRate: 3, repeat: 3 });

        this.player.anims.create({ key: 'catch_fish_down', frames: this.player.anims.generateFrameNumbers('player_fish_captured', { start: 0, end: 3 }), frameRate: 3, repeat: 0 });
        this.player.anims.create({ key: 'catch_fish_up', frames: this.player.anims.generateFrameNumbers('player_fish_captured', { start: 4, end: 7 }), frameRate: 3, repeat: 0 });
        this.player.anims.create({ key: 'catch_fish_side', frames: this.player.anims.generateFrameNumbers('player_fish_captured', { start: 8, end: 11 }), frameRate: 3, repeat: 0 });
    }

    update() {
        if (!this.player.body) return;
        if (this.player.isAttacking) return;

        const isMoving = this.player.body.velocity.length() > 0;
        const direction = this.player.lastDirection;

        if (isMoving) {
            if (direction === 'left' || direction === 'right') {
                this.player.anims.play('walk_side', true);
            } else if (direction === 'up') {
                this.player.anims.play('walk_up', true);
            } else {
                this.player.anims.play('walk_down', true);
            }
        } else {
            // Lógica para idle
            if (direction === 'left' || direction === 'right') {
                this.player.anims.play('idle_side', true);
            } else if (direction === 'up') {
                this.player.anims.play('idle_up', true);
            } else {
                this.player.anims.play('idle_down', true);
            }
        }
    }
}