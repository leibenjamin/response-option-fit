# Response Option Fit Lab

Response Option Fit Lab is the project name for a static editorial exhibit about
survey answer choices that do not match what people know. The public page now
leads with the literal title "When answer choices don't give the respondent's
answer a clear place to go" and uses twelve worked examples from public
questionnaire-testing materials and synthetic teaching cases to show six
recurring answer-choice problems.

The project demonstrates a React and TypeScript interface with two
synthetic-primary case labs, ten five-step worked examples, source anchors,
surrounding question context, source appendix, claim boundary, static security
headers, and local-only settings controls. The page
is organized as four hash-routed views — an overview that opens with a short
interactive demonstration, carries one fully-working embedded example, and
keeps the six-pattern map an overlay a click away; a walk-through that
paginates the remaining examples with a sticky map and recap interstitials; a
field guide with reusable tests, checklists, and static prompts for visitors
reviewing their own surveys; and a reference shelf for the glossary, method
note, claim boundary, and source appendix.

## Sources And Attribution

Examples use a hybrid posture. Synthetic teaching cases may lead a lesson when
that improves clarity, and public U.S. Census Bureau or Office for National
Statistics materials provide the evidence anchors. The app uses short wording
excerpts and public report references for editorial study. It does not
reproduce agency logos, screenshots, or PDF imagery, and it does not validate
alternate wording.

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

## Limitations

- This is an editorial exhibit, not a survey analyzer or measurement tool.
- It includes twelve worked examples and does not claim to generalize across all
  survey instruments, modes, or populations.
- Summaries are neutral paraphrases; the cited reports remain authoritative.
- Examples 01–02 use synthetic-primary case labs. Examples 03–12 use the
  five-step worked-example format.
- Teaching-case labels are not source claims. Public reports remain the
  authority for reported quotes, findings, and recommendations.
- Repair directions are conceptual and are not validated replacement wording.

## Performance Budget

Release budget for the public exhibit. These targets are spacious guardrails
against accidental bloat, not editorial compression rules: a useful release can
exceed them when the added weight is explicit, measured, and worth the tradeoff.

- LCP under 1.8 s on a Slow-4G profile.
- Initial JavaScript under 200 KB gzipped.
- Lazy route chunks under 75 KB gzipped each.
- Total CSS under 90 KB gzipped.
- All interaction is client-side; no third-party runtime requests. Lazy route
  chunks may load from the same origin when the visitor opens a route such as
  the field guide.
- Any budget overage should be called out in release notes with current build
  numbers and the reason the added weight is justified. Useful teaching content
  should be measured and route-split where appropriate, not trimmed merely to
  satisfy an arbitrary old byte ceiling.

## Privacy Budget

The exhibit is static and runs entirely in the browser. The project commits
to:

- No backend, no analytics, no cookies, no third-party origins in the runtime
  bundle.
- No PII collected or transmitted under any condition.
- Current persistence is limited to opt-in, on-device settings data
  (`localStorage`). The Settings surface supports JSON export/import/clear and
  shows the exact stored keys and values for transparency. When Remember is on,
  the names of examples opened in walk mode and local practice notes from
  predefined choices are stored locally so the knowledge map and practice
  state can resume across visits; when Remember is off, walk and practice
  progress is in-memory only and is lost on reload.
- Practice notes are lightweight teaching-state records, not a score,
  account, analytics trail, or validation of any survey wording.
- No user input is sent off-device. The exhibit deliberately contains no
  freeform text inputs, and the prompt pack is static copy for tools the user
  chooses outside this site when reviewing their own survey material.

## License

The application source code is licensed under the **MIT License**; see
[LICENSE](LICENSE).

Editorial content (exhibit text, answer frames, answer-choice diagrams, authored
scenario wording, wording-feature questions, quick-practice cases, method notes, glossary entries,
claim-boundary language, and colophon prose) is licensed under
**Creative Commons Attribution 4.0 International (CC BY 4.0)**; see
[CONTENT-LICENSE.md](CONTENT-LICENSE.md).

Quoted source material (short tested-wording excerpts, respondent and
interviewer quotations, section and page references, and report titles
cited from U.S. Census Bureau and UK Office for National Statistics
publications) remains under its original terms — public-domain U.S.
Government works for Census materials, and the Open Government Licence
v3.0 for ONS materials.
