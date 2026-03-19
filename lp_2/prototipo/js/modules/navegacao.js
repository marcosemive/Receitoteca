import { carregarReceitasDoChef } from './chef.js';

export function restaurarLayoutNormal() {
  const hero = document.getElementById("hero");
  const receitasSection = document.getElementById("receitas");
  const chefArea = document.getElementById("chef-area");

  if (hero) hero.style.display = "block";
  if (receitasSection) receitasSection.style.display = "block";
  if (chefArea) chefArea.style.display = "none";
}

export function mostrarChefArea() {
  const hero = document.getElementById("hero");
  const receitasPublicas = document.getElementById("receitas");
  const areaChef = document.getElementById("chef-area");

  if (hero) hero.style.display = "none";
  if (receitasPublicas) receitasPublicas.style.display = "none";
  
  if (areaChef) {
    areaChef.style.display = "block";
    carregarReceitasDoChef();
  }
}

export function mostrarInicio() {
  document.getElementById("hero").style.display = "block";
  document.getElementById("receitas").style.display = "block";
  document.getElementById("chef-area").style.display = "none";
}

function mostrarReceitas() {
  const hero = document.querySelector(".hero");
  const receitasSection = document.querySelector("#receitas");
  
  if (hero) hero.style.display = "none";
  setTimeout(() => {
    receitasSection?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 10);
  history.replaceState(null, "", "#receitas");
}

export function initNavegacao() {
  document.getElementById("link-receitas")?.addEventListener("click", (e) => {
    e.preventDefault();
    restaurarLayoutNormal();
    setTimeout(() => {
      document.getElementById("receitas")?.scrollIntoView({ behavior: "smooth" });
    }, 10);
  });

  document.getElementById("link-inicio")?.addEventListener("click", (e) => {
    e.preventDefault();
    restaurarLayoutNormal();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  document.getElementById("link-chef")?.addEventListener("click", (e) => {
    e.preventDefault();
    mostrarChefArea();
  });

  document.querySelector(".logout")?.addEventListener("click", () => {
    if (confirm("Deseja sair da sua conta?")) {
      window.location.href = "login.html";
    }
  });

  if (window.location.hash === "#receitas") {
    mostrarReceitas();
  }
}