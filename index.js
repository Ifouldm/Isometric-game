const express = require('express');
const path = require('path');

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const world = new Array(20).fill(66).map(() => new Array(20).fill(66));

app.use(express.static(path.join(__dirname, '/public/')));

function updateState() {
    const update = {
        world
    };
    io.emit('update', update);
}

function tileUpdate(update) {
    world[update.y][update.x] = update.tileId;
    updateState();
}

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    socket.on('clientConnect', updateState);
    socket.on('changeTile', tileUpdate);
});

http.listen(3000, () => {
    console.log('listening on http://localhost:3000');
});
