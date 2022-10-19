const { PassThrough } = require('stream');

let bytesWritten = 0;

const monitor = new PassThrough();

monitor.on('data', (chunk) => {
  bytesWritten += chunk.length;
});

monitor.on('finish', () => console.log(`${bytesWritten} bytes written`));

monitor.write('Hello world!');
monitor.end();