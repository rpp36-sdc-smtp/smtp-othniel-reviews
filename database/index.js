const config = require('../config.js');
const { Pool } = require('pg');

const pool = new Pool({
  user: config.user,
  host: 'localhost',
  database: config.database,
  password: config.password,
  port: 5432,
});

// pool.on('connect', client => {
//   console.log('connected to psql...');
// });

module.exports = pool;