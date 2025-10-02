import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Challenge } from '../types'
import { Code2, Clock, User, Calendar, Search, Filter } from 'lucide-react'

export default function Challenges() {
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterDuration, setFilterDuration] = useState<string>('all')

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

      if (error) throw error
      setChallenges(data || [])
    } catch (error) {
      console.error('Error fetching challenges:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredChallenges = challenges.filter((challenge) => {
    const matchesSearch =
      challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      challenge.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesDuration =
      filterDuration === 'all' ||
      (filterDuration === 'quick' && challenge.duration_hours <= 48) ||
      (filterDuration === 'medium' && challenge.duration_hours > 48 && challenge.duration_hours <= 168) ||
      (filterDuration === 'long' && challenge.duration_hours > 168)

    return matchesSearch && matchesDuration
  })

  const formatDuration = (hours: number) => {
    if (hours < 24) return `${hours}h`
    if (hours < 168) return `${Math.floor(hours / 24)}d`
    return `${Math.floor(hours / 168)}w`
  }

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Header */}
      <header className="bg-dark-800 border-b border-dark-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Code2 className="h-8 w-8 text-primary-500" />
              <div>
                <h1 className="text-2xl font-bold text-white">Active Challenges</h1>
                <p className="text-dark-400 text-sm">
                  Browse and join challenges to showcase your skills
                </p>
              </div>
            </div>
            <Link to="/" className="btn-secondary">
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="bg-dark-800 border-b border-dark-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-dark-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search challenges..."
                className="input pl-10 w-full"
              />
            </div>

            {/* Duration Filter */}
            <div className="relative sm:w-48">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-dark-500" />
              <select
                value={filterDuration}
                onChange={(e) => setFilterDuration(e.target.value)}
                className="input pl-10 w-full appearance-none cursor-pointer"
              >
                <option value="all">All Durations</option>
                <option value="quick">Quick (≤2 days)</option>
                <option value="medium">Medium (3-7 days)</option>
                <option value="long">Long (1+ weeks)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : filteredChallenges.length === 0 ? (
          <div className="text-center py-12">
            <Code2 className="h-16 w-16 text-dark-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No challenges found</h3>
            <p className="text-dark-400">
              {searchQuery || filterDuration !== 'all'
                ? 'Try adjusting your filters'
                : 'Check back soon for new challenges!'}
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-dark-400">
                Showing <span className="text-white font-semibold">{filteredChallenges.length}</span>{' '}
                {filteredChallenges.length === 1 ? 'challenge' : 'challenges'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredChallenges.map((challenge) => (
                <Link
                  key={challenge.id}
                  to={`/challenges/${challenge.id}`}
                  className="card hover:border-primary-500/50 transition-all duration-200 hover:scale-[1.02] group"
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

                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-xs text-dark-500 pt-4 border-t border-dark-700">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{formatDuration(challenge.duration_hours)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(challenge.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="mt-4">
                    <div className="btn-primary w-full text-center text-sm">
                      View Challenge →
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  )
}

