import { fecharForm } from './utils.js';
import { getReceitas, getReceita, criarReceita, atualizarReceita, deletarReceita } from '../api.js';
import { renderizarCards } from './ui.js';

let modoEdicao = null;

export async function carregarReceitasDoChef() {
 const lista = document.getElementById("chef-lista-receitas");
  lista.innerHTML = "";
  const chefNome = "Paulo Benetton";

  const receitas = await getReceitas();

  receitas.filter(r => r.author === chefNome).forEach(r => {
    const item = document.createElement("div");
    item.className = "chef-item";
    item.innerHTML = `
  <span>${r.title}</span>
  <div style="display:flex;gap:8px;">
    <strong class="btn-editar">Editar</strong>
    <strong class="btn-deletar" style="background:#fff0f0;color:#e70731;">Deletar</strong>
  </div>
`;
item.querySelector('.btn-editar').onclick = (e) => { e.stopPropagation(); editarReceita(r.id); };
item.querySelector('.btn-deletar').onclick = (e) => { e.stopPropagation(); deletarReceitaChef(r.id); };
    lista.appendChild(item);});
}

function limparForm() {
  document.getElementById("form-titulo-overlay").innerText = "Nome da Receita";
  document.getElementById("form-tag-display").innerText = "Salgada";
  if (typeof window.atualizarTag === 'function') window.atualizarTag("Salgada");
  document.getElementById("form-img-preview").src = "images/placeholder-receita.png";
  document.getElementById("form-time").value = "";
  document.getElementById("form-servings").value = "4";
  document.getElementById("form-ingredients").value = "";
  document.getElementById("form-steps").value = "";
}

export function abrirFormCriar() {
  modoEdicao = null;
  limparForm();
  const overlay = document.getElementById("chef-form-overlay");
  if (overlay) overlay.style.display = "flex";
}

export function abrirFormEditar() {
  const itens = document.querySelectorAll(".chef-item");
  if (itens.length === 0) {
    alert("Nenhuma receita cadastrada.");
    return;
  }
  alert("Clique em uma receita para editar.");
}

export async function editarReceita(id) {
  const r = await getReceita(id);
  if (!r) return;

  modoEdicao = id;

  document.getElementById('form-tag-display').innerText = r.tag;
  if (typeof window.atualizarTag === 'function') window.atualizarTag(r.tag);
  
  const preview = document.getElementById("form-img-preview");
  preview.src = r.img || "images/default.png";
  preview.dataset.changed = "false";

  document.getElementById("form-titulo-overlay").innerText = r.title;
  document.getElementById("form-time").value = r.time;
  document.getElementById("form-servings").value = r.servings;
  
  document.getElementById("form-ingredients").value = r.ingredients.join("\n");
  document.getElementById("form-steps").value = r.steps.join("\n");

  document.getElementById("btnSalvarReceita").innerText = "Atualizar Receita";
  document.getElementById("chef-form-overlay").style.display = "flex";
}

export async function salvarReceita(e) {
  e.preventDefault();

  const titulo = document.getElementById("form-titulo-overlay").innerText;
  const tag = document.getElementById("form-tag-display").innerText;
  const foto = document.getElementById("form-img-preview").src;
  const tempo = document.getElementById("form-time").value;
  const porcoes = document.getElementById("form-servings").value;
  const ingredientes = document.getElementById("form-ingredients").value.split("\n");
  const passos = document.getElementById("form-steps").value.split("\n");

  const dadosReceita = {
    title: titulo,
    tag: tag,
    img: foto,
    time: tempo,
    servings: porcoes,
    author: localStorage.getItem("chefNome") || "Chef Paulo",
    ingredients: ingredientes,
    steps: passos
  };
  
  if (modoEdicao) {
    await atualizarReceita(modoEdicao, dadosReceita);
    const receitas = await getReceitas();
    renderizarCards(receitas);
    alert("Alterações salvas!");
} else {
    await criarReceita(dadosReceita);
    const receitas = await getReceitas();
    renderizarCards(receitas);
    alert("Nova receita publicada!");
  }

  modoEdicao = null;
  fecharForm();
  await carregarReceitasDoChef();
}

async function deletarReceitaChef(id) {
  if (!confirm('Tem certeza que deseja deletar esta receita?')) return;
  await deletarReceita(id);
  const receitas = await getReceitas();
  renderizarCards(receitas);
  await carregarReceitasDoChef();
}


window.abrirFormCriar = abrirFormCriar;
window.abrirFormEditar = abrirFormEditar;
window.editarReceita = editarReceita;