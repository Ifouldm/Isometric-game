const express = require('express');
const path = require('path');

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const Datastore = require('nedb');
const db = new Datastore({ filename: 'db.json' });

var currentWorld;

function setup() {
    db.loadDatabase((err) => {
        if (err)
            console.error(err);
    });
    db.findOne({}, (err, doc) => {
        if (err) {
            console.error('Find error ' + err);
        }
        else {
            if(!doc){
                currentWorld = new Array(20).fill(66).map(() => new Array(20).fill(66));
                saveWorld();
            }
            currentWorld = doc;
        }
    });
}

function saveWorld() {
    db.update({ _id: currentWorld._id }, { world: currentWorld.world }, {}, (err) => {
        if(err)
            console.error('Error saving world: ' + err);
    });
}

function updateState() {
    saveWorld();
    const update = {
        currentWorld
    };
    io.emit('update', update);
}

function tileUpdate(update) {
    currentWorld.world[update.y][update.x] = update.tileId;
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
