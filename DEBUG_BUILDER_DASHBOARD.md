# 🔍 Debug Builder Dashboard - Troubleshooting Guide

## Issue: Can't see anything on `/builder/dashboard`

---

## 🧪 **Quick Checks**

### **1. Are you logged in?**

**Check:**
- Open browser console (F12)
- Go to Application tab → Local Storage
- Look for `supabase.auth.token`
- Should have a value

**If not logged in:**
```bash
# Sign in again
http://localhost:3000/login
```

---

### **2. Are you logged in as a BUILDER?**

**Check:**
- Open browser console (F12)
- Run this in console:
```javascript
// Check your role
fetch('https://YOUR_SUPABASE_URL/rest/v1/profiles?id=eq.YOUR_USER_ID', {
  headers: {
    'apikey': 'YOUR_SUPABASE_ANON_KEY',
    'Authorization': 'Bearer YOUR_TOKEN'
  }
}).then(r => r.json()).then(console.log)
```

**Or simpler:**
- Sign out
- Sign up as a builder: http://localhost:3000/signup?type=builder
- Try again

---

### **3. Is the page actually blank or just dark?**

**Try:**
- Select all text on the page (Cmd+A or Ctrl+A)
- If text appears highlighted, the page is rendering but colors might be wrong
- Check browser console for errors

---

### **4. Check browser console for errors**

**Look for:**
- ❌ Red error messages
- ⚠️ Yellow warnings
- Network errors (401, 403, 500)

**Common errors:**
- "Cannot read property of undefined" → Data not loading
- "401 Unauthorized" → Not logged in
- "403 Forbidden" → Wrong permissions
- "Network error" → Supabase connection issue

---

## 🔧 **Solutions**

### **Solution 1: Clear Cache and Reload**

```bash
# Hard refresh
Cmd+Shift+R (Mac)
Ctrl+Shift+R (Windows/Linux)

# Or clear all
1. Open DevTools (F12)
2. Right-click refresh button
3. Click "Empty Cache and Hard Reload"
```

---

### **Solution 2: Check if Dev Server is Running**

```bash
# In terminal, check if you see:
VITE v5.x.x  ready in xxx ms
➜  Local:   http://localhost:3000/

# If not, restart:
npm run dev
```

---

### **Solution 3: Sign Out and Sign In Again**

```bash
# 1. Go to builder dashboard
http://localhost:3000/builder/dashboard

# 2. Click "Sign Out" (top right)

# 3. Sign in again
http://localhost:3000/login

# 4. Use BUILDER credentials
# (or sign up as builder if you don't have one)
```

---

### **Solution 4: Create a New Builder Account**

```bash
# 1. Go to signup
http://localhost:3000/signup?type=builder

# 2. Fill in:
# - Email: builder@test.com
# - GitHub Username: testbuilder
# - Password: password123

# 3. Submit

# 4. Should redirect to builder dashboard
```

---

### **Solution 5: Check Supabase Connection**

**In browser console:**
```javascript
// Test Supabase connection
import { supabase } from './src/lib/supabase'

supabase.from('challenges').select('*').limit(1)
  .then(result => console.log('Supabase works:', result))
  .catch(err => console.error('Supabase error:', err))
```

---

### **Solution 6: Verify .env File**

**Check `.env` file has:**
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

**If missing or wrong:**
1. Update `.env`
2. Restart dev server: `npm run dev`

---

## 🎯 **Expected Behavior**

### **What you SHOULD see:**

