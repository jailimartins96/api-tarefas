require('dotenv').config()
const express = require('express')
const tarefasRouter = require('./routes/tarefas')

const app = express()
app.use(express.json())

app.use('/tarefas', tarefasRouter)

app.get('/', (req, res) => {
  res.json({ mensagem: 'API de Tarefas — online', versao: '1.0.0' })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`))
