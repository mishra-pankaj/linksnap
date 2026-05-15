import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'

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
      // Send either username or email - backend will handle both
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        { 
          username: usernameOrEmail,  // Can be username
          email: usernameOrEmail,     // Or email - backend will check both
          password 
        }
      )

      // Backend returns user data + token
      console.log('Login response:', response.data)

      // Save JWT token to localStorage
      localStorage.setItem('token', response.data.token)
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        
        {/* Header */}
        <h1 className="text-3xl font-bold text-center mb-2 text-indigo-600">LinkSnap</h1>
        <p className="text-center text-gray-600 mb-8">Welcome back</p>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Username or Email input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username or Email
            </label>
            <input
              type="text"
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
              placeholder="john_doe or you@example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              required
            />
          </div>

          {/* Password input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              required
            />
          </div>

          {/* Forgot password link */}
          <div className="text-right">
            <a href="#" className="text-sm text-indigo-600 hover:text-indigo-700">
              Forgot password?
            </a>
          </div>

          {/* Login button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold text-white transition duration-200 ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95'
            }`}
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

        {/* Error message */}
        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm border border-red-200">
            <p className="font-medium">❌ {error}</p>
          </div>
        )}

        {/* Sign up link */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600 mb-3">
            Don't have an account?
          </p>
          <Link
            to="/signup"
            className="text-indigo-600 font-semibold hover:text-indigo-700"
          >
            Sign up here
          </Link>
        </div>
      </div>
    </div>
  )
}