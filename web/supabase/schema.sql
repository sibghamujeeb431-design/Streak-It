-- Streak It Supabase schema
-- Run this in your Supabase project's SQL Editor after creating the project.

-- Profiles table: stores onboarding answers and user preferences
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  microbiology_level text check (microbiology_level in ('Beginner','Intermediate','Advanced')),
  focus_area text check (focus_area in ('Staining','Aseptic Technique','Interpretation','Biochemical Testing')),
  default_mode text check (default_mode in ('Learn Mode','Test Mode')),
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Drop existing policy if re-running
DROP POLICY IF EXISTS "Users can manage own profile" ON public.profiles;

-- Users can only read/update their own profile
create policy "Users can manage own profile"
  on public.profiles for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Function to create a profile row when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Experiment attempts: stores scored results for each lab simulation.

create table if not exists public.experiment_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  experiment_name text not null,
  score integer not null check (score between 0 and 100),
  procedural_accuracy integer not null check (procedural_accuracy between 0 and 100),
  decision_accuracy integer not null check (decision_accuracy between 0 and 100),
  interpretation_accuracy integer not null check (interpretation_accuracy between 0 and 100),
  mode text not null check (mode in ('learn','test')),
  completed_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.experiment_attempts enable row level security;

drop policy if exists "Users can insert own attempts" on public.experiment_attempts;
drop policy if exists "Users can read own attempts" on public.experiment_attempts;

create policy "Users can insert own attempts"
  on public.experiment_attempts for insert
  with check (auth.uid() = user_id);

create policy "Users can read own attempts"
  on public.experiment_attempts for select
  using (auth.uid() = user_id);

create index if not exists experiment_attempts_user_completed_idx
  on public.experiment_attempts (user_id, completed_at desc);
