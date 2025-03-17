
const express = require('express');
const myRepository = require('./myRepository');
const app = express();
app.use(express.static('public'));
const cors = require("cors");
const port = process.env.PORT || 5500;
app.use(cors());
const path = require('path'); // Helps with file paths
//Home Page
app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

// Dispalys all members names
app.get('/members', async (req, res) => {
    try {
        const pool = await myRepository.members(); // Ensure connection is established
        const result = await pool.request().query('SELECT * FROM Members'); // Fetch all records
        res.json(result.recordset); // Send data as JSON response
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).json({ error: 'Database query error' });
    }
});



app.get('/payments', async (req, res) => {
    const methodPay = req.query.methodPay; // Get method from query parameter

    if (!methodPay) {
        return res.status(400).send({ error: 'methodPay is required query parameters.' });
    }

    try {
        const payments = await myRepository.getPayMethod(methodPay);
        res.json(payments);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send({ error: 'Failed to fetch order counts.' });
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
