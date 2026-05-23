import type { FailurePattern, WorkbenchSpecimen } from "../types/workbench";

const canonicalSubtitleByPattern = {
  label_ambiguity: "Same words, several meanings",
  broad_bucket: "One answer space accepts answers at several levels",
  false_premise: "Question assumes a condition that may not hold",
  category_boundary_blur: "Nearby categories lack a clear rule",
  sequence_overlap: "Earlier question changes how the next answer is read",
  forced_precision: "One exact answer where reality varies"
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
const cpsMoveReasonsTitle = "ASEC User Note: Revised: Reason for Move Write-In Expansion";
const cpsMoveReasonsUrl =
  "https://www.census.gov/programs-surveys/cps/technical-documentation/user-notes/geographic-mobility-user-notes/2019-03.html";
const ntia2023Title =
  "Cognitive Pretesting of the National Telecommunications and Information Administration 2023 Internet Use Survey";
const ntia2023Url =
  "https://www2.census.gov/library/working-papers/2024/adrm/cbsm/rsm2024-10.pdf";
const acs2016Title =
  "Cognitive Testing of the 2016 American Community Survey Content Test Items: Briefing Report for Round 1 Interviews";
const acs2016Url =
  "https://www.census.gov/content/dam/Census/library/working-papers/2016/acs/2016_Westat_02.pdf";
const censusAgency = "U.S. Census Bureau";
const retrievalDate = "2026-05-01";

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
      "This example shows label ambiguity because app-based ride, taxi, and passenger-sharing meanings can all come from the same answer-choice words.",
    whatOmitted:
      "It leaves out the broader list of commute options and any claim about downstream travel estimates."
  },
  "business-industry": {
    whyHere:
      "This example shows the broad bucket pattern because workplace type, industry, product line, and work activity can all look acceptable in one answer space.",
    whatOmitted:
      "It leaves out occupation coding questions and the rest of the Current Population Survey flow around the item."
  },
  "refrigerated-medicine": {
    whyHere:
      "This example shows a false premise because \"No\" can hide both no spoilage and no refrigerated medicine.",
    whatOmitted:
      "It leaves out the rest of the outage section in the same survey and does not estimate how common either answer meaning is."
  },
  "electric-vehicle-type": {
    whyHere:
      "This example shows category boundary blur because everyday electric-vehicle labels and technical classes do not line up cleanly.",
    whatOmitted:
      "It leaves out a validated EV category rewrite and any claim about which vehicle categories should replace the tested wording."
  },
  "owner-advertising": {
    whyHere:
      "This example shows sequence overlap because the earlier internet-listing question changes how later 'other advertising' is read.",
    whatOmitted:
      "It leaves out the full housing-search section and does not model which advertising channel actually caused a sale."
  },
  "usual-hours": {
    whyHere:
      "This example shows forced precision because changing weekly schedules are compressed into one usual-hours number.",
    whatOmitted:
      "It leaves out validation of alternate time windows and does not claim that any one window is the correct replacement."
  },
  "notebook-computer": {
    whyHere:
      "This example shows label ambiguity because \"notebook\" sends some people toward non-laptop device meanings before they answer \"Yes\" or \"No\".",
    whatOmitted:
      "It leaves out the broader list of devices in the same Internet Use Survey and any claim about generation-level device adoption rates."
  },
  "move-reason-catchall": {
    whyHere:
      "This example shows the broad bucket pattern because a generic other reason can hide a concrete moving reason unless the form collects and uses write-in detail.",
    whatOmitted:
      "It leaves out the full CPS ASEC edit and implementation history and does not claim the write-in expansion changed every reason-for-move estimate."
  },
  "sump-pump": {
    whyHere:
      "This example shows a false premise because \"No\" can absorb no equipment, no pump failure, and no flooding inside one yes/no question.",
    whatOmitted:
      "It leaves out the rest of the outage section in the same survey and does not estimate how common no-pump households are."
  },
  "tv-connected-devices": {
    whyHere:
      "This example shows category boundary blur because smart TVs, streaming boxes, game consoles, and connected laptops can all play through a TV while belonging to different everyday device categories.",
    whatOmitted:
      "It leaves out a validated replacement taxonomy and does not claim which connected-device list should ship in future Internet Use Survey rounds."
  },
  "avoid-natural-disasters": {
    whyHere:
      "This example shows sequence overlap because a yes/no reasons series can make \"Yes\" feel like the main reason even when the survey wants any influence.",
    whatOmitted:
      "It leaves out the rest of the AHS moving-reasons module and does not model how often secondary motives drive moves."
  },
  "acs-weeks-worked": {
    whyHere:
      "This example shows forced precision because irregular work histories are compressed into one exact-looking week count.",
    whatOmitted:
      "It leaves out validation of any specific replacement window and does not claim the ACS partial-week cue solved the problem."
  }
};

