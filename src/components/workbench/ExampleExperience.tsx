import { useMemo, useState, type CSSProperties, type ReactNode } from "react";
import type {
  ExperienceCase,
  ExperienceControl,
  ExperienceTone,
  WorkbenchExperience,
  WorkbenchSpecimen
} from "../../types/workbench";
import { EngineGlyph } from "./EngineGlyph";

type ExperienceSpecimen = WorkbenchSpecimen & {
  experience: WorkbenchExperience;
};

type ActiveResult = {
  zoneId: string;
  note: string;
};

type EngineState = {
  selectedControl: ExperienceControl;
  selectedCase: ExperienceCase;
  activeZone: WorkbenchExperience["zones"][number];
  result: ActiveResult;
  setControl: (controlId: string) => void;
  setCase: (caseId: string) => void;
};

function toneClass(tone: ExperienceTone | undefined) {
  return `experience-tone--${tone ?? "neutral"}`;
}

function provenanceLabel(provenance: ExperienceCase["provenance"]) {
  switch (provenance) {
    case "reported":
      return "Reported source finding";
    case "source_grounded":
      return "Source-grounded case";
    case "teaching":
      return "Teaching case";
  }
}

function getResult(
  selectedCase: ExperienceCase,
  selectedControl: ExperienceControl
): ActiveResult {
  return (
    selectedCase.resultByControl?.[selectedControl.id] ?? {
      zoneId: selectedCase.defaultZoneId,
      note: "This route uses the case's default placement for the selected review move."
    }
  );
}

