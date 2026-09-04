# Streak It Web App

React + Vite + TypeScript + Tailwind CSS frontend with Supabase backend/auth.

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure Supabase:
   - Create a new Supabase project at https://supabase.com
   - Copy `Project URL` and `anon public` API key into `.env`
   - In Auth → Providers, enable Email provider and disable "Confirm email" for the smoothest onboarding flow
   - In the SQL Editor, run the contents of `supabase/schema.sql`

3. Start the dev server:
   ```bash
   npm run dev
   ```

## Deployment to Vercel

1. Push this `web/` directory to a Git repository.
2. Import the repository in Vercel.
3. Add the environment variables `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Vercel project settings.
4. Deploy.

## Routes

- `/` — Landing page
- `/onboarding` — Login / Signup
- `/onboarding/questions` — Onboarding question flow (auth required)
- `/dashboard` — Dashboard shell (auth required)
- `/experiments` — Experiments placeholder (auth required)
- `/ai-lab` — AI Lab placeholder (auth required)
- `/progress` — Progress placeholder (auth required)
