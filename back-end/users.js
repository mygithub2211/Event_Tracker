const express = require('express');
const router = express.Router();
const { User } = require('./models');  // Ensure the path to your model is correct
const { Event } = require('./models');  // Assuming Event is used somewhere

// Signup Route
router.post('/signup', async (req, res) => {
    try {
        console.log('Signup request received:', req.body);  // Log request body
        const { firstName, lastName, email, gNumber } = req.body;

        // Check if a user with the given gNumber and email already exists
        let user = await User.findOne({ gNumber, email: email.toLowerCase() });
        if (user) {
            console.log('User already exists');
            return res.status(400).json({ message: 'User with this gNumber and email already exists' });
        }

        // Create a new user
        user = new User({
            firstName,
            lastName,
            email: email.toLowerCase(),  // Normalize the email to lowercase
            gNumber
        });

        await user.save();

        res.status(201).json({ message: 'User created successfully', user });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Sign-In Route
router.post('/signin', async (req, res) => {
    try {
        const { email, gNumber } = req.body;

        // Find the user by email and gNumber
        const user = await User.findOne({ email: email.toLowerCase(), gNumber });

        if (!user) {
            return res.status(404).json({ message: 'Invalid credentials. User not found.' });
        }

        // You can add session handling here, but for now, we're simply returning the user data
        res.status(200).json({ message: 'Sign-in successful', user });
    } catch (error) {
        console.error('Error signing in:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get User's Created Events
router.get('/:gNumber/:email/eventsCreated', async (req, res) => {
    try {
        const { gNumber, email } = req.params;

        const user = await User.findOne({ gNumber, email: email.toLowerCase() }).populate('createdEvents');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ createdEvents: user.createdEvents });
    } catch (error) {
        console.error('Error retrieving user created events:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get User's Joined Events
router.get('/:gNumber/:email/eventsJoined', async (req, res) => {
    try {
        const { gNumber, email } = req.params;

        const user = await User.findOne({ gNumber, email: email.toLowerCase() }).populate('eventsJoined');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ eventsJoined: user.eventsJoined });
    } catch (error) {
        console.error('Error retrieving user joined events:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
