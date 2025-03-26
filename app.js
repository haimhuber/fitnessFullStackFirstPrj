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

app.get('/hello-world', (req, res) => {
    res.send('Helo');
})

// app.put('/update-user/:userId', (req, res) => {
//     if (!req.params.id) {
//         req.myError = { reason: 'Please add id to the request', isServer: false };
//     } else {
//         req.myError = { reason: 'Server down', isServer: true };
//     }
//     throw Error(); // Sending error to the middleware
// });

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
    const userData = { fullName, email, phonenumber, dateOfBirth } = req.body;
    try {
        const result = await myRepository.getUsersData(userData); // Connect to DB
        switch (result.status) {
            case 200:
                res.json(result);
                break;
            case 404:
                res.json(result);
                break;
            case 500:
                res.json(result);
                break;
            default:
                break;
        }
    } catch (err) {
        res.status(500).send(`Something went wrong - ${err}`);
    }
});


// <--------------------------------------------------------------------------------------->//
// PUT Method
app.put('/update-user/:userId', async (req, res) => {
    const userData = { fullName, email, phonenumber, dateOfBirth } = req.body;
    userData['userId'] = req.params.userId;
    try {
        const result = await myRepository.updateUser(userData); // Connect to DB
        switch (result.status) {
            case 200:
                res.json(result);
                break;
            case 404:
                res.json(result);
                break;
            case 500:
                res.json(result);
                break;
            default:
                break;
        }
    } catch (err) {
        res.status(500).send(`Something went wrong - ${err}`);
    }
});


// <--------------------------------------------------------------------------------------->//
app.put('/example-of-put-method/:paramId', async (req, res) => {
    res.send({ 'Body Params': req.body, 'Param id': req.params.paramId });

});

// <--------------------------------------------------------------------------------------->//
// Delete Method
app.delete('/example-of-delete-method/:paramId', async (req, res) => {
    if (req.body != undefined) {
        res.send({ 'User sent empty body': req.body })
    }
    else {
        res.send({ 'User send the body': req.body });
    }
});

// Middleware handler
app.use(function (err, req, res, next) {
    if (err.isServer) {
        res.status(500).send('Something went wrong! Data cannot updated');
        if (err.isServer) {
            res.status(500).send('Something went wrong! Data cannot updated');
        } else {
            res.status(400).send(`HI${err.isServer}`);
        }
    }
});


app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