/* Real respondents' verbatim words, read off the cited PDFs (page noted) and
   confirmed character-for-character before shipping. This is the un-replicable
   layer: a model can paraphrase a finding, but it can't hand you a real
   person's confused sentence. Surfaced as a quiet pulled quote in the reveal,
   with light attribution (survey + year) — realness as delight, not a citation
   parade. Examples without a vivid, on-point respondent sentence get none. */
const verbatimById: Partial<
  Record<string, NonNullable<WorkbenchSpecimen["verbatim"]>>
> = {
  // CPS RSM2025-03, p.71 (participant P505)
  "business-industry": {
    quote:
      "It is asking what kind of business or industry is this, which is two different questions … the business is a hospital and the industry is health care.",
    attribution: "CPS cognitive test, 2025"
  },
  // CPS RSM2025-03, p.55 (participant P1124)
  "usual-hours": {
    quote:
      "Sometimes I work a lot during the week and sometimes not at all … it varies … This is more of an average.",
    attribution: "CPS cognitive test, 2025"
  },
  // AHS RSM2024-11, p.99 (RMOVHS findings)
  "owner-advertising": {
    quote: "I just said I found it on Zillow.",
    attribution: "AHS pretest, 2024"
  },
  // ACS Content Test R3 (Wilson 02), p.38
  "ride-hailing": {
    quote:
      "I don't have a car readily available, so I would need to use Lyft to get to and from jobs.",
    attribution: "ACS Content Test, 2022"
  },
  // NTIA Internet Use Survey pretest, RSM2022-08, p.10
  "notebook-computer": {
    quote:
      "Like a Chromebook. Very small thin and light. Not a tablet, but not a laptop either.",
    attribution: "NTIA Internet Use Survey pretest, 2022"
  },
  // NTIA 2023 Internet Use Survey pretest, RSM2024-10, p.17
  "tv-connected-devices": {
    quote: "We do have an Apple TV box but not a smart TV. Does that answer your question?",
    attribution: "NTIA Internet Use Survey pretest, 2024"
  },
  // ACS Content Test R1/2 (Wilson 01), p.114
  "electric-vehicle-type": {
    quote:
      "I don't really think of it as an electric vehicle because it does not plug in. It is just a regular hybrid that needs gas and has one of those battery things.",
    attribution: "ACS Content Test, 2022"
  },
  // AHS RSM2024-11, p.98 (WMDISAS findings)
  "avoid-natural-disasters": {
    quote:
      "It was a small factor, but was it the primary factor? No … it wasn't the primary reason, it was part of the reason, because I thought about floods.",
    attribution: "AHS pretest, 2024"
  },
  // 2016 ACS Content Test (Westat 02), p.113 (case 510055, on a household member)
  "acs-weeks-worked": {
    quote:
      "It's a bit difficult because it varies a lot. I just took a rounded guess.",
    attribution: "ACS Content Test, 2016"
  }
};

const authoredWorkbenchSpecimens: Array<
  Omit<WorkbenchSpecimen, "methodNote" | "verbatim">
