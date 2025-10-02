// User Types
export type UserRole = 'builder' | 'host'

export interface Profile {
  id: string
  role: UserRole
  company_name?: string
  github_username?: string
  created_at: string
}

// Challenge Types
export interface Challenge {
  id: string
  title: string
  description: string
  duration_hours: number
  host_id: string
  status: string
  created_at: string
}

// Submission Types
export interface Submission {
  id: string
  challenge_id: string
  builder_id: string
  github_url: string
  demo_video_url: string
  llm_score: number
  created_at: string
}

// Leaderboard Types
export interface LeaderboardEntry {
  builder_id: string
  github_username?: string
  submission_id: string
  llm_score: number
  rank: number
}

