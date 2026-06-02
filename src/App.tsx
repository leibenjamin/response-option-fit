import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { Colophon } from "./components/Colophon";
import { SettingsButton } from "./components/SettingsButton";
import { SettingsDrawer } from "./components/SettingsDrawer";
import { parseHash, routeToHash, type Route } from "./lib/routes";
import { ProgressProvider } from "./lib/progress";
import { SettingsProvider } from "./lib/settings";

const SatisfactionLab = lazy(() =>
  import("./components/SatisfactionLab").then((module) => ({
    default: module.SatisfactionLab
  }))
);

function currentRoute(): Route {
  if (typeof window === "undefined") return { kind: "lab" };
  return parseHash(window.location.hash);
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
        <p className="foot-line">
          Static exhibit. No backend, no upload of your work, no survey
          analyzer.
        </p>
        <p className="foot-line foot-line--quiet">
          Built for editorial study of response-option fit.
        </p>
        <p className="foot-line foot-line--quiet hub-foot-links">
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
    case "lab":
      return "Loaded the response-options lab.";
    case "colophon":
      return "Loaded colophon.";
  }
}

function pageTitle(route: Route): string {
  switch (route.kind) {
    case "lab":
      return "Response Option Fit Lab";
    case "colophon":
      return "Colophon — Response Option Fit Lab";
  }
}

function focusHeadingId(route: Route): string {
  switch (route.kind) {
    case "lab":
      return "survey-lab-title";
    case "colophon":
      return "colophon-title";
  }
}

function AppShell() {
  const route = useRoute();
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
      const heading = document.getElementById(id);
      heading?.focus({ preventScroll: false });
      window.scrollTo({ top: 0, behavior: "auto" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [route]);

  const openSettings = () => setSettingsOpen(true);

  return (
    <>
      {route.kind === "colophon" ? (
        <Colophon />
      ) : (
        <LabRoute onSettingsOpen={openSettings} />
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
      <ProgressProvider>
        <AppShell />
      </ProgressProvider>
    </SettingsProvider>
  );
}
