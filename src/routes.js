import express from 'express';
import Receita from './models/receitas.js';
import { upload } from './utils/upload.js';

class HTTPError extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
  }
}

const router = express.Router();

router.post('/receitas', async (req, res) => {
  try {
    const receita = req.body;

    const createdReceita = await Receita.create(receita);

    return res.json(createdReceita);
  } catch (error) {
    throw new HTTPError(error.message, 400);
  }
});

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

router.put('/receitas/:id', async (req, res) => {
  try {
    const receita = req.body;

    const id = Number(req.params.id);

    const updatedReceita = await Receita.update({ ...receita, id });

    return res.json(updatedReceita);
  } catch (error) {
    throw new HTTPError(error.message, 400);
  }
});

router.delete('/receitas/:id', async (req, res) => {
  const id = Number(req.params.id);

  if (await Receita.remove(id)) {
    return res.sendStatus(204);
  } else {
    throw new HTTPError('Unable to remove receita', 400);
  }
});

router.post('/upload', upload.single('img'), async (req, res) => {
  try {
    return res.json({ img: `images/${req.file.filename}` });
  } catch (error) {
    throw new HTTPError('Falha no upload da imagem', 400);
  }
});

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