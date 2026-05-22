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
  "ons-kashmiri": {
    whyHere:
      "This example shows the broad bucket pattern because a specific subgroup identity can be routed through a broader Asian/Asian British category or a write-in option.",
    whatOmitted:
      "It leaves out the comparability and parallel-subgroup tradeoffs the ONS report weighed when recommending against the tick-box, which the colophon and Reveal cards summarize separately."
  },
  "sump-pump": {
    whyHere:
      "This example shows a false premise because \"No\" can absorb no equipment, no pump failure, and no flooding inside one yes/no question.",
    whatOmitted:
      "It leaves out the rest of the outage section in the same survey and does not estimate how common no-pump households are."
  },
  "ons-ethnic-group-heading": {
    whyHere:
      "This example shows category boundary blur because a section heading mixes colour and geographic cues, so several headings can look partly right.",
    whatOmitted:
      "It leaves out the full 2011 ethnic-group recommendation set and any claim about which heading order should generalize beyond England and Wales."
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

const authoredWorkbenchSpecimens: Array<
  Omit<WorkbenchSpecimen, "methodNote">
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
      taskPrompt:
        "For each scenario, decide whether this highlighted commute option names the intended paid ride service, could be read multiple ways, or should not include the trip.",
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
      taskPrompt:
        "Judge whether the text field tells this respondent the right level of answer to give.",
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
      taskPrompt:
        "Judge whether these answer choices separate spoilage, no spoilage, and no refrigerated medicine.",
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
      taskPrompt:
        "Judge whether the highlighted item gives each vehicle a clean home, or whether plug-in, hybrid, gasoline, and everyday electric labels compete.",
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
      taskPrompt:
        "Judge whether the highlighted owner-advertising item captures a separate way the home was found, or whether the prior internet-site answer changes its meaning.",
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
      taskPrompt:
        "Judge whether one usual-hours number can be given as-is, or whether the respondent must pick an unstated counting method such as average, most common week, or recent week.",
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
      taskPrompt:
        "Judge whether the label gives the respondent a clear answer for portable-computer use, or whether notebook points to another device family.",
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
    id: "ons-kashmiri",
    number: "08",
    railLabel: "Kashmiri",
    fieldGuideLinkLabel: "Kashmiri write-in vs tick-box",
    pattern: "broad_bucket",
    patternLabel: "Broad bucket",
    canonicalSubtitle: canonicalSubtitleByPattern.broad_bucket,
    canonicalCitations: canonicalCitationByPattern.broad_bucket,
    title: "When a write-in option doesn't replace a visible answer choice",
    answerFrame: {
      eyebrow: "ONS ethnic-group answer architecture",
      prompt: "What is your ethnic group?",
      context: [
        "The comparison concerns whether Kashmiri identity is available as a visible tick-box or only through a broader category and write-in option.",
        "The worked example evaluates the form architecture for reporting a specific subgroup, not the legitimacy of any identity."
      ],
      targetKind: "response_option",
      targetLabel: "Highlighted answer choice",
      targetText: "Visible Kashmiri tick-box or explicit write-in option",
      responseOptions: [
        { id: "heading", text: "Asian / Asian British heading" },
        { id: "broad", text: "Indian or Pakistani broad tick-boxes" },
        { id: "kashmiri", text: "Kashmiri tick-box", isTarget: true },
        { id: "write-in", text: "Any other Asian background, write in", isTarget: true }
      ],
      taskPrompt:
        "Judge whether the answer choices let a Kashmiri respondent report the specific identity cleanly, or whether broad boxes and write-in effort change the recorded answer.",
      methodNote:
        "The source found higher Kashmiri identification with a tick-box, while also weighing comparability and parallel-subgroup tradeoffs."
    },
    source: sourceReceipt(
      onsAgency,
      "ONS Kashmiri",
      onsKashmiriTitle,
      "cognitive_testing",
      "2009",
      "sections 5.1, 6.1, and 6.2, pp. 13, 16-17, 33-34",
      onsKashmiriUrl
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
      taskPrompt:
        "Judge whether these answer choices separate no flooding, no pump, no pump failure, and out-of-scope water causes.",
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
    id: "ons-ethnic-group-heading",
    number: "10",
    railLabel: "Heading",
    fieldGuideLinkLabel: "Ethnic-group section heading",
    pattern: "category_boundary_blur",
    patternLabel: "Category boundary blur",
    canonicalSubtitle: canonicalSubtitleByPattern.category_boundary_blur,
    canonicalCitations: canonicalCitationByPattern.category_boundary_blur,
    title: "When a heading scrambles the category boundary",
    answerFrame: {
      eyebrow: "ONS ethnic-group heading test",
      prompt: "Choose the section and tick-box that best describes your ethnic group.",
      context: [
        "The issue is the section heading that respondents scan before choosing a more specific box.",
        "The tested heading placed African and Caribbean before Black.",
        "This is a navigation boundary: respondents scan headings before they reach the box."
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
        "The ONS recommendation reordered the heading to put Black first; this example focuses on navigation through section cues."
    },
    source: sourceReceipt(
      onsAgency,
      "ONS Ethnic Group",
      onsEthnicGroupTitle,
      "recommendation_doc",
      "2009",
      "section 6.4.3, pp. 36-37",
      onsEthnicGroupUrl
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
      taskPrompt:
        "Judge whether the highlighted Yes answer means any influence or whether the sequence makes it feel like a main-reason answer.",
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
      taskPrompt:
        "Judge whether the respondent can recover one weeks-worked count, or whether the field invites rounding, conversion, or a wrong counting rule.",
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
    methodNote: methodNotesById[specimen.id] ?? null
  })
);

