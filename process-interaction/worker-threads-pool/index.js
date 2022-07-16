const http = require('http');
const url = require('url');
const { StaticPool } = require('node-worker-threads-pool');
const numCPUs = require('os').cpus().length;

const server = http.createServer(async (req, res) => {
  const reqUrl = url.parse(req.url, true).pathname;

  const filePath = './worker.js';
  const pool = new StaticPool({
    size: numCPUs,
    task: filePath,
    workerData: {}
  });

  if (req.method === 'GET') {
    if (reqUrl === '/') {
      const startTime = new Date();
      const message = {
        multiplier: 50,
        iterations: 100000
      };

      try {
        const result = await pool.exec(message);
        const endTime = new Date();

        const responceData = JSON.stringify({
          message: result,
          time: endTime.getTime() - startTime.getTime()
        });

        res.statusCode = 200;
        res.end(responceData);
      } catch (error) {
        console.log(error);
        process.exit(0);
      }
    } else if (reqUrl === '/test') {
      res.statusCode = 200;
      res.write('<h1>I am unblocked now!</h1>');
      res.end();
    }
  }
});

server.listen(9000);
