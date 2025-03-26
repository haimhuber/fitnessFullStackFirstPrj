// Initials
const express = require('express');
//const myRepository = require('./myRepository');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(express.json()); // Enable JSON parsing
app.use(express.urlencoded({ extended: true }));
const path = require('path'); // Helps with file paths
app.use(express.static(path.join(__dirname, 'public')));
const cookieparser = require('cookie-parser');
const { log } = require('console');
app.use(cookieparser('mysecret'));
//const cors = require("cors");
//app.use(cors());

const port = process.env.PORT || 5500;


// app.use((req, res, next) => {
//     // Check if client has made a request(get/post/put/delete)
//     if (req.cookies.isActive) {
//         //Cookie not created
//         console.log("Uesr still active", Date.now());
//         res.send("You didn't made any action in the last 2 minutes");
//     }
//     else {
//         res.cookie('isActive', Date.now());
//         res.json({ "User logged in": "hi there" });
//     }
//     next();
// });

// // app.get('/login', (req, res) => {
// //     res.cookie('isActive', Date.now());
// //     console.log("User logged in", req.cookies.hasBeenHere);
// //     res.json({ "User logged in": req.cookies.hasBeenHere });
// // })


// app.get('/hello', (req, res) => {
//     if (req.cookies.isActive) {
//         console.log("Yes, There is a cookie named isActive", true);
//         // res.json({ "Yes, There is a cookie named isActive": true });
//     } else {
//         console.log("No, There is a cookie named isActive");
//         //res.json({ "No, There is a cookie named isActive": false });
//     }
// });


// app.get('/temp', (req, res) => {
//     const cookieConfig = {
//         maxAge: (10) * 1000
//     };
//     console.log("You just created cookie");
//     res.cookie('limitedCoockie', 'created', cookieConfig);
//     res.send({ "You just created cookie": true });
// });



// app.get('/hello', (req, res) => {
//     if (req.cookies.limitedCoockie) {
//         console.log("You still got time");
//         res.send({ 'Coockie is still valid': true });
//     } else {
//         console.log("Plese make another cookie");
//         res.json({ 'Coockie is not valid': false });
//     }
// });

// <----------------------------------------------------->

// app.use('/special', (req, res, next) => {
//     const cookieConfig = {
//         path: '/p1'
//     };
//     res.cookie('coockieLimitedToRoute_p1', 'created', cookieConfig);
//     res.json({ "I just created cookie for you": true });
// });

// app.get('/p1', (req, res) => {
//     res.json({ "Cookie created to route p1": true });
// });

// app.get('/p2', (req, res) => {
//     res.json({ "Cookie not created to route p2": false });
// });

// <----------------------------------------------------->
// 5 - 6)
app.get('/getSecretCookie', (req, res) => {
    const cookieConfig = {
        signed: true // send only over https 
    };
    res.cookie('secretCookie', 'secret', cookieConfig);
    res.json({ "You just made a request for cookie": true });
});

app.get('/sendSecretCookie', (req, res) => {
    if (req.signedCookies.secretCookie) {
        res.json({ 'Your secret cookie': req.signedCookies.secretCookie });
    } else {
        res.json({ 'Cookie response': "Did you mess with my cookie?" });
    }
});





app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});

