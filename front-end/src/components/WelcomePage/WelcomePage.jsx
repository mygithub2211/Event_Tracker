import React from 'react';
import { useNavigate } from 'react-router-dom';
import MasonLogo from '../../assets/MasonLogo.png';
import './WelcomePage.css';

function WelcomePage() {
    const navigate = useNavigate();

    // Navigation to Sign In or Sign Up page
    const handleSignIn = () => {
        navigate('/signin');
    };

    const handleSignUp = () => {
        navigate('/signup');
    };

    return (
        <div className='welcome-container'>
            <div className='content-container'>
                <h1 className='app-name'>Gather Mason</h1>
                <p className='app-description'>
                    GatherMason is a platform that connects Mason students through events, activities, and group experiences, fostering stronger campus connections and community engagement.
                </p>

                <div className='button-container'>
                    <button className='welcome-button' onClick={handleSignIn}>Sign In</button>
                    <button className='welcome-button' onClick={handleSignUp}>Sign Up</button>
                </div>
            </div>

            {/* School Logo on the right half */}
            <div className='logo-container'>
                <img className='school-logo' src={MasonLogo} alt='School Logo' />
            </div>

        </div>
    );
}

export default WelcomePage;
