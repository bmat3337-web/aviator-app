-- Aviator canonical persistence foundation
create table if not exists aviator_rounds (
  round_id text primary key,
  sequence bigint not null unique,
  multiplier numeric(12,4) not null check (multiplier >= 1),
  occurred_at timestamptz not null,
  source text not null check (source in ('manual','telegram','import','provider')),
  created_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb
);
create index if not exists aviator_rounds_occurred_at_idx on aviator_rounds (occurred_at desc);
create index if not exists aviator_rounds_sequence_idx on aviator_rounds (sequence desc);

create table if not exists aviator_challenges (
  challenge_id text primary key,
  title text not null,
  state text not null check (state in ('DRAFT','SCHEDULED','LIVE','LOCKED','SETTLEMENT','COMPLETED')),
  total_rounds integer not null check (total_rounds > 0),
  current_round integer not null default 0 check (current_round >= 0 and current_round <= total_rounds),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  created_at timestamptz not null default now(),
  check (ends_at > starts_at)
);

create table if not exists aviator_challenge_predictions (
  challenge_id text not null references aviator_challenges(challenge_id) on delete cascade,
  participant_id text not null,
  round_number integer not null check (round_number > 0),
  target_state text not null check (target_state in ('LOW','MID','BASE','HIGH','EXTREME')),
  submitted_at timestamptz not null,
  signal_version text not null,
  primary key (challenge_id, participant_id, round_number)
);

create table if not exists aviator_challenge_scores (
  challenge_id text not null references aviator_challenges(challenge_id) on delete cascade,
  participant_id text not null,
  points integer not null default 0 check (points >= 0),
  correct integer not null default 0 check (correct >= 0),
  settled_rounds integer not null default 0 check (settled_rounds >= 0),
  updated_at timestamptz not null default now(),
  primary key (challenge_id, participant_id)
);

create table if not exists aviator_audit_events (
  event_id bigint generated always as identity primary key,
  event_type text not null,
  actor_id text,
  entity_type text not null,
  entity_id text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists aviator_audit_entity_idx on aviator_audit_events(entity_type, entity_id, created_at desc);
