import React, { useState, useEffect } from 'react';
import QrCode from 'qrcode.react';
import './App.css';
import { adicionarNomeAoBancoDeDados, obterNomesDoBancoDeDados, confirmarPresencaNoBancoDeDados } from './Conector';

const App = () => {
  const nomeCasal = 'Kaila e João';
  const versiculoBiblico = 'Isaias 41:20 para que todos vejam e saibam. que a mão do senhor fez isso. que o Santo de Israel o criou.';
  const dataCasamento = '5 de maio';

  const chavePix = '06039241152';

  const pixPayLoad = `00020101021126530014BR.GOV.BCB.PIX${chavePix}520400005303986540411.005802BR5913Presente6008BRASILIA62070503***6304${Math.random() * 100}`;

  const [novoNome, setNovoNome] = useState('');
  const [nomesConfirmados, setNomesConfirmados] = useState([]);
  const [copied, setCopied] = useState(false);

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
    console.log('Nomes Confirmados:', nomesConfirmados);

    try {
      await confirmarPresencaNoBancoDeDados(nomesConfirmados);
      alert('Que legal, esperamos vocês lá, é muito importante para nós');

      setNovoNome('');
      setNomesConfirmados([]);
      window.location.reload();
    } catch (error) {
      console.error('Erro ao confirmar presença:', error);
    }
  };

  useEffect(() => {
    const fetchNomesDoBanco = async () => {
      try {
        const nomesDoBanco = await obterNomesDoBancoDeDados();
        setNomesConfirmados(nomesDoBanco);
      } catch (error) {
        console.error('Erro ao obter nomes do banco de dados:', error);
      }
    };

    fetchNomesDoBanco();
  }, []); // Executa uma vez no carregamento inicial

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
            {nomesConfirmados.map((nome, index) => (
              <li key={index}>{nome}</li>
            ))}
          </ul>

          <button onClick={handleConfirmarPresenca}>Confirmar Presença</button>
        </div>
      </div>
    </div>
  );
};

export default App;
