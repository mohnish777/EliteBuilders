-- Add score_breakdown column to submissions table
-- This stores the detailed AI scoring breakdown as JSON

ALTER TABLE submissions 
ADD COLUMN IF NOT EXISTS score_breakdown JSONB;

-- Add comment to explain the column
COMMENT ON COLUMN submissions.score_breakdown IS 'Detailed AI scoring breakdown with functionality, code quality, documentation, innovation, and UI/UX scores plus feedback';

-- Example of what the JSON structure looks like:
-- {
--   "functionality": 25,
--   "codeQuality": 28,
--   "documentation": 18,
--   "innovation": 8,
--   "uiux": 9,
--   "total": 88,
--   "feedback": "Detailed AI feedback about the submission..."
-- }

