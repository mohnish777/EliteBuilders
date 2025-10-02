import { supabase } from '../lib/supabase'

const dummyChallenges = [
  {
    title: 'Build a Real-Time Chat App with AI',
    description: `Create a real-time chat application with AI-powered features like message suggestions, smart replies, and sentiment analysis. Must include user authentication, presence indicators, and message history.

Requirements:
• Real-time messaging using WebSockets or Supabase Realtime
• User authentication and online/offline status
• AI-powered message suggestions or auto-complete
• Message history with search functionality
• Clean, modern UI with dark mode support

Tech Stack Suggestions:
• Frontend: React, Vue, or Svelte
• Backend: Supabase or Firebase
• AI: OpenAI API or Anthropic Claude

Bonus Points:
• Typing indicators
• File/image sharing
• Emoji reactions
• Voice messages`,
    duration_hours: 168, // 1 week
    status: 'active'
  },
  {
    title: 'AI-Powered Code Review Assistant',
    description: `Build a tool that uses AI to review code and provide actionable feedback on bugs, security issues, and best practices.

Requirements:
• GitHub repository integration
• AI-powered code analysis for bugs, security, and best practices
• Generate detailed review comments
• Support for at least 3 programming languages (JavaScript, Python, TypeScript)
• Web-based interface with code highlighting

Tech Stack Suggestions:
• Frontend: React + TypeScript
• Backend: Python (FastAPI) or Node.js
• AI: OpenAI GPT-4 or Claude
• Integration: GitHub API

Evaluation Criteria:
• Accuracy of code analysis (35%)
• Quality of feedback (25%)
• User experience (20%)
• Code quality (20%)`,
    duration_hours: 336, // 2 weeks
    status: 'active'
  },
  {
    title: 'AI Meme Generator - Weekend Sprint',
    description: `Create an AI-powered meme generator that creates funny, relevant memes based on trending topics or user input.

Requirements:
• Text-to-image generation or template-based memes
• AI-generated captions based on user input
• Gallery of generated memes
• Share functionality (download or social media)
• Mobile-responsive design

Tech Stack Suggestions:
• Frontend: Any modern framework (React, Next.js, etc.)
• AI: DALL-E, Stable Diffusion, or meme templates + GPT for captions
• Hosting: Vercel, Netlify, or similar

Bonus Points:
• Trending topic integration (Twitter API, Reddit API)
• Multiple meme template options
• Social media direct sharing
• User voting/favorites system`,
    duration_hours: 48, // 2 days
    status: 'active'
  },
  {
    title: 'AI Task Manager with Smart Scheduling',
    description: `Build a task management app that uses AI to optimize your schedule and prioritize tasks intelligently.

Requirements:
• Task creation, editing, and deletion (full CRUD)
• AI-powered task prioritization based on deadlines and importance
• Smart scheduling suggestions
• Calendar view and list view
• Progress tracking and analytics dashboard

Tech Stack Suggestions:
• Frontend: React, Next.js, or Vue
• Backend: Supabase, Firebase, or custom API
• AI: OpenAI API for task analysis and scheduling
• Optional: Google Calendar API integration

Evaluation Criteria:
• AI scheduling intelligence (35%)
• Feature completeness (30%)
• UI/UX design (20%)
• Code quality (15%)

Bonus Points:
• Natural language task input ("Finish report by Friday")
• Recurring tasks support
• Team collaboration features
• Mobile app version`,
    duration_hours: 240, // 10 days
    status: 'active'
  },
  {
    title: 'Interactive Data Dashboard Builder',
    description: `Create a no-code dashboard builder that allows users to visualize data from multiple sources with drag-and-drop simplicity.

Requirements:
• Drag-and-drop dashboard builder interface
• Multiple chart types (line, bar, pie, scatter, etc.)
• Data source integration (CSV upload, API, database connection)
• Real-time data updates
• Export and share dashboards

Tech Stack Suggestions:
• Frontend: React + D3.js, Chart.js, or Recharts
• Backend: Node.js or Python
• Database: PostgreSQL or MongoDB
• Deployment: Any cloud platform

Evaluation Criteria:
• Ease of use (30%)
• Visualization quality (25%)
• Feature completeness (25%)
• Performance (20%)

Bonus Points:
• AI-powered chart type recommendations
• Collaborative editing
• Custom themes and branding
• Mobile responsive dashboards`,
    duration_hours: 168, // 1 week
    status: 'active'
  },
  {
    title: 'AI Recipe Generator - 24 Hour Sprint',
    description: `Build an AI app that generates creative recipes based on ingredients you have at home.

Requirements:
• Input available ingredients
• AI generates creative, practical recipes
• Display cooking instructions step-by-step
• Nutritional information (calories, protein, etc.)
• Save favorite recipes

Tech Stack Suggestions:
• Frontend: Any framework (React, Vue, Svelte)
• AI: OpenAI GPT-4 or Claude
• Database: Any (for saving favorites)
• Deployment: Vercel, Netlify, etc.

Evaluation Criteria:
• Recipe quality and creativity (40%)
• User experience (35%)
• Speed and functionality (25%)

Bonus Points:
• Dietary restrictions support (vegan, gluten-free, etc.)
• AI-generated recipe images
• Shopping list generation
• Cooking time estimates and difficulty levels`,
    duration_hours: 24, // 24 hours
    status: 'active'
  }
]

export async function insertDummyChallenges() {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('You must be logged in to insert challenges')
    }

    // Check if user is a host
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, company_name')
      .eq('id', user.id)
      .single()

    if (!profile || profile.role !== 'host') {
      throw new Error('You must be a host to insert challenges')
    }

    console.log(`Inserting challenges for host: ${profile.company_name || 'Unknown'}`)

    // Insert all challenges
    const challengesWithHost = dummyChallenges.map(challenge => ({
      ...challenge,
      host_id: user.id
    }))

    const { data, error } = await supabase
      .from('challenges')
      .insert(challengesWithHost)
      .select()

    if (error) throw error

    console.log(`✅ Successfully inserted ${data.length} challenges!`)
    return { success: true, count: data.length }
  } catch (error: any) {
    console.error('❌ Error inserting challenges:', error.message)
    return { success: false, error: error.message }
  }
}

