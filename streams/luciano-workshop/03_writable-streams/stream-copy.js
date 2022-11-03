const fs = require('node:fs');

const [,, src, dest] = process.argv;

const srcStream = fs.createReadStream(src);
const destStream = fs.createWriteStream(dest);

srcStream.on('data', data => {
  const canContinue = destStream.write(data);

  if(!canContinue) {
    srcStream.pause();
    destStream.once('drain', () => srcStream.resume())
  }
})