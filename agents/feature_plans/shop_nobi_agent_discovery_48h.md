# Shop Nobi agent discovery, 48-hour test

> # Goal and baseline
> - [x] Use the existing public, read-only shopping MCP server. Its registry listing and several directory listings are already live, so do not resubmit them.
> - [x] Establish an Oct 23 23:40 to Oct 25 23:40 UTC comparison window from the read-only `nobi.ai_assistant_search_event_fields` reporting view. The query was dry-run first (20,923,319 bytes) and executed under a 256 MiB billing cap.
> - [x] Separate product searches from page lookups, registry checks, internal QA and human click-outs. The visible rows include 13 Claude product calls on Oct 24 and 6 Codex plus 33 Cowork product calls on Oct 25; whether these are external adopters is unknown. Two Oct 25 ChatGPT click events appear, but this aggregate alone does not prove an independent shopper.
>
> # Intervention
> - [x] Add the actual Shop Nobi shopping MCP endpoint and its two tools to agent-readable `llms.txt`, separate from Nobi's business-sales MCP server.
> - [x] Add a copyable Gemini CLI HTTP setup command to the existing public MCP onboarding page, using the official Gemini CLI syntax.
> - [x] Run the initial normal build and all 313 website tests with zero failures or skips. Opened PR 478 on the isolated feature branch.
> - [x] Rebuild after the search pages and pass the full 314-test suite with zero failures or skips. The first new assertion exposed a markup-sensitive test expectation, which was corrected and rerun; product copy was unchanged.
> - [ ] Review the final diff, release by normal feature PR, and verify the live page and `llms.txt` once.
>
> # Search-intent pages
> - [x] Check current search results and official provider docs. Strong honest intent: shopping MCP server, product search MCP, AI shopping agent product search, cross-store search. No query-volume or ranking estimate was established.
> - [x] Improve the product page for that intent and write two distinct pages: a shopping MCP comparison and an API-versus-MCP shopping-app guide.
> - [x] Verify both articles render as distinct HTML pages, appear in the sitemap, and include the relevant source and setup links.
> - [ ] Publish through the same normal PR.
> - [ ] Evaluate their indexing and qualified organic visits later; search ranking is not expected within this 48-hour window.
>
> # Readout
> - [ ] Compare the next 48-hour UTC window ending Oct 27 at about 23:40 with the baseline using the same reporting view after its refresh lag.
> - [ ] Report non-probe, non-operator product tool calls, distinct conversations, Shop Nobi page tool calls, attributable site searches and shopper product click-outs separately. Unknown identities or missing downstream data stay unknown.
> - [ ] Call this a meaningful acquisition result only if genuine external agent use rises and yields shopper action. Registry probes, our own tests and raw impressions are insufficient. If there is no genuine adoption, stop this onboarding variant and choose a distribution partner instead.

No paid ads, affiliate account work, account access, outreach or new software dependency is part of this test. The 48-hour result is a readout, not a promised traffic increase.
