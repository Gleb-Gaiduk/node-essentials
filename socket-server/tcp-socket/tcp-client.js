'use strict';

const net = require('net');

const socket = new net.Socket();

const onData = (data) => {
  console.log('📧: ' + data);
};

socket.on('data', onDate);

socket.connect(
  {
    port: 2000,
    host: '127.0.0.1'
  },
  () => {
    socket.write('😘');
  }
);
