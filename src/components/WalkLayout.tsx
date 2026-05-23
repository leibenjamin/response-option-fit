import { useCallback, useEffect } from "react";
import { workbenchSpecimens } from "../data/workbench-specimens";
import { pendingRecap, type WalkController } from "../lib/walk-state";
import { routeToHash } from "../lib/routes";
import type { WorkbenchSpecimen } from "../types/workbench";
import { CompletionScreen } from "./CompletionScreen";
import { RecapInterstitial } from "./RecapInterstitial";
import { WalkRail, neighborSpecimens } from "./WalkRail";
import { WalkRibbon } from "./WalkRibbon";
import { Workbench } from "./Workbench";

type Props = {
  specimen: WorkbenchSpecimen | null;
  controller: WalkController;
  onSettingsOpen: () => void;
};

/* Walk-mode layout. Responsible for:
   - calling controller.visit() when a new specimen is mounted
   - rendering the recap interstitial after the active workbench at thresholds
   - rendering the completion screen when the walk slot is "done"
   - composing ribbon + main column + sticky rail
*/
export function WalkLayout({ specimen, controller, onSettingsOpen }: Props) {
  const { state, visit, dismissRecap } = controller;
  const visitedSet = new Set(state.visited);

  /* Record the visit on mount / specimen change. Effect intentionally fires
     after each navigation so deep-links to a previously-unseen specimen
     also count as a visit. */
  useEffect(() => {
    if (specimen) visit(specimen.id);
  }, [specimen, visit]);

  if (!specimen) {
    return <CompletionScreen visited={visitedSet} />;
  }

  const positionIndex = workbenchSpecimens.findIndex(
    (s) => s.id === specimen.id
  );
  const recapThreshold = pendingRecap(state, positionIndex);
  const { prev, next } = neighborSpecimens(specimen.id);

  /* When the recap is dismissed, focus is on the Continue/Skip button that
     just unmounted; the browser would otherwise drop focus to <body>. Move
     focus back to the workbench title so the screen-reader user stays
     anchored to the example they are on. */
  const handleDismissRecap = useCallback(
    (threshold: number) => {
      dismissRecap(threshold);
      if (typeof window === "undefined") return;
      window.requestAnimationFrame(() => {
        const heading = document.getElementById(
          `${specimen.id}-workbench-title`
        );
        heading?.focus({ preventScroll: false });
      });
    },
    [dismissRecap, specimen.id]
  );

  return (
    <div className="walk" data-testid="walk-layout">
      <WalkRibbon
        specimen={specimen}
        visited={visitedSet}
        onSettingsOpen={onSettingsOpen}
      />

      <div className="walk-grid">
        <main
          className="walk-main"
          id="main-exhibit"
          aria-label={`Worked example ${specimen.number}: ${specimen.title}`}
        >
          <Workbench key={specimen.id} specimen={specimen} />

          {recapThreshold !== null && (
            <RecapInterstitial
              threshold={recapThreshold}
              visited={visitedSet}
              currentSpecimenId={specimen.id}
              onContinue={() => handleDismissRecap(recapThreshold)}
              onSkip={() => handleDismissRecap(recapThreshold)}
            />
          )}

          <footer className="walk-bottom-nav" aria-label="Continue walking">
            <a
              className="walk-bottom-nav-link"
              href={
                next
                  ? routeToHash({ kind: "walk", slot: next.id })
                  : routeToHash({ kind: "walk", slot: "done" })
              }
              data-testid="walk-bottom-next"
            >
              <span className="walk-bottom-nav-eyebrow">Up next</span>
              <span className="walk-bottom-nav-title">
                {next
                  ? `${next.number} — ${next.title}`
                  : "Wrap up the walk"}
              </span>
              <span className="walk-bottom-nav-pattern">
                {next ? next.patternLabel : "Knowledge map · finish"}
              </span>
              <span className="walk-bottom-nav-arrow" aria-hidden="true">
                →
              </span>
            </a>
          </footer>
        </main>

        <WalkRail
          specimen={specimen}
          visited={visitedSet}
          prev={prev}
          next={next}
        />
      </div>
    </div>
  );
}
