const fs = require('node:fs');
const path = require('node:path');
const { PassThrough } = require('node:stream');
const { createBrotliCompress } = require('node:zlib');
const { uploadFile } = require('./upload-file');

const filePath = process.argv[2];
const fileName = path.basename(filePath);
const contentStream = new PassThrough();

(async () => {
  try {
    const result = await uploadFile(`${fileName}.br`, contentStream);
    console.log(`Server response: ${result.data}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
})();

fs.createReadStream(filePath).pipe(createBrotliCompress()).pipe(contentStream);
