# Challenge Engine

## Challenge
A scheduled event with eligibility, task/scoring rules and reward configuration.

Statuses:
DRAFT -> SCHEDULED -> ACTIVE -> FINISHED
SCHEDULED/ACTIVE may also transition to CANCELLED.

## Mission
Objective -> progress -> completion -> reward entitlement.

## Race
Objective/scoring -> sorted leaderboard -> final ranking -> prize settlement.

## Tournament
Qualification -> scoring -> leaderboard freeze -> rank validation -> reward settlement.

## Safety properties
- Progress updates are idempotent.
- Completion is unique per user/challenge.
- Rewards are entitlements before wallet mutation.
- Leaderboards are frozen before prize settlement.
- Challenge logic does not modify game outcome generation.

## Generic model
```ts
type Challenge = {
  id: string;
  type: "MISSION" | "RACE" | "TOURNAMENT";
  status: "DRAFT" | "SCHEDULED" | "ACTIVE" | "FINISHED" | "CANCELLED";
  startsAt: string;
  endsAt: string;
  eligibility: unknown;
  task: unknown;
  scoring?: unknown;
  reward: unknown;
};
```
