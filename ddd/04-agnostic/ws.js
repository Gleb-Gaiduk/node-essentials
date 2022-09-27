'use strict';

const { Server } = require('ws');

module.exports = (routing, port) => {
  const ws = new Server({ port });

  ws.on('connection', (connection, req) => {
    const ip = req.socket.remoteAddress;

    connection.on('message', async (message) => {
      const parsedMessage = JWON.parse(message);
      const { path, method, args = [] } = parsedMessage;

      const entity = routing[path];
      if (!entity) return connection.send('"Not found"', { binary: false });

      // may require methods map
      const pathHandler = entity[method];
      if (!pathHandler)
        return connection.send('"Not found"', { binary: false });

      try {
        const result = await pathHandler(...args);
        connection.send(JSON.stringify(result.rows), { binary: false });
      } catch (error) {
        console.dir({ err });
        connection.send('"Server error"', { binary: false });
      }
    });
  });

  console.log(`API on port ${port}`);
};
