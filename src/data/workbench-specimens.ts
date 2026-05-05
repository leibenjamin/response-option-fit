import type { FailurePattern, WorkbenchSpecimen } from "../types/workbench";

const claimBoundaryNote =
  "This is one path the survey team took. Your edit may have addressed the issue differently. We do not validate alternative wording here.";

const canonicalSubtitleByPattern = {
  label_ambiguity: "Lexical ambiguity",
  broad_bucket: "Vague concept / response-task mismatch",
  false_premise: "Inappropriate assumption",
  category_boundary_blur: "Overlapping or vague response categories",
  sequence_overlap: "Question-order carryover",
  forced_precision: "Assumes constant behavior"
} satisfies Record<FailurePattern, string>;

const canonicalCitationByPattern = {
  label_ambiguity: [
    {
      author: "Willis & Lessler",
      year: 1999,
      locator: "QAS-99 §3c, pp. 3-12 to 3-16"
    },
    {
      author: "Schwarz et al.",
      year: 2008,
      locator: "International Handbook of Survey Methodology, pp. 19-23"
    }
  ],
  broad_bucket: [
    {
      author: "Smyth & Olson",
      year: 2019,
      locator: "JSSM 7(1):34-65"
    },
    {
      author: "Willis & Lessler",
      year: 1999,
      locator: "QAS-99 §3c"
    }
  ],
  false_premise: [
    {
      author: "Willis & Lessler",
      year: 1999,
      locator: "QAS-99 §4a, p. 3-17"
    },
    {
      author: "Willis",
      year: 2012,
      locator: "Cognitive Interviewing Training Guide §5"
    }
  ],
  category_boundary_blur: [
    {
      author: "Willis & Lessler",
      year: 1999,
      locator: "QAS-99 §7d, §7e, pp. 3-33 to 3-35"
    }
  ],
  sequence_overlap: [
    {
      author: "Schwarz et al.",
      year: 2008,
      locator: "International Handbook of Survey Methodology, ch. on context effects"
    }
  ],
  forced_precision: [
    {
      author: "Willis & Lessler",
      year: 1999,
      locator: "QAS-99 §4b, p. 3-19"
    },
    {
      author: "Bradburn, Rips & Shevell",
      year: 1987,
      locator: "Science 236:157-161"
    }
  ]
} satisfies Record<FailurePattern, WorkbenchSpecimen["canonicalCitations"]>;

const prerequisiteVocabByPattern = {
  label_ambiguity:
    "Label ambiguity: one response label points to more than one plausible meaning, so respondents can classify the same reality by different rules.",
  broad_bucket:
    "Broad bucket: one response field spans more than one construct or level of detail, so unlike answers can all look responsive.",
  false_premise:
    "False premise: a question assumes a condition is true, or makes the inapplicable path weak enough that No absorbs it.",
  category_boundary_blur:
    "Category boundary blur: neighboring classes use overlapping features, so respondents cannot tell which side their case belongs on.",
  sequence_overlap:
    "Sequence overlap: a prior item changes how the next response option is interpreted, so the same event can fit twice.",
  forced_precision:
    "Forced precision: the wording requires a single exact-looking answer from a reality that is variable, episodic, or only partly stable."
} satisfies Record<FailurePattern, string>;

function predictionCopy(
  covered: [label: string, description: string],
  ambiguous: [label: string, description: string],
  notCovered: [label: string, description: string]
): WorkbenchSpecimen["predictionCopy"] {
  return {
    covered: { label: covered[0], description: covered[1] },
    ambiguous: { label: ambiguous[0], description: ambiguous[1] },
    not_covered: { label: notCovered[0], description: notCovered[1] }
  };
}

const acsRound3Title =
  "Cognitive Testing for the 2022 ACS Content Test Round 3 Briefing and Recommendations Report";
const acsRound3Url =
  "https://www.census.gov/content/dam/Census/library/working-papers/2022/acs/2022_Wilson_02.pdf";
const cpsSelfResponseTitle =
  "Cognitive Testing for an Internet Self-Response Mode of the Current Population Survey: Findings and Recommendations";
const cpsSelfResponseUrl =
  "https://www2.census.gov/library/working-papers/2025/adrm/cbsm/rsm2025-03.pdf";
const ahs2023Title = "Cognitive Pretesting of 2023 American Housing Survey Modules";
const ahs2023Url = "https://www2.census.gov/adrm/CBSM/rsm2022-11.pdf";
const acsRound12Title = "2022 ACS Content Test: Round 1 and Round 2 Cognitive Testing Results";
const acsRound12Url =
  "https://www.census.gov/content/dam/Census/library/working-papers/2022/acs/2022_Wilson_01.pdf";
const ahs2025Title = "Cognitive Pretesting of 2025 American Housing Survey Modules";
const ahs2025Url =
  "https://www2.census.gov/library/working-papers/2024/adrm/cbsm/rsm2024-11.pdf";
const ntia2021Title =
  "Cognitive Pretesting of the National Telecommunications and Information Administration's 2021 Internet Use Survey";
const ntia2021Url = "https://www2.census.gov/adrm/CBSM/rsm2022-08.pdf";
const onsKashmiriTitle = "Kashmiri Research Project Final Report";
const onsKashmiriUrl =
  "https://www.ons.gov.uk/file?uri=%2Fcensus%2F2011census%2Fhowourcensusworks%2Fhowweplannedthe2011census%2Fquestionnairedevelopment%2Ffinalisingthe2011questionnaire%2Fkashmiri-research-project-2011-final-report_tcm77-183996.pdf";
const onsEthnicGroupTitle =
  "Final Recommended Questions for the 2011 Census in England and Wales: Ethnic Group";
const onsEthnicGroupUrl =
  "https://www.ons.gov.uk/file?uri=%2Fcensus%2F2011census%2Fhowourcensusworks%2Fhowweplannedthe2011census%2Fquestionnairedevelopment%2Ffinalisingthe2011questionnaire%2Ffinal-recommended-questions-2011-ethnic-group_tcm77-183998.pdf";
const acs2016Title =
  "Cognitive Testing of the 2016 American Community Survey Content Test Items: Briefing Report for Round 1 Interviews";
const acs2016Url =
  "https://www.census.gov/content/dam/Census/library/working-papers/2016/acs/2016_Westat_02.pdf";
const censusAgency = "U.S. Census Bureau";
const onsAgency = "Office for National Statistics";
const retrievalDate = "2026-05-01";
const verifiedAgainstSource = {
  date: retrievalDate,
  method: "manual_pdf_check"
} satisfies NonNullable<WorkbenchSpecimen["verifiedAgainstSource"]>;

function sourceReceipt(
  agency: string,
  documentCode: string,
  reportTitle: string,
  reportType: WorkbenchSpecimen["source"]["reportType"],
  year: string,
  sectionOrPage: string,
  directUrl: string
): WorkbenchSpecimen["source"] {
  return {
    agency,
    documentCode,
    reportTitle,
    reportType,
    year,
    sectionOrPage,
    directUrl,
    retrievalDate
  };
}

const methodNotesById: Partial<
  Record<string, NonNullable<WorkbenchSpecimen["methodNote"]>>
> = {
  "ride-hailing": {
    whyHere:
      "This specimen isolates label ambiguity because app-service, taxi, and shared-ride readings all remain plausible from the same category label.",
    whatOmitted:
      "It leaves out the broader commute taxonomy and any claim about downstream travel estimates."
  },
  "business-industry": {
    whyHere:
      "This specimen shows a broad bucket because establishment type, industry, product line, and work activity can all look responsive in one answer field.",
    whatOmitted:
      "It leaves out occupation coding questions and the full CPS instrument flow around the item."
  },
  "refrigerated-medicine": {
    whyHere:
      "This specimen anchors false premise because No can hide both a substantive no-spoilage answer and a no-medicine household.",
    whatOmitted:
      "It leaves out the broader outage module and does not estimate how common either route is."
  },
  "electric-vehicle-type": {
    whyHere:
      "This specimen shows category boundary blur because everyday electric-vehicle labels and technical classes do not line up cleanly.",
    whatOmitted:
      "It leaves out a validated EV taxonomy rewrite and any claim about which vehicle taxonomy should replace the tested wording."
  },
  "owner-advertising": {
    whyHere:
      "This specimen demonstrates sequence overlap because the earlier internet-listing item changes how later 'other advertising' is interpreted.",
    whatOmitted:
      "It leaves out the full housing-sale routing path and does not model which advertising channel actually caused a sale."
  },
  "usual-hours": {
    whyHere:
      "This specimen anchors forced precision because variable weeks are compressed into one usual-hours number.",
    whatOmitted:
      "It leaves out validation of alternate time windows and does not claim that any one window is the correct replacement."
  },
  "notebook-computer": {
    whyHere:
      "This specimen pinpoints label ambiguity because notebook routes some respondents to non-laptop product families before any answer is given.",
    whatOmitted:
      "It leaves out the broader IUS device taxonomy and any claim about generation-level device adoption rates."
  },
  "ons-kashmiri": {
    whyHere:
      "This specimen shows a broad bucket because a specific subgroup identity sits under a broader Asian/Asian British category and a write-in path.",
    whatOmitted:
      "It leaves out the comparability and parallel-subgroup tradeoffs the ONS report weighed when recommending against the tick-box, which the colophon and Reveal cards summarize separately."
  },
  "sump-pump": {
    whyHere:
      "This specimen anchors false premise because No can absorb no equipment, no failure event, and no flooding inside one yes/no item.",
    whatOmitted:
      "It leaves out the broader OUTFLOOD module and does not estimate how common no-pump households are."
  },
  "ons-ethnic-group-heading": {
    whyHere:
      "This specimen shows category boundary blur because a section heading mixes colour and geographic cues, so several headings can look partly right.",
    whatOmitted:
      "It leaves out the full 2011 ethnic-group recommendation set and any claim about which heading order should generalize beyond England and Wales."
  },
  "avoid-natural-disasters": {
    whyHere:
      "This specimen anchors sequence overlap because a yes/no reasons series can make Yes feel primary even when the construct is any-influence.",
    whatOmitted:
      "It leaves out the rest of the AHS moving-reasons module and does not model how often secondary motives drive moves."
  },
  "acs-weeks-worked": {
    whyHere:
      "This specimen shows forced precision because variable work histories are compressed into one exact-looking week count.",
    whatOmitted:
      "It leaves out validation of any specific replacement window and does not claim the ACS partial-week cue solved the problem."
  }
};

const authoredWorkbenchSpecimens: Array<
  Omit<WorkbenchSpecimen, "methodNote" | "verifiedAgainstSource">
