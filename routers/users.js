const express = require('express');
const router = express.Router();

const userAction = require('../controller/usersActions');
const jwtHandler = require('../auth/authMiddleWare');

// login Page
router.get('/login', userAction.getLogin);
// login action
router.post('/login', userAction.login);

// signin Page
router.get('/signup', userAction.getSingup);
// signup action
router.post('/signup', userAction.singup);

router.get('/logout', jwtHandler.eraseTokenFromCookie);

module.exports = router;