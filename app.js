// Connect to the backend (Socket.IO)
const socket = io('https://chatted-yu4w.onrender.com'); // Your backend URL

const connectButton = document.getElementById('connect-btn');
const chatBox = document.getElementById('chat-box');
const messageInput = document.getElementById('message');
const sendButton = document.getElementById('send-btn');
const nameInput = document.getElementById('name');
const codeInput = document.getElementById('code');

// When the user clicks the connect button
connectButton.addEventListener('click', () => {
    const code = codeInput.value.trim();
    const name = nameInput.value.trim();

    if (code && name) {
        // Emit joinRoom event to backend with code and name
        socket.emit('joinRoom', { code, name });
    } else {
        alert('Please enter a name and code!');
    }
});

// Handle incoming messages from the server
socket.on('message', (msg) => {
    const messageElement = document.createElement('div');
    messageElement.textContent = msg;
    chatBox.appendChild(messageElement);
});

// Send a message when the "Send" button is clicked
sendButton.addEventListener('click', () => {
    const message = messageInput.value.trim();
    if (message) {
        socket.emit('sendMessage', message);
        messageInput.value = ''; // Clear message input field
    }
});
