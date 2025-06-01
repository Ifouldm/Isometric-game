// eslint-disable-next-line no-unused-vars
export default class Inventory {
    constructor(tileAssets) {
        this.tileAssets = tileAssets;
        this.items = [
            {
                id: 0,
                asset: tileAssets[0],
                quantity: 4,
            },
            {
                id: 1,
                asset: tileAssets[1],
                quantity: 3,
            },
            {
                id: 2,
                asset: tileAssets[2],
                quantity: 54,
            },
            {
                id: 3,
                asset: tileAssets[3],
                quantity: 12,
            },
            {
                id: 4,
                asset: tileAssets[4],
                quantity: 18,
            },
            {
                id: 5,
                asset: tileAssets[5],
                quantity: 4,
            },
            {
                id: 6,
                asset: tileAssets[6],
                quantity: 4,
            },
            {
                id: 7,
                asset: tileAssets[7],
                quantity: 4,
            },
            {
                id: 8,
                asset: tileAssets[8],
                quantity: 4,
            },
            {
                id: 9,
                asset: tileAssets[9],
                quantity: 4,
            },
            {
                id: 10,
                asset: tileAssets[10],
                quantity: 4,
            },
            {
                id: 11,
                asset: tileAssets[11],
                quantity: 4,
            },
            {
                id: 12,
                asset: tileAssets[12],
                quantity: 4,
            },
            {
                id: 13,
                asset: tileAssets[13],
                quantity: 4,
            },
            {
                id: 14,
                asset: tileAssets[14],
                quantity: 4,
            },
            {
                id: 15,
                asset: tileAssets[15],
                quantity: 4,
            },
            {
                id: 16,
                asset: tileAssets[16],
                quantity: 4,
            },
            {
                id: 17,
                asset: tileAssets[17],
                quantity: 4,
            },
            {
                id: 18,
                asset: tileAssets[18],
                quantity: 4,
            },
        ];
        this.visible = false;
        this.width = width - 200;
        this.height = height - 200;
        this.spacing = 10;
        this.itemSize = Math.floor(this.width / 9) - this.spacing;
        this.qtySize = 20;
        this.icons = 9;
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
            if (!item) {
                fill(255);
                rect(5, 5, this.itemSize - 10, this.itemSize - 10);
            } else {
                image(item.asset, 5, 5, this.itemSize - 10, this.itemSize - 10);
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
