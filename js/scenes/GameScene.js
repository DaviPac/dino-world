import Player from "../objects/Player.js";
import Tree from "../objects/Tree.js";
import { isInCuttingRange } from "../utils/range.js";
import { isMobile } from "../utils/isMobile.js";
import InventoryUI from "../objects/InventoryUI.js";

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.dpadState = {};
        this.objects = [];
        this.musicPlaying = true;
        const temp = localStorage.getItem('music');
        if (temp && temp === "false") this.musicPlaying = false;
    }

    create() {
        if (isMobile(this)) this.createDPad();

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

        this.objects.push(new Tree(this, 200, 115));
        this.objects.push(new Tree(this, 240, 115));
        this.objects.push(new Tree(this, 280, 115));
        this.objects.push(new Tree(this, 200, 185));
        this.objects.push(new Tree(this, 240, 185));
        this.objects.push(new Tree(this, 280, 185));

        this.cursors = this.input.keyboard.createCursorKeys();
        this.cursors.muteKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);
        this.cursors.one = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
        this.cursors.two = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO);

        this.physics.add.collider(this.player, chaoLayer);
        this.objects.forEach((object) => {
            if (object.collide) this.physics.add.collider(this.player, object);
        });

        const bgMusic = this.sound.add('bg_music_1', { 
            loop: true,
            volume: this.musicPlaying ? 1.5 : 0
        });
        
        bgMusic.play();

        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        // 2. Faz a câmara seguir o jogador
        this.cameras.main.startFollow(this.player);
        // 3. Aplica um zoom (ex: 2x)
        this.cameras.main.setZoom(3);

        this.inventoryUI = new InventoryUI(this);
        this.inventoryUI.createInventorySlots();
    }

    update() {
        this.inventoryUI.updateInventorySlots();
        if (Phaser.Input.Keyboard.JustDown(this.cursors.muteKey)) {
            this.toggleMusic();
        }
        if (this.player) {
            this.player.update(this.cursors, this.dpadState);
            if (this.player.axeHit) {
                this.objects.forEach((object) => {
                    if (isInCuttingRange(this.player, object) && object.onAxeHit) {
                        object.onAxeHit();
                    }
                });
                this.player.axeHit = false;
            }
        }
    }

    createDPad() {
        this.dpadState = { up: false, down: false, left: false, right: false, use: false };

        const dpadX = this.scale.width - 605;
        const dpadY = this.scale.height - 245;

        const btnX = this.scale.width - 370;
        const btnY = this.scale.height - 245;

        const dpadImage = this.add.image(dpadX, dpadY, 'dpad');
        dpadImage.setScrollFactor(0);
        dpadImage.setAlpha(0.7);
        dpadImage.setDepth(30);
        dpadImage.setScale(0.4);

        const dpadUseButton = this.add.image(btnX, btnY, 'dpad-use-button');
        dpadUseButton.setScrollFactor(0);
        dpadUseButton.setScale(0.1);
        dpadUseButton.setAlpha(0.7);
        dpadUseButton.setDepth(30);

        const hitAreaSize = 27;
        const hitAreaOffset = 20;

        const hitAreaUp = this.add.rectangle(dpadX, dpadY - hitAreaOffset, hitAreaSize, hitAreaSize);
        const hitAreaDown = this.add.rectangle(dpadX, dpadY + hitAreaOffset, hitAreaSize, hitAreaSize);
        const hitAreaLeft = this.add.rectangle(dpadX - hitAreaOffset, dpadY, hitAreaSize, hitAreaSize);
        const hitAreaRight = this.add.rectangle(dpadX + hitAreaOffset, dpadY, hitAreaSize, hitAreaSize);

        const btnAreaSize = 25.6;
        const btnAreaOffset = 0;

        const hitAreaUse = this.add.circle(btnX + btnAreaOffset, btnY, btnAreaSize);

        const zones = [hitAreaUp, hitAreaDown, hitAreaLeft, hitAreaRight, hitAreaUse];
        const directions = ['up', 'down', 'left', 'right', 'use'];

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

    toggleMusic() {
        this.musicPlaying = !this.musicPlaying;
        localStorage.setItem('music', !this.musicPlaying);
        let music = this.sound.get('bg_music_1');
        if (this.musicPlaying) {
            if (music) music.setVolume(0);
        }
        else if (music) music.setVolume(1.5);
    }
}