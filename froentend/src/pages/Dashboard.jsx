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

        //console.log('Links response:', response.data)
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">My Links</h1>
            <p className="text-gray-600">Manage and view analytics for all your shortened links</p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center p-12 bg-white rounded-lg shadow-md">
              <div className="text-center">
                <div className="animate-spin text-4xl mb-4">⟳</div>
                <p className="text-gray-600">Loading your links...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
              <p className="text-red-700 font-medium">❌ {error}</p>
              <p className="text-red-600 text-sm mt-2">
                Make sure the backend is running on http://localhost:8000
              </p>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && links.length === 0 && (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <p className="text-gray-600 text-lg mb-4">No links yet</p>
              <p className="text-gray-500 mb-6">
                Start shortening URLs to see them here
              </p>
              <button
                onClick={() => navigate('/')}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                Create Your First Link
              </button>
            </div>
          )}

          {/* Links List */}
          {!loading && !error && links.length > 0 && (
            <div className="space-y-4">
              {links.map((link) => (
                <div
                  key={link.shortId}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6"
                >
                  {/* Link Info Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Original URL */}
                    <div>
                      <p className="text-sm text-gray-500 font-medium mb-2">Original URL</p>
                      <p className="text-gray-800 break-all">
                        {link.redirectURL}
                      </p>
                    </div>

                    {/* Short Link */}
                    <div>
                      <p className="text-sm text-gray-500 font-medium mb-2">Short Link</p>
                      <p className="text-indigo-600 font-mono break-all">
                        http://localhost:8000/api/url/{link.shortId}
                      </p>
                    </div>

                    {/* Click Count */}
                    <div>
                      <p className="text-sm text-gray-500 font-medium mb-2">Total Clicks</p>
                      <p className="text-2xl font-bold text-indigo-600">
                        {link.totalClicks || 0}
                      </p>
                    </div>

                    {/* Created Date */}
                    <div>
                      <p className="text-sm text-gray-500 font-medium mb-2">Created</p>
                      <p className="text-gray-800">
                        {formatDate(link.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4 border-t border-gray-200">
                    {/* Copy Button */}
                    <button
                      onClick={() => handleCopy(link.shortId)}
                      className={`flex-1 py-2 rounded-lg font-medium text-sm transition ${
                        copiedId === link.shortId
                          ? 'bg-green-100 text-green-700 border border-green-300'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {copiedId === link.shortId ? '✓ Copied!' : 'Copy Link'}
                    </button>

                    {/* Analytics Button */}
                    <button
                      onClick={() => handleAnalytics(link.shortId)}
                      className="flex-1 py-2 bg-indigo-600 text-white rounded-lg font-medium text-sm hover:bg-indigo-700 transition"
                    >
                      View Analytics
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Stats Summary */}
          {!loading && !error && links.length > 0 && (
            <div className="mt-8 bg-white rounded-lg shadow-md p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-gray-500 text-sm mb-2">Total Links</p>
                  <p className="text-3xl font-bold text-indigo-600">{links.length}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-2">Total Clicks</p>
                  <p className="text-3xl font-bold text-indigo-600">
                    {links.reduce((sum, link) => sum + (link.totalClicks || 0), 0)}
                  </p>
                </div>
                <div className="col-span-2 md:col-span-1">
                  <p className="text-gray-500 text-sm mb-2">Avg Clicks/Link</p>
                  <p className="text-3xl font-bold text-indigo-600">
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