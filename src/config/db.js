const mysql = require('mysql2/promise')
require('dotenv').config()

// Railway usa MYSQLHOST, MYSQLUSER, etc.
// Localmente usamos DB_HOST, DB_USER, etc.
const db = mysql.createPool({
  host:     process.env.MYSQLHOST     || process.env.DB_HOST,
  user:     process.env.MYSQLUSER     || process.env.DB_USER,
  password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD,
  database: process.env.MYSQLDATABASE || process.env.DB_NAME,
  port:     process.env.MYSQLPORT     || 3306
})

module.exports = db
