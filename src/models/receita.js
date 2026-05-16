import Database from '../database/database.js';
import Etiqueta from './etiqueta.js';
import Chef from './chef.js';

async function create(data) {
  const db = await Database.connect();

  const { img, etiqueta, title, time, servings, chef_email, chef_id, ingredients, steps } = data;

  if (img && etiqueta && title && time && servings && ingredients && steps) {
    if (title.trim() === 'Nome da Receita') {
      throw new Error('Por favor, altere o nome da receita');
    }

    // Resolve chef_id: seed usa chef_email, rotas autenticadas já têm chef_id
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
      img,
      title,
      time,
      Number(servings),
      resolvedChefId,
      JSON.stringify(ingredients),
      JSON.stringify(steps),
    ]);

    // Vincula a etiqueta
    const etiquetaObj = await Etiqueta.readByNome(etiqueta);
    if (!etiquetaObj) throw new Error('Etiqueta não encontrada');

    await db.run(
      `INSERT INTO receita_etiqueta (receita_id, etiqueta_id) VALUES (?, ?)`,
      [lastID, etiquetaObj.id]
    );

    return await readById(lastID);
  } else {
    throw new Error('Todos os campos são obrigatórios');
  }
}

async function read() {
  const db = await Database.connect();

  const sql = `
    SELECT
      r.id, r.img, r.title, r.time, r.servings,
      r.ingredients, r.steps,
      c.id AS chef_id, c.nome AS chef_nome,
      e.id AS etiqueta_id, e.nome AS etiqueta_nome
    FROM receita r
    JOIN chef c ON c.id = r.chef_id
    LEFT JOIN receita_etiqueta re ON re.receita_id = r.id
    LEFT JOIN etiqueta e ON e.id = re.etiqueta_id
  `;

  const rows = await db.all(sql);

  return rows.map(formatarReceita);
}

async function readById(id) {
  const db = await Database.connect();

  const sql = `
    SELECT
      r.id, r.img, r.title, r.time, r.servings,
      r.ingredients, r.steps,
      c.id AS chef_id, c.nome AS chef_nome,
      e.id AS etiqueta_id, e.nome AS etiqueta_nome
    FROM receita r
    JOIN chef c ON c.id = r.chef_id
    LEFT JOIN receita_etiqueta re ON re.receita_id = r.id
    LEFT JOIN etiqueta e ON e.id = re.etiqueta_id
    WHERE r.id = ?
  `;

  const receita = await db.get(sql, [id]);

  if (receita) {
    return formatarReceita(receita);
  } else {
    throw new Error('Receita não encontrada');
  }
}

async function readByChef(chef_id) {
  const db = await Database.connect();

  const sql = `
    SELECT
      r.id, r.img, r.title, r.time, r.servings,
      r.ingredients, r.steps,
      c.id AS chef_id, c.nome AS chef_nome,
      e.id AS etiqueta_id, e.nome AS etiqueta_nome
    FROM receita r
    JOIN chef c ON c.id = r.chef_id
    LEFT JOIN receita_etiqueta re ON re.receita_id = r.id
    LEFT JOIN etiqueta e ON e.id = re.etiqueta_id
    WHERE r.chef_id = ?
  `;

  const rows = await db.all(sql, [chef_id]);

  return rows.map(formatarReceita);
}

async function update(data) {
  const db = await Database.connect();

  const { id, img, etiqueta, title, time, servings, ingredients, steps, chef_id } = data;

  if (id && img && etiqueta && title && time && servings && ingredients && steps) {
    // Verifica se a receita pertence ao chef
    const atual = await db.get(`SELECT chef_id FROM receita WHERE id = ?`, [id]);
    if (!atual) throw new Error('Receita não encontrada');
    if (chef_id && atual.chef_id !== chef_id) throw new Error('Sem permissão para editar esta receita');

    const sql = `
      UPDATE receita
      SET img = ?, title = ?, time = ?, servings = ?, ingredients = ?, steps = ?
      WHERE id = ?
    `;

    const { changes } = await db.run(sql, [
      img,
      title,
      time,
      Number(servings),
      JSON.stringify(ingredients),
      JSON.stringify(steps),
      id,
    ]);

    if (changes === 1) {
      // Atualiza etiqueta
      const etiquetaObj = await Etiqueta.readByNome(etiqueta);
      if (!etiquetaObj) throw new Error('Etiqueta não encontrada');

      await db.run(`DELETE FROM receita_etiqueta WHERE receita_id = ?`, [id]);
      await db.run(`INSERT INTO receita_etiqueta (receita_id, etiqueta_id) VALUES (?, ?)`, [id, etiquetaObj.id]);

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

  const sql = `DELETE FROM receita WHERE id = ?`;
  const { changes } = await db.run(sql, [id]);

  if (changes === 1) {
    return true;
  } else {
    throw new Error('Receita não encontrada');
  }
}

function formatarReceita(row) {
  return {
    id: row.id,
    img: row.img,
    title: row.title,
    time: row.time,
    servings: row.servings,
    chef: { id: row.chef_id, nome: row.chef_nome },
    etiqueta: { id: row.etiqueta_id, nome: row.etiqueta_nome },
    ingredients: JSON.parse(row.ingredients),
    steps: JSON.parse(row.steps),
  };
}

export default { create, read, readById, readByChef, update, remove };
