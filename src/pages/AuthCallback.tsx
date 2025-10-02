import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function AuthCallback() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the session from the URL hash
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) throw sessionError
        
        if (session?.user) {
          // Check if profile exists
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()

          if (profileError && profileError.code !== 'PGRST116') {
            throw profileError
          }

          // If no profile exists, create one (GitHub OAuth users default to builder)
          if (!profile) {
            const githubUsername = session.user.user_metadata?.user_name || 
                                  session.user.user_metadata?.preferred_username

            const { error: insertError } = await supabase
              .from('profiles')
              .insert([
                {
                  id: session.user.id,
                  role: 'builder',
                  github_username: githubUsername,
                },
              ])

            if (insertError) throw insertError
          }

          // Redirect to builder dashboard (GitHub users are builders)
          navigate('/builder/dashboard')
        } else {
          throw new Error('No session found')
        }
      } catch (err: any) {
        console.error('Auth callback error:', err)
        setError(err.message || 'Authentication failed')
        setTimeout(() => navigate('/login'), 3000)
      }
    }

    handleCallback()
  }, [navigate])

  if (error) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="card">
            <div className="text-red-500 mb-4">
              <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Authentication Failed</h2>
            <p className="text-dark-400 mb-4">{error}</p>
            <p className="text-dark-500 text-sm">Redirecting to login...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mx-auto mb-4"></div>
        <p className="text-dark-400">Completing authentication...</p>
      </div>
    </div>
  )
}

