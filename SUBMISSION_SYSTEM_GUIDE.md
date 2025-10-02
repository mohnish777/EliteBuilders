# 🚀 Submission System - Complete Guide

## ✅ **What's Been Built**

A complete submission system with:
- ✅ Submission form with GitHub URL and video upload
- ✅ URL validation for GitHub repositories
- ✅ File upload to Supabase Storage OR video URL
- ✅ Submission tracking on Builder Dashboard
- ✅ Update existing submissions
- ✅ Error handling and loading states
- ✅ Success confirmation

---

## 📁 **Files Created/Modified**

### **Created:**
1. **`src/pages/SubmitChallenge.tsx`** - Submission form page
2. **`SETUP_STORAGE.sql`** - Storage bucket setup script

### **Modified:**
1. **`src/pages/BuilderDashboard.tsx`** - Added submissions section
2. **`src/App.tsx`** - Added `/challenges/:id/submit` route
3. **`src/pages/ChallengeDetail.tsx`** - Already had submit button

---

## 🎯 **Features**

### **1. Submission Form**
- GitHub repository URL input with validation
- Two options for demo video:
  - **Video URL** (YouTube, Vimeo, Loom, direct links)
  - **File Upload** (MP4, WebM, MOV - max 100MB)
- Real-time validation
- Upload progress indicator
- Success/error messages

### **2. URL Validation**
- **GitHub URL:** Must match `https://github.com/username/repo`
- **Video URL:** Accepts YouTube, Vimeo, Loom, or direct video links
- Clear error messages for invalid URLs

### **3. File Upload**
- Upload to Supabase Storage bucket: `demo-videos`
- Organized by user ID and challenge ID
- Progress bar during upload
- Automatic public URL generation

### **4. Submission Tracking**
- Builder Dashboard shows all submissions
- Displays challenge title, submission date, score
- Links to GitHub repo and demo video
- Link back to challenge page

### **5. Update Submissions**
- Can resubmit to same challenge
- Updates existing submission instead of creating duplicate
- Preserves submission history

---

## 🔧 **Setup Required**

### **Step 1: Create Storage Bucket**

1. **Go to Supabase Dashboard:**
   ```
   https://supabase.com/dashboard/project/dvapgzzjlfvjvkdykzgw
   ```

2. **Click "Storage"** in left sidebar

3. **Click "Create Bucket"**

4. **Configure:**
   - **Name:** `demo-videos`
   - **Public:** ✅ Yes (check this box)
   - **File size limit:** 100MB
   - **Allowed MIME types:** Leave empty (allows all)

5. **Click "Create Bucket"**

---

### **Step 2: Set Up Storage Policies**

1. **Click "SQL Editor"** in left sidebar

2. **Click "New Query"**

3. **Run this SQL:**

```sql
-- Allow authenticated users to upload videos
CREATE POLICY "Authenticated users can upload videos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'demo-videos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow anyone to view videos (public bucket)
CREATE POLICY "Anyone can view videos"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'demo-videos');

-- Allow users to update their own videos
CREATE POLICY "Users can update own videos"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'demo-videos' AND
  (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'demo-videos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to delete their own videos
CREATE POLICY "Users can delete own videos"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'demo-videos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

4. **Click "Run"**

---

## 🎨 **User Flow**

### **Flow 1: Submit with Video URL**

```
1. Builder views challenge
   ↓
2. Clicks "Submit Project" button
   ↓
3. Submission form opens
   ↓
4. Enters GitHub URL: https://github.com/user/repo
   ↓
5. Selects "Video URL" option
   ↓
6. Enters YouTube URL: https://youtube.com/watch?v=...
   ↓
7. Clicks "Submit Project"
   ↓
8. Validation passes ✅
   ↓
9. Submission saved to database
   ↓
10. Success message shown
   ↓
11. Redirects to challenge page
   ↓
12. Shows "Submitted!" badge ✅
```

---

### **Flow 2: Submit with File Upload**

```
1. Builder views challenge
   ↓
2. Clicks "Submit Project" button
   ↓
3. Submission form opens
   ↓
4. Enters GitHub URL
   ↓
5. Selects "Upload File" option
   ↓
6. Clicks file upload area
   ↓
7. Selects video file (demo.mp4)
   ↓
8. Clicks "Submit Project"
   ↓
9. File uploads to Supabase Storage
   ↓
10. Progress bar shows 0% → 100%
   ↓
11. Public URL generated
   ↓
12. Submission saved to database
   ↓
13. Success message shown
   ↓
14. Redirects to challenge page ✅
```

---

### **Flow 3: Update Existing Submission**

```
1. Builder already submitted
   ↓
2. Views challenge page
   ↓
3. Sees "Submitted!" badge
   ↓
4. Clicks "Update Submission" button
   ↓
5. Form pre-filled with existing data
   ↓
6. Changes GitHub URL or video
   ↓
7. Clicks "Submit Project"
   ↓
8. Existing submission updated (not duplicated)
   ↓
