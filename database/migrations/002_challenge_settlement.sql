-- Challenge persistence and settlement idempotency
create table if not exists aviator_challenge_round_settlements (
  challenge_id text not null references aviator_challenges(challenge_id) on delete cascade,
  round_number integer not null check (round_number > 0),
  actual_state text not null check (actual_state in ('LOW','MID','BASE','HIGH','EXTREME')),
  settled_at timestamptz not null default now(),
  primary key (challenge_id, round_number)
);

create index if not exists aviator_predictions_participant_idx
  on aviator_challenge_predictions (participant_id, challenge_id);

create index if not exists aviator_scores_rank_idx
  on aviator_challenge_scores (challenge_id, points desc, correct desc, participant_id asc);

-- Transactional settlement function. A repeated call for the same round
-- returns without awarding points twice.
create or replace function settle_aviator_challenge_round(
  p_challenge_id text,
  p_round_number integer,
  p_actual_state text
) returns void
language plpgsql
as $$
declare
  inserted_count integer;
  challenge_current_round integer;
  challenge_total_rounds integer;
  challenge_state text;
begin
  select current_round, total_rounds, state
    into challenge_current_round, challenge_total_rounds, challenge_state
  from aviator_challenges
  where challenge_id = p_challenge_id
  for update;

  if not found then
    raise exception 'CHALLENGE_NOT_FOUND';
  end if;

  if challenge_state <> 'LIVE' then
    raise exception 'CHALLENGE_NOT_LIVE';
  end if;

  if p_round_number <> challenge_current_round + 1 then
    raise exception 'ROUND_NOT_OPEN';
  end if;

  if p_round_number > challenge_total_rounds then
    raise exception 'ROUND_OUT_OF_RANGE';
  end if;

  if p_actual_state not in ('LOW','MID','BASE','HIGH','EXTREME') then
    raise exception 'INVALID_ACTUAL_STATE';
  end if;

  insert into aviator_challenge_round_settlements(challenge_id, round_number, actual_state)
  values (p_challenge_id, p_round_number, p_actual_state)
  on conflict (challenge_id, round_number) do nothing;

  get diagnostics inserted_count = row_count;
  if inserted_count = 0 then
    return;
  end if;

  insert into aviator_challenge_scores(
    challenge_id, participant_id, points, correct, settled_rounds
  )
  select
    p_challenge_id,
    p.participant_id,
    case when p.target_state = p_actual_state then 1 else 0 end,
    case when p.target_state = p_actual_state then 1 else 0 end,
    1
  from aviator_challenge_predictions p
  where p.challenge_id = p_challenge_id
    and p.round_number = p_round_number
  on conflict (challenge_id, participant_id) do update
    set points = aviator_challenge_scores.points + excluded.points,
        correct = aviator_challenge_scores.correct + excluded.correct,
        settled_rounds = aviator_challenge_scores.settled_rounds + 1,
        updated_at = now();

  update aviator_challenges
  set current_round = p_round_number,
      state = case
        when p_round_number >= total_rounds then 'COMPLETED'
        else 'LIVE'
      end
  where challenge_id = p_challenge_id
    and current_round < p_round_number;
end;
$$;
