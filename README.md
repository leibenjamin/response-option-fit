# Response Option Fit Lab

Response Option Fit Lab is a static editorial exhibit about how survey response
options shape data before analysis begins. It uses twelve neutral specimens from
public questionnaire-testing materials to show how labels,
broad buckets, false premises, category boundaries, and sequence context can
misroute otherwise valid respondent answers, including cases where a single
precise answer is forced from variable experience.

The project demonstrates a source-backed React and TypeScript interface with a
Specimen Workbench, full item-context answer frames, source appendix, claim
boundary, static security headers, and local-only settings controls.

## Sources And Attribution

Examples are drawn from public U.S. Census Bureau and Office for National
Statistics materials. The app uses short wording excerpts and public report
references for editorial study. It does not reproduce agency logos,
screenshots, or PDF imagery, and it does not validate alternate wording.

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

Build for a root deployment:

```bash
npm run build
npm run preview
```

Build for `/response-option-fit/`:

```bash
npm run build:subpath
```

For another mount path, set `VITE_BASE_PATH` to the public path with leading and
trailing slashes, then run `npm run build`.

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
- It includes twelve specimens and does not claim to generalize across all survey
  instruments, modes, or populations.
- Summaries are neutral paraphrases; the cited reports remain authoritative.
- The fit labels are teaching labels: **Clean fit**, **Unclear fit**, and
  **Wrong path** describe the highlighted answer path in the Workbench frame.
- Repair directions are conceptual and are not validated replacement wording.

## Performance Budget

Release budget for the public exhibit. These targets are reviewed with
judgment, not treated as a compile-time law: a useful release can exceed them
when the added weight is explicit, measured, and worth the tradeoff.

- LCP under 1.8 s on a Slow-4G profile.
- Total JavaScript under 100 KB gzipped after all interactive modules ship.
- Total CSS under 35 KB gzipped.
- All interaction is client-side; no network requests after initial document
  and assets load.
- Any budget overage should be called out in release notes with current build
  numbers and the reason the added weight is justified.

## Privacy Budget

The exhibit is static and runs entirely in the browser. The project commits
to:

- No backend, no analytics, no cookies, no third-party origins in the runtime
  bundle.
- No PII collected or transmitted under any condition.
- Current persistence is limited to opt-in, on-device settings data
  (`localStorage`). The Settings surface supports JSON export/import/clear and
  shows the exact stored keys and values for transparency. Workbench progress is
  not persisted in this release.
- No user input is sent off-device. The exhibit deliberately contains no
  freeform text inputs.

## License

The application source code is licensed under the **MIT License**; see
[LICENSE](LICENSE).

Editorial content (exhibit text, answer frames, route diagrams, authored
vignette wording, mechanism questions, micro-cases, method notes, glossary entries,
claim-boundary language, and colophon prose) is licensed under
**Creative Commons Attribution 4.0 International (CC BY 4.0)**; see
[CONTENT-LICENSE.md](CONTENT-LICENSE.md).

Quoted source material (short tested-wording excerpts, respondent and
interviewer quotations, section and page references, and report titles
cited from U.S. Census Bureau and UK Office for National Statistics
publications) remains under its original terms — public-domain U.S.
Government works for Census materials, and the Open Government Licence
v3.0 for ONS materials.
