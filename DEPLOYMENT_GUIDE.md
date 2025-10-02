# 🚀 EliteBuilders - Vercel Deployment Guide

Complete guide to deploy EliteBuilders to Vercel with production configuration.

---

## 📋 **Pre-Deployment Checklist**

### **1. Environment Variables Ready**
- ✅ Supabase URL
- ✅ Supabase Anon Key
- ✅ Groq API Key (optional but recommended)

### **2. Supabase Configuration**
- ✅ Database tables created
- ✅ RLS policies configured
- ✅ Storage buckets set up
- ✅ Authentication enabled

### **3. Code Ready**
- ✅ All features tested locally
- ✅ No console errors
- ✅ Build passes successfully

---

## 🔧 **Step 1: Test Production Build Locally**

Before deploying, make sure the production build works:

```bash
# Build the app
npm run build

# Preview the production build
npm run preview
```

**Expected output:**
```
✓ built in 3.45s
dist/index.html                   0.46 kB │ gzip:  0.30 kB
dist/assets/index-abc123.css     12.34 kB │ gzip:  3.21 kB
dist/assets/index-def456.js     234.56 kB │ gzip: 78.90 kB
```

**Test the preview:**
1. Open http://localhost:4173
2. Test login/signup
3. Test challenge creation
4. Test submission flow
5. Check for any errors in console

---

## 🌐 **Step 2: Deploy to Vercel**

### **Option A: Deploy via Vercel CLI (Recommended)**

#### **Install Vercel CLI:**
```bash
npm install -g vercel
```

#### **Login to Vercel:**
```bash
vercel login
```

#### **Deploy:**
```bash
# First deployment (will ask questions)
vercel

# Follow the prompts:
# ? Set up and deploy "~/EliteBuilders"? [Y/n] y
# ? Which scope? [Your Account]
# ? Link to existing project? [y/N] n
# ? What's your project's name? elitebuilders
# ? In which directory is your code located? ./
```

#### **Set Environment Variables:**
```bash
# Add Supabase URL
vercel env add VITE_SUPABASE_URL

# Paste your Supabase URL when prompted
# Select: Production, Preview, Development

# Add Supabase Anon Key
vercel env add VITE_SUPABASE_ANON_KEY

# Paste your Supabase Anon Key when prompted
# Select: Production, Preview, Development

# Add Groq API Key
vercel env add VITE_GROQ_API_KEY

# Paste your Groq API Key when prompted
# Select: Production, Preview, Development
```

#### **Deploy to Production:**
```bash
vercel --prod
```

---

### **Option B: Deploy via Vercel Dashboard (Easier)**

#### **1. Push to GitHub:**
```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Ready for deployment"

# Create GitHub repo and push
# (Follow GitHub instructions to create repo)
git remote add origin https://github.com/YOUR_USERNAME/elitebuilders.git
git branch -M main
git push -u origin main
```

#### **2. Import to Vercel:**

1. **Go to:** https://vercel.com/new
2. **Click:** "Import Git Repository"
3. **Select:** Your GitHub repository
4. **Configure Project:**
   - Framework Preset: **Vite**
   - Root Directory: **.**
   - Build Command: **npm run build**
   - Output Directory: **dist**
   - Install Command: **npm install**

#### **3. Add Environment Variables:**

In the Vercel dashboard, add these environment variables:

| Name | Value | Environment |
|------|-------|-------------|
| `VITE_SUPABASE_URL` | `https://your-project.supabase.co` | Production, Preview, Development |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGc...` | Production, Preview, Development |
| `VITE_GROQ_API_KEY` | `gsk_...` | Production, Preview, Development |

**How to add:**
1. Go to Project Settings → Environment Variables
2. Click "Add New"
3. Enter Name and Value
4. Select all environments (Production, Preview, Development)
5. Click "Save"

#### **4. Deploy:**
Click **"Deploy"** button!

---

## 🔒 **Step 3: Configure Supabase for Production**

### **Add Vercel Domain to Supabase:**

1. **Go to Supabase Dashboard:**
   - https://app.supabase.com/project/YOUR_PROJECT/auth/url-configuration

2. **Add Site URL:**
   ```
   https://your-app.vercel.app
   ```

3. **Add Redirect URLs:**
   ```
   https://your-app.vercel.app/auth/callback
   https://your-app.vercel.app/**
   ```

4. **Save Changes**

---

## 🌍 **Step 4: Custom Domain (Optional)**

### **Add Custom Domain in Vercel:**

1. **Go to:** Project Settings → Domains
2. **Click:** "Add Domain"
3. **Enter:** `elitebuilders.com` (or your domain)
4. **Follow DNS instructions:**

**For Namecheap/GoDaddy:**
```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

