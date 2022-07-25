'use strict';

const http = require('http');

const url = 'http://ietf.org/';

http.get(url, (result) => {
  console.log('Headers we sent: ', result.req._headers);
  console.log('Headers we received: ', result.headers);

  if (result.statusCode !== 200) {
    console.log(`Status code: ${result.statusCode} ${result.statusMessage}`);
    return;
  }

  result.setEncoding('utf-8');

  const lines = [];

  result.on('data', (chunk) => {
    lines.push(chunk);
  });

  result.on('end', () => {
    console.log(lines.join());
  });
});
