
const express = require('express');
const app = express();
require('dotenv').config();
const jwt = require('jsonwebtoken');
const path = require('path'); // Helps with file paths
app.use(express.static(path.join(__dirname, '../public')));

function authenticateToken(req, res, next) {
    let token = req.header('Authorization')?.split(' ')[1] || req.cookies.token;;
    console.log(token);

    if (!token || !req.cookies.token) return res.redirect('/user/login');

    //     --- Dont forget to add JWT_SECRET in .env ---
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        next();
    });
}
module.exports.authenticateToken = authenticateToken;


function refreshToken(req, res, next) {
    let token = req.header('Authorization');
    console.log(req.url);

    if (!token && (req.url !== '/login' && req.url !== '/signup')) {
        return res.redirect('/user/login');
        // Do nothing
    } else if (!token) {
        console.log("token");
        next();
    } else if (token) {
        //     --- Dont forget to add JWT_SECRET in .env ---
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) return res.status(403).json({ message: 'Invalid token' });
            token = jwt.sign({ username: user }, process.env.JWT_SECRET, { expiresIn: '2m' });
            res.cookie("token", token);
            res.setHeader('Authorization', token);
            console.log("token");
            // req.user = user;
            next();
        });
    }

};
module.exports.refreshToken = refreshToken;

function eraseTokenFromCookie(req, res, next) {
    res.clearCookie('token');
    console.log("Cookie deleted");

    return res.redirect('/user/login');
};

module.exports.eraseTokenFromCookie = eraseTokenFromCookie;