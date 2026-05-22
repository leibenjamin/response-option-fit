import { routeToHash } from "../lib/routes";

/* The closing beat of the whole exhibit (end of #walk/done). The "role arc"
   payoff: across the exhibit the visitor stood on all four sides of one small
   failure — respondent, form, analyst, reviewer — and it looked fine from every
   one. Names where each role happened (so it labels the journey without
   sprinkling cheesy "you are the X" tags on every surface), states the single
   durable habit to carry out, and gives ONE clear next action. Replaces the old
   multi-button nav with one primary CTA + a quiet secondary row. */

const ROLE_ARC = [
  {
    role: "Respondent",
    where: "the hook — your honest answer wouldn’t fit “one word only.”"
  },
  {
    role: "Form",
    where: "Play the form — you recorded the wrong thing anyway."
  },
  {
    role: "Analyst",
    where: "Build & break — your clean export quietly lied."
  },
  {
    role: "Reviewer",
    where: "the cold read — you had to catch it on someone else’s form."
  }
] as const;

export function ExitArtifact({
  isEmpty,
  firstSpecimenId
}: {
  isEmpty: boolean;
  firstSpecimenId: string;
}) {
  const primary = isEmpty
    ? {
        href: routeToHash({ kind: "walk", slot: firstSpecimenId }),
        label: "Start with example 01",
        testid: "exit-cta-start"
      }
    : {
        href: routeToHash({ kind: "fieldGuide" }),
        label: "Take that question to your own survey draft",
        testid: "exit-cta-field-guide"
      };

  return (
    <section
      className="exit-artifact"
      aria-labelledby="exit-artifact-title"
      data-testid="exit-artifact"
    >
      <p className="exit-artifact-eyebrow">The takeaway</p>
      <h2 className="exit-artifact-title" id="exit-artifact-title">
        One small failure, seen from all four sides.
      </h2>

      <ol className="exit-arc">
        {ROLE_ARC.map((step, index) => (
          <li className="exit-arc-step" key={step.role}>
            <span className="exit-arc-num" aria-hidden="true">
              {index + 1}
            </span>
            <span className="exit-arc-body">
              <span className="exit-arc-role">{step.role}</span>
              <span className="exit-arc-where">{step.where}</span>
            </span>
          </li>
        ))}
      </ol>

      <p className="exit-artifact-body">
        A respondent’s answer didn’t fit the box. The form recorded something
        anyway. The analyst’s column looked clean and lied. The reviewer had to
        catch it cold. Same small failure, four vantage points — and it looked
        fine from every one until you looked closer.
      </p>

      <p className="exit-artifact-habit">
        So before you trust a tidy column, ask the question it can’t answer
        itself: <strong>which different answers did it quietly merge — and did
        the form ever give them a clear place to go?</strong>
      </p>

      <div className="exit-artifact-actions">
        <a
          className="cta-button cta-button--primary"
          href={primary.href}
          data-testid={primary.testid}
        >
          <span>{primary.label}</span>
          <span aria-hidden="true" className="cta-button-arrow">→</span>
        </a>
        <p className="exit-artifact-secondary">
          or revisit the{" "}
          <a href={routeToHash({ kind: "reference" })} data-testid="exit-link-reference">
            reference shelf
          </a>
          ,{" "}
          <a href={routeToHash({ kind: "colophon" })} data-testid="exit-link-colophon">
            the colophon
          </a>
          , or the{" "}
          <a href={routeToHash({ kind: "hub" })} data-testid="exit-link-hub">
            overview
          </a>
          .
        </p>
      </div>
    </section>
  );
}
