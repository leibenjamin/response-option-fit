import { useState } from "react";
import { capstoneCases, type CapstoneResolved } from "../data/capstone";

/* The end-of-walk cold read. Real instruments, no pattern labels, no engine
   scaffolding: the visitor taps where they think the answer choices break, then
   sees what the cognitive-testing report actually caught. The point is not a
   score — it is the moment of committing a read on a clean-looking real form and
   discovering what trained testers saw that you might not have. Non-judgemental
   throughout: a pick is "your read," never "wrong." */

type Pick = string | "missing" | "fine";

function readMatchesCulprit(pick: Pick, culprit: string) {
  return pick === culprit;
}

function CapstoneCard({ item }: { item: CapstoneResolved }) {
  const [pick, setPick] = useState<Pick | null>(null);
  const revealed = pick !== null;
  const caught = revealed && pick !== null ? readMatchesCulprit(pick, item.culpritOptionId) : false;

  const choose = (value: Pick) => setPick(value);

  return (
    <li className="capstone-case" data-testid={`capstone-case-${item.id}`}>
      <p className="capstone-scene">{item.scene}</p>

      <div className="capstone-instrument">
        <p className="capstone-instrument-eyebrow">{item.eyebrow}</p>
        <p className="capstone-prompt">{item.prompt}</p>
        <ul className="capstone-options" aria-label="Tap the answer choice you would flag">
          {item.options.map((option) => {
            const isPick = pick === option.id;
            const isCulprit = revealed && item.culpritOptionId === option.id;
            return (
              <li key={option.id}>
                <button
                  type="button"
                  className={`capstone-option ${isPick ? "is-your-read" : ""} ${
                    isCulprit ? "is-culprit" : ""
                  }`}
                  aria-pressed={isPick}
                  onClick={() => choose(option.id)}
                  data-testid={`capstone-option-${item.id}-${option.id}`}
                >
                  <span className="capstone-option-text">{option.text}</span>
                  {isCulprit && (
                    <span className="capstone-option-tag">Testers flagged this</span>
                  )}
                  {isPick && !isCulprit && (
                    <span className="capstone-option-tag capstone-option-tag--read">
                      Your read
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
        <div className="capstone-meta-choices" role="group" aria-label="Or judge the whole item">
          <button
            type="button"
            className={`capstone-meta ${pick === "missing" ? "is-your-read" : ""}`}
            aria-pressed={pick === "missing"}
            onClick={() => choose("missing")}
            data-testid={`capstone-missing-${item.id}`}
          >
            Something's missing here
          </button>
          <button
            type="button"
            className={`capstone-meta ${pick === "fine" ? "is-your-read" : ""}`}
            aria-pressed={pick === "fine"}
            onClick={() => choose("fine")}
            data-testid={`capstone-fine-${item.id}`}
          >
            It all looks fine to me
          </button>
        </div>
      </div>

      <div className="capstone-reveal-slot" aria-live="polite">
        {revealed && (
          <div
            className={`capstone-reveal ${caught ? "is-match" : ""}`}
            data-testid={`capstone-reveal-${item.id}`}
          >
            <p className="capstone-reveal-eyebrow">
              {caught
                ? "You read it the way the testers did."
                : pick === "fine"
                ? "It looked fine to plenty of respondents, too."
                : "Testers flagged a different part."}
            </p>
            <p className="capstone-reveal-pattern">
              <span className="capstone-reveal-pattern-tag">{item.patternLabel}</span>
            </p>
            <p className="capstone-reveal-caught">{item.caught}</p>
            <p className="capstone-reveal-foot">
              <a
                className="capstone-reveal-link"
                href={item.walkHref}
                data-testid={`capstone-link-${item.id}`}
              >
                See the full puzzle →
              </a>
              <span className="capstone-reveal-source">{item.sourceLabel}</span>
            </p>
          </div>
        )}
      </div>
    </li>
  );
}

export function Capstone() {
  if (capstoneCases.length === 0) return null;

  return (
    <section
      className="capstone"
      aria-labelledby="capstone-title"
      data-testid="capstone"
    >
      <header className="capstone-head">
        <p className="capstone-eyebrow">The cold read</p>
        <h2 id="capstone-title">Can you still see it?</h2>
        <p className="capstone-lede">
          No labels this time, no guided mechanic to carry you. Tap where you
          think each clean-looking form breaks, then compare your read with the
          route problem the puzzle path has been training you to see.
        </p>
      </header>

      <ol className="capstone-list">
        {capstoneCases.map((item) => (
          <CapstoneCard key={item.id} item={item} />
        ))}
      </ol>

      <p className="capstone-note">
        Catching it cold, on someone else's form, is the skill the walk was
        building. Missing one is ordinary; the win is learning where to look
        next.
      </p>
    </section>
  );
}
