import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setIsLoggedIn(false)
    setUser(null)
    navigate('/')
  }

  return (
    <nav className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* LEFT SIDE - LOGO */}
          <Link 
            to="/" 
            className="flex items-center gap-2 group"
          >
            <span className="text-3xl font-black text-white">LinkSnap</span>
          </Link>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white text-2xl"
          >
            ☰
          </button>

          {/* CENTER & RIGHT SIDE - NAVIGATION ITEMS (Desktop) */}
          <div className="hidden md:flex items-center gap-8">
            
            {/* HOW TO USE LINK */}
            <a 
              href="/how-to-use"
              className="text-white font-semibold hover:opacity-80 transition-opacity duration-300"
            >
              How to use
            </a>

            {/* IF NOT LOGGED IN - Show Login & Signup */}
            {!isLoggedIn ? (
              <>
                <Link
                  to="/login"
                  className="px-6 py-2 text-white font-bold border-2 border-white rounded-lg hover:bg-white hover:text-indigo-600 transition-all duration-300"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-6 py-2 bg-white text-indigo-600 font-bold rounded-lg hover:shadow-lg transition-all duration-300"
                >
                  Sign up
                </Link>
              </>
            ) : (
              /* IF LOGGED IN - Show Welcome, Dashboard & Logout */
              <>
                <span className="text-white font-semibold">
                  Welcome, <span className="font-bold">{user?.username}</span>
                </span>
                <Link
                  to="/dashboard"
                  className="px-6 py-2 text-white font-bold border-2 border-white rounded-lg hover:bg-white hover:text-indigo-600 transition-all duration-300"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-6 py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition-all duration-300"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>

        {/* MOBILE MENU */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-6 space-y-4 border-t border-white border-opacity-20 pt-4">
            
            {/* Mobile: How to use */}
            <a 
              href="#how-to-use"
              className="block text-white font-semibold hover:opacity-80 transition-opacity duration-300"
            >
              How to use
            </a>

            {/* Mobile: Login & Signup OR Dashboard & Logout */}
            {!isLoggedIn ? (
              <>
                <Link
                  to="/login"
                  className="block w-full px-6 py-3 text-white font-bold border-2 border-white rounded-lg text-center hover:bg-white hover:text-indigo-600 transition-all duration-300"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="block w-full px-6 py-3 bg-white text-indigo-600 font-bold rounded-lg text-center hover:shadow-lg transition-all duration-300"
                >
                  Sign up
                </Link>
              </>
            ) : (
              <>
                <p className="text-white font-semibold text-center">
                  Welcome, <span className="font-bold">{user?.username}</span>
                </p>
                <Link
                  to="/dashboard"
                  className="block w-full px-6 py-3 text-white font-bold border-2 border-white rounded-lg text-center hover:bg-white hover:text-indigo-600 transition-all duration-300"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full px-6 py-3 bg-red-500 text-white font-bold rounded-lg text-center hover:bg-red-600 transition-all duration-300"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}