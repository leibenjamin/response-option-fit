import { useEffect, useMemo, useRef, useState } from "react";
import { workbenchSpecimens } from "./data/workbench-specimens";
import { Colophon } from "./components/Colophon";
import { CompletionScreen } from "./components/CompletionScreen";
import { FeaturedExample } from "./components/FeaturedExample";
import { Hero } from "./components/Hero";
import { PatternCatalog } from "./components/PatternCatalog";
import { Reference } from "./components/Reference";
import { SettingsButton } from "./components/SettingsButton";
import { SettingsDrawer } from "./components/SettingsDrawer";
import { WalkLayout } from "./components/WalkLayout";
import { parseHash, routeToHash, type Route } from "./lib/routes";
import { SettingsProvider } from "./lib/settings";
import { useWalkController, type WalkController } from "./lib/walk-state";

const knownSpecimenIds: readonly string[] = workbenchSpecimens.map((s) => s.id);

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

function Hub({ controller }: { controller: WalkController }) {
  const visitedSet = new Set(controller.state.visited);
  /* The Resume CTA points at the most recently opened specimen, which is
     the last id added to the visited array. */
  const lastVisited =
    controller.state.visited[controller.state.visited.length - 1] ?? null;
  return (
    <div className="lab" data-testid="hub">
      <a href="#featured-example" className="skip-link" data-testid="skip-link">
        Skip to worked example
      </a>
      <Hero resumeSpecimenId={lastVisited} />
      <main
        className="hub-main"
        aria-label="Overview of the response option fit exhibit"
      >
        <PatternCatalog variant="full" visited={visitedSet} />
        <FeaturedExample />
      </main>

      <footer className="foot">
        <p className="foot-line">
          Static exhibit. No backend, no runtime AI, no network upload, no survey
          analyzer.
        </p>
        <p className="foot-line foot-line--quiet">
          Built for editorial study of response-option fit.
        </p>
        <p className="foot-line foot-line--quiet hub-foot-links">
          <a className="foot-link" href={routeToHash({ kind: "reference" })}>
            Reference shelf
          </a>
          <span aria-hidden="true">·</span>
          <a className="foot-link" href={routeToHash({ kind: "colophon" })}>
            Colophon
          </a>
        </p>
      </footer>

      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
        data-testid="specimen-announcer"
      >
        12 worked examples.
      </div>
    </div>
  );
}

function ReferenceRoute() {
  return (
    <div className="lab lab--reference">
      <a href="#reference" className="skip-link" data-testid="skip-link">
        Skip to reference material
      </a>
      <Reference />
      <footer className="foot">
        <p className="foot-line foot-line--quiet hub-foot-links">
          <a className="foot-link" href={routeToHash({ kind: "hub" })}>
            ← Back to overview
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
  controller
}: {
  slot: string;
  controller: WalkController;
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
        <CompletionScreen visited={new Set(controller.state.visited)} />
        <footer className="foot">
          <p className="foot-line foot-line--quiet hub-foot-links">
            <a className="foot-link" href={routeToHash({ kind: "hub" })}>
              ← Back to overview
            </a>
            <span aria-hidden="true">·</span>
            <a className="foot-link" href={routeToHash({ kind: "reference" })}>
              Reference shelf
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
        Skip to worked example
      </a>
      <WalkLayout specimen={specimen} controller={controller} />
      <footer className="foot">
        <p className="foot-line foot-line--quiet hub-foot-links">
          <a className="foot-link" href={routeToHash({ kind: "hub" })}>
            ← Back to overview
          </a>
          <span aria-hidden="true">·</span>
          <a className="foot-link" href={routeToHash({ kind: "reference" })}>
            Reference shelf
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
      return "Loaded reference material.";
    case "colophon":
      return "Loaded colophon.";
    case "walk": {
      if (route.slot === "done") return "Loaded walk summary.";
      const specimen = workbenchSpecimens.find((s) => s.id === route.slot);
      if (!specimen) return "Loaded overview.";
      return `Loaded example ${specimen.number} of 12: ${specimen.title}.`;
    }
  }
}

function pageTitle(route: Route): string {
  switch (route.kind) {
    case "hub":
      return "Response Option Fit Lab";
    case "reference":
      return "Reference — Response Option Fit Lab";
    case "colophon":
      return "Colophon — Response Option Fit Lab";
    case "walk": {
      if (route.slot === "done") {
        return "Walk summary — Response Option Fit Lab";
      }
      const specimen = workbenchSpecimens.find((s) => s.id === route.slot);
      if (!specimen) return "Response Option Fit Lab";
      return `Example ${specimen.number} — Response Option Fit Lab`;
    }
  }
}

function focusHeadingId(route: Route): string {
  switch (route.kind) {
    case "hub":
      return "exhibit-title";
    case "reference":
      return "reference-title";
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
        const heading = document.getElementById(id);
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

  return (
    <>
      <SettingsButton onClick={() => setSettingsOpen(true)} />
      {route.kind === "colophon" ? (
        <Colophon />
      ) : route.kind === "reference" ? (
        <ReferenceRoute />
      ) : route.kind === "walk" ? (
        <WalkRoute slot={route.slot} controller={controller} />
      ) : (
        <Hub controller={controller} />
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
