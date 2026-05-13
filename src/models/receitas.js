import Database from '../database/database.js';
 
async function create(data) {
  const db = await Database.connect();
 
  const { img, tag, title, time, servings, author, ingredients, steps } = data;
 
  if (img && tag && title && time && servings && author && ingredients && steps) {
    if (title.trim() === 'Nome da Receita') {
      throw new Error('Por favor, altere o nome da receita');
    }
 
    const sql = `
      INSERT INTO
        receitas (img, tag, title, time, servings, author, ingredients, steps)
      VALUES
        (?, ?, ?, ?, ?, ?, ?, ?)
    `;
 
    const { lastID } = await db.run(sql, [
      img,
      tag,
      title,
      time,
      Number(servings),
      author,
      JSON.stringify(ingredients),
      JSON.stringify(steps),
    ]);
 
    return await readById(lastID);
  } else {
    throw new Error('Todos os campos são obrigatórios');
  }
}
 
async function read() {
  const db = await Database.connect();
 
  const sql = `
    SELECT
      id, img, tag, title, time, servings, author, ingredients, steps
    FROM
      receitas
  `;
 
  const receitas = await db.all(sql);
 
  return receitas.map((r) => ({
    ...r,
    ingredients: JSON.parse(r.ingredients),
    steps: JSON.parse(r.steps),
  }));
}
 
async function readById(id) {
  const db = await Database.connect();
 
  if (id) {
    const sql = `
      SELECT
        id, img, tag, title, time, servings, author, ingredients, steps
      FROM
        receitas
      WHERE
        id = ?
    `;
 
    const receita = await db.get(sql, [id]);
 
    if (receita) {
      return {
        ...receita,
        ingredients: JSON.parse(receita.ingredients),
        steps: JSON.parse(receita.steps),
      };
    } else {
      throw new Error('Receita não encontrada');
    }
  } else {
    throw new Error('Receita não encontrada');
  }
}
 
async function update(data) {
  const db = await Database.connect();
 
  const { id, img, tag, title, time, servings, author, ingredients, steps } = data;
 
  if (img && tag && title && time && servings && author && ingredients && steps && id) {
    const sql = `
      UPDATE
        receitas
      SET
        img = ?, tag = ?, title = ?, time = ?, servings = ?, author = ?, ingredients = ?, steps = ?
      WHERE
        id = ?
    `;
 
    const { changes } = await db.run(sql, [
      img,
      tag,
      title,
      time,
      Number(servings),
      author,
      JSON.stringify(ingredients),
      JSON.stringify(steps),
      id,
    ]);
 
    if (changes === 1) {
      return await readById(id);
    } else {
      throw new Error('Receita não encontrada');
    }
  } else {
    throw new Error('Todos os campos são obrigatórios');
  }
}
 
async function remove(id) {
  const db = await Database.connect();
 
  if (id) {
    const sql = `
      DELETE FROM
        receitas
      WHERE
        id = ?
    `;
 
    const { changes } = await db.run(sql, [id]);
 
    if (changes === 1) {
      return true;
    } else {
      throw new Error('Receita não encontrada');
    }
  } else {
    throw new Error('Receita não encontrada');
  }
}
 
export default { create, read, readById, update, remove };