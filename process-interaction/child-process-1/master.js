'use strict';

const os = require('os');
const cp = require('child_process');

console.log('Started master: ', process.pid);

const cpuCount = os.cpus().length;
const workers = [];

for (let index = 0; index < cpuCount; index++) {
  // A new Node process is run and a new js file is loaded inside that process
  const worker = cp.fork('./worker.js');
  // Worker is an instance of process
  console.log('Started worker: ', worker.pid);
  workers.push(worker);
}

const tasks = [2, 17, 3, 2, 5, 7, 15, 22, 15, 14, 11, 0, 9];
const results = [];

workers.forEach((worker) => {
  // Passed object will be serialized to JSON
  worker.send({ tasks });

  worker.on('exit', (code) => {
    console.log('Worker exited: ', worker.pid, code);
  });

  worker.on('message', (message) => {
    console.log('Message from worker', worker.pid);
    console.log(message);

    results.push(message.result);

    if (results.length === cpuCount) {
      process.exit(0);
    }
  });

  setTimeout(() => process.exit(1), 5000);
});
