// Load environment variables from the .env file
require('dotenv').config()

// Import required modules
const express = require('express')
const mongoose = require('mongoose')
const nodemailer = require('nodemailer')
const cors = require('cors')

// Initialize Express app
const app = express()

// Use middleware for parsing JSON and enabling CORS
app.use(express.json())
app.use(cors())

// MongoDB connection
mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err))


/******************* ADD EVENT *******************/
// Define Event Schema
const eventSchema = new mongoose.Schema({
    name: String,
    date: Date,
    time: String,
    place: String,
    slot: Number,
    description: String,
})

const Event = mongoose.model('Event', eventSchema)

// API endpoint to add a new event
app.post('/api/events', async (req, res) => {
    try {
        const newEvent = new Event(req.body)
        await newEvent.save()
        res.status(201).json({ message: 'Event added successfully!' })
    } catch (error) {
        res.status(500).json({ message: 'Error adding event', error })
    }
})
/***************************************************/




/******************* Fetch Events To The Screen *******************/
// API endpoint to get all events
app.get('/api/events', async (req, res) => {
    try {
        const events = await Event.find() // Fetch all events from the database
        res.json(events) // Send events as response
    } catch (error) {
        console.error('Error fetching events:', error)
        res.status(500).json({ message: 'Error fetching events', error })
    }
})
/*******************************************************************/


/******************* ENROLL PAGE JOIN BUTTON *******************/
// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER, // Sender email address
        pass: process.env.EMAIL_PASS  // App-specific password
    }
})

// API route to send a confirmation email
app.post('/send-confirmation-email', (req, res) => {
    const { firstName, email } = req.body

    // Validate incoming request data
    if (!firstName || !email) {
        return res.status(400).send({ success: false, message: 'First name and email are required.' })
    }

    // Email options
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Confirmation of Enrollment',
        text: `Hi ${firstName},\n\nThank you for enrolling in the event!`
    }

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Email sending error:', error)
            return res.status(500).send({ success: false, message: 'Failed to send email', error: error.message })
        }
        return res.status(200).send({ success: true, message: 'Confirmation email sent successfully!' })
    })
})
/**************************************************************/


/******************* LOGIN SIGN-UP *******************/
// User schema and model
const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
  })
  
const User = mongoose.model("User", userSchema)

// Register route
app.post("/register", async (req, res) => {
    const { firstName, lastName, email, password } = req.body
    const newUser = new User({ firstName, lastName, email, password })

    try {
        await newUser.save()
        res.status(201).json({ success: true, message: "User registered successfully" }) // Return success as true
    } catch (err) {
        console.error('Error registering user:', err) // Log error for debugging
        res.status(500).json({ success: false, message: "Failed to register user" }) // Return success as false
    }
})

// Login route
app.post("/login", async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await User.findOne({ email, password })
        if (user) {
        res.json({ success: true })
        } else {
        res.json({ success: false })
        }
    } catch (err) {
        res.status(500).json({ error: "Failed to log in" })
    }
})
/**************************************************************/


// Basic health check route
app.get('/', (req, res) => {
    res.send(`Server is running on port ${PORT}`)
})

// Start server on specified PORT
const PORT = 4000
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
