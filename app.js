
const express = require('express');
const myRepository = require('./myRepository');
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5500;
app.use(cors());
app.get('/payments', async (req, res) => {
    const methodPay = req.query.methodPay; // Get startDate from query parameter

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
