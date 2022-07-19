const http = require('http');
const cluster = require('cluster');
const os = require('os');

const PORT = 2000;

const user = { name: 'Hleb', age: 23 };
const pid = process.pid;

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

if (cluster.isMaster) {
  const cpuCount = os.cpus().length;

  for (let i = 0; i < cpuCount; i++) {
    cluster.fork();
  }
} else {
  const id = cluster.Worker.id;
  // createServer will be created and listened in the master process, in child process it will be simulated
  // in child processes, process handler will be passed from master process
  http
    .createServer((req, res) => {
      const data = routing[req.url];
      const type = typeof data;
      const serializer = typesWithSerializers[type];
      res.setHeader('Process-Id', pid);
      res.end(serializer(data, req, res));
    })
    .listen(PORT);
}
