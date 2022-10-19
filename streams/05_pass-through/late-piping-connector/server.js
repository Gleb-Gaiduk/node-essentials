const http = require('http');
const path = require('node:path');
const fs = require('node:fs');

function server() {
  return http.createServer((req, res) => {
    const fileName = path.basename(req.headers['x-filename']);
    const destFilename = path.join('received_files', fileName);

    req.pipe(fs.createWriteStream(destFilename)).on('finish', () => {
      res.writeHead(201, { 'Content-Type': 'text/plain' });
      res.end('OK');
    });
  });
}

server().listen(3000, () => console.log('Listen on 3000 port'));
