const express = require('express');
const { body, validationResult } = require('express-validator');

//Instanciation de l'application serveur
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// Simulation de données en mémoire
let articles = [
    { id: 1, title: 'Premier article', content: 'Contenu du premier article', author: 'Isaac' },
    { id: 2, title: 'Deuxième article', content: 'Contenu du deuxième article', author: 'Sanchez' },
    { id: 3, title: 'Troisième article', content: 'Contenu du troisième article', author: 'Toto' }
];

//Déclaration des routes
app.get('/articles', (request, response) => {
    return response.json({articles : articles});
})

app.get('/article/:id', (request, response) => {
    const id = parseInt(request.body.id);
    const existingArticle = articles.find((article) => article.id === id);
    return response.json(existingArticle);
})

app.post('/save-article',
    body('id').isInt(), 
    (request, response) => {
    // On vérifie s'il n'y a pas d'erreur :
    const errors = validationResult(request)
    if(!errors.isEmpty()){
        response.send({errors: errors.array()});
    }
    
    const articleJSON = request.body;
    let existingArticle = null;

    // On vérifie si l'article n'existe pas déjà :
    if(!articleJSON.id){
        return response.json({error: 'Id manquant, la demande de création / modification ne peut être traitée.'})
    }

    existingArticle = articles.find(article => article.id === articleJSON.id)

    if(existingArticle){
        existingArticle.title = articleJSON.title;
        existingArticle.content = articleJSON.content;
        existingArticle.author = articleJSON.author;
        return response.json({message : `L'article avec l'ID ${articleJSON.id} a été mis à jour avec succès.`})
    }

    articles.push(request.body);
    return response.json({message : `L'article avec l'ID ${articleJSON.id} a été créé avec succès.`})

    // return response.redirect('/articles');
})

app.delete('/article/:id', (request, response) => {
    const id = parseInt(request.params.id);
    const existingArticle = articles.find((article) => article.id === id);
    if(existingArticle){
        articles.splice(articles.indexOf(existingArticle), 1);
        return response.json({message: `Suppression avec succès de l'article ayant pour id ${id}.`})
    }
    return response.json({message: `Pas d'article trouvé pour l'id ${id}.`})

    //return response.redirect('/articles');
    
})

app.listen(3000, () =>{
    console.log('L\'application à bien démarré');
})
    