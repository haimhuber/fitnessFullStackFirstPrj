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
const cookieparser = require('cookie-parser');
const { log } = require('console');
app.use(cookieparser('secret'));

const port = process.env.PORT || 5500;
app.use(cors());


const cookieConfig = {
    maxAge: (2 * 60) * 1000,
    signed: true,// if we use secret with cookieParser
    // for which routes should the browser send the cookie
    // path: '/',
    // SameSite: 'Lax'
};

// Middleware for login tests
app.use('/class', (req, res, next) => {
    if (!req.signedCookies.loginCookie) {
        console.log("You didn't made any action in the last 2 min. Please log again");
        return res.redirect('http://localhost:5500/login.html');
    } else {
        res.cookie('loginCookie', 'singedCoockie', cookieConfig);
        console.log({ "Cookie updated": Date.now() });

    }

    next();
});
app.use('/user-managment', (req, res, next) => {
    if (!req.signedCookies.loginCookie) {
        console.log("You didn't made any action in the last 2 min. Please log again");
        return res.redirect('http://localhost:5500/login.html');
    } else {
        res.cookie('loginCookie', 'singedCoockie', cookieConfig);
        // console.log({ "Cookie updated": Date.now() });
    }

    next();
});

// Login coockie creator
app.get('/create-my-coockie', (req, res) => {
    res.cookie('loginCookie', 'singedCoockie', cookieConfig);
    res.send({ "You created signed cookie": req.signedCookies.loginCookie });
});

// <-------------------------Pages-------------------------------------------->
// login Page
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});
// signin Page
app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

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
        return res.status(500).send("Internal server error");
    } else {
        return res.send(result.data);

    }
});

// Dispalys all plan names
app.get('/plan', async (req, res) => {
    const result = await myRepository.getAllPlansData();
    if (result.status === 500) {
        return res.status(500).send("Internal server error");
    } else {
        return res.send(result.data);

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

});


// <--------------------------------------------------------------------------------------->//
// Adding new user login details
app.post('/signupNewUser', async (req, res) => {

    const { fullName, email, userName, password, phoneNumber, dateOfBirth } = req.body;
    const userData = { fullName, email, userName, password, phoneNumber, dateOfBirth };

    try {
        const result = await myRepository.signUpNewUser(userData); // Connect to DB
        switch (result.status) {
            case 200:
                return res.status(200).send("OK");

            case 404:
                console.log(result.status);
                return res.status(404).send("User cannot be added");

            case 500:
                return res.status(500).send("Internal server error");

        }
    } catch (err) {
        return res.send(err);
        ;
    }
});



// <---------------------------------Put Mtehod------------------------------------------------------>//
app.patch('/update-user/:userId', async (req, res) => {
    const userData = { fullName, email, phonenumber, dateOfBirth } = req.body;
    userData['userId'] = req.params.userId;

    try {
        const result = await myRepository.updateUser(userData); // Connect to DB

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
