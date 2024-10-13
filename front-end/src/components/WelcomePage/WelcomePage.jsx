import React from 'react'
import { useNavigate } from 'react-router-dom'
import './WelcomePage.css'

function WelcomePage() {
    const navigate = useNavigate()

    // Check authentication status
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'

    const addEvent = () => {
        if (isAuthenticated) {
            navigate('/add')
        } else {
            navigate('/login')
        }
    }

    const showEvent = () => {
        if (isAuthenticated) {
            navigate('/event')
        } else {
            navigate('/login')
        }
    }

    const handleLogin = () => {
        navigate('/login') // Navigate to the login page
    }

    const handleLogout = () => {
        // Clear authentication status from local storage
        localStorage.removeItem('isAuthenticated')
        // Redirect to login page
        navigate('/')
    }

    return (
        <div className='welcome-container'>
            {isAuthenticated ? (
                <button className='logout-button' onClick={handleLogout}>Log Out</button>
            ) : (
                <button className='login-button' onClick={handleLogin}>Log In</button>
            )}

            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <span style={{ 
                    display: 'block', 
                    fontWeight: 500, 
                    fontSize: '5rem', 
                    background: 'linear-gradient(to bottom right, #000000, #434343)', 
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    color: 'transparent', 
                    letterSpacing: '0.05em', 
                    textShadow: '2px 2px 2px rgba(0, 0, 0, 0.5)'
                }}>
                    EventMate
                </span>
                <span style={{ 
                    display: 'block', 
                    fontWeight: 500, 
                    fontSize: '5rem', 
                    background: 'linear-gradient(to bottom right, #000000, #434343)', 
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    color: 'transparent', 
                    letterSpacing: '0.05em', 
                    marginBottom: '0.5rem',
                    textShadow: '2px 2px 2px rgba(0, 0, 0, 0.5)'
                }}>
                  Plan Events, Enjoy Life
                </span>
            </div>
            <h5 style={{ 
                    color: '#757575', // Replace with your desired secondary text color
                    marginBottom: '0.5rem', // Adjusts the bottom margin
                    fontSize: '2rem', 
                    fontWeight: 450, 
                    marginTop: '-1.5rem',
                    marginBottom: '1.5rem'
                }}>
                Transform your school life to Enjoyment!
            </h5>

            <div className='button-container'>
                <button className='welcome-button' onClick={addEvent}>Add Event</button>
                <button className='welcome-button' onClick={showEvent}>Enroll Event</button>
            </div>
        </div>
    )
}

export default WelcomePage
