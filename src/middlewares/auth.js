const jwt = require('jsonwebtoken')

const autenticar = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ erro: 'Token não informado' })
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.usuario = payload
    next()
  } catch {
    res.status(403).json({ erro: 'Token inválido ou expirado' })
  }
}

module.exports = autenticar
