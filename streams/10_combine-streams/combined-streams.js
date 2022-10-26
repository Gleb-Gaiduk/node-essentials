const zlib = require('zlib');
const crypto = require('node:crypto');
const pumpify = require('pumpify');

function createKey(password) {
  return crypto.scryptSync(password, 'salt', 24);
}

function createCompressAndEncrypt(password, iv) {
  const key = createKey(password);
  const combinedStream = pumpify(
    zlib.createGzip(),
    crypto.createCipheriv('aes192', key, iv)
  );
  combinedStream.iv = iv;

  return combinedStream;
}

function createDecryptAndDecompress(password, iv) {
  const key = createKey(password);

  return pumpify(
    crypto.createDecipheriv('aes192', key, iv),
    zlib.createGunzip()
  );
}

exports.createCompressAndEncrypt = createCompressAndEncrypt;
exports.createDecryptAndDecompress = createDecryptAndDecompress;
