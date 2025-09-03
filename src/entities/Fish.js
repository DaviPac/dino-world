import Collectable from "./Collectable.js";
import FishItem from "./items/FishItem.js";

export default class Fish extends Collectable {
    constructor(scene, x, y) {
        super(scene, x, y, 'fish-icon', FishItem);
    }
}