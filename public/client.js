/* eslint-disable no-undef */
const socket = io();
const tileWidth = 128;
const tileHeight = 64;
const noAssets = 128;
const tileAssets = [];
const movementSpeed = 5;
let mouseOver = null;
let camPos;
let xOffset;
let yOffset;
let world = null;
let selection = 0;

// Socket connection
socket.on('update', update => {
    world = update.world;
});

// eslint-disable-next-line no-unused-vars
function preload() {
    for (let i = 0; i < noAssets; ++i) {
        let num = '' + i;
        let tileid = num.length >= 3 ? num : new Array(3 - num.length + 1).join('0') + num;
        tileAssets.push(loadImage(`assets/PNG/cityTiles_${tileid}.png`));
    }
}

// eslint-disable-next-line no-unused-vars
function setup() {
    createCanvas(800, 600);
    socket.emit('clientConnect', 'client connection');
    camPos = createVector(width / 2, 0);
    xOffset = createVector(tileWidth / 2, tileHeight / 2);
    yOffset = createVector(-tileWidth / 2, tileHeight / 2);
    rectMode(CENTER);
}

function getTileAt(screenX, screenY) {
    let xStrides = (screenX - camPos.x) / xOffset.x;
    let yStrides = (screenY - camPos.y) / xOffset.y;

    let tileY = (yStrides - xStrides) / 2;
    let tileX = xStrides + tileY;

    if (tileX < 0 || tileX > world[0].length || tileY < 0 || tileY >= world.length)
        return null;

    return {
        x: parseInt(tileX),
        y: parseInt(tileY)
    };
}

function getScreenPos(worldX, worldY) {
    let x = p5.Vector.mult(xOffset, worldX);
    let y = p5.Vector.mult(yOffset, worldY);
    return p5.Vector.add(x, y);
}

function drawTile(tileId, worldX, worldY) {
    let loc = getScreenPos(worldX, worldY);
    push();
    translate(loc.x, loc.y);
    if (mouseOver && worldX === mouseOver.x && worldY === mouseOver.y) {
        tint(200, 0, 0);
    }
    image(tileAssets[tileId], -tileWidth / 2, (tileHeight * 1.5) - tileAssets[tileId].height);
    pop();
}

function drawWorld() {
    push();
    translate(camPos.x, camPos.y);
    for (let y = 0; y < world[0].length; y++) {
        for (let x = 0; x < world.length; x++) {
            drawTile(world[x][y], y, x);
        }
    }
    pop();
}

function drawDebug() {
    push();
    fill(0);
    textSize(32);
    text(`x: ${mouseX} y: ${mouseY} pos: ${mouseOver ? mouseOver.x + ',' + mouseOver.y : null}`, 300, 0);
    pop();
}

// Toolbar overlay
function drawToolbar() {
    push();
    translate(width / 2, height - 30);
    noStroke();
    fill(255, 255, 255, 125);
    rect(0, 0, width, 60);
    translate(-width / 2, 0);
    image(tileAssets[selection], 0, 0, tileWidth / 2, tileHeight / 2);
    drawDebug();
    pop();
}

// eslint-disable-next-line no-unused-vars
function mouseWheel(event) {
    selection += (event.delta > 0) ? 1 : -1;
    if (selection < 0)
        selection = tileAssets.length - 1;
    if (selection >= tileAssets.length)
        selection = 0;
    return false;
}

// eslint-disable-next-line no-unused-vars
function draw() {
    background(51);
    if (world) {
        drawWorld();
        drawToolbar();
        keyDown();
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
    if (world) {
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
    if (mouseOver)
        setTile(mouseOver.x, mouseOver.y, selection);
}
