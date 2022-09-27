'use strict';

const path = require('node:path');
const server = require('./http.js');
const fsp = require('node:fs').promises;
// const server = require('./ws.js');

const apiPath = path.join(process.cwd(), './api');
const routing = {};

(async () => {
  const apiFiles = await fsp.readdir(apiPath);

  for (const fileName of apiFiles) {
    if (!fileName.endsWith('.js')) continue;
    const filePath = path.join(apiPath, fileName);
    const serviceName = path.basename(fileName, '.js');
    routing[serviceName] = require(filePath);
  }
  console.log(routing);
})();

server(routing, 8000);
