const BASE_URL = '/api/receitas';

export async function getReceitas() {
  const resposta = await fetch(BASE_URL);
  const dados = await resposta.json();
  if (!resposta.ok) throw new Error(dados.message);
  return dados;
}

export async function getReceita(id) {
  const resposta = await fetch(`${BASE_URL}/${id}`);
  const dados = await resposta.json();
  if (!resposta.ok) throw new Error(dados.message);
  return dados;
}

export async function criarReceita(receita) {
  const resposta = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(receita)
  });
  const dados = await resposta.json();
  if (!resposta.ok) throw new Error(dados.message);
  return dados;
}

export async function atualizarReceita(id, receita) {
  const resposta = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(receita)
  });
  const dados = await resposta.json();
  if (!resposta.ok) throw new Error(dados.message);
  return dados;
}

export async function deletarReceita(id) {
  const resposta = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE'
  });
  if (!resposta.ok) throw new Error('Erro ao deletar receita');
}

export async function uploadImagem(file) {
  const formData = new FormData();
  formData.append('img', file);

  const resposta = await fetch('/api/upload', {
    method: 'POST',
    body: formData
  });

  const dados = await resposta.json();
  if (!resposta.ok) throw new Error(dados.message);
  return dados.img;
}