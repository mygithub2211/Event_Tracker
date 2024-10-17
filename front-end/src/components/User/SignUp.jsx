import React, { useState } from 'react';
import './SignUp.css'; // Link to the updated CSS

function SignUpPage() {
    const [user, setUser] = useState({
        firstName: '',
        lastName: '',
        email: '',
        gNumber: ''
    })
    const [message, setMessage] = useState('')
    const [success, setSuccess] = useState(false)

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setUser(prevUser => ({
            ...prevUser,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const response = await fetch('http://localhost:5000/api/users/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            })

            const result = await response.json()

            if (response.ok) {
                setMessage('Registration successful!')
                setSuccess(true)
                alert('You have successfully signed up!'); // Show alert
            } else {
                setMessage(`Registration failed: ${result.message}`)
                setSuccess(false)
            }

            setUser({
                firstName: '',
                lastName: '',
                email: '',
                gNumber: ''
            })
        } catch (error) {
            console.error('Error processing registration:', error)
            setMessage('An error occurred. Please try again later.')
            setSuccess(false)
        }
    }

    return (
        <div className="signup-page">
            <div className="signup-content">
                <header>
                    <h1 className="page-title">Gather Mason</h1>
                </header>
                <div className="signup-form">
                    <h2>Sign Up</h2>

                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="firstName"
                            value={user.firstName}
                            onChange={handleInputChange}
                            placeholder="First Name"
                            required
                        />
                        <input
                            type="text"
                            name="lastName"
                            value={user.lastName}
                            onChange={handleInputChange}
                            placeholder="Last Name"
                            required
                        />
                        <input
                            type="email"
                            name="email"
                            value={user.email}
                            onChange={handleInputChange}
                            placeholder="Email"
                            required
                        />
                        <input
                            type="text"
                            name="gNumber"
                            value={user.gNumber}
                            onChange={handleInputChange}
                            placeholder="gNumber (8 digits)"
                            required
                        />

                        <button className="submit-button" type="submit">Register</button>
                    </form>

                    {message && <p className={success ? 'success-message' : 'error-message'}>{message}</p>}
                    <div>
                        <p>Already have an account? <a className="login-link" href="/login">Login</a></p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignUpPage;
