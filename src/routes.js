import express from 'express';
import bcrypt from 'bcrypt';
import Receita from './models/receita.js';
import Chef from './models/chef.js';
import Usuario from './models/usuario.js';
import Etiqueta from './models/etiqueta.js';
import Favorito from './models/favorito.js';
import { upload } from './utils/upload.js';
import { gerarToken, autenticarChef, autenticarUsuario } from './middlewares/auth.js';

class HTTPError extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
  }
}

const router = express.Router();

// AUTH

router.post('/auth/chef/cadastro', async (req, res) => {
  try {
    const chef = await Chef.create(req.body);
    const token = gerarToken({ id: chef.id, nome: chef.nome, tipo: 'chef' });
    return res.status(201).json({ chef, token });
  } catch (error) {
    throw new HTTPError(error.message, 400);
  }
});

router.post('/auth/chef/login', async (req, res) => {
  try {
    const { email, senha } = req.body;
    const chef = await Chef.readByEmail(email);
    if (!chef) throw new Error('E-mail ou senha inválidos');

    const senhaCorreta = await bcrypt.compare(senha, chef.senha);
    if (!senhaCorreta) throw new Error('E-mail ou senha inválidos');

    const token = gerarToken({ id: chef.id, nome: chef.nome, tipo: 'chef' });
    return res.json({ chef: { id: chef.id, nome: chef.nome, email: chef.email }, token });
  } catch (error) {
    throw new HTTPError(error.message, 401);
  }
});

router.post('/auth/usuario/cadastro', async (req, res) => {
  try {
    const usuario = await Usuario.create(req.body);
    const token = gerarToken({ id: usuario.id, nome: usuario.nome, tipo: 'usuario' });
    return res.status(201).json({ usuario, token });
  } catch (error) {
    throw new HTTPError(error.message, 400);
  }
});

router.post('/auth/usuario/login', async (req, res) => {
  try {
    const { email, senha } = req.body;
    const usuario = await Usuario.readByEmail(email);
    if (!usuario) throw new Error('E-mail ou senha inválidos');

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) throw new Error('E-mail ou senha inválidos');

    const token = gerarToken({ id: usuario.id, nome: usuario.nome, tipo: 'usuario' });
    return res.json({ usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email }, token });
  } catch (error) {
    throw new HTTPError(error.message, 401);
  }
});

// ETIQUETAS

router.get('/etiquetas', async (req, res) => {
  try {
    const etiquetas = await Etiqueta.read();
    return res.json(etiquetas);
  } catch (error) {
    throw new HTTPError(error.message, 400);
  }
});

// RECEITAS

router.get('/receitas', async (req, res) => {
  try {
    const receitas = await Receita.read();
    return res.json(receitas);
  } catch (error) {
    throw new HTTPError('Unable to read receitas', 400);
  }
});

router.get('/receitas/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const receita = await Receita.readById(id);
    return res.json(receita);
  } catch (error) {
    throw new HTTPError(error.message, 404);
  }
});

router.post('/receitas', autenticarChef, async (req, res) => {
  try {
    const receita = req.body;
    const createdReceita = await Receita.create({ ...receita, chef_id: req.chef.id });
    return res.status(201).json(createdReceita);
  } catch (error) {
    throw new HTTPError(error.message, 400);
  }
});

router.put('/receitas/:id', autenticarChef, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const receita = req.body;
    const updatedReceita = await Receita.update({ ...receita, id, chef_id: req.chef.id });
    return res.json(updatedReceita);
  } catch (error) {
    throw new HTTPError(error.message, 400);
  }
});

router.delete('/receitas/:id', autenticarChef, async (req, res) => {
  const id = Number(req.params.id);
  if (await Receita.remove(id, req.chef.id)) {
    return res.sendStatus(204);
  } else {
    throw new HTTPError('Unable to remove receita', 400);
  }
});

// RECEITAS DO CHEF LOGADO

router.get('/chef/receitas', autenticarChef, async (req, res) => {
  try {
    const receitas = await Receita.readByChef(req.chef.id);
    return res.json(receitas);
  } catch (error) {
    throw new HTTPError(error.message, 400);
  }
});

// FAVORITOS

router.get('/favoritos', autenticarUsuario, async (req, res) => {
  try {
    const receitas = await Favorito.readByUsuario(req.usuario.id);
    return res.json(receitas);
  } catch (error) {
    throw new HTTPError(error.message, 400);
  }
});

router.post('/favoritos/:receita_id', autenticarUsuario, async (req, res) => {
  try {
    const receita_id = Number(req.params.receita_id);
    const favorito = await Favorito.add(req.usuario.id, receita_id);
    return res.status(201).json(favorito);
  } catch (error) {
    throw new HTTPError(error.message, 400);
  }
});

router.delete('/favoritos/:receita_id', autenticarUsuario, async (req, res) => {
  try {
    const receita_id = Number(req.params.receita_id);
    if (await Favorito.remove(req.usuario.id, receita_id)) {
      return res.sendStatus(204);
    }
  } catch (error) {
    throw new HTTPError(error.message, 400);
  }
});

// UPLOAD

router.post('/upload', autenticarChef, upload.single('img'), async (req, res) => {
  try {
    return res.json({ img: `images/${req.file.filename}` });
  } catch (error) {
    throw new HTTPError('Falha no upload da imagem', 400);
  }
});

// HANDLERS

router.use((req, res, next) => {
  return res.status(404).json({ message: 'Content not found!' });
});

router.use((err, req, res, next) => {
  if (err instanceof HTTPError) {
    return res.status(err.code).json({ message: err.message });
  } else {
    return res.status(500).json({ message: 'Something broke!' });
  }
});

export default router;