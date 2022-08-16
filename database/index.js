const { Pool } = requre('pg');

const pool = new Pool({
  user: 'user',
  host: 'localhost',
  database: 'smtp',
  port: 3001,
});

pool.on('connect', client => {
  console.log('connected');
});

module.exports = pool;