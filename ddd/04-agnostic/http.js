'use strict';

const http = require('node:http');

const parseBody = async (req) => {
  const buffers = [];
  for await (const chunk of req) buffers.push(chunk);
  const data = Buffer.concat(buffers).toString();
  return JSON.parse(data);
};

const methodsMap = {
  GET: 'read',
  POST: 'create'
};

module.exports = (routing, port) => {
  http
    .createServer(async (req, res) => {
      const { method, url } = req;
      const [path, id] = url.substring(1).split('/');

      if (!path in routing) res.end('Not found');

      const entity = routing[path];
      if (!entity) res.end('Not found');

      const pathHandler = entity[methodsMap[method]];
      if (!pathHandler) res.end('Not found');

      const pathHandlerCode = pathHandler.toString();
      const pathHandlerArgsSubstring = pathHandlerCode.substring(
        0,
        pathHandlerCode.indexOf(')')
      );

      const pathHandlerArgs = [];

      if (id) pathHandlerArgs.push(id);
      if (pathHandlerArgsSubstring.includes('{')) {
        const parsedReqBody = await parseBody(req);
        pathHandlerArgs.push(parsedReqBody);
      }

      const result = await pathHandler(...pathHandlerArgs);
      res.end(JSON.stringify(result.rows));
    })
    .listen(port);

  console.log(`API on port ${port}`);
};
