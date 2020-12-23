/* eslint-disable no-undef */
const socket = io();
const tileAssets = [];
const movementSpeed = 5;
const tileWidth = 128;
const tileHeight = 64;
let mouseOver = null;
let camPos;
let xOffset;
let yOffset;
let world;
let selection = 0;
let debug = false;
let zoom = 1;
let toolbar;

// Socket connection
socket.on('update', update => {
    world.update(update.currentWorld.world);
});

// eslint-disable-next-line no-unused-vars
function preload() {
    loadJSON('/assets/tiles.json', tiles => {
        for (tile of tiles) {
            tileAssets.push(loadImage(tile.path));
        }
    });
}

// eslint-disable-next-line no-unused-vars
function setup() {
    createCanvas(800, 600);
    socket.emit('clientConnect', 'client connection');
    camPos = createVector(width / 2, height /2);
    xOffset = createVector(tileWidth / 2, tileHeight / 2);
    yOffset = createVector(-tileWidth / 2, tileHeight / 2);
    toolbar = new Toolbar(80, tileAssets);
    world = new World(xOffset, yOffset, tileWidth, tileHeight, tileAssets);
}

function getTileAt(screenX, screenY) {
    let xStrides = (screenX - camPos.x) / world.currXOffset.x;
    let yStrides = (screenY - camPos.y + (tileHeight * zoom)) / world.currXOffset.y;

    let tileY = (yStrides - xStrides) / 2;
    let tileX = xStrides + tileY;

    if (tileX < 0 || tileX > world.world[0].length || tileY < 0 || tileY >= world.world.length)
        return null;

    return {
        x: parseInt(tileX),
        y: parseInt(tileY)
    };
}



function drawDebugInfo() {
    push();
    textSize(16);
    fill(255);
    text(`x: ${mouseX} y: ${mouseY} pos: (${mouseOver ? mouseOver.x + ',' + mouseOver.y : null}), zoom: ${zoom} cam x: ${camPos.x}, cam y: ${camPos.y}`, 20, 20, 200, 200);
    pop();
}

function drawDebug() {
    push();
    // Grid
    stroke(0);
    for (let i = 0; i < width; i+=100) {
        line(i, 0, i, height);
    }
    for (let i = 0; i < height; i+=100) {
        line(0, i, width, i);
    }
    // Camera position
    noStroke();
    fill('yellow');
    translate(camPos.x, camPos.y);
    ellipse(0, 0, 10);
    pop();
}

// eslint-disable-next-line no-unused-vars
function mouseWheel(event) {
    let amount = (event.delta > 0) ? -0.1 : 0.1;
    if(zoom + amount >= 0.5 && zoom + amount <= 3) {
        zoom += amount;
        world.currXOffset = p5.Vector.mult(xOffset, zoom);
        world.currYOffset = p5.Vector.mult(yOffset, zoom);
    }
    return false;    
}

// eslint-disable-next-line no-unused-vars
function draw() {
    background(51);
    if (world && world.loaded) {
        world.drawWorld(camPos.x, camPos.y, zoom, mouseOver, debug);
        toolbar.draw();
        keyDown();
        if(debug){
            drawDebug();
            drawDebugInfo();
        }
    }
}

function keyDown() {
    if (keyIsDown(65)) {
        camPos.x += movementSpeed;
    } else if (keyIsDown(68)) {
        camPos.x -= movementSpeed;
    }
    // allows diagonal movement
    if (keyIsDown(87)) {
        camPos.y += movementSpeed;
    } else if (keyIsDown(83)) {
        camPos.y -= movementSpeed;
    }
}

// eslint-disable-next-line no-unused-vars
function mouseMoved() {
    if (world && world.loaded) {
        mouseOver = getTileAt(mouseX, mouseY);
    }
}

function setTile(x, y, tileId) {
    socket.emit('changeTile', {
        x,
        y,
        tileId
    });
}

// eslint-disable-next-line no-unused-vars
function mouseClicked() {
    if (mouseY > height - toolbar.toolbarHeight) {
        toolbar.select(mouseX, mouseY + toolbar.toolbarHeight - height);
    }
    else if (mouseOver)
        setTile(mouseOver.x, mouseOver.y, toolbar.getSelectionId());
}

// eslint-disable-next-line no-unused-vars
function keyPressed() {
    if (keyCode === 114)
        debug = !debug;
    if (keyCode === 219)
        toolbar.prevSelection();
    if (keyCode === 221)
        toolbar.nextSelection();
    if (selection < 0)
        selection = tileAssets.length - 1;
    if (selection >= tileAssets.length)
        selection = 0;
}
