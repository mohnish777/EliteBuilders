import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { Challenge } from '../types'
import { 
  Code2, 
  ArrowLeft, 
  AlertCircle, 
  Upload, 
  Github, 
  Video,
  CheckCircle,
  Loader
} from 'lucide-react'

export default function SubmitChallenge() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [challenge, setChallenge] = useState<Challenge | null>(null)
  const [githubUrl, setGithubUrl] = useState('')
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoUrl, setVideoUrl] = useState('')
  const [useVideoUrl, setUseVideoUrl] = useState(true)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  useEffect(() => {
    if (id) {
      fetchChallenge()
    }
  }, [id])

  const fetchChallenge = async () => {
    try {
      const { data, error } = await supabase
        .from('challenges')
        .select('*')
        .eq('id', id)

      if (error) throw error

      if (!data || data.length === 0) {
        setError('Challenge not found')
        setLoading(false)
        return
      }

      setChallenge(data[0])
      setLoading(false)
    } catch (error: any) {
      console.error('Error fetching challenge:', error)
      setError(error.message || 'Failed to load challenge')
      setLoading(false)
    }
  }

  const validateGithubUrl = (url: string): boolean => {
    const githubRegex = /^https?:\/\/(www\.)?github\.com\/[\w-]+\/[\w.-]+\/?$/
    return githubRegex.test(url)
  }

  const validateVideoUrl = (url: string): boolean => {
    try {
      const urlObj = new URL(url)
      // Accept YouTube, Vimeo, Loom, or direct video links
      const validDomains = ['youtube.com', 'youtu.be', 'vimeo.com', 'loom.com']
      const isValidDomain = validDomains.some(domain => urlObj.hostname.includes(domain))
      const isDirectVideo = /\.(mp4|webm|ogg|mov)$/i.test(urlObj.pathname)
      return isValidDomain || isDirectVideo
    } catch {
      return false
    }
  }

  const uploadVideoFile = async (file: File): Promise<string> => {
    setUploading(true)
    setUploadProgress(0)

    try {
      // Create unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${user?.id}/${id}/${Date.now()}.${fileExt}`

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('demo-videos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) throw error

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('demo-videos')
        .getPublicUrl(fileName)

      setUploadProgress(100)
      return publicUrl
    } catch (error: any) {
      console.error('Error uploading video:', error)
      throw new Error(error.message || 'Failed to upload video')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validate GitHub URL
    if (!validateGithubUrl(githubUrl)) {
      setError('Please enter a valid GitHub repository URL (e.g., https://github.com/username/repo)')
      return
    }

    // Validate video
    let finalVideoUrl = ''
    if (useVideoUrl) {
      if (!videoUrl.trim()) {
        setError('Please enter a video URL')
        return
      }
      if (!validateVideoUrl(videoUrl)) {
        setError('Please enter a valid video URL (YouTube, Vimeo, Loom, or direct video link)')
        return
      }
      finalVideoUrl = videoUrl
    } else {
      if (!videoFile) {
        setError('Please select a video file to upload')
        return
      }
      // Check file size (max 100MB)
      if (videoFile.size > 100 * 1024 * 1024) {
        setError('Video file must be less than 100MB')
        return
      }
    }

    setSubmitting(true)

    try {
      // Upload video file if needed
      if (!useVideoUrl && videoFile) {
        finalVideoUrl = await uploadVideoFile(videoFile)
      }

      // Check if user already submitted
      const { data: existingSubmission } = await supabase
        .from('submissions')
        .select('id')
        .eq('challenge_id', id)
        .eq('builder_id', user?.id)

      if (existingSubmission && existingSubmission.length > 0) {
        // Update existing submission
        const { error: updateError } = await supabase
          .from('submissions')
          .update({
            github_url: githubUrl,
            demo_video_url: finalVideoUrl,
            created_at: new Date().toISOString()
          })
          .eq('id', existingSubmission[0].id)

        if (updateError) throw updateError
      } else {
        // Create new submission
        const { error: insertError } = await supabase
          .from('submissions')
          .insert([{
            challenge_id: id,
            builder_id: user?.id,
            github_url: githubUrl,
            demo_video_url: finalVideoUrl,
            llm_score: 0
          }])

        if (insertError) throw insertError
      }

      setSuccess(true)
      setTimeout(() => {
        navigate(`/challenges/${id}`)
      }, 2000)
    } catch (error: any) {
      console.error('Error submitting:', error)
      setError(error.message || 'Failed to submit. Please try again.')
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  if (error && !challenge) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full card text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Error</h2>
          <p className="text-dark-400 mb-6">{error}</p>
          <Link to="/challenges" className="btn-primary inline-block">
            Browse Challenges
          </Link>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full card text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Submission Successful!</h2>
          <p className="text-dark-400 mb-6">
            Your project has been submitted successfully. Redirecting to challenge page...
          </p>
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500 mx-auto"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Navigation */}
      <nav className="border-b border-dark-700 bg-dark-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Code2 className="h-8 w-8 text-primary-500" />
              <span className="text-xl font-bold text-white">EliteBuilders</span>
            </div>
            <Link
              to={`/challenges/${id}`}
              className="flex items-center space-x-2 text-dark-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Challenge</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Submit Your Project</h1>
          <p className="text-dark-400">Challenge: {challenge?.title}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}

          {/* GitHub URL */}
          <div className="card">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
              <Github className="h-5 w-5" />
              <span>GitHub Repository</span>
            </h2>
            
            <div>
              <label className="block text-dark-300 text-sm font-medium mb-2">
                Repository URL *
              </label>
              <input
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                className="input"
                placeholder="https://github.com/username/repository"
                required
              />
              <p className="text-dark-500 text-xs mt-1">
                Must be a public GitHub repository
              </p>
            </div>
          </div>

          {/* Demo Video */}
          <div className="card">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
              <Video className="h-5 w-5" />
              <span>Demo Video</span>
            </h2>

            {/* Toggle between URL and Upload */}
            <div className="flex items-center space-x-4 mb-4">
              <button
                type="button"
                onClick={() => setUseVideoUrl(true)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  useVideoUrl
                    ? 'bg-primary-500 text-white'
                    : 'bg-dark-700 text-dark-400 hover:text-white'
                }`}
              >
                Video URL
              </button>
              <button
                type="button"
                onClick={() => setUseVideoUrl(false)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  !useVideoUrl
                    ? 'bg-primary-500 text-white'
                    : 'bg-dark-700 text-dark-400 hover:text-white'
                }`}
              >
                Upload File
              </button>
            </div>

            {useVideoUrl ? (
              <div>
                <label className="block text-dark-300 text-sm font-medium mb-2">
                  Video URL *
                </label>
                <input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="input"
                  placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
                  required={useVideoUrl}
                />
                <p className="text-dark-500 text-xs mt-1">
                  YouTube, Vimeo, Loom, or direct video link
                </p>
              </div>
            ) : (
              <div>
                <label className="block text-dark-300 text-sm font-medium mb-2">
                  Upload Video File * (Max 100MB)
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                    className="hidden"
                    id="video-upload"
                    required={!useVideoUrl}
                  />
                  <label
                    htmlFor="video-upload"
                    className="flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-dark-600 rounded-lg cursor-pointer hover:border-primary-500 transition-colors"
                  >
                    <div className="text-center">
                      <Upload className="h-12 w-12 text-dark-500 mx-auto mb-2" />
                      <p className="text-dark-400">
                        {videoFile ? videoFile.name : 'Click to select video file'}
                      </p>
                      <p className="text-dark-500 text-xs mt-1">
                        MP4, WebM, or MOV (max 100MB)
                      </p>
                    </div>
                  </label>
                </div>
                {uploading && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm text-dark-400 mb-2">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-dark-700 rounded-full h-2">
                      <div
                        className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end space-x-4">
            <Link to={`/challenges/${id}`} className="btn-secondary">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting || uploading}
              className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting || uploading ? (
                <>
                  <Loader className="h-5 w-5 animate-spin" />
                  <span>{uploading ? 'Uploading...' : 'Submitting...'}</span>
                </>
              ) : (
                <>
                  <Upload className="h-5 w-5" />
                  <span>Submit Project</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

