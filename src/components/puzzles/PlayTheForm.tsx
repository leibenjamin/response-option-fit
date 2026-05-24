import { useState } from "react";
import {
  playFormChoices,
  playFormPrompt,
  playFormVignettes,
  recordOutcome,
  type FormChoiceId
} from "../../data/play-the-form";
import type { WorkbenchSpecimen } from "../../types/workbench";

/* "Play the form" puzzle for Example 03,
   refrigerated medicine, false premise). The visitor acts as the form operator:
   three respondents with the real Yes / No / No-refrigerated-medicine buttons,
   watch a household with no refrigerated medicine get recorded as "had
   medicine, none spoiled," then add the follow-up the testers recommended and
   re-record honestly. Productive failure → repair, self-implicating, all taps,
   non-judgemental (the FORM fails, never the visitor). Reveal uses only the
   hand-verified specimen fields. */
export function PlayTheForm({
  specimen,
  titleId
}: {
  specimen: WorkbenchSpecimen;
  titleId: string;
}) {
  const [recorded, setRecorded] = useState<Record<string, FormChoiceId | null>>({});
  const [followUpAdded, setFollowUpAdded] = useState(false);

  const trap = playFormVignettes.find((v) => v.isTrap)!;
  const trapRecorded = recorded[trap.id] != null;
  const source = specimen.source;

  const record = (vignetteId: string, choice: FormChoiceId) =>
    setRecorded((prev) => ({ ...prev, [vignetteId]: choice }));

  return (
    <section
      className="puzzle puzzle--play-form"
      data-testid={`puzzle-play-form-${specimen.id}`}
      data-interactive="true"
    >
      <header className="puzzle-hero">
        <p className="puzzle-eyebrow">
          <span>Puzzle {specimen.number}</span>
          <span aria-hidden="true">/</span>
          <span>{specimen.patternLabel}</span>
          <span aria-hidden="true">/</span>
          <span className="puzzle-role">Your role: form operator</span>
        </p>
        <h2 className="puzzle-title" id={titleId} tabIndex={-1}>
          Record three households. Watch one fall through.
        </h2>
        <p className="puzzle-lede">
          A power-outage survey asks one yes/no question. Three people answer in
          their own words. Your job, as the form, is to record each with the
          buttons you were given — then see what the analyst will read.
        </p>
      </header>

      <div className="puzzle-instrument">
        <p className="puzzle-instrument-label">The form asks:</p>
        <p className="puzzle-instrument-prompt">{playFormPrompt}</p>
      </div>

      <ol className="puzzle-vignettes">
        {playFormVignettes.map((v) => {
          const choice = recorded[v.id] ?? null;
          const outcome = choice ? recordOutcome(v, choice, followUpAdded) : null;
          const showFollowUp = followUpAdded && choice === "no";
          return (
            <li
              className="puzzle-vignette"
              key={v.id}
              data-testid={`puzzle-vignette-${v.id}`}
            >
              <div className="puzzle-person">
                <p className="puzzle-person-name">{v.who}</p>
                <p className="puzzle-person-says">&ldquo;{v.says}&rdquo;</p>
                <p className="puzzle-person-status">Authored teaching situation</p>
              </div>

              <div
                className="puzzle-buttons"
                role="group"
                aria-label={`Record ${v.who} as`}
              >
                {playFormChoices.map((c) => (
                  <button
                    type="button"
                    key={c.id}
                    className={`puzzle-button ${choice === c.id ? "is-chosen" : ""}`}
                    aria-pressed={choice === c.id}
                    onClick={() => record(v.id, c.id)}
                    data-testid={`puzzle-record-${v.id}-${c.id}`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>

              {outcome && (
                <div
                  className={`puzzle-outcome ${outcome.honest ? "is-honest" : "is-gap"}`}
                  aria-live="polite"
                  data-testid={`puzzle-outcome-${v.id}`}
                >
                  {showFollowUp && (
                    <p className="puzzle-followup-line">
                      The form follows up: &ldquo;Do you keep any refrigerated
                      medicine?&rdquo; — {v.honest === "no-medicine" ? "No" : "Yes"}.
                    </p>
                  )}
                  <p className="puzzle-outcome-recorded">
                    <span className="puzzle-outcome-key">The analyst will read</span>
                    {outcome.recorded}
                  </p>
                  <p className="puzzle-outcome-truth">
                    <span className="puzzle-outcome-key">The truth</span>
                    {v.truth}
                  </p>
                  <p className="puzzle-outcome-verdict">
                    {outcome.honest
                      ? outcome.viaFollowUp
                        ? "The follow-up caught it. The record is honest now."
                        : "The form holds this one."
                      : "Same number, different person. The form just invented a medicine Sam doesn't have."}
                  </p>
                </div>
              )}
            </li>
          );
        })}
      </ol>

      {trapRecorded && !followUpAdded && (
        <section className="puzzle-repair" data-testid={`puzzle-repair-${specimen.id}`}>
          <p className="puzzle-repair-lead">
            A third button was right there — and Sam still slipped past it.
            Asked only &ldquo;did any spoil?&rdquo;, a household with no medicine
            just says &ldquo;No.&rdquo; More labels won&rsquo;t fix that. An
            instruction might.
          </p>
          <button
            type="button"
            className="cta-button cta-button--primary"
            onClick={() => setFollowUpAdded(true)}
            data-testid={`puzzle-add-followup-${specimen.id}`}
          >
            <span>Add the follow-up the testers recommended</span>
            <span aria-hidden="true" className="cta-button-arrow">↓</span>
          </button>
        </section>
      )}

      {followUpAdded && (
        <p className="puzzle-repair-done" data-testid={`puzzle-repair-done-${specimen.id}`}>
          Now, after any &ldquo;No,&rdquo; the form asks whether the household
          keeps refrigerated medicine at all. Re-record Sam with &ldquo;No&rdquo;
          and watch the follow-up catch what the single question couldn&rsquo;t.
          Keep that gate in mind: the sump-pump puzzle later uses the same move
          on equipment instead of medicine.
        </p>
      )}

      {trapRecorded && (
        <section
          className="puzzle-reveal"
          aria-labelledby={`puzzle-reveal-${specimen.id}`}
          data-testid={`puzzle-reveal-${specimen.id}`}
        >
          <p className="puzzle-eyebrow">What testing actually caught</p>
          <h3 id={`puzzle-reveal-${specimen.id}`}>
            &ldquo;No&rdquo; was carrying two different lives.
          </h3>
          <p>{specimen.answerFrame.methodNote}</p>
          <p className="puzzle-reveal-takeaway">
            A clean yes/no column can hide the people the question never applied
            to. Before you trust a &ldquo;No,&rdquo; ask what else it could mean:
            no event, no exposed item, or no eligibility for the question.
          </p>
        </section>
      )}

      <details
        className="puzzle-source puzzle-source--optional"
        data-testid={`puzzle-source-${specimen.id}`}
      >
        <summary>Optional real-world anchor</summary>
        <p className="puzzle-source-claim">
          The three people are authored teaching cases. The yes/no denominator
          problem is adapted from{" "}
          <a href={source.directUrl} target="_blank" rel="noreferrer">
            {source.documentCode}, {source.sectionOrPage}
          </a>
          .
        </p>
      </details>
    </section>
  );
}
