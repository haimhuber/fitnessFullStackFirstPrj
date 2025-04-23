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
const emailRouters = require('./routers/mail');
const bcrypt = require('bcrypt');
app.use(express.static(path.join(__dirname, '../public')));

const port = process.env.PORT || 5500;
// <--------------------------------------------->
app.use(cors());

app.use('/user', userRouters);

app.use('/screen', screenRouters);

app.use('/verification', emailRouters);

// <---------------------------------Listner------------------------------------------------------>//
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
