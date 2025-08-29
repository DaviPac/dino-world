import CollectableObject from "./CollectableObject.js";
import FishItem from "./items/FishItem.js";

export default class Fish extends CollectableObject {
    constructor(scene, x, y) {
        super(scene, x, y, 'fish-icon', FishItem);
    }
}