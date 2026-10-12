create table if not exists public.worker_heartbeats (
  worker_id         text primary key,
  last_seen         timestamptz not null default now(),
  printer_connected boolean not null default false,
  gcode_state       text,
  chamber_temp      numeric,
  alerted           boolean not null default false,   -- watchdog bookkeeping
  printer_alerted   boolean not null default false
);
 
alter table public.worker_heartbeats enable row level security;
-- No policies: only the service role key (Pi + edge function) can touch it.
 
-- Run the watchdog every minute (enable pg_cron and pg_net extensions first).
-- Replace <PROJECT_REF> and <SERVICE_ROLE_KEY>.
select cron.schedule(
  'worker-watchdog',
  '* * * * *',
  $$
  select net.http_post(
    url     := 'https://<PROJECT_REF>.supabase.co/functions/v1/worker-watchdog',
    headers := jsonb_build_object('Authorization', 'Bearer <SERVICE_ROLE_KEY>')
  );
  $$
);
 