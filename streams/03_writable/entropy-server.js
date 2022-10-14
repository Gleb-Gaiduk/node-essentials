const http = require('node:http');
const Chance = require('chance');

const random = new Chance();

const server = http.createServer((req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/plain'
  });

  function generateMore() {
    while (random.bool({ likelihood: 80 })) {
      const randomChunk = random.string({ length: 16 * 1024 - 1 });
      const shouldContinue = res.write(`${randomChunk}\n`);

      if (!shouldContinue) {
        console.log('Back pressure!');
        return res.on('drain', generateMore);
      }
    }
    res.end('/n/n');
  }

  generateMore();
  res.on('finish', () => console.log('Stream finished'));
});

server.listen(8000);
