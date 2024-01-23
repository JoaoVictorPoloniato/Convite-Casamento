const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const port = 3000;

const server = http.createServer(app);
const io = socketIo(server);

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'casamento',
});

connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
  } else {
    console.log('Conectado ao banco de dados MySQL');
  }
});

app.use(bodyParser.json());
app.use(cors());

app.post('/adicionarNome', async (req, res) => {
  const novoNome = req.body.nome;

  if (novoNome) {
    try {
      // Verificar se a tabela participantes existe, senão criar
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS participantes (
          id INT AUTO_INCREMENT PRIMARY KEY,
          nome VARCHAR(255)
        )
      `);

      // Inserir o novo nome na tabela participantes
      await connection.execute('INSERT INTO participantes (nome) VALUES (?)', [novoNome]);

      res.status(200).json({ mensagem: 'Nome adicionado com sucesso' });

      // Emitir evento para atualizar clientes
      io.emit('atualizarNomes');
    } catch (error) {
      console.error('Erro ao adicionar nome ao banco de dados:', error);
      res.status(500).json({ erro: 'Erro ao adicionar nome ao banco de dados' });
    }
  } else {
    res.status(400).json({ erro: 'O corpo da requisição deve incluir um nome' });
  }
});

app.get('/obterNomes', async (req, res) => {
  try {
    const [rows] = await connection.execute('SELECT * FROM nomes');
    const nomesNoBanco = rows.map((row) => row.nome);
    res.status(200).json({ nomes: nomesNoBanco });
  } catch (error) {
    console.error('Erro ao obter nomes do banco de dados:', error);
    res.status(500).json({ erro: 'Erro ao obter nomes do banco de dados' });
  }
});

app.post('/adicionarNome', async (req, res) => {
  const novoNome = req.body.nome;

  if (novoNome) {
    try {
      // Verificar se a tabela participantes existe, senão criar
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS participantes (
          id INT AUTO_INCREMENT PRIMARY KEY,
          nome VARCHAR(255)
        )
      `);

      // Inserir o novo nome na tabela participantes
      await connection.execute('INSERT INTO participantes (nome) VALUES (?)', [novoNome]);

      res.status(200).json({ mensagem: 'Nome adicionado com sucesso' });

      // Emitir evento para atualizar clientes
      io.emit('atualizarNomes');
    } catch (error) {
      console.error('Erro no servidor:', error);
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  } else {
    res.status(400).json({ erro: 'O corpo da requisição deve incluir um nome' });
  }

  
});


server.listen(port, () => {
  console.log(`Servidor está ouvindo na porta ${port}`);
});

io.on('connection', (socket) => {
  console.log('Usuário conectado');
  
  socket.on('disconnect', () => {
    console.log('Usuário desconectado');
  });
});
