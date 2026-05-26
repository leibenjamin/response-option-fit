export type BuildOption = {
  id: string;
  label: string;
  blurb?: string;
};

export type SituationFate = "clean" | "split" | "forced" | "lost";
export type NonCleanSituationFate = Exclude<SituationFate, "clean">;

export type BuildRuleSourcePosture = "source_supported" | "teaching";

export type BuildRule = {
  id: string;
  label: string;
  shortLabel: string;
  body: string;
  sourcePosture: BuildRuleSourcePosture;
  sourceLabel: string;
  sourceNote: string;
  blockedForcedOptionIds?: string[];
  blockedForcedCopy?: string;
};

export type BuildRuleOutcome = {
  recordAs?: string;
  forceFate?: SituationFate;
  forceHomes?: string[];
  copy: string;
  missingCopy?: string;
};

export type BuildSituation = {
  id: string;
  who: string;
  reading: string;
  fitsClean: string[];
  fitsForced: string[];
  fateCopy?: Partial<Record<NonCleanSituationFate, string>>;
  ruleOutcomes?: Record<string, BuildRuleOutcome>;
};

export type BuildTopic = {
  id: string;
  label: string;
  shortLabel: string;
  stem: string;
  framing: string;
  palette: BuildOption[];
  rules: [BuildRule, ...BuildRule[]];
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
  ruleId?: string;
  ruleLabel?: string;
  ruleApplied?: boolean;
  ruleMissing?: boolean;
  ruleCopy?: string;
};

export type BuildTopicResult = {
  topic: BuildTopic;
  results: BuildSituationResult[];
  counts: Record<SituationFate, number>;
  rule?: BuildRule;
};

/* The "export" the analyst would actually receive: a tidy frequency table.
   Rows are the selected answer options that caught at least one record that
   the form can place deterministically (clean or forced) — and a clean
   record and a forced record look identical once they are a count. Split
   cases cannot be placed in a single cell, and lost cases never enter the
   table at all, so both sit outside the rows. The point the table makes is
   that respondentCount (people who answered) does not equal placedCount
   (people the export can file). */
export type BuildExportRow = {
  optionId: string;
  label: string;
  results: BuildSituationResult[];
  count: number;
};

export type BuildExportTable = {
  rows: BuildExportRow[];
  ambiguous: BuildSituationResult[];
  lost: BuildSituationResult[];
  respondentCount: number;
  placedCount: number;
  emptySelectedLabels: string[];
};

function emptyCounts(): Record<SituationFate, number> {
  return {
    clean: 0,
    split: 0,
    forced: 0,
    lost: 0
  };
}

export function evaluateSituation(
  situation: BuildSituation,
  chosen: ReadonlySet<string>,
  topic?: BuildTopic,
  rule?: BuildRule
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

  const baseResult = { situation, fate, cleanHomes, forcedHomes };
  if (!topic || !rule) return baseResult;

  const outcome = situation.ruleOutcomes?.[rule.id];
  if (outcome?.recordAs) {
    if (chosen.has(outcome.recordAs)) {
      return {
        situation,
        fate: "clean",
        cleanHomes: [outcome.recordAs],
        forcedHomes: [],
        ruleId: rule.id,
        ruleLabel: rule.label,
        ruleApplied: true,
        ruleCopy: outcome.copy
      };
    }

    return {
      situation,
      fate: "lost",
      cleanHomes: [],
      forcedHomes: [],
      ruleId: rule.id,
      ruleLabel: rule.label,
      ruleApplied: true,
      ruleMissing: true,
      ruleCopy:
        outcome.missingCopy ??
        `${rule.label} needs ${optionLabel(topic, outcome.recordAs)}, which is not in the answer set you built.`
    };
  }

  if (outcome?.forceFate) {
    const forceHomes = (outcome.forceHomes ?? []).filter((id) => chosen.has(id));
    return {
      situation,
      fate: outcome.forceFate,
      cleanHomes: outcome.forceFate === "clean" || outcome.forceFate === "split" ? forceHomes : [],
      forcedHomes: outcome.forceFate === "forced" ? forceHomes : [],
      ruleId: rule.id,
      ruleLabel: rule.label,
      ruleApplied: true,
      ruleCopy: outcome.copy
    };
  }

  if (rule.blockedForcedOptionIds?.length && baseResult.fate === "forced") {
    const blocked = new Set(rule.blockedForcedOptionIds);
    const allowedForcedHomes = baseResult.forcedHomes.filter((id) => !blocked.has(id));
    if (allowedForcedHomes.length !== baseResult.forcedHomes.length) {
      return {
        situation,
        fate: allowedForcedHomes.length >= 1 ? "forced" : "lost",
        cleanHomes: [],
        forcedHomes: allowedForcedHomes,
        ruleId: rule.id,
        ruleLabel: rule.label,
        ruleApplied: true,
        ruleCopy:
          rule.blockedForcedCopy ??
          "The rule refuses to let a residual answer hide a named-mode or instruction problem."
      };
    }
  }

  return {
    ...baseResult,
    ruleId: rule.id,
    ruleLabel: rule.label
  };
}

