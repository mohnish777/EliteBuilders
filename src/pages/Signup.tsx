import { useState } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Code2, AlertCircle, User, Building2, Github } from 'lucide-react'

export default function Signup() {
  const [searchParams] = useSearchParams()
  const initialType = searchParams.get('type') as 'builder' | 'host' | null

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [userType, setUserType] = useState<'builder' | 'host'>(initialType || 'builder')
  const [githubUsername, setGithubUsername] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signUp, signInWithGitHub } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      await signUp(email, password, userType, githubUsername || undefined, companyName || undefined)
      navigate(userType === 'builder' ? '/builder/dashboard' : '/host/dashboard')
    } catch (err: any) {
      setError(err.message || 'Failed to create account')
    } finally {
      setLoading(false)
    }
  }

  const handleGitHubSignUp = async () => {
    setError('')
    setLoading(true)

    try {
      await signInWithGitHub()
      // Redirect will be handled by Supabase OAuth flow
    } catch (err: any) {
      setError(err.message || 'Failed to sign up with GitHub')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Code2 className="h-12 w-12 text-primary-500" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
            EliteBuilders
          </h1>
          <p className="text-dark-400 mt-2">Create your account</p>
        </div>

        {/* Form */}
        <div className="card">
          {error && (
            <div className="mb-4 p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-start space-x-2">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}

          {/* User Type Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-dark-300 mb-3">
              I want to...
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setUserType('builder')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  userType === 'builder'
                    ? 'border-primary-500 bg-primary-500/10'
                    : 'border-dark-600 bg-dark-800 hover:border-dark-500'
                }`}
              >
                <User className={`h-6 w-6 mx-auto mb-2 ${userType === 'builder' ? 'text-primary-500' : 'text-dark-400'}`} />
                <div className={`font-medium ${userType === 'builder' ? 'text-primary-500' : 'text-dark-300'}`}>
                  Build
                </div>
                <div className="text-xs text-dark-500 mt-1">Join challenges</div>
              </button>
              <button
                type="button"
                onClick={() => setUserType('host')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  userType === 'host'
                    ? 'border-primary-500 bg-primary-500/10'
                    : 'border-dark-600 bg-dark-800 hover:border-dark-500'
                }`}
              >
                <Building2 className={`h-6 w-6 mx-auto mb-2 ${userType === 'host' ? 'text-primary-500' : 'text-dark-400'}`} />
                <div className={`font-medium ${userType === 'host' ? 'text-primary-500' : 'text-dark-300'}`}>
                  Host
                </div>
                <div className="text-xs text-dark-500 mt-1">Post challenges</div>
              </button>
            </div>
          </div>

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

            {userType === 'builder' && (
              <div>
                <label htmlFor="githubUsername" className="block text-sm font-medium text-dark-300 mb-2">
                  GitHub Username <span className="text-dark-500">(optional)</span>
                </label>
                <input
                  id="githubUsername"
                  type="text"
                  value={githubUsername}
                  onChange={(e) => setGithubUsername(e.target.value)}
                  className="input"
                  placeholder="octocat"
                />
              </div>
            )}

            {userType === 'host' && (
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-dark-300 mb-2">
                  Company Name <span className="text-dark-500">(optional)</span>
                </label>
                <input
                  id="companyName"
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="input"
                  placeholder="Acme Inc."
                />
              </div>
            )}

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

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-dark-300 mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              {loading ? 'Creating account...' : 'Create Account'}
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
            onClick={handleGitHubSignUp}
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-dark-700 hover:bg-dark-600 text-white font-semibold rounded-lg border border-dark-600 transition-all duration-200 hover:border-dark-500 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Github className="h-5 w-5" />
            <span>Sign up with GitHub</span>
          </button>

          <div className="mt-6 text-center">
            <p className="text-dark-400">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-500 hover:text-primary-400 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

