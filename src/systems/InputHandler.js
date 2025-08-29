export default class InputHandler {
    constructor(scene, cursors, dpad) {
        this.scene = scene;
        this.cursors = cursors;
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
}