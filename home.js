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

const receitas = {
  carbonara: {
    img: "carbonara.png",
    tag: "Salgada",
    title: "Pasta carbonara tradicional",
    time: "30 min",
    servings: "4 pessoas",
    author: "Paulo Benetton",
    ingredients: [
      "500g de macarrão",
      "4 ovos",
      "Queijo parmesão",
      "Pimenta-do-reino"
    ],
    steps: [
      "Cozinhe o macarrão",
      "Misture ovos e queijo",
      "Incorpore tudo ainda quente",
      "Finalize com pimenta"
    ]
  },
  brigadeiro: {
    img: "brigadeiro.png",
    tag: "Doce",
    title: "Bolo de brigadeiro belga",
    time: "60 min",
    servings: "8 pessoas",
    author: "Sandra Freitas",
    ingredients: [
      "Chocolate belga",
      "Leite condensado",
      "Manteiga",
      "Ovos"
    ],
    steps: [
      "Prepare a massa",
      "Asse o bolo",
      "Faça a cobertura",
      "Finalize"
    ]
  },
  salada: {
    img: "salada.png",
    tag: "Vegana",
    title: "Salada simples",
    time: "15 min",
    servings: "2 pessoas",
    author: "Gabriela Carvalho",
    ingredients: [
      "Alface",
      "Tomate",
      "Pepino",
      "Azeite e sal"
    ],
    steps: [
      "Lave os ingredientes",
      "Corte tudo",
      "Tempere e sirva"
    ]
  },
  panqueca: {
    img: "panqueca.png",
    tag: "Doce",
    title: "Panquecas americanas",
    time: "25 min",
    servings: "4 pessoas",
    author: "Leonardo Matias",
    ingredients: [
      "Farinha",
      "Leite",
      "Ovos",
      "Fermento"
    ],
    steps: [
      "Misture os ingredientes",
      "Aqueça a frigideira",
      "Asse dos dois lados"
    ]
  }
};

