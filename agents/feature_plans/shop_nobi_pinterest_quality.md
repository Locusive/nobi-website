# Pinterest quality while automatic posting stays on

- [x] Read the actual RSS path, live audit, website README and design guidance; inspect the page DTO (explicit `isInStock`, numeric `price`, `currency`, safe product/image URLs, and validated `paidLink`).
- [x] Build an RSS-only selection layer with specific product copy, explicit stock/price checks, intact native images and normalized-image/product deduplication. Keep all feed addresses, existing canonical GUIDs, scheduler, website cards and Web Stories unchanged.
- [x] Review at least three actual product-photo examples at Pinterest grid size. Show rejected versus stronger candidates and exact provenance. Dimensions alone do not certify visual appeal.
- [x] Add meaningful tests for earning preference within relevant page results, stock and unsafe images, duplication, specific copy, disclosure, stable identity, empty boards, deterministic limits and unchanged website/story output.
- [x] Run focused tests and an offline-fixture full build/test. Measure feed coverage on saved observations without calling stale source current.
- [ ] Give root the exact diff and visual examples. No push, hosted CI, PR, deployment or production Pin/feed/settings mutation before root review.

## Design choice

Pinterest is a visual product discovery channel. The hero must make the shopping product recognizable, with useful contrast at roughly 236px wide. People or pets can add useful scale or context; they are not globally banned. Prefer useful, distinctive merchandise over generic category filler; country of manufacture or luxury positioning is not a quality verdict. Select only from the existing page's relevant results, and prefer a confirmed earning route within that eligible set.

Keep supplied product pictures intact. No AI product depictions, invented features, center crops or merchant-photo composites without rights. A separate portrait renderer adds transformation rights, build dependencies and thousands of files before it solves wrong product choice; the first change should solve selection and repetition. Review native photos visually before treating a particular hero as editorially approved.

The review board uses Nobi violet #743CFF, ink #222234, white #FFFFFF, pale lavender #F2EEFF and soft gray #F3F4F6. Use the site's existing sans-serif family with a large product image and short factual identity. These tokens organize the review only; they do not imply a newly branded image has been published.

## Acceptance

- Automatic publication remains configured; all 19 board feed paths and the combined feed remain present, including empty boards.
- No item selects an explicitly unavailable product, malformed/non-HTTPS image, absent/nonpositive price or unconfirmed currency.
- No selected normalized image or product destination repeats across different emitted automatic items in one generated snapshot; combined/board copies of the SAME GUID are expected.
- A relevant eligible earning product can replace an unmonetized first result; non-affiliate editorial products remain eligible.
- No unsupported Best/Top Stores claim, fabricated date, force-repost GUID or changed shopper ranking.
- Three reviewed real photo comparisons make the aesthetic bar concrete, including rejected composition and resolution limits.
- Source, tests and before/after evidence are saved locally; root reviews before release.
