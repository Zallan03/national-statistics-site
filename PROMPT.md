# PROMPT — best-national-statistics-site-20261126-0539

Build the best national statistics site you can for make.fun's bounty
($50, top 10 share it): a working static site, shown in screenshots, with
the pages, charts and sections a visitor exploring a country's statistics
needs, each reached by a link, with real figures in place and every control
doing what it says — nothing empty, broken or placeholder. Original design,
text and names only; never copy another site's brand, text or images.

Pick Indonesia and use rounded public figures (BPS, World Bank, 2022–2024),
each labelled with its year, with a Sources page. Build: Dashboard (KPI cards
with a working year selector, GDP-growth line chart, age bars), Population,
Economy (chart tabs + indicators table), Health & Education, Regions
(sortable, searchable province table with row detail), Sources. Draw charts
as inline SVG from your own data file; no external libraries, no network
requests, all references local files. Make it mobile-friendly.

Take 4 real screenshots in headless Chromium (desktop cover, economy, regions,
phone) and check each is ≤ 256 KiB with long side ≤ 1280 and short side
≥ 360. `main.ts` (Node 22) copies app/ + screenshots/ to /output and writes
dossier.json with the kit's vendored buildDossier, then self-checks the
dossier by rebuilding it. Run main.ts twice to two output dirs and confirm
byte-identical output. Verify every screenshot visually before finishing.
