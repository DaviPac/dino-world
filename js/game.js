const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: true
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

let player;
let cursors;
let map;
let lastDirection = 'down'

function preload() {
    this.load.image('tiles_terreno', 'assets/terreno.png');
    this.load.tilemapTiledJSON('mapa_mundo', 'assets/mapa.json');
    this.load.spritesheet('player_idle', 'assets/char/idle.png', {
        frameWidth: 32,
        frameHeight: 32
    });
    this.load.spritesheet('player_walk', 'assets/char/walk.png', {
        frameWidth: 32,
        frameHeight: 32
    });
}

function create() {
    map = this.make.tilemap({ key: 'mapa_mundo' });
    const tileset = map.addTilesetImage('topdown-tileset', 'tiles_terreno');
    const chaoLayer = map.createLayer('Chao', tileset, 0, 0);
    chaoLayer.setCollisionByProperty({ collides: true });

    player = this.physics.add.sprite(100, 100, 'personagem');
    const acimaLayer = map.createLayer('Acima', tileset, 0, 0);
    // Por algum motivo só funciona com try/catch :o
    try {
        acimaLayer.setCollision([178]);
    } catch (error) { }
    player.setCollideWorldBounds(true);
    player.setSize(12, 20);
    player.setScale(1.5);
    
    this.anims.create({
        key: 'walk_down',
        frames: this.anims.generateFrameNumbers('player_walk', { start: 0, end: 5 }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'walk_up',
        frames: this.anims.generateFrameNumbers('player_walk', { start: 6, end: 11 }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'walk_left',
        frames: this.anims.generateFrameNumbers('player_walk', { start: 12, end: 17 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'idle_down',
        frames: this.anims.generateFrameNumbers('player_idle', { start: 0, end: 3 }),
        frameRate: 5,
        repeat: -1
    });
    this.anims.create({
        key: 'idle_up',
        frames: this.anims.generateFrameNumbers('player_idle', { start: 4, end: 7 }),
        frameRate: 5,
        repeat: -1
    });
    this.anims.create({
        key: 'idle_left',
        frames: this.anims.generateFrameNumbers('player_idle', { start: 8, end: 11 }),
        frameRate: 5,
        repeat: -1
    });

    cursors = this.input.keyboard.createCursorKeys();

    this.physics.add.collider(player, chaoLayer);
    this.physics.add.collider(player, acimaLayer);
}

function update() {
    let isMoving = false;

    player.setVelocity(0);

    // Movimento Horizontal
    if (!cursors.left.isDown && lastDirection != 'left') player.flipX = false;
    if (cursors.left.isDown) {
        player.setVelocityX(-160);
        player.flipX = true; // Espelha o sprite para a esquerda
        lastDirection = 'left';
        isMoving = true;
    } else if (cursors.right.isDown) {
        player.setVelocityX(160);
        player.flipX = false;
        lastDirection = 'right';
        isMoving = true;
    }

    // Movimento Vertical
    if (cursors.up.isDown) {
        player.setVelocityY(-160);
        lastDirection = 'up';
        isMoving = true;
    } else if (cursors.down.isDown) {
        player.setVelocityY(160);
        lastDirection = 'down';
        isMoving = true;
    }
    
    // Lógica de Animação
    if (isMoving) {
        if (lastDirection === 'left' || lastDirection === 'right') {
            player.anims.play('walk_left', true);
        } else if (lastDirection === 'up') {
            player.anims.play('walk_up', true);
        } else if (lastDirection === 'down') {
            player.anims.play('walk_down', true);
        }
    } else {
        if (lastDirection === 'left' || lastDirection === 'right') {
            player.anims.play('idle_left', true);
        } else if (lastDirection === 'up') {
            player.anims.play('idle_up', true);
        } else if (lastDirection === 'down') {
            player.anims.play('idle_down', true);
        }
    }
}