function prefersReducedMotion() {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function withViewTransition(update: () => void) {
  if (typeof document === "undefined" || prefersReducedMotion()) {
    update();
    return;
  }
  const maybeDocument = document as Document & {
    startViewTransition?: (callback: () => void) => unknown;
  };
  if (typeof maybeDocument.startViewTransition === "function") {
    maybeDocument.startViewTransition(update);
  } else {
    update();
  }
}

function useEngineState(specimen: ExperienceSpecimen): EngineState {
  const { experience } = specimen;
  const [selectedControlId, setSelectedControlId] = useState(
    experience.controls[0].id
  );
  const [selectedCaseId, setSelectedCaseId] = useState(experience.cases[0].id);

  const selectedControl =
    experience.controls.find((control) => control.id === selectedControlId) ??
    experience.controls[0];
  const selectedCase =
    experience.cases.find((item) => item.id === selectedCaseId) ??
    experience.cases[0];
  const result = useMemo(
    () => getResult(selectedCase, selectedControl),
    [selectedCase, selectedControl]
  );
  const activeZone =
    experience.zones.find((zone) => zone.id === result.zoneId) ??
    experience.zones[0];

  return {
    selectedControl,
    selectedCase,
    activeZone,
    result,
    setControl: (controlId: string) =>
      withViewTransition(() => setSelectedControlId(controlId)),
    setCase: (caseId: string) =>
      withViewTransition(() => setSelectedCaseId(caseId))
  };
}

function SurveyInstrumentPanel({ specimen }: { specimen: ExperienceSpecimen }) {
  const { answerFrame, experience } = specimen;

  return (
    <section
      className="experience-panel experience-instrument"
      aria-labelledby={`${specimen.id}-instrument-title`}
      data-testid={`answer-frame-${specimen.id}`}
    >
      <details className="experience-instrument-details">
        <summary className="experience-instrument-summary">
          <span>
            Survey instrument
            <small>{answerFrame.eyebrow}</small>
          </span>
          <mark>{answerFrame.targetText}</mark>
        </summary>
        <div className="experience-instrument-body">
          <div className="experience-panel-head">
            <p className="experience-kicker">{answerFrame.eyebrow}</p>
            <h3 id={`${specimen.id}-instrument-title`}>Survey instrument</h3>
          </div>
          <p className="experience-prompt">{answerFrame.prompt}</p>
          <div
            className="experience-target"
            data-testid={`answer-frame-target-${specimen.id}`}
          >
            <span>{answerFrame.targetLabel}</span>
            <mark>{answerFrame.targetText}</mark>
          </div>
          {answerFrame.responseOptions && (
            <ol className="experience-answer-list" aria-label="Answer choices">
              {answerFrame.responseOptions.map((option) => (
                <li
                  className={`experience-answer-choice ${
                    option.isTarget ? "is-target" : ""
                  }`}
                  key={option.id}
                >
                  <span>{option.text}</span>
                  {option.note && <em>{option.note}</em>}
                </li>
              ))}
            </ol>
          )}
          <p className="experience-instrument-note">{experience.instrumentNote}</p>
        </div>
      </details>
    </section>
  );
}

function ControlButtons({
  specimen,
  state,
  className
}: {
  specimen: ExperienceSpecimen;
  state: EngineState;
  className: string;
}) {
  const { experience } = specimen;

  return (
    <div
      className={className}
      role="group"
      aria-label={experience.engine.actionLabel}
    >
      {experience.controls.map((control, index) => (
        <button
          className={`engine-control ${
            control.id === state.selectedControl.id ? "is-active" : ""
          }`}
          type="button"
          aria-pressed={control.id === state.selectedControl.id}
          onClick={() => state.setControl(control.id)}
          key={control.id}
          data-testid={
            index === 0
              ? `experience-action-${specimen.id}`
              : `experience-action-${specimen.id}-${control.id}`
          }
        >
          <span className="engine-control-label">{control.label}</span>
          <span className="engine-control-copy">{control.description}</span>
        </button>
      ))}
    </div>
  );
}

function CaseTokens({
  specimen,
  state,
  className = "engine-token-row"
}: {
  specimen: ExperienceSpecimen;
  state: EngineState;
  className?: string;
}) {
  return (
    <div
      className={className}
      role="group"
      aria-label={`Choose ${specimen.experience.engine.objectLabel.toLowerCase()}`}
    >
      {specimen.experience.cases.map((item) => (
        <button
          className={`engine-token ${
            item.id === state.selectedCase.id ? "is-active" : ""
          }`}
          type="button"
          aria-pressed={item.id === state.selectedCase.id}
          onClick={() => state.setCase(item.id)}
          key={item.id}
          data-testid={`experience-case-${specimen.id}-${item.id}`}
        >
          <span>{item.title}</span>
        </button>
      ))}
    </div>
  );
}

function ZoneCard({
  zone,
  active
}: {
  zone: WorkbenchExperience["zones"][number];
  active: boolean;
}) {
  return (
    <article
      className={[
        "engine-zone",
        toneClass(zone.tone),
        active ? "is-active" : ""
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <h4>{zone.label}</h4>
      <p>{zone.description}</p>
    </article>
  );
}

function OutcomePanel({ specimen, state }: { specimen: ExperienceSpecimen; state: EngineState }) {
  return (
    <article className="engine-outcome" aria-live="polite">
      <div className="engine-outcome-top">
        <p className="experience-kicker">
          {specimen.experience.engine.feedbackLabel}
        </p>
        <span className={`engine-status-pill ${toneClass(state.activeZone.tone)}`}>
          {state.activeZone.label}
        </span>
      </div>
      <h4>{state.selectedCase.title}</h4>
      <p>{state.selectedCase.body}</p>
      <p className="engine-reading">{state.selectedCase.reading}</p>
      <p>{state.result.note}</p>
      <p className="engine-control-effect">
        <strong>{state.selectedControl.label}:</strong>{" "}
        {state.selectedControl.effect}
      </p>
      <div className="experience-tags" aria-label="Case tags">
        <span>{provenanceLabel(state.selectedCase.provenance)}</span>
        {state.selectedCase.tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
    </article>
  );
}

function EngineShell({
  specimen,
  state,
  children,
  modeClass
}: {
  specimen: ExperienceSpecimen;
  state: EngineState;
  children: ReactNode;
  modeClass: string;
}) {
  const { experience } = specimen;

  return (
    <section
      className={`experience-panel experience-workspace experience-engine experience-engine--${experience.kind} ${modeClass}`}
      id={`${specimen.id}-workspace`}
      aria-labelledby={`${specimen.id}-workspace-title`}
      data-testid={`experience-${specimen.id}`}
    >
      <div className="experience-panel-head experience-workspace-head">
        <p className="experience-kicker">{experience.engine.surfaceLabel}</p>
        <h3 id={`${specimen.id}-workspace-title`}>{experience.reviewerGoal}</h3>
      </div>
      {children}
      <OutcomePanel specimen={specimen} state={state} />
    </section>
  );
}

function MeaningLensEngine({ specimen }: { specimen: ExperienceSpecimen }) {
  const state = useEngineState(specimen);

  return (
    <EngineShell specimen={specimen} state={state} modeClass="engine-lens-map">
      <ControlButtons specimen={specimen} state={state} className="engine-lens-controls" />
      <div className="lens-map-surface">
        <div className="lens-rings" aria-label="Trip routes by lens">
          {specimen.experience.zones.map((zone, index) => (
            <div
              className={[
                "lens-ring",
                toneClass(zone.tone),
                zone.id === state.activeZone.id ? "is-active" : ""
              ]
                .filter(Boolean)
                .join(" ")}
              key={zone.id}
              style={{ "--ring-index": index } as CSSProperties}
            >
              <span>{zone.label}</span>
            </div>
          ))}
          <div className="lens-token" aria-hidden="true">
            {state.selectedCase.title}
          </div>
        </div>
        <CaseTokens specimen={specimen} state={state} />
      </div>
    </EngineShell>
  );
}

function LevelLadderEngine({ specimen }: { specimen: ExperienceSpecimen }) {
  const state = useEngineState(specimen);

  return (
    <EngineShell specimen={specimen} state={state} modeClass="engine-level-ladder">
      <ControlButtons specimen={specimen} state={state} className="engine-rail-controls" />
      <div className="ladder-surface">
        <div className="ladder-stack" aria-label="Reporting levels">
          {specimen.experience.zones.map((zone, index) => (
            <div
              className={[
                "ladder-step",
                toneClass(zone.tone),
                zone.id === state.activeZone.id ? "is-active" : ""
              ]
                .filter(Boolean)
                .join(" ")}
              key={zone.id}
            >
              <span className="ladder-index">{index + 1}</span>
              <ZoneCard zone={zone} active={zone.id === state.activeZone.id} />
            </div>
          ))}
        </div>
        <CaseTokens specimen={specimen} state={state} className="engine-chip-column" />
      </div>
    </EngineShell>
  );
}

function EligibilityForkEngine({ specimen }: { specimen: ExperienceSpecimen }) {
  const state = useEngineState(specimen);

  return (
    <EngineShell specimen={specimen} state={state} modeClass="engine-fork">
      <ControlButtons specimen={specimen} state={state} className="engine-route-controls" />
      <div className="fork-surface">
        <CaseTokens specimen={specimen} state={state} className="engine-token-row" />
        <div className="fork-branches">
          {specimen.experience.zones.map((zone) => (
            <ZoneCard
              zone={zone}
              active={zone.id === state.activeZone.id}
              key={zone.id}
            />
          ))}
        </div>
      </div>
    </EngineShell>
  );
}

function FeatureMatrixEngine({ specimen }: { specimen: ExperienceSpecimen }) {
  const state = useEngineState(specimen);

  return (
    <EngineShell specimen={specimen} state={state} modeClass="engine-feature-matrix">
      <ControlButtons specimen={specimen} state={state} className="matrix-feature-controls" />
      <div className="matrix-surface" aria-label="Vehicle feature matrix">
        {specimen.experience.zones.map((zone) => (
          <div
            className={[
              "matrix-column",
              toneClass(zone.tone),
              zone.id === state.activeZone.id ? "is-active" : ""
            ]
              .filter(Boolean)
              .join(" ")}
            key={zone.id}
          >
            <ZoneCard zone={zone} active={zone.id === state.activeZone.id} />
            {zone.id === state.activeZone.id && (
              <div className="matrix-card">{state.selectedCase.title}</div>
            )}
          </div>
        ))}
      </div>
      <CaseTokens specimen={specimen} state={state} />
    </EngineShell>
  );
}

function SourceTimelineEngine({ specimen }: { specimen: ExperienceSpecimen }) {
  const state = useEngineState(specimen);

  return (
    <EngineShell specimen={specimen} state={state} modeClass="engine-source-timeline">
      <ControlButtons specimen={specimen} state={state} className="timeline-rule-controls" />
      <div className="timeline-surface">
        {specimen.experience.zones.map((zone, index) => (
          <div
            className={[
              "timeline-stop",
              toneClass(zone.tone),
              zone.id === state.activeZone.id ? "is-active" : ""
            ]
              .filter(Boolean)
              .join(" ")}
            key={zone.id}
          >
            <span className="timeline-dot">{index + 1}</span>
            <ZoneCard zone={zone} active={zone.id === state.activeZone.id} />
          </div>
        ))}
        <div className="timeline-token" aria-hidden="true">
          {state.selectedCase.title}
        </div>
      </div>
      <CaseTokens specimen={specimen} state={state} />
    </EngineShell>
  );
}

function ScheduleTraceEngine({ specimen }: { specimen: ExperienceSpecimen }) {
  const state = useEngineState(specimen);

  return (
    <EngineShell specimen={specimen} state={state} modeClass="engine-schedule-trace">
      <ControlButtons specimen={specimen} state={state} className="schedule-method-controls" />
      <div className="schedule-surface" aria-label="Weekly schedule trace">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => (
          <div
            className={`schedule-day ${
              index < 5 || state.activeZone.tone === "warning" ? "is-filled" : ""
            }`}
            key={day}
            style={{ "--bar": `${34 + ((index + 1) % 4) * 13}%` } as CSSProperties}
          >
            <span>{day}</span>
            <i aria-hidden="true" />
          </div>
        ))}
      </div>
      <CaseTokens specimen={specimen} state={state} />
    </EngineShell>
  );
}

function DeviceShelfEngine({ specimen }: { specimen: ExperienceSpecimen }) {
  const state = useEngineState(specimen);

  return (
    <EngineShell specimen={specimen} state={state} modeClass="engine-device-shelf">
      <ControlButtons specimen={specimen} state={state} className="device-label-controls" />
      <div className="device-shelf-surface">
        {specimen.experience.zones.map((zone) => (
          <div
            className={[
              "device-shelf",
              toneClass(zone.tone),
              zone.id === state.activeZone.id ? "is-active" : ""
            ]
              .filter(Boolean)
              .join(" ")}
            key={zone.id}
          >
            <ZoneCard zone={zone} active={zone.id === state.activeZone.id} />
          </div>
        ))}
      </div>
      <CaseTokens specimen={specimen} state={state} />
    </EngineShell>
  );
}

function VisibilityRouteEngine({ specimen }: { specimen: ExperienceSpecimen }) {
  const state = useEngineState(specimen);

  return (
    <EngineShell specimen={specimen} state={state} modeClass="engine-visibility-route">
      <ControlButtons specimen={specimen} state={state} className="route-visibility-controls" />
      <div className="route-map-surface">
        {specimen.experience.zones.map((zone, index) => (
          <div
            className={[
              "route-panel",
              toneClass(zone.tone),
              zone.id === state.activeZone.id ? "is-active" : ""
            ]
              .filter(Boolean)
              .join(" ")}
            key={zone.id}
          >
            <span className="route-effort-meter" aria-hidden="true">
              <i style={{ width: `${35 + index * 18}%` }} />
            </span>
            <ZoneCard zone={zone} active={zone.id === state.activeZone.id} />
          </div>
        ))}
      </div>
      <CaseTokens specimen={specimen} state={state} />
    </EngineShell>
  );
}

function PremiseStackEngine({ specimen }: { specimen: ExperienceSpecimen }) {
  const state = useEngineState(specimen);

  return (
    <EngineShell specimen={specimen} state={state} modeClass="engine-premise-stack">
      <ControlButtons specimen={specimen} state={state} className="premise-controls" />
      <div className="premise-stack-surface">
        {specimen.experience.zones.map((zone, index) => (
          <div
            className={[
              "premise-layer",
              toneClass(zone.tone),
              zone.id === state.activeZone.id ? "is-active" : ""
            ]
              .filter(Boolean)
              .join(" ")}
            key={zone.id}
          >
            <span>{index + 1}</span>
            <ZoneCard zone={zone} active={zone.id === state.activeZone.id} />
          </div>
        ))}
      </div>
      <CaseTokens specimen={specimen} state={state} />
    </EngineShell>
  );
}

function HeadingScannerEngine({ specimen }: { specimen: ExperienceSpecimen }) {
  const state = useEngineState(specimen);

  return (
    <EngineShell specimen={specimen} state={state} modeClass="engine-heading-scanner">
      <ControlButtons specimen={specimen} state={state} className="heading-cue-controls" />
      <div className="heading-scan-surface">
        {specimen.experience.zones.map((zone) => (
          <div
            className={[
              "heading-section",
              toneClass(zone.tone),
              zone.id === state.activeZone.id ? "is-active" : ""
            ]
              .filter(Boolean)
              .join(" ")}
            key={zone.id}
          >
            <ZoneCard zone={zone} active={zone.id === state.activeZone.id} />
          </div>
        ))}
      </div>
      <CaseTokens specimen={specimen} state={state} />
    </EngineShell>
  );
}

function ReasonStrengthEngine({ specimen }: { specimen: ExperienceSpecimen }) {
  const state = useEngineState(specimen);

  return (
    <EngineShell specimen={specimen} state={state} modeClass="engine-reason-lanes">
      <ControlButtons specimen={specimen} state={state} className="reason-threshold-controls" />
      <div className="reason-lanes-surface">
        {specimen.experience.zones.map((zone) => (
          <div
            className={[
              "reason-lane",
              toneClass(zone.tone),
              zone.id === state.activeZone.id ? "is-active" : ""
            ]
              .filter(Boolean)
              .join(" ")}
            key={zone.id}
          >
            <ZoneCard zone={zone} active={zone.id === state.activeZone.id} />
            {zone.id === state.activeZone.id && (
              <span className="reason-card">{state.selectedCase.title}</span>
            )}
          </div>
        ))}
      </div>
      <CaseTokens specimen={specimen} state={state} />
    </EngineShell>
  );
}

function CountingWorkbenchEngine({ specimen }: { specimen: ExperienceSpecimen }) {
  const state = useEngineState(specimen);

  return (
    <EngineShell specimen={specimen} state={state} modeClass="engine-counting-calendar">
      <ControlButtons specimen={specimen} state={state} className="counting-method-controls" />
      <div className="counting-calendar-surface" aria-label="Work spells by month">
        {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((month, index) => (
          <div
            className={`counting-month ${
              index < 4 || state.activeZone.tone === "method" ? "is-worked" : ""
            }`}
            key={month}
          >
            <span>{month}</span>
            <i aria-hidden="true" />
          </div>
        ))}
      </div>
      <CaseTokens specimen={specimen} state={state} />
    </EngineShell>
  );
}

function ExperienceEngine({ specimen }: { specimen: ExperienceSpecimen }) {
  switch (specimen.experience.engine.interaction) {
    case "lens_map":
      return <MeaningLensEngine specimen={specimen} />;
    case "level_ladder":
      return <LevelLadderEngine specimen={specimen} />;
    case "eligibility_fork":
      return <EligibilityForkEngine specimen={specimen} />;
    case "feature_matrix":
      return <FeatureMatrixEngine specimen={specimen} />;
    case "source_timeline":
      return <SourceTimelineEngine specimen={specimen} />;
    case "schedule_trace":
      return <ScheduleTraceEngine specimen={specimen} />;
    case "device_shelf":
      return <DeviceShelfEngine specimen={specimen} />;
    case "visibility_route":
      return <VisibilityRouteEngine specimen={specimen} />;
    case "premise_stack":
      return <PremiseStackEngine specimen={specimen} />;
    case "heading_scanner":
      return <HeadingScannerEngine specimen={specimen} />;
    case "reason_lanes":
      return <ReasonStrengthEngine specimen={specimen} />;
    case "counting_calendar":
      return <CountingWorkbenchEngine specimen={specimen} />;
  }
}

function RepairSandbox({ specimen }: { specimen: ExperienceSpecimen }) {
  const { experience } = specimen;
  const [selectedRepairId, setSelectedRepairId] = useState(
    experience.repair.options[0].id
  );
  const selectedRepair =
    experience.repair.options.find((option) => option.id === selectedRepairId) ??
    experience.repair.options[0];

  return (
    <section
      className="experience-panel experience-repair"
      id={`${specimen.id}-repair`}
      aria-labelledby={`${specimen.id}-repair-title`}
      data-testid={`experience-repair-${specimen.id}`}
    >
      <div className="experience-panel-head">
        <p className="experience-kicker">Repair sandbox</p>
        <h3 id={`${specimen.id}-repair-title`}>{experience.repair.title}</h3>
        <p>{experience.repair.lede}</p>
      </div>
      <div
        className="experience-repair-tabs"
        role="group"
        aria-label="Repair options"
      >
        {experience.repair.options.map((option) => (
          <button
            type="button"
            className={`experience-repair-tab ${
              option.id === selectedRepair.id ? "is-active" : ""
            }`}
            aria-pressed={option.id === selectedRepair.id}
            onClick={() => setSelectedRepairId(option.id)}
            key={option.id}
          >
            {option.label}
          </button>
        ))}
      </div>
      <article className="experience-repair-detail" aria-live="polite">
        <p className="experience-kicker">Candidate direction</p>
        <h4>{selectedRepair.headline}</h4>
        <p>{selectedRepair.body}</p>
        <ul className="experience-effect-list">
          {selectedRepair.effects.map((effect) => (
            <li key={effect}>{effect}</li>
          ))}
        </ul>
        <p className="experience-caution">{selectedRepair.caution}</p>
      </article>
    </section>
  );
}

function TransferTrace({ specimen }: { specimen: ExperienceSpecimen }) {
  const { experience } = specimen;
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const selected = selectedIndex !== null;
  const preferred = selectedIndex === experience.transfer.preferredIndex;

  return (
    <section
      className="experience-panel experience-transfer"
      id={`${specimen.id}-transfer`}
      aria-labelledby={`${specimen.id}-transfer-title`}
      data-testid={`experience-transfer-${specimen.id}`}
    >
      <div className="experience-panel-head">
        <p className="experience-kicker">Apply the trace</p>
        <h3 id={`${specimen.id}-transfer-title`}>{experience.transfer.title}</h3>
        <p>{experience.transfer.prompt}</p>
      </div>
      <div
        className="experience-transfer-options"
        role="group"
        aria-label="Trace choices"
      >
        {experience.transfer.options.map((option, index) => (
          <button
            type="button"
            className={`experience-transfer-option ${
              selectedIndex === index ? "is-active" : ""
            }`}
            aria-pressed={selectedIndex === index}
            onClick={() => setSelectedIndex(index)}
            key={option}
          >
            {option}
          </button>
        ))}
      </div>
      {selected && (
        <p className="experience-transfer-feedback" aria-live="polite">
          <strong>{preferred ? "Trace carries." : "Trace detour."}</strong>{" "}
          {preferred
            ? experience.transfer.feedback
            : `This option may matter later, but it does not trace the answer route first. ${experience.transfer.feedback}`}
        </p>
      )}
    </section>
  );
}

function SourceBoundaryPanel({ specimen }: { specimen: ExperienceSpecimen }) {
  const { experience, source } = specimen;

  return (
    <section
      className="experience-panel experience-source"
      id={`${specimen.id}-source`}
      aria-labelledby={`${specimen.id}-source-title`}
      data-testid={`experience-source-${specimen.id}`}
    >
      <div className="experience-panel-head">
        <p className="experience-kicker">Source boundary</p>
        <h3 id={`${specimen.id}-source-title`}>{experience.sourceBoundary.title}</h3>
        <p>{experience.sourceBoundary.body}</p>
      </div>
      <ul className="experience-limit-list">
        {experience.sourceBoundary.limits.map((limit) => (
          <li key={limit}>{limit}</li>
        ))}
      </ul>
      <details
        className="experience-source-receipt"
        data-testid={`source-manifest-${specimen.id}`}
      >
        <summary>
          Full source details: {source.agency} · {source.documentCode} ·{" "}
          {source.year}
        </summary>
        <dl className="source-manifest-list">
          <dt>Report title</dt>
          <dd>{source.reportTitle}</dd>
          <dt>Section/page reference</dt>
          <dd>{source.sectionOrPage}</dd>
          <dt>Verification</dt>
          <dd>
            checked against cited PDF on{" "}
            {specimen.verifiedAgainstSource?.date ?? source.retrievalDate} (
            {specimen.verifiedAgainstSource?.method === "manual_pdf_check"
              ? "manual PDF check"
              : "source check"}
            )
          </dd>
          <dt>Retrieval date</dt>
          <dd>{source.retrievalDate}</dd>
          <dt>Retrieval URL</dt>
          <dd>
            <a
              className="source-manifest-link"
              href={source.directUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {source.directUrl}
            </a>
          </dd>
        </dl>
      </details>
    </section>
  );
}

function ApplyToDraftStrip({ specimen }: { specimen: ExperienceSpecimen }) {
  return (
    <section
      className="experience-apply-strip"
      aria-labelledby={`${specimen.id}-apply-title`}
    >
      <p className="experience-kicker">Apply to a draft</p>
      <h3 id={`${specimen.id}-apply-title`}>
        Carry the pattern, not the wording.
      </h3>
      <p>
        Use this example to inspect respondent knowledge, answer-route
        visibility, source limits, and what evidence would be needed before
        adopting any change.
      </p>
      <a href="#field-guide">Open the field guide</a>
    </section>
  );
}

export function ExampleExperienceRouter({
  specimen,
  titleId
}: {
  specimen: ExperienceSpecimen;
  titleId: string;
}) {
  const { experience, source } = specimen;

  return (
    <>
      <section
        className={`experience-hero experience-hero--${experience.kind}`}
        aria-labelledby={titleId}
      >
        <div className="experience-hero-copy">
          <p className="beat-eyebrow experience-hero-eyebrow">
            <span className="experience-hero-glyph" aria-hidden="true">
              <EngineGlyph kind={experience.kind} />
            </span>
            <span>Example {specimen.number}</span>
            <span aria-hidden="true">/</span>
            <span>{specimen.patternLabel}</span>
          </p>
          <h2 className="beat-title" id={titleId} tabIndex={-1}>
            {experience.title}
          </h2>
          <p className="beat-lede">{experience.lede}</p>
        </div>
        <div className="experience-source-stamp">
          <p className="experience-source-chip">
            <span>{source.agency}</span>
            <span>{source.documentCode}</span>
            <span>{source.year}</span>
          </p>
          {/* The verification line is the exhibit's strongest signal that
             these are real, not a chatbot's plausible-sounding examples:
             a human checked each one against the cited public PDF on a
             recorded date. Kept quiet (small mono) so it reads as rigor,
             not a boast. Full manifest stays in the source-boundary
             details below. */}
          <p className="experience-source-verified">
            <span aria-hidden="true">✓</span> Verified against the cited PDF
            {" · "}
            {specimen.verifiedAgainstSource?.date ?? source.retrievalDate}
          </p>
        </div>
      </section>

      <ExperienceEngine specimen={specimen} />
      <SurveyInstrumentPanel specimen={specimen} />

      <div className="experience-bottom-grid">
        <RepairSandbox specimen={specimen} />
        <TransferTrace specimen={specimen} />
      </div>

      <SourceBoundaryPanel specimen={specimen} />
      <ApplyToDraftStrip specimen={specimen} />
    </>
  );
}
