-- Migration: Add user_id column to existing links table
-- This migration is safe to run multiple times

-- Add user_id column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'links' AND column_name = 'user_id'
    ) THEN
        ALTER TABLE links ADD COLUMN user_id VARCHAR(255);
        RAISE NOTICE 'Added user_id column to links table';
    ELSE
        RAISE NOTICE 'user_id column already exists';
    END IF;
END $$;

-- Create index if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_indexes
        WHERE tablename = 'links' AND indexname = 'idx_links_user_id'
    ) THEN
        CREATE INDEX idx_links_user_id ON links(user_id);
        RAISE NOTICE 'Created index idx_links_user_id';
    ELSE
        RAISE NOTICE 'Index idx_links_user_id already exists';
    END IF;
END $$;

-- Optional: Set existing links to NULL or a default value
-- Existing links without user_id will not be shown to any user after migration
RAISE NOTICE 'Migration complete. Existing links without user_id will not appear in any user dashboard.';
