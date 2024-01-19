// api.js
import axios from 'axios';

const baseURL = 'http://localhost:3001'; // ou a URL do seu servidor backend

const api = axios.create({
  baseURL,
});

export const adicionarNomeAoBancoDeDados = async (novoNome) => {
  try {
    const response = await api.post('/adicionarNome', { nome: novoNome });
    return response.data;
  } catch (error) {
    console.error('Erro ao adicionar nome ao banco de dados:', error);
    throw error;
  }
};

export const obterNomesDoBancoDeDados = async () => {
  try {
    const response = await api.get('/obterNomes');
    return response.data;
  } catch (error) {
    console.error('Erro ao obter nomes do banco de dados:', error);
    throw error;
  }
};

export const confirmarPresencaNoBancoDeDados = async (nomesConfirmados) => {
  try {
    const response = await api.post('/confirmarPresenca', { nomes: nomesConfirmados });
    return response.data;
  } catch (error) {
    console.error('Erro ao confirmar presença no banco de dados:', error);
    throw error;
  }
};
