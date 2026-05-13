import { resolve } from 'node:path';
import { readFileSync } from 'node:fs';
import Receita from '../models/Receita.js';
 
async function up() {
  const file = resolve('src', 'database', 'seeders.json');
 
  const seed = JSON.parse(readFileSync(file));
 
  for (const receita of seed.receitas) {
    await Receita.create(receita);
  }
}
 
export default { up };

// removido os id do seeders.json, pois o banco vai gerá-los automaticamente