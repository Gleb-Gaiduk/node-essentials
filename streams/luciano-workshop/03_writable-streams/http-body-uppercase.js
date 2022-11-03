const http = require('node:http');

http.createServer((req, res) => {
  req.on('data', (chunk) => {
    console.log(chunk);
    const canContinue = res.write(chunk.toString().toUpperCase());

    if(!canContinue) {
      req.pause();
      res.once('drain', () => req.resume());
    }

    req.on('end', () => res.end());
  })
}).listen(8000);