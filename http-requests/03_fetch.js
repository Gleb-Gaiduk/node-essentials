'use strict';

const { log } = require('console');
const http = require('http');
const https = require('https');

const fetch = (url) =>
  new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;

    protocol.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(
          new Error(`Status code:  ${res.statusCode} ${res.statusMessage}`)
        );
      }

      res.setEncoding('utf-8');
      const lines = [];

      res.on('data', (chunk) => lines.push(chunk));
      res.on('end', () => {
        const data = lines.join();
        resolve(data);
      });
    });
  });

fetch('https://www.ietf.org/')
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log(err);
  });
