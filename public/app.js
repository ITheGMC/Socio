const socket = io('https://chatted-yu4w.onrender.com'); // Render backend URL

// Landing page elements
const landingPage = document.getElementById('landing-page');
const chatRoom = document.getElementById('chat-room');
const chatCodeSpan = document.getElementById('chat-code');
const nameInput = document.getElementById('name');
const joinCodeInput = document.getElementById('join-code');
const connectBtn = document.getElementById('connect-btn');

// Chatroom elements
const chatWindow = document.getElementById('chat-window');
const statusIndicator = document.getElementById('status-indicator');
const messageInput = document.getElementById('message');
const sendBtn = document.getElementById('send-btn');

// Generate a random 6-character code
const generateCode = () => {
    return Math.random().toString(36).substr(2, 6).toUpperCase();
};

let chatCode = generateCode();
chatCodeSpan.textContent = chatCode;

// Event: Connect to a chatroom
connectBtn.addEventListener('click', () => {
    const name = nameInput.value.trim();
    const joinCode = joinCodeInput.value.trim();

    if (!name) {
        alert('Please enter your name.');
        return;
    }

    const roomCode = joinCode || chatCode;
    socket.emit('join-room', { name, roomCode });
    landingPage.style.display = 'none';
    chatRoom.style.display = 'block';
});

// Send messages
sendBtn.addEventListener('click', () => {
    const message = messageInput.value.trim();
    if (message) {
        socket.emit('send-message', message);
        addMessage(`You: ${message}`);
        messageInput.value = '';
    }
});

// Display messages
const addMessage = (msg) => {
    const messageElement = document.createElement('p');
    messageElement.textContent = msg;
    chatWindow.appendChild(messageElement);
    chatWindow.scrollTop = chatWindow.scrollHeight;
};

// Typing indicator
messageInput.addEventListener('input', () => {
    socket.emit('typing', true);
});

messageInput.addEventListener('blur', () => {
    socket.emit('typing', false);
});

// Socket event listeners
socket.on('receive-message', (msg) => addMessage(msg));

socket.on('update-status', (status) => {
    statusIndicator.textContent = status;
});

socket.on('typing', (isTyping) => {
    statusIndicator.textContent = isTyping ? 'The other user is typing...' : '';
});
