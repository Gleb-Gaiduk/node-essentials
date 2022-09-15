'use strict';

const http = require('http');
const jose = require('jose');
const crypto = require('crypto');
const {
  webcrypto: { subtle },
  KeyObject
} = require('node:crypto');

const hostname = '127.0.0.1';
const port = 8080;

const server = http.createServer(async (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');

  const privateKey =
    '059bde05519b5a8098f1007fc8dd28ad223378a997ed3750edfb0895859ee18d';

  const secret = Buffer.from(privateKey, 'hex');

  const jwt = await new jose.EncryptJWT({ userId: '1234532' })
    .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
    .setIssuedAt()
    .setIssuer('urn:example:issuer')
    .setAudience('urn:example:audience')
    .setExpirationTime('2h')
    .encrypt(secret);

  try {
    const privateKey2 =
      '059bde05519b5a8098f1007fc8dd28ad223378a997ed3750edfb0895859ee18d';
    // const secret2 = Buffer.alloc(32, privateKey2);
    const secret2 = Buffer.from(privateKey2, 'hex');

    const { payload, protectedHeader } = await jose.jwtDecrypt(jwt, secret2, {
      issuer: 'urn:example:issuer',
      audience: 'urn:example:audience'
    });

    res.end(JSON.stringify({ payload, protectedHeader }));
  } catch (error) {
    res.end(JSON.stringify(error));
  }
});

server.listen(port, hostname, () => {
  console.log(`Server is running at http://${hostname}:${port}/`);
});

server.on('clientError', (err, socket) => {
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});

server.on('error', (err) => {
  if (err.code === 'EACCES') {
    console.log(`No access to the port: ${port}`);
  }
});
