const buffer = require('node:buffer');

const biggestBuffer = Buffer.alloc(buffer.constants.MAX_LENGTH);
console.log(biggestBuffer);