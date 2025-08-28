export default class DPadUI {
    constructor(scene) {
        this.scene = scene;
        this.dpadState = { up: false, down: false, left: false, right: false, use: false };
        this.justDownState = { up: false, down: false, left: false, right: false, use: false };
        this.previousDpadState = { up: false, down: false, left: false, right: false, use: false };
        this.createDPad();
    }

    createDPad() {

        const dpadX = this.scene.scale.width - 605;
        const dpadY = this.scene.scale.height - 245;

        const btnX = this.scene.scale.width - 370;
        const btnY = this.scene.scale.height - 245;

        const dpadImage = this.scene.add.image(dpadX, dpadY, 'dpad');
        dpadImage.setScrollFactor(0);
        dpadImage.setAlpha(0.7);
        dpadImage.setDepth(30);
        dpadImage.setScale(0.4);

        const dpadUseButton = this.scene.add.image(btnX, btnY, 'dpad-use-button');
        dpadUseButton.setScrollFactor(0);
        dpadUseButton.setScale(0.1);
        dpadUseButton.setAlpha(0.7);
        dpadUseButton.setDepth(30);

        const hitAreaSize = 27;
        const hitAreaOffset = 20;

        const hitAreaUp = this.scene.add.rectangle(dpadX, dpadY - hitAreaOffset, hitAreaSize, hitAreaSize);
        const hitAreaDown = this.scene.add.rectangle(dpadX, dpadY + hitAreaOffset, hitAreaSize, hitAreaSize);
        const hitAreaLeft = this.scene.add.rectangle(dpadX - hitAreaOffset, dpadY, hitAreaSize, hitAreaSize);
        const hitAreaRight = this.scene.add.rectangle(dpadX + hitAreaOffset, dpadY, hitAreaSize, hitAreaSize);

        const btnAreaSize = 25.6;
        const btnAreaOffset = 0;

        const hitAreaUse = this.scene.add.circle(btnX + btnAreaOffset, btnY, btnAreaSize);

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

    update() {
        for (const key in this.dpadState) {
            this.justDownState[key] = this.dpadState[key] && !this.previousDpadState[key];
        }
        this.previousDpadState = { ...this.dpadState };
    }
}