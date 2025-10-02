import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { Code2, ArrowLeft, AlertCircle, Save } from 'lucide-react'

const durationOptions = [
  { hours: 24, label: '24 hours (Quick Sprint)' },
  { hours: 48, label: '48 hours (Weekend Hack)' },
  { hours: 72, label: '3 days' },
  { hours: 120, label: '5 days (Work Week)' },
  { hours: 168, label: '1 week' },
  { hours: 336, label: '2 weeks' },
  { hours: 504, label: '3 weeks' },
]

export default function EditChallenge() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [durationHours, setDurationHours] = useState(168)
  const [status, setStatus] = useState('active')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [isOwner, setIsOwner] = useState(false)

  useEffect(() => {
    if (id && user) {
      fetchChallenge()
    }
  }, [id, user])

  const fetchChallenge = async () => {
    try {
      const { data, error } = await supabase
        .from('challenges')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error

      if (!data) {
        setError('Challenge not found')
        setLoading(false)
        return
      }

      // Check if current user is the owner
      if (data.host_id !== user?.id) {
        setError('You do not have permission to edit this challenge')
        setIsOwner(false)
        setLoading(false)
        return
      }

      setIsOwner(true)
      setTitle(data.title)
      setDescription(data.description)
      setDurationHours(data.duration_hours)
      setStatus(data.status)
      setLoading(false)
    } catch (error: any) {
      console.error('Error fetching challenge:', error)
      setError(error.message || 'Failed to load challenge')
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation
    if (title.trim().length < 10) {
      setError('Title must be at least 10 characters')
      return
    }

    if (title.trim().length > 100) {
      setError('Title must be less than 100 characters')
      return
    }

    if (description.trim().length < 50) {
      setError('Description must be at least 50 characters')
      return
    }

    if (description.trim().length > 2000) {
      setError('Description must be less than 2000 characters')
      return
    }

    setSaving(true)

    try {
      const { error: updateError } = await supabase
        .from('challenges')
        .update({
          title: title.trim(),
          description: description.trim(),
          duration_hours: durationHours,
          status: status,
        })
        .eq('id', id)
        .eq('host_id', user?.id) // Extra security: ensure user is owner

      if (updateError) throw updateError

      // Success! Redirect to host dashboard
      navigate('/host/dashboard')
    } catch (error: any) {
      setError(error.message || 'Failed to update challenge')
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  if (!isOwner || error) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full card text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-dark-400 mb-6">{error || 'You do not have permission to edit this challenge'}</p>
          <Link to="/host/dashboard" className="btn-primary inline-block">
            Go to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Navigation */}
      <nav className="border-b border-dark-700 bg-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <Code2 className="h-8 w-8 text-primary-500" />
              <span className="text-xl font-bold text-white">EliteBuilders</span>
            </Link>
            <Link
              to="/host/dashboard"
              className="flex items-center space-x-2 text-dark-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Dashboard</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Edit Challenge</h1>
          <p className="text-dark-400">Update your challenge details</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}

          {/* Challenge Details */}
          <div className="card space-y-6">
            <h2 className="text-xl font-bold text-white">Challenge Details</h2>

            {/* Title */}
            <div>
              <label className="block text-dark-300 text-sm font-medium mb-2">
                Challenge Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input"
                placeholder="e.g., Build a Real-Time Chat App with AI"
                maxLength={100}
                required
              />
              <p className="text-dark-500 text-xs mt-1">
                {title.length}/100 characters (minimum 10)
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-dark-300 text-sm font-medium mb-2">
                Description *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input min-h-[200px] resize-y"
                placeholder="Describe the challenge, requirements, tech stack, evaluation criteria..."
                maxLength={2000}
                required
              />
              <p className="text-dark-500 text-xs mt-1">
                {description.length}/2000 characters (minimum 50)
              </p>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-dark-300 text-sm font-medium mb-2">
                Challenge Duration *
              </label>
              <select
                value={durationHours}
                onChange={(e) => setDurationHours(Number(e.target.value))}
                className="input"
                required
              >
                {durationOptions.map((option) => (
                  <option key={option.hours} value={option.hours}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-dark-300 text-sm font-medium mb-2">
                Status *
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="input"
                required
              >
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <p className="text-dark-500 text-xs mt-1">
                Only "active" challenges are visible to builders
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-4">
            <Link to="/host/dashboard" className="btn-secondary">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary flex items-center space-x-2"
            >
              <Save className="h-5 w-5" />
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

