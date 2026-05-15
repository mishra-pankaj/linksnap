import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)

  // Check if user is logged in when component loads
  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (token) {
      setIsLoggedIn(true)
      if (userData) {
        setUser(JSON.parse(userData))
      }
    } else {
      setIsLoggedIn(false)
      setUser(null)
    }
  }, [])

  // Handle logout
  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    
    // Update state
    setIsLoggedIn(false)
    setUser(null)
    
    // Redirect to home
    navigate('/')
  }

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* LEFT SIDE - Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-indigo-600">LinkSnap</span>
          </Link>

          {/* RIGHT SIDE - Navigation */}
          <div className="flex items-center gap-4">
            
            {/* "How to use" link - always visible */}
            <a 
              href="#how-to-use"
              className="text-gray-600 hover:text-gray-900 text-sm font-medium"
            >
              How to use
            </a>

            {/* If NOT logged in - show Login & Signup */}
            {!isLoggedIn ? (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-indigo-600 border-2 border-indigo-600 rounded-lg hover:bg-indigo-50 transition"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition"
                >
                  Sign up
                </Link>
              </>
            ) : (
              /* If logged in - show Dashboard & Logout */
              <>
                <span className="text-sm text-gray-600">
                  {user?.username && `Welcome, ${user.username}`}
                </span>
                <Link
                  to="/dashboard"
                  className="px-4 py-2 text-sm font-medium text-indigo-600 border-2 border-indigo-600 rounded-lg hover:bg-indigo-50 transition"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}