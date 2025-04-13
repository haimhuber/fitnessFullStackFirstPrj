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

const port = process.env.PORT || 5500;
// <--------------------------------------------->
app.use(cors());

app.use('/user', userRouters);

app.use('/screen', screenRouters);

// <---------------------------------Listner------------------------------------------------------>//
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}/user/login`);
});
