'use strict';

const path = require('node:path');
const http = require('node:http');
const zlib = require('node:zlib');
const fs = require('node:fs');
const crypto = require('node:crypto');

const secret = crypto.randomBytes(24);

const server = http
  .createServer((req, res) => {
    const fileName = path.basename(req.headers['x-filename']);
    const destFilename = path.resolve(process.cwd(), 'storage', fileName);
    console.log(`File request received: ${fileName}`);

    const iv = Buffer.from(req.headers['x-initialization-vector']);
    console.log('iv: ', iv);

    req
      .pipe(crypto.createDecipheriv('aes192', secret, iv))
      .pipe(zlib.createGunzip())
      .pipe(fs.createWriteStream(destFilename))
      .on('error', (err) => console.log(err))
      .on('finish', () => {
        res.writeHead(201, { 'Content-Type': 'text/plain' });
        res.end('OK\n');
        console.log(`File saved: ${destFilename}`);
      });
  })
  .listen(8001, () => console.log('Listening on 8001'));

server.on('error', (error) => console.log(error));
