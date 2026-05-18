import { initBusca, abrirReceita, fecharReceita, renderizarCards } from './modules/ui.js';
import { abrirFormCriar, abrirFormEditar, salvarReceita, initFormEtiquetas } from './modules/chef.js';
import { initNavegacao } from './modules/navegacao.js';
import { fecharForm, initUploadFoto } from './modules/utils.js';
import { getReceitas } from './api.js';

const token = localStorage.getItem('token');
const tipo = localStorage.getItem('tipo');

if (!token) {
  window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', async () => {
  const receitas = await getReceitas();
  const grid = document.querySelector('#receitas .recipes-grid');
  renderizarCards(receitas, grid);

  initBusca();
  initNavegacao();
  initUploadFoto();
  initFormEtiquetas(); // ← inicializa o dropdown de etiquetas

  const linkChef = document.getElementById('link-chef');
  const linkFavoritos = document.getElementById('link-favoritos');

  if (tipo === 'chef') {
    if (linkChef) linkChef.style.display = 'inline';
    if (linkFavoritos) linkFavoritos.style.display = 'none';
  } else {
    if (linkChef) linkChef.style.display = 'none';
    if (linkFavoritos) linkFavoritos.style.display = 'inline';
  }

  const btnCriar = document.getElementById('btnCriarReceita');
  const btnEditar = document.getElementById('btnEditarReceita');
  const btnSalvar = document.getElementById('btnSalvarReceita');

  if (btnCriar) btnCriar.onclick = abrirFormCriar;
  if (btnEditar) btnEditar.onclick = abrirFormEditar;
  if (btnSalvar) btnSalvar.onclick = salvarReceita;
});