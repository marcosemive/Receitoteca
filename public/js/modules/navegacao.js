import { carregarReceitasDoChef } from './chef.js';
import { renderizarCards } from './ui.js';
import { getFavoritos, getReceitas } from '../api.js';

export async function restaurarLayoutNormal() {
  const hero = document.getElementById('hero');
  const receitasSection = document.getElementById('receitas');
  const chefArea = document.getElementById('chef-area');
  const favoritosSection = document.getElementById('favoritos-area');

  if (hero) hero.style.display = 'block';
  if (receitasSection) receitasSection.style.display = 'block';
  if (chefArea) chefArea.style.display = 'none';
  if (favoritosSection) favoritosSection.style.display = 'none';

  // Recarrega todas as receitas públicas no grid da página inicial
  const grid = document.querySelector('#receitas .recipes-grid');
  if (grid) {
    const receitas = await getReceitas();
    renderizarCards(receitas, grid);
  }
}

export function mostrarChefArea() {
  const hero = document.getElementById('hero');
  const receitasPublicas = document.getElementById('receitas');
  const areaChef = document.getElementById('chef-area');
  const favoritosSection = document.getElementById('favoritos-area');

  if (hero) hero.style.display = 'none';
  if (receitasPublicas) receitasPublicas.style.display = 'none';
  if (favoritosSection) favoritosSection.style.display = 'none';

  if (areaChef) {
    areaChef.style.display = 'block';
    carregarReceitasDoChef();
  }
}

export async function mostrarFavoritos() {
  const hero = document.getElementById('hero');
  const receitasPublicas = document.getElementById('receitas');
  const areaChef = document.getElementById('chef-area');
  const favoritosSection = document.getElementById('favoritos-area');
  const favoritosGrid = document.getElementById('favoritos-grid');

  if (hero) hero.style.display = 'none';
  if (receitasPublicas) receitasPublicas.style.display = 'none';
  if (areaChef) areaChef.style.display = 'none';

  if (favoritosSection) {
    favoritosSection.style.display = 'block';

    try {
      const receitas = await getFavoritos();
      if (receitas.length === 0) {
        favoritosGrid.innerHTML = '<p style="color:#888; padding: 16px;">Nenhuma receita favorita ainda.</p>';
      } else {
        renderizarCards(receitas, favoritosGrid);
      }
    } catch (err) {
      favoritosGrid.innerHTML = '<p style="color:#888; padding: 16px;">Nenhuma receita favorita ainda.</p>';
    }
  }
}

export function initNavegacao() {
  const tipo = localStorage.getItem('tipo');
  const nome = localStorage.getItem('nome');

  const nomeEl = document.getElementById('nav-nome');
  if (nomeEl && nome) nomeEl.innerText = nome;

  document.getElementById('link-receitas')?.addEventListener('click', (e) => {
    e.preventDefault();
    restaurarLayoutNormal().then(() => {
      document.getElementById('receitas')?.scrollIntoView({ behavior: 'smooth' });
    });
  });

  document.getElementById('link-inicio')?.addEventListener('click', (e) => {
    e.preventDefault();
    restaurarLayoutNormal().then(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  document.getElementById('link-chef')?.addEventListener('click', (e) => {
    e.preventDefault();
    mostrarChefArea();
  });

  document.getElementById('link-favoritos')?.addEventListener('click', (e) => {
    e.preventDefault();
    mostrarFavoritos();
  });

  document.querySelector('.logout')?.addEventListener('click', () => {
    if (confirm('Deseja sair da sua conta?')) {
      localStorage.clear();
      window.location.href = 'login.html';
    }
  });
}