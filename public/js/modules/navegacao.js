import { carregarReceitasDoChef } from './chef.js';
import { renderizarCards } from './ui.js';
import { getFavoritos } from '../api.js';

export function restaurarLayoutNormal() {
  const hero = document.getElementById('hero');
  const receitasSection = document.getElementById('receitas');
  const chefArea = document.getElementById('chef-area');
  const favoritosSection = document.getElementById('favoritos-area');

  if (hero) hero.style.display = 'block';
  if (receitasSection) receitasSection.style.display = 'block';
  if (chefArea) chefArea.style.display = 'none';
  if (favoritosSection) favoritosSection.style.display = 'none';
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
      if (favoritosGrid) renderizarCards(receitas, favoritosGrid);
    } catch (err) {
      if (favoritosGrid) favoritosGrid.innerHTML = `<p style="color:#888;">Nenhuma receita favorita ainda.</p>`;
    }
  }
}

export function mostrarInicio() {
  document.getElementById('hero').style.display = 'block';
  document.getElementById('receitas').style.display = 'block';
  document.getElementById('chef-area').style.display = 'none';
  const fav = document.getElementById('favoritos-area');
  if (fav) fav.style.display = 'none';
}

export function initNavegacao() {
  const tipo = localStorage.getItem('tipo');
  const nome = localStorage.getItem('nome');

  // Exibe o nome do usuário logado
  const nomeEl = document.getElementById('nav-nome');
  if (nomeEl && nome) nomeEl.innerText = nome;

  document.getElementById('link-receitas')?.addEventListener('click', (e) => {
    e.preventDefault();
    restaurarLayoutNormal();
    setTimeout(() => {
      document.getElementById('receitas')?.scrollIntoView({ behavior: 'smooth' });
    }, 10);
  });

  document.getElementById('link-inicio')?.addEventListener('click', (e) => {
    e.preventDefault();
    restaurarLayoutNormal();
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
