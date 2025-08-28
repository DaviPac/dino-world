import PreloaderScene from "./scenes/PreloaderScene.js";
import GameScene from "./scenes/GameScene.js";

const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: 800,
    height: 600,
    render: {
        pixelArt: true
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 980,
        height: 580
    },
    scene: [PreloaderScene, GameScene] 
};

const game = new Phaser.Game(config);