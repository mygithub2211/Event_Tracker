import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import WelcomePage from "./components/WelcomePage/WelcomePage.jsx"
import AddPage from "./components/AddPage/AddPage.jsx"
import EnrollPage from "./components/EnrollPage/EnrollPage.jsx"
import EventPage from "./components/EventPage/EventPage.jsx"
import Login from "./components/User/Login.jsx"
import Register from "./components/User/Register.jsx"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/add" element={<AddPage />} />
        <Route path="/enroll" element={<EnrollPage />} />
        <Route path="/event" element={<EventPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  )
}

export default App
