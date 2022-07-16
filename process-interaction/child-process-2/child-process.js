const { calculatePrimes } = require('./calculations.js');

process.on('message', ({ multiplier, iterations }) => {
  console.log('Message to child: ');
  const result = calculatePrimes(iterations, multiplier);

  process.send(result);
  process.exit(1);
});
