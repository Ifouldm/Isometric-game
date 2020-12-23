// eslint-disable-next-line no-unused-vars
class Toolbar {
    constructor(toolbarHeight, tileAssets) {
        this.toolbarHeight = toolbarHeight;
        this.selection = 0;
        this.inventory = [];
        this.spacing  = 10;
        this.itemSize = this.toolbarHeight - (this.spacing);
        this.qtySize = 20;
        this.icons = 9;
        for (let i = 0; i < this.icons; i++) {
            this.inventory[i] = {
                id: i,
                asset: tileAssets[i],
                quantity: floor(random(1,64))
            };
        }
    }

    getSelectionId() {
        return this.inventory[this.selection].id;
    }

    prevSelection() {
        this.selection = this.selection > 0 ? this.selection-1 : this.icons - 1;
    }

    nextSelection() {
        this.selection = this.selection < this.icons - 1 ? this.selection+1 : 0;
    }

    draw() {
        push();
        translate(0, height - this.toolbarHeight);
        noStroke();
        fill(255, 255, 255, 125);
        rect(0, 0, width, 80);

        translate(this.spacing * 0.5, this.spacing * 0.5);
        for (let i = 0; i < this.inventory.length; i++) {
            let item = this.inventory[i];
            push();
            translate(i * (this.itemSize + this.spacing), 0);
            if (i === this.selection) {
                fill('blue');
                rect(-2, -2 , this.itemSize + 4, this.itemSize + 4, 16);
            }
            fill(255);
            rect(0, 0 , this.itemSize, this.itemSize, 14);
            image(item.asset, 5, 5, this.itemSize - 10, this.itemSize - 10);
            fill(125);
            ellipse(this.itemSize - this.qtySize * 0.5, this.itemSize - this.qtySize * 0.5, this.qtySize);
            fill(255);
            textAlign(CENTER, CENTER);
            text(item.quantity, this.itemSize - this.qtySize, this.itemSize - this.qtySize, this.qtySize, this.qtySize);
            pop();
        }    
        pop();
    }

    select(x, y) {
        // determing which item was clicked
        console.log(`x: ${x}, y: ${y}`);
    }
}