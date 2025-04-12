const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const cookieparser = require('cookie-parser');
const saltRounds = 10;
app.use(cookieparser());
require('dotenv').config();
const path = require('path'); // Helps with file paths
app.use(express.static(path.join(__dirname, '../public')));
const myRepository = require('../db/myRepository');
const bcrypt = require('bcrypt');
const { log } = require('console');
let userNameSignedIn = "";
let userIdSignedIn = 0;



// <------------------------------------------------------------------------------------------------------>
const getSingup = async (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'signup.html'));
};
module.exports.getSingup = getSingup;
// <------------------------------------------------------------------------------------------------------>
const singup = async (req, res) => {
    const { fullName, email, userName, password, phoneNumber, dateOfBirth } = req.body;
    const userData = { fullName, email, userName, password, phoneNumber, dateOfBirth };

    try {
        const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
        userData.password = hashedPassword;
        const result = await myRepository.insertingNewUser(userData); // Connect to DB
        // console.log(result.message);
        const splited = result.message.split(" ");
        const finalsplit = splited[splited.length - 1].replace(/[().]/g, '');
        switch (result.status) {
            case 200:
                console.log(result);
                return res.status(200).json({ status: 200, message: "OK" });

            case 400:
                console.log(result.status);
                return res.status(400).json({ status: 400, message: "User cannot be added", errorValue: finalsplit });

            case 500:
                return res.status(500).json({ status: 500, message: "Internal server error" });
        }
    } catch (err) {
        return res.send(err);
    }
};
module.exports.singup = singup;
// <------------------------------------------------------------------------------------------------------>
const getLogin = async (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'login.html'));
};
module.exports.getLogin = getLogin;
// <------------------------------------------------------------------------------------------------------>

// When user send login data(email, password) to the server
const login = async (req, res) => {
    const { email, password } = req.body;
    const userData = { email, password };
    try {
        const response = await myRepository.isUserExist(userData); // Connect to DB
        console.log(response);
        switch (response.status) {
            case 200:
                const enctypedPassword = await bcrypt.compare(userData.password, response.result.password);
                if (enctypedPassword) {
                    const token = jwt.sign({ username: response.result.userName }, process.env.JWT_SECRET, { expiresIn: '2m' });
                    const header = res.setHeader('Authorization', `Bearer ${token}`);
                    res.cookie("token", token);
                    console.log(token);
                    userNameSignedIn = response.result.userName;
                    userIdSignedIn = response.result.id;
                    return res.status(200).json({ status: 200, response: true, userId: response.result.id, userName: response.result.userName });
                }
                return res.status(200).json({ status: 200, result: false });
            case 404:
                return res.status(404).json({ status: 404, error: "User not found" });

            case 500:
                return res.status(500).json({ status: 500, error: "Internal server error" });

            default:
                return res.status(400).json({ status: 400, error: "Unexpected response from server" });
        }
    } catch (err) {
        return res.send(err);
    }
};
module.exports.login = login;

// <------------------------------------------------------------------------------------------------------>
const userLoggedIn = async (req, res) => {
    res.status(200).json({ status: 200, loggnedUserName: userNameSignedIn })
};
module.exports.userLoggedIn = userLoggedIn;
// <------------------------------------------------------------------------------------------------------>

const plans = async (req, res) => {
    const result = await myRepository.getAllPlansData();
    if (result.status === 500) {
        return res.status(500).send("Internal server error");
    } else {
        console.log(result.data);

        return res.send(result.data);

    }
};
module.exports.plans = plans;
// <------------------------------------------------------------------------------------------------------>

const users = async (req, res) => {
    const result = await myRepository.getAllUsersData();

    if (result.status === 500) {
        return res.status(500).send("Internal server error");
    } else {
        return res.json(result.data);

    }
};
module.exports.users = users;
// <------------------------------------------------------------------------------------------------------>

const contact = async (req, res) => {
    const { name, email, subject, message } = req.body; // Get data from request body
    const userData = { name, email, subject, message };
    console.log(userData);

    // Validate required fields
    if (!name || !email || !subject || !message) {
        return res.status(400).json({ error: 'All fields are required' });
    } else {
        try {
            const result = await myRepository.formContact(userData); // Connect to DB
            switch (result.status) {
                case 200:
                    return res.status(200).send("OK");
                case 404:
                    return res.status(404).send("Bad request");
                case 500:
                    return res.status(500).send("Internal server error");
            }
        } catch (err) {
            res.status(500).send(`Something went wrong - ${err}`);
        }
    }
};
module.exports.contact = contact;
// <------------------------------------------------------------------------------------------------------>

const updateUser = async (req, res) => {
    const userData = { fullName, email, phonenumber, dateOfBirth } = req.body;
    userData['userId'] = req.params.userId;

    try {
        const result = await myRepository.updateUser(userData); // Connect to DB
        console.log(result.status);

        switch (result.status) {
            case 200:
                res.status(200).send("OK");
                break;
            case 404:
                res.status(404).send("Bad request");
                break;
            case 500:
                res.status(500).send("Something went wrong");
                break;
            default:
                log('default');
        }
    } catch (err) {
        res.status(500).send(`Something went wrong - ${err}`);
    }
};
module.exports.updateUser = updateUser;
// <------------------------------------------------------------------------------------------------------>
