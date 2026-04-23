const BASE_URL = '/api/receitas';

export async function getReceitas() {
  const resposta = await fetch(BASE_URL);
  const dados = await resposta.json();
  return dados;
}

export async function getReceita(id) {
  const resposta = await fetch(`${BASE_URL}/${id}`);
  const dados = await resposta.json();
  return dados;
}

export async function criarReceita(receita) {
  const resposta = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(receita)
  });
  return await resposta.json();
}

export async function atualizarReceita(id, receita) {
  const resposta = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(receita)
  });
  return await resposta.json();
}

export async function deletarReceita(id) {
  await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE'
  });
}