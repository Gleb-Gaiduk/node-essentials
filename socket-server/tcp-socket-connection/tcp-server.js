'use strict';

const net = require('net');

// Collect all the info we need about a socket
const connection = (socket) => {
  console.dir({
    localAddress: socket.localAddress,
    localPort: socket.localPort,
    remoteAddress: socket.remoteAddress,
    remoteFamily: socket.remoteFamily,
    remotePort: socket.remotePort,
    bufferSize: socket.bufferSize
  });

  socket.write('❤️');

  socket.on('data', (data) => {
    console.log('📧: ' + data);
  });

  // drain event: data flow is finished - socket is open now
  socket.on('drain', () => {
    console.log('🔓');
  });

  // Client disconnected
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
};

const server = net.createServer();
server.on('connection', connection);
server.listen(2000);
