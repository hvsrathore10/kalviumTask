// app.js (Node.js)
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let currentPage = 1;  // Start on page 1
let adminSocketId = null;

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Set the first connected user as admin (for simplicity)
  if (!adminSocketId) {
    adminSocketId = socket.id;
    socket.emit('setAdmin');
  }

  // Sync the new user to the current page
  socket.emit('pageChange', currentPage);

  // Listen for page change from admin
  socket.on('pageChange', (page) => {
    if (socket.id === adminSocketId) {  // Only the admin can change pages
      currentPage = page;
      io.emit('pageChange', page); // Broadcast to all users
    }
  });

  socket.on('disconnect', () => {
    if (socket.id === adminSocketId) {
      adminSocketId = null;
    }
    console.log('User disconnected:', socket.id);
  });
});

server.listen(3000, () => {
  console.log('Server listening on port 3000');
});
