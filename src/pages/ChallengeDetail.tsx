import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { Challenge, Submission, Profile } from '../types'
import {
  Code2,
  Clock,
  Calendar,
  User,
  ArrowLeft,
  Trophy,
  Upload,
  AlertCircle,
  CheckCircle,
  Edit,
} from 'lucide-react'

export default function ChallengeDetail() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [challenge, setChallenge] = useState<Challenge | null>(null)
  const [hostProfile, setHostProfile] = useState<Profile | null>(null)
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [userSubmission, setUserSubmission] = useState<Submission | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (id) {
      fetchChallengeData()
    }
  }, [id, user])

  const fetchChallengeData = async () => {
    try {
      console.log('🔍 Fetching challenge with ID:', id)

      // Fetch challenge - Try without .single() first to see if RLS is blocking
      const { data: challengeData, error: challengeError, count } = await supabase
        .from('challenges')
        .select('*', { count: 'exact' })
        .eq('id', id)

      console.log('📊 Query result:', { data: challengeData, error: challengeError, count })

      if (challengeError) {
        console.error('❌ Error fetching challenge:', challengeError)
        throw challengeError
      }

      if (!challengeData || challengeData.length === 0) {
        console.error('❌ No challenge found with ID:', id)
        throw new Error('Challenge not found - it may not exist or you may not have permission to view it')
      }

      if (challengeData.length > 1) {
        console.warn('⚠️ Multiple challenges found with same ID (should not happen)')
      }

      const challenge = challengeData[0]
      console.log('✅ Challenge data:', challenge)
      setChallenge(challenge)

      // Fetch host profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', challenge.host_id)

      if (profileError) {
        console.error('❌ Error fetching host profile:', profileError)
        throw profileError
      }

      if (!profileData || profileData.length === 0) {
        console.warn('⚠️ No host profile found')
      } else {
        setHostProfile(profileData[0])
      }

      // Fetch submissions
      const { data: submissionsData, error: submissionsError } = await supabase
        .from('submissions')
        .select('*')
        .eq('challenge_id', id)
        .order('llm_score', { ascending: false })

      if (submissionsError) throw submissionsError
      setSubmissions(submissionsData || [])

      // Check if user has submitted
      if (user) {
        const userSub = submissionsData?.find((sub) => sub.builder_id === user.id)
        setUserSubmission(userSub || null)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load challenge')
    } finally {
      setLoading(false)
    }
  }

  const formatDuration = (hours: number) => {
    if (hours < 24) return `${hours} hours`
    if (hours < 168) return `${Math.floor(hours / 24)} days`
    return `${Math.floor(hours / 168)} weeks`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  if (error || !challenge) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Challenge Not Found</h2>
          <p className="text-dark-400 mb-6">{error || 'This challenge does not exist'}</p>
          <Link to="/challenges" className="btn-primary">
            Browse Challenges
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Header */}
      <header className="bg-dark-800 border-b border-dark-700">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate(-1)}
              className="text-dark-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <Code2 className="h-6 w-6 text-primary-500" />
            <h1 className="text-xl font-bold text-white">Challenge Details</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Challenge Info */}
            <div className="card">
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-2xl font-bold text-white">{challenge.title}</h2>
                <span className="px-3 py-1 bg-green-500/10 text-green-500 rounded-lg text-sm font-medium">
                  {challenge.status}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-dark-400 mb-6 pb-6 border-b border-dark-700">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>{formatDuration(challenge.duration_hours)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>Posted {new Date(challenge.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Trophy className="h-4 w-4" />
                  <span>{submissions.length} submissions</span>
                </div>
              </div>

              <div className="prose prose-invert max-w-none">
                <h3 className="text-lg font-semibold text-white mb-3">Description</h3>
                <p className="text-dark-300 whitespace-pre-wrap leading-relaxed">
                  {challenge.description}
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Leaderboard - Now in Sidebar */}
            {submissions.length > 0 && (
              <div className="card sticky top-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  <span>Leaderboard</span>
                </h3>
                <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
                  {submissions.slice(0, 10).map((submission, index) => (
                    <div
                      key={submission.id}
                      className="flex items-center justify-between p-3 bg-dark-800 rounded-lg border border-dark-700 hover:border-primary-500/50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                            index === 0
                              ? 'bg-yellow-500/20 text-yellow-500 ring-2 ring-yellow-500/50'
                              : index === 1
                              ? 'bg-gray-400/20 text-gray-400 ring-2 ring-gray-400/50'
                              : index === 2
                              ? 'bg-orange-600/20 text-orange-600 ring-2 ring-orange-600/50'
                              : 'bg-dark-700 text-dark-400'
                          }`}
                        >
                          {index + 1}
                        </div>
                        <div className="min-w-0">
                          <p className="text-white text-sm font-medium truncate">
                            {submission.builder_id === user?.id ? '🎯 You' : 'Builder'}
                          </p>
                          {index < 3 && (
                            <p className="text-xs text-dark-500">
                              {index === 0 ? '🥇 1st Place' : index === 1 ? '🥈 2nd Place' : '🥉 3rd Place'}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-primary-400 font-bold text-lg">{submission.llm_score}</p>
                        <p className="text-dark-500 text-xs">points</p>
                      </div>
                    </div>
                  ))}
                </div>
                {submissions.length > 10 && (
                  <p className="text-dark-500 text-xs text-center mt-3 pt-3 border-t border-dark-700">
                    Showing top 10 of {submissions.length} submissions
                  </p>
                )}
              </div>
            )}
            {/* Host Info */}
            <div className="card">
              <h3 className="text-sm font-semibold text-dark-400 mb-3">HOSTED BY</h3>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary-500" />
                </div>
                <div>
                  <p className="text-white font-medium">
                    {hostProfile?.company_name || 'Company'}
                  </p>
                  <p className="text-dark-500 text-sm">Challenge Host</p>
                </div>
              </div>
            </div>

            {/* Edit Button for Challenge Owner */}
            {user && challenge.host_id === user.id && (
              <div className="card">
                <h3 className="text-sm font-semibold text-dark-400 mb-3">MANAGE CHALLENGE</h3>
                <Link
                  to={`/challenges/${challenge.id}/edit`}
                  className="btn-primary w-full flex items-center justify-center space-x-2"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit Challenge</span>
                </Link>
              </div>
            )}

            {/* Action Card */}
            <div className="card bg-gradient-to-br from-primary-500/10 to-purple-500/10 border-primary-500/20">
              {userSubmission ? (
                <>
                  <div className="flex items-center space-x-2 text-green-500 mb-3">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-semibold">Submitted!</span>
                  </div>
                  <p className="text-dark-300 text-sm mb-4">
                    You've submitted to this challenge. Your score: {userSubmission.llm_score}
                  </p>
                  <Link
                    to={`/challenges/${challenge.id}/submit`}
                    className="btn-secondary w-full text-center"
                  >
                    Update Submission
                  </Link>
                </>
              ) : user ? (
                <>
                  <h3 className="text-lg font-semibold text-white mb-2">Ready to compete?</h3>
                  <p className="text-dark-300 text-sm mb-4">
                    Submit your project and compete for the top spot on the leaderboard!
                  </p>
                  <Link
                    to={`/challenges/${challenge.id}/submit`}
                    className="btn-primary w-full text-center flex items-center justify-center space-x-2"
                  >
                    <Upload className="h-4 w-4" />
                    <span>Submit Project</span>
                  </Link>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-semibold text-white mb-2">Join the challenge</h3>
                  <p className="text-dark-300 text-sm mb-4">
                    Sign in to submit your project and compete!
                  </p>
                  <Link to="/login" className="btn-primary w-full text-center">
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

