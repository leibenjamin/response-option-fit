# Response Option Fit Lab

Response Option Fit Lab is a static interactive problem-solving lab about survey
answer choices that do not give a respondent's answer a clear route. The public
page leads with the title "When answer choices don't give the respondent's
answer a clear place to go" and now treats the twelve puzzles as authored
interactive puzzles, not as a source-first article or citation exhibit.

The project demonstrates a React and TypeScript interface with twelve
interaction modules, an opening hook, an answer-set builder/export trap, a
cold-read capstone, a field guide, optional source backmatter, static security
headers, and local-only settings controls. The overview opens with a plausible
one-word commute-response intake hook and one full embedded commute puzzle. The
walk paginates
twelve answer-choice traps, each with a role, a task, immediate feedback, a
visible consequence ledger or trace, and a small reveal. The build route lets
visitors assemble choices and then inspect the tidy export those choices would
leave behind. The field guide turns the interaction moves into reusable checks
and prompts. The reference shelf keeps glossary, method, claim-boundary, and
source material out of the primary play path.

## Sources And Attribution

Puzzles use a delight-first teaching posture. Most on-screen cases, people,
routes, feedback lines, and consequences are authored teaching material built
to make the interaction satisfying and inspectable. Public U.S. Census Bureau
materials remain as optional anchors and backmatter, not as the main reason to
use the app. The active slate no longer includes the retired identity examples
from the earlier ONS-backed draft. The app does not reproduce agency logos,
screenshots, or PDF imagery, and it does not validate alternate wording.
Primary copy avoids invented methods jargon such as `storage rule`; the app
uses plain answer-rule language in the puzzle flow and reserves recorded,
coded, or exported wording for form-operation or downstream data contexts.

The app code is MIT licensed. Short source wording excerpts and report
references remain attributable to their respective public sources; no
source-agency endorsement is implied.

See [docs/source-notes.md](docs/source-notes.md) for the source list and
attribution posture.

## Run Locally

```bash
npm install
npm run dev
```

Open http://localhost:5173.

## Build

```bash
npm run build
npm run preview
```

The build emits relative asset paths, so the same artifact works at the root
or behind a subpath mount with no extra coordination.

`npm run build:subpath` is preserved as an explicit alias and produces the same
output. For an absolute mount path, set `VITE_BASE_PATH` to the public path
with leading and trailing slashes, then run `npm run build` (or use
`VITE_BASE_PATH=/` for an absolute root build).

## Deployment

The app is a static Vite build. `public/_headers` provides Cloudflare Pages and
Netlify-compatible security and cache headers. A Cloudflare Worker mount helper
is included at
[cloudflare/worker-mount-response-option-fit.js](cloudflare/worker-mount-response-option-fit.js)
for serving the app under `/response-option-fit/`.

See [docs/deployment.md](docs/deployment.md) and
[docs/security.md](docs/security.md) for deployment and hardening details.

## Test

```bash
npm test
```

The Playwright suite verifies that every walk puzzle renders an interactive
surface, no route falls back to exposition, no freeform survey input or runtime
automation exists, reduced-motion and forced-colors modes remain readable, and desktop /
mobile routes avoid horizontal overflow.

## Limitations

- This is an interactive teaching lab, not a survey analyzer or measurement tool.
- It includes twelve authored puzzles and does not claim to generalize across all
  survey instruments, modes, or populations.
- Puzzle cases are authored teaching situations unless explicitly marked as
  source material. Public reports remain optional context for the original
  answer-choice problem.
- The commute answer-set builder topic is anchored to ACS commute materials, but
  its named situations are authored teaching situations. Its official
  longest-distance rule is the only source-supported build rule; the other
  commute rules are authored teaching instructions. The sandwich topic and all
  sandwich rules are teaching cases only.
- Teaching-case labels are not source claims. Public reports remain the
  authority for reported quotes, findings, and recommendations.
- Repair directions are conceptual and are not validated replacement wording.

## Performance Posture

Performance is measured so accidental bloat is visible, but old byte ceilings
are not product constraints. The app should spend bytes on distinctive
interaction, motion, and visual feedback when those make the lab meaningfully
better. Route-splitting and pruning are tools, not reasons to flatten the
experience back into dry text.

Current measured build after the POV terminology pass: initial
JavaScript `87.07 KB gzip`, CSS `16.39 KB gzip`. All interaction is client-side; no
third-party runtime requests are expected.

## Privacy Budget

The exhibit is static and runs entirely in the browser. The project commits
to:

- No backend, no analytics, no cookies, no third-party origins in the runtime
  bundle.
- No PII collected or transmitted under any condition.
- Current persistence is limited to opt-in, on-device settings data
  (`localStorage`). The Settings surface supports JSON export/import/clear and
  shows the exact stored keys and values for transparency. When Remember is on,
  the names of puzzles opened in walk mode are stored locally so the knowledge
  map can resume across visits; when Remember is off, walk progress is
  in-memory only and is lost on reload. The walk puzzles and the answer-set
  builder do not persist per-choice or per-rule interaction state.
- No user input is sent off-device. The exhibit deliberately contains no
  freeform text inputs, and the prompt pack is static copy for tools the user
  chooses outside this site when reviewing their own survey material.

## License

The application source code is licensed under the **MIT License**; see
[LICENSE](LICENSE).

Editorial content (exhibit text, answer frames, authored interaction surfaces,
answer-set builder situation wording, build rules, export-autopsy copy, scenario
wording, wording-feature questions, quick-practice cases, method notes,
glossary entries, claim-boundary language, and colophon prose) is licensed under
**Creative Commons Attribution 4.0 International (CC BY 4.0)**; see
[CONTENT-LICENSE.md](CONTENT-LICENSE.md).

Quoted source material (short tested-wording excerpts, respondent and
interviewer quotations, section and page references, and report titles
cited from U.S. Census Bureau publications) remains under its original terms:
public-domain U.S. Government works for Census materials. Older local research
notes may still mention retired ONS examples; those are not part of the active
app slate.
