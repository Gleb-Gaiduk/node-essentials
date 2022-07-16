const { calculatePrimes } = require('./culculations');
const { parentPort } = require('worker_threads');

parentPort.on('message', ({ multiplier, iterations }) => {
  const result = calculatePrimes(iterations, multiplier);
  parentPort.postMessage(result);
});
