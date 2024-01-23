import React, { useState, useEffect } from 'react';
import QrCode from 'qrcode.react';
import './App.css';
import { adicionarNomeAoBancoDeDados, obterNomesDoBancoDeDados, confirmarPresencaNoBancoDeDados } from './Conector';
import socketIOClient from 'socket.io-client';

const ENDPOINT = 'http://localhost:3000';
const socket = socketIOClient(ENDPOINT);

const App = () => {
  const [novoNome, setNovoNome] = useState('');
  const [nomesConfirmados, setNomesConfirmados] = useState([]);
  const [copied, setCopied] = useState(false);

  // Substitua as variáveis abaixo pelas suas definições
  const nomeCasal = 'Kaila e João';
  const versiculoBiblico = 'Isaias 41:20 para que todos vejam e saibam. que a mão do senhor fez isso. que o Santo de Israel o criou.';
  const dataCasamento = '5 de maio';
  const chavePix = '06039241152';
  const pixPayLoad = `00020101021126530014BR.GOV.BCB.PIX${chavePix}520400005303986540411.005802BR5913Presente6008BRASILIA62070503***6304${Math.random() * 100}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(chavePix);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  const handleAdicionarNome = async () => {
    if (novoNome.trim() !== '') {
      try {
        await adicionarNomeAoBancoDeDados(novoNome);
        const nomesAtualizados = await obterNomesDoBancoDeDados();
        setNomesConfirmados(nomesAtualizados);
        setNovoNome('');
      } catch (error) {
        console.error('Erro ao adicionar nome:', error);
      }
    }
  };

  const handleConfirmarPresenca = async () => {
    try {
      await confirmarPresencaNoBancoDeDados(nomesConfirmados);
      alert('Que legal, esperamos vocês lá, é muito importante para nós');

      setNovoNome('');
      setNomesConfirmados([]);
    } catch (error) {
      console.error('Erro ao confirmar presença:', error);
    }
  };

  const fetchNomesDoBanco = async () => {
    try {
      const nomesDoBanco = await obterNomesDoBancoDeDados();
      setNomesConfirmados(nomesDoBanco);
    } catch (error){
      console.error('Erro ao obter nomes do banco de dados:', error);
    }
  };

  useEffect(() => {
    fetchNomesDoBanco();
  }, []);

  useEffect(() => {
    socket.on('atualizarNomes', () => {
      fetchNomesDoBanco();
    });

    return () => {
      socket.disconnect();
    };
  }, [novoNome]);

  return (
    <div className="convite">
      <h1>Convite de Casamento</h1>
      <p>Mensagem de casamento</p>
      <p>{nomeCasal}</p>
      <p>{versiculoBiblico}</p>
      <p>Data da comemoração: {dataCasamento}</p>
      <div className="qr-code">
        <QrCode value={pixPayLoad} />
        <p>Qr Code para presentes via PIX</p>
      </div>

      <div className="lista-presentes">
        <p>Caso queira, pode estar realizando um pix a nos tambem.</p>
        <p>Segue o link da lista de presentes <a href="https://lista.havan.com.br/ListaPresenteAdmin">aqui</a></p>
      </div>
      <div className="chave-pix">
        <p>Chave PIX: {chavePix}</p>
        <button onClick={copyToClipboard} disabled={copied}>
          {copied ? 'Copiado!' : 'Copiar Chave PIX'}
        </button>
      </div>
      <div className="presenca">
        <strong><h2>Você e sua família estão convidados a comparecer em nossa celebração</h2></strong>
        <h3>Informe os nomes de sua família para confirmar a presença:</h3>
        
        <div className="confirmacao-presenca">
          <label htmlFor="nome">Nomes:</label>
          <input
            type="text"
            id="nome"
            name="nome"
            placeholder="Digite os nomes"
            value={novoNome}
            onChange={(e) => setNovoNome(e.target.value)}
          />

          <button onClick={handleAdicionarNome}>Adicionar Nome</button>

          <ul>
            {Array.isArray(nomesConfirmados) ? (
              nomesConfirmados.map((nome, index) => (
                <li key={index}>{nome}</li>
              ))
            ) : (
              <li>Erro ao obter nomes do banco de dados</li>
            )}
          </ul>

          <button onClick={handleConfirmarPresenca}>Confirmar Presença</button>
        </div>
      </div>
    </div>
  );
};

export default App;
