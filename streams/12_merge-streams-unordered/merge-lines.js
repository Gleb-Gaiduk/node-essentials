const fs = require('node:fs');


const [, , destination, ...filePaths] = process.argv;
const destinationStream = fs.createWriteStream(destination);

let endCount = 0;
const filesLength = filePaths.length;

for (const filePath of filePaths) {
  const sourceStream = fs.createReadStream(filePath, { highWaterMark: 16 });
  sourceStream.on('end', () => {
    if (++endCount === filesLength) {
      destinationStream.end();
    }
  });
  sourceStream.pipe(destinationStream, { end: false });
}
