// eslint-disable-next-line no-unused-vars
export default class Toolbar {
    constructor(toolbarHeight, inventory, tileAssets) {
        this.tileAssets = tileAssets;
        this.toolbarHeight = toolbarHeight;
        this.selection = 0;
        this.inventory = inventory;
        this.spacing = 10;
        this.itemSize = this.toolbarHeight - this.spacing;
        this.qtySize = 20;
        this.icons = 9;
        this.linkedInventory = [1, 2, 3, 5, 12, 14, 15, 16, 44];
    }

    getSelectedItem() {
        return this.inventory.getItemBySlot(
            this.linkedInventory[this.selection]
        );
    }

    getItem(slot) {
        return this.inventory.getItemBySlot(this.linkedInventory[slot]);
    }

    prevSelection() {
        this.selection =
            this.selection > 0 ? this.selection - 1 : this.icons - 1;
    }

    nextSelection() {
        this.selection =
            this.selection < this.icons - 1 ? this.selection + 1 : 0;
    }

    draw() {
        push();
        translate(0, height - this.toolbarHeight);
        noStroke();
        fill(255, 255, 255, 125);
        rect(0, 0, width, 80);

        translate(this.spacing * 0.5, this.spacing * 0.5);
        for (let i = 0; i < this.linkedInventory.length; i++) {
            let item = this.getItem(i);

            push();
            translate(i * (this.itemSize + this.spacing), 0);
            if (i === this.selection) {
                fill('blue');
                rect(-2, -2, this.itemSize + 4, this.itemSize + 4, 16);
            }
            fill(255);
            rect(0, 0, this.itemSize, this.itemSize, 14);
            if (!item || item.id > this.tileAssets.length) {
                rect(5, 5, this.itemSize - 10, this.itemSize - 10);
            } else {
                image(
                    this.tileAssets[item.id],
                    5,
                    5,
                    this.itemSize - 10,
                    this.itemSize - 10
                );
                fill(125);
                ellipse(
                    this.itemSize - this.qtySize * 0.5,
                    this.itemSize - this.qtySize * 0.5,
                    this.qtySize
                );
                fill(255);
                textAlign(CENTER, CENTER);
                text(
                    item.quantity,
                    this.itemSize - this.qtySize,
                    this.itemSize - this.qtySize,
                    this.qtySize,
                    this.qtySize
                );
            }
            pop();
        }
        pop();
    }

    select(x, y) {
        // determing which item was clicked
        console.log(`x: ${x}, y: ${y}`);
    }
}
