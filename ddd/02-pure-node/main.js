'use strict';

const http = require('node:http');
const pg = require('pg');
const hash = require('./hash.js');
const receiveArgsFromBody = require('./body.js');

const PORT = 8000;

const pool = new pg.Pool({
  host: '127.0.0.1',
  port: 5432,
  database: 'example',
  user: 'marcus',
  password: 'marcus'
});

const routing = {
  users: {
    async post({ login, password }) {
      const sql = 'INSERT INTO users (login, password) VALUES ($1, $2)';
      const passwordHash = await hash(password);
      return pool.query(sql, [login, passwordHash]);
    },

    get() {
      const sql = 'SELECT * FROM users;';
      return pool.query(sql);
    }
  }
};

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

    const handler = entity[method.toLowerCase()];
    if (!handler) return res.end('Not found');

    const handlerCode = handler.toString();
    const handlerCodeParamsSubstring = handlerCode.substring(
      0,
      handlerCode.indexOf(')')
    );
    const handlerArgs = [];
    const reqBody = await receiveArgsFromBody(req);

    if (handlerCodeParamsSubstring.includes('(id')) handlerArgs.push(id);
    handlerArgs.push(reqBody);

    console.log(handlerArgs);

    const result = await handler(...handlerArgs);

    res.end(JSON.stringify(result.rows));
  })
  .listen(PORT);
