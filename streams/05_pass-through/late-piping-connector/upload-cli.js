const fs = require('node:fs');
const path = require('node:path');
const { createUploadFileStream } = require('./upload-file');
const stream = require('node:stream');

const filePath = process.argv[2];
const fileName = path.basename(filePath);

stream.pipeline(
  fs.createReadStream(filePath),
  createUploadFileStream(fileName),
  (err) => {
    console.error(err);
    process.exit(1);
  }
);
