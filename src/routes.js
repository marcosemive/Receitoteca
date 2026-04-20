import { Router } from 'express';
import { v4 as uuidv4} from 'uuid';
import {receitas} from './data/receitas.js';
import { validarReceita } from './middlewares/validations.js';
import HttpError from './utils/HttpError.js';
const route = Router();


route.post('/receitas', (req,res,next) => {
    try{
        validarReceita(req.body);
        const id = uuidv4();
        const receita = { id, ...req.body };
        receitas.push(receita);
        
        return res.status(201).json(receita);
    }
    
    catch (err){
        next(err);
    }

})

route.get('/receitas', (req,res) => {
    return res.json(receitas);
});


route.get('/receitas/:id', (req,res,next) => {
    try {
    const { id } = req.params;

    const receita = receitas.find(receita => receita.id === id);

    if(!receita){
        throw new HttpError('Receita não encontrada', 404);
    }

    return res.json(receita);}

    catch(err) {
        next(err);
    }

});

route.put('/receitas/:id', (req, res, next) => {
    try {
        validarReceita(req.body);          
        const { id } = req.params;         
        const index = receitas.findIndex(r => r.id === id);  
        
        if (index === -1) {                
            throw new HttpError('Receita não encontrada', 404);
        }
        
        receitas[index] = { id, ...req.body };  
        return res.json(receitas[index]);       
        
    } catch (err) {
        next(err);  
    }
});


route.delete('/receitas/:id',(req,res,next) => {
    try{
    const { id } = req.params;

    const index = receitas.findIndex((receita) => receita.id === id);

    if (index === -1) {
        throw new HttpError ('Receita não encontrada ', 404);
    }

    receitas.splice(index,1);

    return res.status(204).send();
}
   catch (err) {
        next(err);  
    }

})

export default route;