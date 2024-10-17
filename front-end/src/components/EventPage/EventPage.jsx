import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EventPage.css';

function EventPage() {
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        name: '',
        location: '',
        date: ''
    });
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const signedInUser = JSON.parse(localStorage.getItem('user'));
    console.log('signedInUser in list of event:', signedInUser);

    // You should also retrieve user data from localStorage if the user is logged in
    const userData = {
        firstName: localStorage.getItem('firstName'),
        lastName: localStorage.getItem('lastName'),
        email: localStorage.getItem('email'),
        gNumber: localStorage.getItem('gNumber')
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [filters, events]);

    // Fetch events from API
    async function fetchEvents() {
        try {
            const response = await axios.get('http://localhost:5000/api/events');
            if (Array.isArray(response.data)) {
                setEvents(response.data);
                setFilteredEvents(response.data);  // Initially, show all events
            } else {
                setError('Unexpected data format');
            }
        } catch (error) {
            console.error('Error fetching events:', error);
            setError('Failed to fetch events');
        } finally {
            setLoading(false);
        }
    }

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: value
        }));
    };

    const applyFilters = () => {
        const filtered = events.filter(event => {
            const matchesName = filters.name ? event.title.toLowerCase().includes(filters.name.toLowerCase()) : true;
            const matchesLocation = filters.location ? event.location.toLowerCase().includes(filters.location.toLowerCase()) : true;
            const matchesDate = filters.date ? new Date(event.date).toLocaleDateString() === new Date(filters.date).toLocaleDateString() : true;

            return matchesName && matchesLocation && matchesDate;
        });

        setFilteredEvents(filtered);
    };

    // Function to handle joining the event
    const handleJoinEvent = async (eventId) => {
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

        // Show the confirmation popup
        const isConfirmed = window.confirm("Are you sure you want to join this event?");
        if (!isConfirmed) {
            console.log('User canceled joining the event.');
            return; // If user cancel joining, do nothing and return
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

    // Function to handle logout
    const handleLogout = () => {
        // Clear user and authentication data from local storage
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('firstName');
        localStorage.removeItem('lastName');
        localStorage.removeItem('email');
        localStorage.removeItem('gNumber');

        // Redirect to login page
        window.location.href = '/login';
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className='admin-page'>
            <header>
                <h1 className='page-title'>Event Tracker</h1>
                {isAuthenticated && (
                    <button className='logout-button' onClick={handleLogout}>Log Out</button>
                )}
            </header>

            {/* Filter Section */}
            <div className='filter-section'>
                <input
                    type="text"
                    name="name"
                    value={filters.name}
                    onChange={handleFilterChange}
                    placeholder="Filter by Name"
                />
                <input
                    type="text"
                    name="location"
                    value={filters.location}
                    onChange={handleFilterChange}
                    placeholder="Filter by Location"
                />
                <input
                    type="date"
                    name="date"
                    value={filters.date}
                    onChange={handleFilterChange}
                    placeholder="Filter by Date"
                />
            </div>

            <div className='grid-container'>
                {filteredEvents.map((event) => (
                    <div className="card" key={event._id}>
                        <h3>{event.title || 'Unnamed Event'}</h3>
                        <p>Date: {new Date(event.date).toLocaleDateString()}</p>
                        <p>Location: {event.location}</p>
                        <p className="slots">
                            Slots: {event.slots} / {event.totalSlots}
                        </p>
                        <div className="progress-bar">
                            <div className="progress-fill"
                                style={{ width: `${(event.slots / event.totalSlots) * 100}%` }}>
                            </div>
                        </div>
                        <p className="description">Description: {event.description}</p>
                        <button
                            className='join-button'
                            onClick={() => handleJoinEvent(event._id)}  // Call handleJoinEvent with event ID
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
