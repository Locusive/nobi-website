> # Keep stale API exports out of shopping-page builds
> - [x] Compare the actual current public title, exact stored rows and current canonical API response. Preserve uncertainty about the old build input.
> - [x] Reproduce stale, persistent-stale, malformed-time and valid-cached-age behavior with real local HTTP tests.
> - [x] Accept listings up to 15 minutes old, accommodating the API cache; retry only stale valid data at most four times under one 60-second budget, without changing the route or source data.
> - [x] Run affected checks and the normal fixture-only website suite. Preserve all product content and RSS identity rules.
> - [ ] Obtain independent source review, normal release and actual public title/link/Story verification. Keep ownership until those outcomes exist.
