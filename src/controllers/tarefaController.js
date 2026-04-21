const db = require('../config/db')

const listar = async (req, res) => {
  const [rows] = await db.execute(
    'SELECT * FROM tarefas WHERE usuario_id = ? ORDER BY criada_em DESC',
    [req.usuario.id]
  )
  res.json(rows)
}

const buscar = async (req, res) => {
  const [rows] = await db.execute(
    'SELECT * FROM tarefas WHERE id = ? AND usuario_id = ?',
    [req.params.id, req.usuario.id]
  )
  if (!rows.length) return res.status(404).json({ erro: 'Tarefa não encontrada' })
  res.json(rows[0])
}

const criar = async (req, res) => {
  const { titulo, descricao } = req.body
  if (!titulo) return res.status(400).json({ erro: 'O campo título é obrigatório' })

  const [result] = await db.execute(
    'INSERT INTO tarefas (usuario_id, titulo, descricao) VALUES (?, ?, ?)',
    [req.usuario.id, titulo, descricao ?? '']
  )

  const [rows] = await db.execute('SELECT * FROM tarefas WHERE id = ?', [result.insertId])
  res.status(201).json(rows[0])
}

const atualizar = async (req, res) => {
  const { titulo, descricao, concluida } = req.body

  const [check] = await db.execute(
    'SELECT * FROM tarefas WHERE id = ? AND usuario_id = ?',
    [req.params.id, req.usuario.id]
  )
  if (!check.length) return res.status(404).json({ erro: 'Tarefa não encontrada' })

  await db.execute(
    'UPDATE tarefas SET titulo = ?, descricao = ?, concluida = ? WHERE id = ?',
    [
      titulo      ?? check[0].titulo,
      descricao   ?? check[0].descricao,
      concluida   ?? check[0].concluida,
      req.params.id
    ]
  )

  const [rows] = await db.execute('SELECT * FROM tarefas WHERE id = ?', [req.params.id])
  res.json(rows[0])
}

const deletar = async (req, res) => {
  const [result] = await db.execute(
    'DELETE FROM tarefas WHERE id = ? AND usuario_id = ?',
    [req.params.id, req.usuario.id]
  )
  if (!result.affectedRows) return res.status(404).json({ erro: 'Tarefa não encontrada' })
  res.status(204).send()
}

module.exports = { listar, buscar, criar, atualizar, deletar }
