import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Challenge } from '../types'
import { insertDummyChallenges } from '../utils/insertDummyChallenges'
import { Code2, LogOut, Plus, Users, TrendingUp, Award, Clock, Calendar, Edit, Trash2, Eye, Sparkles } from 'lucide-react'

export default function HostDashboard() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [loading, setLoading] = useState(true)
  const [insertingDummies, setInsertingDummies] = useState(false)
  const [stats, setStats] = useState({
    activeChallenges: 0,
    totalSubmissions: 0,
    participants: 0,
  })

  useEffect(() => {
    if (user) {
      fetchChallenges()
      fetchStats()
    }
  }, [user])

  const fetchChallenges = async () => {
    try {
      const { data, error } = await supabase
        .from('challenges')
        .select('*')
        .eq('host_id', user?.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setChallenges(data || [])
    } catch (error) {
      console.error('Error fetching challenges:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      // Get active challenges count
      const { data: activeChallenges } = await supabase
        .from('challenges')
        .select('id', { count: 'exact' })
        .eq('host_id', user?.id)
        .eq('status', 'active')

      // Get total submissions for host's challenges
      const { data: hostChallenges } = await supabase
        .from('challenges')
        .select('id')
        .eq('host_id', user?.id)

      const challengeIds = hostChallenges?.map((c) => c.id) || []

      let totalSubmissions = 0
      let uniqueBuilders = new Set()

      if (challengeIds.length > 0) {
        const { data: submissions } = await supabase
          .from('submissions')
          .select('builder_id')
          .in('challenge_id', challengeIds)

        totalSubmissions = submissions?.length || 0
        submissions?.forEach((sub) => uniqueBuilders.add(sub.builder_id))
      }

      setStats({
        activeChallenges: activeChallenges?.length || 0,
        totalSubmissions,
        participants: uniqueBuilders.size,
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const handleDelete = async (challengeId: string) => {
    if (!confirm('Are you sure you want to delete this challenge?')) return

    try {
      const { error } = await supabase.from('challenges').delete().eq('id', challengeId)

      if (error) throw error

      // Refresh challenges
      fetchChallenges()
      fetchStats()
    } catch (error: any) {
      alert('Failed to delete challenge: ' + error.message)
    }
  }

  const handleInsertDummies = async () => {
    if (!confirm('This will insert 6 sample challenges. Continue?')) return

    setInsertingDummies(true)
    try {
      const result = await insertDummyChallenges()
      if (result.success) {
        alert(`✅ Successfully inserted ${result.count} challenges!`)
        fetchChallenges()
        fetchStats()
      } else {
        alert(`❌ Error: ${result.error}`)
      }
    } catch (error: any) {
      alert(`❌ Error: ${error.message}`)
    } finally {
      setInsertingDummies(false)
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
    <div className="min-h-screen bg-dark-900">
      {/* Navigation */}
      <nav className="border-b border-dark-700 bg-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <Code2 className="h-8 w-8 text-primary-500" />
              <span className="text-xl font-bold text-white">EliteBuilders</span>
              <span className="text-sm text-dark-400 ml-4">Host Dashboard</span>
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
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Host Dashboard 🎯</h1>
            <p className="text-dark-400">Manage your challenges and discover top talent</p>
          </div>
          <Link to="/challenges/create" className="btn-primary flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Create Challenge</span>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-400 text-sm mb-1">Active Challenges</p>
                <p className="text-3xl font-bold text-white">{stats.activeChallenges}</p>
              </div>
              <div className="p-3 bg-primary-500/10 rounded-lg">
                <Award className="h-8 w-8 text-primary-500" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-400 text-sm mb-1">Total Submissions</p>
                <p className="text-3xl font-bold text-white">{stats.totalSubmissions}</p>
              </div>
              <div className="p-3 bg-primary-500/10 rounded-lg">
                <TrendingUp className="h-8 w-8 text-primary-500" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-400 text-sm mb-1">Participants</p>
                <p className="text-3xl font-bold text-white">{stats.participants}</p>
              </div>
              <div className="p-3 bg-primary-500/10 rounded-lg">
                <Users className="h-8 w-8 text-primary-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Your Challenges */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Your Challenges</h2>
            <Link to="/challenges/create" className="btn-secondary text-sm">
              <Plus className="h-4 w-4 inline mr-1" />
              New Challenge
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          ) : challenges.length === 0 ? (
            <div className="text-center py-12">
              <Award className="h-16 w-16 text-dark-600 mx-auto mb-4" />
              <p className="text-dark-400 mb-4">No challenges created yet</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link to="/challenges/create" className="btn-primary flex items-center space-x-2">
                  <Plus className="h-5 w-5" />
                  <span>Create Your First Challenge</span>
                </Link>
                <button
                  onClick={handleInsertDummies}
                  disabled={insertingDummies}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <Sparkles className="h-5 w-5" />
                  <span>{insertingDummies ? 'Inserting...' : 'Insert 6 Sample Challenges'}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {challenges.map((challenge) => (
                <div
                  key={challenge.id}
                  className="p-4 bg-dark-800 rounded-lg border border-dark-700 hover:border-dark-600 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-1">{challenge.title}</h3>
                      <p className="text-dark-400 text-sm line-clamp-2">{challenge.description}</p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ml-4 flex-shrink-0 ${
                        challenge.status === 'active'
                          ? 'bg-green-500/10 text-green-500'
                          : 'bg-dark-600 text-dark-400'
                      }`}
                    >
                      {challenge.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-xs text-dark-500">
                      <span className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{formatDuration(challenge.duration_hours)}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(challenge.created_at).toLocaleDateString()}</span>
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/challenges/${challenge.id}`}
                        className="p-2 text-dark-400 hover:text-primary-400 transition-colors"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link
                        to={`/challenges/${challenge.id}/edit`}
                        className="p-2 text-dark-400 hover:text-blue-400 transition-colors"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(challenge.id)}
                        className="p-2 text-dark-400 hover:text-red-400 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
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

