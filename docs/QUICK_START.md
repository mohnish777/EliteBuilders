# EliteBuilders - Quick Start Guide

## 🚀 Get Running in 5 Minutes

### Step 1: Install Dependencies (if not done)
```bash
npm install
```

### Step 2: Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create an account
2. Click "New Project"
3. Fill in project details and wait ~2 minutes for setup
4. Go to **Settings** → **API**
5. Copy your **Project URL** and **anon public** key

### Step 3: Configure Environment

1. Open the `.env` file in the root directory
2. Replace the placeholder values:
   ```
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### Step 4: Set Up Database

1. In Supabase dashboard, click **SQL Editor**
2. Click **New Query**
3. Copy the SQL from `SETUP.md` (lines 47-135)
4. Paste and click **Run**
5. You should see "Success. No rows returned"

### Step 5: Start the App

```bash
npm run dev
```

The app will open at `http://localhost:3000`

### Step 6: Test It Out

1. Click "Join as Builder"
2. Create an account:
   - Email: test@example.com
   - Password: password123
3. You should be redirected to the Builder Dashboard!

---

## 📝 Common Commands

### Development
```bash
# Start dev server (with hot reload)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

### Supabase (if you install Supabase CLI)
```bash
# Login to Supabase
npx supabase login

# Link to your project
npx supabase link --project-ref your-project-ref

# Pull database schema
npx supabase db pull

# Generate TypeScript types
npx supabase gen types typescript --local > src/types/supabase.ts
```

---

## 🗂️ File Structure Quick Reference

```
src/
├── components/       # Reusable UI components
├── contexts/         # React Context (Auth, etc.)
├── lib/             # Utilities (Supabase client, etc.)
├── pages/           # Page components (routes)
├── types/           # TypeScript type definitions
├── App.tsx          # Main app with routing
├── main.tsx         # Entry point
└── index.css        # Global styles + Tailwind
```

---

## 🎨 Adding a New Page

1. **Create the page component**:
   ```tsx
   // src/pages/NewPage.tsx
   export default function NewPage() {
     return (
       <div className="min-h-screen bg-dark-900">
         <h1 className="text-white">New Page</h1>
       </div>
     )
   }
   ```

2. **Add route in App.tsx**:
   ```tsx
   import NewPage from './pages/NewPage'
   
   // In the Routes component:
   <Route path="/new" element={<NewPage />} />
   ```

3. **Link to it**:
   ```tsx
   import { Link } from 'react-router-dom'
   
   <Link to="/new">Go to New Page</Link>
   ```

---

## 🎨 Using Tailwind Classes

### Common Patterns

**Container**:
```tsx
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  {/* Content */}
</div>
```

**Card**:
```tsx
<div className="card">
  {/* Uses custom .card class from index.css */}
</div>
```

**Button**:
```tsx
<button className="btn-primary">
  Click Me
</button>
```

**Grid**:
```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>
```

---

## 🔐 Using Auth Context

```tsx
import { useAuth } from '../contexts/AuthContext'

function MyComponent() {
  const { user, signOut } = useAuth()
  
  return (
    <div>
      <p>Logged in as: {user?.email}</p>
      <button onClick={signOut}>Sign Out</button>
    </div>
  )
}
```

---

## 💾 Supabase Database Queries

### Fetch Data
```tsx
import { supabase } from '../lib/supabase'

// Get all challenges
const { data, error } = await supabase
  .from('challenges')
  .select('*')
  .eq('status', 'active')

// Get single challenge
const { data, error } = await supabase
  .from('challenges')
  .select('*')
  .eq('id', challengeId)
  .single()
```

### Insert Data
```tsx
const { data, error } = await supabase
  .from('challenges')
  .insert([
    {
      title: 'Build a Todo App',
      description: 'Create a full-stack todo app',
      host_id: user.id,
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active'
    }
  ])
```

### Update Data
```tsx
const { data, error } = await supabase
  .from('challenges')
  .update({ status: 'completed' })
  .eq('id', challengeId)
```

### Delete Data
```tsx
const { data, error } = await supabase
  .from('challenges')
  .delete()
  .eq('id', challengeId)
```

---

## 🎯 Icons (Lucide React)

```tsx
import { Trophy, Code2, Users, Zap } from 'lucide-react'

<Trophy className="h-6 w-6 text-primary-500" />
<Code2 className="h-8 w-8 text-white" />
```

Browse all icons: https://lucide.dev/icons/

---

## 🐛 Troubleshooting

### "Missing Supabase environment variables"
- Check `.env` file exists
- Restart dev server: `Ctrl+C` then `npm run dev`

### "Failed to create account"
- Check Supabase SQL was run correctly
- Check `profiles` table exists in Supabase dashboard
- Check RLS policies are enabled

### Port 3000 already in use
- Kill the process: `lsof -ti:3000 | xargs kill -9`
- Or change port in `vite.config.ts`

### TypeScript errors
- Restart VS Code
- Run: `npm run build` to see all errors

---

## 📚 Learn More

- **Full Setup Guide**: See `SETUP.md`
- **Project Summary**: See `PROJECT_SUMMARY.md`
- **Main README**: See `README.md`

---

## 🎉 You're All Set!

Start building features and ship fast! 🚀

