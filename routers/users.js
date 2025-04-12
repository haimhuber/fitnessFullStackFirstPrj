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

router.get('/userLoggedIn', userAction.userLoggedIn);

router.get('/plan', userAction.plans);

router.get('/users', userAction.users);

router.get('/contact', userAction.contact);

router.patch('/update-user/:userId', userAction.updateUser);

module.exports = router;