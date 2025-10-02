// Script to insert dummy challenges into Supabase
// Run with: node insert_dummy_challenges.js

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

// Read .env file manually
const envFile = readFileSync('.env', 'utf-8')
const envVars = {}
envFile.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=')
  if (key && valueParts.length > 0) {
    envVars[key.trim()] = valueParts.join('=').trim()
  }
})

const supabaseUrl = envVars.VITE_SUPABASE_URL
const supabaseKey = envVars.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env file')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

const challenges = [
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

async function insertChallenges() {
  console.log('🚀 Starting to insert dummy challenges...\n')

  // First, get a host user ID
  console.log('📋 Looking for a host user...')
  const { data: profiles, error: profileError } = await supabase
    .from('profiles')
    .select('id, role, company_name')
    .eq('role', 'host')
    .limit(1)

  if (profileError) {
    console.error('❌ Error fetching host profile:', profileError.message)
    process.exit(1)
  }

  if (!profiles || profiles.length === 0) {
    console.error('❌ No host user found! Please sign up as a host first.')
    console.log('\n💡 To create a host account:')
    console.log('   1. Go to http://localhost:3000/signup?type=host')
    console.log('   2. Fill in the form and create an account')
    console.log('   3. Run this script again\n')
    process.exit(1)
  }

  const hostId = profiles[0].id
  const companyName = profiles[0].company_name || 'Unknown Company'
  console.log(`✅ Found host: ${companyName} (${hostId})\n`)

  // Insert challenges
  console.log('📝 Inserting challenges...\n')
  let successCount = 0
  let errorCount = 0

  for (const challenge of challenges) {
    const { error } = await supabase
      .from('challenges')
      .insert([{
        ...challenge,
        host_id: hostId
      }])

    if (error) {
      console.error(`❌ Failed to insert "${challenge.title}":`, error.message)
      errorCount++
    } else {
      console.log(`✅ Inserted: ${challenge.title}`)
      successCount++
    }
  }

  console.log(`\n🎉 Done!`)
  console.log(`   ✅ Successfully inserted: ${successCount} challenges`)
  if (errorCount > 0) {
    console.log(`   ❌ Failed: ${errorCount} challenges`)
  }
  console.log(`\n💡 View them at: http://localhost:3000/challenges\n`)
}

insertChallenges()

