const express= require('express');
const router = express.Router();
const Article = require('../models/article');
const articleCtrl = require('../controllers/articles')

router.use(express.json());
router.use(express.urlencoded({extended: false}));



// ==================== Déclaration des routes ====================
router.get('/articles', articleCtrl.getAllArticles)

router.get('/article/:id', articleCtrl.getOneArticle)

router.post('/save-article', articleCtrl.saveArticle)

router.delete('/article/:id', articleCtrl.deleteArticle)




module.exports = router;