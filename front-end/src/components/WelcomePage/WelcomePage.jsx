import React from 'react';
import { useNavigate } from 'react-router-dom';
import './WelcomePage.css';

function WelcomePage() {
    const navigate = useNavigate();

    // Check authentication status
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

    const addEvent = () => {
        if (isAuthenticated) {
            navigate('/add');
        } else {
            navigate('/login');
        }
    };

    const showEvent = () => {
        if (isAuthenticated) {
            navigate('/event');
        } else {
            navigate('/login');
        }
    };

    const handleLogin = () => {
        navigate('/login'); // Navigate to the login page
    };

    const handleLogout = () => {
        // Clear authentication status from local storage
        localStorage.removeItem('isAuthenticated');
        // Redirect to login page
        navigate('/');
    };

    return (
        <div className='welcome-container'>
            <h1 className='welcome-text'>Welcome</h1>

            {/* Conditional Rendering for Log In / Log Out Button */}
            {isAuthenticated ? (
                <button className='logout-button' onClick={handleLogout}>Log Out</button>
            ) : (
                <button className='login-button' onClick={handleLogin}>Log In</button>
            )}

            <div className='button-container'>
                <button className='welcome-button' onClick={addEvent}>Add Event</button>
                <button className='welcome-button' onClick={showEvent}>Enroll Event</button>
            </div>
        </div>
    );
}

export default WelcomePage;
