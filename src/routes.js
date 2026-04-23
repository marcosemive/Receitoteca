import { Router } from 'express';
import { v4 as uuidv4} from 'uuid';
import {receitas} from './data/receitas.js';
import { validarReceita } from './utils/validation.js';
import HttpError from './utils/HttpError.js';
const route = Router();


route.post('/receitas', (req,res,next) => {
        validarReceita(req.body);
        const id = uuidv4();
        const receita = { id, ...req.body };
        receitas.push(receita);
        
        return res.status(201).json(receita);
 });

route.get('/receitas', (req,res) => {
    return res.status(200).json(receitas);
});


route.get('/receitas/:id', (req,res,next) => {
    const { id } = req.params;

    const receita = receitas.find(receita => receita.id === id);

    if(!receita){
        throw new HttpError('Receita não encontrada', 404);
    }
        console.log('bateu no GET por ID');
    return res.status(200).json(receita);
});

route.put('/receitas/:id', (req, res, next) => {
        validarReceita(req.body);          
        const { id } = req.params;         
        const index = receitas.findIndex(r => r.id === id);  
        
        if (index === -1) {                
            throw new HttpError('Receita não encontrada', 404);
        }
        
        receitas[index] = { id, ...req.body };  
        return res.status(200).json(receitas[index]);       
        
});


route.delete('/receitas/:id',(req,res,next) => {
    const { id } = req.params;

    const index = receitas.findIndex((receita) => receita.id === id);

    if (index === -1) {
        throw new HttpError ('Receita não encontrada ', 404);
    }

    receitas.splice(index,1);

    return res.status(204).send();

})

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
