// Initials
const express = require('express');
const myRepository = require('./db/myRepository');
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
const userRouters = require('./routers/users');
const bcrypt = require('bcrypt');
const { hash } = require('crypto');
const { url } = require('inspector');

// <-----Global vars----->
const saltRounds = 10;
cookieConfig = {
    maxAge: Number(process.env.MAX_AGE) || 120000,
    httpOnly: true,
    signed: true// if we use secret with cookieParser
};
const port = process.env.PORT || 5500;
let userNameSignedIn = "";
let userIdSignedIn = 0;
// <--------------------------------------------->
app.use(cors());

app.use('/user', userRouters);

// // Middleware for login tests
// app.use((req, res, next) => {
//     console.log(req.url);

//     // If loginCookie exists, refresh the session (e.g., update the cookie)
//     if (req.signedCookies.isActive) {
//         console.log({ "Cookie updated": Date.now() });
//         res.cookie('isActive', 'secureValue', cookieConfig);
//     }
//     // If no loginCookie and the user is not on the login or create-my-cookie route
//     if (!req.signedCookies.isActive && req.url !== '/login' && req.url !== '/createmycookie' && req.url !== '/signupNewUser') {
//         console.log("You didn't make any action in the last 2 min. Please log again");

//         return res.redirect('/login');
//     }
//     next();  // Continue to the next middleware
// });


//About Page
app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'about.html'));

    // Class Page
});
app.get('/homepage', async (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'homePage.html'));

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

    if (result.status === 500) {
        return res.status(500).send("Internal server error");
    } else {
        return res.json(result.data);

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

app.get('/userLoggedIn', async (req, res) => {
    console.log(userNameSignedIn);

    res.status(200).json({ status: 200, loggnedUserName: userNameSignedIn })
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
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const userData = { email, password };
    try {
        const response = await myRepository.isUserExist(userData); // Connect to DB
        switch (response.status) {
            case 200:
                const enctypedPassword = await bcrypt.compare(userData.password, response.result.password);
                console.log(enctypedPassword);
                if (enctypedPassword) {
                    userIdSignedIn = response.result.id;
                    userNameSignedIn = response.result.userName;
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
});

// <---------------------------------Put Mtehod------------------------------------------------------>//
app.patch('/update-user/:userId', async (req, res) => {
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
    console.log(`Server listening at http://localhost:${port}/user`);
});
