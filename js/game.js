const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,       // mantém proporção, comprime se precisar
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 980,                  // resolução base
        height: 580                  // resolução base
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
let lastDirection = 'down';
let dpadState = { up: false, down: false, left: false, right: false };
let speed = 160;

function preload() {
    this.load.image('tiles_terreno', 'assets/terreno.png');
    this.load.tilemapTiledJSON('mapa_mundo', 'assets/mapa.json');
    this.load.spritesheet('player_idle', 'assets/char/Idle.png', {
        frameWidth: 32,
        frameHeight: 32
    });
    this.load.spritesheet('player_walk', 'assets/char/Walk.png', {
        frameWidth: 32,
        frameHeight: 32
    });
    this.load.spritesheet('tree', 'assets/tree.png', {
        frameWidth: 32,
        frameHeight: 48
    });
    this.load.image('dpad', 'assets/dpad.png');

    this.load.audio('bg_music_1', 'assets/sounds/overworld/bg_music_1.ogg');
}

function create() {
    if (this.sys.game.device.input.touch) {

        // 1. Posição base do D-Pad na tela (canto inferior esquerdo)
        const dpadX = 120;
        const dpadY = 480;

        // 2. Adiciona a imagem visual do D-Pad
        const dpadImage = this.add.image(dpadX, dpadY, 'dpad');
        dpadImage.setScrollFactor(0); // Prende na tela
        dpadImage.setAlpha(0.7); // Deixa um pouco transparente
        dpadImage.setDepth(30); // Garante que fique acima de tudo

        // 3. Cria as zonas de toque (retângulos invisíveis)
        const hitAreaSize = 60;
        const hitAreaOffset = 50;

        const hitAreaUp = this.add.rectangle(dpadX, dpadY - hitAreaOffset, hitAreaSize, hitAreaSize);
        const hitAreaDown = this.add.rectangle(dpadX, dpadY + hitAreaOffset, hitAreaSize, hitAreaSize);
        const hitAreaLeft = this.add.rectangle(dpadX - hitAreaOffset, dpadY, hitAreaSize, hitAreaSize);
        const hitAreaRight = this.add.rectangle(dpadX + hitAreaOffset, dpadY, hitAreaSize, hitAreaSize);

        // 4. Configura cada zona de toque
        const zones = [hitAreaUp, hitAreaDown, hitAreaLeft, hitAreaRight];
        const directions = ['up', 'down', 'left', 'right'];

        zones.forEach((zone, index) => {
            zone.setScrollFactor(0);
            zone.setDepth(31);
            zone.setInteractive();

            zone.on('pointerdown', () => {
                dpadState[directions[index]] = true;
            });
            zone.on('pointerup', () => {
                dpadState[directions[index]] = false;
            });
            zone.on('pointerout', () => {
                dpadState[directions[index]] = false;
            });
        });

    }
    map = this.make.tilemap({ key: 'mapa_mundo' });
    const tileset = map.addTilesetImage('topdown-tileset', 'tiles_terreno');
    const chaoLayer = map.createLayer('Chao', tileset, 0, 0);
    chaoLayer.setDepth(5);
    try {
        chaoLayer.setCollision([9, 11, 21, 36, 45, 46, 48]);
    } catch (error) { }

    player = this.physics.add.sprite(100, 100, 'personagem');
    player.setDepth(10);
    tree = this.physics.add.sprite(200, 200, 'tree', 3);
    tree.setImmovable(true);
    tree.setScale(1.5);
    tree.body.setSize(20, 35).setOffset(6, 12);
    tree.setDepth(10);

    const acimaLayer = map.createLayer('Acima', tileset, 0, 0);
    acimaLayer.setDepth(20);
    // Por algum motivo só funciona com try/catch :o
    try {
        acimaLayer.setCollision([178]);
    } catch (error) { }
    player.setCollideWorldBounds(true);
    player.setSize(12, 17);
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
    this.physics.add.collider(player, tree);

    const bgMusic = this.sound.add('bg_music_1', { 
        loop: true,
        volume: 1.5
    });
    
    bgMusic.play();
}

function leftKeyPressed() {
    return (cursors.left.isDown || dpadState.left);
}

function rightKeyPressed() {
    return (cursors.right.isDown || dpadState.right);
}

function upKeyPressed() {
    return (cursors.up.isDown || dpadState.up);
}

function downKeyPressed() {
    return (cursors.down.isDown || dpadState.down);
}

function update() {
    let isMoving = false;

    player.setVelocity(0);

    // Movimento Horizontal
    if (!leftKeyPressed() && lastDirection != 'left') player.flipX = false;
    if (leftKeyPressed() && !rightKeyPressed()) {
        let xSpeed = (upKeyPressed() || downKeyPressed()) ? Math.sqrt(2) / 2 * speed : speed;
        player.setVelocityX(-xSpeed);
        if (!upKeyPressed() && !downKeyPressed()) {
            lastDirection = 'left';
            player.flipX = true; // Espelha o sprite para a esquerda
        }
        isMoving = true;
    } else if (rightKeyPressed() && !leftKeyPressed()) {
        let xSpeed = (upKeyPressed() || downKeyPressed()) ? Math.sqrt(2) / 2 * speed : speed;
        player.setVelocityX(xSpeed);
        if (!upKeyPressed() && !downKeyPressed()) {
            lastDirection = 'right';
            player.flipX = false;
        }
        isMoving = true;
    }

    // Movimento Vertical
    if (upKeyPressed() && !downKeyPressed()) {
        let ySpeed = (leftKeyPressed() || rightKeyPressed()) ? Math.sqrt(2) / 2 * speed : speed;
        player.setVelocityY(-ySpeed);
        if (!isMoving) lastDirection = 'up';
        isMoving = true;
    } else if (downKeyPressed() && !upKeyPressed()) {
        let ySpeed = (leftKeyPressed() || rightKeyPressed()) ? Math.sqrt(2) / 2 * speed : speed;
        player.setVelocityY(ySpeed);
        if (!isMoving) lastDirection = 'down';
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