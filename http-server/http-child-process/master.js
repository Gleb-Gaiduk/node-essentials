// Recommended method for server scaling

const cp = require('child_process');
const os = require('os');

const pid = process.pid;
const cpusCount = os.cpus().length;

for (let i = 0; i < cpusCount; ) {
  cp.fork('./worker.js', [++i]);
}
