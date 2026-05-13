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
}
 
export default { up };
 