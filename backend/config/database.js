// config/database.js
const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'najwa', // ganti kalau ada password
  database: 'uas_makanan',
});

module.exports = db;
