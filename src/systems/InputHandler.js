export default class InputHandler {
    constructor(scene, dpad) {
        this.scene = scene;

        this.cursors = scene.input.keyboard.createCursorKeys();
        this.cursors.muteKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);
        this.cursors.one   = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
        this.cursors.two   = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO);
        this.cursors.three = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE);
        this.cursors.four  = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FOUR);
        this.cursors.five  = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FIVE);
        this.cursors.six   = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SIX);
        this.cursors.seven = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SEVEN);
        this.cursors.eight = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.EIGHT);
        this.cursors.nine  = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NINE);

        this.dpadState = dpad ? dpad.dpadState : { up: false, down: false, left: false, right: false, use: false };
        this.dpadJustDownState = dpad ? dpad.justDownState : { up: false, down: false, left: false, right: false, use: false };
    }

    get moveVector() {
        const vector = new Phaser.Math.Vector2(0, 0);

        if (this.cursors.left.isDown || this.dpadState.left) vector.x = -1;
        else if (this.cursors.right.isDown || this.dpadState.right) vector.x = 1;

        if (this.cursors.up.isDown || this.dpadState.up) vector.y = -1;
        else if (this.cursors.down.isDown || this.dpadState.down) vector.y = 1;

        return vector.normalize();
    }

    get isLeftKeyPressed() { return this.cursors.left.isDown || this.dpadState.left }
    get isRightKeyPressed() { return this.cursors.right.isDown || this.dpadState.right }
    get isDownKeyPressed() { return this.cursors.down.isDown || this.dpadState.down }
    get isUpKeyPressed() { return this.cursors.up.isDown || this.dpadState.up }

    get isUsePressed() { return this.cursors.space.isDown || this.dpadState.use; }

    get usePressed() { return Phaser.Input.Keyboard.JustDown(this.cursors.space) || this.dpadJustDownState.use }

    get inventory1Pressed() { return Phaser.Input.Keyboard.JustDown(this.cursors.one); }
    get inventory2Pressed() { return Phaser.Input.Keyboard.JustDown(this.cursors.two); }
    get inventory3Pressed() { return Phaser.Input.Keyboard.JustDown(this.cursors.three); }
    get inventory4Pressed() { return Phaser.Input.Keyboard.JustDown(this.cursors.four); }
    get inventory5Pressed() { return Phaser.Input.Keyboard.JustDown(this.cursors.five); }
    get inventory6Pressed() { return Phaser.Input.Keyboard.JustDown(this.cursors.six); }
    get inventory7Pressed() { return Phaser.Input.Keyboard.JustDown(this.cursors.seven); }
    get inventory8Pressed() { return Phaser.Input.Keyboard.JustDown(this.cursors.eight); }
    get inventory9Pressed() { return Phaser.Input.Keyboard.JustDown(this.cursors.nine); }

    get muteKeyPressed() { return Phaser.Input.Keyboard.JustDown(this.cursors.muteKey); }
}