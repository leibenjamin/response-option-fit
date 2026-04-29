import type { FailurePattern } from "../types/specimen";

const items: { key: FailurePattern; label: string; body: string }[] = [
  {
    key: "label_ambiguity",
    label: "Label ambiguity",
    body: "Respondents may understand the response label using different everyday categories."
  },
  {
    key: "broad_bucket",
    label: "Broad bucket",
    body: "One answer field combines items respondents store, remember, or pay for separately."
  },
  {
    key: "false_premise",
    label: "False premise",
    body: "The question assumes a condition that may not apply."
  },
  {
    key: "category_boundary_blur",
    label: "Category boundary blur",
    body: "The survey’s technical distinction does not match everyday classification."
  },
  {
    key: "sequence_overlap",
    label: "Sequence overlap",
    body: "A prior question changes how the next answer category is interpreted."
  }
];

export function PatternGlossary({ activePattern }: { activePattern: FailurePattern }) {
  return (
    <section className="glossary" aria-labelledby="glossary-title">
      <header className="section-head">
        <p className="section-eyebrow">Pattern glossary</p>
        <h2 className="section-title" id="glossary-title">
          Five ways a response route can break
        </h2>
        <p className="section-lede">
          Each specimen demonstrates one of these patterns. The active
          specimen’s pattern is highlighted.
        </p>
      </header>
      <ol className="glossary-grid">
        {items.map((it, i) => {
          const active = it.key === activePattern;
          return (
            <li
              key={it.key}
              className={`glossary-card ${active ? "is-active" : ""}`}
              aria-current={active ? "true" : undefined}
            >
              <p className="glossary-card-num" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </p>
              <p className="glossary-card-label">{it.label}</p>
              <p className="glossary-card-body">{it.body}</p>
              {active && (
                <p className="glossary-card-flag" aria-hidden="true">
                  Active specimen
                </p>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