**For Cloudflare:**
```
Type: A
Name: @
Value: 76.76.21.21
Proxy: DNS only (gray cloud)

Type: CNAME
Name: www
Value: cname.vercel-dns.com
Proxy: DNS only (gray cloud)
```

5. **Wait for DNS propagation** (5-30 minutes)

### **Update Supabase with Custom Domain:**

Add your custom domain to Supabase:
```
https://elitebuilders.com
https://elitebuilders.com/auth/callback
https://elitebuilders.com/**
```

---

## ✅ **Step 5: Post-Deployment Verification**

### **Test Checklist:**

#### **1. Basic Functionality:**
- [ ] Landing page loads
- [ ] Login works
- [ ] Signup works
- [ ] GitHub OAuth works
- [ ] Logout works

#### **2. Builder Features:**
- [ ] View challenges
- [ ] Submit to challenge
- [ ] Upload video
- [ ] AI scoring works
- [ ] View submission details
- [ ] See leaderboard

#### **3. Host Features:**
- [ ] Create challenge
- [ ] Edit challenge
- [ ] Delete challenge
- [ ] View submissions
- [ ] See stats

#### **4. Performance:**
- [ ] Page load < 3 seconds
- [ ] No console errors
- [ ] Images load properly
- [ ] Navigation smooth

#### **5. Mobile:**
- [ ] Responsive on mobile
- [ ] Touch interactions work
- [ ] Forms usable on mobile

---

## 🐛 **Troubleshooting**

### **Build Fails:**

**Error:** `Module not found`
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Error:** `Environment variable not found`
- Check that all `VITE_` prefixed variables are set in Vercel
- Redeploy after adding variables

### **Blank Page After Deploy:**

1. **Check browser console** for errors
2. **Verify environment variables** are set correctly
3. **Check Supabase URL** is added to allowed domains
4. **Hard refresh** browser (Cmd+Shift+R / Ctrl+Shift+R)

### **Authentication Not Working:**

1. **Verify Supabase redirect URLs** include your Vercel domain
2. **Check Site URL** in Supabase matches deployment URL
3. **Test with incognito window** to rule out cache issues

### **AI Scoring Not Working:**

1. **Check Groq API key** is set in Vercel environment variables
2. **Verify API key** is valid at https://console.groq.com/keys
3. **Check browser console** for API errors
4. **Fallback to mock scoring** should work if API fails

---

## 📊 **Monitoring & Analytics**

### **Vercel Analytics:**

Enable analytics in Vercel dashboard:
1. Go to Project → Analytics
2. Enable Web Analytics
3. View real-time traffic and performance

### **Error Tracking:**

Check deployment logs:
```bash
vercel logs
```

Or in dashboard:
- Project → Deployments → [Latest] → Logs

---

## 🔄 **Continuous Deployment**

### **Automatic Deployments:**

Once connected to GitHub, Vercel will automatically:
- ✅ Deploy on every push to `main` branch
- ✅ Create preview deployments for PRs
- ✅ Run build checks before deploying

### **Manual Redeploy:**

```bash
# Redeploy latest commit
vercel --prod

# Or in dashboard:
# Deployments → [Latest] → Redeploy
```

---

## 🎉 **Success!**

Your app should now be live at:
- **Vercel URL:** `https://your-app.vercel.app`
- **Custom Domain:** `https://elitebuilders.com` (if configured)

---

## 📝 **Quick Reference**

### **Vercel Commands:**
```bash
vercel                    # Deploy to preview
vercel --prod            # Deploy to production
vercel env ls            # List environment variables
vercel env add NAME      # Add environment variable
vercel logs              # View deployment logs
vercel domains ls        # List domains
vercel domains add DOMAIN # Add custom domain
```

### **Important URLs:**
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Supabase Dashboard:** https://app.supabase.com
- **Groq Console:** https://console.groq.com

---

## 🆘 **Need Help?**

- **Vercel Docs:** https://vercel.com/docs
- **Supabase Docs:** https://supabase.com/docs
- **Vite Docs:** https://vitejs.dev/guide/

---

**Ready to deploy? Follow the steps above and your app will be live in minutes!** 🚀

