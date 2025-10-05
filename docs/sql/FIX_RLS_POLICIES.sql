-- ========================================
-- FIX RLS POLICIES FOR ELITEBUILDERS
-- ========================================
-- Run this in Supabase SQL Editor to fix the "Cannot coerce to single JSON object" error
-- This error happens when RLS blocks queries

-- ========================================
-- STEP 1: Drop all existing policies
-- ========================================

-- Drop challenges policies
DROP POLICY IF EXISTS "Anyone can view active challenges" ON challenges;
DROP POLICY IF EXISTS "Hosts can create challenges" ON challenges;
DROP POLICY IF EXISTS "Hosts can update their challenges" ON challenges;
DROP POLICY IF EXISTS "Hosts can delete their challenges" ON challenges;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Anyone can view profiles" ON profiles;
DROP POLICY IF EXISTS "Anyone can view submissions" ON submissions;
DROP POLICY IF EXISTS "Builders can create submissions" ON submissions;
DROP POLICY IF EXISTS "Builders can update their submissions" ON submissions;

-- ========================================
-- STEP 2: Create new policies
-- ========================================

-- ========================================
-- CHALLENGES TABLE POLICIES
-- ========================================

-- Allow EVERYONE (authenticated or not) to view ALL challenges
CREATE POLICY "Public read access for challenges"
ON challenges
FOR SELECT
USING (true);

-- Allow authenticated users who are hosts to create challenges
CREATE POLICY "Hosts can create challenges"
ON challenges
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'host'
  )
);

-- Allow hosts to update their own challenges
CREATE POLICY "Hosts can update own challenges"
ON challenges
FOR UPDATE
TO authenticated
USING (auth.uid() = host_id)
WITH CHECK (auth.uid() = host_id);

-- Allow hosts to delete their own challenges
CREATE POLICY "Hosts can delete own challenges"
ON challenges
FOR DELETE
TO authenticated
USING (auth.uid() = host_id);

-- ========================================
-- PROFILES TABLE POLICIES
-- ========================================

-- Allow EVERYONE to view ALL profiles (needed for host info on challenges)
CREATE POLICY "Public read access for profiles"
ON profiles
FOR SELECT
USING (true);

-- Allow users to insert their own profile (on signup)
CREATE POLICY "Users can insert own profile"
ON profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile"
ON profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- ========================================
-- SUBMISSIONS TABLE POLICIES
-- ========================================

-- Allow EVERYONE to view ALL submissions (needed for leaderboards)
CREATE POLICY "Public read access for submissions"
ON submissions
FOR SELECT
USING (true);

-- Allow authenticated builders to create submissions
CREATE POLICY "Builders can create submissions"
ON submissions
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'builder'
  )
  AND auth.uid() = builder_id
);

-- Allow builders to update their own submissions
CREATE POLICY "Builders can update own submissions"
ON submissions
FOR UPDATE
TO authenticated
USING (auth.uid() = builder_id)
WITH CHECK (auth.uid() = builder_id);

-- Allow builders to delete their own submissions
CREATE POLICY "Builders can delete own submissions"
ON submissions
FOR DELETE
TO authenticated
USING (auth.uid() = builder_id);

-- ========================================
-- STEP 3: Verify policies are working
-- ========================================

-- Check if RLS is enabled (should return 3 rows with relrowsecurity = true)
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('challenges', 'profiles', 'submissions');

-- List all policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- ========================================
-- DONE!
-- ========================================

-- After running this, try these tests:

-- Test 1: Can you see challenges?
-- SELECT id, title, status FROM challenges LIMIT 3;

-- Test 2: Can you see profiles?
-- SELECT id, role, company_name FROM profiles LIMIT 3;

-- Test 3: Can you see submissions?
-- SELECT id, challenge_id, builder_id FROM submissions LIMIT 3;

-- If all 3 queries return data, RLS is working correctly!