```
┌─────────────────────────────────────────┐
│ 🔷 EliteBuilders  Builder Dashboard    │
│                    user@email.com  [⎋] │
├─────────────────────────────────────────┤
│                                         │
│  Welcome back, Builder! 🚀              │
│  Ready to ship something amazing?       │
│                                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐│
│  │Active    │ │Submis-   │ │Best      ││
│  │Challenges│ │sions     │ │Rank      ││
│  │    0     │ │    0     │ │   --     ││
│  └──────────┘ └──────────┘ └──────────┘│
│                                         │
│  Available Challenges    [View All →]   │
│  ┌─────────────────────────────────┐   │
│  │ Challenge Title      🟢 Active   │   │
│  │ Description...                   │   │
│  │ ⏱ 1w  📅 Jan 1                  │   │
│  └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

### **What you might be seeing:**

1. **Completely blank page** → Not logged in or auth error
2. **Dark page with no text** → CSS not loading
3. **"Loading..." forever** → Supabase connection issue
4. **Redirect to login** → Not authenticated
5. **Error message** → Check console for details

---

## 📋 **Step-by-Step Debug Process**

### **Step 1: Verify Login**
```bash
1. Go to http://localhost:3000/login
2. Sign in with builder credentials
3. Should redirect to /builder/dashboard
```

### **Step 2: Check Console**
```bash
1. Press F12 (open DevTools)
2. Click "Console" tab
3. Look for errors (red text)
4. Screenshot and share if you see errors
```

### **Step 3: Check Network**
```bash
1. In DevTools, click "Network" tab
2. Refresh page
3. Look for failed requests (red)
4. Check if Supabase requests are 200 OK
```

### **Step 4: Check Elements**
```bash
1. In DevTools, click "Elements" tab
2. Look for <div id="root">
3. Should have content inside
4. If empty, React isn't rendering
```

### **Step 5: Test Direct Access**
```bash
# Try accessing other pages
http://localhost:3000/              # Landing
http://localhost:3000/challenges    # Challenges
http://localhost:3000/login         # Login

# If these work but builder dashboard doesn't:
# → Issue with builder dashboard specifically
```

---

## 🚨 **Common Issues & Fixes**

### **Issue: "Cannot GET /builder/dashboard"**
**Fix:** Dev server not running
```bash
npm run dev
```

### **Issue: Redirects to login immediately**
**Fix:** Not logged in
```bash
# Sign in first
http://localhost:3000/login
```

### **Issue: Blank white page**
**Fix:** JavaScript error
```bash
# Check console for errors
# Look for red error messages
```

### **Issue: Dark page, no content**
**Fix:** CSS not loading or wrong colors
```bash
# Hard refresh
Cmd+Shift+R
```

### **Issue: "Loading..." forever**
**Fix:** Supabase connection issue
```bash
# Check .env file
# Verify Supabase credentials
# Check network tab for failed requests
```

---

## 💡 **Quick Test**

**Run this in browser console:**
```javascript
// Test if page is rendering
console.log('Root:', document.getElementById('root'))
console.log('Body:', document.body.innerHTML.length)

// Test if React is loaded
console.log('React:', typeof React !== 'undefined')

// Test if you're logged in
console.log('LocalStorage:', Object.keys(localStorage))
```

**Expected output:**
```
Root: <div id="root">...</div>
Body: (large number, like 5000+)
React: true (or object)
LocalStorage: ["supabase.auth.token", ...]
```

---

## 📞 **Still Not Working?**

**Share these details:**

1. **What you see:**
   - Blank page?
   - Error message?
   - Redirect?

2. **Browser console errors:**
   - Screenshot of console
   - Any red error messages

3. **Network tab:**
   - Any failed requests?
   - Status codes (401, 403, 500)?

4. **Steps you tried:**
   - Cleared cache?
   - Signed in again?
   - Restarted server?

---

## ✅ **Quick Fix Checklist**

- [ ] Dev server is running (`npm run dev`)
- [ ] Signed in as a builder
- [ ] No console errors
- [ ] Hard refreshed page (Cmd+Shift+R)
- [ ] `.env` file has correct Supabase credentials
- [ ] Supabase project is active
- [ ] Browser is modern (Chrome, Firefox, Safari, Edge)
- [ ] JavaScript is enabled
- [ ] No ad blockers interfering

---

**Try these steps and let me know what you see!** 🔍

