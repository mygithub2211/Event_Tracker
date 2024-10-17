const mongoose = require('mongoose');

// Define the User schema
const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    gNumber: { type: String, required: true, unique: true },
    createdEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
    eventsJoined: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
    createdAt: { type: Date, default: Date.now }
});

// Define the Event schema
const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    usersJoined: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    totalSlots: { type: Number, required: true }, // Total initial slots
    slots: { type: Number, required: true, min: 1 },
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Event = mongoose.model('Event', eventSchema);

module.exports = { User, Event };
