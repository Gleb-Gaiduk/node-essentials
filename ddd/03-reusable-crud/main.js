'use strict';

const http = require('node:http');
const db = require('./db.js');
const receiveArgsFromBody = require('./body.js');

const PORT = 8000;

const routing = {
  users: db('users')
};

const crud = { get: 'read', post: 'create', put: 'update', delete: 'delete' };

// Front controller - single entry point
http
  .createServer(async (req, res) => {
    const { method, url, socket } = req;
    // Examples
    // method: GET
    // url /users

    const [subdirectory, id] = url.substring(1).split('/');

    const entity = routing[subdirectory];
    if (!entity) return res.end('Not found');

    const procedure = crud[method.toLowerCase()];

    const handler = entity[procedure];
    if (!handler) return res.end('Not found');

    const handlerCode = handler.toString();
    const handlerCodeParamsSubstring = handlerCode.substring(
      0,
      handlerCode.indexOf(')')
    );
    const handlerArgs = [];

    if (handlerCodeParamsSubstring.includes('(id')) handlerArgs.push(id);
    if (handlerCodeParamsSubstring.includes('{')) {
      const reqBody = await receiveArgsFromBody(req);
      handlerArgs.push(reqBody);
    }

    const result = await handler(...handlerArgs);

    res.end(JSON.stringify(result.rows));
  })
  .listen(PORT);
