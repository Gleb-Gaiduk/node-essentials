const axios = require('axios');

async function uploadFile(fileName, contentStream) {
  console.log(contentStream);

  return axios.post('http://localhost:3000', contentStream, {
    headers: {
      'Content-Type': 'application/octet-stream',
      'X-Filename': fileName
    }
  });
}

module.exports.uploadFile = uploadFile;
