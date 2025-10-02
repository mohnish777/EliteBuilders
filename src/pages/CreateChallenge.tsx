import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { Code2, AlertCircle, Clock, FileText, ArrowLeft } from 'lucide-react'

const DURATION_OPTIONS = [
  { value: 24, label: '24 hours (Quick Sprint)' },
  { value: 48, label: '48 hours (Weekend Hack)' },
  { value: 72, label: '3 days' },
  { value: 120, label: '5 days (Work Week)' },
  { value: 168, label: '1 week' },
  { value: 336, label: '2 weeks' },
  { value: 504, label: '3 weeks' },
]

export default function CreateChallenge() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [durationHours, setDurationHours] = useState(48)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation
    if (title.trim().length < 10) {
      setError('Title must be at least 10 characters')
      return
    }

    if (description.trim().length < 50) {
      setError('Description must be at least 50 characters')
      return
    }

    setLoading(true)

    try {
      const { error: insertError } = await supabase
        .from('challenges')
        .insert([
          {
            title: title.trim(),
            description: description.trim(),
            duration_hours: durationHours,
            host_id: user?.id,
            status: 'active',
          },
        ])

      if (insertError) throw insertError

      // Success! Redirect to host dashboard
      navigate('/host/dashboard')
    } catch (err: any) {
      setError(err.message || 'Failed to create challenge')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Header */}
      <header className="bg-dark-800 border-b border-dark-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/host/dashboard')}
              className="text-dark-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <Code2 className="h-6 w-6 text-primary-500" />
              <h1 className="text-xl font-bold text-white">Create New Challenge</h1>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Challenge Details</h2>
            <p className="text-dark-400">
              Create a challenge for AI builders to showcase their skills
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-dark-300 mb-2">
                Challenge Title *
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-dark-500" />
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="input pl-10"
                  placeholder="e.g., Build a Real-Time Chat App with AI"
                  required
                  maxLength={100}
                />
              </div>
              <p className="mt-1 text-xs text-dark-500">
                {title.length}/100 characters (min 10)
              </p>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-dark-300 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input min-h-[200px] resize-y"
                placeholder="Describe the challenge in detail...&#10;&#10;What should builders create?&#10;What features are required?&#10;What technologies should they use?&#10;How will submissions be evaluated?"
                required
                maxLength={2000}
              />
              <p className="mt-1 text-xs text-dark-500">
                {description.length}/2000 characters (min 50)
              </p>
            </div>

            {/* Duration */}
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-dark-300 mb-2">
                Challenge Duration *
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-dark-500" />
                <select
                  id="duration"
                  value={durationHours}
                  onChange={(e) => setDurationHours(Number(e.target.value))}
                  className="input pl-10 appearance-none cursor-pointer"
                  required
                >
                  {DURATION_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="h-5 w-5 text-dark-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              <p className="mt-1 text-xs text-dark-500">
                How long builders have to complete the challenge
              </p>
            </div>

            {/* Preview */}
            <div className="border-t border-dark-700 pt-6">
              <h3 className="text-sm font-medium text-dark-300 mb-3">Preview</h3>
              <div className="bg-dark-800 rounded-lg p-4 border border-dark-700">
                <h4 className="text-lg font-semibold text-white mb-2">
                  {title || 'Challenge Title'}
                </h4>
                <div className="flex items-center space-x-4 text-sm text-dark-400 mb-3">
                  <span className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>
                      {DURATION_OPTIONS.find((opt) => opt.value === durationHours)?.label || '48 hours'}
                    </span>
                  </span>
                  <span className="px-2 py-0.5 bg-green-500/10 text-green-500 rounded text-xs font-medium">
                    Active
                  </span>
                </div>
                <p className="text-dark-400 text-sm whitespace-pre-wrap">
                  {description || 'Challenge description will appear here...'}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-3 pt-6 border-t border-dark-700">
              <button
                type="button"
                onClick={() => navigate('/host/dashboard')}
                className="btn-secondary"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create Challenge'}
              </button>
            </div>
          </form>
        </div>

        {/* Tips */}
        <div className="mt-6 bg-primary-500/5 border border-primary-500/20 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-primary-400 mb-2">💡 Tips for Great Challenges</h3>
          <ul className="text-sm text-dark-400 space-y-1">
            <li>• Be specific about requirements and deliverables</li>
            <li>• Include example use cases or user stories</li>
            <li>• Mention preferred tech stack (if any)</li>
            <li>• Set realistic time expectations</li>
            <li>• Explain how submissions will be evaluated</li>
          </ul>
        </div>
      </main>
    </div>
  )
}

