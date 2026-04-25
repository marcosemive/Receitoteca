import HttpError from './HttpError.js';

export function validarReceita(receita) {
    const campos = [
        { nome: 'img', mensagem: 'Imagem é obrigatória' },
        { nome: 'tag', mensagem: 'Categoria é obrigatória' },
        { nome: 'title', mensagem: 'Título é obrigatório' },
        { nome: 'time', mensagem: 'Tempo de preparo é obrigatório' },
        { nome: 'servings', mensagem: 'Número de porções é obrigatório' },
        { nome: 'author', mensagem: 'Autor é obrigatório' },
        { nome: 'ingredients', mensagem: 'Ingredientes são obrigatórios' },
        { nome: 'steps', mensagem: 'Instruções são obrigatórias' }
    ];

    
    for (const campo of campos) {
        const valor = receita[campo.nome];

        if (!valor ||
            (typeof valor === 'string' && valor.trim() === '') ||
            (Array.isArray(valor) && valor.join('').trim() === '')) {
            throw new HttpError(campo.mensagem, 400);
        }
    }
    if (receita.title && receita.title.trim() === 'Nome da Receita') {
        throw new HttpError('Por favor, altere o nome da receita', 400);
}
    
}

export function verificarDuplicata(receitas, dados, idAtual = null) {
  return receitas.find(r => 
    r.id !== idAtual &&
    r.title === dados.title &&
    r.author === dados.author &&
    r.time === dados.time &&
    r.tag === dados.tag &&
    r.servings === dados.servings &&
    JSON.stringify(r.ingredients) === JSON.stringify(dados.ingredients) &&
    JSON.stringify(r.steps) === JSON.stringify(dados.steps)
  );
}