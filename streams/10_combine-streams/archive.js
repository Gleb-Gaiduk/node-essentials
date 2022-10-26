const fs = require('node:fs');
const stream = require('node:stream');
const crypto = require('node:crypto');
const {
  createCompressAndEncrypt,
  createDecryptAndDecompress
} = require('./combined-streams');
const { createWriteStream } = require('node:fs');

const [, , password, source] = process.argv;
const iv = crypto.randomBytes(16);
const destination = `${source}.gz.enc`;

stream.pipeline(
  fs.createReadStream(source),
  createCompressAndEncrypt(password, iv),
  createWriteStream(destination),
  (err) => {
    if (err) {
      console.log(err);
      process.exit(1);
    }
  }
);
