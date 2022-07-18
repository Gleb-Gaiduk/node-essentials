'use strict';

const dgram = require('dgram');

const server = dgram.createSocket('udp4');

server.on('message', (msg, info) => {
  console.dir({ msg, info });
});

server.bind(3000);
