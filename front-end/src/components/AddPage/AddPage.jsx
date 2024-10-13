import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom' // Import useNavigate
import '../Common.css'

function AddPage() {
    const navigate = useNavigate() // Initialize useNavigate
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'

    const [event, setEvent] = useState({
        name: '',
        date: '',
        time: '',
        place: '',
        slot: '',
        description: ''
    })

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setEvent(prevEvent => ({
            ...prevEvent,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        try {
            const response = await fetch('http://localhost:4000/api/events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(event),
            })
    
            if (!response.ok) {
                throw new Error('Failed to add event')
            }
    
            const data = await response.json()
            console.log(data.message) // Optional: Log success message
    
            // Reset form fields
            setEvent({
                name: '',
                date: '',
                time: '',
                place: '',
                slot: '',
                description: ''
            })
        } catch (error) {
            console.error('Error:', error)
        }
    }

    const handleLogout = () => {
        // Clear authentication status from local storage
        localStorage.removeItem('isAuthenticated')
        // Redirect to login page
        navigate('/') // Use navigate to redirect after logout
    }

    return (
        <div className="container">
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
                        <input type="text" name="name" value={event.name} onChange={handleInputChange} placeholder="Event Name" required />

                        <input type="date" name="date" value={event.date} onChange={handleInputChange} required />
                        
                        <input type="time" name="time" value={event.time} onChange={handleInputChange} required />

                        <input type="text" name="place" value={event.place} onChange={handleInputChange} placeholder="Place" required />

                        <input type="number" name="slot" value={event.slot} onChange={handleInputChange} placeholder="Number of Slots" required />
                        
                        <textarea name="description" value={event.description} onChange={handleInputChange} placeholder="Event Description" required />

                        <button className="submit-button" type="submit">Add Event</button>
                    </form>
                </div>
            </main> 
        </div>
    )
}

export default AddPage
