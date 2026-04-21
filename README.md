# API de Tarefas

API REST para gerenciamento de tarefas, desenvolvida com **Node.js**, **Express** e **MySQL**.

## Tecnologias

- Node.js
- Express
- MySQL
- dotenv

## Como rodar o projeto

### 1. Clone o repositório
```bash
git clone https://github.com/jailimartins96/api-tarefas.git
cd api-tarefas
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
```bash
cp .env.example .env
```
Edite o `.env` com suas credenciais do MySQL.

### 4. Crie o banco de dados
Execute o arquivo `database.sql` no seu MySQL:
```bash
mysql -u root -p < database.sql
```

### 5. Inicie o servidor
```bash
# Produção
npm start

# Desenvolvimento (auto-reload)
npm run dev
```

A API estará disponível em `http://localhost:3000`

---

## Endpoints

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/tarefas` | Lista todas as tarefas |
| GET | `/tarefas/:id` | Busca uma tarefa por ID |
| POST | `/tarefas` | Cria uma nova tarefa |
| PUT | `/tarefas/:id` | Atualiza uma tarefa |
| DELETE | `/tarefas/:id` | Remove uma tarefa |

---

## Exemplos de uso

### Criar tarefa
```bash
curl -X POST http://localhost:3000/tarefas \
  -H "Content-Type: application/json" \
  -d '{"titulo": "Estudar Node.js", "descricao": "Praticar APIs REST"}'
```

### Listar todas
```bash
curl http://localhost:3000/tarefas
```

### Atualizar tarefa
```bash
curl -X PUT http://localhost:3000/tarefas/1 \
  -H "Content-Type: application/json" \
  -d '{"concluida": true}'
```

### Deletar tarefa
```bash
curl -X DELETE http://localhost:3000/tarefas/1
```

---

## Estrutura do projeto

```
api-tarefas/
├── src/
│   ├── config/
│   │   └── db.js            # Conexão com o MySQL
│   ├── controllers/
│   │   └── tarefaController.js  # Lógica das rotas
│   ├── routes/
│   │   └── tarefas.js       # Definição das rotas
│   └── index.js             # Entrada da aplicação
├── .env.example
├── .gitignore
├── database.sql             # Script do banco de dados
└── package.json
```

---

Desenvolvido por [Jaili Martins](https://github.com/jailimartins96)
