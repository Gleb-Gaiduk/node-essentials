const { concatFiles } = require('./concat-files.js');

// to run the script:
// node concat.js <destination> <source1> <source2> <source3> ...

async function main() {
  try {
    await concatFiles(process.argv[2], process.argv.slice(3));
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();
