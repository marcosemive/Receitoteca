import { receitas } from './dados.js';

export function renderizarCards() {
  const grid = document.querySelector('.recipes-grid');
  if (!grid) return;

  grid.innerHTML = '';

  Object.entries(receitas).forEach(([id, r]) => {
    const card = document.createElement('article');
    card.className = 'recipe-card';
    card.setAttribute('onclick', `abrirReceita('${id}')`);

    const primeiroIngrediente = r.ingredients[0] || "Receita deliciosa";

    card.innerHTML = `
      <div class="recipe-image">
        <img src="${r.img}" alt="${r.title}">
        <span class="tag ${r.tag.toLowerCase()}">${r.tag}</span>
      </div>
      <div class="recipe-content">
        <h3>${r.title}</h3>
        <p class="description">${primeiroIngrediente}...</p>
        <div class="recipe-meta">
          <span class="comments">(0 comentários)</span>
          <span class="chef">Chef: ${r.author}</span>
        </div>
      </div>
    `;

    grid.appendChild(card);
  });
}

export function initBusca() {
  const searchInput = document.querySelector(".search");
  if (searchInput) {
    searchInput.addEventListener("input", function () {
      const termo = this.value.toLowerCase();
      const cards = document.querySelectorAll(".recipe-card");
      cards.forEach(card => {
        const titulo = card.querySelector("h3").innerText.toLowerCase();
        card.style.display = titulo.includes(termo) ? "block" : "none";
      });
    });
  }
}

export function abrirReceita(id) {
  const r = receitas[id];
  if (!r) return;

  document.getElementById("modal-img").src = r.img;
  document.getElementById("modal-title").innerText = r.title;
  document.getElementById("modal-tag").innerText = r.tag;
  document.getElementById("modal-time").innerText = `⏱ ${r.time}`;
  document.getElementById("modal-servings").innerText = `👥 ${r.servings}`;
  document.getElementById("modal-author").innerText = `👨‍🍳 ${r.author}`;

  const ing = document.getElementById("modal-ingredients");
  ing.innerHTML = "";
  r.ingredients.forEach(i => ing.innerHTML += `<li>${i}</li>`);

  const steps = document.getElementById("modal-steps");
  steps.innerHTML = "";
  r.steps.forEach(s => steps.innerHTML += `<li>${s}</li>`);

  document.getElementById("overlay").classList.add("active");
}

export function fecharReceita() {
  document.getElementById("overlay").classList.remove("active");
}

window.abrirReceita = abrirReceita;
window.fecharReceita = fecharReceita;