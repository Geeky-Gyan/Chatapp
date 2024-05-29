const socket = io('https://chatapp-epir.onrender.com');
const form = document.getElementById('send-container');
const mssg = document.getElementById('mssg');
const mssgContainer = document.querySelector('.container');
const music = new Audio('tap-notification-180637.mp3');

const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message', position);
    mssgContainer.appendChild(messageElement);
    mssgContainer.scrollTop = mssgContainer.scrollHeight; 
};

const name = prompt('Enter your name to join');
socket.emit('new-user-joined', name);

socket.on('user-joined', (name) => {
    append(`${name} joined the chat`, 'right');
    music.play();  
});


form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = mssg.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    mssg.value = '';
    music.play();  
});

socket.on('receive', (data) => {
    append(`${data.name}: ${data.mssg}`, 'left');
    music.play(); 
});

socket.on('user-left', (name) => {
    append(`${name} left the chat`, 'left');
    music.play();  
});
