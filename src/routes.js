import { Router } from 'express';
import { v4 as uuidv4} from 'uuid';
import {receitas} from './data/receitas.js';

const route = Router();


route.post('/receitas', (req,res) => {

    const { img, tag, title, time, servings, author, ingredients, steps } = req.body;

    if (!img || !tag || !title || !time || !servings || !author || !ingredients || !steps ) {
        throw new HttpError('Título, categoria, tempo de preparo, número de porções, autor da receita, ingredientes, intruções e imagem são necessários');
    }

    const id = uuidv4();

    const receita = { id, img, tag, title, time, servings, author, ingredients, steps };

    receitas.push(receita);

    return res.status(201).json(receita);

})

route.get('/receitas', (req,res) => {
    return res.json(receitas);
});


route.get('/receitas/:id', (req,res) => {
    const { id } = req.params

    const receita = receitas.find(receita => receita.id=== Number(id));

    return res.json(receita);

});



export default route;