> = [
  {
    id: "ride-hailing",
    number: "01",
    railLabel: "Ride-hailing",
    fieldGuideLinkLabel: "Ride-hailing label",
    pattern: "label_ambiguity",
    patternLabel: "Label ambiguity",
    canonicalSubtitle: canonicalSubtitleByPattern.label_ambiguity,
    canonicalCitations: canonicalCitationByPattern.label_ambiguity,
    title: "When one travel option can mean app ride, carpool, or bike share",
    answerFrame: {
      eyebrow: "ACS means-of-transportation item",
      prompt: "Using this list, LAST WEEK, how did you USUALLY get to work?",
      context: [
        "The respondent chooses one main commute mode from a transportation list.",
        "The worked example isolates the response option that was probed for ride-hailing comprehension."
      ],
      targetKind: "response_option",
      targetLabel: "Highlighted answer choice",
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
      methodNote:
        "The source also discusses working-from-home placement. This example narrows the task to the ride-hailing label."
    },
    source: sourceReceipt(
      censusAgency,
      "ACS Round 3",
      acsRound3Title,
      "cognitive_testing",
      "2022",
      "sections 2.3.2-2.3.3, pp. 35-38",
      acsRound3Url
    ),
  },
  {
    id: "business-industry",
    number: "02",
    railLabel: "Business",
    fieldGuideLinkLabel: "Business/industry field",
    pattern: "broad_bucket",
    patternLabel: "Broad bucket",
    canonicalSubtitle: canonicalSubtitleByPattern.broad_bucket,
    canonicalCitations: canonicalCitationByPattern.broad_bucket,
    title: "When one field holds business and industry",
    answerFrame: {
      eyebrow: "CPS employment-details field",
      prompt: "What kind of business or industry is this?",
      context: [
        "The item is a text-entry field for a job held during the CPS reference period.",
        "The instruction asks for the main activity, product, or service provided where employed."
      ],
      targetKind: "text_field",
      targetLabel: "Highlighted answer field",
      targetText: "Text field for kind of business or industry",
      responseOptions: [
        {
          id: "industry-field",
          text: "Text entry: main activity, product, or service provided where employed",
          isTarget: true
        }
      ],
      methodNote:
        "The source's Round 2 examples clarified answer level; this worked example focuses on the field's broad response task."
    },
    source: sourceReceipt(
      censusAgency,
      "RSM2025-03",
      cpsSelfResponseTitle,
      "cognitive_testing",
      "2025",
      "section 3.4.5, pp. 69-75",
      cpsSelfResponseUrl
    ),
  },
  {
    id: "refrigerated-medicine",
    number: "03",
    railLabel: "Medicine",
    fieldGuideLinkLabel: "Refrigerated medicine yes/no",
    pattern: "false_premise",
    patternLabel: "False premise",
    canonicalSubtitle: canonicalSubtitleByPattern.false_premise,
    canonicalCitations: canonicalCitationByPattern.false_premise,
    title: "When \"No\" can mean \"no refrigerated medicine\"",
    answerFrame: {
      eyebrow: "AHS outage-effects item",
      prompt: "During the outage period, did any refrigerated medicine spoil?",
      context: [
        "The item is asked in a power-outage module.",
        "The answer choices must distinguish medicine that did not spoil from households without refrigerated medicine."
      ],
      targetKind: "yes_no_path",
      targetLabel: "Highlighted answer choices",
      targetText: "Yes / No / No refrigerated medicine answer choices",
      responseOptions: [
        { id: "yes", text: "Yes", isTarget: true },
        { id: "no", text: "No", isTarget: true },
        { id: "no-medicine", text: "No refrigerated medicine", isTarget: true }
      ],
      methodNote:
        "The source recommended keeping the no-medicine option and adding a follow-up after No because some respondents did not volunteer the inapplicable state."
    },
    source: sourceReceipt(
      censusAgency,
      "RSM2022-11",
      ahs2023Title,
      "cognitive_testing",
      "2022",
      "section 4.5.4 OUTMED, pp. 54-55",
      ahs2023Url
    ),
  },
  {
    id: "electric-vehicle-type",
    number: "04",
    railLabel: "EV type",
    fieldGuideLinkLabel: "Electric-vehicle type rule",
    pattern: "category_boundary_blur",
    patternLabel: "Category boundary blur",
    canonicalSubtitle: canonicalSubtitleByPattern.category_boundary_blur,
    canonicalCitations: canonicalCitationByPattern.category_boundary_blur,
    title: "When everyday categories blur technical ones",
    answerFrame: {
      eyebrow: "ACS electric-vehicle sequence",
      prompt: "Are any of the following types of electric vehicles kept at home for use by members of this household?",
      context: [
        "Version 1 asked first about a plug-in electric vehicle.",
        "The worked example isolates the second response item, which was meant to capture other electric vehicles such as hybrids."
      ],
      targetKind: "response_option",
      targetLabel: "Highlighted answer choice",
      targetText: "Another type of electric vehicle?",
      responseOptions: [
        { id: "plug-in", text: "A plug-in electric vehicle?" },
        { id: "another-ev", text: "Another type of electric vehicle?", isTarget: true }
      ],
      methodNote:
        "The later version named plug-in electric vehicle and hybrid electric vehicle directly. This example evaluates the earlier broader label."
    },
    source: sourceReceipt(
      censusAgency,
      "ACS Round 1/2",
      acsRound12Title,
      "cognitive_testing",
      "2022",
      "pp. 113-114 and 272-273",
      acsRound12Url
    ),
  },
  {
    id: "owner-advertising",
    number: "05",
    railLabel: "Owner ad",
    fieldGuideLinkLabel: "Owner-advertising sequence",
    pattern: "sequence_overlap",
    patternLabel: "Sequence overlap",
    canonicalSubtitle: canonicalSubtitleByPattern.sequence_overlap,
    canonicalCitations: canonicalCitationByPattern.sequence_overlap,
    title: "When the previous answer leaks into the next category",
    answerFrame: {
      eyebrow: "AHS housing-search sequence",
      prompt: "Did you find your home through any of these ways?",
      context: [
        "The respondent has already answered an internet-site item.",
        "The next item asks whether some other owner advertising also helped."
      ],
      targetKind: "sequence_item",
      targetLabel: "Highlighted answer choice in the series",
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
      methodNote:
        "The issue is not that respondents could not define owner advertising; it is that the same listing can look relevant to two adjacent items."
    },
    source: sourceReceipt(
      censusAgency,
      "RSM2024-11",
      ahs2025Title,
      "cognitive_testing",
      "2024",
      "section 4.8.7 RMOVHS, pp. 99-100",
      ahs2025Url
    ),
  },
  {
    id: "usual-hours",
    number: "06",
    railLabel: "Usual hours",
    fieldGuideLinkLabel: "Usual-hours count",
    pattern: "forced_precision",
    patternLabel: "Forced precision",
    canonicalSubtitle: canonicalSubtitleByPattern.forced_precision,
    canonicalCitations: canonicalCitationByPattern.forced_precision,
    title: "When the \"usual hours\" item turns a varying schedule into one number",
    answerFrame: {
      eyebrow: "CPS usual-hours item",
      prompt: "How many hours per week do you USUALLY work at your main job?",
      context: [
        "The item is asked of respondents who worked during the CPS reference period.",
        "The response is one numeric value for usual weekly hours at the main job."
      ],
      targetKind: "numeric_field",
      targetLabel: "Highlighted answer field",
      targetText: "One usual-hours number",
      responseOptions: [
        { id: "hours", text: "Usual hours worked each week: [number]", isTarget: true }
      ],
      methodNote:
        "Averaging is not automatically wrong. The fit problem is that different respondents may use different counting methods while entering the same clean-looking field."
    },
    source: sourceReceipt(
      censusAgency,
      "RSM2025-03",
      cpsSelfResponseTitle,
      "cognitive_testing",
      "2025",
      "section 3.4.2, pp. 50-56",
      cpsSelfResponseUrl
    ),
  },
  {
    id: "notebook-computer",
    number: "07",
    railLabel: "Notebook",
    fieldGuideLinkLabel: "Laptop-or-notebook label",
    pattern: "label_ambiguity",
    patternLabel: "Label ambiguity",
    canonicalSubtitle: canonicalSubtitleByPattern.label_ambiguity,
    canonicalCitations: canonicalCitationByPattern.label_ambiguity,
    title: "When \"notebook\" stops meaning laptop",
    answerFrame: {
      eyebrow: "NTIA Internet Use Survey device item",
      prompt:
        "What about a laptop or notebook? Do you or does anyone in this household use a laptop or notebook computer?",
      context: [
        "The item asks about household use of a portable personal computer.",
        "Help text defined a laptop as portable with a built-in keyboard and screen."
      ],
      targetKind: "response_option",
      targetLabel: "Highlighted answer choice",
      targetText: "Laptop or notebook computer",
      responseOptions: [
        { id: "yes", text: "Yes, someone uses a laptop or notebook computer", isTarget: true },
        { id: "no", text: "No" }
      ],
      methodNote:
        "The report found laptop was understood, while notebook sent several respondents to tablet-like or lower-function devices."
    },
    source: sourceReceipt(
      censusAgency,
      "RSM2022-08",
      ntia2021Title,
      "cognitive_testing",
      "2022",
      "section 3.1.1, p. 10",
      ntia2021Url
    ),
  },
  {
    id: "move-reason-catchall",
    number: "08",
    railLabel: "Move reasons",
    fieldGuideLinkLabel: "Reason-for-move catch-alls",
    pattern: "broad_bucket",
    patternLabel: "Broad bucket",
    canonicalSubtitle: canonicalSubtitleByPattern.broad_bucket,
    canonicalCitations: canonicalCitationByPattern.broad_bucket,
    title: "When \"Other housing reason\" hides the actual reason",
    answerFrame: {
      eyebrow: "CPS ASEC reason-for-move item",
      prompt: "What was the main reason this person moved?",
      context: [
        "The item asks movers to choose one main reason from family, job, housing, and other categories.",
        "The worked example isolates generic other-reason categories that can hide concrete write-in reasons unless the edit path captures them."
      ],
      targetKind: "response_option",
      targetLabel: "Highlighted catch-all choices",
      targetText: "Other family / other job-related / other housing reason",
      responseOptions: [
        { id: "family", text: "Change in marital status or family reason" },
        { id: "job", text: "New job or job transfer" },
        { id: "housing", text: "Wanted new or better housing" },
        { id: "other-family", text: "Other family reason", isTarget: true },
        { id: "other-job", text: "Other job-related reason", isTarget: true },
        { id: "other-housing", text: "Other housing reason", isTarget: true }
      ],
      methodNote:
        "Census expanded reason-for-move write-ins and recoding so generic other categories could recover more specific moving reasons."
    },
    source: sourceReceipt(
      censusAgency,
      "CPS ASEC User Note",
      cpsMoveReasonsTitle,
      "recommendation_doc",
      "2019",
      "revised March 18, 2019 user note",
      cpsMoveReasonsUrl
    ),
  },
  {
    id: "sump-pump",
    number: "09",
    railLabel: "Sump pump",
    fieldGuideLinkLabel: "Sump-pump applicability",
    pattern: "false_premise",
    patternLabel: "False premise",
    canonicalSubtitle: canonicalSubtitleByPattern.false_premise,
    canonicalCitations: canonicalCitationByPattern.false_premise,
    title: "When flooding assumes the equipment exists",
    answerFrame: {
      eyebrow: "AHS outage flooding item",
      prompt:
        "Did water collect in your basement or crawl space because your sump pump stopped working properly as a result of a power outage?",
      context: [
        "The item includes Yes, No, and No sump pump choices.",
        "The disputed repair was a follow-up after No to distinguish no pump from no pump failure."
      ],
      targetKind: "yes_no_path",
      targetLabel: "Highlighted answer choices",
      targetText: "Yes / No / No sump pump answer choices",
      responseOptions: [
        { id: "yes", text: "Yes", isTarget: true },
        { id: "no", text: "No", isTarget: true },
        { id: "no-pump", text: "No sump pump", isTarget: true }
      ],
      methodNote:
        "The final wording adopted the outage wording but did not adopt the proposed follow-up after No."
    },
    source: sourceReceipt(
      censusAgency,
      "RSM2022-11",
      ahs2023Title,
      "cognitive_testing",
      "2022",
      "section 4.5.8 OUTFLOOD, pp. 57-59",
      ahs2023Url
    ),
  },
  {
    id: "tv-connected-devices",
    number: "10",
    railLabel: "TV devices",
    fieldGuideLinkLabel: "Smart-TV boundary rule",
    pattern: "category_boundary_blur",
    patternLabel: "Category boundary blur",
    canonicalSubtitle: canonicalSubtitleByPattern.category_boundary_blur,
    canonicalCitations: canonicalCitationByPattern.category_boundary_blur,
    title: "When Apple TV may or may not be a TV",
    answerFrame: {
      eyebrow: "NTIA Internet Use Survey TV-connected device item",
      prompt:
        "Do you or does anyone in this household use a smart TV, game or video system, or another device that connects to the Internet and plays through a TV?",
      context: [
        "The item asks about Internet-capable television devices in a household.",
        "The worked example isolates the boundary between a smart TV, an external streaming box, a game console, and other devices that play through a TV."
      ],
      targetKind: "response_option",
      targetLabel: "Highlighted device category",
      targetText: "Smart TV / TV-connected device",
      responseOptions: [
        { id: "smart-tv", text: "Smart TV", isTarget: true },
        { id: "game-system", text: "Game or video system", isTarget: true },
        {
          id: "another-device",
          text: "Another device that connects to the Internet and plays through a TV",
          isTarget: true
        }
      ],
      methodNote:
        "The source documents confusion around whether devices such as Apple TV boxes and touch-screen interpretations belonged in the TV-connected-device item."
    },
    source: sourceReceipt(
      censusAgency,
      "RSM2024-10",
      ntia2023Title,
      "cognitive_testing",
      "2024",
      "section 3.2, pp. 16-18",
      ntia2023Url
    ),
  },
  {
    id: "avoid-natural-disasters",
    number: "11",
    railLabel: "Disasters",
    fieldGuideLinkLabel: "Disaster-avoidance reason series",
    pattern: "sequence_overlap",
    patternLabel: "Sequence overlap",
    canonicalSubtitle: canonicalSubtitleByPattern.sequence_overlap,
    canonicalCitations: canonicalCitationByPattern.sequence_overlap,
    title: "When a list of yes/no reasons makes \"Yes\" feel like the main one",
    answerFrame: {
      eyebrow: "AHS moving-reasons series",
      prompt: "For each reason, answer whether it was a reason you moved.",
      context: [
        "The item appears in a series of yes/no moving-reason questions.",
        "The survey wanted to count any influence, not only the primary reason."
      ],
      targetKind: "sequence_item",
      targetLabel: "Highlighted answer choice in the series",
      targetText: "Avoid natural disasters",
      responseOptions: [
        { id: "other-reasons", text: "Other moving-reason items in the series" },
        { id: "disaster", text: "Did you move to avoid natural disasters?", isTarget: true }
      ],
      methodNote:
        "The report found that the item text was not the main issue; the sequence needed an all-influences instruction."
    },
    source: sourceReceipt(
      censusAgency,
      "RSM2024-11",
      ahs2025Title,
      "cognitive_testing",
      "2024",
      "section 4.8.5 WMDISAS, pp. 92-93",
      ahs2025Url
    ),
  },
  {
    id: "acs-weeks-worked",
    number: "12",
    railLabel: "Weeks",
    fieldGuideLinkLabel: "Weeks-worked count",
    pattern: "forced_precision",
    patternLabel: "Forced precision",
    canonicalSubtitle: canonicalSubtitleByPattern.forced_precision,
    canonicalCitations: canonicalCitationByPattern.forced_precision,
    title: "When the \"weeks worked\" item asks for an exact-looking count",
    answerFrame: {
      eyebrow: "ACS weeks-worked item",
      prompt:
        "Over the past 52 weeks, how many weeks did this person work, even for a few hours, including any paid time off?",
      context: [
        "The answer is a numeric count of weeks worked during a 52-week reference period.",
        "The instruction treats a week as in scope even if the person worked only a few hours."
      ],
      targetKind: "numeric_field",
      targetLabel: "Highlighted answer field",
      targetText: "One numeric weeks-worked count",
      responseOptions: [
        { id: "weeks", text: "Weeks worked: [number]", isTarget: true }
      ],
      methodNote:
        "This example is about the burden and counting method behind an exact-looking number, not about whether annual work-duration data are useful."
    },
    source: sourceReceipt(
      censusAgency,
      "2016 ACS Content Test",
      acs2016Title,
      "cognitive_testing",
      "2016",
      "sections 4.7.1 and 4.7.3, pp. 100-107",
      acs2016Url
    ),
  }
];

export const workbenchSpecimens: WorkbenchSpecimen[] = authoredWorkbenchSpecimens.map(
  (specimen) => ({
    ...specimen,
    methodNote: methodNotesById[specimen.id] ?? null,
    verbatim: verbatimById[specimen.id]
  })
);
