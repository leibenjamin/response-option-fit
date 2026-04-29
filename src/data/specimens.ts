import type { Specimen } from "../types/specimen";

export const specimens: Specimen[] = [
  {
    id: "ride-hailing",
    number: "01",
    railLabel: "Ride-hailing",
    title: "When a commute label has two mental maps",
    subtitle: "The respondent knows the trip. The category asks them to classify the service.",
    pattern: "label_ambiguity",
    patternLabel: "Label ambiguity",
    testedWording: "Taxi or ride-hailing services",
    respondentReality: "A respondent used Uber or Lyft to get to work.",
    intendedConstruct: "Commute mode or service category.",
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
        detail: "Some respondents may classify by the service, some by the vehicle, and some by the idea of a shared ride."
      },
      {
        id: "ride-consequence",
        kind: "data_consequence",
        eyebrow: "Data consequence",
        title: "Commute categories can mix mental models",
        detail: "The answer can become inconsistent if respondents do not share the intended meaning of ride-hailing."
      }
    ],
    testingFindingSummary:
      "Testing found that respondents varied in how they understood ride-hailing, including interpreting it as Uber/Lyft, taxis, or a general shared-ride idea.",
    dataConsequence:
      "The same real commute can be routed to different survey categories depending on whether the respondent thinks about service type, vehicle type, or sharing arrangement.",
    dataLoss: "shared classification rule",
    repairDirection:
      "Use clearer examples or wording that signals the intended category, such as app-based services like Uber or Lyft, while preserving the official source context.",
    safeTakeaway:
      "A response label can be recognizable and still need examples when the classification rule is not shared.",
    source: {
      reportTitle: "Cognitive Testing for the 2022 ACS Content Test Round 3 Briefing and Recommendations Report",
      year: "2022",
      sectionOrPage: "sections 2.3.2–2.3.3, pp. 35–38",
      directUrl: "https://www.census.gov/content/dam/Census/library/working-papers/2022/acs/2022_Wilson_02.pdf",
      attribution:
        "Source: U.S. Census Bureau, Cognitive Testing for the 2022 ACS Content Test Round 3 Briefing and Recommendations Report (2022), sections 2.3.2–2.3.3, pp. 35–38."
    }
  },
  {
    id: "global-utilities",
    number: "02",
    railLabel: "Utilities",
    title: "When one bill bucket holds too much",
    subtitle: "A household bill can include more than the survey intended to measure.",
    pattern: "broad_bucket",
    patternLabel: "Broad bucket",
    testedWording:
      "How much did this household pay for electricity, gas, basic telephone service, and other utilities in November?",
    respondentReality:
      "A respondent thinks about bundled household bills that may include internet, cable, satellite TV, phone, electricity, gas, water, or other charges.",
    intendedConstruct: "Utility expenses within the intended measurement boundary.",
    routeStages: [
      {
        id: "utilities-reality",
        kind: "respondent_reality",
        eyebrow: "Respondent reality",
        title: "Bills arrive bundled",
        detail: "Household services may be remembered as one payment or package."
      },
      {
        id: "utilities-wording",
        kind: "tested_wording",
        eyebrow: "Tested wording",
        title: "Electricity, gas, telephone, and other utilities",
        detail: "The prompt asks for a single amount across several service types."
      },
      {
        id: "utilities-break",
        kind: "route_break",
        eyebrow: "Route break",
        title: "Included or excluded?",
        detail: "Respondents may include services the survey intended to exclude, especially bundled internet or TV services."
      },
      {
        id: "utilities-consequence",
        kind: "data_consequence",
        eyebrow: "Data consequence",
        title: "The number can be contaminated",
        detail: "One total may blend target utility costs with excluded services, making the resulting amount harder to interpret."
      }
    ],
    testingFindingSummary:
      "Testing found that the global utilities question led many respondents to include items they were told to exclude, such as internet and cable or satellite TV.",
    dataConsequence:
      "A broad numeric bucket can produce a clean dollar value that is not cleanly tied to the intended concept.",
    dataLoss: "clean utility-cost boundary",
    repairDirection:
      "Decompose the question into separate utility categories or make included/excluded services more explicit.",
    safeTakeaway:
      "Sometimes the fix is not a prettier label. It is breaking one broad bucket into smaller measured parts.",
    source: {
      reportTitle:
        "Global Versus Decomposed Questions: How Does Decomposing a Global Utilities Expense Question Impact Data Quality and Respondent Burden?",
      year: "2025",
      sectionOrPage: "Global Utilities Question and results, pp. 3, 7, 11, 14",
      directUrl:
        "https://www.census.gov/content/dam/Census/topics/research/events/dc-aapor-2025/presentation-global-vs-decomposed-questions.pdf",
      attribution:
        "Source: U.S. Census Bureau, Global Versus Decomposed Questions (2025), Global Utilities Question and results, pp. 3, 7, 11, 14."
    }
  },
  {
    id: "power-outage-work",
    number: "03",
    railLabel: "Outage work",
    title: "When yes/no hides not-applicable",
    subtitle: "A yes/no item can assume a condition that some respondents do not have.",
    pattern: "false_premise",
    patternLabel: "False premise",
    testedWording: "Did you [or anyone in your household] miss work?",
    respondentReality:
      "No one in the household had work during the referenced outage period.",
    intendedConstruct: "Work disruption caused by a power outage.",
    routeStages: [
      {
        id: "outage-reality",
        kind: "respondent_reality",
        eyebrow: "Respondent reality",
        title: "No work to miss",
        detail: "The household may not have had anyone working during the period."
      },
      {
        id: "outage-wording",
        kind: "tested_wording",
        eyebrow: "Tested wording",
        title: "Did anyone miss work?",
        detail: "The question asks for a yes/no answer."
      },
      {
        id: "outage-break",
        kind: "route_break",
        eyebrow: "Route break",
        title: "No disruption or not applicable?",
        detail: "A simple No can mix people who had work and were not disrupted with people who did not have work."
      },
      {
        id: "outage-consequence",
        kind: "data_consequence",
        eyebrow: "Data consequence",
        title: "A missing path changes the meaning of No",
        detail: "Without a not-applicable route, the data may understate the distinction between no effect and no exposure."
      }
    ],
    testingFindingSummary:
      "Testing identified that the wording assumed work existed and recommended restoring the outage/time anchor and adding a no-work option.",
    dataConsequence:
      "A yes/no item can collapse a substantive No with a not-applicable state.",
    dataLoss: "distinction between no disruption and not applicable",
    repairDirection:
      "Add the power-outage reference, restore the time anchor, and include a response option for not having work.",
    safeTakeaway:
      "A No answer can be too small to hold not applicable.",
    source: {
      reportTitle: "Cognitive Pretesting of 2023 American Housing Survey Modules",
      year: "2022",
      sectionOrPage: "OUTWORK, pp. 60–61",
      directUrl: "https://www2.census.gov/adrm/CBSM/rsm2022-11.pdf",
      attribution:
        "Source: U.S. Census Bureau, Cognitive Pretesting of 2023 American Housing Survey Modules (2022), OUTWORK, pp. 60–61."
    }
  },
  {
    id: "electric-vehicle-type",
    number: "04",
    railLabel: "EV type",
    title: "When everyday categories blur technical ones",
    subtitle: "People may classify a vehicle by marketing language, fuel source, or charging behavior.",
    pattern: "category_boundary_blur",
    patternLabel: "Category boundary blur",
    testedWording: "A plug-in electric vehicle? A hybrid electric vehicle?",
    respondentReality:
      "A respondent owns or thinks about a vehicle that uses a battery, gasoline, or both.",
    intendedConstruct: "Vehicle technology type.",
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
        title: "Plug-in electric vs. hybrid electric",
        detail: "The survey needs a distinction between types of electric-drive vehicles."
      },
      {
        id: "ev-break",
        kind: "route_break",
        eyebrow: "Route break",
        title: "The boundary is not obvious",
        detail: "Respondents may treat electric as plug-in only, blur plug-ins and hybrids, or misread the line as another vehicle type."
      },
      {
        id: "ev-consequence",
        kind: "data_consequence",
        eyebrow: "Data consequence",
        title: "Vehicle type may be mapped inconsistently",
        detail: "A familiar category can still fail when everyday and technical classification rules diverge."
      }
    ],
    testingFindingSummary:
      "Testing found that respondents blurred plug-in and hybrid categories or interpreted electric vehicle in narrower everyday ways.",
    dataConsequence:
      "Counts by vehicle type may reflect category interpretation as much as vehicle ownership.",
    dataLoss: "stable vehicle-technology category",
    repairDirection:
      "Clarify the classifying feature, especially whether the vehicle plugs in and whether it also uses gasoline.",
    safeTakeaway:
      "A category can be familiar and still need a sharper boundary.",
    source: {
      reportTitle: "2022 ACS Content Test: Round 1 and Round 2 Cognitive Testing Results",
      year: "2022",
      sectionOrPage: "electric-vehicle findings at pp. 113–114 and 272–273",
      directUrl: "https://www.census.gov/content/dam/Census/library/working-papers/2022/acs/2022_Wilson_01.pdf",
      attribution:
        "Source: U.S. Census Bureau, 2022 ACS Content Test: Round 1 and Round 2 Cognitive Testing Results (2022), electric-vehicle findings at pp. 113–114 and 272–273."
    }
  },
  {
    id: "owner-advertising",
    number: "05",
    railLabel: "Owner ad",
    title: "When the previous answer leaks into the next category",
    subtitle: "A response option can fail because of the question sequence around it.",
    pattern: "sequence_overlap",
    patternLabel: "Sequence overlap",
    testedWording: "Through some other advertising by the owner?",
    respondentReality:
      "A respondent already reported finding a home through an internet listing site such as Zillow or Craigslist.",
    intendedConstruct: "Housing-search source or route.",
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
        detail: "If respondents double-count or reinterpret the same event, the category no longer cleanly separates search routes."
      }
    ],
    testingFindingSummary:
      "Testing found that respondents could reinterpret an internet listing as other owner advertising, and that the sequence felt awkward.",
    dataConsequence:
      "The same housing-search event may be counted across overlapping categories.",
    dataLoss: "separation between internet listing and owner-advertising route",
    repairDirection:
      "Clarify all-that-apply logic or separate internet listings from owner-advertising routes more explicitly.",
    safeTakeaway:
      "Response-option fit can fail across a sequence, not only inside one item.",
    source: {
      reportTitle: "Cognitive Pretesting of 2025 American Housing Survey Modules",
      year: "2024",
      sectionOrPage: "section 4.8.7 RMOVHS, printed pp. 94–95",
      directUrl: "https://www2.census.gov/library/working-papers/2024/adrm/cbsm/rsm2024-11.pdf",
      attribution:
        "Source: U.S. Census Bureau, Cognitive Pretesting of 2025 American Housing Survey Modules (2024), section 4.8.7 RMOVHS, printed pp. 94–95."
    }
  }
];
