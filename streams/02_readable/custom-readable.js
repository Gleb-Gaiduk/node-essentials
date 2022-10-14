const Chance = require('chance');
const { Readable } = require('stream');

const random = new Chance();

class RandomStream extends Readable {
  constructor(options) {
    super(options);
    this.emittedBytes = 0;
  }

  _read(size) {
    const chunk = random.string({ length: size });
    this.push(chunk, 'utf-8');
    this.emittedBytes += chunk.length;

    if (random.bool({ likelihood: 5 })) this.push(null);
  }
}

randomStream = new RandomStream();
randomStream
  .on('data', (chunk) => {
    console.log(chunk.toString());
  })
  .on('end', () => console.log('End of stream'));
