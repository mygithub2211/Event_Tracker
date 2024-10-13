import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom' // Import useNavigate

function EnrollPage() { // Accept eventId as a prop to identify the event
    const navigate = useNavigate() // Initialize useNavigate
    const [message, setMessage] = useState('')
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
   
    const [student, setStudent] = useState({
        firstName: '',
        lastName: '',
        gNumber: '',
        email: ''
    })
    
    const handleInputChange = (e) => {
        const { name, value } = e.target
        setStudent(prevStudent => ({
            ...prevStudent,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            // Send confirmation email
            const emailResponse = await fetch('http://localhost:4000/send-confirmation-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(student)
            })

            const emailResult = await emailResponse.json()

            if (emailResult.success) {
                setMessage('Confirmation email sent successfully!')
            } else {
                setMessage(`Failed to send confirmation email: ${emailResult.message}`)
            }

            // Reset form fields
            setStudent({
                firstName: '',
                lastName: '',
                gNumber: '',
                email: '',
            })
        } catch (error) {
            console.error('Error processing enrollment:', error)
            setMessage('Error occurred while enrolling. Please try again later.')
        }
    }

    const handleLogout = () => {
        // Clear authentication status from local storage
        localStorage.removeItem('isAuthenticated')
        // Redirect to login page
        navigate('/') // Use navigate to redirect after logout
    }

    return (
        <div className='container'>
            <header>
                <h1 className='page-title'>Event Tracker</h1>
                {isAuthenticated && (
                    <button className='logout-button' onClick={handleLogout}>Log Out</button>
                )}
            </header>

            <main>
                <div className='event-form'>
                    <h2>Enroll</h2>

                    <form onSubmit={handleSubmit}>
                        <input type='text' name='firstName' value={student.firstName} onChange={handleInputChange} placeholder='First Name' required />

                        <input type='text' name='lastName' value={student.lastName} onChange={handleInputChange} placeholder='Last Name' required />

                        <input type='text' name='gNumber' value={student.gNumber} onChange={handleInputChange} placeholder='G# (e.g. G12345678)' required />
                        
                        <input type='email' name='email' value={student.email} onChange={handleInputChange} placeholder='Email' required />

                        <button className='submit-button' type='submit'>Join</button>
                    </form>
                    {message && <p>{message}</p>}
                </div>
            </main> 
        </div>
    )
}

export default EnrollPage
