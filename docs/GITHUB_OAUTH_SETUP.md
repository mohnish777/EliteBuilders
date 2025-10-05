# 🔐 GitHub OAuth Setup Guide

This guide will help you set up GitHub OAuth authentication for EliteBuilders.

---

## ✅ **What's Already Implemented**

- ✅ GitHub OAuth button on Login page
- ✅ GitHub OAuth button on Signup page
- ✅ OAuth callback handler (`/auth/callback`)
- ✅ Automatic profile creation for GitHub users
- ✅ GitHub username extraction from OAuth metadata
- ✅ Builders default role for GitHub signups

---

## 🚀 **Setup Steps**

### **Step 1: Enable GitHub Provider in Supabase (5 minutes)**

1. **Go to Supabase Dashboard**
   - Navigate to: https://supabase.com/dashboard/project/dvapgzzjlfvjvkdykzgw
   - Click **Authentication** (left sidebar)
   - Click **Providers** tab

2. **Enable GitHub Provider**
   - Scroll down to **GitHub**
   - Toggle it **ON** (enabled)
   - You'll see fields for:
     - Client ID
     - Client Secret
   - **Keep this tab open** - you'll need to paste values here in Step 3

---

### **Step 2: Create GitHub OAuth App (5 minutes)**

1. **Go to GitHub Settings**
   - Navigate to: https://github.com/settings/developers
   - Click **OAuth Apps** (left sidebar)
   - Click **New OAuth App** button

2. **Fill in Application Details**
   ```
   Application name: EliteBuilders (Dev)
   Homepage URL: http://localhost:3000
   Application description: AI Builder Competition Platform
   Authorization callback URL: https://dvapgzzjlfvjvkdykzgw.supabase.co/auth/v1/callback
   ```

   **⚠️ IMPORTANT**: The callback URL must be:
   ```
   https://dvapgzzjlfvjvkdykzgw.supabase.co/auth/v1/callback
   ```
   (This is your Supabase project URL + `/auth/v1/callback`)

