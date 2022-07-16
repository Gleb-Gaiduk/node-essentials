const http = require('http');
const url = require('url');
const { Worker } = require('worker_threads');

const worker = new Worker('./worker.js');

const server = http.createServer((req, res) => {
  const reqUrl = url.parse(req.url, true).pathname;

  if (req.method === 'GET') {
    if (reqUrl === '/') {
      const message = {
        multiplier: 50,
        iterations: 100000
      };
      const startTime = new Date();

      worker.postMessage(message);
      worker.once('message', (result) => {
        const endTime = new Date();
        const responceData = JSON.stringify({
          message: result,
          time: endTime.getTime() - startTime.getTime()
        });

        res.statusCode = 200;
        res.end(responceData);
      });
    } else if (reqUrl === '/test') {
      res.statusCode = 200;
      res.write('<h1>I am unblocked now!</h1>');
      res.end();
    }
  }
});

server.listen(9000);
