export default function loadSpritesheets(scene) {
    scene.load.spritesheet('player_idle', 'assets/sprites/pack/char/Character/Pre-made/Josh/Idle.png', {
        frameWidth: 32, frameHeight: 32
    });
    scene.load.spritesheet('player_walk', 'assets/sprites/pack/char/Character/Pre-made/Josh/Walk.png', {
        frameWidth: 32, frameHeight: 32
    });
    scene.load.spritesheet('player_axe', 'assets/sprites/pack/char/Character/Pre-made/Josh/Axe.png', {
        frameWidth: 32, frameHeight: 32
    });
    scene.load.spritesheet('player_fish_idle', 'assets/sprites/pack/char/Character/Pre-made/Josh/Fishing/wait.png', {
        frameWidth: 64, frameHeight: 64
    });
    scene.load.spritesheet('player_fish_captured', 'assets/sprites/pack/char/Character/Pre-made/Josh/Fishing/captured.png', {
        frameWidth: 64, frameHeight: 64
    });
    scene.load.spritesheet('tree', 'assets/tree.png', {
        frameWidth: 32, frameHeight: 48
    });
    scene.load.spritesheet('basic-tools-icons', 'assets/sprites/pack/icons/Weapons/basic.png', {
        frameWidth: 16, frameHeight: 16
    });
    scene.load.spritesheet('fence-wood', 'assets/sprites/pack/exterior/fence-bridge/fence-wood.png', {
        frameWidth: 16, frameHeight: 16
    });
    scene.load.spritesheet('dino-side', 'assets/sprites/pack/dino/dino_side.png', {
        frameWidth: 512, frameHeight: 454
    });
}