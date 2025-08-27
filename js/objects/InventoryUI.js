export default class InventoryUI {
    constructor(scene) {
        this.scene = scene;
        this.slots = [];
        this.itemImages = [];
        this.selectedSlotImage = null;
    }

    createInventorySlots(slotCount = 8) {
        const inventoryX = this.scene.scale.width - 495;
        const inventoryY = this.scene.scale.height - 215;
        const inventoryItemX = inventoryX - 67;
        const inventoryItemY = inventoryY + 1;

        const inventoryImage = this.scene.add.image(inventoryX, inventoryY, 'inventory-slots')
            .setScrollFactor(0)
            .setAlpha(0.7)
            .setDepth(30);

        const hitAreaSize = 16;
        const hitAreaOffset = 19;

        for (let i = 0; i < slotCount; i++) {
            const slot = this.scene.add.rectangle(inventoryItemX + i * hitAreaOffset, inventoryItemY, hitAreaSize, hitAreaSize)
                .setScrollFactor(0)
                .setDepth(31)
                .setInteractive();

            slot.on('pointerdown', () => {
                this.selectedIndex = i;
                if (this.scene.player && this.scene.player.inventory[i]) {
                    this.scene.player.inventoryIndex = i;
                }
                this.updateInventorySlots();
                this.updateSelectedSlot();
            });

            this.slots.push(slot);
        }

        this.selectedSlotImage = this.scene.add.image(0, 0, 'selected-slot')
            .setScrollFactor(0)
            .setDepth(33)
            .setVisible(false);
    }

    updateInventorySlots() {
        if (!this.scene.player) return;

        const inventoryX = this.scene.scale.width - 495;
        const inventoryY = this.scene.scale.height - 215;
        const inventoryItemX = inventoryX - 67;
        const inventoryItemY = inventoryY + 1;
        const hitAreaOffset = 19;

        this.itemImages.forEach(img => img.destroy());
        this.itemImages = [];

        this.scene.player.inventory.forEach((item, index) => {
            const icon = item.icon;
            const frame = icon.frame ?? undefined;

            const itemImage = this.scene.add.image(inventoryItemX + (index * hitAreaOffset), inventoryItemY, icon.key, frame)
                .setScrollFactor(0)
                .setDepth(32);

            this.itemImages.push(itemImage);
        });

        this.updateSelectedSlot();
    }

    updateSelectedSlot() {
        if (this.scene.player.inventoryIndex === null) {
            this.selectedSlotImage.setVisible(false);
            return;
        }

        const inventoryX = this.scene.scale.width - 495;
        const inventoryY = this.scene.scale.height - 215;
        const inventoryItemX = inventoryX - 67;
        const inventoryItemY = inventoryY + 1;
        const hitAreaOffset = 19;

        const slotX = inventoryItemX + this.scene.player.inventoryIndex * hitAreaOffset;
        const slotY = inventoryItemY;

        this.selectedSlotImage.setPosition(slotX, slotY);
        this.selectedSlotImage.setVisible(true);
    }
}
