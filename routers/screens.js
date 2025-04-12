const express = require('express');
const router = express.Router();
const screenAction = require('../controller/screenActions');
const jwtHandler = require('../auth/authMiddleWare');

// If tokex exist the middleware refresh it
router.use(jwtHandler.authenticateToken);
// login Page
router.get('/login', screenAction.aboutScreen);
// about Page
router.get('/about', screenAction.aboutScreen);
// homepage page
router.get('/homePage', screenAction.homeScreen);
// class page
router.get('/class', screenAction.classScreen);
// contact page
router.get('/contact-page', screenAction.contactScreen);
// user managment page
router.get('/user-managment', screenAction.userManagmenttScreen);
// user managment page
router.get('/thankyou', screenAction.userManagmenttScreen);




module.exports = router;