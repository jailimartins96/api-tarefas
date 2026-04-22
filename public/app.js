// ===== CONFIG =====
const API = ''  // mesmo servidor

// ===== STATE =====
let token    = localStorage.getItem('token')
let usuario  = JSON.parse(localStorage.getItem('usuario') || 'null')
let tarefas  = []
let filtro   = 'todas'
let busca    = ''
let editando = null  // id da tarefa sendo editada

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  if (token && usuario) mostrarApp()
  else mostrarAuth()
  bindEvents()
})

function bindEvents() {
  // Auth tabs
  document.querySelectorAll('.tab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(b => b.classList.remove('active'))
      btn.classList.add('active')
      const tab = btn.dataset.tab
      document.getElementById('login-form').classList.toggle('hidden', tab !== 'login')
      document.getElementById('register-form').classList.toggle('hidden', tab !== 'register')
    })
  })

  // Auth forms
  document.getElementById('login-form').addEventListener('submit', onLogin)
  document.getElementById('register-form').addEventListener('submit', onRegister)

  // Logout
  document.getElementById('btn-logout').addEventListener('click', logout)

  // Filtros sidebar
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', e => {
      e.preventDefault()
      document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'))
      item.classList.add('active')
      filtro = item.dataset.filter
      const titulos = {
        todas: 'Todas as tarefas', pendentes: 'Pendentes',
        concluidas: 'Concluídas', alta: 'Prioridade Alta',
        media: 'Prioridade Média', baixa: 'Prioridade Baixa'
      }
      document.getElementById('main-title').textContent = titulos[filtro]
      renderTarefas()
    })
  })

  // Nova tarefa
  document.getElementById('btn-new-task').addEventListener('click', () => abrirModal())
  document.getElementById('btn-empty-new').addEventListener('click', () => abrirModal())

  // Modal
  document.getElementById('modal-close').addEventListener('click', fecharModal)
  document.getElementById('modal-cancel').addEventListener('click', fecharModal)
  document.getElementById('modal').addEventListener('click', e => { if (e.target.id === 'modal') fecharModal() })
  document.getElementById('task-form').addEventListener('submit', onSalvarTarefa)

  // Busca
  document.getElementById('search-input').addEventListener('input', e => {
    busca = e.target.value.toLowerCase()
    renderTarefas()
  })
}

// ===== AUTH =====
function mostrarAuth() {
  document.getElementById('auth-screen').classList.remove('hidden')
  document.getElementById('app-screen').classList.add('hidden')
}

function mostrarApp() {
  document.getElementById('auth-screen').classList.add('hidden')
  document.getElementById('app-screen').classList.remove('hidden')
  document.getElementById('user-greeting').textContent = `Olá, ${usuario.nome.split(' ')[0]}`
  carregarTarefas()
}

async function onLogin(e) {
  e.preventDefault()
  const email = document.getElementById('login-email').value
  const senha = document.getElementById('login-senha').value
  const erro  = document.getElementById('login-error')
  erro.textContent = ''

  try {
    const res  = await api('POST', '/auth/login', { email, senha })
    token   = res.token
    usuario = res.usuario
    localStorage.setItem('token', token)
    localStorage.setItem('usuario', JSON.stringify(usuario))
    mostrarApp()
  } catch (err) {
    erro.textContent = err.message || 'E-mail ou senha incorretos'
  }
}

async function onRegister(e) {
  e.preventDefault()
  const nome  = document.getElementById('reg-nome').value
  const email = document.getElementById('reg-email').value
  const senha = document.getElementById('reg-senha').value
  const erro  = document.getElementById('register-error')
  erro.textContent = ''

  try {
    await api('POST', '/auth/registrar', { nome, email, senha })
    // Faz login automático após cadastro
    const res = await api('POST', '/auth/login', { email, senha })
    token   = res.token
    usuario = res.usuario
    localStorage.setItem('token', token)
    localStorage.setItem('usuario', JSON.stringify(usuario))
    mostrarApp()
  } catch (err) {
    erro.textContent = err.message || 'Erro ao criar conta'
  }
}

function logout() {
  token   = null
  usuario = null
  tarefas = []
  localStorage.removeItem('token')
  localStorage.removeItem('usuario')
  mostrarAuth()
}

// ===== TAREFAS =====
async function carregarTarefas() {
  try {
    tarefas = await api('GET', '/tarefas')
    renderTarefas()
    atualizarContadores()
  } catch {
    logout()
  }
}

async function onSalvarTarefa(e) {
  e.preventDefault()
  const dados = {
    titulo:     document.getElementById('task-titulo').value,
    descricao:  document.getElementById('task-descricao').value,
    prioridade: document.getElementById('task-prioridade').value,
    prazo:      document.getElementById('task-prazo').value || null
  }

  try {
    if (editando) {
      const atualizada = await api('PUT', `/tarefas/${editando}`, dados)
      tarefas = tarefas.map(t => t.id === editando ? atualizada : t)
    } else {
      const nova = await api('POST', '/tarefas', dados)
      tarefas.unshift(nova)
    }
    fecharModal()
    renderTarefas()
    atualizarContadores()
  } catch (err) {
    alert(err.message || 'Erro ao salvar tarefa')
  }
}

