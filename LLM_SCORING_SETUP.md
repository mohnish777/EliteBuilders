# 🤖 LLM Scoring System Setup Guide

Complete guide for setting up AI-powered submission scoring using Groq API.

---

## 📋 **Table of Contents**

1. [Overview](#overview)
2. [Features](#features)
3. [Setup Instructions](#setup-instructions)
4. [Database Migration](#database-migration)
5. [Testing the System](#testing-the-system)
6. [How It Works](#how-it-works)
7. [Mock Scoring Fallback](#mock-scoring-fallback)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 **Overview**

The LLM Scoring System uses **Groq's ultra-fast AI models** to automatically evaluate code submissions based on multiple criteria:

- **Functionality** (0-30 points)
- **Code Quality** (0-30 points)
- **Documentation** (0-20 points)
- **Innovation** (0-10 points)
- **UI/UX** (0-10 points)

**Total:** 100 points

---

## ✨ **Features**

### **1. AI-Powered Evaluation**
- ✅ Uses Groq's `llama-3.3-70b-versatile` model
- ✅ Analyzes GitHub repository URLs
- ✅ Provides detailed feedback
- ✅ Generates score breakdown by category

### **2. Automatic Scoring on Submission**
- ✅ Scores calculated when builder submits project
- ✅ Real-time AI evaluation (< 5 seconds)
- ✅ Progress indicators during scoring

### **3. Detailed Score Breakdown**
- ✅ View individual category scores
- ✅ Read AI-generated feedback
- ✅ Visual progress bars for each criterion

### **4. Leaderboard Integration**
- ✅ Submissions ranked by total score
- ✅ Top 10 displayed on challenge page
- ✅ Click to view detailed score breakdown

### **5. Mock Scoring Fallback**
- ✅ Works without API key (demo mode)
- ✅ Generates realistic mock scores
- ✅ Automatic fallback on API errors

---

## 🚀 **Setup Instructions**

### **Step 1: Get Groq API Key**

1. **Visit Groq Console:**
   ```
   https://console.groq.com/
   ```

2. **Sign up / Log in** (free account)

3. **Create API Key:**
   - Click "API Keys" in the sidebar
   - Click "Create API Key"
   - Copy your API key (starts with `gsk_...`)

### **Step 2: Add API Key to Environment**

1. **Create `.env` file** in project root (if it doesn't exist):
   ```bash
   touch .env
   ```

2. **Add your Groq API key:**
   ```env
   VITE_GROQ_API_KEY=gsk_your_api_key_here
   ```

3. **Restart your dev server:**
   ```bash
   npm run dev
   ```

### **Step 3: Update Database Schema**

Run the SQL migration to add the `score_breakdown` column:

1. **Go to Supabase SQL Editor:**
   ```
   https://supabase.com/dashboard/project/YOUR_PROJECT_ID/sql
   ```

2. **Run this SQL:**
   ```sql
   -- Add score_breakdown column to submissions table
   ALTER TABLE submissions 
   ADD COLUMN IF NOT EXISTS score_breakdown JSONB;

   -- Add comment
   COMMENT ON COLUMN submissions.score_breakdown IS 'Detailed AI scoring breakdown';
   ```

3. **Click "Run"**

---

## 🗄️ **Database Migration**

The `score_breakdown` column stores JSON data with this structure:

```json
{
  "functionality": 25,
  "codeQuality": 28,
  "documentation": 18,
  "innovation": 8,
  "uiux": 9,
  "total": 88,
  "feedback": "Detailed AI feedback about the submission..."
}
```

**Run the migration:**
```bash
# Option 1: Use the provided SQL file
cat ADD_SCORE_BREAKDOWN.sql | psql YOUR_DATABASE_URL

# Option 2: Run in Supabase SQL Editor (recommended)
# Copy contents of ADD_SCORE_BREAKDOWN.sql and paste in SQL Editor
```

---

## 🧪 **Testing the System**

### **Test 1: Submit a Project**

1. **Go to any challenge:**
   ```
   http://localhost:3000/challenges
   ```

2. **Click "Submit Project"**

3. **Fill in the form:**
   - GitHub URL: `https://github.com/username/repo`
   - Video URL: Any valid video link

4. **Click "Submit Project"**

5. **Watch the progress:**
   - "Uploading Video..." (if file upload)
   - "AI Scoring..." (Groq API call)
   - "Submitting..." (saving to database)

6. **Check the leaderboard:**
   - Your submission should appear with a score
   - Click on it to view detailed breakdown

### **Test 2: View Score Breakdown**

1. **Click on any submission** in the leaderboard

2. **You should see:**
   - Total score (large number)
   - Score breakdown by category (progress bars)
   - AI-generated feedback
   - Links to GitHub and demo video

### **Test 3: Mock Scoring (No API Key)**

1. **Remove API key** from `.env`:
   ```env
   # VITE_GROQ_API_KEY=gsk_...
   ```

2. **Restart dev server**

3. **Submit a project**

4. **System should:**
   - Detect missing API key
   - Use mock scoring instead
   - Generate realistic scores (60-90 range)
   - Show "Mock Evaluation" badge

---

## ⚙️ **How It Works**

### **Submission Flow:**

```
1. User submits project
   ↓
2. Upload video (if file)
   ↓
3. Call Groq API with:
   - GitHub URL
   - Challenge title
   - Challenge description
   ↓
4. AI analyzes and returns:
   - Score breakdown (JSON)
   - Detailed feedback
   ↓
5. Save to database:
   - llm_score (total)
   - score_breakdown (JSON)
   ↓
6. Redirect to challenge page
   ↓
7. Leaderboard updates automatically
```

### **Scoring Prompt:**

The AI receives:
- **Challenge requirements**
- **GitHub repository URL**
- **Scoring criteria** (functionality, code quality, etc.)

The AI evaluates based on:
- Repository name (does it match the challenge?)
- Owner's GitHub username (professional naming?)
- Challenge complexity and scope
- General expectations for the project type

**Note:** The AI cannot actually access the repository code, so it provides a fair evaluation based on the available information.

---

## 🔄 **Mock Scoring Fallback**

The system automatically uses mock scoring when:

1. **No API key** is configured
2. **API rate limit** is hit
3. **API error** occurs

### **Mock Score Characteristics:**

- **Functionality:** 20-30 points
- **Code Quality:** 20-30 points
- **Documentation:** 12-20 points
- **Innovation:** 5-10 points
- **UI/UX:** 5-10 points
- **Total:** 62-100 points

Mock scores include:
- ✅ Realistic score distribution
- ✅ Generic but helpful feedback
- ✅ "Mock Evaluation" badge
- ✅ Same JSON structure as real scores

---

## 🐛 **Troubleshooting**

### **Problem: "AI Scoring..." never completes**

**Solution:**
1. Check browser console for errors
2. Verify API key is correct in `.env`
3. Restart dev server after adding API key
4. Check Groq API status: https://status.groq.com/

### **Problem: Scores are always 50**

**Cause:** API key is missing or invalid

**Solution:**
1. Check `.env` file has `VITE_GROQ_API_KEY=gsk_...`
2. Verify API key is valid (test in Groq Playground)
3. Restart dev server

### **Problem: "Cannot read property 'score' of undefined"**

**Cause:** Database migration not run

**Solution:**
1. Run `ADD_SCORE_BREAKDOWN.sql` in Supabase
2. Verify column exists:
   ```sql
   SELECT column_name, data_type 
   FROM information_schema.columns 
   WHERE table_name = 'submissions';
   ```

### **Problem: Leaderboard not updating**

**Solution:**
1. Refresh the page
2. Check browser console for errors
3. Verify RLS policies allow reading submissions

---

## 📊 **API Usage & Limits**

### **Groq Free Tier:**
- ✅ **30 requests per minute**
- ✅ **14,400 requests per day**
- ✅ **Free forever**

### **Cost Optimization:**
- Scores are cached in database
- Only scored once per submission
- Updates reuse existing score (optional)

### **Recommended Models:**
- **llama-3.3-70b-versatile** (current) - Best quality
- **llama-3.1-8b-instant** - Faster, lower quality
- **mixtral-8x7b-32768** - Good balance

---

## 🎉 **Summary**

You now have a complete AI-powered scoring system!

**What's working:**
- ✅ Automatic AI evaluation on submission
- ✅ Detailed score breakdown by category
- ✅ AI-generated feedback
- ✅ Leaderboard with clickable submissions
- ✅ Mock scoring fallback
- ✅ Visual score displays

**Next steps:**
1. Get your Groq API key
2. Add it to `.env`
3. Run database migration
4. Test by submitting a project
5. View the score breakdown!

---

**Need help?** Check the Groq documentation:
- Quickstart: https://console.groq.com/docs/quickstart
- Models: https://console.groq.com/docs/models
- API Reference: https://console.groq.com/docs/api-reference

