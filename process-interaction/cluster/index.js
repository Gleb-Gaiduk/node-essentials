const http = require('http');
const url = require('url');
const cluster = require('cluster');
const { calculatePrimes } = require('./culculations');
const numCPUs = require('os').cpus().length;

const server = http.createServer((req, res) => {
  const reqUrl = url.parse(req.url, true).pathname;

  if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);

    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }

    cluster.on('exit', (worker) => {
      console.log(`A worker with ID ${worker.process.pid} died.`);
    });
  } else {
    if (req.method === 'GET') {
      if (reqUrl === '/') {
        const args = {
          multiplier: 50,
          iterations: 100000
        };
        const startTime = new Date();
        const result = calculatePrimes(args);
        const endTime = new Date();
        const responceData = JSON.stringify({
          message: result,
          time: endTime.getTime() - startTime.getTime()
        });

        res.statusCode = 200;
        res.end(responceData);
      } else if (reqUrl === '/test') {
        res.statusCode = 200;
        res.write('<h1>I am unblocked now!</h1>');
        res.end();
      }
    }
  }
});

server.listen(9000);
