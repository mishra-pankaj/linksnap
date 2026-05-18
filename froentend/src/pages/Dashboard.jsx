import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'

export default function Dashboard() {
  const navigate = useNavigate()
  const [links, setLinks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [copiedId, setCopiedId] = useState(null)

  // Fetch user's links on page load
  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const token = localStorage.getItem('token')
        
        if (!token) {
          setError('No authentication token found')
          setLoading(false)
          return
        }

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/url/links`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        console.log('Links response:', response.data)
        setLinks(response.data.links || [])
      } catch (err) {
        console.error('Error fetching links:', err)
        
        if (err.response?.status === 401) {
          setError('Unauthorized. Please login again.')
          navigate('/login')
        } else if (err.response?.status === 404) {
          setError('Links endpoint not found. Backend may not be configured.')
        } else {
          setError('Failed to load your links. Please try again.')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchLinks()
  }, [navigate])

  // Format date to readable format
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    } catch {
      return 'Unknown date'
    }
  }

  // Copy short link to clipboard
  const handleCopy = (shortId) => {
    const shortLink = `http://localhost:8000/api/url/${shortId}`
    navigator.clipboard.writeText(shortLink)
    setCopiedId(shortId)
    
    // Reset after 2 seconds
    setTimeout(() => setCopiedId(null), 2000)
  }

  // Navigate to analytics page
  const handleAnalytics = (shortId) => {
    navigate(`/analytics/${shortId}`)
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4">
        <div className="w-full mx-auto">
          
          {/* PAGE HEADER */}
          <div className="mb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-2">
              <div>
                <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-3">My Links</h1>
                <p className="text-lg text-slate-600">Manage and view analytics for all your shortened links</p>
              </div>
              <button
                onClick={() => navigate('/')}
                className="px-8 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-lg transition-all duration-300"
              >
                + Create New Link
              </button>
            </div>
          </div>

          {/* LOADING STATE */}
          {loading && (
            <div className="flex items-center justify-center p-16 bg-white rounded-2xl shadow-lg">
              <div className="text-center">
                <div className="animate-spin text-5xl mb-4">⟳</div>
                <p className="text-slate-600 text-lg font-semibold">Loading your links...</p>
              </div>
            </div>
          )}

          {/* ERROR STATE */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 rounded-xl p-6 mb-8">
              <p className="text-red-700 font-bold text-lg">❌ {error}</p>
              <p className="text-red-600 text-sm mt-2">
                Make sure the backend is running on http://localhost:8000
              </p>
            </div>
          )}

          {/* EMPTY STATE */}
          {!loading && !error && links.length === 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-16 text-center">
              <p className="text-slate-600 text-2xl font-bold mb-4">No links yet</p>
              <p className="text-slate-500 text-lg mb-8">
                Start shortening URLs to see them here
              </p>
              <button
                onClick={() => navigate('/')}
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-lg transition-all duration-300 text-lg"
              >
                Create Your First Link
              </button>
            </div>
          )}

          {/* LINKS GRID */}
          {!loading && !error && links.length > 0 && (
            <div className="space-y-5 mb-12">
              {links.map((link) => (
                <div
                  key={link.shortId}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8"
                >
                  {/* LINK INFO - 2 COLUMNS */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    
                    {/* ORIGINAL URL */}
                    <div>
                      <p className="text-sm font-bold text-slate-600 mb-3">Original URL</p>
                      <p className="text-lg text-slate-800 break-all font-semibold">
                        {link.redirectURL}
                      </p>
                    </div>

                    {/* SHORT LINK */}
                    <div>
                      <p className="text-sm font-bold text-slate-600 mb-3">Short Link</p>
                      <p className="text-lg font-mono text-indigo-600 break-all font-bold">
                         http://localhost:8000/api/url/{link.shortId}
                      </p>
                    </div>

                    {/* CLICK COUNT */}
                    <div>
                      <p className="text-sm font-bold text-slate-600 mb-3">Total Clicks</p>
                      <p className="text-5xl font-black text-indigo-600">
                        {link.totalClicks || 0}
                      </p>
                    </div>

                    {/* CREATED DATE */}
                    <div>
                      <p className="text-sm font-bold text-slate-600 mb-3">Created</p>
                      <p className="text-lg text-slate-800 font-semibold">
                        {formatDate(link.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="flex gap-4 pt-8 border-t-2 border-slate-200">
                    
                    {/* COPY BUTTON */}
                    <button
                      onClick={() => handleCopy(link.shortId)}
                      className={`flex-1 py-3 rounded-xl font-bold text-lg transition-all duration-300 ${
                        copiedId === link.shortId
                          ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                          : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                      }`}
                    >
                      {copiedId === link.shortId ? '✓ Copied!' : '📋 Copy Link'}
                    </button>

                    {/* ANALYTICS BUTTON */}
                    <button
                      onClick={() => handleAnalytics(link.shortId)}
                      className="flex-1 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg hover:shadow-lg transition-all duration-300"
                    >
                      📈 Analytics
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* STATS SUMMARY */}
          {!loading && !error && links.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10">
              <p className="text-2xl font-black text-slate-900 mb-8">Statistics</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                
                {/* TOTAL LINKS */}
                <div className="text-center p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border-l-4 border-indigo-600">
                  <p className="text-sm font-bold text-slate-600 mb-2">Total Links</p>
                  <p className="text-5xl font-black text-indigo-600">{links.length}</p>
                </div>

                {/* TOTAL CLICKS */}
                <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-l-4 border-purple-600">
                  <p className="text-sm font-bold text-slate-600 mb-2">Total Clicks</p>
                  <p className="text-5xl font-black text-purple-600">
                    {links.reduce((sum, link) => sum + (link.totalClicks || 0), 0)}
                  </p>
                </div>

                {/* AVG CLICKS PER LINK */}
                <div className="text-center p-6 bg-gradient-to-br from-pink-50 to-red-50 rounded-xl border-l-4 border-pink-600">
                  <p className="text-sm font-bold text-slate-600 mb-2">Avg Clicks/Link</p>
                  <p className="text-5xl font-black text-pink-600">
                    {Math.round(
                      links.reduce((sum, link) => sum + (link.totalClicks || 0), 0) / 
                      links.length
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}