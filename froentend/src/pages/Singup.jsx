import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'

export default function Signup() {
  const navigate = useNavigate()

  // State variables
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Handle form submission
  const handleSignup = async (e) => {
    e.preventDefault()

    // Validation
    if (!username || !email || !password || !confirmPassword) {
      setError('Please fill in all fields')
      return
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    // Check password length
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    // Check username length
    if (username.length < 3) {
      setError('Username must be at least 3 characters')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Make API call to backend
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        { username, email, password, role: "user" }
      )

      // Backend returns user data + token
      console.log('Signup response:', response.data)

      // Save JWT token to localStorage
      localStorage.setItem('token', response.data.user.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))

      // Redirect to dashboard
      navigate('/dashboard')

    } catch (err) {
      console.error('Signup error:', err)

      if (err.response?.status === 409) {
        setError('Email or username already exists. Please login instead.')
      } else if (err.response?.status === 400) {
        setError(err.response.data.message || 'Signup failed. Please try again.')
      } else {
        setError('Signup failed. Please try again.')
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
              <p className="text-slate-600 text-lg font-semibold">Create your account</p>
            </div>

            {/* FORM */}
            <form onSubmit={handleSignup} className="space-y-5">
              
              {/* USERNAME INPUT */}
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-3">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="john_doe"
                  className="w-full px-5 py-3 border-2 border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300"
                  required
                />
                <p className="text-xs text-slate-500 mt-2">At least 3 characters</p>
              </div>

              {/* EMAIL INPUT */}
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-3">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
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
                <p className="text-xs text-slate-500 mt-2">At least 6 characters</p>
              </div>

              {/* CONFIRM PASSWORD INPUT */}
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-3">
                  Confirm password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-5 py-3 border-2 border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300"
                  required
                />
              </div>

              {/* SIGNUP BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl font-bold text-lg text-white transition-all duration-300 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">⟳</span> Creating account...
                  </span>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            {/* ERROR MESSAGE */}
            {error && (
              <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                <p className="text-red-700 font-bold text-sm">❌ {error}</p>
              </div>
            )}

            {/* LOGIN LINK */}
            <div className="mt-8 pt-8 border-t-2 border-slate-200 text-center">
              <p className="text-slate-600 font-semibold mb-4">
                Already have an account?
              </p>
              <Link
                to="/login"
                className="text-indigo-600 font-bold text-lg hover:text-indigo-700 transition-colors duration-300"
              >
                Sign in here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}