'use strict';

const net = require('net');

const onData = (data, ...args) => {
  console.dir({ args });
  console.log('📧: ' + data);
};

// Each time a user connects via TCP protocol, a new client  socket instance is created and passed to callbacl
const server = net
  .createServer((socket) => {
    console.dir(socket.address());

    socket.write('❤️');
    socket.on('data', onData);
    socket.on('error', (err) => {
      console.log('Socket error', err);
    });
  })
  .listen(2000);

server.on('error', (err) => {
  console.log('Server error', err);
});
