'use strict';

const pg = require('pg');

const pool = new pg.Pool({
  host: '127.0.0.1',
  port: 5432,
  database: 'example',
  user: 'marcus',
  password: 'marcus'
});

module.exports = (table) => ({
  query(sql, args) {
    return pool.query(sql, args);
  },

  read(id, fields = ['*']) {
    const fieldNames = fields.join(', ');
    const sql = `SELECT ${fieldNames} FROM ${table}`;
    if (!id) return pool.query(sql);
    return pool.query(`${sql} WHERE id = $1`, [id]);
  },

  async create({ ...fields }) {
    const fieldNames = Object.keys(fields);
    const filedValues = Object.values(fields);

    const sql = `INSERT INTO ${table}
      (${fieldNames.join(', ')})
    VALUES
      (${filedValues.join(', ')})`;

    return pool.query(sql);
  }
});
