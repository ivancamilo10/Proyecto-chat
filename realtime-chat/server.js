const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
  console.log('Usuario conectado:', socket.id);

  socket.on('join', (username) => {
    socket.data.username = username;
    socket.broadcast.emit('system-message', `${username} se ha unido al chat`);
  });

  socket.on('chat-message', (msg) => {
    const username = socket.data.username || 'Anónimo';
    io.emit('chat-message', {
      username,
      message: msg,
      time: new Date().toLocaleTimeString()
    });
  });

  socket.on('disconnect', () => {
    const username = socket.data.username;
    if (username) {
      socket.broadcast.emit('system-message', `${username} ha salido del chat`);
    }
    console.log('Usuario desconectado:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
