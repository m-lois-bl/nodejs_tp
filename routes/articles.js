const express= require('express');
const router = express.Router();
const articleCtrl = require('../controllers/articles')

router.use(express.json());
router.use(express.urlencoded({extended: false}));

const auth = require('../middleware/auth')


// ==================== Déclaration des routes ====================
router.get('/articles', articleCtrl.getAllArticles)

router.get('/article/:id', articleCtrl.getOneArticle)

router.post('/save-article', auth, articleCtrl.saveArticle)

router.delete('/article/:id', auth, articleCtrl.deleteArticle)




module.exports = router;