const fs = require('node:fs');
const { Transform, Readable } = require('node:stream');

function concatFiles(dest, files) {
  return new Promise((resolve, reject) => {
    const destStream = fs.createWriteStream(dest);

    Readable.from(files)
      .pipe(
        new Transform({
          objectMode: true,
          transform(fileName, enc, cb) {
            const src = fs.createReadStream(fileName);
            src.pipe(destStream, { end: false }); // not to close dest stream
            src.on('error', cb);
            src.on('end', cb);
          }
        })
      )
      .on('error', reject)
      .on('finish', () => {
        destStream.end();
        resolve();
      });
  });
}

module.exports.concatFiles = concatFiles;
