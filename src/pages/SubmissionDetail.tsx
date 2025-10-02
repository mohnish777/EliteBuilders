import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { ArrowLeft, Github, Video, Trophy, CheckCircle, XCircle, Loader, Sparkles } from 'lucide-react'
import { ScoreBreakdown } from '../utils/scoringService'

interface Submission {
  id: string
  challenge_id: string
  builder_id: string
  github_url: string
  demo_video_url: string
  llm_score: number
  score_breakdown: ScoreBreakdown | null
  created_at: string
  challenges: {
    id: string
    title: string
    description: string
  }
  profiles: {
    id: string
    github_username: string
  }
}

export default function SubmissionDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [submission, setSubmission] = useState<Submission | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchSubmission()
  }, [id])

  const fetchSubmission = async () => {
    try {
      setLoading(true)
      setError('')

      const { data, error: fetchError } = await supabase
        .from('submissions')
        .select(`
          *,
          challenges:challenge_id (
            id,
            title,
            description
          ),
          profiles:builder_id (
            id,
            github_username
          )
        `)
        .eq('id', id)
        .single()

      if (fetchError) throw fetchError
      if (!data) throw new Error('Submission not found')

      setSubmission(data)
    } catch (err: any) {
      console.error('Error fetching submission:', err)
      setError(err.message || 'Failed to load submission')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-8 w-8 text-primary-500 animate-spin mx-auto mb-4" />
          <p className="text-dark-400">Loading submission...</p>
        </div>
      </div>
    )
  }

  if (error || !submission) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="card max-w-md w-full text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Error</h2>
          <p className="text-dark-400 mb-6">{error || 'Submission not found'}</p>
          <button onClick={() => navigate(-1)} className="btn-secondary">
            Go Back
          </button>
        </div>
      </div>
    )
  }

  const scoreBreakdown = submission.score_breakdown

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Header */}
      <header className="bg-dark-800 border-b border-dark-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-dark-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Submission Details</h1>
              <Link
                to={`/challenges/${submission.challenges.id}`}
                className="text-primary-400 hover:text-primary-300 transition-colors"
              >
                {submission.challenges.title}
              </Link>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary-400">{submission.llm_score}</div>
              <div className="text-sm text-dark-500">Total Score</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Score Breakdown */}
            {scoreBreakdown ? (
              <div className="card">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                  <Trophy className="h-6 w-6 text-yellow-500" />
                  <span>Score Breakdown</span>
                  {scoreBreakdown && (
                    <span className="text-xs px-2 py-1 bg-primary-500/10 text-primary-400 rounded">
                      AI Evaluated
                    </span>
                  )}
                </h2>

                <div className="space-y-4">
                  {/* Functionality */}
                  <ScoreBar
                    label="Functionality"
                    score={scoreBreakdown.functionality}
                    maxScore={30}
                    color="blue"
                  />

                  {/* Code Quality */}
                  <ScoreBar
                    label="Code Quality"
                    score={scoreBreakdown.codeQuality}
                    maxScore={30}
                    color="green"
                  />

                  {/* Documentation */}
                  <ScoreBar
                    label="Documentation"
                    score={scoreBreakdown.documentation}
                    maxScore={20}
                    color="purple"
                  />

                  {/* Innovation */}
                  <ScoreBar
                    label="Innovation"
                    score={scoreBreakdown.innovation}
                    maxScore={10}
                    color="yellow"
                  />

                  {/* UI/UX */}
                  <ScoreBar
                    label="UI/UX"
                    score={scoreBreakdown.uiux}
                    maxScore={10}
                    color="pink"
                  />

                  {/* Total */}
                  <div className="pt-4 border-t border-dark-700">
                    <ScoreBar
                      label="Total Score"
                      score={scoreBreakdown.total}
                      maxScore={100}
                      color="primary"
                      large
                    />
                  </div>
                </div>

                {/* AI Feedback */}
                {scoreBreakdown.feedback && (
                  <div className="mt-6 p-4 bg-dark-800 rounded-lg border border-dark-700">
                    <h3 className="text-sm font-semibold text-white mb-2 flex items-center space-x-2">
                      <Sparkles className="h-4 w-4 text-primary-400" />
                      <span>AI Feedback</span>
                    </h3>
                    <div className="text-sm text-dark-300 whitespace-pre-wrap leading-relaxed">
                      {scoreBreakdown.feedback}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="card">
                <div className="text-center py-8">
                  <Trophy className="h-12 w-12 text-dark-600 mx-auto mb-4" />
                  <p className="text-dark-400">No detailed score breakdown available</p>
                  <p className="text-sm text-dark-500 mt-2">Score: {submission.llm_score}/100</p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Submission Info */}
            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-4">Submission Info</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-dark-500 mb-1">Builder</p>
                  <p className="text-white">{submission.profiles.github_username || 'Anonymous'}</p>
                </div>
                <div>
                  <p className="text-xs text-dark-500 mb-1">Submitted</p>
                  <p className="text-white">{new Date(submission.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Links */}
            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-4">Project Links</h3>
              <div className="space-y-3">
                <a
                  href={submission.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-3 bg-dark-800 rounded-lg hover:bg-dark-700 transition-colors group"
                >
                  <Github className="h-5 w-5 text-dark-400 group-hover:text-white transition-colors" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white">View Repository</p>
                    <p className="text-xs text-dark-500 truncate">{submission.github_url}</p>
                  </div>
                </a>

                {submission.demo_video_url && (
                  <a
                    href={submission.demo_video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-3 bg-dark-800 rounded-lg hover:bg-dark-700 transition-colors group"
                  >
                    <Video className="h-5 w-5 text-dark-400 group-hover:text-white transition-colors" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white">Watch Demo</p>
                      <p className="text-xs text-dark-500 truncate">{submission.demo_video_url}</p>
                    </div>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

// Score Bar Component
interface ScoreBarProps {
  label: string
  score: number
  maxScore: number
  color: 'blue' | 'green' | 'purple' | 'yellow' | 'pink' | 'primary'
  large?: boolean
}

function ScoreBar({ label, score, maxScore, color, large }: ScoreBarProps) {
  const percentage = (score / maxScore) * 100

  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    yellow: 'bg-yellow-500',
    pink: 'bg-pink-500',
    primary: 'bg-primary-500',
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className={`${large ? 'text-base font-semibold' : 'text-sm'} text-white`}>
          {label}
        </span>
        <span className={`${large ? 'text-lg font-bold' : 'text-sm font-medium'} text-dark-300`}>
          {score}/{maxScore}
        </span>
      </div>
      <div className="w-full bg-dark-700 rounded-full h-3 overflow-hidden">
        <div
          className={`${colorClasses[color]} h-full rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

