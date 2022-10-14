const { Readable } = require('stream');

const mountains = [
  { name: 'Everest', height: 8848 },
  { name: 'K2', height: 8611 }
];

const mountainsStream = Readable.from(mountains);

mountainsStream.on('data', (mountain) => {
  console.log(mountain);
});
