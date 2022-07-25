'use strict';

const https = require('https');
const fs = require('fs');
const path = require('path');

const url = 'https://www.ietf.org/';

https.get(url, (res) => {
  console.log(res.req._header);
  console.dir(res.headers);

  if (res.statusCode !== 200) {
    console.log(`Status code: ${res.statusCode} ${res.statusMessage}`);
    return;
  }

  res.setEncoding('utf-8');

  const lines = [];

  res.on('data', (chunk) => {
    lines.push(chunk);
  });

  res.on('end', () => {
    const data = lines.join();
    console.log({ size: data.length, chunks: lines.length });

    fs.writeFile(path.join(__dirname, 'content.html'), data, () => {
      console.log('Saved to file: content.html');
    });
  });
});
