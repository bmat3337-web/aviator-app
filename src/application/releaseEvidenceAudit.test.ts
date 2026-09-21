export {};
type EvidenceState = "PENDING" | "SUBMITTED" | "VERIFIED" | "ACCEPTED";

interface EvidenceAuditEvent {
  eventId: string;
  gateId: string;
  from: EvidenceState;
  to: EvidenceState;
  actor: string;
  occurredAt: string;
  requestId: string;
}

const events: EvidenceAuditEvent[] = [];

function record(event: EvidenceAuditEvent): void {
  if (!event.eventId || !event.gateId || !event.actor || !event.requestId) {
    throw new Error("Evidence audit event is incomplete");
  }
  if (events.some((existing) => existing.eventId === event.eventId)) {
    throw new Error("Duplicate evidence audit event");
  }
  events.push(Object.freeze({ ...event }));
}

record({
  eventId: "evt-001",
  gateId: "foundation-acceptance",
  from: "PENDING",
  to: "SUBMITTED",
  actor: "foundation-ci",
  occurredAt: "2026-09-21T00:00:00Z",
  requestId: "req-001",
});

record({
  eventId: "evt-002",
  gateId: "foundation-acceptance",
  from: "SUBMITTED",
  to: "VERIFIED",
  actor: "foundation-ci",
  occurredAt: "2026-09-21T00:01:00Z",
  requestId: "req-002",
});

record({
  eventId: "evt-003",
  gateId: "foundation-acceptance",
  from: "VERIFIED",
  to: "ACCEPTED",
  actor: "release-approver",
  occurredAt: "2026-09-21T00:02:00Z",
  requestId: "req-003",
});

if (events.length !== 3) throw new Error("Evidence audit trail was not retained");
if (events[0].from !== "PENDING" || events[2].to !== "ACCEPTED") {
  throw new Error("Evidence audit sequence is invalid");
}

try {
  record({
    eventId: "evt-003",
    gateId: "foundation-acceptance",
    from: "ACCEPTED",
    to: "PENDING",
    actor: "release-approver",
    occurredAt: "2026-09-21T00:03:00Z",
    requestId: "req-004",
  });
  throw new Error("Duplicate audit event was accepted");
} catch (error) {
  if (error instanceof Error && error.message === "Duplicate audit event was accepted") throw error;
}

console.log("AVIATOR EVIDENCE AUDIT VERIFIED: TRANSITIONS ARE TRACEABLE AND DUPLICATES REJECTED");