async function toggleConcluida(id) {
  const tarefa = tarefas.find(t => t.id === id)
  if (!tarefa) return
  const atualizada = await api('PUT', `/tarefas/${id}`, { concluida: !tarefa.concluida })
  tarefas = tarefas.map(t => t.id === id ? atualizada : t)
  renderTarefas()
  atualizarContadores()
}

async function deletarTarefa(id) {
  if (!confirm('Deseja excluir esta tarefa?')) return
  await api('DELETE', `/tarefas/${id}`)
  tarefas = tarefas.filter(t => t.id !== id)
  renderTarefas()
  atualizarContadores()
}

// ===== MODAL =====
function abrirModal(tarefa = null) {
  editando = tarefa ? tarefa.id : null
  document.getElementById('modal-title').textContent = tarefa ? 'Editar tarefa' : 'Nova tarefa'
  document.getElementById('task-titulo').value     = tarefa?.titulo     || ''
  document.getElementById('task-descricao').value  = tarefa?.descricao  || ''
  document.getElementById('task-prioridade').value = tarefa?.prioridade || 'media'
  document.getElementById('task-prazo').value      = tarefa?.prazo
    ? new Date(tarefa.prazo).toISOString().slice(0, 16) : ''
  document.getElementById('modal').classList.remove('hidden')
  document.getElementById('task-titulo').focus()
}

function fecharModal() {
  document.getElementById('modal').classList.add('hidden')
  document.getElementById('task-form').reset()
  editando = null
}

// ===== RENDER =====
function renderTarefas() {
  const lista = filtrarTarefas()
  const container = document.getElementById('task-list')
  const empty     = document.getElementById('empty-state')

  if (!lista.length) {
    container.innerHTML = ''
    container.appendChild(empty)
    empty.classList.remove('hidden')
    return
  }

  empty.classList.add('hidden')
  container.innerHTML = ''
  lista.forEach(t => container.appendChild(criarCard(t)))
}

function filtrarTarefas() {
  return tarefas.filter(t => {
    const matchBusca = !busca ||
      t.titulo.toLowerCase().includes(busca) ||
      (t.descricao || '').toLowerCase().includes(busca)

    const matchFiltro =
      filtro === 'todas'     ? true :
      filtro === 'pendentes' ? !t.concluida :
      filtro === 'concluidas'? t.concluida :
      t.prioridade === filtro

    return matchBusca && matchFiltro
  })
}

function criarCard(tarefa) {
  const card = document.createElement('div')
  card.className = `task-card${tarefa.concluida ? ' done' : ''}`
  card.dataset.id = tarefa.id

  const vencida = tarefa.prazo && !tarefa.concluida && new Date(tarefa.prazo) < new Date()

  card.innerHTML = `
    <div class="task-check ${tarefa.concluida ? 'checked' : ''}" data-id="${tarefa.id}">
      ${tarefa.concluida ? '✓' : ''}
    </div>
    <div class="task-body">
      <div class="task-title">${esc(tarefa.titulo)}</div>
      ${tarefa.descricao ? `<div class="task-desc">${esc(tarefa.descricao)}</div>` : ''}
      <div class="task-meta">
        <span class="badge badge-${tarefa.prioridade}">${tarefa.prioridade}</span>
        ${tarefa.prazo ? `
          <span class="task-date ${vencida ? 'vencida' : ''}">
            ${vencida ? '⚠️' : '📅'} ${formatarData(tarefa.prazo)}
          </span>` : ''}
        <span class="task-date">🕐 ${formatarData(tarefa.criada_em)}</span>
      </div>
    </div>
    <div class="task-actions">
      <button class="btn-icon edit" data-id="${tarefa.id}" title="Editar">✏️</button>
      <button class="btn-icon delete" data-id="${tarefa.id}" title="Excluir">🗑️</button>
    </div>
  `

  card.querySelector('.task-check').addEventListener('click', () => toggleConcluida(tarefa.id))
  card.querySelector('.btn-icon.edit').addEventListener('click', () => abrirModal(tarefa))
  card.querySelector('.btn-icon.delete').addEventListener('click', () => deletarTarefa(tarefa.id))

  return card
}

function atualizarContadores() {
  const total     = tarefas.length
  const pendentes = tarefas.filter(t => !t.concluida).length
  const concluidas = tarefas.filter(t => t.concluida).length
  document.getElementById('count-todas').textContent      = total
  document.getElementById('count-pendentes').textContent  = pendentes
  document.getElementById('count-concluidas').textContent = concluidas
}

// ===== UTILS =====
async function api(method, url, body) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json' }
  }
  if (token) opts.headers['Authorization'] = `Bearer ${token}`
  if (body)  opts.body = JSON.stringify(body)

  const res  = await fetch(API + url, opts)
  if (res.status === 204) return null

  const data = await res.json()
  if (!res.ok) throw new Error(data.erro || 'Erro na requisição')
  return data
}

function formatarData(dataStr) {
  if (!dataStr) return ''
  return new Date(dataStr).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}

function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
