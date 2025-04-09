const express = require('express');
const app = express();
const path = require('path'); // Helps with file paths
app.use(express.static(path.join(__dirname, '../public')));


const homeScreen = async (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'homePage.html'));
};
module.exports.homeScreen = homeScreen;
// <------------------------------------------------------------------------------------------------------>
const aboutScreen = async (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'about.html'));
};
module.exports.aboutScreen = aboutScreen;
// <------------------------------------------------------------------------------------------------------>
// <------------------------------------------------------------------------------------------------------>
const classScreen = async (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'class.html'));
};
module.exports.classScreen = classScreen;
// <------------------------------------------------------------------------------------------------------>
const contactScreen = async (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'contactUs.html'));
};
module.exports.contactScreen = contactScreen;
// <------------------------------------------------------------------------------------------------------>
const userManagmenttScreen = async (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'userManagment.html'));
};
module.exports.userManagmenttScreen = userManagmenttScreen;
// <------------------------------------------------------------------------------------------------------>
const thankyouScreen = async (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'thankYou.html'));
};
module.exports.thankyouScreen = thankyouScreen;
// <------------------------------------------------------------------------------------------------------>
