const express = require('express');
const router = express.Router();

const authEmail = require('../controller/sendEmail');

router.get('/mail/:email', authEmail.sendEmail);

module.exports = router;