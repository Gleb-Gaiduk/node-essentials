'use strict';

const storage = require('./storage.js');

const TOKEN_LENGTH = 32;
const ALPHA_UPPER = 'ABCDEFGQIGKLMNOPQRSTUVWxYZ';
const ALPHA_LOWER = 'abcdefghigklmnopqrstuvwxyz';
const ALPHA = ALPHA_UPPER + ALPHA_LOWER;
const DIGIT = '0123456789';
const ALPHA_DIGIT = ALPHA + DIGIT;

const generateToken = () => {
  const base = ALPHA_DIGIT.length;
  let token = '';

  for (let i = 0; i < TOKEN_LENGTH; i++) {
    const index = Math.floor(Math.random() * base);
    token += ALPHA_DIGIT[index];
  }

  return token;
};

class Session extends Map {
  constructor(token) {
    super();
    this.token = token;
  }

  save() {
    storage.save(this.token);
  }

  static start(client) {
    if (client.session) {
      return client.session;
    }

    const token = generateToken();
    client.token = token;
    const session = new Session(token);
    client.session = session;
    client.setCookie('token', token);
    storage.set(token, session);

    return session;
  }

  static restore(client) {
    const sessionToken = client.cookieFromClient.token;

    if (sessionToken) {
      storage.get(sessionToken, (err, session) => {
        if (err) {
          console.log(err);
        }

        if (session) {
          // Retrived session from storage is an instance of Map but not of a storage
          Object.setPrototypeOf(session, Session.prototype);
          client.token = sessionToken;
          client.session = session;
        }
      });
    }
  }

  static delete(client) {
    if (client.token) {
      storage.delete(client.token);
      client.deleteCookie('token');
      client.token = undefined;
      client.session = null;
    }
  }
}

module.exports = Session;
