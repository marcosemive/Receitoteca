const TODAS_ETIQUETAS = [
  'Salgada', 'Doce', 'Vegana', 'Low Carb', 'Sem Glúten', 'Sem Lactose',
  'Vegetariana', 'Sem Açúcar', 'Sem Ovo', 'Sem Soja', 'Integral',
  'Rica em Proteína', 'Poucas Calorias', 'Sem Conservantes', 'Sem Gordura'
];

// Abre/fecha o dropdown de etiquetas
export function toggleTagSelector() {
  const dropdown = document.getElementById('etiquetas-dropdown');
  if (!dropdown) return;
  const visivel = dropdown.style.display === 'block';
  dropdown.style.display = visivel ? 'none' : 'block';
}

// Retorna array com os nomes das etiquetas selecionadas
export function getEtiquetasSelecionadas() {
  const checkboxes = document.querySelectorAll('#etiquetas-dropdown input[type="checkbox"]:checked');
  return Array.from(checkboxes).map(cb => cb.value);
}

// Define quais etiquetas estão marcadas (usado na edição)
export function setEtiquetasSelecionadas(nomes) {
  const lista = Array.isArray(nomes) ? nomes : [nomes];
  document.querySelectorAll('#etiquetas-dropdown input[type="checkbox"]').forEach(cb => {
    cb.checked = lista.includes(cb.value);
  });
  atualizarDisplayEtiquetas();
}

// Atualiza o texto/pills exibidos no botão
export function atualizarDisplayEtiquetas() {
  const selecionadas = getEtiquetasSelecionadas();
  const display = document.getElementById('form-tag-display');
  if (!display) return;

  if (selecionadas.length === 0) {
    display.innerHTML = '<span style="color:#999;">Selecionar categorias...</span>';
  } else {
    display.innerHTML = selecionadas
      .map(n => `<span class="tag-pill">${n}</span>`)
      .join('');
  }
}

// Inicializa o dropdown de etiquetas com checkboxes
export function initEtiquetasDropdown() {
  const wrapper = document.getElementById('etiquetas-wrapper');
  if (!wrapper) return;

  wrapper.innerHTML = `
    <div id="form-tag-display" onclick="toggleTagSelector()" style="
      cursor:pointer; min-height:34px; display:flex; flex-wrap:wrap;
      gap:4px; align-items:center; background:#fff; border:1px solid #ddd;
      border-radius:8px; padding:6px 10px;
    ">
      <span style="color:#999;">Selecionar categorias...</span>
    </div>

    <div id="etiquetas-dropdown" style="
      display:none; position:absolute; z-index:999;
      background:#fff; border:1px solid #ddd; border-radius:8px;
      padding:10px; max-height:220px; overflow-y:auto;
      width:100%; box-shadow:0 4px 12px rgba(0,0,0,0.12);
    ">
      ${TODAS_ETIQUETAS.map(nome => `
        <label style="display:flex; align-items:center; gap:8px;
                      padding:5px 4px; cursor:pointer; font-size:13px;">
          <input type="checkbox" value="${nome}"
                 onchange="atualizarDisplayEtiquetas()">
          ${nome}
        </label>
      `).join('')}
    </div>
  `;

  // Fecha dropdown ao clicar fora
  document.addEventListener('click', (e) => {
    const dropdown = document.getElementById('etiquetas-dropdown');
    const wrapperEl = document.getElementById('etiquetas-wrapper');
    if (dropdown && wrapperEl && !wrapperEl.contains(e.target)) {
      dropdown.style.display = 'none';
    }
  });
}

export function fecharForm() {
  document.getElementById('chef-form-overlay').style.display = 'none';
  // Fecha o dropdown de etiquetas se estiver aberto
  const dropdown = document.getElementById('etiquetas-dropdown');
  if (dropdown) dropdown.style.display = 'none';
}

export function initUploadFoto() {
  document.getElementById('input-foto')?.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(event) {
        const preview = document.getElementById('form-img-preview');
        preview.src = event.target.result;
        preview.dataset.changed = 'true';
      };
      reader.readAsDataURL(file);
    }
  });
}

window.toggleTagSelector = toggleTagSelector;
window.atualizarDisplayEtiquetas = atualizarDisplayEtiquetas;
window.fecharForm = fecharForm;