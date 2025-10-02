import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { Code2, AlertCircle, Github } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn, signInWithGitHub } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await signIn(email, password)

      // Get user profile to check role
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        // Redirect based on role
        if (profile?.role === 'host') {
          navigate('/host/dashboard')
        } else {
          navigate('/builder/dashboard')
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to sign in')
    } finally {
      setLoading(false)
    }
  }

  const handleGitHubSignIn = async () => {
    setError('')
    setLoading(true)

    try {
      await signInWithGitHub()
      // Redirect will be handled by Supabase OAuth flow
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with GitHub')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Code2 className="h-12 w-12 text-primary-500" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
            EliteBuilders
          </h1>
          <p className="text-dark-400 mt-2">Sign in to your account</p>
        </div>

        {/* Form */}
        <div className="card">
          {error && (
            <div className="mb-4 p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-start space-x-2">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-dark-300 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-dark-300 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-dark-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-dark-800 text-dark-400">Or continue with</span>
            </div>
          </div>

          {/* GitHub OAuth Button */}
          <button
            onClick={handleGitHubSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-dark-700 hover:bg-dark-600 text-white font-semibold rounded-lg border border-dark-600 transition-all duration-200 hover:border-dark-500 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Github className="h-5 w-5" />
            <span>Sign in with GitHub</span>
          </button>

          <div className="mt-6 text-center">
            <p className="text-dark-400">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary-500 hover:text-primary-400 font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

