import Database from '../database/database.js';
import Etiqueta from './etiqueta.js';
import Chef from './chef.js';

async function vincularEtiquetas(db, receitaId, etiquetas) {
  // etiquetas pode ser array ['Salgada', 'Vegana'] ou string 'Salgada' (legado seed)
  const lista = Array.isArray(etiquetas) ? etiquetas : [etiquetas];

  await db.run(`DELETE FROM receita_etiqueta WHERE receita_id = ?`, [receitaId]);

  for (const nome of lista) {
    const etiquetaObj = await Etiqueta.readByNome(nome);
    if (!etiquetaObj) throw new Error(`Etiqueta "${nome}" não encontrada`);
    await db.run(
      `INSERT INTO receita_etiqueta (receita_id, etiqueta_id) VALUES (?, ?)`,
      [receitaId, etiquetaObj.id]
    );
  }
}

async function create(data) {
  const db = await Database.connect();

  const { img, etiqueta, etiquetas, title, time, servings, chef_email, chef_id, ingredients, steps } = data;

  // aceita tanto 'etiqueta' (seed/legado) quanto 'etiquetas' (novo frontend)
  const tagsInput = etiquetas || etiqueta;

  if (img && tagsInput && title && time && servings && ingredients && steps) {
    if (title.trim() === 'Nome da Receita') {
      throw new Error('Por favor, altere o nome da receita');
    }

    let resolvedChefId = chef_id;
    if (!resolvedChefId && chef_email) {
      const chef = await Chef.readByEmail(chef_email);
      if (!chef) throw new Error('Chef não encontrado');
      resolvedChefId = chef.id;
    }

    const sql = `
      INSERT INTO receita (img, title, time, servings, chef_id, ingredients, steps)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const { lastID } = await db.run(sql, [
      img, title, time, Number(servings), resolvedChefId,
      JSON.stringify(ingredients), JSON.stringify(steps),
    ]);

    await vincularEtiquetas(db, lastID, tagsInput);

    return await readById(lastID);
  } else {
    throw new Error('Todos os campos são obrigatórios');
  }
}

async function read() {
  const db = await Database.connect();

  const rows = await db.all(`
    SELECT
      r.id, r.img, r.title, r.time, r.servings,
      r.ingredients, r.steps,
      c.id AS chef_id, c.nome AS chef_nome
    FROM receita r
    JOIN chef c ON c.id = r.chef_id
  `);

  const receitas = [];
  for (const row of rows) {
    receitas.push(await readById(row.id));
  }
  return receitas;
}

async function readById(id) {
  const db = await Database.connect();

  const receita = await db.get(`
    SELECT r.id, r.img, r.title, r.time, r.servings,
           r.ingredients, r.steps,
           c.id AS chef_id, c.nome AS chef_nome
    FROM receita r
    JOIN chef c ON c.id = r.chef_id
    WHERE r.id = ?
  `, [id]);

  if (!receita) throw new Error('Receita não encontrada');

  // Busca todas as etiquetas da receita
  const etiquetasRows = await db.all(`
    SELECT e.id, e.nome
    FROM etiqueta e
    JOIN receita_etiqueta re ON re.etiqueta_id = e.id
    WHERE re.receita_id = ?
  `, [id]);

  return {
    id: receita.id,
    img: receita.img,
    title: receita.title,
    time: receita.time,
    servings: receita.servings,
    chef: { id: receita.chef_id, nome: receita.chef_nome },
    etiquetas: etiquetasRows,  // array de { id, nome }
    ingredients: JSON.parse(receita.ingredients),
    steps: JSON.parse(receita.steps),
  };
}

async function readByChef(chef_id) {
  const db = await Database.connect();

  const rows = await db.all(`
    SELECT id FROM receita WHERE chef_id = ?
  `, [chef_id]);

  const receitas = [];
  for (const row of rows) {
    receitas.push(await readById(row.id));
  }
  return receitas;
}

async function update(data) {
  const db = await Database.connect();

  const { id, img, etiqueta, etiquetas, title, time, servings, ingredients, steps, chef_id } = data;

  const tagsInput = etiquetas || etiqueta;

  if (id && img && tagsInput && title && time && servings && ingredients && steps) {
    const atual = await db.get(`SELECT chef_id FROM receita WHERE id = ?`, [id]);
    if (!atual) throw new Error('Receita não encontrada');
    if (chef_id && atual.chef_id !== chef_id) throw new Error('Sem permissão para editar esta receita');

    const { changes } = await db.run(`
      UPDATE receita
      SET img = ?, title = ?, time = ?, servings = ?, ingredients = ?, steps = ?
      WHERE id = ?
    `, [img, title, time, Number(servings), JSON.stringify(ingredients), JSON.stringify(steps), id]);

    if (changes === 1) {
      await vincularEtiquetas(db, id, tagsInput);
      return await readById(id);
    } else {
      throw new Error('Receita não encontrada');
    }
  } else {
    throw new Error('Todos os campos são obrigatórios');
  }
}

async function remove(id, chef_id) {
  const db = await Database.connect();

  const atual = await db.get(`SELECT chef_id FROM receita WHERE id = ?`, [id]);
  if (!atual) throw new Error('Receita não encontrada');
  if (chef_id && atual.chef_id !== chef_id) throw new Error('Sem permissão para deletar esta receita');

  const { changes } = await db.run(`DELETE FROM receita WHERE id = ?`, [id]);

  if (changes === 1) return true;
  else throw new Error('Receita não encontrada');
}

export default { create, read, readById, readByChef, update, remove };