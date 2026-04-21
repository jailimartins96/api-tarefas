require('dotenv').config()
const express = require('express')
const authRouter    = require('./routes/auth')
const tarefasRouter = require('./routes/tarefas')
const autenticar    = require('./middlewares/auth')

const app = express()
app.use(express.json())

// Rotas públicas
app.get('/', (req, res) => {
  res.json({ mensagem: 'API de Tarefas — online', versao: '2.0.0' })
})
app.use('/auth', authRouter)

// Rotas protegidas (exigem token)
app.use('/tarefas', autenticar, tarefasRouter)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`))
