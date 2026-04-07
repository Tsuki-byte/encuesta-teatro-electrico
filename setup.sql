-- Table to store responses (identifies users)
CREATE TABLE IF NOT EXISTS responses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table to store individual answers
CREATE TABLE IF NOT EXISTS answers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    response_id UUID REFERENCES responses(id) ON DELETE CASCADE NOT NULL,
    question_id TEXT NOT NULL,
    value TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Row Level Security (RLS) - Basic setup for public use
-- Note: In a production app, you might want more restrictive policies.
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert" ON responses FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select by email" ON responses FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON answers FOR INSERT WITH CHECK (true);
