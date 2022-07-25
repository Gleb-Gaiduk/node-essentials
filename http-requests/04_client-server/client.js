'use strict';

const http = require('http');

const ajax = (baseUrl, methods) => {
  const api = {};

  for (const method of methods) {
    api[method] = (...args) => {
      const callback = args.pop();
      const url = baseUrl + method + '/' + args.join('/');

      http.get(url, (res) => {
        if (res.statusCode !== 200) {
          callback(new Error(`Status code: ${res.statusCode}`));
          return;
        }

        const buffer = [];

        res.on('data', (chunk) => {
          buffer.push(chunk);
        });

        res.on('end', () => callback(null, JSON.parse(buffer.join())));
      });
    };
  }

  return api;
};

// Usage

const api = ajax('http://localhost:2000/api/', ['user', 'userBorn']);

api.user('marcus', (err, data) => {
  if (err) throw err;
  console.dir({ data });
});

api.userBorn('hleb', (err, data) => {
  if (err) throw err;
  console.dir({ data });
});
