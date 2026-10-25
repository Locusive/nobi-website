# Shop Nobi agent discovery, 48-hour test

> # Goal and baseline
> - [x] Use the existing public, read-only shopping MCP server. Its registry listing and several directory listings are already live, so do not resubmit them.
> - [x] Establish an Oct 23 23:40 to Oct 25 23:40 UTC comparison window from the read-only `nobi.ai_assistant_search_event_fields` reporting view. The query was dry-run first (20,923,319 bytes) and executed under a 256 MiB billing cap.
> - [x] Separate product searches from page lookups, registry checks, internal QA and human click-outs. The visible rows include 13 Claude product calls on Oct 24 and 6 Codex plus 33 Cowork product calls on Oct 25; whether these are external adopters is unknown. Two Oct 25 ChatGPT click events appear, but this aggregate alone does not prove an independent shopper.
>
> # Intervention
> - [x] Add the actual Shop Nobi shopping MCP endpoint and its two tools to agent-readable `llms.txt`, separate from Nobi's business-sales MCP server.
> - [x] Add a copyable Gemini CLI HTTP setup command to the existing public MCP onboarding page, using the official Gemini CLI syntax.
> - [ ] Run the normal build and relevant tests, review the exact diff, release by normal feature PR, and verify the live page and `llms.txt` once.
>
> # Readout
> - [ ] Compare the next 48-hour UTC window ending Oct 27 at about 23:40 with the baseline using the same reporting view after its refresh lag.
> - [ ] Report non-probe, non-operator product tool calls, distinct conversations, Shop Nobi page tool calls, attributable site searches and shopper product click-outs separately. Unknown identities or missing downstream data stay unknown.
> - [ ] Call this a meaningful acquisition result only if genuine external agent use rises and yields shopper action. Registry probes, our own tests and raw impressions are insufficient. If there is no genuine adoption, stop this onboarding variant and choose a distribution partner instead.

No paid ads, affiliate account work, account access, outreach or new software dependency is part of this test. The 48-hour result is a readout, not a promised traffic increase.
