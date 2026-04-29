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
      </header>
      <dl className="glossary-list">
        {items.map((it) => (
          <div
            key={it.key}
            className={`glossary-item ${
              it.key === activePattern ? "is-active" : ""
            }`}
          >
            <dt className="glossary-term">{it.label}</dt>
            <dd className="glossary-def">{it.body}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
