import { resolve } from 'node:path';
import { readFileSync } from 'node:fs';
import Receita from '../models/receita.js';
import Chef from '../models/chef.js';
import Etiqueta from '../models/etiqueta.js';

async function up() {
  const file = resolve('src', 'database', 'seeders.json');
  const seed = JSON.parse(readFileSync(file));

  for (const etiqueta of seed.etiquetas) {
    await Etiqueta.create(etiqueta);
  }

  for (const chef of seed.chefs) {
    await Chef.create(chef);
  }

  for (const receita of seed.receitas) {
    await Receita.create(receita);
  }
}

export default { up };