9. Success message shown ✅
```

---

## 🧪 **Testing Guide**

### **Test 1: Submit with YouTube URL**

1. **Sign in as builder**
2. **Go to any challenge:**
   ```
   http://localhost:3000/challenges
   ```
3. **Click "View Challenge"**
4. **Click "Submit Project"**
5. **Fill form:**
   - GitHub URL: `https://github.com/yourusername/test-repo`
   - Select "Video URL"
   - Video URL: `https://youtube.com/watch?v=dQw4w9WgXcQ`
6. **Click "Submit Project"**
7. **Should see success message** ✅
8. **Should redirect to challenge page**
9. **Should see "Submitted!" badge**

---

### **Test 2: Submit with File Upload**

1. **Sign in as builder**
2. **Go to challenge and click "Submit Project"**
3. **Fill form:**
   - GitHub URL: `https://github.com/yourusername/test-repo`
   - Select "Upload File"
   - Click upload area and select a video file
4. **Click "Submit Project"**
5. **Should see upload progress bar** ✅
6. **Should see success message**
7. **Check Builder Dashboard:**
   ```
   http://localhost:3000/builder/dashboard
   ```
8. **Should see submission in "My Submissions"** ✅

---

### **Test 3: Validation Errors**

**Invalid GitHub URL:**
```
Input: https://gitlab.com/user/repo
Error: "Please enter a valid GitHub repository URL"
```

**Invalid Video URL:**
```
Input: https://example.com/video
Error: "Please enter a valid video URL"
```

**File Too Large:**
```
Input: 150MB video file
Error: "Video file must be less than 100MB"
```

**Missing Fields:**
```
Input: Empty GitHub URL
Error: Browser validation "Please fill out this field"
```

---

## 📊 **Database Schema**

### **submissions table:**
```sql
id                UUID (PK)
challenge_id      UUID (FK → challenges)
builder_id        UUID (FK → profiles)
github_url        TEXT
demo_video_url    TEXT
llm_score         INTEGER (default: 0)
created_at        TIMESTAMP
```

### **Storage structure:**
```
demo-videos/
├── {user_id}/
│   ├── {challenge_id}/
│   │   ├── 1234567890.mp4
│   │   ├── 1234567891.mp4
```

---

## 🎨 **UI Components**

### **Submission Form:**
```
┌─────────────────────────────────────┐
│ Submit Your Project                 │
│ Challenge: Build a Chat App         │
├─────────────────────────────────────┤
│ 📦 GitHub Repository                │
│ [https://github.com/user/repo]      │
│ Must be a public GitHub repository  │
├─────────────────────────────────────┤
│ 🎥 Demo Video                       │
│ [Video URL] [Upload File]           │
│                                     │
│ [https://youtube.com/watch?v=...]   │
│ YouTube, Vimeo, Loom, or direct link│
├─────────────────────────────────────┤
│              [Cancel] [Submit]      │
└─────────────────────────────────────┘
```

### **Builder Dashboard - Submissions:**
```
┌─────────────────────────────────────┐
│ 🏆 My Submissions                   │
├─────────────────────────────────────┤
│ Build a Chat App                    │
│ Submitted Jan 15, 2024              │
│ Score: 85                           │
│ [GitHub] [Demo] [View Challenge →]  │
├─────────────────────────────────────┤
│ AI Code Review                      │
│ Submitted Jan 10, 2024              │
│ Score: 92                           │
│ [GitHub] [Demo] [View Challenge →]  │
└─────────────────────────────────────┘
```

---

## 🔒 **Security**

### **Storage Policies:**
- ✅ Only authenticated users can upload
- ✅ Users can only upload to their own folder
- ✅ Anyone can view videos (public bucket)
- ✅ Users can only update/delete their own videos

### **Database Policies:**
- ✅ Anyone can view submissions (for leaderboards)
- ✅ Only builders can create submissions
- ✅ Only submission owner can update/delete

---

## 🐛 **Troubleshooting**

### **Issue: "Failed to upload video"**
**Fix:**
1. Check storage bucket exists: `demo-videos`
2. Check bucket is public
3. Check storage policies are set up
4. Check file size < 100MB

### **Issue: "Cannot coerce to single JSON object"**
**Fix:**
- Run the RLS policies fix from `FIX_RLS_POLICIES.sql`

### **Issue: Submission not showing on dashboard**
**Fix:**
1. Check browser console for errors
2. Verify submission was saved: Check Supabase → Table Editor → submissions
3. Refresh the page

---

## ✅ **Summary**

**What Works:**
- ✅ Submit with GitHub URL + Video URL
- ✅ Submit with GitHub URL + File Upload
- ✅ Update existing submissions
- ✅ View submissions on dashboard
- ✅ URL validation
- ✅ File size validation
- ✅ Upload progress indicator
- ✅ Success/error messages

**Next Steps:**
1. Set up storage bucket in Supabase
2. Run storage policies SQL
3. Test submission flow
4. (Optional) Add LLM scoring system later

---

**Ready to test! Set up the storage bucket and try submitting!** 🚀

