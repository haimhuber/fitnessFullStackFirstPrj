// Initials
const express = require('express');
const myRepository = require('./myRepository');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(express.json()); // Enable JSON parsing
app.use(express.urlencoded({ extended: true }));
const path = require('path'); // Helps with file paths
app.use(express.static(path.join(__dirname, 'public')));
const cors = require("cors");
const { log } = require('console');

const port = process.env.PORT || 5500;
app.use(cors());
// <-------------------------Pages-------------------------------------------->
//About Page
app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'about.html'));

    // Class Page
});
app.get('/class', async (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'class.html'));

});

// Go to contact - page
app.get('/contact-page', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'contactUs.html'));
});

// Go to User managment - page
app.get('/user-managment', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'userManagment.html'));
});

// Go to Thank you - page
app.get('/thank-you', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'thankYou.html'));
});
// <---------------------------------Get Mtehod------------------------------------------------------>//
// Dispalys all users names
app.get('/users', async (req, res) => {
    const result = await myRepository.getAllUsersData();
    // console.log(result.data);

    if (result.status === 500) {
        res.json({ "Error getting data": false });
    } else {
        res.send(result.data);

    }
});

// Dispalys all plan names
app.get('/plan', async (req, res) => {
    const result = await myRepository.getAllPlansData();
    if (result.status === 500) {
        res.json({ "Error getting data": false });
    } else {
        res.send(result.data);

    }
});

// <---------------------------------Post Mtehod------------------------------------------------------>//
// POST API to Insert Contact Form Data
app.post('/contact', async (req, res) => {
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
                    res.send(result.status);
                    break;
                case 404:
                    res.send(result.status);
                    break;
                case 500:
                    res.send(result.status);
                    break;
            }
        } catch (err) {
            res.status(500).send(`Something went wrong - ${err}`);
        }
    }

});


// <--------------------------------------------------------------------------------------->//
// Join post to add new join request
app.post('/join-us', async (req, res) => {

    const { fullName, email, phoneNumber, dateOfBirth } = req.body;
    const userData = { fullName, email, phoneNumber, dateOfBirth };
    try {
        const result = await myRepository.insertingNewUser(userData); // Connect to DB
        switch (result.status) {
            case 200:
                res.send(result.status);
                break;
            case 404:
                res.send(result.status);
                break;
            case 500:
                res.send(result.status);
                break;
        }
    } catch (err) {
        res.status(500).send(`Something went wrong - ${err}`);
    }
});


// <---------------------------------Put Mtehod------------------------------------------------------>//
app.put('/update-user/:userId', async (req, res) => {
    const userData = { fullName, email, phonenumber, dateOfBirth } = req.body;
    userData['userId'] = req.params.userId;

    try {
        const result = await myRepository.updateUser(userData); // Connect to DB
        switch (result.status) {
            case 200:
                res.send(result.status);
                break;
            case 404:
                res.send(result.status);
                break;
            case 500:
                res.send(result.status);
                break;
            default:
                break;
        }
    } catch (err) {
        res.status(500).send(`Something went wrong - ${err}`);
    }
});


// <---------------------------------Delete Mtehod------------------------------------------------------>//
// Delete Method
app.delete('/deleteUser/:paramId?', async (req, res) => {
    try {
        const result = await myRepository.deletingUser(req.params.paramId); // Connect to DB
        res.send(result);
    } catch (err) {
        res.send({ "Error": 500 });
    }
});

// <---------------------------------Listner------------------------------------------------------>//
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
