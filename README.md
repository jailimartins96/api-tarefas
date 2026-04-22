# API de Tarefas

API REST para gerenciamento de tarefas com autenticação JWT, desenvolvida com **Node.js**, **Express** e **MySQL**.

## Tecnologias

- Node.js + Express
- MySQL + mysql2
- JSON Web Token (JWT)
- bcryptjs
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
Edite o `.env` com suas credenciais do MySQL e uma chave secreta para o JWT.

### 4. Crie o banco de dados
```bash
mysql -u root -p < database.sql
```

### 5. Inicie o servidor
```bash
# Desenvolvimento (auto-reload)
npm run dev

# Produção
npm start
```

A API estará disponível em `http://localhost:3000`

## Deploy

API em produção: **https://api-tarefas-production-8836.up.railway.app**

---

## Endpoints

### Autenticação (pública)

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/auth/registrar` | Cria um novo usuário |
| POST | `/auth/login` | Realiza login e retorna o token |

### Tarefas (requer token JWT)

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/tarefas` | Lista as tarefas do usuário |
| GET | `/tarefas/:id` | Busca uma tarefa por ID |
| POST | `/tarefas` | Cria uma nova tarefa |
| PUT | `/tarefas/:id` | Atualiza uma tarefa |
| DELETE | `/tarefas/:id` | Remove uma tarefa |

---

## Exemplos de uso

### 1. Registrar usuário
```bash
curl -X POST http://localhost:3000/auth/registrar \
  -H "Content-Type: application/json" \
  -d '{"nome": "Jaili", "email": "jaili@email.com", "senha": "123456"}'
```

### 2. Login (guarde o token retornado)
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "jaili@email.com", "senha": "123456"}'
```

### 3. Criar tarefa (com token)
```bash
curl -X POST http://localhost:3000/tarefas \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{"titulo": "Estudar JWT", "descricao": "Entender autenticação por token"}'
```

### 4. Listar tarefas
```bash
curl http://localhost:3000/tarefas \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

### 5. Atualizar tarefa
```bash
curl -X PUT http://localhost:3000/tarefas/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{"concluida": true}'
```

### 6. Deletar tarefa
```bash
curl -X DELETE http://localhost:3000/tarefas/1 \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

---

## Como funciona a autenticação

```
1. Usuário faz POST /auth/login com email e senha
2. API valida as credenciais e retorna um token JWT
3. Usuário envia o token no header de todas as requisições:
   Authorization: Bearer <token>
4. API valida o token e libera o acesso (token expira em 8h)
```

---

## Estrutura do projeto

```
api-tarefas/
├── src/
│   ├── config/
│   │   └── db.js                  # Conexão com MySQL
│   ├── controllers/
│   │   ├── authController.js      # Registro e login
│   │   └── tarefaController.js    # CRUD de tarefas
│   ├── middlewares/
│   │   └── auth.js                # Validação do token JWT
│   ├── routes/
│   │   ├── auth.js                # Rotas de autenticação
│   │   └── tarefas.js             # Rotas de tarefas
│   └── index.js                   # Entrada da aplicação
├── .env.example
├── .gitignore
├── database.sql
└── package.json
```

---

Desenvolvido por [Jaili Martins](https://github.com/jailimartins96)
