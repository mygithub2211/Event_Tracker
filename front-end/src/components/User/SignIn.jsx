import React, { useState } from 'react';
import './SignUp.css'; // Using the same CSS as SignUpPage for consistent styling
import { useNavigate } from 'react-router-dom';

function SignInPage() {
    const [credentials, setCredentials] = useState({
        email: '',
        gNumber: ''
    });
    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prevCredentials => ({
            ...prevCredentials,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/api/users/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(credentials)
            });

            const result = await response.json();

            if (response.ok) {
                setMessage('Login successful!');
                setSuccess(true);
                localStorage.setItem('isAuthenticated', 'true');

                // Store user details in localStorage
                localStorage.setItem('user', JSON.stringify(result.user));

                // Show alert upon successful login
                alert('You have successfully logged in!');

                setTimeout(() => {
                    navigate('/'); // Navigate to the Welcome page
                }, 2000);
            } else {
                setMessage(`Login failed: ${result.message}`);
                setSuccess(false);
            }

            setCredentials({
                email: '',
                gNumber: ''
            });
        } catch (error) {
            console.error('Error processing login:', error);
            setMessage('An error occurred while logging in. Please try again later.');
            setSuccess(false);
        }
    };

    return (
        <div className="signup-page"> {/* Reusing the same layout */}
            <div className="signup-content">
                <header>
                    <h1 className="page-title">Gather Mason</h1>
                </header>
                <div className="signup-form">
                    <h2>Sign In</h2>

                    <form onSubmit={handleSubmit}>
                        <input
                            type="email"
                            name="email"
                            value={credentials.email}
                            onChange={handleInputChange}
                            placeholder="Email"
                            required
                        />
                        <input
                            type="text"
                            name="gNumber"
                            value={credentials.gNumber}
                            onChange={handleInputChange}
                            placeholder="gNumber (8 digits)"
                            required
                        />

                        <button className="submit-button" type="submit">Login</button>
                    </form>

                    {message && <p className={success ? 'success-message' : 'error-message'}>{message}</p>}
                    <div>
                        <p>Don't have an account? <a className="login-link" href="/register">Sign Up</a></p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignInPage;
