import Database from '../database/database.js';
 
async function create ({img, tag, title, time, servings, author, ingredients, steps }){
  const db = await Database.connect();

 
  // Validação dos campos obrigatórios
  if (!img || !tag || !title || !time || !servings || !author || !ingredients || !steps) {
    throw new Error('Todos os campos são obrigatórios');
  }
 
  // Validação do nome padrão
  if (title.trim() === 'Nome da Receita') {
    throw new Error('Por favor, altere o nome da receita');
  }
 
  // Verificação de duplicata
  const duplicate = receitas.find(
    (r) =>
      r.id !== data.id &&
      r.title === title &&
      r.author === author &&
      r.time === time &&
      r.tag === tag &&
      r.servings === Number(servings) &&
      JSON.stringify(r.ingredients) === JSON.stringify(ingredients) &&
      JSON.stringify(r.steps) === JSON.stringify(steps)
  );
 
  if (duplicate) {
    throw new Error('Receita já cadastrada');
  }
 
  const id = data.id ?? createId();
 
  const receita = { id, img, tag, title, time, servings: Number(servings), author, ingredients, steps };
 
 
  return receita;
}
 
function read() {
  return receitas;
}
 
function readById(id) {
  const receita = receitas.find((r) => r.id === id);
 
  if (!receita) {
    throw new Error('Receita não encontrada');
  }
 
  return receita;
}
 
function update(data) {
  const { id, img, tag, title, time, servings, author, ingredients, steps } = data;
 
  if (!img || !tag || !title || !time || !servings || !author || !ingredients || !steps) {
    throw new Error('Todos os campos são obrigatórios');
  }
 
  const index = receitas.findIndex((r) => r.id === id);
 
  if (index === -1) {
    throw new Error('Receita não encontrada');
  }
 
  const duplicate = receitas.find(
    (r) =>
      r.id !== id &&
      r.title === title &&
      r.author === author &&
      r.time === time &&
      r.tag === tag &&
      r.servings === Number(servings) &&
      JSON.stringify(r.ingredients) === JSON.stringify(ingredients) &&
      JSON.stringify(r.steps) === JSON.stringify(steps)
  );
 
  if (duplicate) {
    throw new Error('Receita já cadastrada');
  }
 
  const receita = { id, img, tag, title, time, servings: Number(servings), author, ingredients, steps };
 
  receitas[index] = receita;
 
  return receita;
}
 
function remove(id) {
  const index = receitas.findIndex((r) => r.id === id);
 
  if (index === -1) {
    throw new Error('Receita não encontrada');
  }
 
  receitas.splice(index, 1);
 
  return true;
}
 
export default { create, read, readById, update, remove };