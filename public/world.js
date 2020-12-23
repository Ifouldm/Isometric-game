// eslint-disable-next-line no-unused-vars
class World {
    constructor(xOffset, yOffset, tileWidth, tileHeight, tileAssets){
        this.currXOffset = xOffset.copy();
        this.currYOffset = yOffset.copy();
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;
        this.tileAssets = tileAssets;
        this.Loaded = false;
    }

    update(world) {
        this.loaded = true;
        this.world = world;
    }

    getScreenPos(worldX, worldY) {
        let x = p5.Vector.mult(this.currXOffset, worldX);
        let y = p5.Vector.mult(this.currYOffset, worldY);
        return p5.Vector.add(x, y);
    }

    drawWorld(camx, camy, mouseOver, debug) {
        push();
        // Draw tiles relative to the camPos
        translate(camx, camy);
        // TODO: Only draw visible tiles on screen
        for (let y = 0; y < this.world[0].length; y++) {
            for (let x = 0; x < this.world.length; x++) {
                this.drawTile(this.world[x][y], y, x, mouseOver, debug);
            }
        }
        pop();
    }

    drawTile(tileId, worldX, worldY, zoom, mouseOver, debug) {
        let loc = this.getScreenPos(worldX, worldY);
        push();
        translate(loc.x, loc.y);
        if (mouseOver && worldX === mouseOver.x && worldY === mouseOver.y) {
            tint(200, 0, 0);
        }
        image(this.tileAssets[tileId], -(this.tileWidth * zoom) / 2, (this.tileHeight * zoom) / 2 - this.tileAssets[tileId].height * zoom, this.tileAssets[tileId].width * zoom, this.tileAssets[tileId].height * zoom);
        // Draw dot on each tile
        if (debug){
            noStroke();
            fill(255);
            if (mouseOver && worldX === mouseOver.x && worldY === mouseOver.y) {
                fill('red');
            }
            ellipse(0, 0, 10);
        }
        pop();
    }
}