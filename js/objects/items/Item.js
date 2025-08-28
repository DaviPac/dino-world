export default class Item {
    constructor(icon_key, icon_frame = null) {
        if (icon_frame) this.icon = { key: icon_key, frame: icon_frame };
        else this.icon = { key: icon_key };
    }
}