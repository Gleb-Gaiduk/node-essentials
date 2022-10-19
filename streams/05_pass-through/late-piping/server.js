const http = require('http');
const path = require('node:path');
const fs = require('node:fs');

function server() {
  return http.createServer((req, res) => {
    const fileName = path.basename(req.headers['x-filename']);
    const destFileName = path.join('received_files', fileName);

    req.pipe(fs.createWriteStream(destFileName)).on('finish', () => {
      res.writeHead(201, { 'Content-Type': 'text/plain' });
      res.end('OK');
      console.log(`File saved: ${destFileName}`);
    });
  });
}

server().listen(5000, () => console.log('Listen on 5000 port'));
