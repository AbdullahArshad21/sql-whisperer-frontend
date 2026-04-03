-- ==========================================
-- SQL Whisperer Database Schema & Migrations
-- ==========================================

-- 1. Create Tables
-- ------------------------------------------

-- Create profiles table linked to Supabase auth.users
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create connections table to store database connections
CREATE TABLE public.connections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    supabase_url TEXT NOT NULL,
    -- In a production environment with pgsodium enabled, you would encrypt this.
    -- Assuming a TEXT field for simplicity per user requirements:
    supabase_key TEXT NOT NULL,
    schema_sql TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create query_history table to store past queries
CREATE TABLE public.query_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    connection_id UUID REFERENCES public.connections(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    generated_sql TEXT,
    execution_time_ms INTEGER,
    row_count INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);


-- 2. Enable Row Level Security (RLS)
-- ------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.query_history ENABLE ROW LEVEL SECURITY;


-- 3. Define RLS Policies
-- ------------------------------------------

-- Profiles Policies
CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete their own profile"
    ON public.profiles FOR DELETE
    USING (auth.uid() = id);

-- Connections Policies
CREATE POLICY "Users can view their own connections"
    ON public.connections FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own connections"
    ON public.connections FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own connections"
    ON public.connections FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own connections"
    ON public.connections FOR DELETE
    USING (auth.uid() = user_id);

-- Query History Policies
CREATE POLICY "Users can view their own query history"
    ON public.query_history FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own query history"
    ON public.query_history FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own query history"
    ON public.query_history FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own query history"
    ON public.query_history FOR DELETE
    USING (auth.uid() = user_id);


-- 4. Triggers
-- ------------------------------------------

-- Function to handle new user signups and create a profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (
    NEW.id, 
    -- Assuming they might pass full_name in the auth metadata during sign up
    NEW.raw_user_meta_data->>'full_name' 
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to execute the function after an auth user is created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
