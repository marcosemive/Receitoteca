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

        if (!receita[campo.nome]) {
            throw new HttpError(campo.mensagem, 400);
        }
    }
}
