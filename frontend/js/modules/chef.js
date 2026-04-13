import { receitas } from './dados.js';
import { fecharForm } from './utils.js';

let modoEdicao = null;

export function carregarReceitasDoChef() {
  const lista = document.getElementById("chef-lista-receitas");
  lista.innerHTML = "";
  const chefNome = "Paulo Benetton";

  Object.entries(receitas).forEach(([id, r]) => {
    if (r.author === chefNome) {
      const item = document.createElement("div");
      item.className = "chef-item";
      item.innerHTML = `<span>${r.title}</span> <strong>Editar </strong>`;
      item.onclick = () => editarReceita(id);
      lista.appendChild(item);
    }
  });
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

export function editarReceita(id) {
  const r = receitas[id];
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

export function salvarReceita(e) {
  e.preventDefault();

  const titulo = document.getElementById("form-titulo-overlay").innerText;
  const tag = document.getElementById("form-tag-display").innerText;
  const foto = document.getElementById("form-img-preview").src;
  const tempo = document.getElementById("form-time").value;
  const porcoes = document.getElementById("form-servings").value;
  const ingredientes = document.getElementById("form-ingredients").value.split("\n");
  const passos = document.getElementById("form-steps").value.split("\n");

  if (modoEdicao) {
    const receitaAtualizada = {
      ...receitas[modoEdicao],
      title: titulo,
      tag: tag,
      img: foto,
      time: tempo,
      servings: porcoes,
      ingredients: ingredientes,
      steps: passos
    };
    
    receitas[modoEdicao] = receitaAtualizada;

    const cardExistente = document.querySelector(`.recipe-card[onclick="abrirReceita('${modoEdicao}')"]`);
    if (cardExistente) {
      cardExistente.querySelector('h3').innerText = titulo;
      cardExistente.querySelector('img').src = foto;
      const tagSpan = cardExistente.querySelector('.tag');
      tagSpan.innerText = tag;
      tagSpan.className = 'tag ' + tag.toLowerCase();
    }

    alert("Alterações salvas!");
  } else {
    const novoId = "receita_" + Date.now();
    receitas[novoId] = {
      title: titulo,
      tag: tag,
      img: foto,
      time: tempo,
      servings: porcoes,
      author: localStorage.getItem("chefNome") || "Chef Paulo",
      ingredients: ingredientes,
      steps: passos
    };

    const receitasGrid = document.querySelector(".recipes-grid");
    if (receitasGrid) {
      const novoCard = document.createElement("article");
      novoCard.className = "recipe-card";
      novoCard.setAttribute("onclick", `abrirReceita('${novoId}')`);

      novoCard.innerHTML = `
        <div class="recipe-image">
          <img src="${foto}" alt="${titulo}">
          <span class="tag ${tag.toLowerCase()}">${tag}</span>
        </div>

        <div class="recipe-content">
          <h3>${titulo}</h3>
          <p class="description">
            ${ingredientes[0] || "Receita adicionada recentemente..."}
          </p>

          <div class="recipe-meta">
            <span class="comments">(0 comentários)</span>
            <span class="chef">Chef: ${localStorage.getItem("chefNome")}</span>
          </div>
        </div>
      `;

      receitasGrid.prepend(novoCard);
    }

    alert("Nova receita publicada!");
  }

  modoEdicao = null;
  fecharForm();
  carregarReceitasDoChef();
}

window.abrirFormCriar = abrirFormCriar;
window.abrirFormEditar = abrirFormEditar;
window.editarReceita = editarReceita;