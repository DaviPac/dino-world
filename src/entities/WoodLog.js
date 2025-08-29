import CollectableObject from "./CollectableObject.js";
import WoodLogItem from "./items/WoodLogItem.js";

export default class WoodLog extends CollectableObject {
    static nextId = 1;

    constructor(scene, x, y) {
        super(scene, x, y, 'basic-tools-icons', WoodLogItem, 0);
    }
}