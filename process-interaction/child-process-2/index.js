const http = require('http');
const { fork } = require('child_process');
const url = require('url');

const server = http.createServer((req, res) => {
  const reqUrl = url.parse(req.url, true).pathname;

  if (req.method === 'GET') {
    if (reqUrl === '/') {
      const message = {
        multiplier: 50,
        iterations: 100000
      };

      childProcess = fork('child-process.js');
      childProcess.on('exit', (code) => {
        console.log('Worker exited: ', childProcess.pid, code);
      });
      childProcess.send(message);

      const startTime = new Date();

      childProcess.on('message', (result) => {
        const endTime = new Date();
        res.statusCode = 200;
        res.write(
          JSON.stringify({
            message: result,
            time: endTime.getTime() - startTime.getTime()
          })
        );
        res.end();
      });
    } else if (reqUrl === '/test') {
      res.statusCode = 200;
      res.write('<h1>I am unblocked now!</h1>');
      res.end();
    }
  }
});

server.listen(9000);
