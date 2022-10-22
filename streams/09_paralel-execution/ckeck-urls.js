const { pipeline } = require('node:stream');
const fs = require('node:fs');
const { ParallelStream } = require('./paralel-stream.js');
const { LimitedParallelStream } = require('./limited-paralel-stream.js');
const axios = require('axios');
const { parse } = require('csv-parse');

const fileSrc = process.argv[2];

async function ckeckUrl(urlObj, enc, push, onDone) {
  const { url } = urlObj;
  if (!url) return onDone();
  try {
    const res = await axios.head(url);
    push(`${url}, Valid: ${new Date().toISOString()} \n`);
  } catch (err) {
    push(`${url}, Invalid: ${new Date().toISOString()}`);
  }
  onDone();
}

const csvParser = parse({ columns: true });

pipeline(
  fs.createReadStream(fileSrc),
  csvParser,
  // new ParallelStream(ckeckUrl),
  new LimitedParallelStream(ckeckUrl, 5),
  fs.createWriteStream('results.txt'),
  (err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    console.log('All URLs have been checked');
  }
);
