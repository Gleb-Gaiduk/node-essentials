'use strict';

const http = require('http');
const path = require('path');
const fs = require('fs');

global.memory = new Map();
const api = new Map();

const apiPath = './api/';

const cacheFile = (name) => {
  const filePath = apiPath + name;

  try {
    const libPath = require.resolve(filePath);
    delete require.cache[libPath];
  } catch (err) {
    return;
  }

  try {
    const method = require(filePath);
    const key = path.basename(filePath, '.js');
    api.set(key, method);
  } catch (err) {
    api.delete(name);
  }
};

const cacheFolder = (path) => {
  fs.readdir(path, (err, files) => {
    if (err) return;
    files.forEach(cacheFile);
  });
};

const watch = (path) => {
  fs.watch(path, (event, file) => {
    cacheFile(file);
  });
};

cacheFolder(apiPath);
watch(apiPath);

http
  .createServer(async (req, res) => {
    const url = req.url === '/' ? '/index.html' : req.url;
    const [_, folder, file] = url.split('/');

    if (folder === 'api') {
      const method = api.get(file);
      const body = [];

      req.on('data', (chunk) => {
        body.push(chunk);
      });

      req.on('end', async () => {
        const data = body.join('');
        const args = JSON.parse(data);

        try {
          const result = await method(...args);

          if (!result) {
            res.statusCode = 500;
            res.end('"Server error"');
            return;
          }

          res.end(JSON.stringify(result));
        } catch (err) {
          console.log(err);
          res.statusCode = 500;
          res.end('"Server error"');
        }
      });
    } else {
      const path = `./static/${folder}`;

      try {
        const data = await fs.promises.readFile(path);
        res.end(data);
      } catch (error) {
        res.statusCode = 404;
        res.end('"File is not found"');
      }
    }
  })
  .listen(8000);
