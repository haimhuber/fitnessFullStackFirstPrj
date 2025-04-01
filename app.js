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
app.use(cookieparser());

const port = process.env.PORT || 5500;
app.use(cors());

// Middleware for login tests
app.use('/class', (req, res, next) => {
    if (!req.cookies.userLogIn) {
        console.log("You didn't made any action in the last 2 min. Please log again");
        res.redirect('http://localhost:5500/login.html');
    }

    next();
});
app.use('/user-managment', (req, res, next) => {
    if (!req.cookies.userLogIn) {
        console.log("You didn't made any action in the last 2 min. Please log again");
        res.redirect('http://localhost:5500/login.html');
    }

    next();
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
                    return res.status(404).send("User not found");
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
                console.log(result.status);
                return res.status(500).send("Internal server error");

        }
    } catch (err) {
        return res.send(err);
        ;
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
