import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import Navbar from '../components/Navbar'

export default function Analytics() {
  const { shortId } = useParams()
  const navigate = useNavigate()
  
  // State variables
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Fetch analytics data when page loads
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem('token')
        
        if (!token) {
          setError('No authentication token found. Please login.')
          setLoading(false)
          return
        }

        if (!shortId) {
          setError('No short link ID provided.')
          setLoading(false)
          return
        }

        //console.log('Fetching analytics for shortId:', shortId)
        
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/url/analytics/${shortId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        //console.log('Analytics response:', response.data)
        setData(response.data)
      } catch (err) {
        console.error('Error fetching analytics:', err)
        
        if (err.response?.status === 401) {
          setError('Unauthorized. Please login again.')
          navigate('/login')
        } else if (err.response?.status === 403) {
          setError('You do not have permission to view this analytics.')
        } else if (err.response?.status === 404) {
          setError('Short link not found.')
        } else {
          setError('Failed to load analytics. Please try again.')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [shortId, navigate])

  // Handle loading state
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-center p-12 bg-white rounded-lg shadow-md">
              <div className="text-center">
                <div className="animate-spin text-4xl mb-4">⟳</div>
                <p className="text-gray-600">Loading analytics...</p>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  // Handle error state
  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
              <p className="text-red-700 font-medium">❌ {error}</p>
              <button
                onClick={() => navigate('/dashboard')}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Go Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          
          {/* Page Header with Back Button */}
          <div className="mb-8">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-indigo-600 hover:text-indigo-700 font-medium mb-4 flex items-center gap-2"
            >
              ← Back to Dashboard
            </button>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Analytics</h1>
            <p className="text-gray-600">
              Statistics for: <span className="font-mono text-indigo-600">http://localhost:8000/api/url/{data?.shortId}</span>
            </p>
          </div>

          {/* Stats Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Total Clicks Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-gray-500 text-sm mb-2">Total Clicks</p>
              <p className="text-4xl font-bold text-indigo-600">{data?.totalClick || 0}</p>
            </div>

            {/* Last 24 Hours Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-gray-500 text-sm mb-2">Last 24 Hours</p>
              <p className="text-4xl font-bold text-blue-600">{data?.click_24h || 0}</p>
            </div>

            {/* Last 7 Days Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-gray-500 text-sm mb-2">Last 7 Days</p>
              <p className="text-4xl font-bold text-green-600">{data?.click_7d || 0}</p>
            </div>

            {/* Last 30 Days Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-gray-500 text-sm mb-2">Last 30 Days</p>
              <p className="text-4xl font-bold text-purple-600">{data?.clicks_30d || 0}</p>
            </div>
          </div>

          {/* Time Series Chart */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Click Trends</h2>
            {data?.timeseries && data.timeseries.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={data.timeseries}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #ccc',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="clicks" 
                    stroke="#4F46E5" 
                    dot={{ fill: '#4F46E5' }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-center py-8">No click data available</p>
            )}
          </div>

          {/* Two Column Layout for Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Top Referrers Table */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Top Referrers</h2>
              {data?.topReferrers && data.topReferrers.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Source</th>
                        <th className="text-right py-3 px-4 font-semibold text-gray-700">Clicks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.topReferrers.map((referrer, index) => (
                        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 text-gray-800">{referrer.referrer}</td>
                          <td className="py-3 px-4 text-right font-semibold text-indigo-600">
                            {referrer.count}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No referrer data available</p>
              )}
            </div>

            {/* Top Countries Table */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Top Countries</h2>
              {data?.topCountries && data.topCountries.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Country</th>
                        <th className="text-right py-3 px-4 font-semibold text-gray-700">Clicks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.topCountries.map((country, index) => (
                        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 text-gray-800">{country.country}</td>
                          <td className="py-3 px-4 text-right font-semibold text-green-600">
                            {country.count}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No country data available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}