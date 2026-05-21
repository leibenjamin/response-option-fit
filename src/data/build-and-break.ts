export type BuildOption = {
  id: string;
  label: string;
  blurb?: string;
};

export type SituationFate = "clean" | "split" | "forced" | "lost";
export type NonCleanSituationFate = Exclude<SituationFate, "clean">;

export type BuildSituation = {
  id: string;
  who: string;
  reading: string;
  fitsClean: string[];
  fitsForced: string[];
  fateCopy?: Partial<Record<NonCleanSituationFate, string>>;
};

export type BuildTopic = {
  id: string;
  label: string;
  shortLabel: string;
  stem: string;
  framing: string;
  palette: BuildOption[];
  situations: BuildSituation[];
  reveal: {
    lead: string;
    body: string;
    bridgeHref: string;
    bridgeLabel: string;
  };
  sourceNote?: string;
  isTeachingCase: boolean;
  situationStatus: string;
};

export type BuildSituationResult = {
  situation: BuildSituation;
  fate: SituationFate;
  cleanHomes: string[];
  forcedHomes: string[];
};

export type BuildTopicResult = {
  topic: BuildTopic;
  results: BuildSituationResult[];
  counts: Record<SituationFate, number>;
};

export function evaluateSituation(
  situation: BuildSituation,
  chosen: ReadonlySet<string>
): BuildSituationResult {
  const cleanHomes = situation.fitsClean.filter((id) => chosen.has(id));
  const forcedHomes = situation.fitsForced.filter((id) => chosen.has(id));
  const fate: SituationFate =
    cleanHomes.length >= 2
      ? "split"
      : cleanHomes.length === 1
        ? "clean"
        : forcedHomes.length >= 1
          ? "forced"
          : "lost";

  return { situation, fate, cleanHomes, forcedHomes };
}

export function evaluateTopic(
  topic: BuildTopic,
  chosenIds: readonly string[]
): BuildTopicResult {
  const chosen = new Set(chosenIds);
  const results = topic.situations.map((situation) =>
    evaluateSituation(situation, chosen)
  );
  const counts: Record<SituationFate, number> = {
    clean: 0,
    split: 0,
    forced: 0,
    lost: 0
  };

  for (const result of results) {
    counts[result.fate] += 1;
  }

  return { topic, results, counts };
}

export function optionLabel(topic: BuildTopic, id: string): string {
  return topic.palette.find((option) => option.id === id)?.label ?? id;
}

