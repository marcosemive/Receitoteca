import { resolve } from 'node:path';
import { readFileSync } from 'node:fs';
import Receita from '../models/receitas.js';
 
async function up() {
  const file = resolve('src', 'database', 'seeders.json');
 
  const seed = JSON.parse(readFileSync(file));
 
  for (const receita of seed.receitas) {
    await Receita.create(receita);
  }
}
 
export default { up };
 