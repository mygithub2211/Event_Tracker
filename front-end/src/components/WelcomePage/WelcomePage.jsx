import React from 'react';
import { useNavigate } from 'react-router-dom';
import MasonLogo from '../../assets/MasonLogo.png';
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
            <div className='content-container'>
                <h1 className='app-name'>Gather Mason</h1>
                <p className='app-description'>
                    GatherMason is a platform that connects Mason students through events, activities, and group experiences, fostering stronger campus connections and community engagement.
                </p>

                <div className='button-container'>
                    <button className='welcome-button' onClick={addEvent}>Add Event</button>
                    <button className='welcome-button' onClick={showEvent}>Join Event</button>
                </div>
            </div>

            {/* School Logo on the right half */}
            <div className='logo-container'>
                <img className='school-logo' src={MasonLogo} alt='School Logo' />
            </div>

            {/* Conditional Rendering for Log In / Log Out Button */}
            {isAuthenticated && (
                <button className='logout-button' onClick={handleLogout}>Log Out</button>
            )}
        </div>
    );
}

export default WelcomePage;
