import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

export default function HowToUse() {
  const navigate = useNavigate()

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4">
        <div className="w-full mx-auto">
          
          {/* PAGE HEADER */}
          <div className="mb-12">
            <button
              onClick={() => navigate('/')}
              className="text-indigo-600 hover:text-indigo-700 font-bold text-lg mb-6 flex items-center gap-2 transition-colors duration-300"
            >
              ← Back to Home
            </button>
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-4">How to Use LinkSnap</h1>
            <p className="text-xl text-slate-600">Learn how to shorten URLs and track your links in minutes</p>
          </div>

          {/* VIDEO SECTION */}
          <div className="bg-white rounded-2xl shadow-lg p-10 mb-12">
            <h2 className="text-3xl font-black text-slate-900 mb-8">Watch the Tutorial</h2>
            
            {/* VIDEO CONTAINER */}
            <div className="aspect-video bg-slate-900 rounded-xl overflow-hidden mb-6 flex items-center justify-center">
              <div id="video-container">
                {/* VIDEO WILL BE EMBEDDED HERE */}
                <p className="text-white text-center">
                  Video will be embedded here
                </p>
              </div>
            </div>
          </div>

          {/* STEP BY STEP GUIDE */}
          <div className="bg-white rounded-2xl shadow-lg p-10 mb-12">
            <h2 className="text-3xl font-black text-slate-900 mb-10">Step-by-Step Guide</h2>
            
            <div className="space-y-8">
              
              {/* STEP 1 */}
              <div className="flex gap-8">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black text-lg">
                    1
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">Sign Up or Login</h3>
                  <p className="text-lg text-slate-600 leading-relaxed">
                    Create a free account or login to your existing account. This allows you to track analytics for your shortened links.
                  </p>
                </div>
              </div>

              {/* STEP 2 */}
              <div className="flex gap-8">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black text-lg">
                    2
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">Enter Your Long URL</h3>
                  <p className="text-lg text-slate-600 leading-relaxed">
                    Paste any long URL (like a GitHub link, article, or website) into the input field on the home page.
                  </p>
                </div>
              </div>

              {/* STEP 3 */}
              <div className="flex gap-8">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-r from-pink-600 to-red-600 text-white font-black text-lg">
                    3
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">Click Shorten URL</h3>
                  <p className="text-lg text-slate-600 leading-relaxed">
                    Click the "Shorten URL" button to generate a short link instantly. Your link will be in the format: linksnap.io/abc12345
                  </p>
                </div>
              </div>

              {/* STEP 4 */}
              <div className="flex gap-8">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-lg">
                    4
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">Copy and Share</h3>
                  <p className="text-lg text-slate-600 leading-relaxed">
                    Click "Copy to Clipboard" to copy your short link and share it on social media, emails, or anywhere else.
                  </p>
                </div>
              </div>

              {/* STEP 5 */}
              <div className="flex gap-8">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-black text-lg">
                    5
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">View Analytics</h3>
                  <p className="text-lg text-slate-600 leading-relaxed">
                    Go to your Dashboard to see all your links. Click "Analytics" on any link to view detailed statistics like total clicks, top referrers, and countries.
                  </p>
                </div>
              </div>

              {/* STEP 6 */}
              <div className="flex gap-8">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-black text-lg">
                    6
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">Track Performance</h3>
                  <p className="text-lg text-slate-600 leading-relaxed">
                    Monitor your link's performance in real-time. See how many clicks you got, where they came from, and from which countries.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* FEATURES SECTION */}
          <div className="bg-white rounded-2xl shadow-lg p-10 mb-12">
            <h2 className="text-3xl font-black text-slate-900 mb-10">Key Features</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* FEATURE 1 */}
              <div className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border-l-4 border-indigo-600">
                <div className="text-3xl mb-4">🔗</div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Short URLs</h3>
                <p className="text-slate-600">Convert long, ugly URLs into short, clean, shareable links instantly.</p>
              </div>

              {/* FEATURE 2 */}
              <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-l-4 border-purple-600">
                <div className="text-3xl mb-4">📊</div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Real-time Analytics</h3>
                <p className="text-slate-600">Track every click with detailed analytics about traffic sources and locations.</p>
              </div>

              {/* FEATURE 3 */}
              <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-l-4 border-blue-600">
                <div className="text-3xl mb-4">🌍</div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Global Tracking</h3>
                <p className="text-slate-600">See clicks from different countries and understand your audience distribution.</p>
              </div>

              {/* FEATURE 4 */}
              <div className="p-6 bg-gradient-to-br from-pink-50 to-red-50 rounded-xl border-l-4 border-pink-600">
                <div className="text-3xl mb-4">📈</div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Trend Charts</h3>
                <p className="text-slate-600">Visualize your click trends over time with interactive charts and graphs.</p>
              </div>

              {/* FEATURE 5 */}
              <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-l-4 border-green-600">
                <div className="text-3xl mb-4">⚡</div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Instant Creation</h3>
                <p className="text-slate-600">Generate short links in seconds. No waiting, no complicated process.</p>
              </div>

              {/* FEATURE 6 */}
              <div className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border-l-4 border-yellow-600">
                <div className="text-3xl mb-4">🔐</div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Secure & Free</h3>
                <p className="text-slate-600">Your data is secure. Create unlimited links at no cost with full analytics.</p>
              </div>
            </div>
          </div>

          {/* FAQ SECTION */}
          <div className="bg-white rounded-2xl shadow-lg p-10 mb-12">
            <h2 className="text-3xl font-black text-slate-900 mb-10">FAQ</h2>
            
            <div className="space-y-6">
              
              {/* FAQ 1 */}
              <div className="pb-6 border-b-2 border-slate-200">
                <h3 className="text-xl font-bold text-slate-900 mb-3">❓ Do I need to create an account?</h3>
                <p className="text-lg text-slate-600">
                  You can create short links as a guest, but you won't see analytics. Create a free account to track clicks, see where traffic comes from, and manage all your links.
                </p>
              </div>

              {/* FAQ 2 */}
              <div className="pb-6 border-b-2 border-slate-200">
                <h3 className="text-xl font-bold text-slate-900 mb-3">❓ How long do my links last?</h3>
                <p className="text-lg text-slate-600">
                  Guest links expire after 24 hours. Account links last for 7 days. This keeps the service clean and prevents spam.
                </p>
              </div>

              {/* FAQ 3 */}
              <div className="pb-6 border-b-2 border-slate-200">
                <h3 className="text-xl font-bold text-slate-900 mb-3">❓ Can I track clicks on my links?</h3>
                <p className="text-lg text-slate-600">
                  Yes! Create an account and go to your Dashboard. Click "Analytics" on any link to see total clicks, clicks in the last 24 hours, 7 days, or 30 days, plus top referrers and countries.
                </p>
              </div>

              {/* FAQ 4 */}
              <div className="pb-6 border-b-2 border-slate-200">
                <h3 className="text-xl font-bold text-slate-900 mb-3">❓ Is LinkSnap free?</h3>
                <p className="text-lg text-slate-600">
                  Yes, LinkSnap is completely free! Create unlimited short links and track unlimited clicks. No credit card required.
                </p>
              </div>

              {/* FAQ 5 */}
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">❓ Can I see where my clicks come from?</h3>
                <p className="text-lg text-slate-600">
                  Absolutely! View analytics for each link to see the top referrers (like Twitter, Reddit, emails) and top countries. We also show click trends over time with interactive charts.
                </p>
              </div>
            </div>
          </div>

          {/* CTA SECTION */}
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-lg p-12 text-center text-white">
            <h2 className="text-4xl font-black mb-4">Ready to get started?</h2>
            <p className="text-xl mb-8 opacity-90">Create your first short link in seconds</p>
            <button
              onClick={() => navigate('/signup')}
              className="px-10 py-4 bg-white text-indigo-600 font-bold text-lg rounded-xl hover:shadow-lg transition-all duration-300"
            >
              Sign Up Now
            </button>
          </div>
        </div>
      </div>
    </>
  )
}