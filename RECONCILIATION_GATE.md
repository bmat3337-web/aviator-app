# RECONCILIATION GATE

The platform has an explicit settlement reconciliation model.

- MATCHED: provider, internal bet and ledger payout agree.
- MISSING: required internal or ledger settlement is absent.
- MISMATCH: settlement exists but state or payout amount differs.
- DUPLICATE: more than one ledger payout is associated with the provider settlement key.

Reconciliation is observational and corrective; it does not silently mutate financial history. Exceptions require controlled operational workflows.
