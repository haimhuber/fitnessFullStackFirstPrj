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
// <--------------------------------------------------------------------------------------->//
// Dispalys all users names
app.get('/users', async (req, res) => {
    try {
        const pool = await myRepository.connectionToSqlDB();
        const result = await pool.request().query('SELECT * FROM Members');
        res.json(result.recordset); // Send data as JSON response
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).json({ error: 'Database query error' });
    }
});

// <--------------------------------------------------------------------------------------->//
// Dispalys all plan names
app.get('/plan', async (req, res) => {
    try {
        const pool = await myRepository.connectionToSqlDB(); // Ensure connection is established
        const result = await pool.request().query('SELECT * FROM WorkoutPlans'); // Fetch all records
        res.json(result.recordset); // Send data as JSON response
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).json({ error: 'Database query error' });
    }
});

// POST API to Insert Contact Form Data
app.post('/contact', async (req, res) => {
    const { name, email, subject, message } = req.body; // Get data from request body

    // Validate required fields
    if (!name || !email || !subject || !message) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const pool = await myRepository.connectionToSqlDB(); // Connect to DB

        // Insert query using parameterized inputs (to prevent SQL Injection)
        await pool.request()
            .input('name', name)
            .input('email', email)
            .input('subject', subject)
            .input('message', message)
            .query(`INSERT INTO ${req.body.table} (name, email, subject, message) VALUES (@name, @email, @subject, @message)`);

        res.status(201).json({ message: 'Contact form submitted successfully!' });
    } catch (err) {
        console.error('Error inserting data:', err);
        res.status(500).json({ error: 'Database insert error' });
    }
});


// <--------------------------------------------------------------------------------------->//
// Join get request to check the email
app.get('/join-us', async (req, res) => {
    try {
        const pool = await myRepository.connectionToSqlDB(); // Connect to DB
        // Insert query using parameterized inputs (to prevent SQL Injection)
        const result = await pool.request().query(`SELECT email from Members`)
        res.json(result.recordset); // Send data as JSON response

    } catch (error) {
        console.error('User Email is already existing:', error);
        res.status(500).json({ error: 'Database insert error! User Email is already in use!' });
    }

});

// <--------------------------------------------------------------------------------------->//
// Join post to add new join request
app.post('/join-us', async (req, res) => {
    const { fullName, email, phonenumber, dateOfBirth } = req.body; // Get data from request body
    // Check if mail is exiting! Email must be unique
    try {
        const pool = await myRepository.connectionToSqlDB(); // Connect to DB

        // Insert query using parameterized inputs (to prevent SQL Injection)
        await pool.request()
            .input('fullName', fullName)
            .input('email', email)
            .input('phonenumber', phonenumber)
            .input('dateOfBirth', dateOfBirth)
            .query(`INSERT INTO ${req.body.table} (fullName, email, phonenumber, dateOfBirth) VALUES (@fullName, @email, @phonenumber, @dateOfBirth)`);

        res.status(201).json({ message: 'Member join successfully!' });
    } catch (err) {
        console.error('Error inserting data:', err);
        res.status(500).json({ error: 'Database insert error' });
    }
});


// <--------------------------------------------------------------------------------------->//
// PUT Method
app.put('/update-user/:userId', async (req, res) => {
    try {
        const pool = await myRepository.connectionToSqlDB(); // Connect to DB
        res.send(req.body.fullName);
        // Insert query using parameterized inputs (to prevent SQL Injection)
        await pool.request()
            .input('fullName', req.body.fullName)
            // .input('email', req.body.email)
            // .input('phonenumber', req.body.phonenumber)
            // .input('dateOfBirth', req.body.dateOfBirth)
            .query(`UPDATE ${req.body.table} SET fullName = ${req.body.fullName} WHERE id = ${req.params.userId} `);

        res.status(201).json({ message: 'Member Update successfully!' });
    } catch (err) {
        console.error('Error inserting data:', err);
        res.status(500).json({ error: 'Database insert error' });
    }


})


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
