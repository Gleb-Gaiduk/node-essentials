'use strict';

const http = require('http');

const hostname = '127.0.0.1';
const port = 8000;
const user = { name: 'Hleb', age: 22 };

const routing = {
  '/': '<h1>Welcome to homepage</h1>',
  '/user': user,
  '/user/name': () => user.name.toUpperCase(),
  '/user/age': () => user.age,
  '/hello': { hello: 'world' },
  '/api/method1': (req, res) => {
    console.log(req.url + ' ' + res.statusCode);
    return { status: res.statusCode };
  },
  '/api/method2': (req) => ({
    user,
    url: req.url,
    cookie: req.headers.cookie
  })
};

const typesWithSerializers = {
  object: JSON.stringify,
  string: (string) => string,
  number: (number) => number.toString(),
  undefined: () => 'not found',
  function: (fn, req, res) => JSON.stringify(fn(req, res))
};

const server = http.createServer((req, res) => {
  const dataFromRoute = routing[req.url];
  const dataFromRouteType = typeof dataFromRoute;
  const dataSerializer = typesWithSerializers[dataFromRouteType];
  const result = dataSerializer(dataFromRoute, req, res);
  res.end(result);
});

server.listen(port, hostname, () => {
  console.log(`Server is running at http://${hostname}:${port}/`);
});

server.on('clientError', (err, socket) => {
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});

server.on('error', (err) => {
  if (err.code === 'EACCES') {
    console.log(`No access to the port: ${port}`);
  } else {
    console.log(err);
  }
});
