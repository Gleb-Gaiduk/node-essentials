'use strict';

const db = require('../db.js');
const hash = require('../hash.js');

const usersCrud = db('users');

module.exports = {
  read(id) {
    return usersCrud.read(id, ['id', 'login']);
  },

  async create({ login, password }) {
    const passwordHash = await hash(password);
    return users.create({ login, password: passwordHash });
  },

  find(mask) {
    const sql = 'SELECT login from users where login like $1';
    return users.query(sql, [mask]);
  }
};
