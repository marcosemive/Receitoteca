import { initBusca, abrirReceita, fecharReceita, renderizarCards } from './modules/ui.js';
import { abrirFormCriar, abrirFormEditar, salvarReceita } from './modules/chef.js';
import { initNavegacao, restaurarLayoutNormal, mostrarChefArea, mostrarInicio } from './modules/navegacao.js';
import { toggleTagSelector, atualizarTag, fecharForm, initUploadFoto } from './modules/utils.js';
import { getReceitas } from './api.js';
localStorage.setItem("chefLogado", "true");
localStorage.setItem("chefNome", "Paulo Benetton");

  document.addEventListener("DOMContentLoaded", async () => {
  const receitas = await getReceitas();

  renderizarCards(receitas)
  initBusca();
  initNavegacao();
  initUploadFoto();

  const btnCriar = document.getElementById("btnCriarReceita");
  const btnEditar = document.getElementById("btnEditarReceita");
  const btnSalvar = document.getElementById("btnSalvarReceita");

  if (btnCriar) btnCriar.onclick = abrirFormCriar;
  if (btnEditar) btnEditar.onclick = abrirFormEditar;
  if (btnSalvar) btnSalvar.onclick = salvarReceita;
});