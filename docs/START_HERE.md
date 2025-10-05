# 🚀 START HERE - EliteBuilders Setup

Welcome to EliteBuilders! This guide will get you from zero to running in **5 minutes**.

## 📋 What You Have

A complete React + TypeScript + Vite application with:
- ✅ Authentication system (Supabase)
- ✅ Protected routes
- ✅ Landing page
- ✅ Builder & Host dashboards
- ✅ Mobile-responsive design
- ✅ Professional UI with Tailwind CSS

## 🎯 Quick Setup (5 Minutes)

### 1. Dependencies (Already Done ✅)
The `npm install` has already been run. You have 296 packages installed.

### 2. Create Supabase Account (2 minutes)

1. Go to **https://supabase.com**
2. Click **"Start your project"**
3. Sign up with GitHub (fastest) or email
4. Click **"New Project"**
5. Fill in:
   - **Name**: EliteBuilders
   - **Database Password**: (create a strong password - save it!)
   - **Region**: Choose closest to you
6. Click **"Create new project"**
7. Wait ~2 minutes for setup ☕

### 3. Get Your API Keys (30 seconds)

1. In your Supabase project dashboard
2. Click the **⚙️ Settings** icon (bottom left)
3. Click **"API"** in the sidebar
4. You'll see two important values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)
5. Keep this tab open!

### 4. Configure Your App (30 seconds)

1. Open the `.env` file in this project
2. Replace the placeholder values with your actual keys:
   ```
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
3. Save the file

### 5. Set Up Database (1 minute)

1. In Supabase dashboard, click **🗄️ SQL Editor** (left sidebar)
2. Click **"New Query"**
3. Open `SETUP.md` in this project
4. Copy the SQL code (lines 47-135)
5. Paste into Supabase SQL Editor
6. Click **"Run"** (or press Cmd/Ctrl + Enter)
7. You should see: **"Success. No rows returned"** ✅

### 6. Start the App (30 seconds)

```bash
npm run dev
```

The app will start at **http://localhost:3000**

### 7. Test It! (1 minute)

1. Browser should open automatically to `http://localhost:3000`
2. Click **"Join as Builder"**
3. Create a test account:
   - Email: `test@example.com`
   - Password: `password123`
   - Select: **Builder**
4. Click **"Create Account"**
5. You should see the Builder Dashboard! 🎉

---

## ✅ Success Checklist

- [ ] Supabase project created
- [ ] API keys copied to `.env`
- [ ] SQL executed successfully
- [ ] `npm run dev` running
- [ ] Can create an account
- [ ] Can see dashboard

If all checked, **you're ready to build!** 🚀

---

## 📚 Documentation Guide

We've created comprehensive docs for you:

### For Getting Started
- **START_HERE.md** ← You are here!
- **QUICK_START.md** - Common commands and patterns
- **SETUP.md** - Detailed setup instructions

### For Understanding the Project
- **README.md** - Project overview and features
- **PROJECT_SUMMARY.md** - What's built and what's next
- **ARCHITECTURE.md** - Technical architecture

### For Development
- **QUICK_START.md** - Code snippets and examples
- **src/types/index.ts** - TypeScript types
- **tailwind.config.js** - Design system colors

---

## 🎨 What to Build Next

### Immediate Next Steps (Today)

1. **Create Challenge Form** (Host Dashboard)
   - Add a "Create Challenge" button
   - Build a form with title, description, dates
   - Save to Supabase `challenges` table

2. **List Challenges** (Builder Dashboard)
   - Fetch challenges from Supabase
   - Display in a grid
   - Add "Join Challenge" button

3. **Challenge Detail Page**
   - Show full challenge info
   - Display participants
   - Show submission form

### This Week

4. **Submission System**
   - Form for GitHub URL + demo video
   - Save to `submissions` table
   - Display user's submissions

5. **Basic Leaderboard**
   - Fetch submissions for a challenge
   - Sort by score (manual for now)
   - Display in a table

### Next Week

6. **LLM Scoring Integration**
   - Set up OpenAI/Claude API
   - Create scoring function
   - Auto-score submissions

---

## 💡 Pro Tips

### Development Workflow

1. **Always check Supabase first**
   - Use the Table Editor to see your data
   - Test queries in SQL Editor
   - Check Auth tab for users

2. **Use the browser console**
   - Check for errors (F12)
   - Use React DevTools
   - Monitor network requests

3. **Hot reload is your friend**
   - Save files and see changes instantly
   - No need to refresh browser
   - If stuck, restart dev server

### Common Patterns

**Fetch data on component mount:**
```tsx
useEffect(() => {
  async function fetchData() {
    const { data } = await supabase
      .from('challenges')
      .select('*')
    setData(data)
  }
  fetchData()
}, [])
```

**Handle form submission:**
```tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  const { error } = await supabase
    .from('challenges')
    .insert([{ title, description }])
  if (error) console.error(error)
}
```

**Protected action (requires auth):**
```tsx
const { user } = useAuth()
if (!user) return <Navigate to="/login" />
```

---

## 🐛 Troubleshooting

### App won't start
```bash
# Kill any process on port 3000
lsof -ti:3000 | xargs kill -9

# Restart
npm run dev
```

### "Missing Supabase environment variables"
- Check `.env` file exists
- Check values are correct (no quotes needed)
- Restart dev server

### Can't create account
- Check Supabase SQL was executed
- Check `profiles` table exists in Supabase
- Check browser console for errors

### Changes not showing
- Hard refresh: Cmd/Ctrl + Shift + R
- Clear browser cache
- Restart dev server

---

## 🎯 Your Mission

Build a working prototype where:
1. ✅ Hosts can create challenges
2. ✅ Builders can browse challenges
3. ✅ Builders can submit projects
4. ✅ Submissions appear on leaderboard
5. ✅ Basic scoring works

**Timeline**: 6 hours for hackathon version, 15 days for full product

---

## 🆘 Need Help?

### Resources
- **Supabase Docs**: https://supabase.com/docs
- **React Docs**: https://react.dev
- **Tailwind Docs**: https://tailwindcss.com/docs
- **TypeScript Docs**: https://www.typescriptlang.org/docs

### Check These Files
- `QUICK_START.md` - Code examples
- `ARCHITECTURE.md` - How it all works
- `src/contexts/AuthContext.tsx` - Auth examples
- `src/pages/LandingPage.tsx` - UI examples

---

## 🎉 You're Ready!

Everything is set up. The foundation is solid. Now go build something amazing!

**Next Action**: Open `QUICK_START.md` and start building your first feature.

Happy coding! 🚀

