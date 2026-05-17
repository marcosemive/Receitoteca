import { getReceita, favoritarReceita, desfavoritarReceita, getFavoritos } from '../api.js';

export function renderizarCards(receitas, grid = null) {
  // Se não passar um grid específico, usa o da página inicial
  const container = grid || document.querySelector('#receitas .recipes-grid');
  if (!container) return;

  container.innerHTML = '';

  if (receitas.length === 0) {
    container.innerHTML = '<p style="color:#888; padding: 16px;">Nenhuma receita encontrada.</p>';
    return;
  }

  receitas.forEach(r => {
    const card = document.createElement('article');
    card.className = 'recipe-card';
    card.setAttribute('onclick', `abrirReceita(${r.id})`);

    const etiquetaNome = r.etiqueta?.nome || '';
    const etiquetaClass = etiquetaNome.toLowerCase();
    const primeiroIngrediente = r.ingredients[0] || 'Receita deliciosa';

    card.innerHTML = `
      <div class="recipe-image">
        <img src="${r.img}" alt="${r.title}">
        <span class="tag ${etiquetaClass}">${etiquetaNome}</span>
      </div>
      <div class="recipe-content">
        <h3>${r.title}</h3>
        <p class="description">${primeiroIngrediente}...</p>
        <div class="recipe-meta">
          <span class="comments">(0 comentários)</span>
          <span class="chef">Chef: ${r.chef?.nome || ''}</span>
        </div>
      </div>
    `;

    container.appendChild(card);
  });
}

export function initBusca() {
  const searchInput = document.querySelector('.search');
  if (searchInput) {
    searchInput.addEventListener('input', function () {
      const termo = this.value.toLowerCase();
      const cards = document.querySelectorAll('#receitas .recipe-card');
      cards.forEach(card => {
        const titulo = card.querySelector('h3').innerText.toLowerCase();
        card.style.display = titulo.includes(termo) ? 'block' : 'none';
      });
    });
  }
}

export async function abrirReceita(id) {
  const r = await getReceita(id);
  if (!r) return;

  const tipo = localStorage.getItem('tipo');
  const token = localStorage.getItem('token');

  document.getElementById('modal-img').src = r.img;
  document.getElementById('modal-title').innerText = r.title;
  document.getElementById('modal-tag').innerText = r.etiqueta?.nome || '';
  document.getElementById('modal-time').innerText = `⏱ ${r.time}`;
  document.getElementById('modal-servings').innerText = `👥 ${r.servings}`;
  document.getElementById('modal-author').innerText = `👨‍🍳 ${r.chef?.nome || ''}`;

  const btnFav = document.getElementById('modal-fav');
  if (btnFav) {
    if (tipo === 'usuario' && token) {
      btnFav.style.display = 'inline';
      btnFav.dataset.id = id;

      try {
        const favoritos = await getFavoritos();
        const jaSalvo = favoritos.some(f => f.id === id);
        btnFav.innerText = jaSalvo ? '❤️' : '🤍';
        btnFav.dataset.favoritado = jaSalvo ? 'true' : 'false';
      } catch {
        btnFav.innerText = '🤍';
        btnFav.dataset.favoritado = 'false';
      }
    } else {
      btnFav.style.display = 'none';
    }
  }

  const ing = document.getElementById('modal-ingredients');
  ing.innerHTML = '';
  r.ingredients.forEach(i => ing.innerHTML += `<li>${i}</li>`);

  const steps = document.getElementById('modal-steps');
  steps.innerHTML = '';
  r.steps.forEach(s => steps.innerHTML += `<li>${s}</li>`);

  document.getElementById('overlay').classList.add('active');
}

export function fecharReceita() {
  document.getElementById('overlay').classList.remove('active');
}

document.addEventListener('DOMContentLoaded', () => {
  const btnFav = document.getElementById('modal-fav');
  if (btnFav) {
    btnFav.addEventListener('click', async (e) => {
      e.stopPropagation();
      const id = Number(btnFav.dataset.id);
      const jaSalvo = btnFav.dataset.favoritado === 'true';

      try {
        if (jaSalvo) {
          await desfavoritarReceita(id);
          btnFav.innerText = '🤍';
          btnFav.dataset.favoritado = 'false';
        } else {
          await favoritarReceita(id);
          btnFav.innerText = '❤️';
          btnFav.dataset.favoritado = 'true';
        }
      } catch (err) {
        alert(err.message);
      }
    });
  }
});

window.abrirReceita = abrirReceita;
window.fecharReceita = fecharReceita;