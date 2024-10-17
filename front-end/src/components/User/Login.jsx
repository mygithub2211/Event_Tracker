import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function LoginPage() {
    const [credentials, setCredentials] = useState({
        email: '',
        gNumber: ''
    })
    const [message, setMessage] = useState('')
    const navigate = useNavigate()

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setCredentials(prevCredentials => ({
            ...prevCredentials,
            [name]: value
        }))
    }

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
                setMessage('Login successful! Redirecting...');
                localStorage.setItem('isAuthenticated', 'true');

                // Store user details in localStorage
                localStorage.setItem('user', JSON.stringify(result.user));
                const signedInUser = JSON.parse(localStorage.getItem('user'));
                console.log(signedInUser);
                console.log('Signed in user:', signedInUser);


                setTimeout(() => {
                    navigate('/'); // Navigate to the Welcome page
                }, 2000);
            } else {
                setMessage(`Login failed: ${result.message}`);
            }

            setCredentials({
                email: '',
                gNumber: ''
            });
        } catch (error) {
            console.error('Error processing login:', error);
            setMessage('An error occurred while logging in. Please try again later.');
        }
    };

    return (
        <div className="admin-page">
            <header>
                <h1 className="page-title">Event Tracker</h1>
            </header>

            <main>
                <div className="event-form">
                    <h2>Login</h2>

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
                            name="gNumber"  // Changed input field to gNumber
                            value={credentials.gNumber}
                            onChange={handleInputChange}
                            placeholder="gNumber (8 digits)"
                            required
                        />

                        <button className="submit-button" type="submit">Login</button>
                    </form>

                    {message && <p>{message}</p>}
                    <div>
                        <p>Don't have an account? <a className="register-link" href="/register">Register</a></p>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default LoginPage
