# Supabase Setup for Flappy Rhema

## 1. Create the table

Run this SQL in your Supabase SQL editor:

```sql
create table high_scores (
  id         uuid        primary key default gen_random_uuid(),
  name       text        not null,
  score      integer     not null,
  theme      text        not null,
  created_at timestamptz default now()
);
```

## 2. Enable Row Level Security (RLS)

```sql
alter table high_scores enable row level security;

-- Anyone can read scores
create policy "Public read" on high_scores
  for select using (true);

-- Anyone can insert a score
create policy "Public insert" on high_scores
  for insert with check (true);
```

## 3. Add your keys to .env

Copy `.env.example` to `.env` and fill in:

```
VITE_SUPABASE_URL=https://<your-project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>
```

Find these in **Supabase Dashboard → Project Settings → API**.

## 4. Drop the real logo

Place `rhema-logo.png` into the `public/` folder before building.

## 5. Deploy to Netlify

- Connect the private repo in Netlify.
- Set the build command to `npm run build`.
- Set publish directory to `dist`.
- Add the two `VITE_*` env vars in Netlify site settings → Environment variables.
