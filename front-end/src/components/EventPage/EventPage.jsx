import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './EventPage.css' 

function EventPage() {
    const navigate = useNavigate()
    const [events, setEvents] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'

    useEffect(() => {
        fetchEvents()
    }, []) // Empty dependency array to run only once on mount

    async function fetchEvents() {
        try {
            const response = await axios.get('http://localhost:4000/api/events')
            console.log('API Response:', response.data) // Log the response data
            if (Array.isArray(response.data)) {
                setEvents(response.data)
            } else {
                setError('Unexpected data format')
            }
        } catch (error) {
            console.error('Error fetching events:', error)
            setError('Failed to fetch events')
        } finally {
            setLoading(false) // Set loading to false at the end of the try/catch
        }
    }

    const handleLogout = () => {
        // Clear authentication status from local storage
        localStorage.removeItem('isAuthenticated')
        // Redirect to login page
        navigate('/') // Use navigate to redirect after logout
    }

    if (loading) {
        return <div>Loading...</div>
    }

    if (error) {
        return <div>{error}</div>
    }

    return (
        <div className='container'>
            <header>
                <h1 className='page-title'>Event Tracker</h1>
                {isAuthenticated && (
                    <button className='logout-button' onClick={handleLogout}>Log Out</button>
                )}
            </header>

            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Place</th>
                        <th>Slots</th>
                        <th>Description</th>
                        <th>Join</th>
                    </tr>
                </thead>
                <tbody>
                    {events.map((event) => {
                        console.log('Event ID:', event._id) // Log the event ID
                        return (
                            <tr key={event._id}>
                                <td>{event.name}</td>
                                <td>{new Date(event.date).toLocaleDateString()}</td>
                                <td>{event.time}</td>
                                <td>{event.place}</td>
                                <td>{event.slot}</td>
                                <td>{event.description}</td>
                                <td>
                                    <button 
                                        className='join-button'
                                        onClick={() => { navigate(`/enroll`)}}
                                    >
                                        Join
                                    </button>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}

export default EventPage
