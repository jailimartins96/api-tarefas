const express = require('express')
const router = express.Router()
const { listar, buscar, criar, atualizar, deletar } = require('../controllers/tarefaController')

router.get('/',     listar)
router.get('/:id',  buscar)
router.post('/',    criar)
router.put('/:id',  atualizar)
router.delete('/:id', deletar)

module.exports = router
