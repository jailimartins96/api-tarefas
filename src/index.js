require('dotenv').config()
const express = require('express')
const path    = require('path')
const authRouter    = require('./routes/auth')
const tarefasRouter = require('./routes/tarefas')
const autenticar    = require('./middlewares/auth')

const app = express()
app.use(express.json())

// Rotas da API ANTES do static (prioridade)
app.use('/auth',    authRouter)
app.use('/tarefas', autenticar, tarefasRouter)

// Front-end estático (depois das rotas)
app.use(express.static(path.join(__dirname, '..', 'public')))

// Erro genérico — sempre retorna JSON
app.use((err, req, res, next) => {
  console.error('ERRO:', err.message)
  res.status(500).json({ erro: err.message || 'Erro interno no servidor' })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`))
