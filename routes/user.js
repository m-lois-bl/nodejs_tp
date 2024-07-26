const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');

router.use(express.json());
router.use(express.urlencoded({extended: false}));

router.post('/sign-up', userCtrl.signUp);
router.post('/login', userCtrl.login);

module.exports = router;