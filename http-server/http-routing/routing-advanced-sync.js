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
  '/user/*': (client, params) => `parameter=${params[0]}`,
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

const matching = [];

for (key in routing) {
  if (key.includes('*')) {
    const rx = new RegExp(key.replace('*', '(.*)'));
    const route = routing[key];
    matching.push([rx, route]);
    delete routing[key];
  }
}

const router = (client) => {
  let param;
  let route = routing[client.req.url];

  if (!route) {
    for (let i = 0; i < matching.length; i++) {
      const rx = matching[i];
      param = client.req.url.match(rx[0]);

      if (param) {
        param.shift();
        route = rx[1];
        break;
      }
    }
  }

  const type = typeof route;
  const renderer = typesWithSerializers[type];
  return renderer(route, param, client);
};

const server = http.createServer((req, res) => {
  res.end(router({ req, res }));
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
