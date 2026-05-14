import Database from './database.js';
 
async function up() {
  const db = await Database.connect();
 
  const receitasSql = `
    CREATE TABLE receitas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      img VARCHAR(255) NOT NULL,
      tag VARCHAR(50) NOT NULL,
      title VARCHAR(100) NOT NULL,
      time VARCHAR(50) NOT NULL,
      servings INTEGER NOT NULL,
      author VARCHAR(100) NOT NULL,
      ingredients TEXT NOT NULL,
      steps TEXT NOT NULL
    )
  `;
    
  await db.run(receitasSql);

  const usuarioSql = `
    CREATE TABLE usuario (
      id_usuario SERIAL PRIMARY KEY,
      nome VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL UNIQUE,
      senha VARCHAR(50) NOT NULL
    )
  `;

  await db.run(usuarioSql);


  const chefSql = `
    CREATE TABLE chef (
      id_chef SERIAL PRIMARY KEY,
      nome VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL UNIQUE,
      senha VARCHAR(50) NOT NULL
    )
  `;

  await db.run(chefSql);


  const favoritoSql = `
    CREATE TABLE favorito (
      id_usuario_fk INTEGER NOT NULL,
      id_receita_fk INTEGER NOT NULL,
      PRIMARY KEY (id_usuario_fk, id_receita_fk),
      FOREIGN KEY (id_usuario_fk)
          REFERENCES usuario(id_usuario)
          ON DELETE CASCADE,
      FOREIGN KEY (id_receita_fk)
          REFERENCES receita(id_receita)
          ON DELETE CASCADE
    )
  `;

  await db.run(favoritoSql);

  const etiquetaSql = `
    CREATE TABLE etiqueta (
      id_etiqueta SERIAL PRIMARY KEY,
      nome VARCHAR(50) NOT NULL UNIQUE
    )
  `;

  await db.run(etiquetaSql);

  const receita_etiqueta = `
    CREATE TABLE receita_etiqueta (
      id_receita_fk INTEGER NOT NULL,
      id_etiqueta_fk INTEGER NOT NULL,
      PRIMARY KEY (id_receita_fk, id_etiqueta_fk),
      FOREIGN KEY (id_receita_fk)
          REFERENCES receita(id_receita)
          ON DELETE CASCADE,
      FOREIGN KEY (id_etiqueta_fk)
          REFERENCES etiqueta(id_etiqueta)
          ON DELETE CASCADE
    )
  `;
  
  await db.run(receita_etiqueta);

}  


 
export default { up };
 