import Player from "../objects/Player.js";
import Tree from "../objects/Tree.js";
import { isInCuttingRange } from "../utils/range.js";
import { isMobile } from "../utils/isMobile.js";
import InventoryUI from "../objects/InventoryUI.js";
import DPadUI from "../objects/DPadUI.js";
import InputHandler from "../InputHandler.js";

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
        if (isMobile(this) || true) this.dpad = new DPadUI(this);

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

        this.cursors = this.input.keyboard.createCursorKeys();
        this.cursors.muteKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);
        this.cursors.one = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
        this.cursors.two = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO);
        this.cursors.three = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE);
        this.cursors.four = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FOUR);
        this.cursors.five = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FIVE);
        this.cursors.six = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SIX);
        this.cursors.seven = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SEVEN);
        this.cursors.eight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.EIGHT);
        this.cursors.nine = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NINE);

        this.inputHandler = new InputHandler(this, this.cursors, this.dpad);
        this.player = new Player(this, 100, 100, this.inputHandler);

        this.objects.push(new Tree(this, 200, 115));
        this.objects.push(new Tree(this, 240, 115));
        this.objects.push(new Tree(this, 280, 115));
        this.objects.push(new Tree(this, 200, 185));
        this.objects.push(new Tree(this, 240, 185));
        this.objects.push(new Tree(this, 280, 185));

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
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setZoom(3);

        this.inventoryUI = new InventoryUI(this);
        this.inventoryUI.createInventorySlots();
    }

    update() {
        if (this.dpad) this.dpad.update();
        this.inventoryUI.updateInventorySlots();
        if (Phaser.Input.Keyboard.JustDown(this.cursors.muteKey)) {
            this.toggleMusic();
        }
        if (this.player) {
            this.player.update();
                this.objects.forEach((object) => {
                if (this.player.axeHit && isInCuttingRange(this.player, object) && object.onAxeHit) {
                    object.onAxeHit();
                }
            });
            this.player.axeHit = false;
        }
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