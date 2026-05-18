import { fecharForm, getEtiquetasSelecionadas, setEtiquetasSelecionadas, initEtiquetasDropdown, atualizarDisplayEtiquetas } from './utils.js';
import { getReceitasDoChef, getReceita, criarReceita, atualizarReceita, deletarReceita, uploadImagem } from '../api.js';
import { renderizarCards } from './ui.js';
import { getReceitas } from '../api.js';

let modoEdicao = null;
let salvando = false;

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

function resetarBotao(texto = 'Salvar Receita') {
  const btn = document.getElementById('btnSalvarReceita');
  btn.disabled = false;
  btn.innerText = texto;
  btn.style.opacity = '1';
  btn.style.cursor = 'pointer';
  salvando = false;
}

function limparForm() {
  document.getElementById('form-titulo-overlay').innerText = 'Nome da Receita';
  document.getElementById('form-img-preview').src = 'images/placeholder-receita.png';
  document.getElementById('form-time').value = '';
  document.getElementById('form-servings').value = '4';
  document.getElementById('form-ingredients').value = '';
  document.getElementById('form-steps').value = '';
  document.getElementById('input-foto').value = '';

  // Desmarca todas as etiquetas
  setEtiquetasSelecionadas([]);

  modoEdicao = null;
  resetarBotao('Salvar Receita');
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
  resetarBotao('Atualizar Receita');

  // Marca as etiquetas que a receita já tem
  const nomesEtiquetas = (r.etiquetas || []).map(e => e.nome);
  setEtiquetasSelecionadas(nomesEtiquetas);

  const preview = document.getElementById('form-img-preview');
  preview.src = r.img || 'images/default.png';
  preview.dataset.originalImg = r.img;

  document.getElementById('form-titulo-overlay').innerText = r.title;
  document.getElementById('form-time').value = r.time;
  document.getElementById('form-servings').value = r.servings;
  document.getElementById('form-ingredients').value = r.ingredients.join('\n');
  document.getElementById('form-steps').value = r.steps.join('\n');
  document.getElementById('chef-form-overlay').style.display = 'flex';
}

export async function salvarReceita(e) {
  e.preventDefault();

  if (salvando) return;

  const btn = document.getElementById('btnSalvarReceita');
  const textoOriginal = btn.innerText;

  salvando = true;
  btn.disabled = true;
  btn.innerText = 'Salvando...';
  btn.style.opacity = '0.6';
  btn.style.cursor = 'not-allowed';

  const titulo = document.getElementById('form-titulo-overlay').innerText;
  const etiquetas = getEtiquetasSelecionadas(); // ← array de strings
  const tempo = document.getElementById('form-time').value;
  const porcoes = document.getElementById('form-servings').value;
  const ingredientes = document.getElementById('form-ingredients').value.split('\n').filter(Boolean);
  const passos = document.getElementById('form-steps').value.split('\n').filter(Boolean);

  if (etiquetas.length === 0) {
    alert('Selecione ao menos uma etiqueta.');
    resetarBotao(textoOriginal);
    return;
  }

  const inputFoto = document.getElementById('input-foto');
  const preview = document.getElementById('form-img-preview');
  let imgPath = modoEdicao ? (preview.dataset.originalImg || preview.src) : preview.src;

  const eraModoEdicao = modoEdicao;

  try {
    if (inputFoto.files[0]) {
      imgPath = await uploadImagem(inputFoto.files[0]);
    }

    const dadosReceita = {
      title: titulo,
      etiquetas: etiquetas,   // ← array enviado para o backend
      img: imgPath,
      time: tempo,
      servings: porcoes,
      ingredients: ingredientes,
      steps: passos
    };

    if (eraModoEdicao) {
      await atualizarReceita(eraModoEdicao, dadosReceita);
    } else {
      await criarReceita(dadosReceita);
    }

    fecharForm();
    limparForm();

    const receitas = await getReceitas();
    const grid = document.querySelector('#receitas .recipes-grid');
    renderizarCards(receitas, grid);
    await carregarReceitasDoChef();

    alert(eraModoEdicao ? 'Alterações salvas!' : 'Nova receita publicada!');

  } catch (err) {
    resetarBotao(textoOriginal);
    alert(err.message);
  }
}

async function deletarReceitaChef(id) {
  if (!confirm('Tem certeza que deseja deletar esta receita?')) return;
  try {
    await deletarReceita(id);
    const receitas = await getReceitas();
    const grid = document.querySelector('#receitas .recipes-grid');
    renderizarCards(receitas, grid);
    await carregarReceitasDoChef();
  } catch (err) {
    alert(err.message);
  }
}

export function initFormEtiquetas() {
  initEtiquetasDropdown();
}

window.abrirFormCriar = abrirFormCriar;
window.abrirFormEditar = abrirFormEditar;
window.editarReceita = editarReceita;