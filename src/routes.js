import { Router } from 'express';
import { v4 as uuidv4} from 'uuid';
import {receitas} from './data/receitas.js';
import { validarReceita, verificarDuplicata } from './utils/validation.js';
import HttpError from './utils/HttpError.js';
import { upload } from './utils/upload.js';
const route = Router();


route.post('/receitas', (req, res) => {
        validarReceita(req.body);
        if (verificarDuplicata(receitas, req.body)) {
            throw new HttpError('Receita já cadastrada', 409);
        }
        const id = uuidv4();
        const receita = { 
          id, 
          ...req.body,
          servings: Number(req.body.servings)
        };
        receitas.push(receita);
        
        return res.status(201).json(receita);
});

route.get('/receitas', (req, res) => {
    return res.status(200).json(receitas);
});

route.get('/receitas/:id', (req, res) => {
    const { id } = req.params;
    const receita = receitas.find(receita => receita.id === id);
    if(!receita){
        throw new HttpError('Receita não encontrada', 404);
    }
    return res.status(200).json(receita);
});

route.put('/receitas/:id', (req, res) => {
        validarReceita(req.body);          
        const { id } = req.params;         
        if (verificarDuplicata(receitas, req.body, id)) {
            throw new HttpError('Receita já cadastrada', 409);
        }
        const index = receitas.findIndex(r => r.id === id);  
        if (index === -1) {                
            throw new HttpError('Receita não encontrada', 404);
        }
        receitas[index] = { 
          id, 
          ...req.body,
          servings: Number(req.body.servings)
        };
        return res.status(200).json(receitas[index]);       
});

route.delete('/receitas/:id', (req, res) => {
    const { id } = req.params;
    const index = receitas.findIndex((receita) => receita.id === id);
    if (index === -1) {
        throw new HttpError('Receita não encontrada', 404);
    }
    receitas.splice(index, 1);
    return res.status(204).send();
})

route.post('/upload', upload.single('img'), (req, res) => {
  return res.json({ img: `images/${req.file.filename}` });
});

route.use((req, res, next) => {
  res.status(404).json({ error: 'Content not found!' });
});

route.use((err, req, res, next) => {
  if (err instanceof HttpError) {
    return res.status(err.code).json({ message: err.message });
  }
  return res.status(500).json({ message: 'Something broke!' });
});

export default route;