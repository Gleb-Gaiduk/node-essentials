const fsp = require('node:fs').promises;


// When we use fs.readFile we load all the binary content from the file in memory
// using a Buffer object. Buffers are, by design, limited in size as they live in memory.
async function copyFile(src, dest) {
  const sourceContent = await fsp.readFile(src);
  return fsp.writeFile(dest, sourceContent);
}

const [,, src, dest] = process.argv;

copyFile(src, dest)
  .then(() => console.log('Copied!'))
  .catch(err => {
    console.error(err);
    process.exit(1);
  })