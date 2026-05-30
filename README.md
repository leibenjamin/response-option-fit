# Response Option Fit Lab

Response Option Fit Lab is a static, interactive teaching lab about how survey
answer choices can quietly distort what a survey measures. The deployed home is
a single SQLBolt-style practice page, titled "The quiet ways a survey lies.",
that walks the visitor through twelve hands-on exercises — each one a different
way a response-option set can fail.

Each exercise is compact and hands-on: tinker with a control (build a rating
scale, fix overlapping age buckets, choose an answer set, screen a false
premise, compare question formats, label a scale, anchor vague frequency words,
or set order rules), watch a fixed cast of authored respondents flow through,
and read the consequence. Wrong moves are part of the practice —
they show what would have shipped. A solved exercise opens a source drawer with
the real field vocabulary for what you just did, an honest evidence-strength
label, the boundary of what not to overclaim, and named sources. A closing
knowledge map organizes the twelve exercises into four inspection passes (the
lab's own SLOT / RULER / PUSH / BOUNDARY shorthand), marks what it did and did
not cover, distinguishes the lab's shorthand from real terms of art, and lists
further reading. The latest expansion adds practiced coverage for full verbal
labels, vague quantifiers / fake precision, and standalone option-order
decisions.

The cast in each exercise is illustrative — a small authored set to reason
about, not real respondents or survey statistics. The one honesty rule is that
authored content is labeled as authored; the lab never presents invented
numbers as empirical findings, and softens any claim past what the cited
evidence supports.

A broader exhibit remains reachable by URL hash for reference: an archived
twelve-puzzle "walk" of Census-sourced answer-choice traps (`#walk`), the
previous landing hub (`#hub`), a build-and-break export trap (`#build`), a
reviewer field guide (`#field-guide`), a reference shelf (`#reference`), and a
colophon (`#colophon`). React + TypeScript + Vite; hash routing; static
security headers; local-only settings controls; no backend or automated analyzer.

## Sources And Attribution

The lab uses an interaction-first, author-first teaching posture. The exercise
scenarios and their casts are authored teaching material, written to make the
interaction inspectable; they are labeled as authored and illustrative, not as
observed respondent behavior or population estimates. Where the lab states a
design principle, the per-exercise source drawers name the standard
survey-methodology references behind it (Pew Research Center, Krosnick &
Presser, AAPOR, the CDC/NCHS Q-Bank, and others) and carry an honest
evidence-strength label, so a "textbook consensus" claim is not dressed the
same as a "contested" or "directionally supported" teaching contrast. The
archived walk additionally anchors its twelve puzzles to public U.S. Census
Bureau cognitive-testing reports. The app does
not reproduce agency logos, screenshots, or PDF imagery, and it does not
validate alternate wording.

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

The Playwright suite drives each lab exercise end-to-end (including the gated
source drawers), verifies the archived walk puzzles still render interactive
surfaces with no exposition fallback, checks that no freeform survey input or
automated analyzer exists, and confirms reduced-motion and forced-colors modes stay
readable with no horizontal overflow on desktop or mobile.

## Limitations

- This is an interactive teaching lab, not a survey analyzer or measurement tool.
- It is twelve authored lab exercises (plus an archived twelve-puzzle walk) and
  does not claim to generalize across all survey instruments, modes, or
  populations. The per-exercise casts are illustrative, not effect-size
  estimates.
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

Current measured production build: entry JavaScript `88.23 KB gzip` plus the
lab home route chunk `47.29 KB gzip`, CSS `25.11 KB gzip`. Routes are
code-split, so the walk, build, field guide, and reference shelf load on
demand. All interaction is client-side; no third-party runtime requests are
expected.

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
public-domain U.S. Government works for Census materials.
