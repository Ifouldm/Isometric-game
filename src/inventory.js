// eslint-disable-next-line no-unused-vars
export default class Inventory {
    constructor(tileAssets) {
        this.tileAssets = tileAssets;
        this.items = [];
        this.visible = false;
        this.width = width - 200;
        this.height = height - 200;
        this.spacing = 10;
        this.itemSize = Math.floor(this.width / 9) - this.spacing;
        this.qtySize = 20;
        this.icons = 9;
    }

    update(playerInventory) {
        this.items = playerInventory;
    }

    getItemBySlot(slot) {
        return this.items[slot];
    }

    addItem(item) {
        this.items.push(item);
    }

    removeItem(item) {
        const index = this.items.indexOf(item);
        if (index > -1) {
            this.items.splice(index, 1);
        }
    }

    toggleVisibility() {
        this.visible = !this.visible;
    }

    show() {
        this.visible = true;
    }

    hide() {
        this.visible = false;
    }

    draw() {
        if (!this.visible) return;
        push();
        translate(100, 100);
        noStroke();
        fill(255, 255, 255, 125);
        rect(0, 0, this.width, this.height);
        translate(this.spacing * 0.5, this.spacing * 0.5);
        for (let i = 0; i < this.items.length; i++) {
            let item = this.items[i];
            let row = Math.floor(i / 9);
            let col = i % 9;
            push();
            translate(
                col * (this.itemSize + this.spacing),
                row * (this.itemSize + this.spacing)
            );
            if (i === this.selection) {
                fill('blue');
                rect(-2, -2, this.itemSize + 4, this.itemSize + 4, 16);
            }
            fill(255);
            rect(0, 0, this.itemSize, this.itemSize, 14);
            if (!item || item.id > this.tileAssets.length) {
                fill(255);
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
}