export function evaluateTopic(
  topic: BuildTopic,
  chosenIds: readonly string[],
  ruleId?: string | null
): BuildTopicResult {
  const chosen = new Set(chosenIds);
  const rule = ruleId ? topic.rules.find((candidate) => candidate.id === ruleId) : undefined;
  const results = topic.situations.map((situation) =>
    evaluateSituation(situation, chosen, topic, rule)
  );
  const counts = emptyCounts();

  for (const result of results) {
    counts[result.fate] += 1;
  }

  return { topic, results, counts, rule };
}

export function optionLabel(topic: BuildTopic, id: string): string {
  return topic.palette.find((option) => option.id === id)?.label ?? id;
}

export function makeExportTable(
  result: BuildTopicResult,
  chosenIds: readonly string[]
): BuildExportTable {
  const placedByOption = new Map<string, BuildSituationResult[]>();
  const ambiguous: BuildSituationResult[] = [];
  const lost: BuildSituationResult[] = [];

  for (const item of result.results) {
    if (item.fate === "clean" || item.fate === "forced") {
      const home =
        item.fate === "clean" ? item.cleanHomes[0] : item.forcedHomes[0];
      if (!home) {
        lost.push(item);
        continue;
      }
      const list = placedByOption.get(home) ?? [];
      list.push(item);
      placedByOption.set(home, list);
    } else if (item.fate === "split") {
      ambiguous.push(item);
    } else {
      lost.push(item);
    }
  }

  const rows: BuildExportRow[] = result.topic.palette
    .filter((option) => chosenIds.includes(option.id) && placedByOption.has(option.id))
    .map((option) => {
      const results = placedByOption.get(option.id) ?? [];
      return {
        optionId: option.id,
        label: option.label,
        results,
        count: results.length
      };
    });

  const emptySelectedLabels = result.topic.palette
    .filter((option) => chosenIds.includes(option.id) && !placedByOption.has(option.id))
    .map((option) => option.label);

  const placedCount = rows.reduce((total, row) => total + row.count, 0);

  return {
    rows,
    ambiguous,
    lost,
    respondentCount: result.results.length,
    placedCount,
    emptySelectedLabels
  };
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
    rules: [
      {
        id: "longest-distance",
        label: "Longest-distance rule",
        shortLabel: "Census-supported",
        body:
          "When one commute uses multiple methods, record the single method used for the longest distance.",
        sourcePosture: "source_supported",
        sourceLabel: "Census FAQ",
        sourceNote:
          "Census commuting guidance supports this rule for multimodal ACS journey-to-work answers."
      },
      {
        id: "usual-week",
        label: "Usual reference-week rule",
        shortLabel: "Authored teaching rule",
        body:
          "Record the pattern that best represents the reference week, not the memorable exception.",
        sourcePosture: "teaching",
        sourceLabel: "Authored teaching rule",
        sourceNote:
          "This is an authored teaching instruction for the route, not an additional Census rule claim."
      },
      {
        id: "residual-last",
        label: "Residual-last rule",
        shortLabel: "Authored teaching rule",
        body:
          "Use Other method only when the situation honestly sits outside the named modes; do not use it to bury a missing rule.",
        sourcePosture: "teaching",
        sourceLabel: "Authored teaching rule",
        sourceNote:
          "This clarifies the exhibit's residual-category posture rather than adding an official Census instruction.",
        blockedForcedOptionIds: ["other"],
        blockedForcedCopy:
          "Other method is blocked as a hiding place here; the rule would rather expose the missing instruction than export a tidy residual."
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
        },
        ruleOutcomes: {
          "longest-distance": {
            recordAs: "train",
            copy:
              "The longest-distance rule records Dana by the train leg. The drive is still real; it just stops being the exported commute method.",
            missingCopy:
              "The longest-distance rule points to rail, but your answer set did not include it. The rule exposes the missing option instead of quietly recording the drive."
          }
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
        },
        ruleOutcomes: {
          "usual-week": {
            recordAs: "wfh",
            copy:
              "The reference-week rule records Sam as working from home because that is the usual pattern in this authored week.",
            missingCopy:
              "The reference-week rule points to Worked from home, but your answer set did not offer it. The bus days are true and still not the week."
          }
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
        },
        ruleOutcomes: {
          "residual-last": {
            recordAs: "other",
            copy:
              "The residual-last rule lets Other method work here because the parent ride is outside the named worker-carpool and hired-ride modes.",
            missingCopy:
              "The residual-last rule needs a valid residual for Lin. Carpool and ride-hailing cannot stand in for the parent ride."
          }
        }
      },
      {
        id: "marco",
        who: "Marco drives for a delivery app; the car is where the work happens.",
        reading:
          "He is not traveling to a workplace; he is working while moving through the city.",
        fitsClean: [],
        fitsForced: ["car-alone", "taxi", "other"],
        fateCopy: {
          forced:
            "The form records a commute mode for someone whose real issue is whether there was a commute at all.",
          lost:
            "No commute answer fits because the question assumes a trip to work."
        },
        ruleOutcomes: {
          "usual-week": {
            forceFate: "lost",
            copy:
              "The reference-week rule cannot summarize Marco as traveling to work; the case is an eligibility problem being forced into a commute-mode category."
          },
          "residual-last": {
            forceFate: "lost",
            copy:
              "Residual-last refuses to file Marco under Other method because the missing decision is whether this is a commute at all."
          }
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
        },
        ruleOutcomes: {
          "longest-distance": {
            recordAs: "bus",
            copy:
              "The longest-distance rule records Priya by the bus leg. The bicycle leg remains part of the story, not the exported method.",
            missingCopy:
              "The longest-distance rule points to Bus, but your answer set did not include it. The bike leg cannot carry the whole record by itself."
          }
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
        },
        ruleOutcomes: {
          "usual-week": {
            recordAs: "car-alone",
            copy:
              "The reference-week rule records Owen by the usual solo driving pattern and keeps the one-off app ride from taking over the column.",
            missingCopy:
              "The reference-week rule points to Drove alone, but your answer set did not include it. The exceptional app ride is still a bad proxy."
          }
        }
      }
    ],
    reveal: {
      lead: "No answer set made the commute world tidy.",
      body:
        "Adding more choices helped some people and created new overlaps for others. A public rule can repair some of that, but the export still keeps the recorded box more clearly than the route that produced it.",
      bridgeHref: "#walk/ride-hailing",
      bridgeLabel: "Open the ride-hailing puzzle"
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
      "Teaching case only: these foods are authored boundary cases, not source claims from public survey materials.",
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
        blurb: "A deliberate answer for cases the taxonomy rejects."
      },
      {
        id: "other",
        label: "Other",
        blurb:
          "An honest residual only for foods outside the categories you meant to name."
      }
    ],
    rules: [
      {
        id: "hierarchy",
        label: "Named exception beats family",
        shortLabel: "Authored teaching rule",
        body:
          "If a food has a named edge category, record that before the broad family label.",
        sourcePosture: "teaching",
        sourceLabel: "Authored teaching rule",
        sourceNote:
          "A playful taxonomy rule for the teaching case; it is not a food-law or source claim."
      },
      {
        id: "structure",
        label: "Structure beats name",
        shortLabel: "Authored teaching rule",
        body:
          "Classify by the physical architecture first: carrier, filling, closure, and wrapper.",
        sourcePosture: "teaching",
        sourceLabel: "Authored teaching rule",
        sourceNote:
          "A teaching rule for making private category logic visible before the export happens."
      },
      {
        id: "context",
        label: "Meal context beats shape",
        shortLabel: "Authored teaching rule",
        body:
          "Let use-context settle the border cases: lunch object, dessert object, pastry object, or deliberate non-sandwich.",
        sourcePosture: "teaching",
        sourceLabel: "Authored teaching rule",
        sourceNote:
          "A deliberately playful rule with a serious purpose: the category has to say which feature controls the classification."
      }
    ],
    situations: [
      {
        id: "club",
        who: "A three-slice club with turkey, bacon, lettuce, and tomato.",
        reading:
          "It is strongly sandwich-shaped, even with the extra layer.",
        fitsClean: ["sandwich"],
        fitsForced: ["other"],
        fateCopy: {
          forced:
            "Other records the food, but it makes the easiest case look exceptional.",
          lost:
            "If even the club has no place to go, the form is not classifying sandwiches yet."
        },
        ruleOutcomes: {
          hierarchy: {
            recordAs: "sandwich",
            copy:
              "The hierarchy rule does not need an exception here. The club gets to be the boring control case."
          },
          structure: {
            recordAs: "sandwich",
            copy:
              "The structure rule sees bread enclosing filling and records the club as Sandwich."
          },
          context: {
            recordAs: "sandwich",
            copy:
              "The context rule keeps the lunch item in Sandwich. The easy control case stays easy."
          }
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
            "The hot dog has no official category, which will not resolve the disagreement outside the form."
        },
        ruleOutcomes: {
          hierarchy: {
            recordAs: "hotdog",
            copy:
              "The hierarchy rule records the named exception first: Hot dog beats the broader sandwich family.",
            missingCopy:
              "The hierarchy rule points to Hot dog, but your answer set did not include the exception it needs."
          },
          structure: {
            recordAs: "sandwich",
            copy:
              "The structure rule treats the split bun as sandwich architecture and records the hot dog under Sandwich.",
            missingCopy:
              "The structure rule points to Sandwich, but your answer set did not include the broad family label."
          },
          context: {
            recordAs: "hotdog",
            copy:
              "The context rule keeps the cookout category separate. It resolves the familiar hot-dog debate by stating the rule.",
            missingCopy:
              "The context rule wants the Hot dog category; without it, the form has to admit the exception is missing."
          }
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
            "Other avoids the conflict by removing the distinction the menu was supposed to make.",
          lost:
            "The burrito is left unclassified because the taxonomy did not define its boundary cases."
        },
        ruleOutcomes: {
          hierarchy: {
            recordAs: "wrap",
            copy:
              "The hierarchy rule sends the burrito to the named wrap/burrito exception before the broad sandwich family.",
            missingCopy:
              "The hierarchy rule points to Wrap / burrito, but your answer set did not include it."
          },
          structure: {
            recordAs: "wrap",
            copy:
              "The structure rule uses the flexible wrapper as decisive and records Wrap / burrito.",
            missingCopy:
              "The structure rule needs Wrap / burrito; Sandwich alone is too coarse for this rule."
          },
          context: {
            recordAs: "wrap",
            copy:
              "The context rule keeps the burrito in Wrap / burrito rather than making bread type decide every lunch case.",
            missingCopy:
              "The context rule points to Wrap / burrito, which your answer set did not offer."
          }
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
        },
        ruleOutcomes: {
          hierarchy: {
            recordAs: "dessert",
            copy:
              "The hierarchy rule lets the named dessert category beat the broad sandwich family.",
            missingCopy:
              "The hierarchy rule points to Dessert sandwich, but your answer set did not include it."
          },
          structure: {
            recordAs: "sandwich",
            copy:
              "The structure rule takes the two-sided architecture literally and records Sandwich.",
            missingCopy:
              "The structure rule points to Sandwich, but your answer set did not include it."
          },
          context: {
            recordAs: "dessert",
            copy:
              "The context rule records the frozen dessert as Dessert sandwich. Dessert context decides this case.",
            missingCopy:
              "The context rule needs Dessert sandwich; without it, the dessert exposes a gap in the taxonomy."
          }
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
            "The missing top slice leaves the answer list with no valid category."
        },
        ruleOutcomes: {
          hierarchy: {
            recordAs: "open-faced",
            copy:
              "The hierarchy rule records the named open-faced exception before the broad sandwich family.",
            missingCopy:
              "The hierarchy rule points to Open-faced, but your answer set did not include it."
          },
          structure: {
            recordAs: "open-faced",
            copy:
              "The structure rule treats the missing top slice as decisive and records Open-faced.",
            missingCopy:
              "The structure rule needs Open-faced; Sandwich alone does not preserve the top-slice rule."
          },
          context: {
            recordAs: "open-faced",
            copy:
              "The context rule keeps the melt in Open-faced. The missing top slice matters.",
            missingCopy:
              "The context rule points to Open-faced, which your answer set did not offer."
          }
        }
      },
      {
        id: "pop-tart",
        who: "A Pop-Tart with filling sealed inside pastry.",
        reading:
          "It is filling inside a starch shell, but it does not belong in the lunch taxonomy most people intend.",
        fitsClean: ["pastry", "not"],
        fitsForced: ["sandwich", "dessert", "other"],
        fateCopy: {
          split:
            "Pastry and Not a sandwich both work, but they answer different questions: what it is versus what it is not.",
          forced:
            "The form can force the Pop-Tart into a nearby sweet or sandwich-like bucket, and the result looks cleaner than the decision was.",
          lost:
            "The pastry has no category because the form only prepared for the boundary argument it expected."
        },
        ruleOutcomes: {
          hierarchy: {
            recordAs: "pastry",
            copy:
              "The hierarchy rule records Pastry before the negative label. The positive category comes before the rejection category.",
            missingCopy:
              "The hierarchy rule points to Pastry, but your answer set did not include the category that resolves this boundary case."
          },
          structure: {
            recordAs: "not",
            copy:
              "The structure rule treats the sealed pastry shell as outside sandwich architecture and records Not a sandwich.",
            missingCopy:
              "The structure rule points to Not a sandwich, but your answer set did not include the rejection category."
          },
          context: {
            recordAs: "pastry",
            copy:
              "The context rule records Pastry. A filled toaster pastry does not become a lunch category just because it has a filling.",
            missingCopy:
              "The context rule needs Pastry; otherwise the filled pastry gets forced into a category it was not meant to use."
          }
        }
      }
    ],
    reveal: {
      lead: "The playful taxonomy broke for the same serious reason.",
      body:
        "Categories feel obvious when they stay private. The moment a form has to record one answer, the private rule has to become public or the export turns the unresolved argument into clean-looking data.",
      bridgeHref: "#field-guide",
      bridgeLabel: "Take the same check to a real survey draft"
    }
  }
];
