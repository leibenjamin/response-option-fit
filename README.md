# Response Option Fit Lab

Response Option Fit Lab is a static editorial exhibit about how survey response
options shape data before analysis begins. It uses five neutral specimens from
public U.S. Census Bureau questionnaire-testing materials to show how labels,
broad buckets, false premises, category boundaries, and sequence context can
misroute otherwise valid respondent answers.

The project demonstrates a source-backed React and TypeScript interface with a
route diagram, specimen rail, source appendix, claim boundary, static security
headers, and Playwright coverage for desktop, mobile, attribution, accessibility,
and privacy-facing invariants.

## Sources And Attribution

Examples are drawn from public U.S. Census Bureau reports and one public Census
research presentation. The app uses short wording excerpts and public report
references for editorial study. It does not reproduce Census logos, screenshots,
or PDF imagery, and it does not validate alternate wording.

The app code is MIT licensed. Short source wording excerpts and report
references remain attributable to their respective public sources; no Census
endorsement is implied.

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

## Test

```bash
npx playwright install chromium
npm run test:e2e
```

The Playwright suite covers load behavior, specimen switching, source links,
claim boundaries, no freeform text inputs, security-header expectations,
keyboard affordances, contrast, reduced motion, and desktop/mobile layout.

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
- It includes five specimens and does not claim to generalize across all survey
  instruments, modes, or populations.
- Summaries are neutral paraphrases; the cited reports remain authoritative.
- Repair directions are conceptual and are not validated replacement wording.

## License

MIT for the application code. Source excerpts and public report references
remain attributable to their original public sources.
