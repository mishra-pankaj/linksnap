import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'

export default function Login() {
  const navigate = useNavigate()

  // State variables
  const [usernameOrEmail, setUsernameOrEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Handle form submission
  const handleLogin = async (e) => {
    e.preventDefault()

    // Validation
    if (!usernameOrEmail || !password) {
      setError('Please fill in all fields')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Make API call to backend
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        { 
          username: usernameOrEmail,
          email: usernameOrEmail,
          password 
        }
      )

      // Backend returns user data + token
      console.log('Login response:', response.data)

      // Save JWT token to localStorage
      localStorage.setItem('token', response.data.user.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))

      // Redirect to dashboard
      navigate('/dashboard')

    } catch (err) {
      console.error('Login error:', err)

      if (err.response?.status === 400) {
        setError('Invalid credentials')
      } else if (err.response?.status === 401) {
        setError('Username/email or password is incorrect')
      } else if (err.response?.status === 404) {
        setError('User not found')
      } else {
        setError('Login failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      
      {/* FULL WIDTH HERO BACKGROUND */}
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center px-4 py-12">
        
        {/* CENTERED CARD */}
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-2xl p-10 md:p-12">
            
            {/* HEADER */}
            <div className="text-center mb-10">
              <h1 className="text-4xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
                LinkSnap
              </h1>
              <p className="text-slate-600 text-lg font-semibold">Welcome back</p>
            </div>

            {/* FORM */}
            <form onSubmit={handleLogin} className="space-y-6">
              
              {/* USERNAME/EMAIL INPUT */}
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-3">
                  Username or Email
                </label>
                <input
                  type="text"
                  value={usernameOrEmail}
                  onChange={(e) => setUsernameOrEmail(e.target.value)}
                  placeholder="john_doe or you@example.com"
                  className="w-full px-5 py-3 border-2 border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300"
                  required
                />
              </div>

              {/* PASSWORD INPUT */}
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-3">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-5 py-3 border-2 border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300"
                  required
                />
              </div>

              {/* FORGOT PASSWORD LINK */}
              <div className="text-right">
                <a href="#" className="text-indigo-600 hover:text-indigo-700 font-semibold text-sm transition-colors duration-300">
                  Forgot password?
                </a>
              </div>

              {/* LOGIN BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl font-bold text-lg text-white transition-all duration-300 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">⟳</span> Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* ERROR MESSAGE */}
            {error && (
              <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                <p className="text-red-700 font-bold text-sm">❌ {error}</p>
              </div>
            )}

            {/* SIGNUP LINK */}
            <div className="mt-8 pt-8 border-t-2 border-slate-200 text-center">
              <p className="text-slate-600 font-semibold mb-4">
                Don't have an account?
              </p>
              <Link
                to="/signup"
                className="text-indigo-600 font-bold text-lg hover:text-indigo-700 transition-colors duration-300"
              >
                Sign up here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}