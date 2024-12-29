const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let rooms = {};  // A simple object to store room details

// Serve static files (Frontend)
app.use(express.static('public'));

// When a user connects
io.on('connection', (socket) => {
    console.log('a user connected');

    // Listen for 'joinRoom' event from frontend
    socket.on('joinRoom', ({ code, name }) => {
        if (!rooms[code]) {
            // If the room doesn't exist, create a new room
            rooms[code] = { users: [] };
        }

        // Add user to the room
        rooms[code].users.push({ id: socket.id, name });

        // Join the room
        socket.join(code);

        // Send welcome message
        socket.emit('message', `Welcome ${name} to the chat!`);

        // Notify the other user in the room
        socket.to(code).emit('message', `${name} has joined the chat`);

        console.log(`${name} joined room ${code}`);

        // Handle disconnection
        socket.on('disconnect', () => {
            rooms[code].users = rooms[code].users.filter(user => user.id !== socket.id);
            if (rooms[code].users.length === 0) {
                delete rooms[code];  // Delete room if no users left
            }
            console.log(`${name} left room ${code}`);
        });
    });

    // Listen for 'sendMessage' event to broadcast messages in the room
    socket.on('sendMessage', (message) => {
        const roomCode = Object.keys(rooms).find(code => rooms[code].users.some(user => user.id === socket.id));
        if (roomCode) {
            io.to(roomCode).emit('message', message);
        }
    });
});

// Start the server
server.listen(3000, () => {
    console.log('Server is running on port 3000');
});
