import React from 'react'

function text() {
  return (
    <div className="min-h-screen bg-[#f5f7fb] flex items-center justify-center px-4">

    {/* Main Card */}
    <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-15  ">

      {/* Header */}
      <div className="text-center mb-8">

        <h1 className="text-3xl font-bold text-gray-900">
          LinkSnap
        </h1>

        <p className="text-gray-500 mt-2 text-sm">
          Create your account to manage and track your links.
        </p>

      </div>

      {/* Form */}
      <form onSubmit={handleSignup} className="space-y-5">

        {/* Username */}
        <div>

          <label className="block text-sm font-medium text-gray-700 mb-2">
            Username
          </label>

          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="john_doe"
            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            required
          />

          <p className="text-xs text-gray-400 mt-2">
            Minimum 3 characters
          </p>

        </div>

        {/* Email */}
        <div>

          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            required
          />

        </div>

        {/* Password */}
        <div>

          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            required
          />

          <p className="text-xs text-gray-400 mt-2">
            Minimum 6 characters
          </p>

        </div>

        {/* Confirm Password */}
        <div>

          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirm Password
          </label>

          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            required
          />

        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-xl font-semibold text-white transition-all duration-200 ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99]'
          }`}
        >

          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin">⟳</span>
              Creating account...
            </span>
          ) : (
            'Create Account'
          )}

        </button>

      </form>

      {/* Error */}
      {error && (
        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-gray-100 text-center">

        <p className="text-sm text-gray-500">
          Already have an account?
        </p>

        <Link
          to="/login"
          className="inline-block mt-2 text-sm font-medium text-indigo-600 hover:text-indigo-700"
        >
          Sign in
        </Link>

      </div>

    </div>
  </div>
  )
}

export default text