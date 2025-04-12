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
const screenRouters = require('./routers/screens');
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
// <--------------------------------------------->
app.use(cors());

app.use('/user', userRouters);

app.use('/screen', screenRouters);

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
    console.log(`Server listening at http://localhost:${port}/user/login`);
});
