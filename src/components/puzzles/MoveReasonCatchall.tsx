import { useState } from "react";
import type { WorkbenchSpecimen } from "../../types/workbench";
import {
  OptionalSource,
  PuzzleFrame,
  PuzzleInstrument,
  PuzzleProgress,
  PuzzleReveal
} from "./PuzzleFrame";

type ReasonBucket = {
  id: string;
  label: string;
  exportedBefore: string;
  writeIn: string;
  recodedAfter: string;
};

const buckets: ReasonBucket[] = [
  {
    id: "other-housing",
    label: "Other housing reason",
    exportedBefore: "Other housing",
    writeIn: "Wanted cheaper housing",
    recodedAfter: "Wanted cheaper housing"
  },
  {
    id: "other-job",
    label: "Other job-related reason",
    exportedBefore: "Other job-related",
    writeIn: "Shorter commute to a new job site",
    recodedAfter: "New job or job transfer"
  },
  {
    id: "other-family",
    label: "Other family reason",
    exportedBefore: "Other family",
    writeIn: "Moved near a caregiver",
    recodedAfter: "Family reason, specified"
  }
];

export function MoveReasonCatchall({
  specimen,
  titleId
}: {
  specimen: WorkbenchSpecimen;
  titleId: string;
}) {
  const [opened, setOpened] = useState<Record<string, boolean>>({});
  const [recodingOn, setRecodingOn] = useState(false);
  const openedCount = buckets.filter((bucket) => opened[bucket.id]).length;
  const revealReady = openedCount === buckets.length && recodingOn;

  return (
    <PuzzleFrame
      specimen={specimen}
      titleId={titleId}
      role="You are opening the catch-all"
      title="“Other housing reason” is not a reason."
      lede="A catch-all can be useful for routing, but it is a poor final answer. Open the broad categories, then turn on write-in recoding and watch the hidden reasons reappear."
      className="puzzle--move-reasons"
      progress={
        <PuzzleProgress
          completed={openedCount + (recodingOn ? 1 : 0)}
          total={buckets.length + 1}
          completeLabel="catch-alls opened"
        />
      }
    >
      <PuzzleInstrument label="The answer choices under stress">
        <p className="puzzle-instrument-prompt">
          Other family reason / other job-related reason / other housing reason
        </p>
      </PuzzleInstrument>

      <div className="move-lab">
        <ol className="move-buckets" aria-label="Open each catch-all reason">
          {buckets.map((bucket) => {
            const isOpen = opened[bucket.id] === true;
            return (
              <li className={`move-bucket ${isOpen ? "is-open" : ""}`} key={bucket.id}>
                <p className="move-bucket-label">{bucket.label}</p>
                <p className="move-export-before">Before: {bucket.exportedBefore}</p>
                <button
                  type="button"
                  className="move-open"
                  aria-expanded={isOpen}
                  onClick={() =>
                    setOpened((previous) => ({
                      ...previous,
                      [bucket.id]: true
                    }))
                  }
                  data-testid={`move-open-${specimen.id}-${bucket.id}`}
                >
                  Open the write-in drawer
                </button>
                {isOpen && (
                  <div
                    className="move-drawer"
                    data-testid={`move-drawer-${specimen.id}-${bucket.id}`}
                  >
                    <p>
                      Hidden inside: <strong>{bucket.writeIn}</strong>
                    </p>
                    <p>
                      {recodingOn
                        ? `After recoding: ${bucket.recodedAfter}`
                        : "Still exported as a broad other category."}
                    </p>
                  </div>
                )}
              </li>
            );
          })}
        </ol>

        <aside className="move-recode-panel">
          <p className="move-recode-title">Recoding switch</p>
          <p>
            The write-in answer exists only if the form asks for it and the data
            pipeline is allowed to use it.
          </p>
          <button
            type="button"
            className={`move-recode-button ${recodingOn ? "is-chosen" : ""}`}
            aria-pressed={recodingOn}
            onClick={() => setRecodingOn((value) => !value)}
            data-testid={`move-recode-${specimen.id}`}
          >
            {recodingOn ? "Write-ins are recoded" : "Turn on write-in recoding"}
          </button>
        </aside>
      </div>

      {revealReady && (
        <PuzzleReveal
          specimen={specimen}
          eyebrow="Catch-all opened"
          title="The broad bucket was a staging area, not the final data."
        >
          <p>
            “Other housing” can hide a concrete reason like wanted cheaper
            housing. Without the write-in and recoding path, the analyst sees a
            generic category where the respondent had a specific answer.
          </p>
          <p className="puzzle-reveal-takeaway">
            Broad buckets need a downstream plan: collect the detail, recode it,
            or admit that the detail will not survive.
          </p>
        </PuzzleReveal>
      )}

      <OptionalSource specimen={specimen} />
    </PuzzleFrame>
  );
}
