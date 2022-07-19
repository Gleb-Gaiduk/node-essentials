'use strict';

const http = require('http');

const BASE_PORT = 2000;

const pid = process.pid;
const id = parseInt(process.argv[2], 10);
const port = BASE_PORT + id - 1;

const user = { name: 'Hleb', age: 23 };

const routing = {
  '/': '<h1>Welcome to homepage</h1>',
  '/user': user,
  '/user/name': () => user.name.toUpperCase(),
  '/user/age': () => user.age
};

const typesWithSerializers = {
  object: JSON.stringify,
  string: (string) => string,
  number: (number) => number.toString(),
  undefined: () => 'not found',
  function: (fn, params, client) => JSON.stringify(fn(req, res))
};

http
  .createServer((req, res) => {
    const routeHandlerData = routing[req.url];
    const routeHandlerDataType = typeof routeHandlerData;
    const serializer = typesWithSerializers[routeHandlerDataType];
    res.setHeader('Process-id', process.pid);
    res.end(serializer(routeHandlerData, req, res));
  })
  .listen(port);
