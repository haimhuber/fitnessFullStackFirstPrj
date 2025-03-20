
// Initials
const express = require('express');
const myRepository = require('./myRepository');
const app = express();
app.use(express.urlencoded({ extended: true }));
const path = require('path'); // Helps with file paths
app.use(express.static(path.join(__dirname, 'public')));
const cors = require("cors");
const { send } = require('process');
const port = process.env.PORT || 5500;
app.use(cors());

// Middleware Test
app.get('/link-to-middlware-test/:id?', (req, res) => {
    if (!req.params.id) {
        req.myError = { reason: 'Please add id to the request', isServer: false };
    } else {
        req.myError = { reason: 'Server down', isServer: true };
    }

    throw Error(); // Sending error to the middleware


});

//Home Page
app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
// <--------------------------------------------------------------------------------------->//
// Dispalys all plan names
app.get('/plan', async (req, res) => {
    const methodPay = req.query.table; // Get method from query parameter
    try {
        const pool = await myRepository.members(); // Ensure connection is established
        const result = await pool.request().query('SELECT * FROM WorkoutPlans'); // Fetch all records
        res.json(result.recordset); // Send data as JSON response
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).json({ error: 'Database query error' });
    }
});

app.get('/contact-page', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'contactUs.html'));
});


app.post('/contact-us', (req, res) => {
    console.log(`all params:  ${JSON.stringify(req.body)}`);
    res.send(`You sent a param named firstname, with value = ${req.body}`);
});


// Middleware handler
app.use(function (err, req, res, next) {
    if (req.myError.isServer) {
        res.status(500).send('Something went wrong!');
    } else {
        res.status(400).send(`${req.myError.reason}`);
    }
})


app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
