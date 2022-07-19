'use strict';

const dns = require('dns');

dns.resolve('HOW.PROGRAMMING.WORKS', (err, data) => {
  if (err) {
    if (err.code === 'ECONNREFUSED') {
      console.log('no internet connection');
    } else {
      console.log('Web is dead');
    }
  }

  console.log({ data });
});

dns.resolveAny('github.com', (err, data) => {
  if (err) throw err;

  console.log({ data });
});
