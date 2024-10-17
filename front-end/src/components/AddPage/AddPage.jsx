import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Common.css';

function AddPage() {
    const navigate = useNavigate();
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

    // Get the signed-in user data from localStorage
    const signedInUser = JSON.parse(localStorage.getItem('user'));
    console.log("Singed in user in Add event:", signedInUser);

    const [event, setEvent] = useState({
        title: '',
        date: '',
        time: '',
        location: '',
        slots: '',
        description: ''
    });

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login'); // Redirect to login if not authenticated
        }
    }, [isAuthenticated, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEvent(prevEvent => ({
            ...prevEvent,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation: Ensure slots > 0
        if (event.slots <= 0) {
            alert("Number of slots must be greater than 0.");
            return;
        }

        // Validation: Ensure the date is after today
        const today = new Date().setHours(0, 0, 0, 0); // Get today's date
        const eventDate = new Date(event.date).setHours(0, 0, 0, 0); // Get the event date

        if (eventDate <= today) {
            alert("The event date must be in the future.");
            return;
        }

        try {
            const eventInfo = { title: event.title, description: event.description, date: event.date, location: event.location, slots: event.slots, firstName: signedInUser.firstName, lastName: signedInUser.lastName, email: signedInUser.email, gNumber: signedInUser.gNumber };
            const response = await fetch('http://localhost:5000/api/events/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(eventInfo),
            });

            if (!response.ok) {
                throw new Error('Failed to add event');
            }

            const data = await response.json();
            console.log(data.message); // Log the success message or handle it as needed

            // Reset form fields
            setEvent({
                title: '',
                date: '',
                time: '',
                location: '',
                slots: '',
                description: ''
            });

        } catch (error) {
            console.error('Error:', error);
        }
    };


    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('user');  // Remove user data on logout
        navigate('/');
    };

    return (
        <div className="admin-page">
            <header>
                <h1 className='page-title'>Event Tracker</h1>
                {isAuthenticated && (
                    <button className='logout-button' onClick={handleLogout}>Log Out</button>
                )}
            </header>

            <main>
                <div className="event-form">
                    <h2>Add New Event</h2>

                    <form onSubmit={handleSubmit}>
                        <input type="text" name="title" value={event.title} onChange={handleInputChange} placeholder="Event Title" required />

                        <input type="date" name="date" value={event.date} onChange={handleInputChange} required />

                        <input type="time" name="time" value={event.time} onChange={handleInputChange} required />

                        <input type="text" name="location" value={event.location} onChange={handleInputChange} placeholder="Location" required />

                        <input type="number" name="slots" value={event.slots} onChange={handleInputChange} placeholder="Number of Slots" required min="1" />

                        <textarea name="description" value={event.description} onChange={handleInputChange} placeholder="Event Description" required />

                        <button className="submit-button" type="submit">Add Event</button>
                    </form>
                </div>
            </main>
        </div>
    );
}

export default AddPage;
