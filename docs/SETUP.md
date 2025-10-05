# EliteBuilders Setup Guide

## Quick Start (5 minutes)

### 1. Install Dependencies

```bash
npm install
```

**Note**: You're currently running Node.js v14.15.5. While this might work, we recommend upgrading to Node.js 16+ for better compatibility with modern tools.

To upgrade Node.js:
- Using nvm: `nvm install 18 && nvm use 18`
- Or download from: https://nodejs.org/

### 2. Set Up Supabase

#### Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Fill in:
   - **Name**: EliteBuilders
   - **Database Password**: (choose a strong password)
   - **Region**: (choose closest to you)
4. Wait for the project to be created (~2 minutes)

#### Get Your API Keys

1. In your Supabase project dashboard, click on the **Settings** icon (gear) in the sidebar
2. Go to **API** section
3. Copy these two values:
   - **Project URL** (under "Project URL")
   - **anon public** key (under "Project API keys")

#### Configure Environment Variables

1. Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and add your Supabase credentials:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### 3. Set Up Database Tables

1. In your Supabase dashboard, click on the **SQL Editor** icon in the sidebar
2. Click **New Query**
3. Copy and paste this SQL:

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

4. Click **Run** (or press Cmd/Ctrl + Enter)
5. You should see "Success. No rows returned" - this is good!

### 4. Start the Development Server

```bash
npm run dev
```

The app should now be running at `http://localhost:3000`

## Testing the App

### Test User Registration

1. Open `http://localhost:3000`
2. Click "Join as Builder" or "Post Challenge"
3. Create an account with:
   - Email: test@example.com
   - Password: password123
   - User type: Builder or Host
4. You should be redirected to the appropriate dashboard

### Verify in Supabase

1. Go to your Supabase dashboard
2. Click **Authentication** in the sidebar
3. You should see your test user listed
4. Click **Table Editor** → **profiles**
5. You should see the profile record created

## Troubleshooting

### "Missing Supabase environment variables"

- Make sure you created the `.env` file
- Check that the variable names are exactly: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Restart the dev server after creating/editing `.env`

### "Failed to create account"

- Check the browser console for errors
- Verify the SQL was run successfully in Supabase
- Make sure Row Level Security policies are created
- Check that the `profiles` table exists

### Node.js Version Issues

If you see syntax errors during `npm install`:
- Upgrade to Node.js 16 or higher
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

### Port 3000 Already in Use

If port 3000 is busy, you can change it in `vite.config.ts`:
```typescript
server: {
  port: 3001, // or any other port
},
```

## Next Steps

Now that your foundation is set up, you can:

1. **Create challenges** (Host dashboard)
2. **Browse challenges** (Builder dashboard)
3. **Submit projects** (Builder dashboard)
4. **Implement LLM scoring**
5. **Build leaderboards**

Check the main README.md for the full feature roadmap!

## Need Help?

- Check Supabase docs: https://supabase.com/docs
- React Router docs: https://reactrouter.com/
- Tailwind CSS docs: https://tailwindcss.com/docs

