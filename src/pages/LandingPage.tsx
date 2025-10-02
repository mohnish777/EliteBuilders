import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Code2, Trophy, Zap, Users, Rocket, Target, LogOut, Clock, ArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

interface Challenge {
  id: string
  title: string
  description: string
  duration_hours: number
  status: string
  created_at: string
}

export default function LandingPage() {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [loadingChallenges, setLoadingChallenges] = useState(true)

  useEffect(() => {
    fetchChallenges()
  }, [])

  const fetchChallenges = async () => {
    try {
      const { data, error } = await supabase
        .from('challenges')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(6)

      if (error) throw error
      setChallenges(data || [])
    } catch (error) {
      console.error('Error fetching challenges:', error)
    } finally {
      setLoadingChallenges(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const handleChallengeClick = (challengeId: string) => {
    if (user) {
      // User is logged in, go to challenge detail
      navigate(`/challenges/${challengeId}`)
    } else {
      // User not logged in, redirect to signup
      navigate('/signup?type=builder')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
      {/* Navigation */}
      <nav className="border-b border-dark-700 bg-dark-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <Code2 className="h-8 w-8 text-primary-500" />
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
                EliteBuilders
              </span>
            </Link>
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <span className="text-dark-400 text-sm hidden sm:block">{user.email}</span>
                  <button
                    onClick={() => navigate('/builder/dashboard')}
                    className="text-dark-300 hover:text-white transition-colors"
                  >
                    Builder
                  </button>
                  <button
                    onClick={() => navigate('/host/dashboard')}
                    className="text-dark-300 hover:text-white transition-colors"
                  >
                    Host
                  </button>
                  <button
                    onClick={() => navigate('/challenges')}
                    className="text-dark-300 hover:text-white transition-colors"
                  >
                    Challenges
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-2 text-dark-300 hover:text-white transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                    <span className="hidden sm:inline">Sign Out</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="text-dark-300 hover:text-white transition-colors"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="text-center">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 bg-clip-text text-transparent">
              Build. Ship. Win.
            </span>
          </h1>
          <p className="text-xl sm:text-2xl text-dark-300 mb-4 max-w-3xl mx-auto">
            The competition platform where AI builders prove their skills through real products, not puzzles.
          </p>
          <p className="text-lg text-dark-400 mb-12 max-w-2xl mx-auto">
            Join company-sponsored challenges, ship working prototypes, and land your next opportunity.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
            {user ? (
              <>
                <button
                  onClick={() => navigate('/builder/dashboard')}
                  className="btn-primary w-full sm:w-auto text-lg px-8 py-4 flex items-center justify-center space-x-2"
                >
                  <Rocket className="h-5 w-5" />
                  <span>Builder Dashboard</span>
                </button>
                <button
                  onClick={() => navigate('/host/dashboard')}
                  className="btn-secondary w-full sm:w-auto text-lg px-8 py-4 flex items-center justify-center space-x-2"
                >
                  <Target className="h-5 w-5" />
                  <span>Host Dashboard</span>
                </button>
                <button
                  onClick={() => navigate('/challenges')}
                  className="btn-secondary w-full sm:w-auto text-lg px-8 py-4 flex items-center justify-center space-x-2"
                >
                  <Trophy className="h-5 w-5" />
                  <span>Browse Challenges</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate('/signup?type=builder')}
                  className="btn-primary w-full sm:w-auto text-lg px-8 py-4 flex items-center justify-center space-x-2"
                >
                  <Rocket className="h-5 w-5" />
                  <span>Join as Builder</span>
                </button>
                <button
                  onClick={() => navigate('/signup?type=host')}
                  className="btn-secondary w-full sm:w-auto text-lg px-8 py-4 flex items-center justify-center space-x-2"
                >
                  <Target className="h-5 w-5" />
                  <span>Post Challenge</span>
                </button>
              </>
            )}
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
            <div className="card hover:border-primary-500/50 transition-all">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-primary-500/10 rounded-lg">
                  <Zap className="h-8 w-8 text-primary-500" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Vibe Coding</h3>
              <p className="text-dark-400">
                Use AI tools like Cursor, Lovable, and Supabase to rapidly build real products. No algorithm puzzles.
              </p>
            </div>

            <div className="card hover:border-primary-500/50 transition-all">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-primary-500/10 rounded-lg">
                  <Trophy className="h-8 w-8 text-primary-500" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered Scoring</h3>
              <p className="text-dark-400">
                LLM judges evaluate your submissions on functionality, code quality, and innovation. Fair and fast.
              </p>
            </div>

            <div className="card hover:border-primary-500/50 transition-all">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-primary-500/10 rounded-lg">
                  <Users className="h-8 w-8 text-primary-500" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Hired</h3>
              <p className="text-dark-400">
                Top performers get noticed by companies. Turn your leaderboard rank into job opportunities.
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 pt-20 border-t border-dark-700">
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-primary-500 mb-2">48h-3w</div>
              <div className="text-dark-400">Challenge Duration</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-primary-500 mb-2">Real</div>
              <div className="text-dark-400">Products Built</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-primary-500 mb-2">AI</div>
              <div className="text-dark-400">Powered Scoring</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-primary-500 mb-2">Live</div>
              <div className="text-dark-400">Leaderboards</div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Challenges Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Active Challenges
          </h2>
          <p className="text-dark-400 text-lg">
            Browse ongoing challenges and start building today
          </p>
        </div>

        {loadingChallenges ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : challenges.length === 0 ? (
          <div className="text-center py-12">
            <Trophy className="h-16 w-16 text-dark-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No active challenges yet</h3>
            <p className="text-dark-400">Check back soon for new challenges!</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {challenges.map((challenge) => (
                <div
                  key={challenge.id}
                  onClick={() => handleChallengeClick(challenge.id)}
                  className="card hover:border-primary-500/50 transition-all duration-200 hover:scale-[1.02] cursor-pointer group"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white group-hover:text-primary-400 transition-colors line-clamp-2 mb-2">
                        {challenge.title}
                      </h3>
                    </div>
                    <span className="px-2 py-1 bg-green-500/10 text-green-500 rounded text-xs font-medium flex-shrink-0 ml-2">
                      Active
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-dark-400 text-sm mb-4 line-clamp-3">
                    {challenge.description}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-dark-700">
                    <div className="flex items-center space-x-2 text-dark-400 text-sm">
                      <Clock className="h-4 w-4" />
                      <span>{challenge.duration_hours}h</span>
                    </div>
                    <div className="flex items-center space-x-1 text-primary-500 text-sm font-medium group-hover:text-primary-400 transition-colors">
                      <span>{user ? 'View Details' : 'Sign up to join'}</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* View All Button */}
            {challenges.length >= 6 && (
              <div className="text-center">
                <button
                  onClick={() => user ? navigate('/challenges') : navigate('/signup?type=builder')}
                  className="btn-secondary inline-flex items-center space-x-2"
                >
                  <span>View All Challenges</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-dark-700 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-dark-500">
            <p>&copy; 2025 EliteBuilders. Built with AI, for AI builders.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

