export function toggleTagSelector() {
  const select = document.getElementById('form-tag-select');
  select.style.display = 'block';
  select.focus();
}

export function atualizarTag(valor) {
  const display = document.getElementById('form-tag-display');
  if (!display) return;

  display.innerText = valor;
  display.classList.remove('tag-salgada', 'tag-doce', 'tag-vegana');

  if (valor === "Salgada") display.classList.add('tag-salgada');
  if (valor === "Doce") display.classList.add('tag-doce');
  if (valor === "Vegana") display.classList.add('tag-vegana');

  document.getElementById('form-tag-select').style.display = 'none';
}

export function fecharForm() {
  document.getElementById("chef-form-overlay").style.display = "none";
}

export function initUploadFoto() {
  document.getElementById('input-foto')?.addEventListener('change', function(e) {
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
}

window.toggleTagSelector = toggleTagSelector;
window.atualizarTag = atualizarTag;
window.fecharForm = fecharForm;