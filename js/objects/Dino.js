import GameObject from "./GameObject.js";

export default class Dino extends GameObject {
    constructor(scene, x, y) {
        super(scene, x, y, 'dino-side');
        this.setScale(0.1);
        this.collide = true;
        this.hp = 3;
        this.setDepth(y + 10);
        this.setSize(400, 250).setOffset(0, 200);
        this.anims.create({
            key: 'dino-walk-anim',
            frames: this.anims.generateFrameNumbers('dino-side', { start: 0, end: 3 }),
            frameRate: 5,
            repeat: -1
        });
        this.anims.play('dino-walk-anim', true);
    }

    onAxeHit() {
            this.hp--;
    
            this.scene.tweens.add({
                targets: this,
                x: this.x + 4,
                y: this.y,
                duration: 40,
                yoyo: true,
                repeat: 2
            });
    
            this.scene.sound.play('axe-tree', { volume: 0.8 });
    
            if (this.hp == 0) {
                this.destroy();
            }
        }
}