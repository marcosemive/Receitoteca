import Database from './database.js';

async function up() {
  const db = await Database.connect();

  await db.run(`
    CREATE TABLE chef (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL UNIQUE,
      senha VARCHAR(255) NOT NULL
    )
  `);

  await db.run(`
    CREATE TABLE usuario (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL UNIQUE,
      senha VARCHAR(255) NOT NULL
    )
  `);

  await db.run(`
    CREATE TABLE etiqueta (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome VARCHAR(50) NOT NULL UNIQUE
    )
  `);

  await db.run(`
    CREATE TABLE receita (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      img VARCHAR(255) NOT NULL,
      title VARCHAR(100) NOT NULL,
      time VARCHAR(50) NOT NULL,
      servings INTEGER NOT NULL,
      chef_id INTEGER NOT NULL,
      ingredients TEXT NOT NULL,
      steps TEXT NOT NULL,
      FOREIGN KEY (chef_id) REFERENCES chef(id) ON DELETE CASCADE
    )
  `);

  await db.run(`
    CREATE TABLE receita_etiqueta (
      receita_id INTEGER NOT NULL,
      etiqueta_id INTEGER NOT NULL,
      PRIMARY KEY (receita_id, etiqueta_id),
      FOREIGN KEY (receita_id) REFERENCES receita(id) ON DELETE CASCADE,
      FOREIGN KEY (etiqueta_id) REFERENCES etiqueta(id) ON DELETE CASCADE
    )
  `);

  await db.run(`
    CREATE TABLE favorito (
      usuario_id INTEGER NOT NULL,
      receita_id INTEGER NOT NULL,
      PRIMARY KEY (usuario_id, receita_id),
      FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE CASCADE,
      FOREIGN KEY (receita_id) REFERENCES receita(id) ON DELETE CASCADE
    )
  `);
}

export default { up };
