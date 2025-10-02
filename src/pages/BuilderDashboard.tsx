import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Challenge, Submission } from '../types'
import { Code2, LogOut, Trophy, Clock, Target, Calendar, ArrowRight, Github, Video, Award } from 'lucide-react'

export default function BuilderDashboard() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchChallenges()
    fetchSubmissions()
  }, [])

  const fetchChallenges = async () => {
    try {
      console.log('🔍 Fetching challenges...')
      const { data, error } = await supabase
        .from('challenges')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(6)

      if (error) {
        console.error('❌ Error fetching challenges:', error)
        throw error
      }

      console.log('✅ Fetched challenges:', data)
      console.log('📊 Number of challenges:', data?.length || 0)
      setChallenges(data || [])
    } catch (error) {
      console.error('❌ Error fetching challenges:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('submissions')
        .select(`
          *,
          challenges:challenge_id (
            id,
            title,
            status
          )
        `)
        .eq('builder_id', user?.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setSubmissions(data || [])
    } catch (error) {
      console.error('Error fetching submissions:', error)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const formatDuration = (hours: number) => {
    if (hours < 24) return `${hours}h`
    if (hours < 168) return `${Math.floor(hours / 24)}d`
    return `${Math.floor(hours / 168)}w`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      {/* Navigation */}
      <nav className="border-b border-blue-700 bg-gray-800/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <Code2 className="h-8 w-8 text-primary-500" />
              <span className="text-xl font-bold text-white">EliteBuilders</span>
              <span className="text-sm text-dark-400 ml-4">Builder Dashboard</span>
            </Link>
            <div className="flex items-center space-x-4">
              <span className="text-dark-400 text-sm">{user?.email}</span>
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 text-dark-400 hover:text-white transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8 p-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-2xl">
          <h1 className="text-4xl font-bold text-white mb-2">Welcome back, Builder! 🚀</h1>
          <p className="text-blue-100 text-lg">Ready to ship something amazing?</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-400 text-sm mb-1">Active Challenges</p>
                <p className="text-3xl font-bold text-white">0</p>
              </div>
              <div className="p-3 bg-primary-500/10 rounded-lg">
                <Target className="h-8 w-8 text-primary-500" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-400 text-sm mb-1">Submissions</p>
                <p className="text-3xl font-bold text-white">{submissions.length}</p>
              </div>
              <div className="p-3 bg-primary-500/10 rounded-lg">
                <Clock className="h-8 w-8 text-primary-500" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-400 text-sm mb-1">Wins</p>
                <p className="text-3xl font-bold text-white">0</p>
              </div>
              <div className="p-3 bg-primary-500/10 rounded-lg">
                <Trophy className="h-8 w-8 text-primary-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Available Challenges */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Available Challenges</h2>
            <Link to="/challenges" className="text-primary-400 hover:text-primary-300 text-sm font-medium flex items-center space-x-1">
              <span>View All</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          ) : challenges.length === 0 ? (
            <div className="text-center py-12">
              <Target className="h-16 w-16 text-dark-600 mx-auto mb-4" />
              <p className="text-dark-400 mb-4">No challenges available yet</p>
              <p className="text-dark-500 text-sm">Check back soon for exciting opportunities!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {challenges.map((challenge) => (
                <Link
                  key={challenge.id}
                  to={`/challenges/${challenge.id}`}
                  className="p-4 bg-dark-800 rounded-lg border border-dark-700 hover:border-primary-500/50 transition-all duration-200 hover:scale-[1.02] group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-white font-semibold group-hover:text-primary-400 transition-colors line-clamp-2 flex-1">
                      {challenge.title}
                    </h3>
                    <span className="px-2 py-0.5 bg-green-500/10 text-green-500 rounded text-xs font-medium ml-2 flex-shrink-0">
                      Active
                    </span>
                  </div>
                  <p className="text-dark-400 text-sm mb-3 line-clamp-2">{challenge.description}</p>
                  <div className="flex items-center justify-between text-xs text-dark-500">
                    <span className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{formatDuration(challenge.duration_hours)}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(challenge.created_at).toLocaleDateString()}</span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* My Submissions */}
        <div className="card mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center space-x-2">
              <Trophy className="h-6 w-6 text-yellow-500" />
              <span>My Submissions</span>
            </h2>
          </div>

          {submissions.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="h-16 w-16 text-dark-600 mx-auto mb-4" />
              <p className="text-dark-400 mb-4">No submissions yet</p>
              <p className="text-dark-500 text-sm">Submit your first project to get started!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {submissions.map((submission: any) => (
                <div
                  key={submission.id}
                  className="p-4 bg-dark-800 rounded-lg border border-dark-700 hover:border-primary-500/50 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-white font-semibold mb-1">
                        {submission.challenges?.title || 'Challenge'}
                      </h3>
                      <p className="text-dark-500 text-xs">
                        Submitted {new Date(submission.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="px-3 py-1 bg-primary-500/10 text-primary-400 rounded-full text-sm font-medium flex items-center space-x-1">
                        <Award className="h-4 w-4" />
                        <span>Score: {submission.llm_score}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-sm">
                    <a
                      href={submission.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 text-dark-400 hover:text-white transition-colors"
                    >
                      <Github className="h-4 w-4" />
                      <span>View Code</span>
                    </a>
                    <a
                      href={submission.demo_video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 text-dark-400 hover:text-white transition-colors"
                    >
                      <Video className="h-4 w-4" />
                      <span>Watch Demo</span>
                    </a>
                    {submission.challenges?.id && (
                      <Link
                        to={`/challenges/${submission.challenges.id}`}
                        className="flex items-center space-x-1 text-primary-400 hover:text-primary-300 transition-colors ml-auto"
                      >
                        <span>View Challenge</span>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

