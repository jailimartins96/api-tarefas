const mysql = require('mysql2/promise')
require('dotenv').config()

// Railway pode usar diferentes formatos de variável
const host     = process.env.MYSQL_HOST     || process.env.MYSQLHOST     || process.env.DB_HOST
const user     = process.env.MYSQL_USER     || process.env.MYSQLUSER     || process.env.DB_USER
const password = process.env.MYSQL_PASSWORD || process.env.MYSQLPASSWORD || process.env.DB_PASSWORD
const database = process.env.MYSQL_DATABASE || process.env.MYSQLDATABASE || process.env.DB_NAME
const port     = process.env.MYSQL_PORT     || process.env.MYSQLPORT     || process.env.DB_PORT || 3306

// Railway também pode fornecer uma URL completa
const url = process.env.MYSQL_URL || process.env.MYSQL_PRIVATE_URL || process.env.DATABASE_URL

let db

if (url) {
  db = mysql.createPool(url)
} else {
  db = mysql.createPool({ host, user, password, database, port: Number(port) })
}

module.exports = db
