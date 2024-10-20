// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();


mongoose.connect('mongodb://127.0.0.1:27017/bookDB')
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.log('MongoDB connection error:', error));

app.use(bodyParser.json());
app.use(cors());

const bookRoutes = require('./routes/book');
app.use('/api/books', bookRoutes);


const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
