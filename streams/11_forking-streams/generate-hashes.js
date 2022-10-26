const fs = require('node:fs');
const crypto = require('node:crypto');

const fileName = process.argv[2];

const sha1Stream = crypto.createHash('sha1').setEncoding('hex');
const md5Stream = crypto.createHash('md5').setEncoding('hex');
const inputStream = fs.createReadStream(fileName);

inputStream.pipe(sha1Stream).pipe(fs.createWriteStream(`${fileName}.sha1`));
inputStream.pipe(md5Stream).pipe(fs.createWriteStream(`${fileName}.md5`));
