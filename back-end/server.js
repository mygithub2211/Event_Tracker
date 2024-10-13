require('dotenv').config();  // Load environment variables from .env file

const mongoose = require('mongoose');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 5000;

const cors = require('cors');
app.use(cors());


// MongoDB connection
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB connected'))
    .catch((error) => console.error('Error connecting to MongoDB:', error));

// Middleware and routes
app.use(express.json());
app.use('/api/events', require('./events'));
app.use('/api/users', require('./users'));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
