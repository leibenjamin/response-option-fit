import { useEffect } from "react";
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
};

/* Walk-mode layout. Responsible for:
   - calling controller.visit() when a new specimen is mounted
   - rendering the recap interstitial above the workbench at thresholds
   - rendering the completion screen when the walk slot is "done"
   - composing ribbon + main column + sticky rail
*/
export function WalkLayout({ specimen, controller }: Props) {
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

  return (
    <div className="walk" data-testid="walk-layout">
      <WalkRibbon specimen={specimen} visited={visitedSet} />

      <div className="walk-grid">
        <main
          className="walk-main"
          id="main-exhibit"
          aria-label={`Worked example ${specimen.number}: ${specimen.title}`}
        >
          {recapThreshold !== null && (
            <RecapInterstitial
              threshold={recapThreshold}
              visited={visitedSet}
              currentSpecimenId={specimen.id}
              onContinue={() => dismissRecap(recapThreshold)}
              onSkip={() => dismissRecap(recapThreshold)}
            />
          )}

          <Workbench specimen={specimen} />

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
