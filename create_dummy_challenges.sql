-- First, let's get the host user ID
-- Run this query first to get your host ID:
-- SELECT id, role, company_name FROM profiles WHERE role = 'host' LIMIT 1;

-- Then replace 'YOUR_HOST_ID_HERE' below with the actual ID

-- Challenge 1: Real-Time Chat App
INSERT INTO public.challenges (title, description, duration_hours, host_id, status) VALUES (
  'Build a Real-Time Chat App with AI',
  'Create a real-time chat application with AI-powered features like message suggestions, smart replies, and sentiment analysis. Must include user authentication, presence indicators, and message history.

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
• Voice messages',
  168, -- 1 week
  'YOUR_HOST_ID_HERE',
  'active'
);

-- Challenge 2: AI Code Review Tool
INSERT INTO public.challenges (title, description, duration_hours, host_id, status) VALUES (
  'AI-Powered Code Review Assistant',
  'Build a tool that uses AI to review code and provide actionable feedback on bugs, security issues, and best practices.

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
• Code quality (20%)',
  336, -- 2 weeks
  'YOUR_HOST_ID_HERE',
  'active'
);

-- Challenge 3: Weekend Meme Generator
INSERT INTO public.challenges (title, description, duration_hours, host_id, status) VALUES (
  'AI Meme Generator - Weekend Sprint',
  'Create an AI-powered meme generator that creates funny, relevant memes based on trending topics or user input.

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
• User voting/favorites system',
  48, -- 2 days
  'YOUR_HOST_ID_HERE',
  'active'
);

-- Challenge 4: Smart Task Manager
INSERT INTO public.challenges (title, description, duration_hours, host_id, status) VALUES (
  'AI Task Manager with Smart Scheduling',
  'Build a task management app that uses AI to optimize your schedule and prioritize tasks intelligently.

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
• Mobile app version',
  240, -- 10 days
  'YOUR_HOST_ID_HERE',
  'active'
);

-- Challenge 5: Data Dashboard Builder
INSERT INTO public.challenges (title, description, duration_hours, host_id, status) VALUES (
  'Interactive Data Dashboard Builder',
  'Create a no-code dashboard builder that allows users to visualize data from multiple sources with drag-and-drop simplicity.

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
• Mobile responsive dashboards',
  168, -- 1 week
  'YOUR_HOST_ID_HERE',
  'active'
);

-- Challenge 6: Quick Recipe Generator
INSERT INTO public.challenges (title, description, duration_hours, host_id, status) VALUES (
  'AI Recipe Generator - 24 Hour Sprint',
  'Build an AI app that generates creative recipes based on ingredients you have at home.

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
• Cooking time estimates and difficulty levels',
  24, -- 24 hours
  'YOUR_HOST_ID_HERE',
  'active'
);

