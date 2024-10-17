import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function EventPage() {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);

    // Get the signed-in user data from localStorage
    const signedInUser = JSON.parse(localStorage.getItem('user'));
    console.log('signedInUser in join event:', signedInUser);

    if (!signedInUser || !signedInUser.email || !signedInUser.gNumber) {
        console.error('Missing user data, cannot join event');
        return;
    }

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/events');
            setEvents(response.data);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    const handleJoinEvent = async (eventId) => {
        //const userData = {
        //    firstName: localStorage.getItem('firstName'),
        //    lastName: localStorage.getItem('lastName'),
        //    email: localStorage.getItem('email'),
        //    gNumber: localStorage.getItem('gNumber')
        //};

        if (!signedInUser || !signedInUser.firstName || !signedInUser.lastName || !signedInUser.email || !signedInUser.gNumber) {
            console.error('Missing user data, cannot join event');
            setError('Missing user data, cannot join event');
            return;
        }

        if (Object.keys(signedInUser).length === 0) {
            console.error('signedInUser is an empty object');
            setError('signedInUser is empty');
            return;
        }

        const enrollData = { firstName: signedInUser.firstName, lastName: signedInUser.lastName, email: signedInUser.email, gNumber: signedInUser.gNumber }
        console.log('Sending request to join event with data:', enrollData, 'for eventId:', eventId);


        try {
            console.log('Event ID for join request:', eventId);

            const response = await fetch(`http://localhost:5000/api/events/join/${eventId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(enrollData)
            });

            const result = await response.json();
            console.log('Server result:', result); // Log result from server

            if (response.ok) {
                console.log('Joined successfully:', result);
                fetchEvents(); // Re-fetch events to update slot count
            } else {
                const errorResponse = await response.json();
                console.error('Error joining event:', result.message);
                setError(`Error: ${errorResponse.message}`);
            }
        } catch (error) {
            console.error('Error joining event:', error);
            setError('Error occurred while joining the event.');
        }
    };

    return (
        <div>
            <h1>Event List</h1>
            <div className='event-list'>
                {events.map(event => (
                    <div key={event._id} className="event-card">
                        <h3>{event.title || 'Unnamed Event'}</h3>
                        <p>Date: {new Date(event.date).toLocaleDateString()}</p>
                        <p>Location: {event.location}</p>
                        <p>Slots: {event.slots}</p>
                        <button
                            className='join-button'
                            onClick={() => handleJoinEvent(event._id)}  // Pass event._id here
                        >
                            Join
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default EventPage;
