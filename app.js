// ==================== Imports : Début ====================
const express = require('express');
const { body, validationResult } = require('express-validator');
const { v4: uuid } = require('uuid');
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
// ==================== Imports : Fin ====================


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

// ==================== Configuration de la BDD : Début  ====================
mongoose.connection.once('open', () => {
    console.log("Connecté à la BDD.");
});
mongoose.connection.on('error', () => {
    console.log(`Erreur de bdd : ${err}.`);
})
// Articles
mongoose.connect('mongodb://localhost:27017/db_articles');
const Article = mongoose.model('Article', {
    uuid : String,
    title : String,
    content : String,
    author: String
}, 'articles');

// Utilisateurs
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
  });
  
userSchema.plugin(uniqueValidator);
  
module.exports = mongoose.model('User', userSchema);

// ==================== Configuration de la BDD : Fin  ====================


// ==================== Déclaration des routes ====================
app.get('/articles', async (request, response) => {
    const articles = await Article.find();
    return response.status(200).json({
        message: "La liste des articles a été récupérés avec succès",
        articles: articles});
})

app.get('/article/:id', async (request, response) => {
    const uuidParam = request.params.id;

    const existingArticle = await Article.findOne({ uuid: uuidParam });
    if(!existingArticle){
        return response.status(702).json({ message: `Impossible de récupérer un article avec l'UID ${uuidParam}.`})
    }
    return response.status(200).json({
        message: "Article récupéré avec succès",
        article: existingArticle
    });
})

app.post('/save-article',
    async (request, response) => {

    const articleJSON = request.body;
    let articleWithSameTitle = await Article.findOne({ title: articleJSON.title });

    // Si l'article n'existe pas déjà : création
    if(!articleJSON.uuid){
        if(articleWithSameTitle){
            return response.status(701).json({ message: "Impossible d'ajouter un article avec un titre déjà existant", article: undefined})
        }
        articleJSON.uuid = uuid();
        const createdArticle = await Article.create(articleJSON);
        await createdArticle.save();
        return response.status(200).json({
            message: "Article ajouté avec succès", 
            article: createdArticle});
    }
    //Sinon : modification
    let articleToUpdate = await Article.findOne({ uuid: articleJSON.uuid });
    if(!articleToUpdate){
        return response.json({ message: "L'article demandé n'existe pas. Modification impossible."})
    }
    if(articleWithSameTitle &&= articleWithSameTitle.uuid != articleToUpdate.uuid){
        return response.status(701).json({ message: "Impossible de modifier un article si un autre article possède un titre similaire", article: undefined})
    }
    articleToUpdate.title = articleJSON.title;
    articleToUpdate.content = articleJSON.content;
    articleToUpdate.author = articleJSON.author;
    await articleToUpdate.save()
    return response.status(200).json({
        message: "Article modifié avec succès",
        article: articleToUpdate
    });
  
})

app.delete('/article/:id', async (request, response) => {
    const uuidParam = request.params.id;
    const existingArticle = await Article.findOne({ uuid: uuidParam });
    if(existingArticle){
        await Article.deleteOne({ uuid : uuidParam});
        return response.status(200).json({message: `Suppression avec succès de l'article ayant pour id ${uuidParam}.`, article: existingArticle})
    }
    return response.json({message: `Pas d'article trouvé pour l'id ${uuidParam}.`, article: undefined})
    
})

app.listen(3000, () =>{
    console.log('L\'application à bien démarré');
})
    