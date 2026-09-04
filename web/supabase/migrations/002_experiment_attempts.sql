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
