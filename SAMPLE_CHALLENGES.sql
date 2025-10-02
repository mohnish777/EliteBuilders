-- Sample Challenges for EliteBuilders
-- Run this SQL in Supabase SQL Editor to create example challenges
-- Make sure to replace 'YOUR_HOST_USER_ID' with an actual host user ID from your profiles table

-- First, let's get a host user ID (you'll need to replace this with your actual host ID)
-- You can find this by running: SELECT id FROM profiles WHERE role = 'host' LIMIT 1;

-- Example Challenge 1: Real-Time Chat App
INSERT INTO public.challenges (title, description, duration_hours, host_id, status) VALUES (
  'Build a Real-Time Chat App with AI',
  'Create a real-time chat application with AI-powered features.

Requirements:
• Real-time messaging using WebSockets or similar technology
• User authentication and presence indicators
• AI-powered message suggestions or auto-complete
• Message history and search functionality
• Clean, modern UI with dark mode support

Tech Stack Suggestions:
• Frontend: React, Vue, or Svelte
• Backend: Node.js, Supabase, or Firebase
• AI: OpenAI API, Anthropic Claude, or similar

Evaluation Criteria:
• Code quality and organization (30%)
• Feature completeness (30%)
• UI/UX design (20%)
• AI integration creativity (20%)

Bonus Points:
• Typing indicators
• File/image sharing
• Emoji reactions
• Voice messages',
  168, -- 1 week
  'YOUR_HOST_USER_ID',
  'active'
);

-- Example Challenge 2: AI Code Review Tool
INSERT INTO public.challenges (title, description, duration_hours, host_id, status) VALUES (
  'AI-Powered Code Review Assistant',
  'Build a tool that uses AI to review code and provide actionable feedback.

Requirements:
• GitHub repository integration
• AI-powered code analysis (bugs, security, best practices)
• Generate detailed review comments
• Support for at least 3 programming languages
• Web-based interface

Tech Stack Suggestions:
• Frontend: React + TypeScript
• Backend: Python (FastAPI) or Node.js
• AI: OpenAI GPT-4, Claude, or Gemini
• Integration: GitHub API

Evaluation Criteria:
• Accuracy of code analysis (35%)
• Quality of feedback (25%)
• User experience (20%)
• Code quality (20%)

Bonus Points:
• Support for pull request comments
• Custom rule configuration
• Performance optimization suggestions
• Security vulnerability detection',
  336, -- 2 weeks
  'YOUR_HOST_USER_ID',
  'active'
);

-- Example Challenge 3: Quick Weekend Hack
INSERT INTO public.challenges (title, description, duration_hours, host_id, status) VALUES (
  'AI Meme Generator - Weekend Sprint',
  'Create an AI-powered meme generator that creates funny, relevant memes.

Requirements:
• Text-to-image generation or template-based memes
• AI-generated captions based on user input
• Gallery of generated memes
• Share functionality (download or social media)
• Mobile-responsive design

Tech Stack Suggestions:
• Frontend: Any modern framework
• AI: DALL-E, Stable Diffusion, or meme templates + GPT
• Hosting: Vercel, Netlify, or similar

Evaluation Criteria:
• Creativity and humor (40%)
• User experience (30%)
• Technical implementation (30%)

Bonus Points:
• Trending topic integration
• Meme template variety
• Social media sharing
• User voting/favorites',
  48, -- 2 days
  'YOUR_HOST_USER_ID',
  'active'
);

-- Example Challenge 4: Productivity Tool
INSERT INTO public.challenges (title, description, duration_hours, host_id, status) VALUES (
  'AI Task Manager with Smart Scheduling',
  'Build a task management app that uses AI to optimize your schedule.

Requirements:
• Task creation, editing, and deletion (CRUD)
• AI-powered task prioritization
• Smart scheduling suggestions based on deadlines and importance
• Calendar integration
• Progress tracking and analytics

Tech Stack Suggestions:
• Frontend: React, Next.js, or similar
• Backend: Supabase, Firebase, or custom API
• AI: OpenAI API for task analysis
• Calendar: Google Calendar API (optional)

Evaluation Criteria:
• AI scheduling intelligence (35%)
• Feature completeness (30%)
• UI/UX design (20%)
• Code quality (15%)

Bonus Points:
• Natural language task input
• Recurring tasks
• Team collaboration features
• Mobile app (React Native/Flutter)',
  240, -- 10 days
  'YOUR_HOST_USER_ID',
  'active'
);

-- Example Challenge 5: Data Visualization
INSERT INTO public.challenges (title, description, duration_hours, host_id, status) VALUES (
  'Interactive Data Dashboard Builder',
  'Create a no-code dashboard builder for visualizing data.

Requirements:
• Drag-and-drop dashboard builder
• Multiple chart types (line, bar, pie, etc.)
• Data source integration (CSV, API, database)
• Real-time data updates
• Export/share dashboards

Tech Stack Suggestions:
• Frontend: React + D3.js or Chart.js
• Backend: Node.js or Python
• Database: PostgreSQL or MongoDB
• Deployment: Any cloud platform

Evaluation Criteria:
• Ease of use (30%)
• Visualization quality (25%)
• Feature completeness (25%)
• Performance (20%)

Bonus Points:
• AI-powered chart recommendations
• Collaborative editing
• Custom themes
• Mobile responsive',
  168, -- 1 week
  'YOUR_HOST_USER_ID',
  'active'
);

-- Example Challenge 6: Quick 24-Hour Challenge
INSERT INTO public.challenges (title, description, duration_hours, host_id, status) VALUES (
  'AI Recipe Generator - 24 Hour Sprint',
  'Build an AI app that generates recipes based on available ingredients.

Requirements:
• Input ingredients you have
• AI generates creative recipes
• Display cooking instructions
• Nutritional information (optional)
• Save favorite recipes

Tech Stack Suggestions:
• Frontend: Any framework
• AI: OpenAI GPT-4 or Claude
• Database: Any (for favorites)

Evaluation Criteria:
• Recipe quality and creativity (40%)
• User experience (35%)
• Speed and functionality (25%)

Bonus Points:
• Dietary restrictions support
• Recipe images (AI-generated)
• Shopping list generation
• Cooking time estimates',
  24, -- 24 hours
  'YOUR_HOST_USER_ID',
  'active'
);

-- Instructions to use this file:
-- 1. Sign up as a HOST in your EliteBuilders app
-- 2. Go to Supabase → Table Editor → profiles
-- 3. Find your host user's ID (copy it)
-- 4. Replace 'YOUR_HOST_USER_ID' in this file with your actual ID
-- 5. Run this SQL in Supabase SQL Editor
-- 6. Refresh your app to see the challenges!

-- Example: If your host ID is '123e4567-e89b-12d3-a456-426614174000', replace like this:
-- 'YOUR_HOST_USER_ID' → '123e4567-e89b-12d3-a456-426614174000'

