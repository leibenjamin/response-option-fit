import type { Verbatim } from "../../types/workbench";

/* A real respondent's verbatim words, pulled from the cited cognitive-testing
   report and confirmed against the source PDF before shipping. This is the
   un-replicable layer of the exhibit: a model can paraphrase a finding, but it
   can't hand you a real person's confused sentence. Rendered as a quiet pulled
   quote — realness as delight, not citation ceremony — so the attribution stays
   light (survey + year), never a page-number parade. Shared by puzzle reveals
   so the human voice reads the same everywhere. */
export function VerbatimQuote({ verbatim }: { verbatim: Verbatim }) {
  return (
    <figure className="verbatim">
      <blockquote className="verbatim-quote">
        <span className="verbatim-mark" aria-hidden="true">
          &ldquo;
        </span>
        <p>{verbatim.quote}</p>
      </blockquote>
      <figcaption className="verbatim-attr">
        <span className="verbatim-attr-who">A real respondent</span>
        <span className="verbatim-attr-src">{verbatim.attribution}</span>
      </figcaption>
    </figure>
  );
}
