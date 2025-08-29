export default class Inventory {
    constructor(items = []) {
        this.items = items;
        this.selectedIndex = items.length > 0 ? 0 : null;
        this.limit = 8;
    }

    get equippedItem() {
        if (this.selectedIndex !== null) {
            return this.items[this.selectedIndex];
        }
        return null;
    }

    setSelectedIndex(index) {
        if (index >= 0 && index < this.items.length) {
            this.selectedIndex = index;
        }
    }
}