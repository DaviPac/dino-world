import WoodFence from "../WoodFence.js";
import Item from "./Item.js";

export default class WoodLogItem extends Item {
    constructor() {
        super('basic-tools-icons', 0);
    }

    use(user) {
        let scene = user.scene;
        let x = user.x;
        let y = user.y;
        if (user.facing === 'up') y -= 19;
        else if (user.facing === 'down') y += 22;
        else if (user.facing === 'left') x -= 13;
        else x += 13;
        scene.objects.push(new WoodFence(scene, x, y));
    }
}