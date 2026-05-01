import type { WorkbenchSpecimen } from "../types/workbench";

const claimBoundaryNote =
  "This is one path the survey team took. Your edit may have addressed the issue differently. We do not validate alternative wording here.";

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
const censusAgency = "U.S. Census Bureau";
const verifiedDate = "2026-04-30";

export const workbenchSpecimens: WorkbenchSpecimen[] = [
  {
    id: "ride-hailing",
    number: "01",
    railLabel: "Ride-hailing",
    pattern: "label_ambiguity",
    patternLabel: "Label ambiguity",
    canonicalLabel: "Lexical ambiguity",
    title: "When a commute label has two mental maps",
    subtitle: "The respondent knows the trip. The category asks them to classify the service.",
    testedWording: "Taxi or ride-hailing services",
    intendedConstruct: "Commute mode or service category.",
    sampleRespondent:
      "A respondent who used an app-based ride to get to work recognizes the trip but still has to decide whether the survey label means app service, taxi, vehicle type, or shared ride.",
    prerequisiteVocab:
      "Label ambiguity: one response label points to more than one plausible meaning, so respondents can classify the same reality by different rules.",
    vignettes: [
      {
        id: "ride-uber-lyft",
        text: "A respondent maps ride-hailing to app-based services such as Uber and Lyft.",
        provenance: "direct_quote",
        citation: {
          reportTitle: acsRound3Title,
          page: "pp. 36-37",
          permalink: acsRound3Url
        },
        expectedOutcome: "covered"
      },
      {
        id: "ride-taxi-only",
        text: "A respondent reads the category as taxis only and does not bring app-based services into the label.",
        provenance: "direct_quote",
        citation: {
          reportTitle: acsRound3Title,
          page: "pp. 36-37",
          permalink: acsRound3Url
        },
        expectedOutcome: "ambiguous"
      },
      {
        id: "ride-shared-ride",
        text: "A participant chose the category because he understood it as a shared ride.",
        provenance: "direct_quote",
        citation: {
          reportTitle: acsRound3Title,
          page: "pp. 36-37",
          permalink: acsRound3Url
        },
        expectedOutcome: "ambiguous"
      },
      {
        id: "ride-lyft-work",
        text: "A participant said he would sometimes take Lyft to work.",
        provenance: "direct_quote",
        citation: {
          reportTitle: acsRound3Title,
          page: "pp. 36-37",
          permalink: acsRound3Url
        },
        expectedOutcome: "covered"
      },
      {
        id: "ride-carpool",
        text: "A respondent rode with a neighbor and hears shared ride as a cue to include the commute.",
        provenance: "editorial",
        citation: {
          reportTitle: acsRound3Title,
          page: "pp. 36-37",
          permalink: acsRound3Url
        },
        attributionNote:
          "Editorial illustration based on the ACS Round 3 finding that one participant mapped ride-hailing to a shared-ride idea.",
        expectedOutcome: "not_covered"
      }
    ],
    mechanismQuestion: {
      prompt: "Which wording feature most likely caused the ride-hailing failure?",
      choices: [
        {
          id: "label-range",
          text: "The label carried several plausible service meanings.",
          isCorrect: true,
          explanation:
            "The trouble sits in the category label itself: app rides, taxis, and shared rides were all live interpretations."
        },
        {
          id: "technical-boundary",
          text: "The item asked respondents to classify a technical vehicle type.",
          isCorrect: false,
          explanation:
            "Vehicle technology is not the contested boundary here. The category is a commute service label."
        },
        {
          id: "missing-filter",
          text: "The item assumed every respondent had used the service.",
          isCorrect: false,
          explanation:
            "The wording does not require service use. It becomes unstable when people who did use a service map the label differently."
        }
      ]
    },
    routeStages: [
      {
        id: "ride-reality",
        kind: "respondent_reality",
        eyebrow: "Respondent reality",
        title: "Used an app-based ride",
        detail: "The trip was a car ride arranged through a ride-hailing service."
      },
      {
        id: "ride-wording",
        kind: "tested_wording",
        eyebrow: "Tested label",
        title: "Taxi or ride-hailing services",
        detail: "The label combines an older service category with a newer one."
      },
      {
        id: "ride-break",
        kind: "route_break",
        eyebrow: "Route break",
        title: "Service, vehicle, or sharing?",
        detail:
          "Some respondents may classify by the service, some by the vehicle, and some by the idea of a shared ride."
      },
      {
        id: "ride-consequence",
        kind: "data_consequence",
        eyebrow: "Data consequence",
        title: "Commute categories can mix mental models",
        detail:
          "The answer can become inconsistent if respondents do not share the intended meaning of ride-hailing."
      }
    ],
    neighborContrast: {
      pattern: "category_boundary_blur",
      contrastText:
        "This is label ambiguity NOT category boundary blur because the unstable feature is the commute-service label, not a technical boundary between vehicle classes."
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
    probePrompt: "Explore how examples change the label's reach.",
    reveal: {
      addresses: {
        revisionDescription:
          "The report recommended naming Uber/Lyft, using app-based ride services, or placing brand-name examples in help text.",
        sourceQuote: 'it might be helpful to specify "Uber/Lyft"',
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
        wording: "Food delivery or courier app service",
        pattern: "label_ambiguity",
        featureChoices: [
          "A label that mixes everyday and platform meanings",
          "A missing eligibility screener",
          "A forced numeric average"
        ],
        correctFeatureIndex: 0,
        explanation:
          "This is the same pattern because courier app service could mean a delivery platform, a courier company, or any person carrying food. It is not false premise because no eligibility state is being hidden."
      },
      {
        id: "ride-distractor-vehicle",
        kind: "distractor",
        wording: "An electric bicycle, a motorized scooter, or another micromobility vehicle",
        pattern: "category_boundary_blur",
        featureChoices: [
          "A broad bucket that asks for too many services",
          "A boundary between neighboring vehicle classes",
          "A prior question that changes the next answer"
        ],
        correctFeatureIndex: 1,
        explanation:
          "This may look like label ambiguity, but the key problem is drawing a boundary between vehicle classes. That makes its category boundary blur."
      }
    ],
    source: {
      agency: censusAgency,
      documentCode: "ACS Round 3",
      reportTitle: acsRound3Title,
      reportType: "cognitive_testing",
      year: "2022",
      sectionOrPage: "sections 2.3.2-2.3.3, pp. 35-38",
      directUrl: acsRound3Url,
      verifiedDate,
      attribution:
        "Source: U.S. Census Bureau, Cognitive Testing for the 2022 ACS Content Test Round 3 Briefing and Recommendations Report (2022), sections 2.3.2-2.3.3, pp. 35-38."
    }
  },
  {
    id: "business-industry",
    number: "02",
    railLabel: "Business",
    pattern: "broad_bucket",
    patternLabel: "Broad bucket",
    canonicalLabel: "Mixed reporting levels",
    title: "When one field holds business and industry",
    subtitle: "The respondent may know both answers, but the prompt makes them choose the level.",
    testedWording: "What kind of business or industry is this?",
    intendedConstruct: "Employer industry or line of business for a job.",
    sampleRespondent:
      "A respondent who works in a hospital can separate the establishment from the broader health care industry, but the single field asks for both at once.",
    prerequisiteVocab:
      "Broad bucket: one response field spans more than one construct or level of detail, so unlike answers can all look responsive.",
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
        expectedOutcome: "ambiguous"
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
        expectedOutcome: "ambiguous"
      },
      {
        id: "industry-grocery-store",
        text: "A respondent writes grocery store for a job in a supermarket.",
        provenance: "editorial",
        citation: {
          reportTitle: cpsSelfResponseTitle,
          page: "section 3.4.5, pp. 69-75",
          permalink: cpsSelfResponseUrl
        },
        attributionNote:
          "Editorial illustration based on the CPS finding that added examples clarified the type and level of answer wanted.",
        expectedOutcome: "covered"
      },
      {
        id: "industry-job-title",
        text: "A respondent writes cashier because that is the work they did at the business.",
        provenance: "editorial",
        citation: {
          reportTitle: cpsSelfResponseTitle,
          page: "section 3.4.5, pp. 69-75",
          permalink: cpsSelfResponseUrl
        },
        attributionNote:
          "Editorial illustration based on the CPS finding that respondents needed clearer examples of the expected answer type.",
        expectedOutcome: "not_covered"
      },
      {
        id: "industry-business-name",
        text: "A respondent writes the employer's name instead of the kind of business.",
        provenance: "editorial",
        citation: {
          reportTitle: cpsSelfResponseTitle,
          page: "section 3.4.5, pp. 69-75",
          permalink: cpsSelfResponseUrl
        },
        attributionNote:
          "Editorial illustration based on the CPS recommendation to add examples that show the level of detail expected.",
        expectedOutcome: "ambiguous"
      }
    ],
    mechanismQuestion: {
      prompt: "Which wording feature most likely caused the business-or-industry failure?",
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
            "No numeric estimate is being compressed here. The failure is about the scope of an open response bucket."
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
        detail: "A job can sit inside a named establishment, a broad industry, and a specific service line."
      },
      {
        id: "industry-wording",
        kind: "tested_wording",
        eyebrow: "Tested wording",
        title: "What kind of business or industry is this?",
        detail: "The field names two related levels without saying which answer shape to use."
      },
      {
        id: "industry-break",
        kind: "route_break",
        eyebrow: "Route break",
        title: "Which level belongs in the box?",
        detail:
          "Respondents may answer with the establishment, the sector, the service, or the work activity."
      },
      {
        id: "industry-consequence",
        kind: "data_consequence",
        eyebrow: "Data consequence",
        title: "Unlike answers can look complete",
        detail:
          "The data can contain usable-looking text that still mixes levels the survey meant to keep interpretable."
      }
    ],
    neighborContrast: {
      pattern: "forced_precision",
      contrastText:
        "This is broad bucket NOT forced precision because the field is too wide across constructs; it is not asking for one numeric value from variable time."
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
        "industry-business-name": { cleanAt: [1] }
      }
    },
    probePrompt: "Explore where the answer bucket needs a boundary.",
    reveal: {
      addresses: {
        revisionDescription:
          "The report recommended adding examples to clarify the type and level of detail expected.",
        sourceQuote: "help respondents understand the level of detail",
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
    source: {
      agency: censusAgency,
      documentCode: "RSM2025-03",
      reportTitle: cpsSelfResponseTitle,
      reportType: "cognitive_testing",
      year: "2025",
      sectionOrPage: "section 3.4.5, pp. 69-75",
      directUrl: cpsSelfResponseUrl,
      verifiedDate,
      attribution:
        "Source: U.S. Census Bureau, Cognitive Testing for an Internet Self-Response Mode of the Current Population Survey: Findings and Recommendations (2025), section 3.4.5, pp. 69-75."
    }
  },
  {
    id: "refrigerated-medicine",
    number: "03",
    railLabel: "Medicine",
    pattern: "false_premise",
    patternLabel: "False premise",
    canonicalLabel: "Inappropriate assumption",
    title: "When No hides no medicine",
    subtitle: "A yes/no item can assume the household has the thing it asks about.",
    testedWording: "Did any refrigerated medicine spoil?",
    intendedConstruct: "Spoilage of refrigerated medicine during a power outage.",
    sampleRespondent:
      "A respondent who does not keep refrigerated medicine can answer No even though a No refrigerated medicine option is present. The survey still has to distinguish a substantive No from a missed applicability cue.",
    prerequisiteVocab:
      "False premise: a question assumes a condition is true, or makes the inapplicable path weak enough that No absorbs it.",
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
        expectedOutcome: "ambiguous"
      },
      {
        id: "medicine-volunteers-no-med",
        text: "A respondent notices the No refrigerated medicine option and uses it directly.",
        provenance: "editorial",
        citation: {
          reportTitle: ahs2023Title,
          page: "section 4.5.4, pp. 58-59",
          permalink: ahs2023Url
        },
        attributionNote:
          "Editorial illustration based on the AHS 2023 OUTMED recommendation to keep the No refrigerated medicine option for respondents who volunteer that information.",
        expectedOutcome: "covered"
      },
      {
        id: "medicine-spoiled",
        text: "A respondent had refrigerated medicine and it spoiled during the outage.",
        provenance: "editorial",
        citation: {
          reportTitle: ahs2023Title,
          page: "section 4.5.4, pp. 58-59",
          permalink: ahs2023Url
        },
        attributionNote:
          "Editorial illustration based on the AHS 2023 OUTMED construct: spoilage of refrigerated medicine during an outage.",
        expectedOutcome: "covered"
      },
      {
        id: "medicine-did-not-spoil",
        text: "A respondent had refrigerated medicine, kept it cold, and no medicine spoiled.",
        provenance: "editorial",
        citation: {
          reportTitle: ahs2023Title,
          page: "section 4.5.4, pp. 58-59",
          permalink: ahs2023Url
        },
        attributionNote:
          "Editorial illustration based on the AHS 2023 OUTMED distinction between substantive No and no refrigerated medicine.",
        expectedOutcome: "covered"
      },
      {
        id: "medicine-not-outage",
        text: "A respondent had refrigerated medicine spoil after a refrigerator problem unrelated to a power outage.",
        provenance: "editorial",
        citation: {
          reportTitle: ahs2023Title,
          page: "section 4.5.4, pp. 58-59",
          permalink: ahs2023Url
        },
        attributionNote:
          "Editorial illustration based on the AHS 2023 OUTMED recommendation to add the timeframe and as-a-result-of-a-power-outage wording.",
        expectedOutcome: "not_covered"
      }
    ],
    mechanismQuestion: {
      prompt: "Which wording feature most likely caused the refrigerated-medicine failure?",
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
        detail: "Some households do not keep medicine that depends on refrigeration, and may still answer No."
      },
      {
        id: "medicine-wording",
        kind: "tested_wording",
        eyebrow: "Tested wording",
        title: "Did any refrigerated medicine spoil?",
        detail: "The original item offered Yes, No, and No refrigerated medicine."
      },
      {
        id: "medicine-break",
        kind: "route_break",
        eyebrow: "Route break",
        title: "No response or missed inapplicable option?",
        detail:
          "When respondents do not volunteer the inapplicable state, No can still absorb households with no refrigerated medicine."
      },
      {
        id: "medicine-consequence",
        kind: "data_consequence",
        eyebrow: "Data consequence",
        title: "No loses its denominator",
        detail:
          "Without a follow-up after No, the result can mix households with no damage and households outside the construct."
      }
    ],
    neighborContrast: {
      pattern: "sequence_overlap",
      contrastText:
        "This is false premise NOT sequence overlap because the failure is a missing applicability path, not a previous answer leaking into the next item."
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
        sourceQuote: "recommend a follow-up question for respondents who answer “no”",
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
    source: {
      agency: censusAgency,
      documentCode: "RSM2022-11",
      reportTitle: ahs2023Title,
      reportType: "cognitive_testing",
      year: "2022",
      sectionOrPage: "section 4.5.4 OUTMED, pp. 58-59",
      directUrl: ahs2023Url,
      verifiedDate,
      attribution:
        "Source: U.S. Census Bureau, Cognitive Pretesting of 2023 American Housing Survey Modules (2022), section 4.5.4 OUTMED, pp. 58-59."
    }
  },
  {
    id: "electric-vehicle-type",
    number: "04",
    railLabel: "EV type",
    pattern: "category_boundary_blur",
    patternLabel: "Category boundary blur",
    canonicalLabel: "Overlapping or vague categories",
    title: "When everyday categories blur technical ones",
    subtitle: "People may classify a vehicle by marketing language, fuel source, or charging behavior.",
    testedWording: "Another type of electric vehicle?",
    intendedConstruct: "Vehicle technology type.",
    sampleRespondent:
      "A respondent who owns or recognizes a hybrid vehicle may sort it by whether it plugs in, whether it uses gasoline, or whether it feels electric in everyday speech.",
    prerequisiteVocab:
      "Category boundary blur: neighboring classes use overlapping features, so respondents cannot tell which side their case belongs on.",
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
        expectedOutcome: "ambiguous"
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
        expectedOutcome: "not_covered"
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
        expectedOutcome: "ambiguous"
      },
      {
        id: "ev-battery-only",
        text: "A respondent has a battery-only vehicle that charges from an outlet and uses no gasoline.",
        provenance: "editorial",
        citation: {
          reportTitle: acsRound12Title,
          page: "pp. 113-114 and 272-273",
          permalink: acsRound12Url
        },
        attributionNote:
          "Editorial illustration based on the ACS electric-vehicle distinction between plug-in and hybrid vehicle types.",
        expectedOutcome: "covered"
      },
      {
        id: "ev-plug-in-hybrid",
        text: "A respondent has a plug-in hybrid that charges from an outlet and also uses gasoline.",
        provenance: "editorial",
        citation: {
          reportTitle: acsRound12Title,
          page: "pp. 113-114 and 272-273",
          permalink: acsRound12Url
        },
        attributionNote:
          "Editorial illustration based on the ACS finding that plug-in and hybrid boundaries were blurred by respondents.",
        expectedOutcome: "ambiguous"
      }
    ],
    mechanismQuestion: {
      prompt: "Which wording feature most likely caused the electric-vehicle failure?",
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
          text: "The label was unfamiliar but named only one possible class.",
          isCorrect: false,
          explanation:
            "The issue is not just an unfamiliar term. The classes themselves overlap under everyday vehicle reasoning."
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
        detail: "Everyday vehicle categories can be organized by different features."
      },
      {
        id: "ev-wording",
        kind: "tested_wording",
        eyebrow: "Tested wording",
        title: "Another type of electric vehicle",
        detail:
          "The first version asked respondents whether a non-plug-in hybrid belonged under another electric vehicle."
      },
      {
        id: "ev-break",
        kind: "route_break",
        eyebrow: "Route break",
        title: "The boundary is not obvious",
        detail:
          "Respondents may treat electric as plug-in only, blur plug-ins and hybrids, or misread the line as another vehicle type."
      },
      {
        id: "ev-consequence",
        kind: "data_consequence",
        eyebrow: "Data consequence",
        title: "Vehicle type may be mapped inconsistently",
        detail: "A familiar category can still fail when everyday and technical classification rules diverge."
      }
    ],
    neighborContrast: {
      pattern: "label_ambiguity",
      contrastText:
        "This is category boundary blur NOT label ambiguity because the uncertainty is where plug-in, hybrid, gasoline, and electric classes divide, not only what one label means."
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
        "ev-plug-in-hybrid": { cleanFeatureIds: ["plugs-in", "gas-and-battery"] }
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
    source: {
      agency: censusAgency,
      documentCode: "ACS Round 1/2",
      reportTitle: acsRound12Title,
      reportType: "cognitive_testing",
      year: "2022",
      sectionOrPage: "pp. 113-114 and 272-273",
      directUrl: acsRound12Url,
      verifiedDate,
      attribution:
        "Source: U.S. Census Bureau, 2022 ACS Content Test: Round 1 and Round 2 Cognitive Testing Results (2022), pp. 113-114 and 272-273."
    },
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
    canonicalLabel: "Question-order carryover",
    title: "When the previous answer leaks into the next category",
    subtitle: "A response option can fail because of the question sequence around it.",
    testedWording: "Through some other advertising by the owner?",
    intendedConstruct: "Housing-search source or route.",
    sampleRespondent:
      "A respondent who already reported an internet listing can still see the same listing as owner advertising when the owner posted it.",
    prerequisiteVocab:
      "Sequence overlap: a prior item changes how the next response option is interpreted, so the same event can fit twice.",
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
        expectedOutcome: "ambiguous"
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
        expectedOutcome: "ambiguous"
      },
      {
        id: "owner-yard-sign",
        text: "A respondent found the home through a sign placed by the owner, not through an internet site.",
        provenance: "editorial",
        citation: {
          reportTitle: ahs2025Title,
          page: "section 4.8.7 RMOVHS, pp. 98-99",
          permalink: ahs2025Url
        },
        attributionNote:
          "Editorial illustration based on the RMOVHS owner-advertising category after the internet-site question.",
        expectedOutcome: "covered"
      },
      {
        id: "owner-agent-listing",
        text: "A respondent found the home through an agent's listing, with no owner advertising involved.",
        provenance: "editorial",
        citation: {
          reportTitle: ahs2025Title,
          page: "section 4.8.7 RMOVHS, pp. 98-99",
          permalink: ahs2025Url
        },
        attributionNote:
          "Editorial illustration based on the RMOVHS need to separate internet listings from owner advertising routes.",
        expectedOutcome: "not_covered"
      },
      {
        id: "owner-craigslist-owner",
        text: "A respondent found the home through a Craigslist post written by the owner and already counted the internet site.",
        provenance: "editorial",
        citation: {
          reportTitle: ahs2025Title,
          page: "section 4.8.7 RMOVHS, pp. 98-99",
          permalink: ahs2025Url
        },
        attributionNote:
          "Editorial illustration based on the RMOVHS finding that an internet listing can also feel like owner advertising.",
        expectedOutcome: "ambiguous"
      }
    ],
    mechanismQuestion: {
      prompt: "Which wording feature most likely caused the owner-advertising failure?",
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
          text: "The question assumed every respondent saw owner advertising.",
          isCorrect: false,
          explanation:
            "Respondents can answer No. The trouble is whether a prior Yes already covered the same event."
        }
      ]
    },
    routeStages: [
      {
        id: "owner-reality",
        kind: "respondent_reality",
        eyebrow: "Respondent reality",
        title: "One listing, multiple labels",
        detail: "The same housing listing can feel like an internet site and owner advertising."
      },
      {
        id: "owner-wording",
        kind: "tested_wording",
        eyebrow: "Tested label",
        title: "Some other advertising by the owner",
        detail: "The item appears after another internet-site question."
      },
      {
        id: "owner-break",
        kind: "route_break",
        eyebrow: "Route break",
        title: "Does this count again?",
        detail: "The previous answer changes how the respondent interprets the next category."
      },
      {
        id: "owner-consequence",
        kind: "data_consequence",
        eyebrow: "Data consequence",
        title: "Sequence can create overlap",
        detail:
          "If respondents double-count or reinterpret the same event, the category no longer cleanly separates search routes."
      }
    ],
    neighborContrast: {
      pattern: "broad_bucket",
      contrastText:
        "This is sequence overlap NOT broad bucket because the overlap is created by adjacent questions, not by one oversized response field."
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
        sourceQuote: "Please answer Yes to all options that helped you to find your home.",
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
    source: {
      agency: censusAgency,
      documentCode: "RSM2024-11",
      reportTitle: ahs2025Title,
      reportType: "cognitive_testing",
      year: "2024",
      sectionOrPage: "section 4.8.7 RMOVHS, pp. 98-99",
      directUrl: ahs2025Url,
      verifiedDate,
      attribution:
        "Source: U.S. Census Bureau, Cognitive Pretesting of 2025 American Housing Survey Modules (2024), section 4.8.7 RMOVHS, pp. 98-99."
    }
  },
  {
    id: "usual-hours",
    number: "06",
    railLabel: "Usual hours",
    pattern: "forced_precision",
    patternLabel: "Forced precision",
    canonicalLabel: "Assumes constant behavior",
    title: "When usual hours demand one number",
    subtitle: "The item creates aggregation strain: variable weeks have to become a single usual-hours answer.",
    testedWording: "How many hours per week do you USUALLY work at your <MAIN> job?",
    intendedConstruct: "Usual weekly hours at the respondent's main job.",
    sampleRespondent:
      "A respondent whose hours change from week to week can remember several real schedules, but the item asks those memories to collapse into one usual number.",
    prerequisiteVocab:
      "Forced precision: the wording requires a single exact-looking answer from a reality that is variable, episodic, or only partly stable.",
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
        expectedOutcome: "ambiguous"
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
        expectedOutcome: "ambiguous"
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
        expectedOutcome: "ambiguous"
      },
      {
        id: "hours-stable-forty",
        text: "A respondent works the same forty-hour schedule each week.",
        provenance: "editorial",
        citation: {
          reportTitle: cpsSelfResponseTitle,
          page: "section 3.4.2, pp. 49-54",
          permalink: cpsSelfResponseUrl
        },
        attributionNote:
          "Editorial illustration based on the CPS usual-hours construct, where stable schedules make the single answer recoverable.",
        expectedOutcome: "covered"
      },
      {
        id: "hours-no-usual-week",
        text: "A respondent's hours swing between short and long weeks with no week that feels usual.",
        provenance: "editorial",
        citation: {
          reportTitle: cpsSelfResponseTitle,
          page: "section 3.4.2, pp. 49-54",
          permalink: cpsSelfResponseUrl
        },
        attributionNote:
          "Editorial illustration based on the CPS finding that irregular workers collapsed separately remembered weeks into one number.",
        expectedOutcome: "not_covered"
      }
    ],
    mechanismQuestion: {
      prompt: "Which wording feature most likely caused the usual-hours failure?",
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
          text: "The field mixed business type and industry level.",
          isCorrect: false,
          explanation:
            "That is a broad-bucket problem. Here the construct is hours, and the strain is numeric aggregation."
        },
        {
          id: "missing-na",
          text: "The item lacked a not-applicable response for people without jobs.",
          isCorrect: false,
          explanation:
            "The cited failure concerns workers with irregular schedules, not respondents outside the job path."
        }
      ]
    },
    routeStages: [
      {
        id: "hours-reality",
        kind: "respondent_reality",
        eyebrow: "Respondent reality",
        title: "Weeks do not match",
        detail: "A worker may have several recent week patterns rather than one stable schedule."
      },
      {
        id: "hours-wording",
        kind: "tested_wording",
        eyebrow: "Tested wording",
        title: "How many hours per week do you USUALLY work?",
        detail: "The item asks for one number that represents usual weekly hours."
      },
      {
        id: "hours-break",
        kind: "route_break",
        eyebrow: "Route break",
        title: "Average, mode, or recent pattern?",
        detail:
          "Respondents may average across weeks, choose the most common week, or anchor on a recent schedule."
      },
      {
        id: "hours-consequence",
        kind: "data_consequence",
        eyebrow: "Data consequence",
        title: "The number can hide its recipe",
        detail:
          "A clean numeric answer may mask different aggregation rules used by respondents with variable schedules."
      }
    ],
    neighborContrast: {
      pattern: "broad_bucket",
      contrastText:
        "This is forced precision NOT broad bucket because the pressure is a single usual-hours number from variable weeks, not a broad open response scope."
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
        sourceQuote: "found to cause confusion among some participants",
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
    source: {
      agency: censusAgency,
      documentCode: "RSM2025-03",
      reportTitle: cpsSelfResponseTitle,
      reportType: "cognitive_testing",
      year: "2025",
      sectionOrPage: "section 3.4.2, pp. 49-54",
      directUrl: cpsSelfResponseUrl,
      verifiedDate,
      attribution:
        "Source: U.S. Census Bureau, Cognitive Testing for an Internet Self-Response Mode of the Current Population Survey: Findings and Recommendations (2025), section 3.4.2, pp. 49-54."
    }
  }
];
