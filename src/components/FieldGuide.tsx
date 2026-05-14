import { patternApplicationGuides } from "../data/field-guide";
import { promptCards, responseFitTests } from "../data/field-guide-route";
import { patternMeta, patternOrder } from "../lib/pattern-meta";
import { routeToHash } from "../lib/routes";
import { workbenchSpecimens } from "../data/workbench-specimens";
import type { FailurePattern } from "../types/workbench";
import { PromptCard } from "./PromptCard";

const specimensByPattern: Record<FailurePattern, typeof workbenchSpecimens> = (() => {
  const map = Object.fromEntries(
    patternOrder.map((pattern) => [pattern, [] as typeof workbenchSpecimens])
  ) as Record<FailurePattern, typeof workbenchSpecimens>;
  for (const specimen of workbenchSpecimens) {
    map[specimen.pattern].push(specimen);
  }
  return map;
})();

const researchLinks = [
  {
    label: "Pew Research Center: Writing Survey Questions",
    href: "https://www.pewresearch.org/writing-survey-questions/"
  },
  {
    label: "Census Bureau: Statistical Quality Standard A2",
    href: "https://www.census.gov/about/policies/quality/standards/standarda2.html"
  },
  {
    label: "Census Bureau: Questionnaire Testing and Evaluation Methods",
    href: "https://www.census.gov/about/policies/quality/standards/appendixa2.html"
  },
  {
    label: "Roediger and Karpicke: Retrieval practice",
    href: "https://pubmed.ncbi.nlm.nih.gov/16507066/"
  },
  {
    label: "Cepeda et al.: Distributed practice review",
    href: "https://digitalcommons.usf.edu/psy_facpub/1771/"
  },
  {
    label: "Kornell and Bjork: Interleaved induction",
    href: "https://journals.sagepub.com/doi/abs/10.1111/j.1467-9280.2008.02127.x"
  }
];

export function FieldGuide() {
  return (
    <main
      id="field-guide"
      className="field-guide"
      aria-labelledby="field-guide-title"
      data-testid="field-guide"
    >
      <header className="field-guide-head">
        <p className="field-guide-eyebrow">Reusable field guide</p>
        <h1 className="field-guide-title" id="field-guide-title" tabIndex={-1}>
          Check your own survey answer choices
        </h1>
        <p className="field-guide-lede">
          These are portable tests, checklists, and prompt templates for
          reviewing your own survey answer choices before analysis begins. They
          are not a validator, score, or replacement for cognitive testing.
        </p>
      </header>

      <section
        className="field-guide-warning"
        aria-labelledby="field-guide-warning-title"
      >
        <h2 id="field-guide-warning-title">Privacy and AI boundary</h2>
        <p>
          This app does not run AI, send pasted survey text anywhere, or offer
          freeform survey inputs. The prompts below are static text you can copy
          into an LLM tool you choose if your own data, privacy rules, and
          source permissions allow it.
        </p>
      </section>

      <section
        className="field-guide-section"
        aria-labelledby="response-fit-tests-title"
        data-testid="response-fit-tests"
      >
        <header className="field-guide-section-head">
          <p className="field-guide-section-eyebrow">Seven tests</p>
          <h2 id="response-fit-tests-title">Response-option fit checks</h2>
          <p>
            Use these as a first-pass desk review before rewriting. The goal is
            to name the risk clearly enough that a real pretest can inspect it.
          </p>
        </header>
        <ol className="fit-test-grid">
          {responseFitTests.map((test) => (
            <li className="fit-test-card" key={test.id} id={`fit-test-${test.id}`}>
              <h3>{test.title}</h3>
              <p className="fit-test-question">{test.question}</p>
              <dl className="fit-test-detail">
                <div>
                  <dt>Red flag</dt>
                  <dd>{test.redFlag}</dd>
                </div>
                <div>
                  <dt>Next move</dt>
                  <dd>{test.nextMove}</dd>
                </div>
              </dl>
            </li>
          ))}
        </ol>
      </section>

      <section
        className="field-guide-section"
        aria-labelledby="pattern-checklists-title"
        data-testid="pattern-checklists"
      >
        <header className="field-guide-section-head">
          <p className="field-guide-section-eyebrow">Pattern checklists</p>
          <h2 id="pattern-checklists-title">What to test for each pattern</h2>
          <p>
            Each checklist maps the exhibit's teaching category back to
            practical survey-review moves.
          </p>
        </header>
        <div className="pattern-checklist-grid">
          {patternOrder.map((pattern) => {
            const guide = patternApplicationGuides[pattern];
            const meta = patternMeta[pattern];
            const examples = specimensByPattern[pattern];
            return (
              <article
                className="pattern-checklist-card"
                id={guide.fieldGuideId}
                data-testid={`field-guide-${pattern}`}
                key={pattern}
                tabIndex={-1}
              >
                <p className="pattern-checklist-eyebrow">{meta.canonicalSubtitle}</p>
                <h3>{meta.label}</h3>
                <p className="pattern-checklist-warning">{guide.warning}</p>
                <ol>
                  {guide.checks.map((check) => (
                    <li key={check}>{check}</li>
                  ))}
                </ol>
                {examples.length > 0 && (
                  <p className="pattern-checklist-examples">
                    <span className="pattern-checklist-examples-label">
                      Worked examples:
                    </span>
                    {examples.map((specimen, index) => (
                      <span key={specimen.id}>
                        {index > 0 ? ", " : " "}
                        <a
                          className="pattern-checklist-example-link"
                          href={routeToHash({ kind: "walk", slot: specimen.id })}
                        >
                          {specimen.number} —{" "}
                          {specimen.fieldGuideLinkLabel ?? specimen.railLabel}
                        </a>
                      </span>
                    ))}
                  </p>
                )}
              </article>
            );
          })}
        </div>
      </section>

      <section
        className="field-guide-section"
        aria-labelledby="prompt-pack-title"
        data-testid="prompt-pack"
      >
        <header className="field-guide-section-head">
          <p className="field-guide-section-eyebrow">Optional copyable prompts</p>
          <h2 id="prompt-pack-title">Prompts for outside review tools</h2>
          <p>
            These static prompts are written to force explicit assumptions,
            preserve claim boundaries, and separate rewriting from validation.
            Use them only in tools and contexts your own data, privacy, and
            source rules allow.
          </p>
        </header>
        <div className="prompt-card-list">
          {promptCards.map((card) => (
            <PromptCard card={card} key={card.id} />
          ))}
        </div>
      </section>

      <section
        className="field-guide-section field-guide-section--research"
        aria-labelledby="field-guide-research-title"
      >
        <header className="field-guide-section-head">
          <p className="field-guide-section-eyebrow">Research anchors</p>
          <h2 id="field-guide-research-title">Why these checks exist</h2>
          <p>
            The guide combines survey-question guidance, federal pretesting
            standards, and learning-science constraints: make a prediction,
            compare examples, revisit confusable categories, and keep validation
            claims smaller than the evidence.
          </p>
        </header>
        <ul className="research-link-list">
          {researchLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href} target="_blank" rel="noopener noreferrer">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
