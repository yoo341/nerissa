# Nerissa: Aquatic Disease Radar

Installable web app for logging tilapia mortality, mapping hotspots, and spotting risky shared water sources.

## Publish on GitHub Pages
1. Upload every file in this folder (keep the `icons/` folder and the hidden `.nojekyll` file).
2. Settings > Pages > Deploy from branch > `main` / root > Save.
3. Open `https://<username>.github.io/<repo>/` on a phone and install it.

## Update the app
Change any file, then bump the cache name in `sw.js` (`nerissa-v2` to `nerissa-v3`) so phones pick up the new version.

## Import your survey data
Use **Import CSV**. Required columns: `farm, lat, lng, water, stocked, dead`. Optional: `date, cause, uid`.
Use the exact same text in `water` for farms that share a source.

## Optional: shared database (Supabase)
Without this, each phone keeps its own data. To pool data across devices:
1. Create a free project at supabase.com and run this in the SQL editor:
```sql
create table events (
  uid text primary key,
  farm text, lat double precision, lng double precision, water text,
  stocked int, dead int, date text, cause text,
  created_at timestamptz default now()
);
alter table events enable row level security;
create policy "anyone can add" on events for insert with check (true);
create policy "anyone can update own rows" on events for update using (true);
create policy "anyone can read" on events for select using (true);
```
2. Put your project URL and **anon** key in `config.js`.
3. A **Sync** button appears in the app.

Privacy warning: the anon key is visible in the site code, so anyone with the link can read the stored farm coordinates. For a real study, restrict read access (Supabase Auth) and never publish raw coordinates.

## Notes
- Hotspot flags are a screening tool. Confirm with Getis-Ord Gi* or SaTScan before publishing results.
- Deleting an event removes it from the phone only, not from the shared database.
