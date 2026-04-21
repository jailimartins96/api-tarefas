-- Criação do banco de dados e tabela
CREATE DATABASE IF NOT EXISTS api_tarefas;
USE api_tarefas;

CREATE TABLE IF NOT EXISTS tarefas (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  titulo    VARCHAR(255) NOT NULL,
  descricao TEXT,
  concluida BOOLEAN DEFAULT FALSE,
  criada_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Dados de exemplo
INSERT INTO tarefas (titulo, descricao) VALUES
  ('Estudar Node.js', 'Praticar criação de APIs REST'),
  ('Configurar MySQL', 'Instalar e conectar banco de dados'),
  ('Subir projeto no GitHub', 'Criar repositório e fazer o push');
