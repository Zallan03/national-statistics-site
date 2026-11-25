// NusaData — best-national-statistics-site entry (Node 22, standard library only).
//
// The site is this directory's app/ folder: plain static files (index.html,
// style.css, data.js, app.js) with no build step and no network request.
// This program hands it in: it copies app/ and screenshots/ from beside
// this file to /output and writes /output/dossier.json, the summary the
// judge reads (screenshots, first-load files and bytes, and source), using
// the kit's vendored library, unchanged.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) {
  cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });
}

writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  }),
);

// Self-check, mirroring the gate: rebuild the dossier from what was just
// written and require it to match byte for byte, and require the screenshots
// to be within the gate (3 or 4 files, each at most 256 KiB). A mismatch
// means the handover is broken, so fail loudly instead of submitting it.
import { readdirSync, readFileSync, statSync } from 'node:fs';

const writtenDossier = readFileSync(join(out, 'dossier.json'));
const rebuilt = buildDossier(out, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
});
if (!Buffer.from(rebuilt).equals(writtenDossier)) {
  throw new Error('dossier.json does not match a rebuild from /output');
}
const shots = readdirSync(join(out, 'screenshots')).filter((f) => /\.(png|jpe?g)$/i.test(f));
if (shots.length < 3 || shots.length > 4) {
  throw new Error(`expected 3-4 screenshots, found ${shots.length}`);
}
for (const shot of shots) {
  if (statSync(join(out, 'screenshots', shot)).size > 262144) {
    throw new Error(`screenshot ${shot} is over the 256 KiB gate`);
  }
}
