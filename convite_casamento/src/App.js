import React, { useState } from 'react';
import QrCode from 'qrcode.react';
import './App.css';

const App = () => {
  const nomeCasal = 'Kaila e João';
  const versiculoBiblico = 'Isaias 41:20 para que todos vejam e saibam. que a mão do senhor fez isso. que o Santo de Israel o criou.';
  const dataCasamento = '5 de maio';

  const chavePix = '06039241152';

  const pixPayLoad = `00020101021126530014BR.GOV.BCB.PIX${chavePix}520400005303986540411.005802BR5913Presente6008BRASILIA62070503***6304${Math.random() * 100}`;

  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(chavePix);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

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
    </div>
  );
};

export default App;
