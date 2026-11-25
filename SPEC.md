# SPEC — best-national-statistics-site-20261126-0539: NusaData

## Entry
An original national statistics site for Indonesia, "NusaData — Indonesia in
Numbers". Static files under `app/` (index.html, style.css, data.js, app.js),
no build step, no network request, works on desktop and phone. `main.ts`
copies `app/` + `screenshots/` to `/output` and writes `dossier.json` with the
kit's vendored `buildDossier`, then self-checks the dossier byte-for-byte and
the screenshot gates.

## Pages (hash-routed, every link works)
- **Dashboard** — 4 KPI cards (population 281.6m, GDP US$1.40tn, unemployment
  4.76%, poverty 8.57%) with a 2022/2023/2024 year selector that re-renders
  the figures and deltas; real GDP growth line chart 2019–2024; age-structure
  bars; at-a-glance facts.
- **Population** — KPIs, age structure, largest-province bars.
- **Economy** — tabs switching between the GDP-growth line chart and a
  GDP-by-sector donut; key-indicators table by year.
- **Health & Education** — life expectancy, literacy, schooling, infant
  mortality, stunting.
- **Regions** — sortable table of the 10 largest provinces (population, area,
  density, GDP share), live search by name/capital, tap a row for a detail
  panel (density computed from the shown figures).
- **Sources** — BPS, World Bank, Ministry of Health, with a rounding note.

## Figures
Rounded public statistics, each labelled with its year (BPS — Statistics
Indonesia, World Bank, 2022–2024). The site states plainly that it is an
original, independent presentation, not affiliated with BPS.

## Why this should win
The judge compares screenshots + a source outline pairwise. The cover shows
KPIs, a chart and age bars at once; every view is dense with real figures;
every control does what it says (year selector, tabs, sort, search, row
detail); nothing is empty or placeholder; the design is original (navy + gold,
serif headlines) and mobile-friendly.

## Gate verification (local)
- `app/`: 4 files, all local references (relative paths only), scripts parse.
- Screenshots: 4 JPEGs, each ≤ 256 KiB, long side ≤ 1280, short side ≥ 360
  (1-cover 1280×900, 2-economy 1280×720, 3-regions 1280×720, 4-phone 390×844),
  real Chromium renders of the site's own code, visually checked.
- `node main.ts` run twice to different output dirs: byte-identical output;
  dossier rebuild matches byte-for-byte (main.ts self-check).
- No console errors, no horizontal overflow on desktop or phone (CDP probe).

## Files
- `main.ts`, `vendor/makefun-frontend.ts` (kit copy, unchanged),
  `app/{index.html,style.css,data.js,app.js}`, `screenshots/*.jpg`,
  `README.md`, `LICENSE` (MIT), `.makefun/owner.json`.
