const axios = require('axios');
const stream = require('node:stream');

function createUploadFileStream(fileName) {
  const connector = new stream.PassThrough();

  axios
    .post('http://localhost:3000', connector, {
      headers: {
        'Content-Type': 'application/octet-stream',
        'X-Filename': fileName
      }
    })
    .catch((err) => {
      console.log(err);
      connector.emit(err);
    });

  return connector;
}

module.exports.createUploadFileStream = createUploadFileStream;
