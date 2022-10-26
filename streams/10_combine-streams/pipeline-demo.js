const fs = require('node:fs');
const stream = require('node:stream');
const assert = require('node:assert');

const sreamA = fs.createReadStream('source.txt');
const streamB = new stream.Transform({
  transform(chunk, enc, onDone) {
    this.push(chunk.toString().toUpperCase());
    onDone();
  }
});
const streamC = fs.createWriteStream('results.txt');

const pipelineReturn = stream.pipeline(sreamA, streamB, streamC, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
});

assert.strictEqual(streamC, pipelineReturn);
