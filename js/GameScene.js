import Player from "./Player.js";

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {
        this.load.image('tiles_terreno', 'assets/sprites/pack/farm/Tileset/Modular/tileset-grass-spring.png');
        this.load.image('tiles_ground', 'assets/sprites/pack/farm/Tileset/Modular/Ground.png');
        this.load.tilemapTiledJSON('mapa_mundo', 'assets/maps/map/map1.json');
        this.load.spritesheet('player_idle', 'assets/sprites/pack/char/Character/Pre-made/Josh/Idle.png', {
            frameWidth: 32,
            frameHeight: 32
        });
        this.load.spritesheet('player_walk', 'assets/sprites/pack/char/Character/Pre-made/Josh/Walk.png', {
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

    create() {
        this.dpadState = { up: false, down: false, left: false, right: false };
        if (this.sys.game.device.input.touch) {

            const dpadX = 120;
            const dpadY = 480;

            const dpadImage = this.add.image(dpadX, dpadY, 'dpad');
            dpadImage.setScrollFactor(0);
            dpadImage.setAlpha(0.7);
            dpadImage.setDepth(30);

            const hitAreaSize = 60;
            const hitAreaOffset = 50;

            const hitAreaUp = this.add.rectangle(dpadX, dpadY - hitAreaOffset, hitAreaSize, hitAreaSize);
            const hitAreaDown = this.add.rectangle(dpadX, dpadY + hitAreaOffset, hitAreaSize, hitAreaSize);
            const hitAreaLeft = this.add.rectangle(dpadX - hitAreaOffset, dpadY, hitAreaSize, hitAreaSize);
            const hitAreaRight = this.add.rectangle(dpadX + hitAreaOffset, dpadY, hitAreaSize, hitAreaSize);

            const zones = [hitAreaUp, hitAreaDown, hitAreaLeft, hitAreaRight];
            const directions = ['up', 'down', 'left', 'right'];

            zones.forEach((zone, index) => {
                zone.setScrollFactor(0);
                zone.setDepth(31);
                zone.setInteractive();

                zone.on('pointerdown', () => {
                    this.dpadState[directions[index]] = true;
                });
                zone.on('pointerover', (pointer) =>
                {
                    if (pointer.isDown) {
                        this.dpadState[directions[index]] = true;
                    }
                });
                zone.on('pointerup', () => {
                    this.dpadState[directions[index]] = false;
                });
                zone.on('pointerout', () => {
                    this.dpadState[directions[index]] = false;
                });
            });

        }

        this.map = this.make.tilemap({ key: 'mapa_mundo' });
        const tileset1 = this.map.addTilesetImage('Tileset Grass Spring', 'tiles_terreno');
        const tileset2 = this.map.addTilesetImage('Ground', 'tiles_ground');
        const aguaLayer = this.map.createLayer('Camada de Blocos 2', [tileset1, tileset2], 0, 0);
        aguaLayer.setDepth(1);
        const chaoLayer = this.map.createLayer('Camada de Blocos 1', [tileset1, tileset2], 0, 0);
        chaoLayer.setDepth(5);
        try {
            chaoLayer.setCollision([11, 12, 31, 60, 396, 439, 444, 466, 468]);
        } catch (error) { }

        this.player = new Player(this, 100, 100);
        this.player.createAnims();

        let tree = this.physics.add.sprite(200, 120, 'tree', 3);
        tree.setImmovable(true);
        tree.body.setSize(20, 39).setOffset(6, 23);
        tree.setDepth(10);

        this.cursors = this.input.keyboard.createCursorKeys();

        this.physics.add.collider(this.player, chaoLayer);
        this.physics.add.collider(this.player, tree);

        const bgMusic = this.sound.add('bg_music_1', { 
            loop: true,
            volume: 1.5
        });
        
        bgMusic.play();
    }

    update() {
        if (this.player) {
            this.player.update(this.cursors, this.dpadState);
        }
    }
}