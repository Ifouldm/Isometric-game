const express = require('express');
const path = require('path');

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const Datastore = require('nedb');
const db = new Datastore({ filename: 'db.json' });

const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const config = require('./webpack.config.js');
const compiler = webpack(config);

let worldID = '';
let currentWorld;
let p1Iventory;
let p2Iventory;
let p3Iventory;
let p4Iventory;

// Tell express to use the webpack-dev-middleware and use the webpack.config.js
// configuration file as a base.
app.use(
    webpackDevMiddleware(compiler, {
        publicPath: config.output.publicPath,
    })
);

function setup() {
    db.loadDatabase((err) => {
        if (err) console.error(err);
    });
    db.findOne({}, (err, doc) => {
        if (err) {
            console.error('Find error ' + err);
        } else {
            if (!doc) {
                createNewWorld();
            } else {
                worldID = doc._id;
                currentWorld = doc.world;
                p1Iventory = doc.p1Iventory || [];
                p2Iventory = doc.p2Iventory || [];
                p3Iventory = doc.p3Iventory || [];
                p4Iventory = doc.p4Iventory || [];
            }
        }
    });
}

function createNewWorld() {
    db.insert(
        {
            world: new Array(20).fill(66).map(() => new Array(20).fill(66)),
            p1Iventory: [],
            p2Iventory: [],
            p3Iventory: [],
            p4Iventory: [],
        },
        (err, newDoc) => {
            if (err) console.error('Error saving world: ' + err);
            if (newDoc) {
                worldID = newDoc._id;
                console.log('New world created with ID: ' + worldID);
            }
        }
    );
}

function saveWorld() {
    db.update(
        { _id: worldID },
        {
            world: currentWorld,
            p1Iventory,
            p2Iventory,
            p3Iventory,
            p4Iventory,
        },
        {},
        (err) => {
            if (err) console.error('Error saving world: ' + err);
        }
    );
}

function updateState() {
    saveWorld();
    const update = {
        currentWorld,
        p1Iventory,
        p2Iventory,
        p3Iventory,
        p4Iventory,
    };
    io.emit('update', update);
}

function playerInvUse(playerNo, slot) {
    switch (playerNo) {
        case 1:
            p1Iventory.find((record) => record.slot === slot).quantity--;
            break;
        case 2:
            p1Iventory.find((record) => record.slot === slot).quantity--;
            break;
        case 3:
            p1Iventory.find((record) => record.slot === slot).quantity--;
            break;
        case 4:
            p1Iventory.find((record) => record.slot === slot).quantity--;
            break;
        default:
            console.error('Invalid player number');
    }
}

function tileUpdate(update) {
    currentWorld[update.y][update.x] = update.tileId;
    playerInvUse(update.playerNo, update.slot);
    updateState();
}

setup();

app.use(express.static(path.join(__dirname, '/public/')));

io.on('connection', (socket) => {
    socket.on('clientConnect', updateState);
    socket.on('changeTile', tileUpdate);
});

http.listen(3000, () => {
    console.log('listening on http://localhost:3000');
});