3. **Register Application**
   - Click **Register application**
   - You'll see your **Client ID** displayed
   - Click **Generate a new client secret**
   - **Copy both values** (you'll need them in Step 3)

---

### **Step 3: Configure Supabase with GitHub Credentials**

1. **Go back to Supabase Dashboard**
   - Authentication → Providers → GitHub

2. **Paste GitHub OAuth Credentials**
   - **Client ID**: Paste from GitHub OAuth App
   - **Client Secret**: Paste from GitHub OAuth App

3. **Save Configuration**
   - Click **Save** button
   - GitHub OAuth is now enabled! ✅

---

### **Step 4: Test GitHub OAuth (2 minutes)**

1. **Start your dev server** (if not running)
   ```bash
   npm run dev
   ```

2. **Go to Login Page**
   - Navigate to: http://localhost:3000/login

3. **Click "Sign in with GitHub"**
   - You'll be redirected to GitHub
   - Click **Authorize** to grant access
   - You'll be redirected back to EliteBuilders
   - You should land on the Builder Dashboard! 🎉

4. **Verify Profile Created**
   - Go to Supabase Dashboard
   - Click **Table Editor** → **profiles**
   - You should see a new row with:
     - Your user ID
     - `role: builder`
     - Your GitHub username in `github_username`

---

## 🎯 **How It Works**

### **Authentication Flow**

```
1. User clicks "Sign in with GitHub"
   ↓
2. Redirected to GitHub authorization page
   ↓
3. User authorizes EliteBuilders
   ↓
4. GitHub redirects to: /auth/callback
   ↓
5. AuthCallback component:
   - Gets session from Supabase
   - Checks if profile exists
   - Creates profile if needed (role: builder)
   - Extracts GitHub username from metadata
   ↓
6. Redirects to /builder/dashboard
```

### **Profile Creation**

When a user signs in with GitHub for the first time:
- **Automatic profile creation** in `profiles` table
- **Default role**: `builder` (GitHub users are builders)
- **GitHub username**: Extracted from OAuth metadata
- **No password needed**: OAuth handles authentication

### **Code Structure**

- **`src/contexts/AuthContext.tsx`**: `signInWithGitHub()` method
- **`src/pages/Login.tsx`**: GitHub OAuth button
- **`src/pages/Signup.tsx`**: GitHub OAuth button
- **`src/pages/AuthCallback.tsx`**: OAuth callback handler
- **`src/App.tsx`**: `/auth/callback` route

---

## 🔒 **Security Notes**

### **Client Secret Protection**
- ✅ Client Secret is stored in Supabase (server-side)
- ✅ Never exposed to frontend code
- ✅ Supabase handles OAuth flow securely

### **Redirect URL Validation**
- ✅ GitHub only redirects to registered callback URL
- ✅ Prevents OAuth hijacking attacks

### **Session Management**
- ✅ Supabase handles session tokens
- ✅ Automatic session refresh
- ✅ Secure cookie storage

---

## 🌐 **Production Setup**

When deploying to production (e.g., Vercel):

### **1. Create Production GitHub OAuth App**
- Go to: https://github.com/settings/developers
- Click **New OAuth App**
- Fill in:
  ```
  Application name: EliteBuilders
  Homepage URL: https://elitebuilders.vercel.app
  Authorization callback URL: https://dvapgzzjlfvjvkdykzgw.supabase.co/auth/v1/callback
  ```
- Copy Client ID and Client Secret

### **2. Update Supabase**
- You can use the **same Supabase project**
- Or create a new production project
- Add production GitHub credentials to Supabase

### **3. Update Redirect URL in Code**
The redirect URL in `AuthContext.tsx` uses `window.location.origin`, so it automatically adapts:
- **Development**: `http://localhost:3000/auth/callback`
- **Production**: `https://elitebuilders.vercel.app/auth/callback`

---

## 🐛 **Troubleshooting**

### **"Invalid redirect URI"**
❌ Callback URL in GitHub doesn't match Supabase
✅ Make sure it's: `https://dvapgzzjlfvjvkdykzgw.supabase.co/auth/v1/callback`

### **"GitHub provider is not enabled"**
❌ GitHub not enabled in Supabase
✅ Go to Supabase → Authentication → Providers → Enable GitHub

### **"Missing client ID or secret"**
❌ GitHub credentials not configured in Supabase
✅ Add Client ID and Client Secret in Supabase

### **Stuck on "Completing authentication..."**
❌ Profile creation failed
✅ Check browser console for errors
✅ Verify `profiles` table exists in Supabase
✅ Check RLS policies allow INSERT

### **Redirects to login instead of dashboard**
❌ Session not created properly
✅ Check Supabase logs (Dashboard → Logs)
✅ Verify GitHub OAuth app is active

---

## 📝 **Testing Checklist**

- [ ] GitHub provider enabled in Supabase
- [ ] GitHub OAuth app created
- [ ] Client ID and Secret added to Supabase
- [ ] Callback URL matches exactly
- [ ] "Sign in with GitHub" button visible on login page
- [ ] Clicking button redirects to GitHub
- [ ] After authorization, redirects back to app
- [ ] Profile created in `profiles` table
- [ ] GitHub username populated
- [ ] User lands on Builder Dashboard
- [ ] Can sign out and sign in again

---

## 🎨 **UI Features**

### **GitHub Button Design**
- ✅ GitHub icon (from Lucide React)
- ✅ Dark theme matching EliteBuilders style
- ✅ Hover effects
- ✅ Loading state
- ✅ Disabled state during authentication

### **Divider**
- ✅ "Or continue with" separator
- ✅ Clean visual separation between email and OAuth

### **Callback Page**
- ✅ Loading spinner during authentication
- ✅ Error handling with user-friendly messages
- ✅ Auto-redirect on error

---

## 🚀 **Next Steps**

After GitHub OAuth is working:

1. **Add more OAuth providers** (optional):
   - Google OAuth
   - LinkedIn OAuth
   - Twitter OAuth

2. **Enhance profile creation**:
   - Ask for additional info after OAuth signup
   - Let users choose role (builder/host) after GitHub auth

3. **Add GitHub integration features**:
   - Fetch user's repositories
   - Validate GitHub URLs in submissions
   - Show GitHub stats on profile

---

## 💡 **Why GitHub OAuth for Builders?**

Perfect fit for EliteBuilders because:
- ✅ **Builders already have GitHub accounts** (they're developers!)
- ✅ **One-click signup** (no password to remember)
- ✅ **Automatic GitHub username** (for submissions)
- ✅ **Trust signal** (verified GitHub account)
- ✅ **Better UX** (faster signup flow)

---

## 📚 **Resources**

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [GitHub OAuth Apps](https://docs.github.com/en/developers/apps/building-oauth-apps)
- [Supabase GitHub Provider](https://supabase.com/docs/guides/auth/social-login/auth-github)

---

## ✅ **Summary**

GitHub OAuth is now fully integrated! Just complete the 4 setup steps above and you'll have:
- ✅ One-click GitHub authentication
- ✅ Automatic profile creation
- ✅ GitHub username extraction
- ✅ Secure OAuth flow
- ✅ Beautiful UI

**Estimated setup time**: 10-15 minutes

Happy coding! 🚀

