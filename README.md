# EliteBuilders 🚀

A competition platform where AI builders submit working prototypes to company-sponsored challenges. Think LeetCode meets Product Hunt for AI developers.

## 🎯 Concept

EliteBuilders validates "vibe coding" skills - builders use AI tools like Cursor, Lovable, Supabase to rapidly create real products, not just solve algorithm puzzles.

## 👥 User Types

1. **Builders** (participants) - Submit projects to challenges
2. **Challenge Hosts** (recruiters/companies) - Create challenges, review submissions

## 🔄 Core Flow

1. Hosts create challenges (48hr-3week duration)
2. Builders browse and join challenges
3. Builders submit GitHub repo + demo video
4. LLM scores submissions automatically
5. Leaderboards show top performers
6. Hosts contact winners for job opportunities

## 🛠️ Tech Stack

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Supabase (auth, database, storage)
- **Authentication**: Email/Password + GitHub OAuth
- **Routing**: React Router v6
- **Scoring**: OpenAI/Claude API integration (coming soon)
- **Deployment**: Vercel (coming soon)

## 📁 Project Structure

```
EliteBuilders/
├── src/
│   ├── components/       # Reusable components
│   │   └── ProtectedRoute.tsx
│   ├── contexts/         # React contexts (Auth, etc.)
│   │   └── AuthContext.tsx
│   ├── lib/             # Utilities and configs
│   │   └── supabase.ts
│   ├── pages/           # Page components
│   │   ├── LandingPage.tsx
│   │   ├── Login.tsx
│   │   ├── Signup.tsx
│   │   ├── AuthCallback.tsx
│   │   ├── BuilderDashboard.tsx
│   │   └── HostDashboard.tsx
│   ├── App.tsx          # Main app component
│   ├── main.tsx         # Entry point
│   └── index.css        # Global styles
├── public/              # Static assets
├── index.html           # HTML template
└── package.json         # Dependencies
```

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ (you currently have v14.15.5 - consider upgrading)
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository** (if not already done)

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up Supabase**:
   - Create a new project at [supabase.com](https://supabase.com)
   - Copy your project URL and anon key
   - Create a `.env` file in the root directory:
     ```bash
     cp .env.example .env
     ```
   - Add your Supabase credentials to `.env`:
     ```
     VITE_SUPABASE_URL=your_supabase_url_here
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
     ```

4. **Set up Supabase Database**:

   Run this SQL in your Supabase SQL editor:

   ```sql
   -- Users table (extends Supabase auth.users)
   create table public.profiles (
     id uuid references auth.users on delete cascade primary key,
     role text check (role in ('builder', 'host')) not null,
     company_name text,
     github_username text,
     created_at timestamp default now()
   );

   -- Challenges table
   create table public.challenges (
     id uuid default gen_random_uuid() primary key,
     title text not null,
     description text not null,
     duration_hours integer not null,
     host_id uuid references public.profiles(id) not null,
     status text default 'active',
     created_at timestamp default now()
   );

   -- Submissions table
   create table public.submissions (
     id uuid default gen_random_uuid() primary key,
     challenge_id uuid references public.challenges(id) not null,
     builder_id uuid references public.profiles(id) not null,
     github_url text not null,
     demo_video_url text not null,
     llm_score integer default 0,
     created_at timestamp default now()
   );

   -- Enable Row Level Security
   alter table public.profiles enable row level security;
   alter table public.challenges enable row level security;
   alter table public.submissions enable row level security;

   -- Profiles policies
   create policy "Users can view their own profile"
     on public.profiles for select
     using (auth.uid() = id);

   create policy "Users can update their own profile"
     on public.profiles for update
     using (auth.uid() = id);

   create policy "Users can insert their own profile"
     on public.profiles for insert
     with check (auth.uid() = id);

   -- Challenges policies
   create policy "Anyone can view active challenges"
     on public.challenges for select
     using (status = 'active' or auth.uid() = host_id);

   create policy "Hosts can create challenges"
     on public.challenges for insert
     with check (auth.uid() = host_id);

   create policy "Hosts can update their own challenges"
     on public.challenges for update
     using (auth.uid() = host_id);

   -- Submissions policies
   create policy "Builders can view their own submissions"
     on public.submissions for select
     using (auth.uid() = builder_id);

   create policy "Hosts can view submissions to their challenges"
     on public.submissions for select
     using (
       exists (
         select 1 from public.challenges
         where challenges.id = submissions.challenge_id
         and challenges.host_id = auth.uid()
       )
     );

   create policy "Builders can create submissions"
     on public.submissions for insert
     with check (auth.uid() = builder_id);

   create policy "Builders can update their own submissions"
     on public.submissions for update
     using (auth.uid() = builder_id);
   ```

5. **Start the development server**:
   ```bash
   npm run dev
   ```

6. **Open your browser** and navigate to `http://localhost:3000`

## 🎨 Features Implemented

- ✅ React + TypeScript + Vite setup
- ✅ Supabase client configuration
- ✅ React Router with protected routes
- ✅ Tailwind CSS with custom theme
- ✅ Authentication (Email/Password + GitHub OAuth)
- ✅ User type selection (Builder vs Host)
- ✅ Landing page with challenge preview
- ✅ Builder dashboard with submissions
- ✅ Host dashboard with challenge management
- ✅ Challenge creation, editing, and deletion
- ✅ Challenge browsing and detail pages
- ✅ Submission system (GitHub URL + video upload)
- ✅ AI-powered scoring with Groq API
- ✅ Real GitHub repository analysis
- ✅ Leaderboard with live rankings
- ✅ Mobile-first responsive design
- ✅ Modern, developer-friendly UI
- ✅ Deployed to Vercel

## 📚 Documentation

All documentation has been organized in the **[docs/](./docs/)** directory:

- **[Quick Start Guide](./docs/START_HERE.md)** - Start here if you're new
- **[Architecture](./docs/ARCHITECTURE.md)** - System architecture overview
- **[Authentication](./docs/AUTH_IMPLEMENTATION_SUMMARY.md)** - Auth implementation
- **[Challenge Management](./docs/CHALLENGE_MANAGEMENT_GUIDE.md)** - Managing challenges
- **[Submission System](./docs/SUBMISSION_SYSTEM_GUIDE.md)** - Submission workflow
- **[AI Scoring](./docs/LLM_SCORING_IMPLEMENTATION.md)** - AI scoring system
- **[Deployment Guide](./docs/DEPLOYMENT_GUIDE.md)** - Deploy to production
- **[SQL Scripts](./docs/sql/)** - Database setup scripts

**See [docs/README.md](./docs/README.md) for complete documentation index.**

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎯 Development Notes

This is a hackathon-ready prototype focused on function over perfection. The foundation is solid and ready for rapid iteration.

## 📄 License

MIT# Trigger deployment
