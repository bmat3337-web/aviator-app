# Flight Application Boundary v1

The Flight surface consumes a normalized FlightSnapshot. It does not calculate provider outcomes, provider timing, RNG, or authoritative financial state.

Flow:

UI → Flight application boundary → ProviderAdapter → provider/simulator

The boundary preserves independent Bet 1 and Bet 2 state and exposes the source only for diagnostics.

Production rule: the provider contract, not this boundary, determines authoritative Aviator round outcomes. The simulator is development/testing only.
