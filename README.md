# Response Option Fit Lab

**Live → [benlei.org/response-option-fit](https://benlei.org/response-option-fit/)**

![The Response Option Fit Lab: the title "The quiet ways a survey lies" beside the interactive opening hook (place your day on a feeling strip; watch the form's coarse boxes round it off), above a jump-to-exercise contents rail and the first exercise beginning below.](docs/lab-screenshot.png)

Response Option Fit Lab is a static, interactive teaching lab about how survey
answer choices can quietly distort what a survey measures. The deployed home is
a single SQLBolt-style practice page, titled "The quiet ways a survey lies.",
that walks the visitor through twelve hands-on exercises — each one a different
way a response-option set can fail.

Each exercise is compact and hands-on: tinker with a control (build a rating
scale, repair keyed age-bucket bands, choose an answer set, screen a false
premise, compare question formats, build a verbal ruler, expose a vague-word
collision, or classify lists before setting order rules), watch a fixed cast of
authored respondents flow through, and read the consequence. The active solving
loop keeps the current task guidance, controls, and primary consequence
together, while secondary readouts and deeper context open as shelves. Wrong
moves are part of the practice — they show what would have shipped. A solved
exercise opens a source drawer with the real field vocabulary for what you just
did, an honest
evidence-strength label, the boundary of what not to overclaim, and named
sources. A closing
knowledge map organizes the twelve exercises into four inspection passes (the
lab's own SLOT / RULER / PUSH / BOUNDARY shorthand), marks what it did and did
not cover, distinguishes the lab's shorthand from real terms of art, and lists
further reading. A quiet completion indicator (and a check on each solved
exercise in the contents rail) keeps the endpoint visible; finishing all twelve
unlocks a self-issued completion keepsake — copy-as-Markdown or a downloadable
PNG, with your coverage, takeaways, sources, and a content-checksum stamp — to
keep.

The cast in each exercise is illustrative — a small authored set to reason
about, not real respondents or survey statistics. The one honesty rule is that
authored content is labeled as authored; the lab never presents invented
numbers as empirical findings, and softens any claim past what the cited
evidence supports.

An earlier version of this project was a multi-route exhibit — a guided
twelve-puzzle "walk" of Census-sourced answer-choice traps, an overview hub, a
build-and-break export trap, a reviewer field guide, and a reference shelf. That
exhibit was retired on 2026-05-31 in favor of the focused lab; it remains in the
git history, and its old URL hashes now resolve to the lab so older links still
land on the current home. A production-notes colophon is reachable at
`#colophon`. React + TypeScript + Vite; hash routing; static security headers;
local-only settings controls; no backend or automated analyzer.

## Sources And Attribution

The lab uses an interaction-first, author-first teaching posture. The exercise
scenarios and their casts are authored teaching material, written to make the
interaction inspectable; they are labeled as authored and illustrative, not as
observed respondent behavior or population estimates. Where the lab states a
design principle, the per-exercise source drawers name the standard
survey-methodology references behind it (Pew Research Center, Krosnick &
Presser, AAPOR, the CDC/NCHS Q-Bank, and others) and carry an honest
evidence-strength label, so a "textbook consensus" claim is not dressed the
same as a "contested" or "directionally supported" teaching contrast. The app
does not reproduce agency logos, screenshots, or PDF imagery, and it does not
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
source drawers, the sticky contents rail, and the completion keepsake),
checks the lab data contract (receipts, source drawers, and knowledge-map links
stay internally consistent), and checks that no freeform survey input or
automated analyzer exists. For accessibility it runs axe-core (WCAG 2.0/2.1 A and AA plus
landmark best-practices) on the lab, the colophon, and the fully-solved
keepsake state; verifies keyboard operation (skip link, the Settings dialog's
focus trap, contents-rail focus moves, and solving an exercise by keyboard); and
confirms reduced-motion and forced-colors modes stay readable with no horizontal
overflow on desktop, mobile, or a 320px reflow viewport. The suite also guards
the reduced desktop workbench target at 1280x720, checks that the visible
`What to settle` task guidance is not clipped across desktop/mobile/reflow
widths, and runs a 1.1 large-text/zoom proxy so task, controls, and primary
consequence do not regress into a scroll-heavy loop. Every browser-driven test
runs in Chromium, Firefox, and WebKit (Safari's engine).

## Limitations

- This is an interactive teaching lab, not a survey analyzer or measurement tool.
- It is twelve authored lab exercises and does not claim to generalize across all
  survey instruments, modes, or populations. The per-exercise casts are
  illustrative, not effect-size estimates.
- Exercise cases are authored teaching situations. Named public sources support
  the design principle behind an exercise, not the specific authored cast.
- Teaching-case labels are not source claims. Public reports remain the
  authority for reported quotes, findings, and recommendations.
- Repair directions are conceptual and are not validated replacement wording.

## Performance Posture

Performance is measured so accidental bloat is visible, but old byte ceilings
are not product constraints. The app should spend bytes on distinctive
interaction, motion, and visual feedback when those make the lab meaningfully
better. Route-splitting and pruning are tools, not reasons to flatten the
experience back into dry text.

Current measured production build (2026-06-09):
entry JavaScript `51.68 KB gzip` plus the lab home route chunk `60.71 KB gzip`,
CSS `17.09 KB gzip`. The lab home route is code-split and loads on demand. All
interaction is client-side. The only third-party runtime request is a
privacy-friendly, cookieless analytics beacon (Cloudflare Web Analytics); see
[docs/deployment.md](docs/deployment.md).

## Privacy Budget

The exhibit is static and runs entirely in the browser. The project commits
to:

- Privacy-respecting by default: no ad tech, no cookies for cross-site tracking,
  no third-party origins in the runtime bundle, and no selling of data. Visitor
  analytics use Cloudflare Web Analytics — cookieless and aggregate (no personal
  data, no cross-site tracking) — acknowledged in the colophon.
- No PII collected or transmitted under any condition.
- On-device progress: with Remember on (its default), the exercises you've
  finished and your completion count are kept in `localStorage` so they resume
  across visits; turn it off in Settings and they stay in memory and reset on
  reload. The Settings surface shows the exact stored keys and values and
  supports JSON export/import/clear.
- No user input is sent off-device. The exhibit deliberately contains no
  freeform text inputs; there is nothing to submit, and nothing about how you
  work through the exercises is transmitted.

## License

The application source code is licensed under the **MIT License**; see
[LICENSE](LICENSE).

Editorial content (exercise scenarios and cast wording, task and feedback copy,
the source-drawer field-term glosses and evidence labels, the closing
knowledge-map prose, method notes, glossary entries, claim-boundary language,
and colophon prose) is licensed under
**Creative Commons Attribution 4.0 International (CC BY 4.0)**; see
[CONTENT-LICENSE.md](CONTENT-LICENSE.md).

Quoted source material (short tested-wording excerpts, respondent and
interviewer quotations, section and page references, and report titles
cited from U.S. Census Bureau publications) remains under its original terms:
public-domain U.S. Government works for Census materials.