function abrirReceita(id) {
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

function fecharReceita() {
  document.getElementById("overlay").classList.remove("active");
}

document.querySelector(".logout").addEventListener("click", () => {
  if (confirm("Deseja sair da sua conta?")) {
    window.location.href = "login.html";
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const hero = document.querySelector(".hero");
  const receitasSection = document.querySelector("#receitas");

  function mostrarReceitas() {
    if (hero) hero.style.display = "none";

    setTimeout(() => {
      receitasSection?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 10);

    history.replaceState(null, "", "#receitas");
  }

  function voltarInicio() {
    if (hero) hero.style.display = "block";
    window.scrollTo({ top: 0, behavior: "smooth" });
    history.replaceState(null, "", "/");
  }

  if (window.location.hash === "#receitas") {
    mostrarReceitas();
  }

  document.getElementById("link-receitas").addEventListener("click", (e) => {
    e.preventDefault();
    restaurarLayoutNormal();
    setTimeout(() => {
      document.getElementById("receitas")?.scrollIntoView({ behavior: "smooth" });
    }, 10);
  });

  document.getElementById("link-inicio").addEventListener("click", (e) => {
    e.preventDefault();
    restaurarLayoutNormal();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});

localStorage.setItem("chefLogado", "true"); 
localStorage.setItem("chefNome", "Paulo Benetton");

let modoEdicao = null;

window.addEventListener("DOMContentLoaded", () => {
   const btnCriar = document.getElementById("btnCriarReceita");
   const btnEditar = document.getElementById("btnEditarReceita");

   if (btnCriar) btnCriar.onclick = abrirFormCriar;
   if (btnEditar) btnEditar.onclick = abrirFormEditar;
});

function carregarReceitasDoChef() {
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

function mostrarChefArea() {
  const hero = document.getElementById("hero");
  const receitasPublicas = document.getElementById("receitas");
  const areaChef = document.getElementById("chef-area");

  if(hero) hero.style.display = "none";
  if(receitasPublicas) receitasPublicas.style.display = "none";
  
  if(areaChef) {
    areaChef.style.display = "block";
    carregarReceitasDoChef();
  }
}

function mostrarInicio() {
  document.getElementById("hero").style.display = "block";
  document.getElementById("receitas").style.display = "block";
  document.getElementById("chef-area").style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("link-chef").addEventListener("click", (e) => {
    e.preventDefault();
    mostrarChefArea();
  });

  document.getElementById("link-inicio").addEventListener("click", (e) => {
    e.preventDefault();
    mostrarInicio();
  });

  const btnCriar = document.getElementById("btnCriarReceita");
  if(btnCriar) btnCriar.onclick = () => {
    document.getElementById("chef-form-overlay").style.display = "flex";
  };
});

function restaurarLayoutNormal() {
  const hero = document.getElementById("hero");
  const receitasSection = document.getElementById("receitas");
  const chefArea = document.getElementById("chef-area");

  if (hero) hero.style.display = "block";
  if (receitasSection) receitasSection.style.display = "block";
  if (chefArea) chefArea.style.display = "none";
}

function abrirFormCriar() {
  modoEdicao = null;
  const overlay = document.getElementById("chef-form-overlay");
  document.getElementById("form-img-preview").src = "placeholder-receita.png";
  if(overlay) {
    overlay.style.display = "flex";
    document.getElementById("chef-form-overlay").style.display = "flex";
  }
}

function fecharForm() {
  document.getElementById("chef-form-overlay").style.display = "none";
}

document.getElementById("btnCriarReceita").onclick = abrirFormCriar;
document.getElementById("btnEditarReceita").onclick = abrirFormEditar;

function limparForm() {
  document.getElementById("form-title").value = "";
  document.getElementById("form-time").value = "";
  document.getElementById("form-servings").value = "";
  document.getElementById("form-ingredients").value = "";
  document.getElementById("form-steps").value = "";
}

function abrirFormEditar() {
  const itens = document.querySelectorAll(".chef-item");

  if (itens.length === 0) {
    alert("Nenhuma receita cadastrada.");
    return;
  }

  alert("Clique em uma receita para editar.");
}

function editarReceita(id) {
  const r = receitas[id];
  if (!r) return;

  modoEdicao = id;

  document.getElementById('form-tag-display').innerText = r.tag;
  atualizarTag(r.tag);
  
  const preview = document.getElementById("form-img-preview");
  preview.src = r.img || "default.png"; 
  preview.dataset.changed = "false";

  document.getElementById("form-titulo-overlay").innerText = r.title;
  document.getElementById("form-time").value = r.time;
  document.getElementById("form-servings").value = r.servings;
  
  document.getElementById("form-ingredients").value = r.ingredients.join("\n");
  document.getElementById("form-steps").value = r.steps.join("\n");

  document.getElementById("btnSalvarReceita").innerText = "Atualizar Receita";
  document.getElementById("chef-form-overlay").style.display = "flex";
}

document.getElementById("btnSalvarReceita").onclick = (e) => {
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

    if (receitasGrid && !modoEdicao) {
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

  if(typeof renderizarReceitas === 'function') renderizarReceitas();
};

function renderizarReceitas() {
  const container = document.getElementById("container-receitas");
  if (!container) return;
  
  container.innerHTML = "";

  Object.entries(receitas).forEach(([id, r]) => {
    const card = `
      <div class="recipe-card" onclick="abrirReceita('${id}')">
        <img src="${r.img}">
        <h3>${r.title}</h3>
        <span class="tag">${r.tag}</span>
      </div>
    `;
    container.innerHTML += card;
  });
}

document.getElementById('input-foto').addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(event) {
      const preview = document.getElementById('form-img-preview');
      preview.src = event.target.result;
      preview.dataset.changed = "true";
    };
    reader.readAsDataURL(file);
  }
});

function toggleTagSelector() {
  const select = document.getElementById('form-tag-select');
  select.style.display = 'block';
  select.focus();
}

function atualizarTag(valor) {
  const display = document.getElementById('form-tag-display');
  if (!display) return;

  display.innerText = valor;
  display.classList.remove('tag-salgada', 'tag-doce', 'tag-vegana');

  if (valor === "Salgada") display.classList.add('tag-salgada');
  if (valor === "Doce") display.classList.add('tag-doce');
  if (valor === "Vegana") display.classList.add('tag-vegana');

  document.getElementById('form-tag-select').style.display = 'none';
}
