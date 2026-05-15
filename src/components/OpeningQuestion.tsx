import { useState } from "react";

/* The hub cold-open. A single ordinary survey question the visitor answers
   as themselves; one tap reveals that their own honest answer is shakier
   than it looked. This is a demonstration, not one of the twelve sourced
   worked examples — it carries no source receipt and is framed as such.

   It deliberately demonstrates label ambiguity through a vague-quantifier
   scale: whatever word the visitor picks, the reveal holds, because the
   words carry no fixed amount. The scale has no absolute endpoints
   ("Never" / "Always" would be concrete enough to break the demonstration).

   The reveal copy is parameterized by the picked word and pins no specific
   frequency to any word, so it stays accurate on every path. */

const OPTIONS = ["Rarely", "Sometimes", "Often", "Very often"] as const;
type Option = (typeof OPTIONS)[number];

type Props = {
  /* Opens the six-pattern map dialog. The reveal offers it as one of two
     ways forward once the visitor has seen the demonstration. */
  onOpenMap: () => void;
};

export function OpeningQuestion({ onOpenMap }: Props) {
  const [picked, setPicked] = useState<Option | null>(null);

  return (
    <section
      className="opening"
      id="opening-question"
      aria-labelledby="opening-title"
      data-testid="opening-question"
    >
      <header className="opening-head">
        <p className="opening-eyebrow">Start here</p>
        <h2 className="opening-title" id="opening-title">
          First, answer one ordinary survey question.
        </h2>
        <p className="opening-instruction">
          Pick the answer that is true for you — there is no wrong one.
        </p>
      </header>

      <div className="opening-question-card">
        <p className="opening-question-label">A survey question</p>
        <p className="opening-question-text">
          How often do you cook dinner at home?
        </p>
        <div
          className="opening-options"
          role="group"
          aria-label="Answer choices"
        >
          {OPTIONS.map((word) => {
            const active = picked === word;
            return (
              <button
                key={word}
                type="button"
                className={`opening-option ${active ? "is-active" : ""}`}
                aria-pressed={active}
                onClick={() => setPicked(word)}
                data-testid={`opening-option-${word}`}
              >
                {word}
              </button>
            );
          })}
        </div>
      </div>

      <div
        className="opening-reveal"
        aria-live="polite"
        data-testid="opening-reveal"
      >
        {picked && (
          <div className="opening-reveal-inner">
            <p className="opening-reveal-pick">
              You picked <strong>&ldquo;{picked}&rdquo;</strong>.
            </p>
            <p className="opening-reveal-body">
              &ldquo;{picked}&rdquo; is not a quantity — it is a comparison
              against your own normal, and your normal is not the next
              respondent&rsquo;s.
            </p>
            <p className="opening-reveal-body">
              Two people whose routines look nothing alike can both pick
              &ldquo;{picked}&rdquo; and mean it. Two people with the
              identical routine can split between &ldquo;{picked}&rdquo; and
              the word beside it. The survey keeps the word and loses the
              routine behind it.
            </p>
            <p className="opening-reveal-name">
              That is <strong>label ambiguity</strong>: one answer choice,
              honestly read several ways — the first of six recurring
              answer-choice problems. The exhibit works through twelve
              examples of them, against real questionnaire-testing evidence.
            </p>
            <div className="opening-reveal-actions">
              <a
                className="cta-button cta-button--primary"
                href="#featured-example"
                data-testid="opening-reveal-featured"
              >
                <span>Work the first example in full</span>
                <span aria-hidden="true" className="cta-button-arrow">
                  ↓
                </span>
              </a>
              <button
                type="button"
                className="cta-button cta-button--secondary"
                onClick={onOpenMap}
                data-testid="opening-reveal-map"
              >
                <span>Open the six-pattern map</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
