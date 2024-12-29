const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('static'));

let rooms = {};

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('join-room', ({ name, roomCode }) => {
        socket.join(roomCode);
        rooms[roomCode] = rooms[roomCode] || [];
        rooms[roomCode].push({ id: socket.id, name });
        io.to(roomCode).emit('update-status', `${name} has joined the room.`);

        socket.on('send-message', (msg) => {
            socket.to(roomCode).emit('receive-message', `${name}: ${msg}`);
        });

        socket.on('typing', (isTyping) => {
            socket.to(roomCode).emit('typing', isTyping);
        });

        socket.on('disconnect', () => {
            rooms[roomCode] = rooms[roomCode].filter((user) => user.id !== socket.id);
            io.to(roomCode).emit('update-status', `${name} has disconnected.`);
        });
    });
});

server.listen(3000, () => {
    console.log('Server Successfully running on http://localhost:3000');
});