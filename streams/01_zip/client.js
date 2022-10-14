'use strict';

const path = require('node:path');
const http = require('node:http');
const zlib = require('node:zlib');
const fs = require('node:fs');
const crypto = require('node:crypto');

const fileName = process.argv[2];
const serverHost = process.argv[3];
const secret = Buffer.from(crypto.randomBytes(24).toString('hex'), 'hex');
const iv = crypto.randomBytes(16);

const filePath = path.resolve(process.cwd(), fileName);

console.log(process.cwd());

const httpReqOptions = {
  hostname: serverHost,
  port: 8001,
  path: '/',
  method: 'PUT',
  headers: {
    'Content-Type': 'application/octet-stream',
    'Content-Encoding': 'gzip',
    'X-Filename': path.basename(fileName),
    'X-Initialization-Vector': iv.toString('hex')
  }
};

const req = http.request(httpReqOptions, (res) => {
  console.log(`Server response\n ${console.dir(res)}`);
});

fs.createReadStream(filePath)
  .pipe(zlib.createGzip())
  .pipe(crypto.createCipheriv('aes192', secret, iv))
  .pipe(req)
  .on('finish', () => {
    console.log('File successfully sent');
  });
