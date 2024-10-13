const express = require('express');
const router = express.Router();
const { Event } = require('./models');
const { User } = require('./models');  // Adjust the path to the actual location of your User model

// Create a new event
router.post('/create', async (req, res) => {
    try {
        const { title, description, date, location, slots, firstName, lastName, email, gNumber } = req.body;

        let creator = await User.findOne({ gNumber });

        if (!creator) {
            creator = new User({
                firstName,
                lastName,
                email: email.toLowerCase(),  // Ensure the email is in lowercase
                gNumber
            });
            await creator.save();
        }

        const newEvent = new Event({
            title,
            description,
            date,
            location,
            creator: creator._id,  // Assign the newly created or found user as the creator
            usersJoined: [],
            slots
        });

        const savedEvent = await newEvent.save();

        creator.createdEvents.push(savedEvent._id);
        await creator.save();  // Save the updated user with the event they created

        res.status(201).json(savedEvent);
    } catch (error) {
        console.error('Error creating event:', error);  // Log the error to inspect what went wrong
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get all events
router.get('/', async (req, res) => {
    try {
        const events = await Event.find();
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Get event by ID
router.get('/id/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.status(200).json(event);
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid event ID format' });
        }
        res.status(500).json({ message: 'Server error', error });
    }
});

// Get event by title
router.get('/title/:title', async (req, res) => {
    try {
        const regex = new RegExp(`\\b${req.params.title}\\b`, 'i');  // Use word boundary \b to match the whole words
        const events = await Event.find({ title: { $regex: regex } });
        if (!events.length) {
            return res.status(404).json({ message: 'No events found with the specified title' });
        }
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Get event by date
router.get('/date/:date', async (req, res) => {
    try {
        const events = await Event.find({ date: new Date(req.params.date) });
        if (!events.length) {
            return res.status(404).json({ message: 'No events found on the specified date' });
        }
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Get event by location
router.get('/location/:location', async (req, res) => {
    try {
        const regex = new RegExp(`\\b${req.params.location}\\b`, 'i');
        const events = await Event.find({ location: { $regex: regex } });
        if (!events.length) {
            return res.status(404).json({ message: 'No events found at the specified location' });
        }
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Update event by ID
router.put('/id/:id', async (req, res) => {
    try {
        const updatedEvent = await Event.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        );

        if (!updatedEvent) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.status(200).json(updatedEvent);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Update event by title
router.put('/title/:title', async (req, res) => {
    try {
        const updatedEvent = await Event.findOneAndUpdate(
            { title: req.params.title },
            { $set: req.body },
            { new: true, runValidators: true }
        );

        if (!updatedEvent) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.status(200).json(updatedEvent);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Delete event by ID
router.delete('/id/:id', async (req, res) => {
    try {
        const deletedEvent = await Event.findByIdAndDelete(req.params.id);
        if (!deletedEvent) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Delete event by title
router.delete('/title/:title', async (req, res) => {
    try {
        const deletedEvent = await Event.findOneAndDelete({ title: req.params.title });
        if (!deletedEvent) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Join an event
router.post('/join/:id', async (req, res) => {
    try {
        const { firstName, lastName, email, gNumber } = req.body;
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        if (event.slots <= 0) {
            return res.status(400).json({ message: 'No slots available for this event' });
        }

        let user = await User.findOne({ gNumber, email: email.toLowerCase() });

        if (!user) {
            user = new User({ firstName, lastName, email: email.toLowerCase(), gNumber });
            await user.save();
        }

        const hasUserJoined = event.usersJoined.some(joinedUser => joinedUser.equals(user._id));

        if (hasUserJoined) {
            return res.status(400).json({ message: 'User has already joined this event' });
        }

        event.usersJoined.push(user._id);
        event.slots -= 1;

        await event.save();
        user.eventsJoined.push(event._id);
        await user.save();

        res.status(200).json({ message: 'Successfully joined the event', event });
    } catch (error) {
        console.error('Error joining event:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Leave an event
router.post('/leave/:id', async (req, res) => {
    try {
        const { email, gNumber } = req.body;
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        const user = await User.findOne({ gNumber, email: email.toLowerCase() });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const hasUserJoined = event.usersJoined.some(joinedUser => joinedUser.equals(user._id));

        if (!hasUserJoined) {
            return res.status(400).json({ message: 'User has not joined this event' });
        }

        event.usersJoined = event.usersJoined.filter(joinedUser => !joinedUser.equals(user._id));
        event.slots += 1;

        await event.save();
        user.eventsJoined = user.eventsJoined.filter(joinedEvent => !joinedEvent.equals(event._id));
        await user.save();

        res.status(200).json({ message: 'Successfully left the event', event });
    } catch (error) {
        console.error('Error leaving event:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
