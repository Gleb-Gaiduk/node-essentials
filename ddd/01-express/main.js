'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const pg = require('pg');
const hash = require('./hash.js');

const PORT = 8000;

const app = express();

const pool = new pg.Pool({
  host: '127.0.0.1',
  port: 5432,
  database: 'example',
  user: 'marcus',
  password: 'marcus'
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/users', async (req, res) => {
  const { login, password } = req.body;
  const user = JSON.stringify({ login, password });
  console.log(`${req.socket.remoteAddress} POST /user ${user}`);
  const sql = 'INSERT INTO users (login, password) VALUES ($1, $2)';
  const passwordHash = await hash(password);
  pool.query(sql, [login, passwordHash], (err, data) => {
    if (err) throw err;
    res.status(201).json({ created: data.insertId });
  });
});

app.get('/users', (req, res) => {
  console.log(`${req.socket.remoteAddress} GET /user`);
  const sql = 'SELECT * FROM users';
  pool.query(sql, (err, data) => {
    if (err) throw err;
    res.status(200).json(data.rows);
  });
});

app.listen(PORT, () => {
  console.log(`Listen on port ${PORT}`);
});
