import { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'

export default function Home() {
  // State variables
  const [url, setUrl] = useState('')
  const [shortUrl, setShortUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  // Function to handle the shorten button click
  const handleShorten = async (e) => {
    e.preventDefault()

    // Reset previous states
    setLoading(true)
    setError('')
    setCopied(false)

    // try {
    //   // Make API call to your backend
    //   const response = await axios.post(
    //     `${import.meta.env.VITE_API_URL}/api/url/shorten`,
    //     { url: url }
    //   )

    try {
      const token = localStorage.getItem('token')  // ← GET TOKEN
    
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/url/shorten`,
        { url: url },
        {
         headers: {
            Authorization: `Bearer ${token}`  // ← SEND TOKEN
          }
        }
      )

      // Backend returned the shortened URL
      //console.log('API Response:', response.data)
      setShortUrl(response.data.shortUrl)
      setUrl('')

    } catch (err) {
      // Something went wrong
      console.error('Error:', err)
      
      if (err.response?.status === 400) {
        setError('Please enter a valid URL')
      } else if (err.response?.status === 500) {
        setError('Server error. Please try again later.')
      } else if (!navigator.onLine) {
        setError('No internet connection')
      } else {
        setError('Failed to shorten URL. Make sure backend is running on localhost:8000')
      }
    } finally {
      setLoading(false)
    }
  }

  // Function to copy URL to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl)
    setCopied(true)
    
    // Reset the "copied" message after 2 seconds
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <Navbar/>
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      {/* Main card container */}
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        
        {/* Header */}
        <h1 className="text-4xl font-bold text-center mb-2 text-indigo-600">LinkSnap</h1>
        <p className="text-center text-gray-600 mb-8">Create short, shareable links instantly</p>

        {/* Form */}
        <form onSubmit={handleShorten} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter URL
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              required
            />
          </div>

          {/* Shorten button */}
          <button
            type="submit"
            disabled={loading || !url}
            className={`w-full py-3 rounded-lg font-semibold text-white transition duration-200 ${
              loading || !url
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">⟳</span> Creating...
              </span>
            ) : (
              'Shorten URL'
            )}
          </button>
        </form>

        {/* Error message */}
        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm border border-red-200">
            <p className="font-medium">❌ {error}</p>
          </div>
        )}

        {/* Success - Show shortened URL */}
        {shortUrl && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 mb-3 font-medium">Your short link:</p>
            
            {/* Display the short URL */}
            <div className="mb-4">
              <p className="text-lg font-mono text-indigo-600 break-all bg-white p-3 rounded border border-gray-200">
                {shortUrl}
              </p>
            </div>

            {/* Copy button */}
            <button
              onClick={handleCopy}
              className={`w-full py-2 rounded-lg text-sm font-medium transition duration-200 ${
                copied
                  ? 'bg-green-100 text-green-700 border border-green-300'
                  : 'bg-gray-800 text-white hover:bg-gray-900'
              }`}
            >
              {copied ? '✓ Copied to Clipboard!' : 'Copy to Clipboard'}
            </button>

            {/* Share info */}
            <p className="text-xs text-gray-500 text-center mt-3">
              Share this link anywhere and it will redirect to the original URL
            </p>
          </div>
        )}

        {/* Divider */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          {/* Sign up prompt */}
          <p className="text-sm text-gray-600 text-center mb-4">
            <strong>Sign up to view analytics</strong><br />
            and track clicks on your links
          </p>

          {/* Auth buttons - NOW WITH WORKING LINKS */}
          <div className="flex gap-3">
            <Link
              to="/login"
              className="flex-1 border-2 border-indigo-600 text-indigo-600 py-2 rounded-lg text-sm font-medium hover:bg-indigo-50 transition text-center"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="flex-1 bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition text-center"
            >
              Sign Up
            </Link>
          </div>
        </div>

        {/* Debug info */}
        <div className="mt-6 p-2 bg-yellow-50 rounded text-xs text-yellow-700 border border-yellow-200">
          💡 Make sure your backend is running on http://localhost:8000
        </div>
      </div>
    </div>
    </>
  )
}