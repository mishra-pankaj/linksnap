import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom' 
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Singup'
import Dashboard from './pages/Dashboard'
import Analytics from './pages/Analytics'

const App = () => {
  return (
    <Router>
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analytics/:shortId" element={<Analytics />} />
      </Routes>

    </Router>
  )
}

export default App