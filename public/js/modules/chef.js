import { fecharForm } from './utils.js';
import { getReceitasDoChef, getReceita, criarReceita, atualizarReceita, deletarReceita, uploadImagem } from '../api.js';
import { renderizarCards } from './ui.js';
import { getReceitas } from '../api.js';

let modoEdicao = null;

export async function carregarReceitasDoChef() {
  const lista = document.getElementById('chef-lista-receitas');
  lista.innerHTML = '';

  try {
    const receitas = await getReceitasDoChef();

    if (receitas.length === 0) {
      lista.innerHTML = '<p style="color:#888; padding: 12px;">Nenhuma receita cadastrada ainda.</p>';
      return;
    }

    receitas.forEach(r => {
      const item = document.createElement('div');
      item.className = 'chef-item';
      item.innerHTML = `
        <span>${r.title}</span>
        <div style="display:flex;gap:8px;">
          <strong class="btn-editar">Editar</strong>
          <strong class="btn-deletar" style="background:#fff0f0;color:#e70731;">Deletar</strong>
        </div>
      `;
      item.querySelector('.btn-editar').onclick = (e) => { e.stopPropagation(); editarReceita(r.id); };
      item.querySelector('.btn-deletar').onclick = (e) => { e.stopPropagation(); deletarReceitaChef(r.id); };
      lista.appendChild(item);
    });
  } catch (err) {
    lista.innerHTML = `<p style="color:#e70731;">${err.message}</p>`;
  }
}

function limparForm() {
  document.getElementById('form-titulo-overlay').innerText = 'Nome da Receita';
  document.getElementById('form-tag-display').innerText = 'Salgada';
  if (typeof window.atualizarTag === 'function') window.atualizarTag('Salgada');
  document.getElementById('form-img-preview').src = 'images/placeholder-receita.png';
  document.getElementById('form-time').value = '';
  document.getElementById('form-servings').value = '4';
  document.getElementById('form-ingredients').value = '';
  document.getElementById('form-steps').value = '';
  document.getElementById('input-foto').value = '';
  document.getElementById('btnSalvarReceita').innerText = 'Salvar Receita';
  modoEdicao = null;
}

export function abrirFormCriar() {
  limparForm();
  const overlay = document.getElementById('chef-form-overlay');
  if (overlay) overlay.style.display = 'flex';
}

export function abrirFormEditar() {
  const itens = document.querySelectorAll('.chef-item');
  if (itens.length === 0) {
    alert('Nenhuma receita cadastrada.');
    return;
  }
  alert('Clique em uma receita para editar.');
}

export async function editarReceita(id) {
  const r = await getReceita(id);
  if (!r) return;

  document.getElementById('input-foto').value = '';
  modoEdicao = id;

  const etiquetaNome = r.etiqueta?.nome || 'Salgada';
  document.getElementById('form-tag-display').innerText = etiquetaNome;
  if (typeof window.atualizarTag === 'function') window.atualizarTag(etiquetaNome);

  const preview = document.getElementById('form-img-preview');
  preview.src = r.img || 'images/default.png';
  preview.dataset.originalImg = r.img;

  document.getElementById('form-titulo-overlay').innerText = r.title;
  document.getElementById('form-time').value = r.time;
  document.getElementById('form-servings').value = r.servings;
  document.getElementById('form-ingredients').value = r.ingredients.join('\n');
  document.getElementById('form-steps').value = r.steps.join('\n');
  document.getElementById('btnSalvarReceita').innerText = 'Atualizar Receita';
  document.getElementById('chef-form-overlay').style.display = 'flex';
}

export async function salvarReceita(e) {
  e.preventDefault();

  const titulo = document.getElementById('form-titulo-overlay').innerText;
  const etiqueta = document.getElementById('form-tag-display').innerText;
  const tempo = document.getElementById('form-time').value;
  const porcoes = document.getElementById('form-servings').value;
  const ingredientes = document.getElementById('form-ingredients').value.split('\n').filter(Boolean);
  const passos = document.getElementById('form-steps').value.split('\n').filter(Boolean);

  const inputFoto = document.getElementById('input-foto');
  const preview = document.getElementById('form-img-preview');
  let imgPath = modoEdicao ? (preview.dataset.originalImg || preview.src) : preview.src;

  if (inputFoto.files[0]) {
    imgPath = await uploadImagem(inputFoto.files[0]);
  }

  const dadosReceita = {
    title: titulo,
    etiqueta: etiqueta,
    img: imgPath,
    time: tempo,
    servings: porcoes,
    ingredients: ingredientes,
    steps: passos
  };

  try {
    if (modoEdicao) {
      await atualizarReceita(modoEdicao, dadosReceita);
      alert('Alterações salvas!');
    } else {
      await criarReceita(dadosReceita);
      alert('Nova receita publicada!');
    }

    const receitas = await getReceitas();
    renderizarCards(receitas);
    modoEdicao = null;
    fecharForm();
    await carregarReceitasDoChef();
  } catch (err) {
    alert(err.message);
  }
}

async function deletarReceitaChef(id) {
  if (!confirm('Tem certeza que deseja deletar esta receita?')) return;
  try {
    await deletarReceita(id);
    const receitas = await getReceitas();
    renderizarCards(receitas);
    await carregarReceitasDoChef();
  } catch (err) {
    alert(err.message);
  }
}

window.abrirFormCriar = abrirFormCriar;
window.abrirFormEditar = abrirFormEditar;
window.editarReceita = editarReceita;
