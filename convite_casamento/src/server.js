const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();

// Configuração do MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'casamento'
});

connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao MySQL:', err);
  } else {
    console.log('Conectado ao MySQL');
  }
});

// Middleware CORS
app.use(cors());
app.use(express.json());

// Exemplo de rota para obter dados do banco de dados
app.get('/api/nomes', (req, res) => {
  connection.query('SELECT * FROM tabela_de_nomes', (err, results) => {
    if (err) {
      console.error('Erro ao executar a consulta:', err);
      res.status(500).json({ error: 'Erro ao obter dados do banco de dados' });
    } else {
      res.json(results);
    }
  });
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Servidor backend rodando na porta ${PORT}`);
});
