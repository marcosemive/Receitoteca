import bcrypt from 'bcrypt';
import Database from '../database/database.js';

async function create(data) {
  const db = await Database.connect();

  const { nome, email, senha } = data;

  if (nome && email && senha) {
    const hash = await bcrypt.hash(senha, 10);
    const sql = `INSERT INTO chef (nome, email, senha) VALUES (?, ?, ?)`;
    const { lastID } = await db.run(sql, [nome, email, hash]);
    return await readById(lastID);
  } else {
    throw new Error('Todos os campos são obrigatórios');
  }
}

async function read() {
  const db = await Database.connect();
  const sql = `SELECT id, nome, email FROM chef`;
  return await db.all(sql);
}

async function readById(id) {
  const db = await Database.connect();
  const sql = `SELECT id, nome, email FROM chef WHERE id = ?`;
  const chef = await db.get(sql, [id]);
  if (chef) {
    return chef;
  } else {
    throw new Error('Chef não encontrado');
  }
}

async function readByEmail(email) {
  const db = await Database.connect();
  const sql = `SELECT id, nome, email, senha FROM chef WHERE email = ?`;
  return await db.get(sql, [email]);
}

async function update(data) {
  const db = await Database.connect();

  const { id, nome, email } = data;

  if (id && nome && email) {
    const sql = `UPDATE chef SET nome = ?, email = ? WHERE id = ?`;
    const { changes } = await db.run(sql, [nome, email, id]);
    if (changes === 1) {
      return await readById(id);
    } else {
      throw new Error('Chef não encontrado');
    }
  } else {
    throw new Error('Todos os campos são obrigatórios');
  }
}

async function remove(id) {
  const db = await Database.connect();
  const sql = `DELETE FROM chef WHERE id = ?`;
  const { changes } = await db.run(sql, [id]);
  if (changes === 1) {
    return true;
  } else {
    throw new Error('Chef não encontrado');
  }
}

export default { create, read, readById, readByEmail, update, remove };
