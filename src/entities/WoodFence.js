import GameObject from "./GameObject.js";
import WoodLog from "./WoodLog.js";

export default class WoodFence extends GameObject {
    constructor(scene, x, y) {
        super(scene, x, y, 'fence-wood', 25);
        this.body.setSize(10, 12).setOffset(3, 5);
        this.collide = true;
        scene.physics.add.collider(scene.player, this);
        this.setDepth(y - 2);
        this.states = [
            'alone',
            'left',
            'middle',
            'right',
            'side-top',
            'side-middle',
            'side-bottom',
            'bottom-left',
            'bottom-right',
            'top-left',
            'top-right',
            'middle-left',
            'middle-middle',
            'middle-right',
            'middle-top',
            'middle-bottom'
        ]
        this.currentState = 'alone';
    }

    get state() {
        return this.currentState;
    }

    /**
     * @param {string} stateStr
     */
    set state(stateStr) {
        if (this.states && this.states.includes(stateStr)) {
            this.currentState = stateStr;
            switch (stateStr) {
                case "alone":
                    this.setFrame(25);
                    break;
                case "left":
                    this.setFrame(19);
                    break;
                case "middle":
                    this.setFrame(13);
                    break;
                case "right":
                    this.setFrame(20);
                    break;
                case "side-top":
                    this.setFrame(6);
                    break;
                case "side-middle":
                    this.setFrame(6);
                    break;
                case "side-bottom":
                    this.setFrame(25);
                    break;
                case "bottom-left":
                    this.setFrame(12);
                    break;
                case "bottom-right":
                    this.setFrame(14);
                    break;
                case "top-left":
                    this.setFrame(0);
                    break;
                case "top-right":
                    this.setFrame(2);
                    break;
                case "middle-left":
                    this.setFrame(0);
                    break;
                case "middle-right":
                    this.setFrame(2);
                    break;
                case "middle-middle":
                    this.setFrame(13);
                    break;
                case "middle-top":
                    this.setFrame(13);
                    break;
                case "middle-bottom":
                    this.setFrame(13);
                    break;
            }
        }
    }

    onAxeHit() {
        this.scene.sound.play('axe-tree', { volume: 0.8 });
        this.scene.objects.push(new WoodLog(this.scene, this.x, this.y));
        this.destroy()
    }
}