const mysql = require('mysql2/promise')
require('dotenv').config()

const host     = process.env.MYSQL_HOST     || process.env.MYSQLHOST     || process.env.DB_HOST
const user     = process.env.MYSQL_USER     || process.env.MYSQLUSER     || process.env.DB_USER
const password = process.env.MYSQL_PASSWORD || process.env.MYSQLPASSWORD || process.env.DB_PASSWORD
const database = process.env.MYSQL_DATABASE || process.env.MYSQLDATABASE || process.env.DB_NAME
const port     = Number(process.env.MYSQL_PORT || process.env.MYSQLPORT || process.env.DB_PORT || 3306)

console.log('DB config:', { host, user, database, port, password: password ? '***' : 'VAZIO' })

const db = mysql.createPool({ host, user, password, database, port })

// Testa a conexão ao iniciar
db.getConnection()
  .then(conn => { console.log('MySQL conectado com sucesso!'); conn.release() })
  .catch(err => console.error('ERRO ao conectar no MySQL:', err.message))

module.exports = db
