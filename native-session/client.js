'use strict';

const Session = require('./session.js');

const UNIX_EPOCH = 'Thu, 01 Jan 1970 00:00:00 GMT';
const COOKIE_EXPIRE = 'Fri, 01 Jan 2100 00:00:00 GMT';
const COOKIE_DELETE = `=deleted; Expires=${UNIX_EPOCH}; Path=/; Domain=`;

const parseHost = (host) => {
  if (!host) {
    return 'no-host-name-in-http-headers';
  }

  const portOffset = host.indexOf(':');

  if (portOffset > -1) {
    host = host.substr(0, portOffset);
  }

  return host;
};

class Client {
  constructor(req, res) {
    this.req = req;
    this.res = res;
    this.host = parseHost(req.headers.host);
    this.token = undefined;
    this.session = null;
    this.cookieFromClient = {};
    this.cookieToClient = [];

    this.parseCookie();
    Session.restore(this);
  }

  parseCookie() {
    const { cookie } = this.req.headers;

    if (!cookie) return;

    const items = cookie.split(';');

    for (const item of items) {
      const parts = item.split('=');
      const key = parts[0].trim();
      const val = parts[1] || '';

      this.cookieFromClient[key] = val.trim();
    }
  }

  setCookie(name, value, httpOnly = true) {
    const expires = `expires=${COOKIE_EXPIRE}`;
    let cookie = `${name}=${value}; ${expires}; Path=/; Domain=${this.host}`;

    if (httpOnly) {
      cookie += '; HttpOnly';
    }

    this.cookieToClient.push(cookie);
  }

  deleteCookie(name) {
    this.cookieToClient.push(name + COOKIE_DELETE + this.host);
  }

  sendCookie() {
    if (this.cookieToClient.length && !this.req.headersSent) {
      this.res.setHeader('Set-Cookie', this.cookieToClient);
    }
  }
}

module.exports = Client;
