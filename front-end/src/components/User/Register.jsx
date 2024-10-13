import React, { useState } from 'react'

function RegisterPage() {
    const [user, setUser] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    })
    const [message, setMessage] = useState('')
    const [success, setSuccess] = useState(false) // New state to track success

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
            // Register the user
            const response = await fetch('http://localhost:4000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            })

            const result = await response.json()

            if (result.success) {
                setMessage('Registration successful!')
                setSuccess(true) // Set success state to true
            } else {
                setMessage(`Registration failed: ${result.message}`)
                setSuccess(false) // Set success state to false
            }

            // Reset form fields
            setUser({
                firstName: '',
                lastName: '',
                email: '',
                password: '',
            })
        } catch (error) {
            console.error('Error processing registration:', error)
            setMessage('An error occurred while registering. Please try again later.')
            setSuccess(false) // Set success state to false
        }
    }

    return (
        <div className='container'>
            <header>
                <h1 className='page-title'>Event Tracker</h1>
            </header>

            <main>
                <div className='event-form'>
                    <h2>Register</h2>

                    <form onSubmit={handleSubmit}>
                        <input
                            type='text'
                            name='firstName'
                            value={user.firstName}
                            onChange={handleInputChange}
                            placeholder='First Name'
                            required
                        />

                        <input
                            type='text'
                            name='lastName'
                            value={user.lastName}
                            onChange={handleInputChange}
                            placeholder='Last Name'
                            required
                        />

                        <input
                            type='email'
                            name='email'
                            value={user.email}
                            onChange={handleInputChange}
                            placeholder='Email'
                            required
                        />

                        <input
                            type='password'
                            name='password'
                            value={user.password}
                            onChange={handleInputChange}
                            placeholder='Password'
                            required
                        />

                        <button className='submit-button' type='submit'>Register</button>
                    </form>

                    {message && <p className={success ? 'success-message' : 'error-message'}>{message}</p>}
                    <div>
                        <p>Have an account? <a className='login-link' href='/login'>Login</a></p>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default RegisterPage
