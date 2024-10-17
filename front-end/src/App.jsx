import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import WelcomePage from "./components/WelcomePage/WelcomePage.jsx"
import AddPage from "./components/AddPage/AddPage.jsx"
import EnrollPage from "./components/EnrollPage/EnrollPage.jsx"
import EventPage from "./components/EventPage/EventPage.jsx"
import SignIn from "./components/User/SignIn.jsx"
import SignUp from "./components/User/SignUp.jsx"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/add" element={<AddPage />} />
        <Route path="/enroll/:eventId" element={<EnrollPage />} />
        <Route path="/event" element={<EventPage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
  )
}

export default App
