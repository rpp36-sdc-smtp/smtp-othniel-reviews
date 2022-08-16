const { Pool } = requre('pg');

const pool = new Pool({
  user: '',
  host: '',
  database: '',
  port: 3001,
});

pool.on('connect', client => {
  console.log('connected');
});

module.exports = pool;