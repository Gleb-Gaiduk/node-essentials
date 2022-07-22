const http = require('http');

const Client = require('./client.js');
const Session = require('./session.js');

const routing = {
  '/': async (client) => '<h1>Welcome to homepage</h1>',
  '/start': async (client) => {
    Session.start(client);
    return `Session token is: ${client.token}`;
  },
  '/destroy': async (client) => {
    const result = `Session destroyed: ${client.token}`;
    Session.delete(client);
    return result;
  },
  '/api/method1': async (client) => {
    if (client.session) {
      client.session.set('method1', 'called');
      return { data: 'example result' };
    } else {
      return { data: 'access is denied' };
    }
  },
  '/api/method2': async (client) => ({
    url: client.req.url,
    headers: client.req.headers
  }),
  '/api/method3': async (client) => {
    if (client.session) {
      return client.session.entries();
    }

    return 'No sesssion found';
  }
};

const serializersByType = {
  object: JSON.stringify,
  string: (s) => s,
  number: (n) => n.toString(),
  undefined: () => 'Not found'
};

const server = http
  .createServer((req, res) => {
    const client = new Client(req, res);
    const { method, url, headers } = req;
    const routeController = routing[url];

    res.on('finish', () => {
      if (client.session) {
        client.session.save();
      }
    });

    if (!routeController) {
      res.statusCode = 404;
      res.end('Not found 404');
    }

    if (routeController) {
      routeController(client)
        .then((data) => {
          const controllerResultType = typeof data;
          const controllerResultSerializer =
            serializersByType[controllerResultType];

          const serializedResult = controllerResultSerializer(data);
          // Cookies have been already formed by that line
          client.sendCookie();
          res.end(serializedResult);
        })
        .catch((err) => {
          res.statusCode = 500;
          res.end('Internal Server Error 500');
        });
    }
    return;
  })
  .listen(2000);
