import { Suspense, lazy, useEffect, useMemo, useRef, useState } from "react";
import { workbenchSpecimens } from "./data/workbench-specimens";
import { Colophon } from "./components/Colophon";
import { CompletionScreen } from "./components/CompletionScreen";
import { FeaturedExample } from "./components/FeaturedExample";
import { Hero } from "./components/Hero";
import { PatternMapDialog } from "./components/PatternMapDialog";
import { PatternStrip } from "./components/PatternStrip";
import { Reference } from "./components/Reference";
import { SettingsButton } from "./components/SettingsButton";
import { SettingsDrawer } from "./components/SettingsDrawer";
import { WalkLayout } from "./components/WalkLayout";
import { parseHash, routeToHash, type Route } from "./lib/routes";
import { SettingsProvider } from "./lib/settings";
import { useWalkController, type WalkController } from "./lib/walk-state";

const knownSpecimenIds: readonly string[] = workbenchSpecimens.map((s) => s.id);
const FieldGuide = lazy(() =>
  import("./components/FieldGuide").then((module) => ({
    default: module.FieldGuide
  }))
);
const BuildAndBreakRoute = lazy(() =>
  import("./components/BuildAndBreakRoute").then((module) => ({
    default: module.BuildAndBreakRoute
  }))
);
const SatisfactionLab = lazy(() =>
  import("./components/SatisfactionLab").then((module) => ({
    default: module.SatisfactionLab
  }))
);

function currentRoute(): Route {
  if (typeof window === "undefined") return { kind: "hub" };
  return parseHash(window.location.hash, knownSpecimenIds);
}