export const buildTopics: [BuildTopic, BuildTopic] = [
  {
    id: "commute",
    label: "Commute",
    shortLabel: "ACS commute",
    stem: "How did you usually get to work last week?",
    framing:
      "Build the answer choices first. Then six ordinary trips try to land in the form you made.",
    isTeachingCase: false,
    situationStatus: "Authored teaching situation",
    sourceNote:
      "Source boundary: ACS materials support the commute item, the single method used for the longest distance, the ride-hailing/carpooling distinction, and the placement of Worked from this address. The named commuters below are authored teaching situations.",
    palette: [
      {
        id: "car-alone",
        label: "Drove alone",
        blurb: "A car, truck, or van trip with no other worker in the vehicle."
      },
      {
        id: "carpool",
        label: "Carpooled",
        blurb: "A shared car trip where another worker is part of the commute."
      },
      {
        id: "bus",
        label: "Bus",
        blurb: "A public bus carries the main part of the trip."
      },
      {
        id: "train",
        label: "Subway / train / light rail",
        blurb: "Rail transit, whether local or commuter."
      },
      {
        id: "walk",
        label: "Walked",
        blurb: "The whole commute happens on foot."
      },
      {
        id: "bike",
        label: "Bicycle",
        blurb: "A bicycle is the reported way to work."
      },
      {
        id: "wfh",
        label: "Worked from home",
        blurb: "The work address is the home address for the reference week."
      },
      {
        id: "taxi",
        label: "Taxi or ride-hailing",
        blurb: "A hired ride or app-based paid car service."
      },
      {
        id: "other",
        label: "Other method",
        blurb:
          "An honest residual for trips outside the named list; a hiding place when the named list should have fit."
      }
    ],
    situations: [
      {
        id: "dana",
        who: "Dana drives to the station, parks, then takes the train the rest of the way.",
        reading:
          "Both legs are real, and each could feel like the answer if the form never says which leg controls.",
        fitsClean: ["car-alone", "train"],
        fitsForced: ["other"],
        fateCopy: {
          split:
            "Two honest homes are open. Without a longest-distance rule, the drive and the train both look recordable.",
          forced:
            "Other method keeps Dana from disappearing, but it hides the two named modes the form actually offered.",
          lost:
            "No offered choice can hold the mixed commute, so the trip falls out before analysis starts."
        }
      },
      {
        id: "sam",
        who: "Sam works from home three days and takes the bus to the office two days.",
        reading:
          "The office commute happened, but it was not most of Sam's work week.",
        fitsClean: ["wfh"],
        fitsForced: ["bus", "other"],
        fateCopy: {
          forced:
            "The office-day route becomes Sam's whole week. The bus answer is true and still misleading.",
          lost:
            "With no home-work option and no usable commute mode, Sam's week has nowhere honest to go."
        }
      },
      {
        id: "lin",
        who: "Lin got a one-off ride from a parent who was not commuting.",
        reading:
          "It was a ride in a car, but not a worker carpool and not a hired service.",
        fitsClean: ["other"],
        fitsForced: ["carpool", "taxi"],
        fateCopy: {
          forced:
            "The form can file Lin under a familiar ride label, but that invents the wrong kind of trip.",
          lost:
            "The parent ride is ordinary in life and absent in the answer list."
        }
      },
      {
        id: "marco",
        who: "Marco drives for a delivery app; the car is where the work happens.",
        reading:
          "He is not traveling to a workplace so much as working by moving through the city.",
        fitsClean: [],
        fitsForced: ["car-alone", "taxi", "other"],
        fateCopy: {
          forced:
            "The form records a commute mode for someone whose edge case is whether there was a commute at all.",
          lost:
            "No commute answer fits because the question assumes a trip to work."
        }
      },
      {
        id: "priya",
        who: "Priya bikes ten minutes to a bus stop, then rides the bus across town.",
        reading:
          "The bike is part of the commute; the bus carries the longer leg.",
        fitsClean: ["bike", "bus"],
        fitsForced: ["other"],
        fateCopy: {
          split:
            "The same trip now lands in two named boxes. A longest-distance rule would settle this; the palette alone does not.",
          forced:
            "Other method keeps a count, but it throws away the very modes the form seemed to care about.",
          lost:
            "The multimodal trip has no declared route through the answer list."
        }
      },
      {
        id: "owen",
        who: "Owen mostly drives alone, but used a ride-hailing service once when his car was in the shop.",
        reading:
          "The app ride happened; the driving pattern describes the usual week.",
        fitsClean: ["car-alone"],
        fitsForced: ["taxi", "other"],
        fateCopy: {
          forced:
            "The exceptional app ride is true, but it becomes the recorded commute pattern.",
          lost:
            "The trip history is knowable; the form just did not offer a stable way to summarize it."
        }
      }
    ],
    reveal: {
      lead: "No answer set made the commute world tidy.",
      body:
        "Adding more choices helped some people and created new overlaps for others. That is the point: the form keeps one recorded box, while the respondent's rule for getting there stays off the spreadsheet.",
      bridgeHref: "#walk/ride-hailing",
      bridgeLabel: "Open the sourced ride-hailing example"
    }
  },
  {
    id: "sandwich",
    label: "Sandwich",
    shortLabel: "Teaching case",
    stem: "What is this food?",
    framing:
      "A deliberately playful version of the same mechanics: build a menu taxonomy, then let boundary cases try to use it.",
    isTeachingCase: true,
    situationStatus: "Authored teaching situation",
    sourceNote:
      "Teaching case only: these foods are authored boundary cases, not source claims from Census or ONS materials.",
    palette: [
      {
        id: "sandwich",
        label: "Sandwich",
        blurb: "Bread or bread-like exterior, filling, and a familiar lunch logic."
      },
      {
        id: "hotdog",
        label: "Hot dog",
        blurb: "A named category that some people keep separate from sandwich."
      },
      {
        id: "wrap",
        label: "Wrap / burrito",
        blurb: "Filling enclosed by a flexible flatbread."
      },
      {
        id: "open-faced",
        label: "Open-faced",
        blurb: "Bread underneath, filling on top, no second slice."
      },
      {
        id: "pastry",
        label: "Pastry",
        blurb: "Dough first, filling second, usually not lunch."
      },
      {
        id: "dessert",
        label: "Dessert sandwich",
        blurb: "A sweet object borrowing sandwich structure."
      },
      {
        id: "not",
        label: "Not a sandwich",
        blurb: "A deliberate escape hatch for rejected edge cases."
      },
      {
        id: "other",
        label: "Other",
        blurb:
          "An honest residual only for foods outside the categories you meant to name."
      }
    ],
    situations: [
      {
        id: "club",
        who: "A three-slice club with turkey, bacon, lettuce, and tomato.",
        reading:
          "It is almost aggressively sandwich-shaped, even with the extra layer.",
        fitsClean: ["sandwich"],
        fitsForced: ["other"],
        fateCopy: {
          forced:
            "Other records the food, but it makes the easiest case look exceptional.",
          lost:
            "If even the club has no place to go, the form is not classifying sandwiches yet."
        }
      },
      {
        id: "hotdog",
        who: "A hot dog in a split bun.",
        reading:
          "It has bread around a filling, and also a category name people often defend separately.",
        fitsClean: ["hotdog", "sandwich"],
        fitsForced: ["other"],
        fateCopy: {
          split:
            "The hot dog lands in both the named exception and the larger sandwich family. The form has to choose whether hierarchy counts.",
          forced:
            "Other avoids the argument by hiding the category decision.",
          lost:
            "The hot dog has no official home, which will not end the argument outside the form."
        }
      },
      {
        id: "burrito",
        who: "A burrito wrapped closed around rice, beans, and meat.",
        reading:
          "It is hand-held and filling-bearing, but the tortilla is doing different work than sliced bread.",
        fitsClean: ["wrap", "sandwich"],
        fitsForced: ["other"],
        fateCopy: {
          split:
            "The burrito can be a wrap and a broad sandwich if the form never says what bread-like means.",
          forced:
            "Other keeps peace by throwing away the distinction the menu was supposed to make.",
          lost:
            "The burrito falls through because the taxonomy forgot its own borderlands."
        }
      },
      {
        id: "ice-cream",
        who: "An ice-cream sandwich: frozen filling between two wafers.",
        reading:
          "The name says sandwich; the meal context says dessert.",
        fitsClean: ["dessert", "sandwich"],
        fitsForced: ["other"],
        fateCopy: {
          split:
            "Name and use both count, so the dessert lands in two boxes at once.",
          forced:
            "Other records the exception but hides why the label was easy and strange at the same time.",
          lost:
            "The form has no way to honor either the name or the dessert logic."
        }
      },
      {
        id: "open-melt",
        who: "An open-faced tuna melt on one slice of toast.",
        reading:
          "It has bread and filling, but the missing top slice changes the rule.",
        fitsClean: ["open-faced", "sandwich"],
        fitsForced: ["other"],
        fateCopy: {
          split:
            "The melt is both a named open-faced case and a broad sandwich if closure is not a rule.",
          forced:
            "Other preserves the count and loses the structural question.",
          lost:
            "The missing top slice makes the whole answer list go quiet."
        }
      },
      {
        id: "pop-tart",
        who: "A Pop-Tart with filling sealed inside pastry.",
        reading:
          "It is filling inside a starch shell, but almost no one wants it in the lunch taxonomy.",
        fitsClean: ["pastry", "not"],
        fitsForced: ["sandwich", "dessert", "other"],
        fateCopy: {
          split:
            "Pastry and Not a sandwich both work, but they answer different questions: what it is versus what it is not.",
          forced:
            "The form can cram the Pop-Tart into a nearby sweet or sandwich-ish bucket, and the result looks cleaner than the decision was.",
          lost:
            "The pastry has no home because the form only prepared for the argument it expected."
        }
      }
    ],
    reveal: {
      lead: "The silly taxonomy broke for the same serious reason.",
      body:
        "Categories feel obvious when they live in your head. The moment a form has to store one answer, private rules become public data loss.",
      bridgeHref: "#field-guide",
      bridgeLabel: "Take the same check to a real survey draft"
    }
  }
];
