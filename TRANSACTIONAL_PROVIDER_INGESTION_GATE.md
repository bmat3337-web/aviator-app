# TRANSACTIONAL PROVIDER INGESTION GATE

Provider event persistence now has a transaction boundary.

1. Validate the provider event before entering persistence.
2. Open one database transaction for duplicate detection, sequence inspection, and insertion.
3. Reject an already-seen event as DUPLICATE.
4. Reject a non-monotonic sequence as OUT_OF_ORDER.
5. Insert and commit the event atomically.
6. Roll back on any database error.

Production hardening still requires database isolation/locking appropriate to the deployed PostgreSQL configuration and provider callback concurrency profile. This foundation does not claim production certification.
