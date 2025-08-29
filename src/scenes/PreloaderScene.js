import loadAudios from "../loaders/loadAudios.js";
import loadImages from "../loaders/loadImages.js";
import loadSpritesheets from "../loaders/loadSpritesheets.js";
import loadTilemapsJson from "../loaders/loadTilemapsJson.js";

export default class PreloaderScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PreloaderScene' });
    }

    preload() {
        this.initProgressBar();

        loadImages(this);
        loadTilemapsJson(this);
        loadSpritesheets(this);
        loadAudios(this);
    }

    create() {
        this.scene.start('GameScene');
    }

    initProgressBar() {
        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(240, 270, 320, 50);

        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        const loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: 'Loading...',
            style: {
                font: '20px monospace',
                fill: '#ffffff'
            }
        });
        loadingText.setOrigin(0.5, 0.5);

        this.load.on('progress', (value) => {
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(250, 280, 300 * value, 30);
        });

        this.load.on('complete', () => {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
        });
    }
}