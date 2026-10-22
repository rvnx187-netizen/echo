create extension if not exists pgcrypto;

create type public.moderation_status as enum ('pending', 'approved', 'rejected', 'hidden', 'removed');
create type public.report_category as enum ('spam', 'harassment', 'threat', 'sexual', 'hate', 'other');

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  content text not null check (char_length(trim(content)) between 1 and 280),
  status public.moderation_status not null default 'pending',
  created_at timestamptz not null default now(),
  expires_at timestamptz,
  constraint no_links check (content !~* '(https?://|www\\.)')
);
create index messages_public_idx on public.messages (created_at desc) where status = 'approved';

create table public.reports (
  id uuid primary key default gen_random_uuid(), message_id uuid not null references public.messages(id) on delete cascade,
  category public.report_category not null, created_at timestamptz not null default now(), status text not null default 'open' check (status in ('open', 'reviewed', 'dismissed'))
);
create index reports_open_idx on public.reports (status, created_at desc);

create table public.moderation_events (
  id uuid primary key default gen_random_uuid(), message_id uuid references public.messages(id) on delete set null,
  from_status public.moderation_status, to_status public.moderation_status not null, reason text, created_at timestamptz not null default now()
);

alter table public.messages enable row level security; alter table public.reports enable row level security; alter table public.moderation_events enable row level security;
create policy "public reads approved messages" on public.messages for select using (status = 'approved' and (expires_at is null or expires_at > now()));
-- Inserts and all moderation/report operations are server-only via Edge Functions/service role.
revoke all on public.messages, public.reports, public.moderation_events from anon, authenticated;
grant select on public.messages to anon, authenticated;
