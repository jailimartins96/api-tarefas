require('dotenv').config()
const express = require('express')
const path    = require('path')
const authRouter    = require('./routes/auth')
const tarefasRouter = require('./routes/tarefas')
const autenticar    = require('./middlewares/auth')

const app = express()
app.use(express.json())

// Front-end estático
app.use(express.static(path.join(__dirname, '..', 'public')))

// Rotas da API
app.use('/auth', authRouter)
app.use('/tarefas', autenticar, tarefasRouter)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`))