function useRoute(): Route {
  const [route, setRoute] = useState<Route>(() => currentRoute());

  useEffect(() => {
    const sync = () => setRoute(currentRoute());
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  return route;
}

function Hub({
  controller,
  onSettingsOpen
}: {
  controller: WalkController;
  onSettingsOpen: () => void;
}) {
  const visitedSet = new Set(controller.state.visited);
  /* The Resume CTA points at the specimen the visitor was most recently
     active on, including revisits — not just the most recent newly-opened
     specimen — so navigating 1 → 2 → 1 leaves Resume pointing at 1. */
  const lastVisited = controller.state.lastSpecimenId;
  /* The six-pattern map lives off-scroll in a modal; the hub carries only a
     slim trigger band and the cold-open's reveal both open it. */
  const [mapOpen, setMapOpen] = useState(false);
  const openMap = () => setMapOpen(true);
  return (
    <div className="lab" data-testid="hub">
      <a href="#featured-example" className="skip-link" data-testid="skip-link">
        Skip to the puzzle
      </a>
      <SettingsButton onClick={onSettingsOpen} />
      {/* Hub shell: a grid whose right column is a sticky knowledge-map
         rail spanning both the hero row and the featured-example row.
         On tablet/phone the grid collapses to one column ordered hero,
         knowledge map, then featured example. */}
      <div className="hub-shell">
        <Hero resumeSpecimenId={lastVisited} />
        <aside
          className="hub-knowledge-rail"
          aria-label="Six-pattern knowledge map"
        >
          <PatternStrip onOpenMap={openMap} />
        </aside>
        <main
          className="hub-main"
          aria-label="Overview of the response option fit exhibit"
        >
          <FeaturedExample />
        </main>
      </div>

      <PatternMapDialog
        open={mapOpen}
        onClose={() => setMapOpen(false)}
        visited={visitedSet}
      />

      <footer className="foot">
        <p className="foot-line">
          Static exhibit. No backend, no runtime AI, no network upload, no survey
          analyzer.
        </p>
        <p className="foot-line foot-line--quiet">
          Built for editorial study of response-option fit.
        </p>
        <p className="foot-line foot-line--quiet">
          <a className="foot-link foot-link--preview" href={routeToHash({ kind: "lab" })}>
            Preview a new survey-lab format in progress →
          </a>
        </p>
        <p className="foot-line foot-line--quiet hub-foot-links">
          <a className="foot-link" href={routeToHash({ kind: "fieldGuide" })}>
            Check your own survey draft
          </a>
          <span aria-hidden="true">·</span>
          <a className="foot-link" href={routeToHash({ kind: "build" })}>
            Build an answer set
          </a>
          <span aria-hidden="true">·</span>
          <a className="foot-link" href={routeToHash({ kind: "reference" })}>
            Open the reference shelf
          </a>
          <span aria-hidden="true">·</span>
          <a className="foot-link" href={routeToHash({ kind: "colophon" })}>
            Colophon
          </a>
        </p>
      </footer>
    </div>
  );
}

function ReferenceRoute({ onSettingsOpen }: { onSettingsOpen: () => void }) {
  return (
    <div className="lab lab--reference">
      <a href="#reference" className="skip-link" data-testid="skip-link">
        Skip to reference shelf
      </a>
      <SettingsButton onClick={onSettingsOpen} />
      <Reference />
      <footer className="foot">
        <p className="foot-line foot-line--quiet hub-foot-links">
          <a className="foot-link" href={routeToHash({ kind: "hub" })}>
            ← Back to overview
          </a>
          <span aria-hidden="true">·</span>
          <a className="foot-link" href={routeToHash({ kind: "fieldGuide" })}>
            Check your own survey draft
          </a>
          <span aria-hidden="true">·</span>
          <a className="foot-link" href={routeToHash({ kind: "build" })}>
            Build an answer set
          </a>
          <span aria-hidden="true">·</span>
          <a className="foot-link" href={routeToHash({ kind: "colophon" })}>
            Colophon
          </a>
        </p>
      </footer>
    </div>
  );
}

function FieldGuideRoute({ onSettingsOpen }: { onSettingsOpen: () => void }) {
  return (
    <div className="lab lab--field-guide">
      <a href="#field-guide" className="skip-link" data-testid="skip-link">
        Skip to field guide
      </a>
      <SettingsButton onClick={onSettingsOpen} />
      <Suspense
        fallback={
          <main
            id="field-guide"
            className="field-guide"
            aria-labelledby="field-guide-title"
          >
            <h1
              className="field-guide-title"
              id="field-guide-title"
              tabIndex={-1}
            >
              Loading field guide
            </h1>
          </main>
        }
      >
        <FieldGuide />
      </Suspense>
      <footer className="foot">
        <p className="foot-line foot-line--quiet hub-foot-links">
          <a className="foot-link" href={routeToHash({ kind: "hub" })}>
            ← Back to overview
          </a>
          <span aria-hidden="true">·</span>
          <a className="foot-link" href={routeToHash({ kind: "reference" })}>
            Open the reference shelf
          </a>
          <span aria-hidden="true">·</span>
          <a className="foot-link" href={routeToHash({ kind: "build" })}>
            Build an answer set
          </a>
          <span aria-hidden="true">·</span>
          <a className="foot-link" href={routeToHash({ kind: "colophon" })}>
            Colophon
          </a>
        </p>
      </footer>
    </div>
  );
}

function BuildRoute({ onSettingsOpen }: { onSettingsOpen: () => void }) {
  return (
    <div className="lab lab--build">
      <a href="#build-and-break" className="skip-link" data-testid="skip-link">
        Skip to answer-set builder
      </a>
      <SettingsButton onClick={onSettingsOpen} />
      <Suspense
        fallback={
          <main
            id="build-and-break"
            className="build-route"
            aria-labelledby="build-and-break-title"
          >
            <h1
              className="build-route-title"
              id="build-and-break-title"
              tabIndex={-1}
            >
              Loading answer-set builder
            </h1>
          </main>
        }
      >
        <BuildAndBreakRoute />
      </Suspense>
      <footer className="foot">
        <p className="foot-line foot-line--quiet hub-foot-links">
          <a className="foot-link" href={routeToHash({ kind: "hub" })}>
            ← Back to overview
          </a>
          <span aria-hidden="true">·</span>
          <a className="foot-link" href={routeToHash({ kind: "walk", slot: "ride-hailing" })}>
            Walk all twelve puzzles
          </a>
          <span aria-hidden="true">·</span>
          <a className="foot-link" href={routeToHash({ kind: "fieldGuide" })}>
            Check your own survey draft
          </a>
          <span aria-hidden="true">·</span>
          <a className="foot-link" href={routeToHash({ kind: "reference" })}>
            Open the reference shelf
          </a>
          <span aria-hidden="true">·</span>
          <a className="foot-link" href={routeToHash({ kind: "colophon" })}>
            Colophon
          </a>
        </p>
      </footer>
    </div>
  );
}

function LabRoute({ onSettingsOpen }: { onSettingsOpen: () => void }) {
  return (
    <div className="lab lab--survey-lab">
      <a href="#survey-lab" className="skip-link" data-testid="skip-link">
        Skip to the survey lab
      </a>
      <SettingsButton onClick={onSettingsOpen} />
      <Suspense
        fallback={
          <main
            id="survey-lab"
            className="lab-route"
            aria-labelledby="survey-lab-title"
          >
            <h1
              className="lab-route-title"
              id="survey-lab-title"
              tabIndex={-1}
            >
              Loading survey lab
            </h1>
          </main>
        }
      >
        <SatisfactionLab />
      </Suspense>
      <footer className="foot">
        <p className="foot-line foot-line--quiet">
          Preview of a new format in progress. The twelve puzzles remain the main
          walk for now.
        </p>
        <p className="foot-line foot-line--quiet hub-foot-links">
          <a className="foot-link" href={routeToHash({ kind: "hub" })}>
            ← Back to overview
          </a>
          <span aria-hidden="true">·</span>
          <a className="foot-link" href={routeToHash({ kind: "build" })}>
            Build an answer set
          </a>
          <span aria-hidden="true">·</span>
          <a className="foot-link" href={routeToHash({ kind: "walk", slot: "ride-hailing" })}>
            Walk all twelve puzzles
          </a>
          <span aria-hidden="true">·</span>
          <a className="foot-link" href={routeToHash({ kind: "colophon" })}>
            Colophon
          </a>
        </p>
      </footer>
    </div>
  );
}

function WalkRoute({
  slot,
  controller,
  onSettingsOpen
}: {
  slot: string;
  controller: WalkController;
  onSettingsOpen: () => void;
}) {
  const specimen = useMemo(
    () =>
      slot === "done"
        ? null
        : workbenchSpecimens.find((s) => s.id === slot) ?? null,
    [slot]
  );

  if (slot === "done") {
    return (
      <div className="lab lab--walk-done">
        <a href="#walk-done" className="skip-link" data-testid="skip-link">
          Skip to summary
        </a>
        <SettingsButton onClick={onSettingsOpen} />
        <CompletionScreen visited={new Set(controller.state.visited)} />
        <footer className="foot">
          <p className="foot-line foot-line--quiet hub-foot-links">
            <a className="foot-link" href={routeToHash({ kind: "hub" })}>
              ← Back to overview
            </a>
            <span aria-hidden="true">·</span>
            <a className="foot-link" href={routeToHash({ kind: "reference" })}>
              Open the reference shelf
            </a>
            <span aria-hidden="true">·</span>
            <a className="foot-link" href={routeToHash({ kind: "fieldGuide" })}>
              Check your own survey draft
            </a>
            <span aria-hidden="true">·</span>
            <a className="foot-link" href={routeToHash({ kind: "build" })}>
              Build an answer set
            </a>
            <span aria-hidden="true">·</span>
            <a className="foot-link" href={routeToHash({ kind: "colophon" })}>
              Colophon
            </a>
          </p>
        </footer>
      </div>
    );
  }

  return (
    <div className="lab lab--walk">
      <a href="#main-exhibit" className="skip-link" data-testid="skip-link">
        Skip to puzzle
      </a>
      {/* In normal walk mode the settings gear lives inside the sticky ribbon
         (see WalkRibbon); only fall back to the page-level button when an
         invalid slot leaves us without a ribbon. */}
      {!specimen && <SettingsButton onClick={onSettingsOpen} />}
      <WalkLayout
        specimen={specimen}
        controller={controller}
        onSettingsOpen={onSettingsOpen}
      />
      <footer className="foot">
        <p className="foot-line foot-line--quiet hub-foot-links">
          <a className="foot-link" href={routeToHash({ kind: "hub" })}>
            ← Back to overview
          </a>
          <span aria-hidden="true">·</span>
          <a className="foot-link" href={routeToHash({ kind: "reference" })}>
            Open the reference shelf
          </a>
          <span aria-hidden="true">·</span>
          <a className="foot-link" href={routeToHash({ kind: "fieldGuide" })}>
            Check your own survey draft
          </a>
          <span aria-hidden="true">·</span>
          <a className="foot-link" href={routeToHash({ kind: "build" })}>
            Build an answer set
          </a>
          <span aria-hidden="true">·</span>
          <a className="foot-link" href={routeToHash({ kind: "colophon" })}>
            Colophon
          </a>
        </p>
      </footer>
    </div>
  );
}

function routeAnnouncement(route: Route): string {
  switch (route.kind) {
    case "hub":
      return "Loaded overview.";
    case "reference":
      return "Loaded reference shelf.";
    case "build":
      return "Loaded answer-set builder.";
    case "lab":
      return "Loaded survey lab.";
    case "fieldGuide":
      return "Loaded field guide.";
    case "colophon":
      return "Loaded colophon.";
    case "walk": {
      if (route.slot === "done") return "Loaded walk summary.";
      const specimen = workbenchSpecimens.find((s) => s.id === route.slot);
      if (!specimen) return "Loaded overview.";
      return `Loaded puzzle ${specimen.number} of 12: ${specimen.title}.`;
    }
  }
}

function pageTitle(route: Route): string {
  switch (route.kind) {
    case "hub":
      return "Response Option Fit Lab";
    case "reference":
      return "Reference shelf — Response Option Fit Lab";
    case "build":
      return "Build an answer set — Response Option Fit Lab";
    case "lab":
      return "Survey lab (preview) — Response Option Fit Lab";
    case "fieldGuide":
      return "Field guide — Response Option Fit Lab";
    case "colophon":
      return "Colophon — Response Option Fit Lab";
    case "walk": {
      if (route.slot === "done") {
        return "Walk summary — Response Option Fit Lab";
      }
      const specimen = workbenchSpecimens.find((s) => s.id === route.slot);
      if (!specimen) return "Response Option Fit Lab";
      return `Puzzle ${specimen.number} — Response Option Fit Lab`;
    }
  }
}

function focusHeadingId(route: Route): string {
  switch (route.kind) {
    case "hub":
      return "exhibit-title";
    case "reference":
      return "reference-title";
    case "build":
      return "build-and-break-title";
    case "lab":
      return "survey-lab-title";
    case "fieldGuide":
      return "field-guide-title";
    case "colophon":
      return "colophon-title";
    case "walk":
      return route.slot === "done"
        ? "completion-title"
        : `${route.slot}-workbench-title`;
  }
}

function AppShell() {
  const route = useRoute();
  const controller = useWalkController();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const firstRouteEffectRef = useRef(true);
  const [routeAnnouncementText, setRouteAnnouncementText] = useState("");

  useEffect(() => {
    document.title = pageTitle(route);

    const isFirstRun = firstRouteEffectRef.current;
    const hasHash = typeof window !== "undefined" && window.location.hash !== "";
    const shouldMoveFocus = !isFirstRun || hasHash;
    firstRouteEffectRef.current = false;

    if (!shouldMoveFocus) return;

    setRouteAnnouncementText(routeAnnouncement(route));

    const id = focusHeadingId(route);
    const frame = window.requestAnimationFrame(() => {
      /* If the recap interstitial is present, it has already grabbed
         focus on its own mount; don't fight it. */
      const recap = document.querySelector('[data-testid="recap-interstitial"]');
      if (!recap) {
        const hubTarget =
          route.kind === "hub"
            ? decodeURIComponent(window.location.hash.replace(/^#/, ""))
            : "";
        const hubElement =
          hubTarget && hubTarget !== "exhibit"
            ? document.getElementById(hubTarget)
            : null;
        if (hubElement) {
          hubElement.scrollIntoView({ block: "start", behavior: "auto" });
          return;
        }
        const fieldGuideTarget =
          route.kind === "fieldGuide"
            ? window.location.hash.replace(/^#/, "")
            : "";
        const heading =
          fieldGuideTarget.startsWith("field-guide-")
            ? document.getElementById(fieldGuideTarget)
            : document.getElementById(id);
        heading?.focus({ preventScroll: false });
      }
      /* Make sure paginated routes scroll back to the top on transition;
         hash navigation alone leaves the prior scroll position. */
      if (route.kind !== "hub") {
        window.scrollTo({ top: 0, behavior: "auto" });
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, [route]);

  const openSettings = () => setSettingsOpen(true);

  return (
    <>
      {route.kind === "colophon" ? (
        <Colophon />
      ) : route.kind === "reference" ? (
        <ReferenceRoute onSettingsOpen={openSettings} />
      ) : route.kind === "build" ? (
        <BuildRoute onSettingsOpen={openSettings} />
      ) : route.kind === "lab" ? (
        <LabRoute onSettingsOpen={openSettings} />
      ) : route.kind === "fieldGuide" ? (
        <FieldGuideRoute onSettingsOpen={openSettings} />
      ) : route.kind === "walk" ? (
        <WalkRoute
          slot={route.slot}
          controller={controller}
          onSettingsOpen={openSettings}
        />
      ) : (
        <Hub controller={controller} onSettingsOpen={openSettings} />
      )}
      <SettingsDrawer open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
        data-testid="route-announcer"
      >
        {routeAnnouncementText}
      </div>
    </>
  );
}

export default function App() {
  return (
    <SettingsProvider>
      <AppShell />
    </SettingsProvider>
  );
}
