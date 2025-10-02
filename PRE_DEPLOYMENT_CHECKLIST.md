# ✅ Pre-Deployment Checklist

Complete this checklist before deploying to production.

---

## 🔍 **1. Code Quality**

### **Build Test:**
```bash
npm run build
```
- [ ] Build completes without errors
- [ ] No TypeScript errors
- [ ] No ESLint warnings (critical ones)
- [ ] Bundle size reasonable (< 500KB gzipped)

### **Preview Test:**
```bash
npm run preview
```
- [ ] App loads at http://localhost:4173
- [ ] No console errors
- [ ] All pages accessible
- [ ] Navigation works

---

## 🗄️ **2. Database (Supabase)**

### **Tables:**
- [ ] `profiles` table exists
- [ ] `challenges` table exists
- [ ] `submissions` table exists
- [ ] `score_breakdown` column added to submissions

### **RLS Policies:**
```sql
-- Run in Supabase SQL Editor to verify:
SELECT tablename, policyname, permissive, roles, cmd 
FROM pg_policies 
WHERE schemaname = 'public';
```

- [ ] Challenges: Public read, owner write/update/delete
- [ ] Profiles: Public read, owner write/update
- [ ] Submissions: Public read, owner write

### **Storage:**
- [ ] `demo-videos` bucket exists
- [ ] Upload policy allows authenticated users
- [ ] Public access enabled for videos

### **Authentication:**
- [ ] Email/Password enabled
- [ ] GitHub OAuth configured (optional)
- [ ] Email confirmation disabled (or configured)

---

## 🔐 **3. Environment Variables**

### **Local (.env file):**
- [ ] `VITE_SUPABASE_URL` set
- [ ] `VITE_SUPABASE_ANON_KEY` set
- [ ] `VITE_GROQ_API_KEY` set (optional)

### **For Vercel (copy these values):**
```bash
# Get your values:
cat .env

# You'll need to add these in Vercel Dashboard:
# - VITE_SUPABASE_URL
# - VITE_SUPABASE_ANON_KEY
# - VITE_GROQ_API_KEY
```

---

## 🧪 **4. Feature Testing**

### **Authentication:**
- [ ] Signup as Builder works
- [ ] Signup as Host works
- [ ] Login works
- [ ] Logout works
- [ ] GitHub OAuth works (if enabled)
- [ ] Protected routes redirect to login

### **Builder Features:**
- [ ] View challenges list
- [ ] View challenge details
- [ ] Submit to challenge
- [ ] Upload video (or paste URL)
- [ ] AI scoring works
- [ ] View submission details
- [ ] See leaderboard
- [ ] See own submissions in dashboard

### **Host Features:**
- [ ] Create challenge
- [ ] Edit own challenge
- [ ] Delete own challenge
- [ ] View challenge submissions
- [ ] See dashboard stats
- [ ] Insert sample challenges works

### **AI Scoring:**
- [ ] Real GitHub repo analysis works
- [ ] Scores are accurate (low for unrelated repos)
- [ ] Mock scoring fallback works (without API key)
- [ ] Score breakdown displays correctly

---

## 📱 **5. Responsive Design**

### **Desktop (> 1024px):**
- [ ] Layout looks good
- [ ] Leaderboard in sidebar
- [ ] All buttons accessible
- [ ] Forms usable

### **Tablet (640px - 1024px):**
- [ ] Layout adapts
- [ ] Navigation works
- [ ] Forms usable

### **Mobile (< 640px):**
- [ ] Layout stacks properly
- [ ] Touch targets large enough
- [ ] Forms usable
- [ ] No horizontal scroll

---

## 🚀 **6. Performance**

### **Lighthouse Score (run in Chrome DevTools):**
```
Target scores:
- Performance: > 80
- Accessibility: > 90
- Best Practices: > 90
- SEO: > 80
```

- [ ] Performance score acceptable
- [ ] No critical accessibility issues
- [ ] No security warnings

### **Bundle Size:**
```bash
npm run build

# Check output:
# dist/assets/index-*.js should be < 500KB gzipped
```

- [ ] JavaScript bundle < 500KB gzipped
- [ ] CSS bundle < 50KB gzipped
- [ ] No unused dependencies

---

## 🔒 **7. Security**

### **Environment Variables:**
- [ ] No secrets in code
- [ ] `.env` in `.gitignore`
- [ ] No API keys in frontend code
- [ ] Supabase RLS enabled

### **Supabase Security:**
- [ ] RLS policies tested
- [ ] Service role key NOT in frontend
- [ ] Only anon key in frontend
- [ ] Storage policies secure

---

## 🌐 **8. Supabase Production Config**

### **URL Configuration:**

1. **Go to:** Supabase Dashboard → Authentication → URL Configuration

2. **Site URL:** (will update after deployment)
   ```
   http://localhost:3000  (for now)
   ```

3. **Redirect URLs:** (will update after deployment)
   ```
   http://localhost:3000/auth/callback
   http://localhost:3000/**
   ```

**Note:** You'll update these with your Vercel URL after deployment!

---

## 📦 **9. Git & GitHub**

### **Repository:**
- [ ] Code committed to git
- [ ] `.gitignore` includes `.env`
- [ ] No sensitive data in commits
- [ ] README.md updated

### **Push to GitHub:**
```bash
# If not already done:
git init
git add .
git commit -m "Ready for deployment"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/elitebuilders.git
git branch -M main
git push -u origin main
```

---

## 🎯 **10. Final Checks**

### **Documentation:**
- [ ] README.md has setup instructions
- [ ] Environment variables documented
- [ ] Deployment guide available

### **Error Handling:**
- [ ] Error boundaries in place (optional)
- [ ] User-friendly error messages
- [ ] Loading states for async operations
- [ ] Form validation works

### **User Experience:**
- [ ] Logo clickable (goes to home)
- [ ] Navigation intuitive
- [ ] Success messages clear
- [ ] Error messages helpful

---

## ✅ **Ready to Deploy?**

If all items are checked, you're ready to deploy!

### **Next Steps:**

1. **Follow DEPLOYMENT_GUIDE.md**
2. **Deploy to Vercel**
3. **Update Supabase URLs**
4. **Test production deployment**
5. **Monitor for errors**

---

## 🧪 **Quick Test Script**

Run this before deploying:

```bash
# 1. Clean install
rm -rf node_modules package-lock.json
npm install

# 2. Build
npm run build

# 3. Preview
npm run preview

# 4. Open http://localhost:4173 and test:
#    - Login
#    - Create challenge (as host)
#    - Submit to challenge (as builder)
#    - View leaderboard
#    - Check AI scoring
```

---

## 📊 **Current Status**

**Environment:** Development  
**Database:** Supabase (configured)  
**Storage:** Supabase Storage (configured)  
**AI Scoring:** Groq API (configured)  
**Authentication:** Email/Password + GitHub OAuth  

**Ready for:** Production Deployment ✅

---

**Complete this checklist, then proceed to DEPLOYMENT_GUIDE.md!** 🚀