> = [
  {
    id: "ride-hailing",
    number: "01",
    railLabel: "Ride-hailing",
    pattern: "label_ambiguity",
    patternLabel: "Label ambiguity",
    canonicalSubtitle: canonicalSubtitleByPattern.label_ambiguity,
    canonicalCitations: canonicalCitationByPattern.label_ambiguity,
    title: "When one commute option can mean taxi, app ride, or shared ride",
    subtitle:
      "The respondent knows how they got to work. The answer option asks which paid-service category that trip belongs to.",
    testedWording: "Taxi or ride-hailing services",
    answerFrame: {
      eyebrow: "ACS means-of-transportation item",
      prompt: "Using this list, LAST WEEK, how did you USUALLY get to work?",
      context: [
        "The respondent chooses one main commute mode from a transportation list.",
        "The workbench isolates the response option that was probed for ride-hailing comprehension."
      ],
      targetKind: "response_option",
      targetLabel: "Highlighted response option",
      targetText: "Taxi or ride-hailing services",
      responseOptions: [
        { id: "car", text: "Car, truck, or van" },
        { id: "bus", text: "Bus" },
        { id: "subway", text: "Subway or elevated rail" },
        { id: "train", text: "Long-distance train or commuter rail" },
        { id: "light-rail", text: "Light rail, streetcar, or trolley" },
        { id: "ferry", text: "Ferryboat" },
        { id: "taxi-ride-hailing", text: "Taxi or ride-hailing services", isTarget: true },
        { id: "motorcycle", text: "Motorcycle" },
        { id: "bicycle", text: "Bicycle" },
        { id: "walked", text: "Walked" },
        { id: "home", text: "Worked from this address" },
        { id: "other", text: "Other Method" }
      ],
      taskPrompt:
        "For each scenario, decide whether this highlighted commute option names the intended paid ride service, could be read multiple ways, or should not include the trip.",
      methodNote:
        "The source also discusses working-from-home placement. This specimen narrows the task to the ride-hailing label."
    },
    intendedConstruct:
      "Main commute mode, specifically whether the trip was a paid taxi or app-based ride service.",
    sampleRespondent:
      "A respondent who used Lyft to get to work can report the trip, but still has to decide whether Taxi or ride-hailing services includes Lyft, only taxi cabs, or any shared ride.",
    prerequisiteVocab: prerequisiteVocabByPattern.label_ambiguity,
    predictionCopy: predictionCopy(
      [
        "Matches intended paid service",
        "The highlighted option clearly covers a paid taxi or app-based ride service."
      ],
      [
        "Label meaning can shift",
        "The same trip could be routed differently because Taxi or ride-hailing services is being read in different ways."
      ],
      [
        "Not this paid-service option",
        "The trip should use another commute path, not the highlighted taxi/app-ride option."
      ]
    ),
    vignettes: [
      {
        id: "ride-uber-lyft",
        text: "A respondent usually got to work using Uber or Lyft and understands ride-hailing to mean an app-based paid ride service.",
        provenance: "direct_quote",
        citation: {
          reportTitle: acsRound3Title,
          page: "pp. 36-37",
          permalink: acsRound3Url
        },
        expectedOutcome: "covered",
        outcomeRationale:
          "The respondent's commute is the intended app-based paid service, and their reading of Taxi or ride-hailing services points to that option.",
        probeRationale: {
          covered:
            "Your examples name app-based services, so this respondent has a clear route into the highlighted option.",
          notCovered:
            "Without an app-based example, this respondent may still have to infer that Uber or Lyft belongs here."
        }
      },
      {
        id: "ride-taxi-only",
        text: "A respondent usually got to work by Lyft but reads Taxi or ride-hailing services as taxi cabs only.",
        provenance: "direct_quote",
        citation: {
          reportTitle: acsRound3Title,
          page: "pp. 36-37",
          permalink: acsRound3Url
        },
        expectedOutcome: "ambiguous",
        outcomeRationale:
          "The real commute belongs in the intended app-ride category, but a taxi-only reading can push the same Lyft trip away from the highlighted option.",
        probeRationale: {
          covered:
            "Pairing taxi with Uber/Lyft or app-based service makes the intended category visible beside the older taxi label.",
          notCovered:
            "The edit still leaves the respondent to decide whether a Lyft trip is outside a taxi-only reading."
        }
      },
      {
        id: "ride-shared-ride",
        text: "A respondent reads ride-hailing as a pooled or shared-ride cue, not specifically as an on-demand paid app ride.",
        provenance: "direct_quote",
        citation: {
          reportTitle: acsRound3Title,
          page: "pp. 36-37",
          permalink: acsRound3Url
        },
        expectedOutcome: "ambiguous",
        outcomeRationale:
          "The phrase can point toward sharing the vehicle rather than arranging a paid app ride, so the highlighted option is not stable.",
        probeRationale: {
          covered:
            "Naming app-based or Uber/Lyft service reduces the chance that shared ride becomes the organizing rule.",
          notCovered:
            "The edit still lets shared ride compete with the intended app-service meaning."
        }
      },
      {
        id: "ride-lyft-work",
        text: "A participant said that when he was working, he would sometimes take Lyft to work several times a week.",
        provenance: "direct_quote",
        citation: {
          reportTitle: acsRound3Title,
          page: "pp. 36-37",
          permalink: acsRound3Url
        },
        expectedOutcome: "covered",
        outcomeRationale:
          "Lyft is the intended app-based ride case, so the highlighted option works when the respondent recognizes Lyft as ride-hailing.",
        probeRationale: {
          covered:
            "Your examples explicitly include Lyft or app-based service, so the route is recoverable.",
          notCovered:
            "The edit does not yet make Lyft visible enough as part of the highlighted answer path."
        }
      },
      {
        id: "ride-carpool",
        text: "A respondent rode with a neighbor in an informal carpool and treats shared ride as a cue to include that commute.",
        provenance: "editorial",
        attributionNote:
          "Based on the ACS Round 3 finding that one participant mapped ride-hailing to a shared-ride idea.",
        expectedOutcome: "not_covered",
        outcomeRationale:
          "A neighbor carpool is not a paid taxi or app-ride service, so it should not be absorbed into the highlighted option.",
        probeRationale: {
          covered:
            "The edit correctly keeps neighbor carpool outside the ride-hailing option.",
          notCovered:
            "Leaving carpool out keeps the highlighted option from absorbing neighbor rides."
        }
      }
    ],
    mechanismQuestion: {
      prompt:
        "Why can Taxi or ride-hailing services send similar commuters to different answers?",
      choices: [
        {
          id: "label-range",
          text: "Ride-hailing can mean app rides, taxi-like paid service, or shared rides.",
          isCorrect: true,
          explanation:
            "The trouble sits in the answer option. Respondents were not just choosing a known trip; they were deciding what Taxi or ride-hailing services includes."
        },
        {
          id: "technical-boundary",
          text: "The option asks people to sort technical vehicle types.",
          isCorrect: false,
          explanation:
            "Vehicle technology is not the contested boundary here. The issue is whether the words include Lyft, taxi cabs, pooled rides, or informal shared rides."
        },
        {
          id: "missing-filter",
          text: "The question assumes every respondent used a taxi or app ride.",
          isCorrect: false,
          explanation:
            "The wording does not require taxi or app-ride use. It becomes unstable when people who did use a relevant service map the words differently."
        }
      ]
    },
    routeStages: [
      {
        id: "ride-reality",
        kind: "respondent_reality",
        eyebrow: "Respondent reality",
        title: "Used an app-based ride",
        detail:
          "The respondent can remember the commute: a Lyft/Uber-style paid ride arranged through an app."
      },
      {
        id: "ride-wording",
        kind: "tested_wording",
        eyebrow: "Tested label",
        title: "Taxi or ride-hailing services",
        detail:
          "The visible answer option pairs taxi cabs with the newer ride-hailing term, but gives no examples in the option itself."
      },
      {
        id: "ride-break",
        kind: "route_break",
        eyebrow: "Route break",
        title: "App ride, taxi cab, or shared ride?",
        detail:
          "The respondent has to infer whether ride-hailing means an app-based paid service, a taxi-like service, or any ride shared with someone else."
      },
      {
        id: "ride-consequence",
        kind: "data_consequence",
        eyebrow: "Data consequence",
        title: "Commute categories can mix mental models",
        detail:
          "Two people with similar app-ride commutes can choose different answers if they assign different meanings to the highlighted option."
      }
    ],
    neighborContrast: {
      pattern: "category_boundary_blur",
      neighborSpecimenId: "electric-vehicle-type",
      contrastText:
        "This specimen is label ambiguity because the contested step is what Taxi or ride-hailing services means. The neighbor pattern is category boundary blur, where the words may be understood but the line between neighboring classes is unclear."
    },
    widget: {
      kind: "example_set_editor",
      initialExampleIds: ["taxi"],
      candidates: [
        { id: "taxi", label: "taxi" },
        { id: "uber-lyft", label: "Uber or Lyft" },
        { id: "app-based", label: "app-based ride service" },
        { id: "shared-only", label: "shared ride" },
        { id: "carpool", label: "carpool" }
      ],
      diagnostic: {
        "ride-uber-lyft": {
          coveredBy: [
            ["uber-lyft"],
            ["app-based"],
            ["uber-lyft", "app-based"],
            ["taxi", "uber-lyft"],
            ["taxi", "app-based"],
            ["taxi", "uber-lyft", "app-based"]
          ]
        },
        "ride-taxi-only": {
          coveredBy: [
            ["taxi", "uber-lyft"],
            ["taxi", "app-based"],
            ["taxi", "uber-lyft", "app-based"]
          ]
        },
        "ride-shared-ride": {
          coveredBy: [
            ["taxi", "uber-lyft"],
            ["taxi", "app-based"],
            ["taxi", "uber-lyft", "app-based"]
          ]
        },
        "ride-lyft-work": {
          coveredBy: [
            ["uber-lyft"],
            ["app-based"],
            ["uber-lyft", "app-based"],
            ["taxi", "uber-lyft"],
            ["taxi", "app-based"],
            ["taxi", "uber-lyft", "app-based"]
          ]
        },
        "ride-carpool": { coveredBy: [] }
      }
    },
    probePrompt:
      "Explore whether examples make Uber/Lyft and app-based paid rides visible without inviting informal carpools.",
    reveal: {
      addresses: {
        revisionDescription:
          "The report recommended naming Uber/Lyft, using app-based ride services, or placing brand-name examples in help text.",
        sourcePageRef: "ACS Round 3 sections 2.3.2-2.3.3, pp. 35-38"
      },
      remainsUntested: {
        residualRisks: [
          "Brand examples can date quickly or miss services that are common in some local markets."
        ],
        claimBoundaryNote
      }
    },
    microCases: [
      {
        id: "ride-near-delivery",
        kind: "near_transfer",
        context:
          "A transportation-adjacent service survey asks how a package or meal reached the respondent. One case used DoorDash; another used a local courier company.",
        questionPrompt:
          "Which wording feature would most likely route those cases differently?",
        wording: "Food delivery or courier app service",
        pattern: "label_ambiguity",
        featureChoices: [
          "App service can mean a platform app, a courier business, or any person delivering food",
          "A missing eligibility screener",
          "A forced numeric average"
        ],
        correctFeatureIndex: 0,
        explanation:
          "This is the same pattern as Specimen 1: the respondent may know what happened, but the service label can point to platform apps, courier companies, or informal delivery."
      },
      {
        id: "ride-distractor-vehicle",
        kind: "distractor",
        context:
          "A vehicle item asks households to classify a small electric vehicle. Respondents understand the device but may not know whether it belongs with bicycles, scooters, or a broader micromobility class.",
        questionPrompt:
          "Which wording feature is doing the work in this distractor?",
        wording: "An electric bicycle, a motorized scooter, or another micromobility vehicle",
        pattern: "category_boundary_blur",
        featureChoices: [
          "A broad bucket that asks for too many services",
          "A boundary between neighboring vehicle classes",
          "A prior question that changes the next answer"
        ],
        correctFeatureIndex: 1,
        explanation:
          "This is the nearest-neighbor pattern: the respondent may understand each vehicle word, but the boundary between small vehicle classes is hard to draw."
      }
    ],
    source: sourceReceipt(
      censusAgency,
      "ACS Round 3",
      acsRound3Title,
      "cognitive_testing",
      "2022",
      "sections 2.3.2-2.3.3, pp. 35-38",
      acsRound3Url
    )
  },
  {
    id: "business-industry",
    number: "02",
    railLabel: "Business",
    pattern: "broad_bucket",
    patternLabel: "Broad bucket",
    canonicalSubtitle: canonicalSubtitleByPattern.broad_bucket,
    canonicalCitations: canonicalCitationByPattern.broad_bucket,
    title: "When one field holds business and industry",
    subtitle: "The respondent may know both answers, but the prompt makes them choose the level.",
    testedWording: "What kind of business or industry is this?",
    answerFrame: {
      eyebrow: "CPS employment-details field",
      prompt: "What kind of business or industry is this?",
      context: [
        "The item is a text-entry field for a job held during the CPS reference period.",
        "The instruction asks for the main activity, product, or service provided where employed."
      ],
      targetKind: "text_field",
      targetLabel: "Highlighted answer path",
      targetText: "Text field for kind of business or industry",
      responseOptions: [
        {
          id: "industry-field",
          text: "Text entry: main activity, product, or service provided where employed",
          isTarget: true
        }
      ],
      taskPrompt:
        "Judge whether the text field tells this respondent the right level of answer to give.",
      methodNote:
        "The source's Round 2 examples clarified answer level; this workbench focuses on the field's broad response task."
    },
    intendedConstruct: "Employer industry or line of business for a job.",
    sampleRespondent:
      "A respondent who works in a hospital can separate the establishment from the broader health care industry, but the single field asks for both at once.",
    prerequisiteVocab: prerequisiteVocabByPattern.broad_bucket,
    predictionCopy: predictionCopy(
      [
        "Right answer level visible",
        "The field gives this respondent a clear kind-of-business or industry answer."
      ],
      [
        "Answer level floats",
        "The field lets more than one level of workplace description look responsive."
      ],
      [
        "Wrong level for this field",
        "The answer belongs in a different field, such as occupation or employer name."
      ]
    ),
    vignettes: [
      {
        id: "industry-hospital-health-care",
        text: "One participant found the question unclear because the business was a hospital and the industry was health care.",
        provenance: "direct_quote",
        citation: {
          reportTitle: cpsSelfResponseTitle,
          page: "section 3.4.5, pp. 69-75",
          permalink: cpsSelfResponseUrl
        },
        expectedOutcome: "ambiguous",
        outcomeRationale:
          "Hospital and health care are both plausible responses, but they name different levels of the same workplace.",
        probeRationale: {
          covered:
            "Your split separates establishment type from broader industry, so the answer level is easier to see.",
          notCovered:
            "The field still accepts both hospital and health care as seemingly responsive answers."
        }
      },
      {
        id: "industry-food-delivery",
        text: "A participant gave food delivery for one job, then supplied a different line of work for a second job.",
        provenance: "direct_quote",
        citation: {
          reportTitle: cpsSelfResponseTitle,
          page: "section 3.4.5, pp. 69-75",
          permalink: cpsSelfResponseUrl
        },
        expectedOutcome: "ambiguous",
        outcomeRationale:
          "Food delivery can be read as service line, platform work, or business type, so the field does not fully control the response level.",
        probeRationale: {
          covered:
            "Your split makes service line a distinct answer level instead of leaving it mixed with business type.",
          notCovered:
            "The edit still lets food delivery float between service, business, and work activity."
        }
      },
      {
        id: "industry-grocery-store",
        text: "A respondent writes grocery store for a job in a supermarket.",
        provenance: "editorial",
        attributionNote:
          "Based on the CPS finding that added examples clarified the type and level of answer wanted.",
        expectedOutcome: "covered",
        outcomeRationale:
          "Grocery store is a kind of business at a usable level for the field.",
        probeRationale: {
          covered:
            "Your split leaves establishment or business type available as a clean answer level.",
          notCovered:
            "The field does not yet make grocery store visibly acceptable as the intended level."
        }
      },
      {
        id: "industry-job-title",
        text: "A respondent writes cashier because that is the work they did at the business.",
        provenance: "editorial",
        attributionNote:
          "Based on the CPS finding that respondents needed clearer examples of the expected answer type.",
        expectedOutcome: "not_covered",
        outcomeRationale:
          "Cashier is an occupation or task, not the kind of business or industry.",
        probeRationale: {
          covered:
            "The edit resolves this only by separating occupation from the business/industry field.",
          notCovered:
            "Keeping occupation separate prevents the business/industry field from absorbing job titles."
        }
      },
      {
        id: "industry-business-name",
        text: "A respondent writes the employer's name instead of the kind of business.",
        provenance: "editorial",
        attributionNote:
          "Based on the CPS recommendation to add examples that show the level of detail expected.",
        expectedOutcome: "not_covered",
        outcomeRationale:
          "An employer name may be familiar, but it is not the kind of business, activity, product, or service requested.",
        probeRationale: {
          covered:
            "The edit resolves this only if employer name is separated from kind of business.",
          notCovered:
            "The edit keeps names outside the field and asks for a class of business instead."
        }
      }
    ],
    mechanismQuestion: {
      prompt:
        "Why can What kind of business or industry is this? produce answers at different levels?",
      choices: [
        {
          id: "two-levels",
          text: "The prompt put business type and industry level into one answer space.",
          isCorrect: true,
          explanation:
            "The single field can accept establishment type, broad industry, product line, or work activity without saying which level is intended."
        },
        {
          id: "too-precise",
          text: "The prompt forced a precise number from variable weeks.",
          isCorrect: false,
          explanation:
            "No numeric estimate is being compressed here. The issue is the scope of an open response bucket."
        },
        {
          id: "sequence-leak",
          text: "A previous question changed the meaning of this one.",
          isCorrect: false,
          explanation:
            "The evidence in DR-A points to uncertainty inside this field, not leakage from the preceding item."
        }
      ]
    },
    routeStages: [
      {
        id: "industry-reality",
        kind: "respondent_reality",
        eyebrow: "Respondent reality",
        title: "Business and industry split apart",
        detail:
          "The respondent may know the workplace name, the establishment type, the broad sector, and the service line."
      },
      {
        id: "industry-wording",
        kind: "tested_wording",
        eyebrow: "Tested wording",
        title: "What kind of business or industry is this?",
        detail:
          "The field asks for business or industry, but those words can cue different levels of the same job."
      },
      {
        id: "industry-break",
        kind: "route_break",
        eyebrow: "Route break",
        title: "Which level belongs in the box?",
        detail:
          "The respondent has to decide whether hospital, health care, food delivery, cashier, or the employer name is the expected shape."
      },
      {
        id: "industry-consequence",
        kind: "data_consequence",
        eyebrow: "Data consequence",
        title: "Unlike answers can look complete",
        detail:
          "The data can contain complete-looking text while mixing levels that coders or analysts need to interpret consistently."
      }
    ],
    neighborContrast: {
      pattern: "forced_precision",
      neighborSpecimenId: "usual-hours",
      contrastText:
        "This specimen is broad bucket because one text field spans several answer levels. The forced-precision neighbor asks respondents to compress variable experience into one exact-looking number."
    },
    widget: {
      kind: "bucket_splitter",
      items: [
        { id: "establishment", label: "establishment or business type" },
        { id: "industry", label: "industry or sector" },
        { id: "service", label: "product or service line" },
        { id: "occupation", label: "job title or task" }
      ],
      initialSplitIndex: null,
      candidateSplits: [1, 2, 3],
      diagnostic: {
        "industry-hospital-health-care": { cleanAt: [1] },
        "industry-food-delivery": { cleanAt: [2] },
        "industry-grocery-store": { cleanAt: [1, 2] },
        "industry-job-title": { cleanAt: [3] },
        "industry-business-name": { cleanAt: [] }
      }
    },
    probePrompt: "Explore where the answer bucket needs a boundary.",
    reveal: {
      addresses: {
        revisionDescription:
          "The report recommended adding examples to clarify the type and level of detail expected.",
        sourcePageRef: "CPS internet self-response section 3.4.5, pp. 69-75"
      },
      remainsUntested: {
        residualRisks: [
          "Examples may clarify common jobs while leaving platform, multi-client, or mixed-establishment work hard to classify."
        ],
        claimBoundaryNote
      }
    },
    microCases: [
      {
        id: "industry-near-business",
        kind: "near_transfer",
        context:
          "An employment form asks about a gig job. The respondent could answer app company, delivery service, restaurant delivery, or self-employed courier.",
        questionPrompt:
          "Which wording feature would make those answers hard to compare?",
        wording: "What kind of company, agency, or line of work was this?",
        pattern: "broad_bucket",
        featureChoices: [
          "One field spans institution type and line of work",
          "A yes/no item hides not-applicable",
          "A vague label names a single familiar object"
        ],
        correctFeatureIndex: 0,
        explanation:
          "This is the same pattern because several levels can fit in one field. It is not forced precision because the respondent is not compressing variable quantities into a number."
      },
      {
        id: "industry-distractor-hours",
        kind: "distractor",
        context:
          "A worker's hours change from week to week. The form still asks for one usual weekly number.",
        questionPrompt:
          "Which wording feature is doing the work in this distractor?",
        wording: "How many hours do you usually work in a week with changing shifts?",
        pattern: "forced_precision",
        featureChoices: [
          "A single number required from variable weeks",
          "A field that mixes business and industry levels",
          "A category repeated after an internet item"
        ],
        correctFeatureIndex: 0,
        explanation:
          "This can look like a broad bucket because much experience is compressed, but the distinguishing feature is the forced single number."
      }
    ],
    source: sourceReceipt(
      censusAgency,
      "RSM2025-03",
      cpsSelfResponseTitle,
      "cognitive_testing",
      "2025",
      "section 3.4.5, pp. 69-75",
      cpsSelfResponseUrl
    )
  },
  {
    id: "refrigerated-medicine",
    number: "03",
    railLabel: "Medicine",
    pattern: "false_premise",
    patternLabel: "False premise",
    canonicalSubtitle: canonicalSubtitleByPattern.false_premise,
    canonicalCitations: canonicalCitationByPattern.false_premise,
    title: "When No hides no medicine",
    subtitle: "A yes/no item can assume the household has the thing it asks about.",
    testedWording: "Did any refrigerated medicine spoil?",
    answerFrame: {
      eyebrow: "AHS outage-effects item",
      prompt: "During the outage period, did any refrigerated medicine spoil?",
      context: [
        "The item is asked in a power-outage module.",
        "The response path must distinguish medicine that did not spoil from households without refrigerated medicine."
      ],
      targetKind: "yes_no_path",
      targetLabel: "Highlighted response path",
      targetText: "Yes / No / No refrigerated medicine response set",
      responseOptions: [
        { id: "yes", text: "Yes", isTarget: true },
        { id: "no", text: "No", isTarget: true },
        { id: "no-medicine", text: "No refrigerated medicine", isTarget: true }
      ],
      taskPrompt:
        "Judge whether this response path cleanly separates spoilage, no spoilage, and no refrigerated medicine.",
      methodNote:
        "The source recommended keeping the no-medicine option and adding a follow-up after No because some respondents did not volunteer the inapplicable state."
    },
    intendedConstruct: "Spoilage of refrigerated medicine during a power outage.",
    sampleRespondent:
      "A respondent who does not keep refrigerated medicine can answer No even though a No refrigerated medicine option is present. The survey still has to distinguish a substantive No from a missed applicability cue.",
    prerequisiteVocab: prerequisiteVocabByPattern.false_premise,
    predictionCopy: predictionCopy(
      [
        "Applicability is separated",
        "The response path clearly separates spoilage, no spoilage, or no refrigerated medicine."
      ],
      [
        "No can hide no medicine",
        "A No answer could mean no spoilage or that the household had no refrigerated medicine."
      ],
      [
        "Outside outage construct",
        "The scenario should not be counted as refrigerated medicine spoilage caused by the outage."
      ]
    ),
    vignettes: [
      {
        id: "medicine-no-medicine-no",
        text: "Upon probing, two respondents said they answered No because they did not have refrigerated medicine.",
        provenance: "direct_quote",
        citation: {
          reportTitle: ahs2023Title,
          page: "section 4.5.4, pp. 58-59",
          permalink: ahs2023Url
        },
        expectedOutcome: "ambiguous",
        outcomeRationale:
          "No is a true answer form, but here it mixes no spoilage with no refrigerated medicine.",
        probeRationale: {
          covered:
            "A screener or follow-up separates no refrigerated medicine from a substantive No.",
          notCovered:
            "The current path still lets a household without refrigerated medicine disappear inside No."
        }
      },
      {
        id: "medicine-volunteers-no-med",
        text: "A respondent notices the No refrigerated medicine option and uses it directly.",
        provenance: "editorial",
        attributionNote:
          "Based on the AHS 2023 OUTMED recommendation to keep the No refrigerated medicine option for respondents who volunteer that information.",
        expectedOutcome: "covered",
        outcomeRationale:
          "This respondent uses the explicit inapplicable option, so No does not have to carry that meaning.",
        probeRationale: {
          covered:
            "A visible not-applicable route keeps this respondent out of the No path.",
          notCovered:
            "Without a visible not-applicable route, this respondent may still need to improvise."
        }
      },
      {
        id: "medicine-spoiled",
        text: "A respondent had refrigerated medicine and it spoiled during the outage.",
        provenance: "editorial",
        attributionNote:
          "Based on the AHS 2023 OUTMED construct: spoilage of refrigerated medicine during an outage.",
        expectedOutcome: "covered",
        outcomeRationale:
          "The household is in scope and the event occurred; the clean route is Yes, not the highlighted No.",
        probeRationale: {
          covered:
            "The edit preserves a clear Yes route for in-scope spoilage.",
          notCovered:
            "This case should stay outside No because the medicine did spoil."
        }
      },
      {
        id: "medicine-did-not-spoil",
        text: "A respondent had refrigerated medicine, kept it cold, and no medicine spoiled.",
        provenance: "editorial",
        attributionNote:
          "Based on the AHS 2023 OUTMED distinction between substantive No and no refrigerated medicine.",
        expectedOutcome: "covered",
        outcomeRationale:
          "This is the substantive No the item is trying to measure: medicine existed, but did not spoil.",
        probeRationale: {
          covered:
            "The edit leaves a clean No route for in-scope households with no spoilage.",
          notCovered:
            "The No path remains hard to interpret if it is not separated from no-medicine households."
        }
      },
      {
        id: "medicine-not-outage",
        text: "A respondent had refrigerated medicine spoil after a refrigerator problem unrelated to a power outage.",
        provenance: "editorial",
        attributionNote:
          "Based on the AHS 2023 OUTMED recommendation to add the timeframe and as-a-result-of-a-power-outage wording.",
        expectedOutcome: "not_covered",
        outcomeRationale:
          "The spoilage is outside the power-outage construct, so it should not be counted by this item.",
        probeRationale: {
          covered:
            "The edit resolves this by keeping non-outage spoilage outside the outage item.",
          notCovered:
            "The edit keeps refrigerator problems unrelated to the outage outside the target path."
        }
      }
    ],
    mechanismQuestion: {
      prompt:
        "Why can Did any refrigerated medicine spoil? make No hard to interpret?",
      choices: [
        {
          id: "missing-applicability",
          text: "The No answer competed with a weak inapplicable path.",
          isCorrect: true,
          explanation:
            "No refrigerated medicine was available, but two respondents still answered No; the report recommended a follow-up after No."
        },
        {
          id: "prior-item",
          text: "A prior outage question changed the meaning of medicine.",
          isCorrect: false,
          explanation:
            "The problem is not leakage from a previous answer. It is the missing applicability state inside this item."
        },
        {
          id: "category-boundary",
          text: "The item blurred medicine with other technical product classes.",
          isCorrect: false,
          explanation:
            "The report finding is not about classifying medicine types. It is about No absorbing households with no refrigerated medicine."
        }
      ]
    },
    routeStages: [
      {
        id: "medicine-reality",
        kind: "respondent_reality",
        eyebrow: "Respondent reality",
        title: "No refrigerated medicine",
        detail:
          "The respondent may have no refrigerated medicine at all, which is different from having medicine that stayed usable."
      },
      {
        id: "medicine-wording",
        kind: "tested_wording",
        eyebrow: "Tested wording",
        title: "Did any refrigerated medicine spoil?",
        detail:
          "The response set includes No refrigerated medicine, but the yes/no wording still makes No feel available."
      },
      {
        id: "medicine-break",
        kind: "route_break",
        eyebrow: "Route break",
        title: "No response or missed inapplicable option?",
        detail:
          "The respondent may choose No as the closest answer instead of noticing or using the inapplicable route."
      },
      {
        id: "medicine-consequence",
        kind: "data_consequence",
        eyebrow: "Data consequence",
        title: "No loses its denominator",
        detail:
          "Without a follow-up, analysts cannot tell whether No means in-scope no spoilage or out-of-scope no refrigerated medicine."
      }
    ],
    neighborContrast: {
      pattern: "sequence_overlap",
      neighborSpecimenId: "owner-advertising",
      contrastText:
        "This specimen is false premise because No can hide an inapplicable household. The sequence-overlap neighbor is different: a previous answer changes how the next response option is read."
    },
    widget: {
      kind: "filter_path_toggle",
      initialState: { hasScreener: false, hasNotApplicable: true },
      diagnostic: {
        "medicine-no-medicine-no": {
          cleanStates: [
            { hasScreener: true, hasNotApplicable: false },
            { hasScreener: true, hasNotApplicable: true }
          ]
        },
        "medicine-volunteers-no-med": {
          cleanStates: [
            { hasScreener: false, hasNotApplicable: true },
            { hasScreener: true, hasNotApplicable: true }
          ]
        },
        "medicine-spoiled": {
          cleanStates: [
            { hasScreener: false, hasNotApplicable: false },
            { hasScreener: true, hasNotApplicable: false },
            { hasScreener: false, hasNotApplicable: true },
            { hasScreener: true, hasNotApplicable: true }
          ]
        },
        "medicine-did-not-spoil": {
          cleanStates: [
            { hasScreener: false, hasNotApplicable: false },
            { hasScreener: true, hasNotApplicable: false },
            { hasScreener: false, hasNotApplicable: true },
            { hasScreener: true, hasNotApplicable: true }
          ]
        },
        "medicine-not-outage": {
          cleanStates: []
        }
      }
    },
    probePrompt: "Explore how a direct option and follow-up change No.",
    reveal: {
      addresses: {
        revisionDescription:
          "The report recommended adding outage and timeframe wording, keeping the No refrigerated medicine option, and adding a follow-up after No.",
        sourcePageRef: "AHS 2023 section 4.5.4 OUTMED, pp. 58-59"
      },
      remainsUntested: {
        residualRisks: [
          "A follow-up after No can increase burden for respondents whose refrigerated medicine clearly did not spoil."
        ],
        claimBoundaryNote
      }
    },
    microCases: [
      {
        id: "medicine-near-basement",
        kind: "near_transfer",
        context:
          "A storm-damage module asks about basement flooding. Some households have sump pumps; others do not have that equipment at all.",
        questionPrompt:
          "Which wording feature would make a plain No hard to interpret?",
        wording: "Did your sump pump fail during the outage?",
        pattern: "false_premise",
        featureChoices: [
          "A yes/no item lets No absorb households without the equipment",
          "Two adjacent categories share a boundary",
          "A prior question licenses multiple answers"
        ],
        correctFeatureIndex: 0,
        explanation:
          "This is the same pattern because households without a sump pump need an applicability path. It is not sequence overlap because no prior response is changing the category."
      },
      {
        id: "medicine-distractor-owner-ad",
        kind: "distractor",
        context:
          "A rental-search series first records that the respondent found the listing on an app, then asks about other advertising by the owner.",
        questionPrompt:
          "Which wording feature is doing the work in this distractor?",
        wording: "After saying you found the rental on an app, did you find it through other advertising by the owner?",
        pattern: "sequence_overlap",
        featureChoices: [
          "A missing not-applicable option",
          "A previous answer overlaps the next category",
          "A broad field spans several constructs"
        ],
        correctFeatureIndex: 1,
        explanation:
          "This may look like a missing path, but the distinguishing feature is the earlier app answer changing how the later owner-advertising item reads."
      }
    ],
    source: sourceReceipt(
      censusAgency,
      "RSM2022-11",
      ahs2023Title,
      "cognitive_testing",
      "2022",
      "section 4.5.4 OUTMED, pp. 58-59",
      ahs2023Url
    )
  },
  {
    id: "electric-vehicle-type",
    number: "04",
    railLabel: "EV type",
    pattern: "category_boundary_blur",
    patternLabel: "Category boundary blur",
    canonicalSubtitle: canonicalSubtitleByPattern.category_boundary_blur,
    canonicalCitations: canonicalCitationByPattern.category_boundary_blur,
    title: "When everyday categories blur technical ones",
    subtitle: "People may classify a vehicle by marketing language, fuel source, or charging behavior.",
    testedWording: "Another type of electric vehicle?",
    answerFrame: {
      eyebrow: "ACS electric-vehicle sequence",
      prompt: "Are any of the following types of electric vehicles kept at home for use by members of this household?",
      context: [
        "Version 1 asked first about a plug-in electric vehicle.",
        "The workbench isolates the second response item, which was meant to capture other electric vehicles such as hybrids."
      ],
      targetKind: "response_option",
      targetLabel: "Highlighted response item",
      targetText: "Another type of electric vehicle?",
      responseOptions: [
        { id: "plug-in", text: "A plug-in electric vehicle?" },
        { id: "another-ev", text: "Another type of electric vehicle?", isTarget: true }
      ],
      taskPrompt:
        "Judge whether the highlighted item gives each vehicle a clean home, or whether plug-in, hybrid, gasoline, and everyday electric labels compete.",
      methodNote:
        "The later version named plug-in electric vehicle and hybrid electric vehicle directly. This specimen evaluates the earlier broader label."
    },
    intendedConstruct: "Vehicle technology type.",
    sampleRespondent:
      "A respondent who owns or recognizes a hybrid vehicle may sort it by whether it plugs in, whether it uses gasoline, or whether it feels electric in everyday speech.",
    prerequisiteVocab: prerequisiteVocabByPattern.category_boundary_blur,
    predictionCopy: predictionCopy(
      [
        "Belongs in other-EV item",
        "The highlighted item clearly covers this vehicle under the intended hybrid/non-plug-in route."
      ],
      [
        "Vehicle boundary unclear",
        "Plug-in, hybrid, gasoline, and everyday electric cues point to more than one route."
      ],
      [
        "Belongs elsewhere in sequence",
        "The vehicle should be captured by another EV item, not the highlighted other-EV item."
      ]
    ),
    vignettes: [
      {
        id: "ev-plug-ins-hybrids",
        text: "A respondent reasoned that plug-ins are also hybrids.",
        provenance: "direct_quote",
        citation: {
          reportTitle: acsRound12Title,
          page: "pp. 272-273",
          permalink: acsRound12Url
        },
        expectedOutcome: "ambiguous",
        outcomeRationale:
          "The respondent links plug-ins and hybrids, so the boundary between the first item and the highlighted item is unstable.",
        probeRationale: {
          covered:
            "Classifying by plug-in status or gas-plus-battery makes the boundary rule explicit.",
          notCovered:
            "The edit still lets plug-in and hybrid meanings overlap without saying which feature controls."
        }
      },
      {
        id: "ev-does-not-plug",
        text: "A respondent did not think of a hybrid as electric because it does not plug in.",
        provenance: "direct_quote",
        citation: {
          reportTitle: acsRound12Title,
          page: "pp. 272-273",
          permalink: acsRound12Url
        },
        expectedOutcome: "ambiguous",
        outcomeRationale:
          "The vehicle is the kind the item hoped to capture, but the word electric can make a non-plug-in hybrid feel out of scope.",
        probeRationale: {
          covered:
            "A gas-plus-battery rule gives the hybrid a clean route even when it does not plug in.",
          notCovered:
            "The edit still lets no plug mean not electric, so the highlighted item remains unstable."
        }
      },
      {
        id: "ev-electric-means-plug",
        text: "A respondent said electric usually brings a plug-in vehicle to mind, not a hybrid.",
        provenance: "direct_quote",
        citation: {
          reportTitle: acsRound12Title,
          page: "pp. 272-273",
          permalink: acsRound12Url
        },
        expectedOutcome: "ambiguous",
        outcomeRationale:
          "The highlighted item depends on electric meaning more than plug-in, but the respondent reads electric as plug-in.",
        probeRationale: {
          covered:
            "A plug-in rule separates the first item from non-plug-in hybrid vehicles.",
          notCovered:
            "The edit still leaves electric as an everyday plug-in cue."
        }
      },
      {
        id: "ev-battery-only",
        text: "A respondent has a battery-only vehicle that charges from an outlet and uses no gasoline.",
        provenance: "editorial",
        attributionNote:
          "Based on the ACS electric-vehicle distinction between plug-in and hybrid vehicle types.",
        expectedOutcome: "not_covered",
        outcomeRationale:
          "A battery-only plug-in vehicle belongs in the first item, not the highlighted other-electric item.",
        probeRationale: {
          covered:
            "A plug-in rule routes this vehicle away from the highlighted other-electric item.",
          notCovered:
            "Keeping plug-in vehicles separate prevents the other-electric item from absorbing them."
        }
      },
      {
        id: "ev-plug-in-hybrid",
        text: "A respondent has a plug-in hybrid that charges from an outlet and also uses gasoline.",
        provenance: "editorial",
        attributionNote:
          "Based on the ACS finding that plug-in and hybrid boundaries were blurred by respondents.",
        expectedOutcome: "ambiguous",
        outcomeRationale:
          "A plug-in hybrid can satisfy both plug-in and hybrid rules unless the question names the controlling category.",
        probeRationale: {
          covered:
            "Your selected feature gives the plug-in hybrid a declared rule for classification.",
          notCovered:
            "The edit still does not say whether plug-in status or hybrid status controls."
        }
      },
      {
        id: "ev-non-plug-hybrid",
        text: "A respondent has a non-plug-in hybrid and understands it as another electric vehicle because it uses a battery with gasoline.",
        provenance: "editorial",
        attributionNote:
          "Based on the ACS finding that most participants reporting another electric vehicle referred to a hybrid.",
        expectedOutcome: "covered",
        outcomeRationale:
          "This is the intended clean route for the highlighted item: a hybrid electric vehicle that is not the plug-in item.",
        probeRationale: {
          covered:
            "A gas-plus-battery rule gives this non-plug-in hybrid a clean home.",
          notCovered:
            "The edit still does not make the intended hybrid route clear enough."
        }
      }
    ],
    mechanismQuestion: {
      prompt:
        "Why can Another type of electric vehicle? be hard to answer for hybrids and plug-ins?",
      choices: [
        {
          id: "class-boundary",
          text: "The response classes used overlapping vehicle features.",
          isCorrect: true,
          explanation:
            "Plugging in, using gasoline, and being called electric all point to different classification rules."
        },
        {
          id: "bare-label",
          text: "The item assumed respondents owned a vehicle they could classify.",
          isCorrect: false,
          explanation:
            "The item is reached only after an upstream vehicle-ownership question. The cited issue is sorting an owned vehicle among overlapping technical classes."
        },
        {
          id: "open-bucket",
          text: "The item put several unrelated constructs into one text field.",
          isCorrect: false,
          explanation:
            "This is not an open text bucket. Respondents are sorting a vehicle among neighboring technical classes."
        }
      ]
    },
    routeStages: [
      {
        id: "ev-reality",
        kind: "respondent_reality",
        eyebrow: "Respondent reality",
        title: "Battery, gas, plug, or label?",
        detail:
          "The respondent may know the vehicle but organize it by fuel source, outlet charging, battery use, or marketing label."
      },
      {
        id: "ev-wording",
        kind: "tested_wording",
        eyebrow: "Tested wording",
        title: "Another type of electric vehicle",
        detail:
          "The item follows plug-in electric vehicle, then asks for another electric vehicle without naming hybrid directly."
      },
      {
        id: "ev-break",
        kind: "route_break",
        eyebrow: "Route break",
        title: "The boundary is not obvious",
        detail:
          "The respondent has to decide whether plug-in status, hybrid status, gasoline use, or the everyday electric label controls the answer."
      },
      {
        id: "ev-consequence",
        kind: "data_consequence",
        eyebrow: "Data consequence",
        title: "Vehicle type may be mapped inconsistently",
        detail:
          "The same vehicle can be reported differently when households apply different rules to neighboring vehicle categories."
      }
    ],
    neighborContrast: {
      pattern: "label_ambiguity",
      neighborSpecimenId: "ride-hailing",
      contrastText:
        "This specimen is category boundary blur because the respondent may understand the words but not where plug-in, hybrid, gasoline, and electric classes divide. The label-ambiguity neighbor turns on what one answer label means."
    },
    widget: {
      kind: "classifier_radio",
      features: [
        {
          id: "plugs-in",
          label: "Plugs in",
          description: "Classify by whether the vehicle can charge from an external outlet."
        },
        {
          id: "gas-and-battery",
          label: "Gas plus battery",
          description: "Classify by whether the vehicle combines gasoline power with electric drive."
        },
        {
          id: "everyday-electric",
          label: "Everyday electric label",
          description: "Classify by whether the respondent would casually call the vehicle electric."
        }
      ],
      initialFeatureId: "everyday-electric",
      diagnostic: {
        "ev-plug-ins-hybrids": { cleanFeatureIds: ["plugs-in", "gas-and-battery"] },
        "ev-does-not-plug": { cleanFeatureIds: ["gas-and-battery"] },
        "ev-electric-means-plug": { cleanFeatureIds: ["plugs-in"] },
        "ev-battery-only": { cleanFeatureIds: ["plugs-in", "everyday-electric"] },
        "ev-plug-in-hybrid": { cleanFeatureIds: ["plugs-in", "gas-and-battery"] },
        "ev-non-plug-hybrid": { cleanFeatureIds: ["gas-and-battery"] }
      }
    },
    probePrompt: "Explore which vehicle feature carries the classification.",
    reveal: {
      addresses: {
        revisionDescription:
          "The report documented a later version that named hybrid electric vehicle and plug-in electric vehicle directly instead of using another type of electric vehicle.",
        sourcePageRef: "ACS Round 1/Round 2 pp. 113-114 and 272-273"
      },
      remainsUntested: {
        residualRisks: [
          "Plug-in hybrids may still sit between two labels unless the item makes the gasoline-plus-plug combination explicit."
        ],
        claimBoundaryNote
      }
    },
    microCases: [
      {
        id: "ev-near-tv",
        kind: "near_transfer",
        context:
          "A device survey asks which TV-connected devices a household uses. A smart TV, streaming box, and game console can all play streaming video through a television.",
        questionPrompt:
          "Which wording feature would make these device routes overlap?",
        wording: "A smart TV, a streaming box, or another device that plays through a TV",
        pattern: "category_boundary_blur",
        featureChoices: [
          "Neighboring device classes share features",
          "A missing not-applicable response",
          "A single field requests a numeric average"
        ],
        correctFeatureIndex: 0,
        explanation:
          "This is the same pattern because smart TV and TV-connected device boundaries can blur. It is not label ambiguity alone because the classes overlap technically."
      },
      {
        id: "ev-distractor-notebook",
        kind: "distractor",
        context:
          "A household technology item asks about laptop or notebook computers. Some respondents use notebook to mean a paper notebook or a smaller device family.",
        questionPrompt:
          "Which wording feature is doing the work in this distractor?",
        wording: "A laptop or notebook computer",
        pattern: "label_ambiguity",
        featureChoices: [
          "One label points to several device meanings",
          "Two technical classes share a boundary",
          "A previous answer changes the next item"
        ],
        correctFeatureIndex: 0,
        explanation:
          "This may look like a boundary problem, but the distinguishing feature is the ambiguous notebook label itself."
      }
    ],
    source: sourceReceipt(
      censusAgency,
      "ACS Round 1/2",
      acsRound12Title,
      "cognitive_testing",
      "2022",
      "pp. 113-114 and 272-273",
      acsRound12Url
    ),
    counterexample: {
      eyebrow: "Iterated wording",
      beforeWording: "Another type of electric vehicle?",
      afterWording: "A hybrid electric vehicle? A plug-in electric vehicle?",
      evidenceOfImprovement:
        "The report judged the later version better because it named the hybrid category directly.",
      sourcePageRef: "ACS Round 1/Round 2 pp. 113-114 and 272-273"
    }
  },
  {
    id: "owner-advertising",
    number: "05",
    railLabel: "Owner ad",
    pattern: "sequence_overlap",
    patternLabel: "Sequence overlap",
    canonicalSubtitle: canonicalSubtitleByPattern.sequence_overlap,
    canonicalCitations: canonicalCitationByPattern.sequence_overlap,
    title: "When the previous answer leaks into the next category",
    subtitle: "A response option can fail because of the question sequence around it.",
    testedWording: "Through some other advertising by the owner?",
    answerFrame: {
      eyebrow: "AHS housing-search sequence",
      prompt: "Did you find your home through any of these routes?",
      context: [
        "The respondent has already answered an internet-site item.",
        "The next item asks whether some other owner advertising also helped."
      ],
      targetKind: "sequence_item",
      targetLabel: "Highlighted sequence item",
      targetText: "Through some other advertising by the owner?",
      responseOptions: [
        {
          id: "internet",
          text: "Did you find your home on an internet site such as craigslist, apartment.com, realtor.com, or Zillow?"
        },
        {
          id: "owner",
          text: "Through some other advertising by the owner?",
          isTarget: true
        }
      ],
      taskPrompt:
        "Judge whether the highlighted owner-advertising item captures a distinct route, or whether the prior internet-site answer changes its meaning.",
      methodNote:
        "The issue is not that respondents could not define owner advertising; it is that the same listing can look relevant to two adjacent items."
    },
    intendedConstruct: "Housing-search source or route.",
    sampleRespondent:
      "A respondent who already reported an internet listing can still see the same listing as owner advertising when the owner posted it.",
    prerequisiteVocab: prerequisiteVocabByPattern.sequence_overlap,
    predictionCopy: predictionCopy(
      [
        "Distinct owner route",
        "The highlighted owner-advertising item covers a route not already handled by the prior internet item."
      ],
      [
        "Prior answer overlaps",
        "The same listing can look like both the earlier internet route and the highlighted owner-advertising route."
      ],
      [
        "Not owner advertising",
        "The route should stay outside the highlighted owner-advertising item."
      ]
    ),
    vignettes: [
      {
        id: "owner-zillow-already",
        text: "A respondent objected that they had just said they found the home on Zillow.",
        provenance: "direct_quote",
        citation: {
          reportTitle: ahs2025Title,
          page: "section 4.8.7 RMOVHS, pp. 98-99",
          permalink: ahs2025Url
        },
        expectedOutcome: "ambiguous",
        outcomeRationale:
          "The respondent sees the highlighted item as a repeat of the prior internet-site answer rather than a distinct route.",
        probeRationale: {
          covered:
            "Putting an all-that-helped instruction first makes multiple Yes answers permissible before the sequence begins.",
          notCovered:
            "The sequence still asks the respondent to decide whether the same listing is being counted twice."
        }
      },
      {
        id: "owner-zillow-changed",
        text: "A participant changed No to Yes because the owner had posted the house on Zillow.",
        provenance: "direct_quote",
        citation: {
          reportTitle: ahs2025Title,
          page: "section 4.8.7 RMOVHS, pp. 98-99",
          permalink: ahs2025Url
        },
        expectedOutcome: "ambiguous",
        outcomeRationale:
          "One event is doing two jobs: it is an internet listing and owner advertising, so the highlighted item is not separable.",
        probeRationale: {
          covered:
            "An upfront all-that-helped rule tells the respondent whether overlapping routes should both be reported.",
          notCovered:
            "The edit still leaves the Zillow listing stranded between two adjacent items."
        }
      },
      {
        id: "owner-yard-sign",
        text: "A respondent found the home through a sign placed by the owner, not through an internet site.",
        provenance: "editorial",
        attributionNote:
          "Based on the RMOVHS owner-advertising category after the internet-site question.",
        expectedOutcome: "covered",
        outcomeRationale:
          "A physical sign placed by the owner is a distinct owner-advertising route.",
        probeRationale: {
          covered:
            "The highlighted item remains a clean fit for owner advertising outside the internet-site path.",
          notCovered:
            "The edit should preserve this distinct owner-advertising route."
        }
      },
      {
        id: "owner-agent-listing",
        text: "A respondent found the home through an internet listing not posted by the owner, with no owner advertising involved.",
        provenance: "editorial",
        attributionNote:
          "Based on the RMOVHS need to separate internet listings (HEARSHSNET) from owner advertising routes.",
        expectedOutcome: "not_covered",
        outcomeRationale:
          "The highlighted owner-advertising item is the wrong path when the owner was not involved.",
        probeRationale: {
          covered:
            "The edit resolves this by keeping internet listings not posted by the owner outside owner advertising.",
          notCovered:
            "Keeping owner involvement explicit keeps this internet-only route outside the highlighted item."
        }
      },
      {
        id: "owner-craigslist-owner",
        text: "A respondent found the home through a Craigslist post written by the owner and already counted the internet site.",
        provenance: "editorial",
        attributionNote:
          "Based on the RMOVHS finding that an internet listing can also feel like owner advertising.",
        expectedOutcome: "ambiguous",
        outcomeRationale:
          "The same Craigslist post is both internet-mediated and owner-authored, so the sequence creates overlap.",
        probeRationale: {
          covered:
            "The upfront multi-route instruction makes the overlap intentional rather than accidental.",
          notCovered:
            "The edit still does not tell the respondent whether to count the owner-authored internet post again."
        }
      }
    ],
    mechanismQuestion: {
      prompt:
        "Why can Through some other advertising by the owner? feel repetitive after an internet-site answer?",
      choices: [
        {
          id: "prior-overlap",
          text: "The prior internet-site item overlapped the next owner-advertising category.",
          isCorrect: true,
          explanation:
            "The same listing can be treated as both an internet site and owner advertising because of the sequence."
        },
        {
          id: "one-large-bucket",
          text: "One answer bucket combined unrelated housing-search routes.",
          isCorrect: false,
          explanation:
            "The issue appears across adjacent items, not inside one oversized response field."
        },
        {
          id: "missing-exposure",
          text: "The phrase 'other advertising by the owner' had several plausible everyday meanings.",
          isCorrect: false,
          explanation:
            "The phrase is interpretable. The cited issue is overlap with the prior internet-site category, not ambiguity inside this label."
        }
      ]
    },
    routeStages: [
      {
        id: "owner-reality",
        kind: "respondent_reality",
        eyebrow: "Respondent reality",
        title: "One listing, multiple labels",
        detail:
          "The respondent may have one concrete listing in mind, such as Zillow or Craigslist, that was also posted by the owner."
      },
      {
        id: "owner-wording",
        kind: "tested_wording",
        eyebrow: "Tested label",
        title: "Some other advertising by the owner",
        detail:
          "The highlighted item appears after the respondent has already answered about internet listing sites."
      },
      {
        id: "owner-break",
        kind: "route_break",
        eyebrow: "Route break",
        title: "Does this count again?",
        detail:
          "The respondent has to decide whether the owner-authored internet listing should be counted again or treated as already reported."
      },
      {
        id: "owner-consequence",
        kind: "data_consequence",
        eyebrow: "Data consequence",
        title: "Sequence can create overlap",
        detail:
          "Responses no longer cleanly separate search routes if some people double-report the same listing and others refuse to count it twice."
      }
    ],
    neighborContrast: {
      pattern: "broad_bucket",
      neighborSpecimenId: "business-industry",
      contrastText:
        "This specimen is sequence overlap because adjacent questions make one listing fit twice. The broad-bucket neighbor is different: one field is too wide even before question order matters."
    },
    widget: {
      kind: "sequence_reorderer",
      items: [
        { id: "internet-site", label: "internet listing site" },
        { id: "owner-ad", label: "other owner advertising" },
        { id: "all-that-apply", label: "answer Yes to all routes that helped" }
      ],
      initialOrder: ["internet-site", "owner-ad", "all-that-apply"],
      initialAllowMulti: false,
      diagnostic: {
        "owner-zillow-already": {
          cleanOrders: [
            ["all-that-apply", "internet-site", "owner-ad"],
            ["all-that-apply", "owner-ad", "internet-site"]
          ],
          requiresMulti: true
        },
        "owner-zillow-changed": {
          cleanOrders: [
            ["all-that-apply", "internet-site", "owner-ad"],
            ["all-that-apply", "owner-ad", "internet-site"]
          ],
          requiresMulti: true
        },
        "owner-yard-sign": {
          cleanOrders: [
            ["internet-site", "owner-ad", "all-that-apply"],
            ["owner-ad", "internet-site", "all-that-apply"],
            ["all-that-apply", "internet-site", "owner-ad"],
            ["all-that-apply", "owner-ad", "internet-site"]
          ],
          requiresMulti: false
        },
        "owner-agent-listing": {
          cleanOrders: [
            ["internet-site", "owner-ad", "all-that-apply"],
            ["owner-ad", "internet-site", "all-that-apply"],
            ["all-that-apply", "internet-site", "owner-ad"],
            ["all-that-apply", "owner-ad", "internet-site"]
          ],
          requiresMulti: false
        },
        "owner-craigslist-owner": {
          cleanOrders: [
            ["all-that-apply", "internet-site", "owner-ad"],
            ["all-that-apply", "owner-ad", "internet-site"]
          ],
          requiresMulti: true
        }
      }
    },
    probePrompt: "Explore how instruction placement changes the overlap.",
    reveal: {
      addresses: {
        revisionDescription:
          "CBSM recommended an introductory sentence explaining that respondents may answer Yes to every option that helped them find the home.",
        sourcePageRef: "AHS 2025 section 4.8.7 RMOVHS, pp. 98-99"
      },
      remainsUntested: {
        residualRisks: [
          "An all-that-apply instruction may reduce hesitation but can still permit intentional double reporting of one listing."
        ],
        claimBoundaryNote
      }
    },
    microCases: [
      {
        id: "owner-near-disaster",
        kind: "near_transfer",
        context:
          "A moving-reason module asks several yes/no reason items in a row. The respondent had a secondary reason but already answered other reason questions.",
        questionPrompt:
          "Which wording feature changes how the next Yes answer feels?",
        wording: "After several moving-reason questions, did you move to avoid natural disasters?",
        pattern: "sequence_overlap",
        featureChoices: [
          "A prior item stream changes whether Yes means any reason or main reason",
          "A category label has several everyday meanings",
          "A yes/no item assumes the condition exists"
        ],
        correctFeatureIndex: 0,
        explanation:
          "This is the same pattern because earlier items in the series shape the meaning of the next Yes. It is not broad bucket because the pressure comes from sequence."
      },
      {
        id: "owner-distractor-utilities",
        kind: "distractor",
        context:
          "A housing-cost form asks for one payment amount that can include electricity, gas, phone, and other utilities.",
        questionPrompt:
          "Which wording feature is doing the work in this distractor?",
        wording: "How much did you pay for electricity, gas, telephone, and other utilities?",
        pattern: "broad_bucket",
        featureChoices: [
          "One amount bucket spans several service types",
          "A prior answer overlaps the next option",
          "A technical boundary separates vehicle classes"
        ],
        correctFeatureIndex: 0,
        explanation:
          "This can look like overlap, but it happens inside one broad amount bucket rather than across a question sequence."
      }
    ],
    source: sourceReceipt(
      censusAgency,
      "RSM2024-11",
      ahs2025Title,
      "cognitive_testing",
      "2024",
      "section 4.8.7 RMOVHS, pp. 98-99",
      ahs2025Url
    )
  },
  {
    id: "usual-hours",
    number: "06",
    railLabel: "Usual hours",
    pattern: "forced_precision",
    patternLabel: "Forced precision",
    canonicalSubtitle: canonicalSubtitleByPattern.forced_precision,
    canonicalCitations: canonicalCitationByPattern.forced_precision,
    title: "When usual hours demand one number",
    subtitle: "The item creates aggregation strain: variable weeks have to become a single usual-hours answer.",
    testedWording: "How many hours per week do you USUALLY work at your <MAIN> job?",
    answerFrame: {
      eyebrow: "CPS usual-hours item",
      prompt: "How many hours per week do you USUALLY work at your main job?",
      context: [
        "The item is asked of respondents who worked during the CPS reference period.",
        "The response is one numeric value for usual weekly hours at the main job."
      ],
      targetKind: "numeric_field",
      targetLabel: "Highlighted answer path",
      targetText: "One usual-hours number",
      responseOptions: [
        { id: "hours", text: "Usual hours worked each week: [number]", isTarget: true }
      ],
      taskPrompt:
        "Judge whether one usual-hours number is recoverable, or whether the respondent must choose an unstated recipe such as average, most common week, or recent week.",
      methodNote:
        "Averaging is not automatically wrong. The fit problem is that different respondents may use different recipes while entering the same clean-looking field."
    },
    intendedConstruct: "Usual weekly hours at the respondent's main job.",
    sampleRespondent:
      "A respondent whose hours change from week to week can remember several real schedules, but the item asks those memories to collapse into one usual number.",
    prerequisiteVocab: prerequisiteVocabByPattern.forced_precision,
    predictionCopy: predictionCopy(
      [
        "One number recoverable",
        "The respondent can give one usual-hours number without choosing a hidden calculation rule."
      ],
      [
        "Recipe is unstated",
        "The respondent can enter a number, but average, most common week, and recent week remain competing recipes."
      ],
      [
        "No usual number",
        "The respondent's work pattern does not support the single usual-hours answer shape."
      ]
    ),
    vignettes: [
      {
        id: "hours-more-average",
        text: "A respondent treated the answer as more of an average.",
        provenance: "direct_quote",
        citation: {
          reportTitle: cpsSelfResponseTitle,
          page: "section 3.4.2, pp. 49-54",
          permalink: cpsSelfResponseUrl
        },
        expectedOutcome: "ambiguous",
        outcomeRationale:
          "The respondent can provide a number, but the field does not say whether average is the intended recipe.",
        probeRationale: {
          covered:
            "A declared window or recipe makes this average interpretable as the intended answer.",
          notCovered:
            "The edit still lets average, usual, and recent-week logic compete."
        }
      },
      {
        id: "hours-ninety-percent",
        text: "A respondent reasoned that for most of the period they had been working almost forty hours.",
        provenance: "direct_quote",
        citation: {
          reportTitle: cpsSelfResponseTitle,
          page: "section 3.4.2, pp. 49-54",
          permalink: cpsSelfResponseUrl
        },
        expectedOutcome: "ambiguous",
        outcomeRationale:
          "The answer is plausible, but the respondent is choosing a dominance rule that the field does not make explicit.",
        probeRationale: {
          covered:
            "A usual-pattern rule can make a most-of-the-period answer recoverable.",
          notCovered:
            "The edit still does not specify whether most-of-period should control the number."
        }
      },
      {
        id: "hours-variable-average",
        text: "Respondents with variable schedules averaged across different kinds of weeks.",
        provenance: "direct_quote",
        citation: {
          reportTitle: cpsSelfResponseTitle,
          page: "section 3.4.2, pp. 49-54",
          permalink: cpsSelfResponseUrl
        },
        expectedOutcome: "ambiguous",
        outcomeRationale:
          "The numeric answer hides which weeks were included and how they were aggregated.",
        probeRationale: {
          covered:
            "A shorter or explicit window makes the averaging recipe more inspectable.",
          notCovered:
            "The edit still turns several week types into one number without naming the recipe."
        }
      },
      {
        id: "hours-stable-forty",
        text: "A respondent works the same forty-hour schedule each week.",
        provenance: "editorial",
        attributionNote:
          "Based on the CPS usual-hours construct, where stable schedules make the single answer recoverable.",
        expectedOutcome: "covered",
        outcomeRationale:
          "With a stable schedule, one usual-hours number is recoverable without extra calculation.",
        probeRationale: {
          covered:
            "Any reasonable window preserves the same forty-hour answer.",
          notCovered:
            "The edit should not make a stable forty-hour schedule harder to report."
        }
      },
      {
        id: "hours-no-usual-week",
        text: "A respondent's hours swing between short and long weeks with no week that feels usual.",
        provenance: "editorial",
        attributionNote:
          "Based on the CPS finding that irregular workers collapsed separately remembered weeks into one number.",
        expectedOutcome: "not_covered",
        outcomeRationale:
          "The requested answer shape is wrong for a worker who has no stable usual week.",
        probeRationale: {
          covered:
            "A concrete recent window can turn the task into a reportable period instead of a false usual week.",
          notCovered:
            "The edit still asks for a usual week that the respondent does not experience."
        }
      }
    ],
    mechanismQuestion: {
      prompt:
        "Why can one usual-hours number be hard to recover from changing weekly schedules?",
      choices: [
        {
          id: "single-number",
          text: "The item required one usual number from variable remembered weeks.",
          isCorrect: true,
          explanation:
            "The report finding centers on respondents turning several week patterns into one answer."
        },
        {
          id: "open-construct",
          text: "The field combined paid hours, unpaid breaks, and travel time into one number.",
          isCorrect: false,
          explanation:
            "That would be a broad-bucket problem. Here the construct is hours of work, and the cited strain is producing one number from variable weeks."
        },
        {
          id: "missing-na",
          text: "A prior question about overtime hours changed how respondents read 'usually'.",
          isCorrect: false,
          explanation:
            "No prior item is at issue. The documented strain is reducing variable weeks of work into one number, not carryover from a previous answer."
        }
      ]
    },
    routeStages: [
      {
        id: "hours-reality",
        kind: "respondent_reality",
        eyebrow: "Respondent reality",
        title: "Weeks do not match",
        detail:
          "The respondent may remember short weeks, long weeks, and recent schedule changes instead of one stable weekly pattern."
      },
      {
        id: "hours-wording",
        kind: "tested_wording",
        eyebrow: "Tested wording",
        title: "How many hours per week do you USUALLY work?",
        detail:
          "The numeric field accepts one clean-looking number and does not show the calculation rule used to make it."
      },
      {
        id: "hours-break",
        kind: "route_break",
        eyebrow: "Route break",
        title: "Average, mode, or recent pattern?",
        detail:
          "The respondent has to choose whether usual means average, most common schedule, current schedule, or most of the reference period."
      },
      {
        id: "hours-consequence",
        kind: "data_consequence",
        eyebrow: "Data consequence",
        title: "The number can hide its recipe",
        detail:
          "Two respondents can both enter plausible numbers while using different recipes that the data field cannot recover."
      }
    ],
    neighborContrast: {
      pattern: "broad_bucket",
      neighborSpecimenId: "business-industry",
      contrastText:
        "This specimen is forced precision because changing weeks must become one number. The broad-bucket neighbor is different: the field is too wide across answer concepts or levels."
    },
    widget: {
      kind: "time_window_slider",
      windows: [
        { id: "last-week", label: "last week", days: 7 },
        { id: "four-weeks", label: "last 4 weeks", days: 28 },
        { id: "four-months", label: "last 4 months", days: 122 },
        { id: "usual-no-window", label: "usual, no set window", days: 0 }
      ],
      initialWindowId: "four-months",
      diagnostic: {
        "hours-more-average": { stableWindowIds: ["usual-no-window"] },
        "hours-ninety-percent": { stableWindowIds: ["usual-no-window"] },
        "hours-variable-average": { stableWindowIds: ["last-week", "four-weeks"] },
        "hours-stable-forty": {
          stableWindowIds: ["last-week", "four-weeks", "four-months", "usual-no-window"]
        },
        "hours-no-usual-week": { stableWindowIds: ["last-week"] }
      }
    },
    probePrompt: "Explore how the recall window changes the answer recipe.",
    reveal: {
      addresses: {
        revisionDescription:
          "The Round 2 form removed the instruction to consider the last four months and simplified the usual-hours item.",
        sourcePageRef: "CPS internet self-response section 3.4.2, pp. 49-54"
      },
      remainsUntested: {
        residualRisks: [
          "Workers with highly seasonal, on-call, or platform-mediated schedules may still lack one stable usual week."
        ],
        claimBoundaryNote
      }
    },
    microCases: [
      {
        id: "hours-near-income",
        kind: "near_transfer",
        context:
          "A worker earns a base wage plus tips that vary by week. The form asks for one usual weekly earnings amount.",
        questionPrompt:
          "Which wording feature would make the answer recipe unstable?",
        wording: "How much do you usually earn in a week when your tips change?",
        pattern: "forced_precision",
        featureChoices: [
          "A single amount is required from variable weeks",
          "A broad industry field has several levels",
          "A category label has multiple everyday meanings"
        ],
        correctFeatureIndex: 0,
        explanation:
          "This is the same pattern because changing weekly tips must become one amount. It is not broad bucket because the answer shape is precise and numeric."
      },
      {
        id: "hours-distractor-main-reason",
        kind: "distractor",
        context:
          "A labor-force item asks for the main reason someone was not looking for work, even when several reasons applied.",
        questionPrompt:
          "Which wording feature is doing the work in this distractor?",
        wording: "What is the main reason you were not looking for work?",
        pattern: "broad_bucket",
        featureChoices: [
          "One reason field compresses multiple coexisting reasons",
          "One number is required from variable weeks",
          "A missing equipment screener changes No"
        ],
        correctFeatureIndex: 0,
        explanation:
          "This may look like forced precision because it asks for one answer, but the distinguishing feature is a broad reason bucket rather than numeric aggregation."
      }
    ],
    source: sourceReceipt(
      censusAgency,
      "RSM2025-03",
      cpsSelfResponseTitle,
      "cognitive_testing",
      "2025",
      "section 3.4.2, pp. 49-54",
      cpsSelfResponseUrl
    )
  },
  {
    id: "notebook-computer",
    number: "07",
    railLabel: "Notebook",
    pattern: "label_ambiguity",
    patternLabel: "Label ambiguity",
    canonicalSubtitle: canonicalSubtitleByPattern.label_ambiguity,
    canonicalCitations: canonicalCitationByPattern.label_ambiguity,
    title: "When notebook stops meaning laptop",
    subtitle: "The respondent may own the device, but the label sends them to another product family.",
    testedWording:
      "What about a laptop or notebook? [Do you/Does anyone in this household] use a laptop or notebook computer?",
    answerFrame: {
      eyebrow: "NTIA Internet Use Survey device item",
      prompt:
        "What about a laptop or notebook? Do you or does anyone in this household use a laptop or notebook computer?",
      context: [
        "The item asks about household use of a portable personal computer.",
        "Help text defined a laptop as portable with a built-in keyboard and screen."
      ],
      targetKind: "response_option",
      targetLabel: "Highlighted device label",
      targetText: "Laptop or notebook computer",
      responseOptions: [
        { id: "yes", text: "Yes, someone uses a laptop or notebook computer", isTarget: true },
        { id: "no", text: "No" }
      ],
      taskPrompt:
        "Judge whether the label gives the respondent a clean route to portable-computer use, or whether notebook points to another device family.",
      methodNote:
        "The report found laptop was understood, while notebook sent several respondents to tablet-like or lower-function devices."
    },
    intendedConstruct:
      "Use of a portable personal computer with a built-in keyboard and screen.",
    sampleRespondent:
      "A respondent who owns a portable computer hears notebook as another device family. The answer goes wrong before the yes/no option matters.",
    prerequisiteVocab: prerequisiteVocabByPattern.label_ambiguity,
    predictionCopy: predictionCopy(
      [
        "Laptop route visible",
        "The highlighted label clearly points to the intended portable-computer construct."
      ],
      [
        "Notebook meaning shifts",
        "Notebook can send the respondent toward a non-laptop or borderline device meaning."
      ],
      [
        "Not a laptop computer",
        "The household device should not be counted through the laptop/notebook path."
      ]
    ),
    vignettes: [
      {
        id: "notebook-lower-function",
        text: 'A respondent defined notebook as "a computer with lower functionality."',
        provenance: "direct_quote",
        citation: {
          reportTitle: ntia2021Title,
          page: "section 3.1.1, p. 10",
          permalink: ntia2021Url
        },
        expectedOutcome: "ambiguous",
        outcomeRationale:
          "Lower functionality is a plausible device distinction, but it does not match the survey's laptop synonym.",
        probeRationale: {
          covered:
            "Removing notebook or pairing laptop with a clearer portable-computer label reduces this side meaning.",
          notCovered:
            "The edit still lets notebook imply a weaker device rather than a laptop."
        }
      },
      {
        id: "notebook-chromebook",
        text: 'A respondent mapped notebook to something "like a Chromebook."',
        provenance: "direct_quote",
        citation: {
          reportTitle: ntia2021Title,
          page: "section 3.1.1, p. 10",
          permalink: ntia2021Url
        },
        expectedOutcome: "ambiguous",
        outcomeRationale:
          "A Chromebook may be in scope or may be treated as a separate product family, so the label does not settle the answer.",
        probeRationale: {
          covered:
            "Naming Chromebook or a clearer laptop class can bring this case into a declared route.",
          notCovered:
            "The edit still leaves Chromebook hovering between laptop and another device family."
        }
      },
      {
        id: "notebook-tablet",
        text: 'A respondent said notebook was "like a tablet."',
        provenance: "direct_quote",
        citation: {
          reportTitle: ntia2021Title,
          page: "section 3.1.1, p. 10",
          permalink: ntia2021Url
        },
        expectedOutcome: "ambiguous",
        outcomeRationale:
          "Tablet-like interpretation sends the label toward a neighboring device category before the respondent answers.",
        probeRationale: {
          covered:
            "A laptop-only or built-in-keyboard frame keeps tablet-like readings from controlling the answer.",
          notCovered:
            "The edit still lets notebook point toward a tablet."
        }
      },
      {
        id: "notebook-plain-laptop",
        text: "A respondent with a conventional laptop recognizes laptop when notebook is not foregrounded.",
        provenance: "editorial",
        attributionNote:
          "Based on the Round 2 finding that deleting notebook removed confusion.",
        expectedOutcome: "covered",
        outcomeRationale:
          "A conventional laptop is the intended clean case for the item.",
        probeRationale: {
          covered:
            "The edited label preserves laptop as the clear route for this respondent.",
          notCovered:
            "The edit should not make a conventional laptop harder to report."
        }
      },
      {
        id: "notebook-tablet-only",
        text: "A household has only a tablet, and the respondent says Yes because notebook sounds tablet-like.",
        provenance: "editorial",
        attributionNote:
          "Based on the NTIA finding that some respondents mapped notebook to tablet-like devices.",
        expectedOutcome: "not_covered",
        outcomeRationale:
          "A tablet-only household is outside the laptop/notebook construct, so Yes would be the wrong path.",
        probeRationale: {
          covered:
            "The edit resolves this by keeping tablet-only households outside the laptop path.",
          notCovered:
            "Removing notebook keeps tablet-only households from entering the laptop path."
        }
      }
    ],
    mechanismQuestion: {
      prompt:
        "Why can Laptop or notebook computer send respondents away from the intended laptop route?",
      choices: [
        {
          id: "notebook-label",
          text: "The notebook label had several plausible everyday device meanings.",
          isCorrect: true,
          explanation:
            "Notebook sent respondents toward lower-function, Chromebook-like, or tablet-like device meanings before the yes/no answer was chosen."
        },
        {
          id: "notebook-no-equipment",
          text: "The item assumed everyone owned a portable computer.",
          isCorrect: false,
          explanation:
            "The issue is label interpretation, not a hidden inapplicable path."
        },
        {
          id: "notebook-sequence",
          text: "A previous device question changed the meaning of this item.",
          isCorrect: false,
          explanation: "The cited finding is inside the laptop/notebook label, not item order."
        }
      ]
    },
    routeStages: [
      {
        id: "notebook-reality",
        kind: "respondent_reality",
        eyebrow: "Respondent reality",
        title: "Owns a portable computer",
        detail:
          "The respondent may own a laptop-like device and still use everyday device categories that differ from the survey's synonym."
      },
      {
        id: "notebook-wording",
        kind: "tested_wording",
        eyebrow: "Tested wording",
        title: "Laptop or notebook",
        detail:
          "The item treats notebook as another name for laptop, while some respondents treat it as a different product family."
      },
      {
        id: "notebook-break",
        kind: "route_break",
        eyebrow: "Route break",
        title: "Notebook points elsewhere",
        detail:
          "The respondent has to decide whether notebook means a laptop, a smaller computer, a Chromebook-like device, or a tablet-like device."
      },
      {
        id: "notebook-consequence",
        kind: "data_consequence",
        eyebrow: "Data consequence",
        title: "Device use can be underreported or misclassified",
        detail:
          "Households can report the wrong answer even when they know what devices they use, because the label redirects the classification."
      }
    ],
    neighborContrast: {
      pattern: "category_boundary_blur",
      neighborSpecimenId: "electric-vehicle-type",
      contrastText:
        "This specimen is label ambiguity because notebook itself redirects the respondent before classification begins. The category-boundary neighbor is different: neighboring classes overlap even when the labels are understood."
    },
    widget: {
      kind: "example_set_editor",
      initialExampleIds: ["notebook"],
      candidates: [
        { id: "laptop", label: "laptop" },
        { id: "notebook", label: "notebook" },
        { id: "chromebook", label: "Chromebook" },
        { id: "tablet", label: "tablet" },
        { id: "two-in-one", label: "2-in-1 computer" }
      ],
      diagnostic: {
        "notebook-lower-function": { coveredBy: [["laptop"], ["laptop", "two-in-one"]] },
        "notebook-chromebook": { coveredBy: [["laptop"], ["laptop", "chromebook"]] },
        "notebook-tablet": { coveredBy: [["laptop"]] },
        "notebook-plain-laptop": {
          coveredBy: [["laptop"], ["laptop", "notebook"], ["laptop", "two-in-one"]]
        },
        "notebook-tablet-only": { coveredBy: [] }
      }
    },
    probePrompt: "Explore whether removing or replacing notebook narrows the label.",
    reveal: {
      addresses: {
        revisionDescription:
          "Round 2 dropped notebook; probed respondents no longer showed the earlier confusion.",
        sourcePageRef: "NTIA 2021 IUS section 3.1.1, p. 10"
      },
      remainsUntested: {
        residualRisks: [
          "Chromebooks, keyboard tablets, and 2-in-1 devices may still sit outside laptop for some respondents."
        ],
        claimBoundaryNote
      }
    },
    microCases: [
      {
        id: "notebook-near-router",
        kind: "near_transfer",
        context:
          "A home-internet item asks about equipment. Some households have one combined box; others use separate modem and router devices.",
        questionPrompt:
          "Which wording feature would make respondents map the same equipment differently?",
        wording: "Do you use a gateway, modem, or router at home?",
        pattern: "label_ambiguity",
        featureChoices: [
          "One familiar equipment label points to several meanings",
          "A prior internet item changes the next response",
          "A single numeric answer is required from variable use"
        ],
        correctFeatureIndex: 0,
        explanation: "Same pattern: the equipment labels can be synonyms or distinct devices."
      },
      {
        id: "notebook-distractor-smart-tv",
        kind: "distractor",
        context:
          "A media-device item asks households to choose among smart TVs, streaming boxes, and other TV-connected devices that can perform similar functions.",
        questionPrompt:
          "Which wording feature is doing the work in this distractor?",
        wording: "A smart TV, streaming box, or another device that plays through a TV",
        pattern: "category_boundary_blur",
        featureChoices: [
          "A single word is misunderstood on entry",
          "Neighboring device categories share features",
          "A missing not-applicable route absorbs No"
        ],
        correctFeatureIndex: 1,
        explanation: "This is a boundary problem because the device classes can overlap."
      }
    ],
    source: sourceReceipt(
      censusAgency,
      "RSM2022-08",
      ntia2021Title,
      "cognitive_testing",
      "2022",
      "section 3.1.1, p. 10",
      ntia2021Url
    ),
    counterexample: {
      eyebrow: "Iterated wording",
      beforeWording: "What about a laptop or notebook?",
      afterWording: "What about a laptop?",
      evidenceOfImprovement:
        "Round 2 removed notebook and the documented confusion disappeared.",
      sourcePageRef: "NTIA 2021 IUS section 3.1.1, p. 10"
    }
  },
  {
    id: "ons-kashmiri",
    number: "08",
    railLabel: "Kashmiri",
    pattern: "broad_bucket",
    patternLabel: "Broad bucket",
    canonicalSubtitle: canonicalSubtitleByPattern.broad_bucket,
    canonicalCitations: canonicalCitationByPattern.broad_bucket,
    title: "When a broad ethnicity bucket hides a subgroup",
    subtitle: "A close-enough category and a write-in path do not behave like a visible box.",
    testedWording:
      "What is your ethnic group? Asian / Asian British ... Pakistani ... Kashmiri ... Any other Asian background, write in.",
    answerFrame: {
      eyebrow: "ONS ethnic-group answer architecture",
      prompt: "What is your ethnic group?",
      context: [
        "The comparison concerns whether Kashmiri identity is available as a visible tick-box or only through a broader category and write-in route.",
        "The workbench evaluates the form architecture for reporting a specific subgroup, not the legitimacy of any identity."
      ],
      targetKind: "response_option",
      targetLabel: "Highlighted reporting path",
      targetText: "Visible Kashmiri tick-box or explicit write-in path",
      responseOptions: [
        { id: "heading", text: "Asian / Asian British heading" },
        { id: "broad", text: "Indian or Pakistani broad tick-boxes" },
        { id: "kashmiri", text: "Kashmiri tick-box", isTarget: true },
        { id: "write-in", text: "Any other Asian background, write in", isTarget: true }
      ],
      taskPrompt:
        "Judge whether the answer architecture lets a Kashmiri respondent report the specific identity cleanly, or whether broad boxes and write-in effort change the route.",
      methodNote:
        "The source found higher Kashmiri identification with a tick-box, while also weighing comparability and parallel-subgroup tradeoffs."
    },
    intendedConstruct:
      "Specific ethnic identity reporting for respondents who identify as Kashmiri.",
    sampleRespondent:
      "A respondent who identifies as Kashmiri sees broader pre-coded answers that feel easier than write-in. Because the broad bucket is close enough, they move on.",
    prerequisiteVocab: prerequisiteVocabByPattern.broad_bucket,
    predictionCopy: predictionCopy(
      [
        "Specific path visible",
        "The form gives a Kashmiri respondent a clear way to report the specific identity."
      ],
      [
        "Broad path competes",
        "A broader visible category or write-in effort can pull the respondent away from the specific identity."
      ],
      [
        "Specific identity hidden",
        "The route records only a broader category when the respondent wants the subgroup identity counted."
      ]
    ),
    vignettes: [
      {
        id: "kashmiri-easier-tick",
        text: 'Respondents said it was "easier just to tick a box than write in."',
        provenance: "direct_quote",
        citation: {
          reportTitle: onsKashmiriTitle,
          page: "sections 6.1-6.2, pp. 16-17 and 33-34",
          permalink: onsKashmiriUrl
        },
        expectedOutcome: "ambiguous",
        outcomeRationale:
          "The respondent may have a specific identity to report, but visible broad boxes make the easier route compete with precision.",
        probeRationale: {
          covered:
            "Separating a visible Kashmiri box from broad national boxes reduces the effort gap.",
          notCovered:
            "The edit still makes the specific answer more work than a broad tick-box."
        }
      },
      {
        id: "kashmiri-not-completed",
        text: 'Some worried that a Kashmiri write-in would look like they had "not completed it properly."',
        provenance: "direct_quote",
        citation: {
          reportTitle: onsKashmiriTitle,
          page: "section 6.2, pp. 33-34",
          permalink: onsKashmiriUrl
        },
        expectedOutcome: "ambiguous",
        outcomeRationale:
          "A write-in path exists, but respondents may read it as less official or less complete than a tick-box.",
        probeRationale: {
          covered:
            "A visible subgroup box makes the specific answer look like a normal completion path.",
          notCovered:
            "The edit still relies on a write-in path that can feel unofficial."
        }
      },
      {
        id: "kashmiri-broad-habit",
        text:
          "A Kashmiri respondent who is used to broader categories ticks Indian or Pakistani out of habit, even with the Kashmiri tick-box visible.",
        provenance: "editorial",
        attributionNote:
          "Based on the ONS finding that some respondents defaulted to broader categories despite a more specific box.",
        expectedOutcome: "ambiguous",
        outcomeRationale:
          "The specific box helps, but learned broad-category habits can still compete with it.",
        probeRationale: {
          covered:
            "A clearer subgroup separation improves the chance that the specific answer is seen in time.",
          notCovered:
            "The edit still does not overcome the broad-category habit."
        }
      },
      {
        id: "kashmiri-specific-box",
        text: "A Kashmiri respondent finds a visible Kashmiri tick-box and reports the subgroup directly.",
        provenance: "editorial",
        attributionNote:
          "Based on the split-sample finding that tick-box identification was higher.",
        expectedOutcome: "covered",
        outcomeRationale:
          "The visible subgroup box provides a clean route to the intended specific reporting.",
        probeRationale: {
          covered:
            "The edit keeps the specific subgroup route visible and separate from broad boxes.",
          notCovered:
            "The edit should not hide a respondent who is ready to report the subgroup directly."
        }
      },
      {
        id: "kashmiri-broad-only",
        text: "A Kashmiri respondent wants the specific identity recorded but only sees broad national boxes and does not use the write-in.",
        provenance: "editorial",
        attributionNote:
          "Based on the ONS finding that write-in-only reporting recovered fewer Kashmiri identifications than a tick-box.",
        expectedOutcome: "not_covered",
        outcomeRationale:
          "The broad tick-box route records a less specific answer than the target subgroup identity.",
        probeRationale: {
          covered:
            "Adding a visible subgroup path gives this respondent a place to report the intended identity.",
          notCovered:
            "The edit still records the respondent only through a broader category."
        }
      }
    ],
    mechanismQuestion: {
      prompt:
        "Why can a Kashmiri respondent be under-routed when broad tick-boxes are easier than write-in?",
      choices: [
        {
          id: "kashmiri-level",
          text: "The response task made a broad visible category compete with a specific subgroup identity.",
          isCorrect: true,
          explanation:
            "The broad umbrella plus write-in path did not recover the subgroup at the same rate as a visible Kashmiri tick-box."
        },
        {
          id: "kashmiri-word",
          text: "The word Kashmiri itself had several everyday meanings.",
          isCorrect: false,
          explanation: "The form made the specific answer harder than broad boxes."
        },
        {
          id: "kashmiri-number",
          text: "The item asked respondents to estimate an exact number.",
          isCorrect: false,
          explanation: "No numeric estimation is at issue; the answer level is."
        }
      ]
    },
    routeStages: [
      {
        id: "kashmiri-reality",
        kind: "respondent_reality",
        eyebrow: "Respondent reality",
        title: "Specific subgroup identity",
        detail:
          "The respondent may identify specifically as Kashmiri while also recognizing broader Asian, Indian, or Pakistani routes."
      },
      {
        id: "kashmiri-wording",
        kind: "tested_wording",
        eyebrow: "Tested wording",
        title: "Broad boxes and a write-in path",
        detail:
          "The form architecture determines whether Kashmiri appears as a normal tick-box or must be supplied through a write-in route."
      },
      {
        id: "kashmiri-break",
        kind: "route_break",
        eyebrow: "Route break",
        title: "Specific answer costs more effort",
        detail:
          "The respondent has to decide whether to take the easy broad box, trust the write-in, or look for a visible subgroup box."
      },
      {
        id: "kashmiri-consequence",
        kind: "data_consequence",
        eyebrow: "Data consequence",
        title: "Subgroup counts depend on answer architecture",
        detail:
          "The source found more Kashmiri identification with a visible tick-box than with write-in only, while also documenting design tradeoffs."
      }
    ],
    neighborContrast: {
      pattern: "category_boundary_blur",
      neighborSpecimenId: "ons-ethnic-group-heading",
      contrastText:
        "This specimen is broad bucket because a specific identity is nested under broader, easier reporting levels. The category-boundary neighbor is different: several visible headings can all look partly right."
    },
    widget: {
      kind: "bucket_splitter",
      items: [
        { id: "asian-heading", label: "Asian / Asian British heading" },
        { id: "broad-national", label: "Indian or Pakistani box" },
        { id: "kashmiri-box", label: "Kashmiri tick-box" },
        { id: "write-in", label: "Any other Asian background write-in" }
      ],
      initialSplitIndex: null,
      candidateSplits: [1, 2, 3],
      diagnostic: {
        "kashmiri-easier-tick": { cleanAt: [2] },
        "kashmiri-not-completed": { cleanAt: [2] },
        "kashmiri-broad-habit": { cleanAt: [2] },
        "kashmiri-specific-box": { cleanAt: [2] },
        "kashmiri-broad-only": { cleanAt: [2] }
      }
    },
    probePrompt: "Explore where the form separates broad categories from subgroup reporting.",
    reveal: {
      addresses: {
        revisionDescription:
          "The Kashmiri box identified more respondents, but ONS recommended against adding it after weighing comparability, parallel subgroup pressure, and multi-tick confusion.",
        sourcePageRef: "ONS Kashmiri report sections 5.1, 6.1, and 6.2, pp. 13, 16-17, 33-34"
      },
      remainsUntested: {
        residualRisks: [
          "Adding one subgroup box can create pressure for parallel boxes for other communities.",
          "Respondents may become uncertain whether to tick both a broad box and a subgroup box."
        ],
        claimBoundaryNote
      }
    },
    microCases: [
      {
        id: "kashmiri-near-industry",
        kind: "near_transfer",
        context:
          "An employment form lets someone describe a workplace as a broad sector, establishment type, clinic type, or service line.",
        questionPrompt:
          "Which wording feature makes several answer levels look responsive?",
        wording: "What kind of workplace was this: health care, hospital, clinic, or other service?",
        pattern: "broad_bucket",
        featureChoices: [
          "A broad level competes with a more specific reporting level",
          "A previous item primes the next response",
          "A label has several unrelated meanings"
        ],
        correctFeatureIndex: 0,
        explanation: "Same pattern: several reporting levels can all look responsive."
      },
      {
        id: "kashmiri-distractor-black-heading",
        kind: "distractor",
        context:
          "An ethnic-group form uses a heading that combines geographic and colour terms, and some respondents search by different parts of that heading.",
        questionPrompt:
          "Which wording feature is doing the work in this distractor?",
        wording: "African / Caribbean / Black / Black British",
        pattern: "category_boundary_blur",
        featureChoices: [
          "A visible broad bucket hides a subgroup",
          "Adjacent section labels make several homes partly right",
          "An exact number is required from a variable history"
        ],
        correctFeatureIndex: 1,
        explanation: "This is boundary blur because several section labels become partly relevant."
      }
    ],
    source: sourceReceipt(
      onsAgency,
      "ONS Kashmiri",
      onsKashmiriTitle,
      "cognitive_testing",
      "2009",
      "sections 5.1, 6.1, and 6.2, pp. 13, 16-17, 33-34",
      onsKashmiriUrl
    )
  },
  {
    id: "sump-pump",
    number: "09",
    railLabel: "Sump pump",
    pattern: "false_premise",
    patternLabel: "False premise",
    canonicalSubtitle: canonicalSubtitleByPattern.false_premise,
    canonicalCitations: canonicalCitationByPattern.false_premise,
    title: "When flooding assumes the equipment exists",
    subtitle: "No can mean no flooding, no pump, or no pump failure unless the path separates them.",
    testedWording:
      "In the last 12 months/since you've lived here, did water collect in your basement or crawl space because your sump pump stopped working properly?",
    answerFrame: {
      eyebrow: "AHS outage flooding item",
      prompt:
        "Did water collect in your basement or crawl space because your sump pump stopped working properly as a result of a power outage?",
      context: [
        "The item includes Yes, No, and No sump pump paths.",
        "The disputed repair was a follow-up after No to distinguish no pump from no pump failure."
      ],
      targetKind: "yes_no_path",
      targetLabel: "Highlighted response path",
      targetText: "Yes / No / No sump pump response set",
      responseOptions: [
        { id: "yes", text: "Yes", isTarget: true },
        { id: "no", text: "No", isTarget: true },
        { id: "no-pump", text: "No sump pump", isTarget: true }
      ],
      taskPrompt:
        "Judge whether this response path separates no flooding, no pump, no pump failure, and out-of-scope water causes.",
      methodNote:
        "The final wording adopted the outage wording but did not adopt the proposed follow-up after No."
    },
    intendedConstruct:
      "Flooding caused by an existing sump pump failing during a power outage.",
    sampleRespondent:
      "A respondent without a sump pump hears a question that assumes the failure mechanism exists. They answer by escaping the premise.",
    prerequisiteVocab: prerequisiteVocabByPattern.false_premise,
    predictionCopy: predictionCopy(
      [
        "Pump-failure path clear",
        "The response path separates in-scope pump-failure flooding from other states."
      ],
      [
        "No can hide no pump",
        "A No answer could mean no sump pump, no pump failure, or no water collection."
      ],
      [
        "Outside pump-failure cause",
        "The water event should not be counted as sump-pump failure during an outage."
      ]
    ),
    vignettes: [
      {
        id: "sump-help-very",
        text: 'A respondent without a sump pump said the help text was "very" helpful.',
        provenance: "direct_quote",
        citation: {
          reportTitle: ahs2023Title,
          page: "section 4.5.8 OUTFLOOD, pp. 57-59",
          permalink: ahs2023Url
        },
        expectedOutcome: "ambiguous",
        outcomeRationale:
          "The respondent lacks the assumed equipment, so the item needs a strong path out of the failure premise.",
        probeRationale: {
          covered:
            "A screener or not-applicable path lets no-sump-pump households bypass the failure event.",
          notCovered:
            "The response path still relies on the respondent escaping a premise about equipment they do not have."
        }
      },
      {
        id: "sump-no-pump-no",
        text: "A respondent with no sump pump answers No because the assumed equipment is absent.",
        provenance: "editorial",
        attributionNote:
          "Based on the OUTFLOOD no-sump-pump disambiguator.",
        expectedOutcome: "ambiguous",
        outcomeRationale:
          "No could mean no pump, no failure, or no water, so the answer is not analytically clean.",
        probeRationale: {
          covered:
            "A no-pump route or follow-up keeps this respondent from being coded as a substantive No.",
          notCovered:
            "The edit still lets no equipment hide inside No."
        }
      },
      {
        id: "sump-failed-outage",
        text: "A respondent with a sump pump reports water collecting because the pump failed.",
        provenance: "editorial",
        attributionNote:
          "Based on the OUTFLOOD sump-pump-failure construct.",
        expectedOutcome: "covered",
        outcomeRationale:
          "The respondent has the equipment, the failure occurred, and water collected for the intended reason.",
        probeRationale: {
          covered:
            "The edit preserves a clean Yes route for in-scope pump-failure flooding.",
          notCovered:
            "The edit should not block the core failure event from being reported."
        }
      },
      {
        id: "sump-water-other-cause",
        text: "A respondent with a sump pump reports water for a cause unrelated to pump failure.",
        provenance: "editorial",
        attributionNote:
          "Based on the OUTFLOOD outage-and-pump-failure scope.",
        expectedOutcome: "not_covered",
        outcomeRationale:
          "Water from another cause is outside the pump-failure path.",
        probeRationale: {
          covered:
            "The edit resolves this by keeping other water causes outside sump-pump failure.",
          notCovered:
            "The edit keeps other water causes outside the target construct."
        }
      }
    ],
    mechanismQuestion: {
      prompt:
        "Why can a No answer be hard to interpret when the sump-pump item asks about failure first?",
      choices: [
        {
          id: "sump-assumption",
          text: "The question asked about a failure mechanism before establishing the equipment existed.",
          isCorrect: true,
          explanation: "A plain No can cover no pump, no pump failure, or no flooding."
        },
        {
          id: "sump-technical-term",
          text: "The phrase 'sump pump' is a technical term respondents may not recognize.",
          isCorrect: false,
          explanation:
            "Even when the term is recognized, the documented issue remains: a plain No can hide no equipment, no failure event, or no flooding."
        },
        {
          id: "sump-order",
          text: "A prior flooding question changed the meaning of the answer.",
          isCorrect: false,
          explanation:
            "The cited repair is an applicability disambiguator, not a question-order repair."
        }
      ]
    },
    routeStages: [
      {
        id: "sump-reality",
        kind: "respondent_reality",
        eyebrow: "Respondent reality",
        title: "May not have a sump pump",
        detail:
          "The respondent may live in a home with no sump pump, which is different from having a pump that did not fail."
      },
      {
        id: "sump-wording",
        kind: "tested_wording",
        eyebrow: "Tested wording",
        title: "Because your sump pump stopped working",
        detail:
          "The causal frame names sump-pump failure before confirming that the household has a sump pump."
      },
      {
        id: "sump-break",
        kind: "route_break",
        eyebrow: "Route break",
        title: "No event or no equipment?",
        detail:
          "The respondent has to decide whether No is the closest escape from the equipment premise or a substantive no-flooding answer."
      },
      {
        id: "sump-consequence",
        kind: "data_consequence",
        eyebrow: "Data consequence",
        title: "The denominator remains unclear",
        detail:
          "Without a follow-up, analysts may not know which No households had equipment at risk and which were never in scope."
      }
    ],
    neighborContrast: {
      pattern: "label_ambiguity",
      neighborSpecimenId: "notebook-computer",
      contrastText:
        "This specimen is false premise because the wording assumes equipment before separating inapplicable households. The label-ambiguity neighbor is different: one word itself points respondents to multiple meanings."
    },
    widget: {
      kind: "filter_path_toggle",
      initialState: { hasScreener: false, hasNotApplicable: false },
      diagnostic: {
        "sump-help-very": {
          cleanStates: [
            { hasScreener: true, hasNotApplicable: false },
            { hasScreener: true, hasNotApplicable: true },
            { hasScreener: false, hasNotApplicable: true }
          ]
        },
        "sump-no-pump-no": {
          cleanStates: [
            { hasScreener: true, hasNotApplicable: false },
            { hasScreener: true, hasNotApplicable: true },
            { hasScreener: false, hasNotApplicable: true }
          ]
        },
        "sump-failed-outage": {
          cleanStates: [
            { hasScreener: false, hasNotApplicable: false },
            { hasScreener: true, hasNotApplicable: false },
            { hasScreener: false, hasNotApplicable: true },
            { hasScreener: true, hasNotApplicable: true }
          ]
        },
        "sump-water-other-cause": { cleanStates: [] }
      }
    },
    probePrompt: "Explore how a screener or not-applicable path changes No.",
    reveal: {
      addresses: {
        revisionDescription:
          "The outage-and-timeframe wording was adopted, but the no-sump-pump follow-up was not.",
        sourcePageRef: "AHS 2023 section 4.5.8 OUTFLOOD, pp. 57-59"
      },
      remainsUntested: {
        residualRisks: [
          "The final wording can still collapse no equipment and no failure event inside No."
        ],
        claimBoundaryNote
      }
    },
    microCases: [
      {
        id: "sump-near-generator",
        kind: "near_transfer",
        context:
          "An outage module asks about backup-generator failure. Some households have a generator; others have no generator at all.",
        questionPrompt:
          "Which wording feature would make a plain No hard to interpret?",
        wording: "Did your backup generator stop working during the outage?",
        pattern: "false_premise",
        featureChoices: [
          "A yes/no item assumes the household has the equipment",
          "Two equipment labels have a fuzzy boundary",
          "A previous item licenses multiple answers"
        ],
        correctFeatureIndex: 0,
        explanation: "Same pattern: homes without a generator need an applicability path."
      },
      {
        id: "sump-distractor-notebook",
        kind: "distractor",
        context:
          "A household technology item asks about laptop or notebook computers, and notebook may cue non-laptop devices.",
        questionPrompt:
          "Which wording feature is doing the work in this distractor?",
        wording: "Do you use a laptop or notebook computer?",
        pattern: "label_ambiguity",
        featureChoices: [
          "An equipment premise is missing",
          "One device label points to several everyday meanings",
          "A single number is required from variable behavior"
        ],
        correctFeatureIndex: 1,
        explanation: "This is label ambiguity because notebook sends respondents to different devices."
      }
    ],
    source: sourceReceipt(
      censusAgency,
      "RSM2022-11",
      ahs2023Title,
      "cognitive_testing",
      "2022",
      "section 4.5.8 OUTFLOOD, pp. 57-59",
      ahs2023Url
    ),
    counterexample: {
      eyebrow: "Partial repair",
      beforeWording:
        "Did water collect in your basement or crawl space because your sump pump stopped working properly?",
      afterWording:
        "Did water collect because your sump pump stopped working during a power outage?",
      evidenceOfImprovement:
        "The outage-and-timeframe wording was adopted, but the proposed follow-up disambiguator was not.",
      sourcePageRef: "AHS 2023 section 4.5.8 OUTFLOOD, pp. 57-59"
    }
  },
  {
    id: "ons-ethnic-group-heading",
    number: "10",
    railLabel: "Heading",
    pattern: "category_boundary_blur",
    patternLabel: "Category boundary blur",
    canonicalSubtitle: canonicalSubtitleByPattern.category_boundary_blur,
    canonicalCitations: canonicalCitationByPattern.category_boundary_blur,
    title: "When a heading scrambles the category boundary",
    subtitle: "The section label sends respondents searching by different cues.",
    testedWording: "African/Caribbean/Black/Black British",
    answerFrame: {
      eyebrow: "ONS ethnic-group heading test",
      prompt: "Choose the section and tick-box that best describes your ethnic group.",
      context: [
        "The issue is the section heading that respondents scan before choosing a more specific box.",
        "The tested heading placed African and Caribbean before Black."
      ],
      targetKind: "heading",
      targetLabel: "Highlighted section heading",
      targetText: "African/Caribbean/Black/Black British",
      responseOptions: [
        { id: "white", text: "White" },
        { id: "mixed", text: "Mixed / multiple ethnic groups" },
        { id: "asian", text: "Asian / Asian British" },
        { id: "black-heading", text: "African/Caribbean/Black/Black British", isTarget: true },
        { id: "other", text: "Other ethnic group" }
      ],
      taskPrompt:
        "Judge whether the highlighted heading helps the respondent find the right section, or whether color and geography cues make several sections partly plausible.",
      methodNote:
        "The ONS recommendation reordered the heading to put Black first; this specimen focuses on navigation through section cues."
    },
    intendedConstruct:
      "A heading that lets respondents find the right boxes without resolving a race-versus-geography conflict.",
    sampleRespondent:
      "A respondent scans for their usual cue and lands in the wrong place. Another sees White and African as both relevant.",
    prerequisiteVocab: prerequisiteVocabByPattern.category_boundary_blur,
    predictionCopy: predictionCopy(
      [
        "Heading cue works",
        "The highlighted heading clearly gives this respondent the intended navigation route."
      ],
      [
        "Heading cues compete",
        "Colour, geography, or combined identity cues make more than one section seem plausible."
      ],
      [
        "Wrong section cue",
        "The highlighted heading would pull this respondent away from the better section route."
      ]
    ),
    vignettes: [
      {
        id: "heading-black-african",
        text: "A respondent expected Black African because that is the familiar combined cue.",
        provenance: "direct_quote",
        citation: {
          reportTitle: onsEthnicGroupTitle,
          page: "section 6.4.3, pp. 36-37",
          permalink: onsEthnicGroupUrl
        },
        expectedOutcome: "ambiguous",
        outcomeRationale:
          "The familiar combined cue is not visible in the same order, so the respondent must reconcile the heading before choosing.",
        probeRationale: {
          covered:
            "Leading with Black brings the respondent's search cue to the front of the heading.",
          notCovered:
            "The edit still makes the respondent search through competing heading cues."
        }
      },
      {
        id: "heading-looking-black",
        text: 'A respondent said, "I was actually looking for Black" and then came to African.',
        provenance: "direct_quote",
        citation: {
          reportTitle: onsEthnicGroupTitle,
          page: "section 6.4.3, pp. 36-37",
          permalink: onsEthnicGroupUrl
        },
        expectedOutcome: "ambiguous",
        outcomeRationale:
          "The respondent eventually finds a path, but only after the heading order sends them through a different cue first.",
        probeRationale: {
          covered:
            "A Black-first heading aligns the visible section with the respondent's first search cue.",
          notCovered:
            "The edit still requires a respondent looking for Black to notice it after other cues."
        }
      },
      {
        id: "heading-white-african",
        text: 'A respondent said, "I\'m an African, but a White African."',
        provenance: "direct_quote",
        citation: {
          reportTitle: onsEthnicGroupTitle,
          page: "section 6.4.3, pp. 36-37",
          permalink: onsEthnicGroupUrl
        },
        expectedOutcome: "not_covered",
        outcomeRationale:
          "The highlighted heading is the wrong path if geography pulls a White African respondent away from the White section.",
        probeRationale: {
          covered:
            "An explicit White African path can keep geography from pulling the respondent into the highlighted section.",
          notCovered:
            "The edit still does not resolve the cross-cutting White and African cues."
        }
      },
      {
        id: "heading-multiple-ticks",
        text: "A respondent searches for a 'Black' cue, ticks the wrong section first, then adds a second mark when they find the right one.",
        provenance: "editorial",
        attributionNote:
          "Based on the ONS finding that respondents missed the embedded 'Black' label, ticked the wrong section first, and corrected with a second mark.",
        expectedOutcome: "ambiguous",
        outcomeRationale:
          "Multiple marks show that the heading did not give the respondent a stable first route.",
        probeRationale: {
          covered:
            "A stronger lead cue reduces wrong-section scanning before the respondent reaches the intended box.",
          notCovered:
            "The edit still allows wrong-section searching before correction."
        }
      },
      {
        id: "heading-black-british-clean",
        text: "A respondent identifies as Black British and sees that exact cue in the highlighted heading.",
        provenance: "editorial",
        attributionNote:
          "Based on the ONS goal of preserving Black and Black British recognition in the heading.",
        expectedOutcome: "covered",
        outcomeRationale:
          "The heading contains the respondent's cue directly, so the section can be a clean fit.",
        probeRationale: {
          covered:
            "The edit keeps Black or Black British visible as a direct navigation cue.",
          notCovered:
            "The edit should not hide an exact cue for a respondent who identifies as Black British."
        }
      }
    ],
    mechanismQuestion: {
      prompt:
        "Why can African/Caribbean/Black/Black British send respondents through the wrong section cue?",
      choices: [
        {
          id: "heading-boundary",
          text: "The heading mixed color and geographic cues so several sections seemed partly right.",
          isCorrect: true,
          explanation: "Black, African, and White African cues made the heading boundary unstable."
        },
        {
          id: "heading-write-in",
          text: "The form hid one specific subgroup inside a broad write-in field.",
          isCorrect: false,
          explanation: "That is closer to Kashmiri; here visible section cues compete."
        },
        {
          id: "heading-average",
          text: "The item asked for one exact number from variable behavior.",
          isCorrect: false,
          explanation:
            "No numeric aggregation is involved."
        }
      ]
    },
    routeStages: [
      {
        id: "heading-reality",
        kind: "respondent_reality",
        eyebrow: "Respondent reality",
        title: "Searches by identity cue",
        detail:
          "The respondent may scan for Black, African, White African, or a familiar combined label before reading every box."
      },
      {
        id: "heading-wording",
        kind: "tested_wording",
        eyebrow: "Tested heading",
        title: "African/Caribbean/Black/Black British",
        detail:
          "The heading stacks geographic and colour cues, with Black appearing after African and Caribbean."
      },
      {
        id: "heading-break",
        kind: "route_break",
        eyebrow: "Route break",
        title: "Which cue controls the section?",
        detail:
          "The respondent has to decide whether colour, geography, or the combined phrase should control the section choice."
      },
      {
        id: "heading-consequence",
        kind: "data_consequence",
        eyebrow: "Data consequence",
        title: "Navigation errors can become data errors",
        detail:
          "The source documents wrong-section searching and multiple marks, showing that navigation friction can affect recorded answers."
      }
    ],
    neighborContrast: {
      pattern: "broad_bucket",
      neighborSpecimenId: "ons-kashmiri",
      contrastText:
        "This specimen is category boundary blur because several visible heading cues seem partly right. The broad-bucket neighbor is different: a specific answer is hidden under a broader reporting route."
    },
    widget: {
      kind: "classifier_radio",
      features: [
        {
          id: "african-first",
          label: "African first",
          description: "The heading leads with the geographic cue."
        },
        {
          id: "black-first",
          label: "Black first",
          description: "The heading leads with the color cue respondents searched for."
        },
        {
          id: "white-african-path",
          label: "White African path",
          description: "The category system explicitly acknowledges the geography-color crossing."
        }
      ],
      initialFeatureId: "african-first",
      diagnostic: {
        "heading-black-african": { cleanFeatureIds: ["black-first"] },
        "heading-looking-black": { cleanFeatureIds: ["black-first"] },
        "heading-white-african": { cleanFeatureIds: ["white-african-path"] },
        "heading-multiple-ticks": { cleanFeatureIds: ["black-first", "white-african-path"] },
        "heading-black-british-clean": { cleanFeatureIds: ["black-first"] }
      }
    },
    probePrompt: "Explore which cue should carry the category boundary.",
    reveal: {
      addresses: {
        revisionDescription:
          "ONS reordered the heading to put Black first; respondents then found the appropriate boxes more easily.",
        sourcePageRef: "ONS ethnic-group recommendations section 6.4.3, pp. 36-37"
      },
      remainsUntested: {
        residualRisks: [
          "White African respondents and respondents skeptical of colour terminology may still find imperfect fit."
        ],
        claimBoundaryNote
      }
    },
    microCases: [
      {
        id: "heading-near-device",
        kind: "near_transfer",
        context:
          "A device survey asks about TV-connected devices. Smart TVs and streaming boxes can both run apps and play video through the TV.",
        questionPrompt:
          "Which wording feature makes the category route unstable?",
        wording: "A smart TV, a streaming box, or another device that plays through a TV",
        pattern: "category_boundary_blur",
        featureChoices: [
          "Adjacent categories share features and navigation cues",
          "One broad answer hides subgroup detail",
          "The question assumes equipment exists"
        ],
        correctFeatureIndex: 0,
        explanation: "Same pattern: the device categories can be understood but still overlap."
      },
      {
        id: "heading-distractor-kashmiri",
        kind: "distractor",
        context:
          "An ethnic-group form gives broad Asian / Asian British categories and a write-in route, while a respondent wants to report a specific Kashmiri identity.",
        questionPrompt:
          "Which wording feature is doing the work in this distractor?",
        wording: "Asian / Asian British, Pakistani, Any other Asian background, write in",
        pattern: "broad_bucket",
        featureChoices: [
          "A broad visible bucket competes with a specific subgroup answer",
          "Several section headings are equally plausible",
          "A prior question changes the next category"
        ],
        correctFeatureIndex: 0,
        explanation: "This is broad bucket because the specific subgroup is harder to report."
      }
    ],
    source: sourceReceipt(
      onsAgency,
      "ONS Ethnic Group",
      onsEthnicGroupTitle,
      "recommendation_doc",
      "2009",
      "section 6.4.3, pp. 36-37",
      onsEthnicGroupUrl
    ),
    counterexample: {
      eyebrow: "Iterated wording",
      beforeWording: "African/Caribbean/Black/Black British",
      afterWording: "Black/African/Caribbean/Black British",
      evidenceOfImprovement:
        "Putting Black first helped respondents find appropriate tick-boxes with greater ease.",
      sourcePageRef: "ONS ethnic-group recommendations section 6.4.3, pp. 36-37"
    }
  },
  {
    id: "avoid-natural-disasters",
    number: "11",
    railLabel: "Disasters",
    pattern: "sequence_overlap",
    patternLabel: "Sequence overlap",
    canonicalSubtitle: canonicalSubtitleByPattern.sequence_overlap,
    canonicalCitations: canonicalCitationByPattern.sequence_overlap,
    title: "When a reason series implies one primary reason",
    subtitle: "Each item may be clear alone, but the sequence can make Yes feel too strong.",
    testedWording:
      "Did you move to avoid natural disasters, such as wildfires, earthquakes, tornados, hurricanes, landslides, and floods?",
    answerFrame: {
      eyebrow: "AHS moving-reasons series",
      prompt: "For each reason, answer whether it was a reason you moved.",
      context: [
        "The item appears in a series of yes/no moving-reason questions.",
        "The intended construct is any influence, not only the primary reason."
      ],
      targetKind: "sequence_item",
      targetLabel: "Highlighted reason item",
      targetText: "Avoid natural disasters",
      responseOptions: [
        { id: "other-reasons", text: "Other moving-reason items in the series" },
        { id: "disaster", text: "Did you move to avoid natural disasters?", isTarget: true }
      ],
      taskPrompt:
        "Judge whether the highlighted Yes path means any influence or whether the sequence makes it feel like a main-reason answer.",
      methodNote:
        "The report found that the item text was not the main issue; the sequence needed an all-influences instruction."
    },
    intendedConstruct:
      "Whether avoiding natural disasters was any reason for the move, not the sole or dominant reason.",
    sampleRespondent:
      "A respondent remembers disaster risk as one factor among several motives. They pause because the yes/no sequence makes Yes feel primary.",
    prerequisiteVocab: prerequisiteVocabByPattern.sequence_overlap,
    predictionCopy: predictionCopy(
      [
        "Yes means any influence",
        "The highlighted disaster item clearly covers this reason under the intended any-influence rule."
      ],
      [
        "Yes feels primary",
        "The sequence makes the respondent unsure whether a secondary reason is enough for Yes."
      ],
      [
        "No disaster influence",
        "The move should not be counted as influenced by natural-disaster avoidance."
      ]
    ),
    vignettes: [
      {
        id: "disaster-small-factor",
        text: '"It was a small factor, but was it the primary factor? No."',
        provenance: "direct_quote",
        citation: {
          reportTitle: ahs2025Title,
          page: "section 4.8.5 WMDISAS, pp. 92-93",
          permalink: ahs2025Url
        },
        expectedOutcome: "ambiguous",
        outcomeRationale:
          "The respondent sees disaster risk as real but secondary, while the Yes path feels primary.",
        probeRationale: {
          covered:
            "An all-influences instruction makes a secondary disaster motive eligible for Yes.",
          notCovered:
            "The edit still lets Yes feel stronger than the respondent's secondary motive."
        }
      },
      {
        id: "disaster-part-reason",
        text: '"wasn\'t the primary reason, it was part of the reason."',
        provenance: "direct_quote",
        citation: {
          reportTitle: ahs2025Title,
          page: "section 4.8.5 WMDISAS, pp. 92-93",
          permalink: ahs2025Url
        },
        expectedOutcome: "ambiguous",
        outcomeRationale:
          "Part-of-the-reason fits the intended construct, but not if the series is read as primary-reason reporting.",
        probeRationale: {
          covered:
            "The all-that-influenced framing makes part-of-the-reason a clean Yes.",
          notCovered:
            "The edit still does not tell the respondent that non-primary reasons count."
        }
      },
      {
        id: "disaster-forced-yes",
        text: 'A respondent said that, "if forced to choose," she would say "Yes."',
        provenance: "direct_quote",
        citation: {
          reportTitle: ahs2025Title,
          page: "section 4.8.5 WMDISAS, pp. 92-93",
          permalink: ahs2025Url
        },
        expectedOutcome: "ambiguous",
        outcomeRationale:
          "Forced Yes language signals that the answer path does not match the respondent's strength of reason.",
        probeRationale: {
          covered:
            "A clear any-influence instruction reduces the feeling that Yes overstates the reason.",
          notCovered:
            "The edit still makes the respondent choose between overstatement and underreporting."
        }
      },
      {
        id: "disaster-primary-only",
        text: "A respondent treating the series as main-reason reporting says No when disaster avoidance was one influence.",
        provenance: "editorial",
        attributionNote:
          "Based on the WMDISAS any-reason versus primary-reason finding.",
        expectedOutcome: "ambiguous",
        outcomeRationale:
          "The respondent's No would underreport a real secondary influence because the series implies primary reason.",
        probeRationale: {
          covered:
            "The all-influences rule makes the secondary motive count before the respondent reaches the item.",
          notCovered:
            "The edit still lets a real secondary motive be lost as No."
        }
      },
      {
        id: "disaster-primary-clean",
        text: "A respondent moved mainly because repeated wildfire risk made the prior location unacceptable.",
        provenance: "editorial",
        attributionNote:
          "Based on the WMDISAS construct of moving to avoid natural disasters.",
        expectedOutcome: "covered",
        outcomeRationale:
          "Disaster avoidance is clearly a reason for the move, so Yes is a clean fit.",
        probeRationale: {
          covered:
            "The edit preserves a clean Yes route for a primary disaster-avoidance motive.",
          notCovered:
            "The edit should not block an obvious disaster-avoidance reason."
        }
      },
      {
        id: "disaster-no-influence",
        text: "A respondent moved for rent and household-size reasons, with no disaster risk involved.",
        provenance: "editorial",
        attributionNote:
          "Based on the WMDISAS distinction between disaster avoidance and other moving reasons.",
        expectedOutcome: "not_covered",
        outcomeRationale:
          "The highlighted disaster-avoidance item is the wrong path when disaster risk was not a reason.",
        probeRationale: {
          covered:
            "The edit resolves this by keeping unrelated moving reasons outside the disaster item.",
          notCovered:
            "The edit keeps unrelated moving reasons outside the disaster item."
        }
      }
    ],
    mechanismQuestion: {
      prompt:
        "Why can Did you move to avoid natural disasters? undercount secondary disaster motives?",
      choices: [
        {
          id: "disaster-sequence",
          text: "The yes/no reason series made a multi-reason construct feel like a primary-reason choice.",
          isCorrect: true,
          explanation: "The respondent had a secondary motive, but the sequence made Yes feel too strong."
        },
        {
          id: "disaster-label",
          text: "The term natural disaster had several unrelated meanings.",
          isCorrect: false,
          explanation: "The report says the item text itself was not the problem; the series was."
        },
        {
          id: "disaster-no-state",
          text: "The question assumed the respondent had experienced a natural disaster.",
          isCorrect: false,
          explanation: "The item asks about a moving reason, not whether every respondent had a disaster."
        }
      ]
    },
    routeStages: [
      {
        id: "disaster-reality",
        kind: "respondent_reality",
        eyebrow: "Respondent reality",
        title: "Several motives influenced the move",
        detail:
          "The respondent may remember disaster risk as one real influence among rent, household, job, or location motives."
      },
      {
        id: "disaster-wording",
        kind: "tested_wording",
        eyebrow: "Tested wording",
        title: "Avoid natural disasters",
        detail:
          "The item appears as one yes/no reason in a series, after the respondent has already considered other motives."
      },
      {
        id: "disaster-break",
        kind: "route_break",
        eyebrow: "Route break",
        title: "Any reason or main reason?",
        detail:
          "The respondent has to decide whether Yes means any influence, a major influence, or the main reason for the move."
      },
      {
        id: "disaster-consequence",
        kind: "data_consequence",
        eyebrow: "Data consequence",
        title: "Secondary motives can disappear",
        detail:
          "Respondents may say No to avoid overstating a real but non-primary motive."
      }
    ],
    neighborContrast: {
      pattern: "forced_precision",
      neighborSpecimenId: "acs-weeks-worked",
      contrastText:
        "This specimen is sequence overlap because the prior reason series changes how Yes is interpreted. The forced-precision neighbor is different: the respondent must convert irregular experience into one exact-looking value."
    },
    widget: {
      kind: "sequence_reorderer",
      items: [
        { id: "moving-reasons", label: "other moving reasons" },
        { id: "natural-disasters", label: "avoid natural disasters" },
        { id: "all-influenced", label: "Yes to all reasons that influenced the move" }
      ],
      initialOrder: ["moving-reasons", "natural-disasters", "all-influenced"],
      initialAllowMulti: false,
      diagnostic: {
        "disaster-small-factor": {
          cleanOrders: [
            ["all-influenced", "moving-reasons", "natural-disasters"],
            ["all-influenced", "natural-disasters", "moving-reasons"]
          ],
          requiresMulti: true
        },
        "disaster-part-reason": {
          cleanOrders: [
            ["all-influenced", "moving-reasons", "natural-disasters"],
            ["all-influenced", "natural-disasters", "moving-reasons"]
          ],
          requiresMulti: true
        },
        "disaster-forced-yes": {
          cleanOrders: [
            ["all-influenced", "moving-reasons", "natural-disasters"],
            ["all-influenced", "natural-disasters", "moving-reasons"]
          ],
          requiresMulti: true
        },
        "disaster-primary-only": {
          cleanOrders: [
            ["all-influenced", "moving-reasons", "natural-disasters"],
            ["all-influenced", "natural-disasters", "moving-reasons"]
          ],
          requiresMulti: true
        },
        "disaster-primary-clean": {
          cleanOrders: [
            ["moving-reasons", "natural-disasters", "all-influenced"],
            ["natural-disasters", "moving-reasons", "all-influenced"],
            ["all-influenced", "moving-reasons", "natural-disasters"],
            ["all-influenced", "natural-disasters", "moving-reasons"]
          ],
          requiresMulti: false
        },
        "disaster-no-influence": {
          cleanOrders: [
            ["moving-reasons", "natural-disasters", "all-influenced"],
            ["natural-disasters", "moving-reasons", "all-influenced"],
            ["all-influenced", "moving-reasons", "natural-disasters"],
            ["all-influenced", "natural-disasters", "moving-reasons"]
          ],
          requiresMulti: false
        }
      }
    },
    probePrompt: "Explore whether an all-influences instruction changes the sequence.",
    reveal: {
      addresses: {
        revisionDescription:
          "CBSM recommended a prefatory Yes-to-all-influences instruction, but it was not adopted.",
        sourcePageRef: "AHS 2025 section 4.8.5 WMDISAS, pp. 92-93"
      },
      remainsUntested: {
        residualRisks: [
          "Without an all-influences instruction, secondary motives can still be underreported."
        ],
        claimBoundaryNote
      }
    },
    microCases: [
      {
        id: "disaster-near-owner",
        kind: "near_transfer",
        context:
          "A housing-search sequence first records an online listing, then asks whether owner advertising also helped with the same home search.",
        questionPrompt:
          "Which wording feature changes whether the next Yes is allowed?",
        wording: "After saying you found the home online, did owner advertising also help?",
        pattern: "sequence_overlap",
        featureChoices: [
          "A prior answer changes whether the next Yes is allowed",
          "A response label is lexically ambiguous",
          "A hidden not-applicable route absorbs No"
        ],
        correctFeatureIndex: 0,
        explanation: "Same pattern: an earlier answer changes the later category."
      },
      {
        id: "disaster-distractor-weeks",
        kind: "distractor",
        context:
          "A work-history item asks a respondent to count weeks worked across an irregular 52-week period.",
        questionPrompt:
          "Which wording feature is doing the work in this distractor?",
        wording: "How many weeks did you work over the past 52 weeks?",
        pattern: "forced_precision",
        featureChoices: [
          "A series implies one primary reason",
          "An exact count is required from irregular history",
          "A broad bucket hides a subgroup"
        ],
        correctFeatureIndex: 1,
        explanation: "This is forced precision because the respondent must construct a week count."
      }
    ],
    source: sourceReceipt(
      censusAgency,
      "RSM2024-11",
      ahs2025Title,
      "cognitive_testing",
      "2024",
      "section 4.8.5 WMDISAS, pp. 92-93",
      ahs2025Url
    )
  },
  {
    id: "acs-weeks-worked",
    number: "12",
    railLabel: "Weeks",
    pattern: "forced_precision",
    patternLabel: "Forced precision",
    canonicalSubtitle: canonicalSubtitleByPattern.forced_precision,
    canonicalCitations: canonicalCitationByPattern.forced_precision,
    title: "When weeks worked asks for an exact-looking count",
    subtitle: "Respondents remember work history in spells, months, days, and rough schedules.",
    testedWording:
      "Over the past 52 weeks, how many WEEKS did this person work, even for a few hours, including any paid time off?",
    answerFrame: {
      eyebrow: "ACS weeks-worked item",
      prompt:
        "Over the past 52 weeks, how many weeks did this person work, even for a few hours, including any paid time off?",
      context: [
        "The answer is a numeric count of weeks worked during a 52-week reference period.",
        "The instruction treats a week as in scope even if the person worked only a few hours."
      ],
      targetKind: "numeric_field",
      targetLabel: "Highlighted answer path",
      targetText: "One numeric weeks-worked count",
      responseOptions: [
        { id: "weeks", text: "Weeks worked: [number]", isTarget: true }
      ],
      taskPrompt:
        "Judge whether the respondent can recover one weeks-worked count, or whether the field invites rounding, conversion, or a wrong counting rule.",
      methodNote:
        "This specimen is about the burden and recipe behind an exact-looking number, not about whether annual work-duration data are useful."
    },
    intendedConstruct:
      "Annual work-duration reporting without exactness that irregular work histories cannot support.",
    sampleRespondent:
      "A respondent remembers working most of the year, about three months, or on an inconsistent schedule. They convert or round to a plausible week count.",
    prerequisiteVocab: prerequisiteVocabByPattern.forced_precision,
    predictionCopy: predictionCopy(
      [
        "Week count recoverable",
        "The respondent can recover a calendar-week count that matches the intended rule."
      ],
      [
        "Count recipe unstable",
        "The respondent can answer, but the number may be a conversion, rounded estimate, or uncertain count."
      ],
      [
        "Wrong counting rule",
        "The respondent's route produces a number that should not stand in for weeks worked."
      ]
    ),
    vignettes: [
      {
        id: "weeks-not-exactly",
        text: '"I wouldn\'t know the weeks exactly."',
        provenance: "direct_quote",
        citation: {
          reportTitle: acs2016Title,
          page: "section 4.7.1, pp. 100-106",
          permalink: acs2016Url
        },
        expectedOutcome: "ambiguous",
        outcomeRationale:
          "The respondent may be able to answer approximately, but the field asks for exact weeks that memory does not support.",
        probeRationale: {
          covered:
            "A months-first or less exact recipe can make the work spell easier to recover.",
          notCovered:
            "The edit still asks for a precision the respondent says they do not know."
        }
      },
      {
        id: "weeks-rounded-guess",
        text: '"It\'s a bit difficult because it varies a lot. I just took a rounded guess."',
        provenance: "direct_quote",
        citation: {
          reportTitle: acs2016Title,
          page: "section 4.7.1, pp. 100-106",
          permalink: acs2016Url
        },
        expectedOutcome: "ambiguous",
        outcomeRationale:
          "A rounded guess may be the best available answer, but the field records it like a count.",
        probeRationale: {
          covered:
            "This case remains hard even after edits; it needs a recoverable reporting recipe, not only a shorter label.",
          notCovered:
            "The edit still converts variable work into an exact-looking number."
        }
      },
      {
        id: "weeks-days-divided",
        text: "One respondent added up the days and divided by 5.",
        provenance: "direct_quote",
        citation: {
          reportTitle: acs2016Title,
          page: "section 4.7.1, pp. 100-106",
          permalink: acs2016Url
        },
        expectedOutcome: "not_covered",
        outcomeRationale:
          "Dividing days by a five-day workweek can undercount calendar weeks when short work spells span more weeks.",
        probeRationale: {
          covered:
            "A partial-week cue can prevent the five-days-equals-one-week conversion.",
          notCovered:
            "The edit still lets the respondent convert workdays instead of counting calendar weeks with any work."
        }
      },
      {
        id: "weeks-full-year-stable",
        text: "A respondent with a stable all-year schedule can map 52 weeks to a recoverable count.",
        provenance: "editorial",
        attributionNote:
          "Based on the ACS 50-plus-week path and partial-week cue.",
        expectedOutcome: "covered",
        outcomeRationale:
          "A stable all-year worker can recover 52 weeks cleanly.",
        probeRationale: {
          covered:
            "The edit preserves the obvious all-year count.",
          notCovered:
            "The edit should not make a stable 52-week answer harder to report."
        }
      }
    ],
    mechanismQuestion: {
      prompt:
        "Why can How many weeks over the past 52 weeks? produce exact-looking but unstable counts?",
      choices: [
        {
          id: "weeks-exact-count",
          text: "The item required one exact week count from irregular work histories.",
          isCorrect: true,
          explanation:
            "Respondents converted, rounded, or guessed because the requested answer was too exact."
        },
        {
          id: "weeks-subgroup",
          text: "The field combined paid hours, paid days, and weeks of work into one number.",
          isCorrect: false,
          explanation:
            "That would be a broad-bucket problem. The field requests one construct: weeks. The cited issue is the exact-count expectation, not multiple constructs sharing a field."
        },
        {
          id: "weeks-assumption",
          text: "The item assumed every respondent had worked for pay during the year.",
          isCorrect: false,
          explanation:
            "ACS gates this question on prior employment items, so the assumption is upheld upstream. The documented issue is among workers with irregular schedules constructing an exact count, not among non-workers."
        }
      ]
    },
    routeStages: [
      {
        id: "weeks-reality",
        kind: "respondent_reality",
        eyebrow: "Respondent reality",
        title: "Work history is stored unevenly",
        detail:
          "The respondent may remember work spells as jobs, months, days worked, partial weeks, paid leave, or breaks."
      },
      {
        id: "weeks-wording",
        kind: "tested_wording",
        eyebrow: "Tested wording",
        title: "How many weeks over the past 52 weeks?",
        detail:
          "The numeric field asks for one week count, while the instruction says even a few hours in a week should count."
      },
      {
        id: "weeks-break",
        kind: "route_break",
        eyebrow: "Route break",
        title: "Count, convert, or round?",
        detail:
          "The respondent has to decide whether to count calendar weeks, convert months, divide days by five, or round from memory."
      },
      {
        id: "weeks-consequence",
        kind: "data_consequence",
        eyebrow: "Data consequence",
        title: "The number hides its recipe",
        detail:
          "The same clean numeric field can hold a true week count, a conversion, or a rounded guess with different meaning."
      }
    ],
    neighborContrast: {
      pattern: "broad_bucket",
      neighborSpecimenId: "business-industry",
      contrastText:
        "This specimen is forced precision because irregular history must become one exact-looking count. The broad-bucket neighbor is different: one field spans multiple concepts or levels."
    },
    widget: {
      kind: "time_window_slider",
      windows: [
        { id: "past-52-weeks", label: "past 52 weeks", days: 365 },
        { id: "calendar-year", label: "calendar year", days: 365 },
        { id: "months-first", label: "months first", days: 30 },
        { id: "partial-week-cue", label: "partial-week cue", days: 7 }
      ],
      initialWindowId: "past-52-weeks",
      diagnostic: {
        "weeks-not-exactly": { stableWindowIds: ["months-first"] },
        "weeks-rounded-guess": { stableWindowIds: [] },
        "weeks-days-divided": { stableWindowIds: ["partial-week-cue"] },
        "weeks-full-year-stable": {
          stableWindowIds: ["past-52-weeks", "calendar-year", "months-first", "partial-week-cue"]
        }
      }
    },
    probePrompt: "Explore how the reporting window changes the answer recipe.",
    reveal: {
      addresses: {
        revisionDescription:
          "The report recommended sharpening the timeframe and retaining even for a few hours.",
        sourcePageRef: "2016 ACS Content Test sections 4.7.1 and 4.7.3, pp. 100-108"
      },
      remainsUntested: {
        residualRisks: [
          "Multiple jobs, paid leave, intermittent schedules, and proxy knowledge may still produce estimates."
        ],
        claimBoundaryNote
      }
    },
    microCases: [
      {
        id: "weeks-near-arrival",
        kind: "near_transfer",
        context:
          "A commute or work-schedule item asks for one usual arrival time, but the respondent arrived at different times across the week.",
        questionPrompt:
          "Which wording feature would make the answer recipe unstable?",
        wording: "Last week, what time did this person usually arrive at work?",
        pattern: "forced_precision",
        featureChoices: [
          "One exact-looking value is required from variable schedules",
          "A label has several everyday meanings",
          "A previous item changes what Yes means"
        ],
        correctFeatureIndex: 0,
        explanation: "Same pattern: variable arrival times must collapse into one answer."
      },
      {
        id: "weeks-distractor-sump",
        kind: "distractor",
        context:
          "An outage module asks whether a sump pump failed, even though some households do not have a sump pump.",
        questionPrompt:
          "Which wording feature is doing the work in this distractor?",
        wording: "Did your sump pump fail during the outage?",
        pattern: "false_premise",
        featureChoices: [
          "A hidden equipment premise makes No ambiguous",
          "A week count is too exact for memory",
          "A broad bucket hides subgroup detail"
        ],
        correctFeatureIndex: 0,
        explanation: "This is false premise because households without the equipment need a path."
      }
    ],
    source: sourceReceipt(
      censusAgency,
      "2016 ACS Content Test",
      acs2016Title,
      "cognitive_testing",
      "2016",
      "sections 4.7.1 and 4.7.3, pp. 100-108",
      acs2016Url
    )
  }
];

export const workbenchSpecimens: WorkbenchSpecimen[] = authoredWorkbenchSpecimens.map(
  (specimen) => ({
    ...specimen,
    verifiedAgainstSource,
    methodNote: methodNotesById[specimen.id] ?? null
  })
);
