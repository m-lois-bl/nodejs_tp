// ==================== Imports : Début ====================
const express = require('express');
const mongoose = require('mongoose');
const articlesRoutes = require('./routes/articles')
// ==================== Imports : Fin ====================


//Instanciation de l'application serveur
const app = express();
app.use('', articlesRoutes);


// ==================== Configuration de la BDD : Début  ====================
mongoose.connection.once('open', () => {
    console.log("Connecté à la BDD.");
});
mongoose.connection.on('error', () => {
    console.log(`Erreur de bdd : ${err}.`);
})
// Articles
mongoose.connect('mongodb://localhost:27017/db_articles');

// ==================== Configuration de la BDD : Fin  ====================


app.listen(3000, () =>{
    console.log('L\'application à bien démarré');
})

