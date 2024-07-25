const Article = require('../models/article');
const { v4: uuid } = require('uuid');

exports.getAllArticles = async (request, response) => {
    const articles = await Article.find();
    return response.status(200).json({
        code: "200",
        message: "La liste des articles a été récupérés avec succès",
        data: articles});
};

exports.getOneArticle = async (request, response) => {
    const uuidParam = request.params.id;

    const existingArticle = await Article.findOne({ uuid: uuidParam });
    if(!existingArticle){
        return response.status(404).json({ code: "701", message: `Impossible de récupérer un article avec l'UID ${uuidParam}.`})
    }
    return response.status(200).json({
        code: "200",
        message: "Article récupéré avec succès",
        data: existingArticle
    });
}

exports.saveArticle = async (request, response) => {
    const articleJSON = request.body;
    let articleWithSameTitle = await Article.findOne({ title: articleJSON.title });

    // Si l'article n'existe pas déjà : création
    if(!articleJSON.uuid){
        if(articleWithSameTitle){
            return response.status(400).json({ code: "701", message: "Impossible d'ajouter un article avec un titre déjà existant", data: undefined})
        }
        articleJSON.uuid = uuid();
        const createdArticle = await Article.create(articleJSON);
        await createdArticle.save();
        return response.status(200).json(createJsonResponse("200", "Article ajouté avec succès", createdArticle));
        // return response.status(200).json({
        //     code: "200",
        //     message: "Article ajouté avec succès", 
        //     article: createdArticle});
    }
    //Sinon : modification
    let articleToUpdate = await Article.findOne({ uuid: articleJSON.uuid });
    if(!articleToUpdate){
        return response.status(400).json({ code:"701", message: "L'article demandé n'existe pas. Modification impossible."})
    }
    if(articleWithSameTitle &&= articleWithSameTitle.uuid != articleToUpdate.uuid){
        return response.status(400).json({ code:"701", message: "Impossible de modifier un article si un autre article possède un titre similaire", data: undefined})
    }
    articleToUpdate.title = articleJSON.title;
    articleToUpdate.content = articleJSON.content;
    articleToUpdate.author = articleJSON.author;
    await articleToUpdate.save()
    return response.status(200).json({
        code:"200",
        message: "Article modifié avec succès",
        article: articleToUpdate
    });

}

exports.deleteArticle = async (request, response) => {
    const uuidParam = request.params.id;
    const existingArticle = await Article.findOne({ uuid: uuidParam });
    if(existingArticle){
        await Article.deleteOne({ uuid : uuidParam});
        return response.status(200).json({code:"200",message: `Suppression avec succès de l'article ayant pour id ${uuidParam}.`, data: existingArticle})
    }
    return response.status(400).json({code:"701", message: `Pas d'article trouvé pour l'id ${uuidParam}.`, data: undefined})
}

function createJsonResponse(code, message, data){
    return {
        code: code,
        message: message,
        date: data
    };
}
