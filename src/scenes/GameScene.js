import Player from "../entities/Player.js";
import Tree from "../entities/Tree.js";
import { isInCuttingRange } from "../utils/range.js";
import { isMobile } from "../utils/isMobile.js";
import InventoryUI from "../ui/InventoryUI.js";
import DPadUI from "../ui/DPadUI.js";
import InputHandler from "../systems/InputHandler.js";
import Dino from "../entities/Dino.js";
import CameraManager from "../systems/CameraManager.js"
import AudioManager from "../systems/AudioManager.js";

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.objects = [];
        this.musicPlaying = true;
        const temp = localStorage.getItem('music');
        if (temp && temp === "false") this.musicPlaying = false;
    }

    create() {
        if (isMobile(this)) this.dpad = new DPadUI(this);
        this.setupMap();
        this.inputHandler = new InputHandler(this, this.dpad);
        this.player = new Player(this, 100, 100, this.inputHandler);
        this.physics.add.collider(this.player, this.chaoLayer);
        this.setupObjects();
        this.audioManager = new AudioManager(this);
        this.audioManager.play('bg_music_1');
        this.cameraManager = new CameraManager(this);
        this.inventoryUI = new InventoryUI(this);
    }

    update() {
        if (this.dpad) this.dpad.update();
        this.inventoryUI.updateInventorySlots();
        if (this.inputHandler.muteKeyPressed) this.audioManager.toggleMute();
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

    setupMap() {
        this.map = this.make.tilemap({ key: 'mapa_mundo' });
        const tileset1 = this.map.addTilesetImage('Tileset Grass Spring', 'tiles_terreno');
        const tileset2 = this.map.addTilesetImage('Ground', 'tiles_ground');
        this.aguaLayer = this.map.createLayer('Camada de Blocos 2', [tileset1, tileset2], 0, 0);
        this.aguaLayer.setDepth(1);
        this.chaoLayer = this.map.createLayer('Camada de Blocos 1', [tileset1, tileset2], 0, 0);
        this.chaoLayer.setDepth(5);
        try {
            this.chaoLayer.setCollision([11, 12, 31, 60, 396, 439, 444, 466, 468]);
        } catch (error) { }
    }
    
    setupObjects() {
        this.objects.push(new Tree(this, 200, 115));
        this.objects.push(new Tree(this, 240, 115));
        this.objects.push(new Tree(this, 280, 115));
        this.objects.push(new Tree(this, 200, 185));
        this.objects.push(new Tree(this, 240, 185));
        this.objects.push(new Tree(this, 280, 185));
        this.objects.push(new Dino(this, 60, 115));
    }
}