'use strict';

console.log('Hello form worker: ', process.pid);

const calculations = (item) => item * 2;

process.on('message', (message) => {
  console.log('Message to worker ', process.pid);
  console.log('from master: ', message);

  const result = message.tasks.map(calculations);
  process.send({ result });
});
