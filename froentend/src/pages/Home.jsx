import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'

export default function Home() {
  const navigate = useNavigate()
  const [url, setUrl] = useState('')
  const [shortUrl, setShortUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const handleShorten = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setCopied(false)

    try {
      const token = localStorage.getItem('token')
      
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/url/shorten`,
        { url: url },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      //console.log('API Response:', response.data)
      setShortUrl(response.data.shortUrl)
      setUrl('')
    } catch (err) {
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

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <Navbar />
      
      {/* FULL WIDTH HERO BACKGROUND */}
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        
        {/* CENTERED HERO CONTENT */}
        <div className="flex items-center justify-center min-h-[calc(100vh-70px)] px-4 py-12">
          <div className="w-full max-w-3xl">
            
            {/* HERO TEXT SECTION */}
            <div className="text-center mb-16">
              {/* MAIN TITLE */}
              <h1 className="text-6xl md:text-7xl font-black text-slate-900 mb-4 leading-tight">
                Shorten URLs
              </h1>
              
              {/* GRADIENT SUBTITLE */}
              <h2 className="text-5xl md:text-6xl font-black mb-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                in Seconds
              </h2>
              
              {/* DESCRIPTION */}
              <p className="text-xl md:text-2xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Create short, shareable links and track every click in real-time with advanced analytics.
              </p>
            </div>

            {/* WHITE CARD - URL SHORTENER */}
            <div className="bg-white rounded-3xl shadow-2xl p-10 md:p-14 mb-12">
              
              {/* FORM */}
              <form onSubmit={handleShorten} className="space-y-6">
                
                {/* INPUT LABEL */}
                <div>
                  <label className="block text-lg font-bold text-slate-900 text-center  mb-4">
                    Enter Your URL
                  </label>
                  
                  {/* URL INPUT FIELD */}
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Paste your long URL here..."
                    className="w-full px-6 py-4 text-lg border-2 border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300"
                    required
                  />
                </div>

                {/* SHORTEN BUTTON */}
                <button
                  type="submit"
                  disabled={loading || !url}
                  className="w-full py-4 md:py-5 rounded-xl font-bold text-lg text-white transition-all duration-300 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
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

              {/* ERROR MESSAGE */}
              {error && (
                <div className="mt-8 p-5 bg-red-50 border-l-4 border-red-500 rounded-lg">
                  <p className="text-red-700 font-bold text-base">❌ {error}</p>
                </div>
              )}

              {/* SUCCESS - SHORTENED LINK DISPLAY */}
              {shortUrl && (
                <div className="mt-10 pt-10 border-t-2 border-slate-200">
                  
                  {/* SUCCESS LABEL */}
                  <p className="text-base font-bold text-slate-700 mb-4">Your Short Link:</p>
                  
                  {/* SHORTENED LINK BOX */}
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl mb-6 border-l-4 border-indigo-600">
                    <p className="text-lg md:text-xl font-bold font-mono text-indigo-600 break-all">
                      {shortUrl}
                    </p>
                  </div>

                  {/* COPY BUTTON */}
                  <button
                    onClick={handleCopy}
                    className={`w-full py-4 rounded-xl font-bold text-lg text-white transition-all duration-300 ${
                      copied
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg'
                        : 'bg-gradient-to-r from-slate-800 to-slate-900 hover:shadow-lg'
                    }`}
                  >
                    {copied ? '✓ Copied to Clipboard!' : '📋 Copy to Clipboard'}
                  </button>

                  {/* SHARE INFO */}
                  <p className="text-sm text-slate-500 text-center mt-4">
                    Share this link anywhere and it will redirect to the original URL
                  </p>
                </div>
              )}
            </div>

            {/* AUTHENTICATION SECTION */}
            <div className="text-center">
              
              {/* UNLOCK FEATURES TEXT */}
              <p className="text-slate-700 text-lg mb-8">
                <strong className="text-slate-900 text-xl block mb-2">Sign up to unlock analytics</strong>
                and track clicks on your links
              </p>

              {/* LOGIN & SIGNUP BUTTONS */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                
                {/* LOGIN BUTTON */}
                {/*<button
                  onClick={() => navigate('/login')}
                  className="px-10 py-4 border-2 border-indigo-600 text-indigo-600 font-bold text-lg rounded-xl hover:bg-indigo-50 transition-colors duration-300"
                >
                  Login
                </button>*/}
                
                {/* SIGNUP BUTTON */}
                {/*<button
                  onClick={() => navigate('/signup')}
                  className="px-10 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold text-lg rounded-xl hover:shadow-lg transition-all duration-300"
                >
                  Sign Up
                </button>*/}
              </div>
            </div>

            {/* DEBUG INFO BOX */}
            
          </div>
        </div>
      </div>
    </>
  )
}