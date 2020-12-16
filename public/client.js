/* eslint-disable no-undef */
const socket = io();
const noAssets = 128;
const tileAssets = [];
const movementSpeed = 5;
const tileWidth = 128;
const tileHeight = 64;
let mouseOver = null;
let camPos;
let xOffset;
let yOffset;
let currXOffset;
let currYOffset;
let world = null;
let selection = 0;
let debug = true;
let zoom = 1;

// Socket connection
socket.on('update', update => {
    world = update.currentWorld.world;
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
    camPos = createVector(width / 2, height /2);
    xOffset = createVector(tileWidth / 2, tileHeight / 2);
    yOffset = createVector(-tileWidth / 2, tileHeight / 2);
    currXOffset = xOffset.copy();
    currYOffset = yOffset.copy();
    rectMode(CENTER);
}

function getTileAt(screenX, screenY) {
    let xStrides = (screenX - camPos.x) / currXOffset.x;
    let yStrides = (screenY - camPos.y) / currXOffset.y;

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
    let x = p5.Vector.mult(currXOffset, worldX);
    let y = p5.Vector.mult(currYOffset, worldY);
    return p5.Vector.add(x, y);
}


function drawTile(tileId, worldX, worldY) {
    let loc = getScreenPos(worldX, worldY);
    push();
    translate(loc.x, loc.y);
    if (mouseOver && worldX === mouseOver.x && worldY === mouseOver.y) {
        tint(200, 0, 0);
    }
    image(tileAssets[tileId], -(tileWidth * zoom) / 2, (tileHeight * zoom) / 2 - tileAssets[tileId].height * zoom, tileAssets[tileId].width * zoom, tileAssets[tileId].height * zoom);
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

function drawWorld() {
    push();
    translate(camPos.x, camPos.y);
    // TODO: Only draw tiles on screen
    for (let y = 0; y < world[0].length; y++) {
        for (let x = 0; x < world.length; x++) {
            drawTile(world[x][y], y, x);
        }
    }
    pop();
}

function drawDebugToolbar() {
    push();
    fill(0);
    textSize(24);
    text(`x: ${mouseX} y: ${mouseY} pos: (${mouseOver ? mouseOver.x + ',' + mouseOver.y : null}), zoom: ${zoom}
    cam x: ${camPos.x}, cam y: ${camPos.y}`, 300, 0);
    translate(0,0);
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
    if(debug)
        drawDebugToolbar();
    pop();
}

function drawDebug() {
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
}

// // eslint-disable-next-line no-unused-vars
// function mouseWheel(event) {
//     selection += (event.delta > 0) ? 1 : -1;
//     if (selection < 0)
//         selection = tileAssets.length - 1;
//     if (selection >= tileAssets.length)
//         selection = 0;
//     return false;
// }

// eslint-disable-next-line no-unused-vars
function mouseWheel(event) {
    let amount = (event.delta > 0) ? -0.1 : 0.1;
    if(zoom + amount >= 0.5 && zoom + amount <= 3) {
        zoom += amount;
        currXOffset = p5.Vector.mult(xOffset, zoom);
        currYOffset = p5.Vector.mult(yOffset, zoom);
    }
    return false;    
}

// eslint-disable-next-line no-unused-vars
function draw() {
    background(51);
    if (world) {
        drawWorld();
        drawToolbar();
        keyDown();
        if(debug)
            drawDebug();
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
