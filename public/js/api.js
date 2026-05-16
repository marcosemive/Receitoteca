const BASE_URL = '/api';

function getToken() {
  return localStorage.getItem('token');
}

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getToken()}`
  };
}

// AUTH

export async function loginChef(email, senha) {
  const res = await fetch(`${BASE_URL}/auth/chef/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, senha })
  });
  const dados = await res.json();
  if (!res.ok) throw new Error(dados.message);
  return dados;
}

export async function cadastrarChef(nome, email, senha) {
  const res = await fetch(`${BASE_URL}/auth/chef/cadastro`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, email, senha })
  });
  const dados = await res.json();
  if (!res.ok) throw new Error(dados.message);
  return dados;
}

export async function loginUsuario(email, senha) {
  const res = await fetch(`${BASE_URL}/auth/usuario/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, senha })
  });
  const dados = await res.json();
  if (!res.ok) throw new Error(dados.message);
  return dados;
}

export async function cadastrarUsuario(nome, email, senha) {
  const res = await fetch(`${BASE_URL}/auth/usuario/cadastro`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, email, senha })
  });
  const dados = await res.json();
  if (!res.ok) throw new Error(dados.message);
  return dados;
}

// RECEITAS

export async function getReceitas() {
  const res = await fetch(`${BASE_URL}/receitas`);
  const dados = await res.json();
  if (!res.ok) throw new Error(dados.message);
  return dados;
}

export async function getReceita(id) {
  const res = await fetch(`${BASE_URL}/receitas/${id}`);
  const dados = await res.json();
  if (!res.ok) throw new Error(dados.message);
  return dados;
}

export async function criarReceita(receita) {
  const res = await fetch(`${BASE_URL}/receitas`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(receita)
  });
  const dados = await res.json();
  if (!res.ok) throw new Error(dados.message);
  return dados;
}

export async function atualizarReceita(id, receita) {
  const res = await fetch(`${BASE_URL}/receitas/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(receita)
  });
  const dados = await res.json();
  if (!res.ok) throw new Error(dados.message);
  return dados;
}

export async function deletarReceita(id) {
  const res = await fetch(`${BASE_URL}/receitas/${id}`, {
    method: 'DELETE',
    headers: authHeaders()
  });
  if (!res.ok) {
    const dados = await res.json();
    throw new Error(dados.message);
  }
}

export async function getReceitasDoChef() {
  const res = await fetch(`${BASE_URL}/chef/receitas`, {
    headers: authHeaders()
  });
  const dados = await res.json();
  if (!res.ok) throw new Error(dados.message);
  return dados;
}

// FAVORITOS 

export async function getFavoritos() {
  const res = await fetch(`${BASE_URL}/favoritos`, {
    headers: authHeaders()
  });
  const dados = await res.json();
  if (!res.ok) throw new Error(dados.message);
  return dados;
}

export async function favoritarReceita(receita_id) {
  const res = await fetch(`${BASE_URL}/favoritos/${receita_id}`, {
    method: 'POST',
    headers: authHeaders()
  });
  const dados = await res.json();
  if (!res.ok) throw new Error(dados.message);
  return dados;
}

export async function desfavoritarReceita(receita_id) {
  const res = await fetch(`${BASE_URL}/favoritos/${receita_id}`, {
    method: 'DELETE',
    headers: authHeaders()
  });
  if (!res.ok) {
    const dados = await res.json();
    throw new Error(dados.message);
  }
}

// UPLOAD

export async function uploadImagem(file) {
  const formData = new FormData();
  formData.append('img', file);
  const res = await fetch(`${BASE_URL}/upload`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${getToken()}` },
    body: formData
  });
  const dados = await res.json();
  if (!res.ok) throw new Error(dados.message);
  return dados.img;
}

// ETIQUETAS

export async function getEtiquetas() {
  const res = await fetch(`${BASE_URL}/etiquetas`);
  const dados = await res.json();
  if (!res.ok) throw new Error(dados.message);
  return dados;
}
