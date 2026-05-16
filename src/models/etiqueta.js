import Database from '../database/database.js';

async function create(data) {
  const db = await Database.connect();

  const { nome } = data;

  if (nome) {
    const sql = `INSERT INTO etiqueta (nome) VALUES (?)`;
    const { lastID } = await db.run(sql, [nome]);
    return await readById(lastID);
  } else {
    throw new Error('Nome da etiqueta é obrigatório');
  }
}

async function read() {
  const db = await Database.connect();
  const sql = `SELECT id, nome FROM etiqueta`;
  return await db.all(sql);
}

async function readById(id) {
  const db = await Database.connect();
  const sql = `SELECT id, nome FROM etiqueta WHERE id = ?`;
  const etiqueta = await db.get(sql, [id]);
  if (etiqueta) {
    return etiqueta;
  } else {
    throw new Error('Etiqueta não encontrada');
  }
}

async function readByNome(nome) {
  const db = await Database.connect();
  const sql = `SELECT id, nome FROM etiqueta WHERE nome = ?`;
  return await db.get(sql, [nome]);
}

export default { create, read, readById, readByNome };
