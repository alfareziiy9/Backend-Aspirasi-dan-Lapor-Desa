const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error('Gagal terhubung ke database PostgreSQL:', err.stack);
  }
  console.log('Berhasil terhubung ke database PostgreSQL');
  release();
});

module.exports = pool;