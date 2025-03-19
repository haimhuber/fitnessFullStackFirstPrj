
// Initials
const express = require('express');
const myRepository = require('./myRepository');
const app = express();
app.use(express.urlencoded({ extended: true }));
const path = require('path'); // Helps with file paths
app.use(express.static(path.join(__dirname, 'public')));
const cors = require("cors");
const port = process.env.PORT || 5500;
app.use(cors());

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

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});



// // Get payments parameters
// app.get('/payments', async (req, res) => {
//     const methodPay = req.query.methodPay; // Get method from query parameter

//     if (!methodPay) {
//         return res.status(400).send({ error: 'methodPay is required query parameters.' });
//     }

//     try {
//         const payments = await myRepository.getPayMethod(methodPay);
//         res.json(payments);
//     } catch (error) {
//         console.error("Error:", error);
//         res.status(500).send({ error: 'Failed to fetch order counts.' });
//     }
// });
