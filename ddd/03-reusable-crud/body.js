'use strict';

const receiveArgsFromBody = async (req) => {
  const buffers = [];
  for await (const chunk of req) buffers.push(chunk);
  const data = Buffer.concat(buffers).toString();

  return JSON.parse(data);
};

module.exports = receiveArgsFromBody;
