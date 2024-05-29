const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
app.use(cors());

// Serve static files from the "client" directory
const __dirname1 = path.resolve();
app.use(express.static(path.join(__dirname1, "client")));

// Fallback to index.html for all non-static requests
app.get("*", (req, res) => {
  if (!req.path.startsWith('/api/')) {
    res.sendFile(path.resolve(__dirname1, "client", "index.html"));
  }
});

const port = process.env.PORT || 8000;
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const users = {};

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('new-user-joined', (name) => {
    console.log("New user joined:", name);
    users[socket.id] = name;
    socket.broadcast.emit('user-joined', name);
  });

  socket.on('send', (message) => {
    socket.broadcast.emit('receive', { mssg: message, name: users[socket.id] });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
    socket.broadcast.emit('user-left', users[socket.id]);
    delete users[socket.id];
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
