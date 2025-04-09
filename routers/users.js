const express = require('express');
const app = express();
const router = express.Router();

const userAction = require('../controller/usersActions');
const jwtHandler = require('../auth/authMiddleWare');

// If tokex exist the middleware refresh it
router.use(jwtHandler.refreshToken);
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