import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import Navbar from '../components/Navbar'

export default function Analytics() {
  const { shortId } = useParams()
  const navigate = useNavigate()
  
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

        console.log('Fetching analytics for shortId:', shortId)
        
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/url/analytics/${shortId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        console.log('Analytics response:', response.data)
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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4">
          <div className="w-full mx-auto">
            <div className="flex items-center justify-center p-16 bg-white rounded-2xl shadow-lg">
              <div className="text-center">
                <div className="animate-spin text-5xl mb-4">⟳</div>
                <p className="text-slate-600 text-lg font-semibold">Loading analytics...</p>
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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4">
          <div className="w-full mx-auto">
            <div className="bg-red-50 border-l-4 border-red-500 rounded-xl p-8 mb-6">
              <p className="text-red-700 font-bold text-lg">❌ {error}</p>
              <button
                onClick={() => navigate('/dashboard')}
                className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:shadow-lg transition-all duration-300"
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4">
        <div className="w-full mx-auto">
          
          {/* PAGE HEADER */}
          <div className="mb-12">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-indigo-600 hover:text-indigo-700 font-bold text-lg mb-6 flex items-center gap-2 transition-colors duration-300"
            >
              ← Back to Dashboard
            </button>
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-4">Analytics</h1>
            <p className="text-xl text-slate-600">
              Statistics for: <span className="font-bold font-mono text-indigo-600">http://localhost:8000/api/url/analytics/{data?.shortId}</span>
            </p>
          </div>

          {/* STAT CARDS - 4 COLUMN GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            
            {/* TOTAL CLICKS CARD */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border-t-4 border-indigo-600">
              <p className="text-sm font-bold text-slate-600 mb-4">Total Clicks</p>
              <p className="text-5xl font-black text-indigo-600">{data?.totalClick || 0}</p>
            </div>

            {/* LAST 24 HOURS CARD */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border-t-4 border-blue-500">
              <p className="text-sm font-bold text-slate-600 mb-4">Last 24 Hours</p>
              <p className="text-5xl font-black text-blue-500">{data?.click_24h || 0}</p>
            </div>

            {/* LAST 7 DAYS CARD */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border-t-4 border-green-500">
              <p className="text-sm font-bold text-slate-600 mb-4">Last 7 Days</p>
              <p className="text-5xl font-black text-green-500">{data?.click_7d || 0}</p>
            </div>

            {/* LAST 30 DAYS CARD */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border-t-4 border-purple-500">
              <p className="text-sm font-bold text-slate-600 mb-4">Last 30 Days</p>
              <p className="text-5xl font-black text-purple-500">{data?.clicks_30d || 0}</p>
            </div>
          </div>

          {/* CLICK TRENDS CHART */}
          <div className="bg-white rounded-2xl shadow-lg p-10 mb-10">
            <h2 className="text-3xl font-black text-slate-900 mb-8">Click Trends</h2>
            {data?.timeseries && data.timeseries.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={data.timeseries} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="date" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                  />
                  <YAxis 
                    tick={{ fill: '#64748b', fontSize: 12 }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '2px solid #4f46e5',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                    }}
                    labelStyle={{ color: '#0f172a', fontWeight: 'bold' }}
                  />
                  <Legend 
                    wrapperStyle={{ paddingTop: '20px' }}
                    iconType="line"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="clicks" 
                    stroke="#4f46e5"
                    strokeWidth={3}
                    dot={{ fill: '#4f46e5', r: 5 }}
                    activeDot={{ r: 7, fill: '#764ba2' }}
                    fillOpacity={1}
                    fill="url(#colorClicks)"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-slate-500 text-center py-12 text-lg">No click data available</p>
            )}
          </div>

          {/* TWO COLUMN LAYOUT - TABLES */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            
            {/* TOP REFERRERS TABLE */}
            <div className="bg-white rounded-2xl shadow-lg p-10">
              <h2 className="text-3xl font-black text-slate-900 mb-8">Top Referrers</h2>
              {data?.topReferrers && data.topReferrers.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-slate-200">
                        <th className="text-left py-4 px-4 font-bold text-slate-700">Source</th>
                        <th className="text-right py-4 px-4 font-bold text-slate-700">Clicks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.topReferrers.map((referrer, index) => (
                        <tr key={index} className="border-b border-slate-100 hover:bg-slate-50 transition-colors duration-300">
                          <td className="py-4 px-4 text-slate-800 font-semibold">{referrer.referrer}</td>
                          <td className="py-4 px-4 text-right font-bold text-indigo-600 text-lg">
                            {referrer.count}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-slate-500 text-center py-12 text-lg">No referrer data available</p>
              )}
            </div>

            {/* TOP COUNTRIES TABLE */}
            <div className="bg-white rounded-2xl shadow-lg p-10">
              <h2 className="text-3xl font-black text-slate-900 mb-8">Top Countries</h2>
              {data?.topCountries && data.topCountries.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-slate-200">
                        <th className="text-left py-4 px-4 font-bold text-slate-700">Country</th>
                        <th className="text-right py-4 px-4 font-bold text-slate-700">Clicks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.topCountries.map((country, index) => (
                        <tr key={index} className="border-b border-slate-100 hover:bg-slate-50 transition-colors duration-300">
                          <td className="py-4 px-4 text-slate-800 font-semibold">{country.country}</td>
                          <td className="py-4 px-4 text-right font-bold text-green-600 text-lg">
                            {country.count}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-slate-500 text-center py-12 text-lg">No country data available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}