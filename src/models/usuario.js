import bcrypt from 'bcrypt';
import Database from '../database/database.js';

async function create(data) {
  const db = await Database.connect();

  const { nome, email, senha } = data;

  if (nome && email && senha) {
    const hash = await bcrypt.hash(senha, 10);
    const sql = `INSERT INTO usuario (nome, email, senha) VALUES (?, ?, ?)`;
    const { lastID } = await db.run(sql, [nome, email, hash]);
    return await readById(lastID);
  } else {
    throw new Error('Todos os campos são obrigatórios');
  }
}

async function read() {
  const db = await Database.connect();
  const sql = `SELECT id, nome, email FROM usuario`;
  return await db.all(sql);
}

async function readById(id) {
  const db = await Database.connect();
  const sql = `SELECT id, nome, email FROM usuario WHERE id = ?`;
  const usuario = await db.get(sql, [id]);
  if (usuario) {
    return usuario;
  } else {
    throw new Error('Usuário não encontrado');
  }
}

async function readByEmail(email) {
  const db = await Database.connect();
  const sql = `SELECT id, nome, email, senha FROM usuario WHERE email = ?`;
  return await db.get(sql, [email]);
}

async function update(data) {
  const db = await Database.connect();

  const { id, nome, email } = data;

  if (id && nome && email) {
    const sql = `UPDATE usuario SET nome = ?, email = ? WHERE id = ?`;
    const { changes } = await db.run(sql, [nome, email, id]);
    if (changes === 1) {
      return await readById(id);
    } else {
      throw new Error('Usuário não encontrado');
    }
  } else {
    throw new Error('Todos os campos são obrigatórios');
  }
}

async function remove(id) {
  const db = await Database.connect();
  const sql = `DELETE FROM usuario WHERE id = ?`;
  const { changes } = await db.run(sql, [id]);
  if (changes === 1) {
    return true;
  } else {
    throw new Error('Usuário não encontrado');
  }
}

export default { create, read, readById, readByEmail, update, remove };
