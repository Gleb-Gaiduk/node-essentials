'use strict';

const net = require('net');

const socket = new net.Socket();

const send = (message) => {
  console.log('Client sends ' + message);
  socket.write(message);
};

socket.on('data', (data) => {
  console.log('Received from server: ' + data.toString());
});

socket.on('drain', () => {
  console.log('🔓');
});

socket.on('end', () => {
  console.log('Client disconnected 🏁');
  console.dir({
    bytesRead: socket.bytesRead,
    bytesWritten: socket.bytesWritten
  });
});

socket.on('error', (err) => {
  console.log('Socket error on server 💩');
  console.log(err);
});

socket.on('timeout', () => {
  console.log('Socket timeout ⌛');
});

socket.on('connect', () => {
  send('💏');
  send('💏');
  send('💏');
  send('💏');
  send('💏');
});

socket.connect({
  port: 2000,
  host: '127.0.0.1'
});
