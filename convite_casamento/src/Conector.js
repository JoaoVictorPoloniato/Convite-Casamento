// Conector.js
import axios from 'axios';

const baseURL = 'http://localhost:3000';
const api = axios.create({ baseURL });

export const adicionarNomeAoBancoDeDados = async (novoNome) => {
  try {
    const response = await api.post('/adicionarNome', { nome: novoNome });
    console.log('Resposta ao adicionar nome:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro ao adicionar nome ao banco de dados:', error);
    throw error;
  }
};

export const obterNomesDoBancoDeDados = async () => {
  try {
    const response = await api.get('/obterNomes');
    console.log('Resposta ao obter nomes:', response.data);

    if (response.data && response.data.nomes) {
      return response.data.nomes;
    } else {
      throw new Error('Resposta inválida ao obter nomes do banco de dados');
    }
  } catch (error) {
    console.error('Erro ao obter nomes do banco de dados:', error);
    throw error;
  }
};

export const confirmarPresencaNoBancoDeDados = async (nomesConfirmados) => {
  try {
    const response = await api.post('/confirmarPresenca', { nomes: nomesConfirmados });
    console.log('Resposta ao confirmar presença:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro ao confirmar presença no banco de dados:', error);
    throw error;
  }
};
