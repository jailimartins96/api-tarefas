const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const db = require('../config/db')

const registrar = async (req, res) => {
  const { nome, email, senha } = req.body

  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: 'Nome, email e senha são obrigatórios' })
  }

  const [existe] = await db.execute('SELECT id FROM usuarios WHERE email = ?', [email])
  if (existe.length) {
    return res.status(409).json({ erro: 'E-mail já cadastrado' })
  }

  const hash = await bcrypt.hash(senha, 10)

  const [result] = await db.execute(
    'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)',
    [nome, email, hash]
  )

  res.status(201).json({ mensagem: 'Usuário criado com sucesso', id: result.insertId })
}

const login = async (req, res) => {
  const { email, senha } = req.body

  if (!email || !senha) {
    return res.status(400).json({ erro: 'E-mail e senha são obrigatórios' })
  }

  const [rows] = await db.execute('SELECT * FROM usuarios WHERE email = ?', [email])
  if (!rows.length) {
    return res.status(401).json({ erro: 'Credenciais inválidas' })
  }

  const usuario = rows[0]
  const senhaCorreta = await bcrypt.compare(senha, usuario.senha)

  if (!senhaCorreta) {
    return res.status(401).json({ erro: 'Credenciais inválidas' })
  }

  const token = jwt.sign(
    { id: usuario.id, nome: usuario.nome, email: usuario.email },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  )

  res.json({
    mensagem: 'Login realizado com sucesso',
    token,
    usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email }
  })
}

module.exports = { registrar, login }
