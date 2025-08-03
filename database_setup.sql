-- Script SQL per creare la tabella "requests" in Supabase
-- Esegui questo script nel SQL Editor di Supabase

CREATE TABLE IF NOT EXISTS requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'read', 'in_progress', 'completed', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indici per migliorare le performance
CREATE INDEX IF NOT EXISTS idx_requests_status ON requests(status);
CREATE INDEX IF NOT EXISTS idx_requests_created_at ON requests(created_at DESC);

-- Trigger per aggiornare updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_requests_updated_at 
    BEFORE UPDATE ON requests 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Abilita Row Level Security (RLS)
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;

-- Policy per permettere inserimenti pubblici
CREATE POLICY "Allow public inserts" ON requests
    FOR INSERT WITH CHECK (true);

-- Policy per permettere lettura solo agli admin (da configurare con auth)
CREATE POLICY "Allow admin read" ON requests
    FOR SELECT USING (auth.role() = 'authenticated');

-- Policy per permettere aggiornamenti solo agli admin
CREATE POLICY "Allow admin update" ON requests
    FOR UPDATE USING (auth.role() = 'authenticated'); 