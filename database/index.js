const { Pool } = require('pg');

const pool = new Pool({
  user: 'othniel',
  host: 'localhost',
  database: 'sdc',
  password: '1234',
  port: 5432,
});

pool.on('connect', client => {
});

module.exports = pool;