import { useState } from "react";
import type { WorkbenchSpecimen } from "../../types/workbench";
import { VerbatimQuote } from "../workbench/VerbatimQuote";
import {
  OptionalSource,
  PuzzleFrame,
  PuzzleInstrument,
  PuzzleProgress,
  PuzzleReveal
} from "./PuzzleFrame";

type DeckCard = {
  id: string;
  label: string;
  object: string;
  firstRead: string;
  consequence: string;
};

const cards: DeckCard[] = [
  {
    id: "laptop",
    label: "Laptop center",
    object: "Clamshell work laptop with built-in keyboard and screen",
    firstRead: "The label works here.",
    consequence: "This is the center case that makes the item look safer than it is."
  },
  {
    id: "chromebook",
    label: "Chromebook middle",
    object: "Small, thin web-first Chromebook",
    firstRead: "Notebook starts sounding like a lower-function laptop.",
    consequence: "The respondent is classifying a product family the form did not define."
  },
  {
    id: "tablet",
    label: "Detachable tablet",
    object: "Touch tablet with a keyboard case",
    firstRead: "The keyboard pulls it toward notebook.",
    consequence: "Tablet and laptop adoption can merge if the device feature rule stays hidden."
  },
  {
    id: "paper",
    label: "Literal notebook",
    object: "Paper notebook on the desk",
    firstRead: "Absurd, but useful.",
    consequence: "The everyday word still carries meanings outside the device domain."
  }
];

export function NotebookLabelDeck({
  specimen,
  titleId
}: {
  specimen: WorkbenchSpecimen;
  titleId: string;
}) {
  const [opened, setOpened] = useState<Record<string, boolean>>({});
  const openedCount = cards.filter((card) => opened[card.id]).length;
  const allOpened = openedCount === cards.length;

  return (
    <PuzzleFrame
      specimen={specimen}
      titleId={titleId}
      role="Your role: label tester"
      title="Flip the device cards. Watch “notebook” widen."
      lede="The trap is not that respondents lack devices. It is that one familiar word points to several nearby device families before the Yes/No answer is even chosen."
      className="puzzle--label-deck"
      progress={<PuzzleProgress completed={openedCount} total={cards.length} completeLabel="deck opened" />}
    >
      <PuzzleInstrument label="The device label">
        <p className="puzzle-instrument-prompt">Laptop or notebook computer</p>
      </PuzzleInstrument>

      <ol className="label-deck" aria-label="Device label cards">
        {cards.map((card) => {
          const isOpen = opened[card.id] === true;
          return (
            <li className={`label-card ${isOpen ? "is-open" : ""}`} key={card.id}>
              <p className="label-card-tag">{card.label}</p>
              <p className="label-card-object">{card.object}</p>
              <button
                type="button"
                className="label-card-button"
                aria-expanded={isOpen}
                onClick={() =>
                  setOpened((previous) => ({
                    ...previous,
                    [card.id]: true
                  }))
                }
                data-testid={`notebook-card-${specimen.id}-${card.id}`}
              >
                Test “notebook”
              </button>
              {isOpen && (
                <div
                  className="label-card-back"
                  data-testid={`notebook-result-${specimen.id}-${card.id}`}
                >
                  <p>{card.firstRead}</p>
                  <p>{card.consequence}</p>
                </div>
              )}
            </li>
          );
        })}
      </ol>

      {allOpened && (
        <PuzzleReveal
          specimen={specimen}
          eyebrow="Label drift caught"
          title="The word was not a harmless synonym."
        >
          <p>
            “Laptop” points to the center. “Notebook” starts collecting
            Chromebook, tablet-like, lower-function, and literal meanings. The
            answer can go wrong before a respondent ever reaches Yes or No.
          </p>
          <p className="puzzle-reveal-takeaway">
            The repair move is not more ceremony. It is to remove the drifting
            label or define the device features that count.
          </p>
          {specimen.verbatim && <VerbatimQuote verbatim={specimen.verbatim} />}
        </PuzzleReveal>
      )}

      <OptionalSource specimen={specimen} />
    </PuzzleFrame>
  );
}
