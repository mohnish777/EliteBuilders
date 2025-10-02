# Database Schema Updates

## ✅ Schema Updated Successfully!

The database schema has been updated to match your simplified, production-ready design.

---

## 📊 New Schema

### **profiles** table
```sql
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  role text check (role in ('builder', 'host')) not null,
  company_name text,
  github_username text,
  created_at timestamp default now()
);
```

**Changes from original**:
- ✅ `user_type` → `role` (clearer naming)
- ✅ Removed `email` (already in auth.users)
- ✅ Removed `updated_at` (simpler)
- ✅ Added `company_name` (for hosts)
- ✅ Added `github_username` (for builders)

### **challenges** table
```sql
create table public.challenges (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text not null,
  duration_hours integer not null,
  host_id uuid references public.profiles(id) not null,
  status text default 'active',
  created_at timestamp default now()
);
```

**Changes from original**:
- ✅ `start_date` + `end_date` → `duration_hours` (simpler, more flexible)
- ✅ Removed `prize` field (can add later if needed)
- ✅ Removed `requirements` JSONB (can add later if needed)
- ✅ Removed `updated_at` (simpler)
- ✅ Simplified `status` (just text, no enum constraint)

### **submissions** table
```sql
create table public.submissions (
  id uuid default gen_random_uuid() primary key,
  challenge_id uuid references public.challenges(id) not null,
  builder_id uuid references public.profiles(id) not null,
  github_url text not null,
  demo_video_url text not null,
  llm_score integer default 0,
  created_at timestamp default now()
);
```

**Changes from original**:
- ✅ `score` (DECIMAL) → `llm_score` (INTEGER, 0-100)
- ✅ Removed `description` field (GitHub README is the description)
- ✅ Removed `status` field (simpler - score determines status)
- ✅ Removed `updated_at` (simpler)
- ✅ Removed UNIQUE constraint (allows resubmissions)

---

## 🔄 Code Updates

### **TypeScript Types** (`src/types/index.ts`)
```typescript
export type UserRole = 'builder' | 'host'

export interface Profile {
  id: string
  role: UserRole
  company_name?: string
  github_username?: string
  created_at: string
}

export interface Challenge {
  id: string
  title: string
  description: string
  duration_hours: number
  host_id: string
  status: string
  created_at: string
}

export interface Submission {
  id: string
  challenge_id: string
  builder_id: string
  github_url: string
  demo_video_url: string
  llm_score: number
  created_at: string
}
```

### **AuthContext** (`src/contexts/AuthContext.tsx`)
Updated `signUp` function:
```typescript
signUp: (
  email: string, 
  password: string, 
  role: 'builder' | 'host',
  githubUsername?: string,
  companyName?: string
) => Promise<void>
```

### **Signup Page** (`src/pages/Signup.tsx`)
Added conditional fields:
- **Builders**: GitHub Username (optional)
- **Hosts**: Company Name (optional)

---

## 🎯 Benefits of New Schema

### 1. **Simpler**
- Fewer fields to manage
- No complex JSONB or DECIMAL types
- Removed redundant fields (email, updated_at)

### 2. **More Flexible**
- `duration_hours` instead of fixed dates (easier to extend/reschedule)
- Simple `status` text field (can add any status later)
- No UNIQUE constraint on submissions (allows updates/resubmissions)

### 3. **Better UX**
- GitHub username for builders (social proof)
- Company name for hosts (credibility)
- Integer scores (easier to understand than decimals)

### 4. **Production-Ready**
- All tables have RLS enabled
- Proper foreign key constraints
- Sensible defaults
- Clean, normalized structure

---

## 📝 Migration Guide

If you already created the old schema in Supabase:

### Option 1: Drop and Recreate (Recommended for Development)
```sql
-- Drop existing tables
drop table if exists public.submissions cascade;
drop table if exists public.challenges cascade;
drop table if exists public.profiles cascade;

-- Then run the new schema from SETUP.md
```

### Option 2: Alter Existing Tables (For Production)
```sql
-- Update profiles table
alter table public.profiles rename column user_type to role;
alter table public.profiles drop column if exists email;
alter table public.profiles drop column if exists updated_at;
alter table public.profiles add column if not exists company_name text;
alter table public.profiles add column if not exists github_username text;

-- Update challenges table
alter table public.challenges drop column if exists start_date;
alter table public.challenges drop column if exists end_date;
alter table public.challenges drop column if exists prize;
alter table public.challenges drop column if exists requirements;
alter table public.challenges drop column if exists updated_at;
alter table public.challenges add column if not exists duration_hours integer not null default 48;

-- Update submissions table
alter table public.submissions rename column score to llm_score;
alter table public.submissions alter column llm_score type integer using llm_score::integer;
alter table public.submissions alter column llm_score set default 0;
alter table public.submissions drop column if exists description;
alter table public.submissions drop column if exists status;
alter table public.submissions drop column if exists updated_at;
alter table public.submissions drop constraint if exists submissions_challenge_id_builder_id_key;
```

---

## ✅ What's Updated

### Documentation
- ✅ `README.md` - Updated SQL
- ✅ `SETUP.md` - Updated SQL
- ✅ `ARCHITECTURE.md` - Updated schema docs

### Code
- ✅ `src/types/index.ts` - Updated TypeScript types
- ✅ `src/contexts/AuthContext.tsx` - Updated signUp function
- ✅ `src/pages/Signup.tsx` - Added optional fields

### Database
- ⏳ **You need to run the new SQL** in Supabase (see SETUP.md)

---

## 🚀 Next Steps

1. **If you haven't set up Supabase yet**:
   - Just follow `SETUP.md` with the new SQL
   - Everything will work perfectly!

2. **If you already ran the old SQL**:
   - Go to Supabase SQL Editor
   - Run the "Drop and Recreate" commands above
   - Then run the new SQL from `SETUP.md`

3. **Test the new schema**:
   ```bash
   npm run dev
   ```
   - Sign up as a builder (add GitHub username)
   - Sign up as a host (add company name)
   - Check Supabase Table Editor to see the data

---

## 💡 Schema Design Principles

This schema follows these principles:

1. **KISS (Keep It Simple, Stupid)**
   - Only essential fields
   - No premature optimization
   - Easy to understand

2. **YAGNI (You Aren't Gonna Need It)**
   - Removed fields we might not use
   - Can always add them later
   - Start minimal, grow as needed

3. **DRY (Don't Repeat Yourself)**
   - Email already in auth.users
   - No redundant timestamps
   - Single source of truth

4. **Flexibility First**
   - Duration instead of fixed dates
   - Simple text status
   - Optional fields for future features

---

## 🎉 Summary

The schema is now **simpler, cleaner, and more production-ready**!

**Key improvements**:
- ✅ Clearer naming (`role` instead of `user_type`)
- ✅ More flexible (`duration_hours` instead of dates)
- ✅ Better UX (GitHub username, company name)
- ✅ Simpler types (INTEGER instead of DECIMAL)
- ✅ Less redundancy (removed email, updated_at)

**All code updated** to match the new schema. Just run the new SQL in Supabase and you're good to go! 🚀

