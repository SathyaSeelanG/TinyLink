-- Create the links table for TinyLink
CREATE TABLE IF NOT EXISTS links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  original_url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  click_count INTEGER DEFAULT 0,
  last_clicked TIMESTAMP,
  created_by TEXT
);

-- Create index on code for faster lookups
CREATE INDEX IF NOT EXISTS idx_links_code ON links(code);
ALTER TABLE links ADD COLUMN user_id VARCHAR(255);
CREATE INDEX idx_links_user_id ON links(user_id);