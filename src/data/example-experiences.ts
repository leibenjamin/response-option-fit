import type { WorkbenchExperience } from "../types/workbench";

export const experienceBySpecimenId: Record<string, WorkbenchExperience> = {
  "ride-hailing": {
    kind: "meaning_lens",
    engine: {
      kind: "meaning_lens",
      interaction: "lens_map",
      actionLabel: "Switch lens",
      objectLabel: "Trip token",
      surfaceLabel: "Lens rings",
      feedbackLabel: "Route shift"
    },
    title: "Sort four trips into the answer the ACS built for paid rides.",
    lede:
      "Start by changing the lens, then trace each trip to the answer choice it would likely hit.",
    stakes:
      "What the data can hide: app rides, taxis, carpools, and bike-share can collapse under one familiar word.",
    reviewerGoal:
      "Pick what the label is meant to name; watch each trip land in a different answer choice.",
    surfaceTitle: "Mobility map",
    controlLabel: "Lens",
    caseLabel: "Trip",
    mapLabel: "Where the trip lands",
    instrumentNote:
      "The real ACS item tested Taxi or ride-hailing services. This workspace keeps that source boundary while making the everyday label problem visible.",
    zones: [
      {
        id: "app-ride",
        label: "App-based paid car ride",
        description: "Uber, Lyft, or another booked ride service.",
        tone: "target"
      },
      {
        id: "neighbor-paid",
        label: "Neighboring paid ride",
        description: "A taxi or similar hired ride that is not the app target.",
        tone: "edge"
      },
      {
        id: "informal-share",
        label: "Informal shared trip",
        description: "A carpool or ride with someone already going there.",
        tone: "outside"
      },
      {
        id: "shared-mobility",
        label: "Shared mobility object",
        description: "Bike-share or scooter-share where the vehicle, not the ride service, is shared.",
        tone: "outside"
      }
    ],
    controls: [
      {
        id: "service-model",
        label: "Service model",
        description: "Read the label as a paid app-based ride service.",
        effect: "Lyft and Uber center; taxi and carpool stay separate."
      },
      {
        id: "sharing-word",
        label: "The word share",
        description: "Read the label as any trip where something is shared.",
        effect: "Carpool and bike-share become tempting false routes."
      },
      {
        id: "paid-car",
        label: "Paid car ride",
        description: "Read the label as any paid ride in a car.",
        effect: "The taxi neighbor starts to blur with the intended app route."
      }
    ],
    cases: [
      {
        id: "lyft-solo",
        title: "Solo Lyft trip",
        body: "Maya paid for a Lyft ride to get to work.",
        reading: "She knows it was app-based but did not share the car.",
        provenance: "source_grounded",
        defaultZoneId: "app-ride",
        tags: ["center case", "paid", "app"],
        resultByControl: {
          "service-model": {
            zoneId: "app-ride",
            note: "The service-model lens gives this trip a clean route."
          },
          "sharing-word": {
            zoneId: "app-ride",
            note: "The trip is still in target, but the wording can make her hesitate."
          },
          "paid-car": {
            zoneId: "app-ride",
            note: "The paid-car lens includes the trip but starts to hide the taxi boundary."
          }
        }
      },
      {
        id: "taxi-stand",
        title: "Taxi stand",
        body: "Owen took a hotel taxi and paid the driver directly.",
        reading: "He sees a hired ride, not an app booking.",
        provenance: "teaching",
        defaultZoneId: "neighbor-paid",
        tags: ["neighbor", "paid"],
        resultByControl: {
          "service-model": {
            zoneId: "neighbor-paid",
            note: "A service-model label keeps the taxi outside the target."
          },
          "sharing-word": {
            zoneId: "neighbor-paid",
            note: "The word share does not help; the taxi remains a neighboring paid ride."
          },
          "paid-car": {
            zoneId: "app-ride",
            note: "A paid-car lens can pull taxis into the same answer space."
          }
        }
      },
      {
        id: "coworker-carpool",
        title: "Coworker carpool",
        body: "Nora rode with a coworker who was already driving.",
        reading: "She sometimes calls this ridesharing.",
        provenance: "teaching",
        defaultZoneId: "informal-share",
        tags: ["out of target", "shared car"],
        resultByControl: {
          "service-model": {
            zoneId: "informal-share",
            note: "The carpool stays outside because there is no paid service."
          },
          "sharing-word": {
            zoneId: "app-ride",
            note: "The word-share lens wrongly invites the carpool into the target."
          },
          "paid-car": {
            zoneId: "informal-share",
            note: "Not a paid ride, so this stays outside the target."
          }
        }
      },
      {
        id: "bike-share",
        title: "Bike-share dock",
        body: "Iris checked out a shared city bike and returned it at a dock.",
        reading: "The shared vehicle is the thing she notices first.",
        provenance: "teaching",
        defaultZoneId: "shared-mobility",
        tags: ["out of target", "shared object"],
        resultByControl: {
          "service-model": {
            zoneId: "shared-mobility",
            note: "The vehicle-share route stays outside a paid-car target."
          },
          "sharing-word": {
            zoneId: "app-ride",
            note: "The word-share lens can accidentally widen the target to bike-share."
          },
          "paid-car": {
            zoneId: "shared-mobility",
            note: "Not a paid car ride, so it stays outside."
          }
        }
      }
    ],
    repair: {
      title: "Repair without swallowing every neighbor",
      lede:
        "The useful repair names the service model and examples, then checks whether nearby trips still have their own place.",
      options: [
        {
          id: "app-examples",
          label: "Clarify target",
          headline: "App-based ride service, such as Uber or Lyft",
          body: "Names the intended service and makes solo app rides visible.",
          effects: [
            "Centers app rides.",
            "Keeps informal carpools outside.",
            "Separates bike-share from ride service."
          ],
          caution: "This does not validate the replacement wording or estimate how often each misread occurs."
        },
        {
          id: "too-wide",
          label: "Too wide",
          headline: "Shared ride or shared vehicle",
          body: "Sounds inclusive, but it pulls vehicle-share and carpool meanings into the same space.",
          effects: [
            "Makes the word easier to recognize.",
            "Widens beyond the commute mode target."
          ],
          caution: "A friendly label can still be analytically wrong."
        }
      ]
    },
    transfer: {
      title: "Apply it to a delivery courier label",
      prompt: "A person picked up food for a platform app. What should the reviewer inspect first?",
      options: ["Whether courier names a job, a vehicle, or an app service", "Whether the respondent likes the platform", "Whether delivery is common in the city"],
      preferredIndex: 0,
      feedback:
        "Start with the label boundary. The review is about where the answer lands, not the respondent's opinion."
    },
    sourceBoundary: {
      title: "What the source supports",
      body:
        "The source supports the ride-hailing comprehension concern in the ACS transportation item. The night-market trips are teaching cases.",
      limits: [
        "No claim that this exact replacement wording was validated.",
        "No claim about commute-mode error rates.",
        "No source-agency endorsement is implied."
      ]
    }
  },
  "business-industry": {
    kind: "level_ladder",
    engine: {
      kind: "level_ladder",
      interaction: "level_ladder",
      actionLabel: "Choose reporting level",
      objectLabel: "Job chip",
      surfaceLabel: "Reporting stack",
      feedbackLabel: "Level collision"
    },
    title: "Pick the level the form needs before judging the answer.",
    lede:
      "Move the job description up and down the reporting levels before deciding whether the field is doing too much.",
    stakes:
      "What the data can hide: one answer space can collect employer names, job tasks, workplaces, and industries as if they were equivalent.",
    reviewerGoal:
      "Pick the level the form needs; watch each job find or miss its slot.",
    surfaceTitle: "Reporting-level ladder",
    controlLabel: "Level cue",
    caseLabel: "Job card",
    mapLabel: "Answer level",
    instrumentNote:
      "The CPS source documents confusion between business, industry, workplace, and task level answers.",
    zones: [
      {
        id: "employer-name",
        label: "Employer name",
        description: "A specific organization or store name.",
        tone: "outside"
      },
      {
        id: "workplace-type",
        label: "Workplace type",
        description: "Restaurant, hospital, grocery store, school.",
        tone: "edge"
      },
      {
        id: "industry-sector",
        label: "Industry or sector",
        description: "Health care, education, retail, food services.",
        tone: "target"
      },
      {
        id: "occupation-task",
        label: "Occupation or task",
        description: "Nurse, cook, teacher, delivery driver.",
        tone: "warning"
      }
    ],
    controls: [
      {
        id: "workplace-cue",
        label: "Workplace cue",
        description: "Read the question as asking what kind of place this is.",
        effect: "Restaurant and hospital answers feel acceptable."
      },
      {
        id: "industry-cue",
        label: "Industry cue",
        description: "Read the question as asking for industry or sector.",
        effect: "Health care and food services become the intended level."
      },
      {
        id: "task-cue",
        label: "Task cue",
        description: "Read the question through the worker's day-to-day role.",
        effect: "Occupation answers leak into the industry field."
      }
    ],
    cases: [
      {
        id: "hospital-nurse",
        title: "Nurse at a hospital",
        body: "A registered nurse works at a hospital.",
        reading: "She can report hospital, health care, or nurse.",
        provenance: "reported",
        defaultZoneId: "industry-sector",
        tags: ["reported level confusion", "health care"],
        resultByControl: {
          "workplace-cue": {
            zoneId: "workplace-type",
            note: "Hospital is a place type, not the industry level the coder may need."
          },
          "industry-cue": {
            zoneId: "industry-sector",
            note: "Health care is the cleaner industry-level answer."
          },
          "task-cue": {
            zoneId: "occupation-task",
            note: "Nurse answers the job, not the business or industry."
          }
        }
      },
      {
        id: "pizza-driver",
        title: "Pizza delivery driver",
        body: "A driver delivers pizzas for a local shop.",
        reading: "The answer can sound like pizza, restaurant, food service, or delivery.",
        provenance: "source_grounded",
        defaultZoneId: "industry-sector",
        tags: ["food service", "task neighbor"],
        resultByControl: {
          "workplace-cue": {
            zoneId: "workplace-type",
            note: "Pizza shop is a workplace type."
          },
          "industry-cue": {
            zoneId: "industry-sector",
            note: "Food services is the sector-level route."
          },
          "task-cue": {
            zoneId: "occupation-task",
            note: "Delivery driver is occupation/task leakage."
          }
        }
      },
      {
        id: "university-lab",
        title: "Technician in a university lab",
        body: "A lab technician works at a university research center.",
        reading: "Education, research, university, and lab technician all feel plausible.",
        provenance: "source_grounded",
        defaultZoneId: "industry-sector",
        tags: ["mixed institution", "edge"],
        resultByControl: {
          "workplace-cue": {
            zoneId: "workplace-type",
            note: "University names a place or institution."
          },
          "industry-cue": {
            zoneId: "industry-sector",
            note: "The review must decide which sector rule the instrument wants."
          },
          "task-cue": {
            zoneId: "occupation-task",
            note: "Lab technician is a job title, not an industry route."
          }
        }
      }
    ],
    repair: {
      title: "Cue the denominator before the answer space",
      lede:
        "A repair should tell respondents which level counts, not merely offer more examples.",
      options: [
        {
          id: "level-examples",
          label: "Level cue",
          headline: "What kind of business or industry is this employer in? For example: health care, retail, education.",
          body: "Uses examples at the intended level and avoids occupation examples.",
          effects: [
            "Reduces employer-name answers.",
            "Reduces job-title answers.",
            "Still needs coder guidance for mixed institutions."
          ],
          caution: "Examples clarify level but can also bias respondents toward the named sectors."
        },
        {
          id: "two-fields",
          label: "Split fields",
          headline: "First collect employer/place type, then collect industry coding detail.",
          body: "Separates the levels instead of asking one field to absorb all of them.",
          effects: [
            "Preserves useful context.",
            "Costs more respondent effort."
          ],
          caution: "This is a design direction, not a validated replacement flow."
        }
      ]
    },
    transfer: {
      title: "Apply it to platform work",
      prompt: "A respondent writes 'DoorDash'. What should the reviewer ask?",
      options: ["Is that employer, platform, industry, or occupation evidence?", "Was the order delivered on time?", "Is DoorDash well known?"],
      preferredIndex: 0,
      feedback:
        "The review starts by separating answer level from brand familiarity."
    },
    sourceBoundary: {
      title: "What the source supports",
      body:
        "The source supports the documented level-confusion problem in an internet CPS business/industry item.",
      limits: [
        "The teaching ladder is an editorial rendering of the documented problem.",
        "No claim that one split-field design has been validated.",
        "Occupation coding issues outside the item are out of scope."
      ]
    }
  },
  "refrigerated-medicine": {
    kind: "eligibility_fork",
    engine: {
      kind: "eligibility_fork",
      interaction: "eligibility_fork",
      actionLabel: "Choose question route",
      objectLabel: "Household",
      surfaceLabel: "Branching fork",
      feedbackLabel: "No meaning"
    },
    title: "Separate the spoilage outcome from the eligibility question.",
    lede:
      "Walk the household through the hidden fork before treating a No answer as no loss.",
    stakes:
      "What the data can hide: No can mean no refrigerated medicine, no spoilage, no outage effect, or not applicable.",
    reviewerGoal:
      "Pull the eligibility check out from under the loss outcome; re-read each No.",
    surfaceTitle: "Hidden fork",
    controlLabel: "Question route",
    caseLabel: "Household",
    mapLabel: "Where No goes",
    instrumentNote:
      "The AHS source documents the risk of asking about spoiled refrigerated medicine without first making applicability explicit.",
    zones: [
      {
        id: "eligible-loss",
        label: "Eligible and spoiled",
        description: "The household had refrigerated medicine and it spoiled.",
        tone: "target"
      },
      {
        id: "eligible-no-loss",
        label: "Eligible, no spoilage",
        description: "The household had medicine but no spoilage.",
        tone: "edge"
      },
      {
        id: "not-applicable",
        label: "No refrigerated medicine",
        description: "The household cannot answer the loss question as asked.",
        tone: "warning"
      },
      {
        id: "wrong-cause",
        label: "Spoilage not caused by outage",
        description: "The event happened, but the tested cause does not fit.",
        tone: "outside"
      }
    ],
    controls: [
      {
        id: "plain-yes-no",
        label: "Plain Yes/No",
        description: "Ask only whether refrigerated medicine spoiled.",
        effect: "No absorbs several meanings."
      },
      {
        id: "add-screener",
        label: "Add screener",
        description: "Ask whether the household had refrigerated medicine first.",
        effect: "Eligibility stops hiding inside No."
      },
      {
        id: "add-na",
        label: "Add not applicable",
        description: "Give households without refrigerated medicine their own route.",
        effect: "The loss outcome is not forced onto ineligible homes."
      }
    ],
    cases: [
      {
        id: "no-medicine",
        title: "No refrigerated medicine",
        body: "The household did not have medicine that needed refrigeration.",
        reading: "They know No is true, but not why.",
        provenance: "reported",
        defaultZoneId: "not-applicable",
        tags: ["false premise", "No hides denominator"],
        resultByControl: {
          "plain-yes-no": {
            zoneId: "eligible-no-loss",
            note: "Plain No makes this look like no spoilage among eligible homes."
          },
          "add-screener": {
            zoneId: "not-applicable",
            note: "The screener gives the household a clean not-eligible route."
          },
          "add-na": {
            zoneId: "not-applicable",
            note: "A not-applicable option keeps this out of the loss denominator."
          }
        }
      },
      {
        id: "medicine-survived",
        title: "Medicine stayed cold",
        body: "The household had insulin, used a cooler, and it did not spoil.",
        reading: "No means no loss, not no medicine.",
        provenance: "source_grounded",
        defaultZoneId: "eligible-no-loss",
        tags: ["eligible", "no loss"],
        resultByControl: {
          "plain-yes-no": {
            zoneId: "eligible-no-loss",
            note: "This No is a valid no-loss route, but it is indistinguishable from no medicine."
          },
          "add-screener": {
            zoneId: "eligible-no-loss",
            note: "The screener preserves eligibility before the No."
          },
          "add-na": {
            zoneId: "eligible-no-loss",
            note: "Not-applicable helps only if the eligible path is still clear."
          }
        }
      },
      {
        id: "spoiled-not-outage",
        title: "Spoiled for another reason",
        body: "Medicine spoiled after a refrigerator malfunction unrelated to the outage.",
        reading: "The loss happened, but not because of the target event.",
        provenance: "teaching",
        defaultZoneId: "wrong-cause",
        tags: ["cause boundary", "out of target"],
        resultByControl: {
          "plain-yes-no": {
            zoneId: "eligible-loss",
            note: "A plain item can pull the wrong cause into the loss count."
          },
          "add-screener": {
            zoneId: "wrong-cause",
            note: "Eligibility alone does not solve the cause boundary."
          },
          "add-na": {
            zoneId: "wrong-cause",
            note: "Not-applicable does not distinguish outage-caused loss from other spoilage."
          }
        }
      }
    ],
    repair: {
      title: "Separate eligibility from measurement",
      lede:
        "The repair should keep denominator, event, and cause from being inferred from one No.",
      options: [
        {
          id: "screen-first",
          label: "Screen first",
          headline: "Did you have refrigerated medicine during the outage?",
          body: "Establishes whether the loss item applies before asking whether anything spoiled.",
          effects: [
            "Protects the denominator.",
            "Makes a later No interpretable.",
            "Still needs a cause phrase if non-outage spoilage is possible."
          ],
          caution: "Screening fixes applicability, not every causal boundary."
        },
        {
          id: "na-option",
          label: "Add route",
          headline: "No refrigerated medicine",
          body: "Gives ineligible households a visible answer without adding a whole extra question.",
          effects: [
            "Reduces false No records.",
            "Can be missed if placed as help text rather than an answer."
          ],
          caution: "A not-applicable option is not the same as measuring spoilage."
        }
      ]
    },
    transfer: {
      title: "Apply it to elevator outages",
      prompt: "A building asks, 'Did the elevator outage prevent you from leaving?' What comes first?",
      options: ["Whether the respondent uses or needs the elevator", "Whether the outage was inconvenient", "Whether the building has many floors"],
      preferredIndex: 0,
      feedback:
        "A false premise check starts with applicability, then measures the event."
    },
    sourceBoundary: {
      title: "What the source supports",
      body:
        "The source supports the risk that a spoilage item can confuse loss with applicability.",
      limits: [
        "No estimate of how many households lacked refrigerated medicine.",
        "No validated replacement sequence is claimed.",
        "Other outage-module questions are outside this workspace."
      ]
    }
  },
  "electric-vehicle-type": {
    kind: "feature_rule_board",
    engine: {
      kind: "feature_rule_board",
      interaction: "feature_matrix",
      actionLabel: "Set feature rule",
      objectLabel: "Vehicle card",
      surfaceLabel: "Feature board",
      feedbackLabel: "Classification rule"
    },
    title: "Decide what makes an EV count, then watch examples land.",
    lede:
      "Choose the rule a respondent might use, then watch vehicle cards move across the boundary.",
    stakes:
      "What the data can hide: everyday electric labels and technical vehicle categories do not line up cleanly.",
    reviewerGoal:
      "Pick the feature that defines an EV; watch the borderline vehicles land or miss.",
    surfaceTitle: "Vehicle feature matrix",
    controlLabel: "Classifying feature",
    caseLabel: "Vehicle",
    mapLabel: "Category route",
    instrumentNote:
      "The ACS source discusses confusion around another type of electric vehicle, including hybrids and plug-in distinctions.",
    zones: [
      {
        id: "plug-in-target",
        label: "Plug-in electric",
        description: "Charges from an outlet and uses electric power.",
        tone: "target"
      },
      {
        id: "hybrid-edge",
        label: "Hybrid edge",
        description: "Uses gas and battery power, but may or may not plug in.",
        tone: "edge"
      },
      {
        id: "everyday-electric",
        label: "Everyday electric label",
        description: "Respondent calls it electric even when the technical rule differs.",
        tone: "warning"
      },
      {
        id: "outside",
        label: "Outside vehicle class",
        description: "Not in the intended electric-vehicle category.",
        tone: "outside"
      }
    ],
    controls: [
      {
        id: "plugs-in",
        label: "Plugs in",
        description: "Use external charging as the rule.",
        effect: "Plug-in hybrids stay in; non-plug hybrids stay out."
      },
      {
        id: "gas-battery",
        label: "Gas plus battery",
        description: "Use hybrid technology as the rule.",
        effect: "Plug-in and non-plug hybrids cluster together."
      },
      {
        id: "everyday-label",
        label: "Called electric",
        description: "Use the respondent's everyday label.",
        effect: "Technical distinctions are harder to recover."
      }
    ],
    cases: [
      {
        id: "plug-in-hybrid",
        title: "Plug-in hybrid",
        body: "A car can charge from an outlet and also use gasoline.",
        reading: "The owner sees both electric and hybrid features.",
        provenance: "reported",
        defaultZoneId: "hybrid-edge",
        tags: ["edge", "plug-in"],
        resultByControl: {
          "plugs-in": {
            zoneId: "plug-in-target",
            note: "The plug-in rule gives this vehicle a clear route."
          },
          "gas-battery": {
            zoneId: "hybrid-edge",
            note: "Gas plus battery keeps it in a broad hybrid edge space."
          },
          "everyday-label": {
            zoneId: "everyday-electric",
            note: "Everyday electric language may fit, but hides the plug-in rule."
          }
        }
      },
      {
        id: "non-plug-hybrid",
        title: "Hybrid that does not plug in",
        body: "A hybrid uses gasoline and battery assist but never plugs into an outlet.",
        reading: "The owner may still call it electric because a battery is involved.",
        provenance: "reported",
        defaultZoneId: "hybrid-edge",
        tags: ["hybrid", "non-plug"],
        resultByControl: {
          "plugs-in": {
            zoneId: "outside",
            note: "The plug-in rule keeps it outside the target."
          },
          "gas-battery": {
            zoneId: "hybrid-edge",
            note: "Gas plus battery includes it with plug-in hybrids."
          },
          "everyday-label": {
            zoneId: "everyday-electric",
            note: "Everyday electric wording may invite it into the answer."
          }
        }
      },
      {
        id: "battery-only",
        title: "Battery-only vehicle",
        body: "A vehicle runs only on electric power and plugs in to charge.",
        reading: "This is the clearest electric center case.",
        provenance: "source_grounded",
        defaultZoneId: "plug-in-target",
        tags: ["center", "battery"],
        resultByControl: {
          "plugs-in": {
            zoneId: "plug-in-target",
            note: "The plug-in rule catches the center case."
          },
          "gas-battery": {
            zoneId: "plug-in-target",
            note: "The hybrid rule is not needed for this center case."
          },
          "everyday-label": {
            zoneId: "everyday-electric",
            note: "Everyday electric also catches it, but without a technical boundary."
          }
        }
      }
    ],
    repair: {
      title: "Name the feature, then give examples",
      lede:
        "Examples help only after the category rule is visible.",
      options: [
        {
          id: "feature-plus-examples",
          label: "Feature first",
          headline: "Plug-in electric vehicle, including plug-in hybrid vehicles",
          body: "Turns the boundary into a feature rule instead of an everyday label contest.",
          effects: [
            "Makes plug-in hybrid status visible.",
            "Keeps non-plug hybrids from drifting in.",
            "Still requires source testing before adoption."
          ],
          caution: "Examples can clarify or redefine a category; reviewers must check which is happening."
        },
        {
          id: "bare-electric",
          label: "Bare label",
          headline: "Another type of electric vehicle",
          body: "Short, but it leaves respondents to supply their own electric rule.",
          effects: [
            "Easy to scan.",
            "Lets everyday and technical categories compete."
          ],
          caution: "A shorter label can be the less measurable one."
        }
      ]
    },
    transfer: {
      title: "Apply it to smart TVs",
      prompt: "A device has streaming apps but no cable box. What rule matters?",
      options: ["Which feature defines the category", "Whether the brand is popular", "Whether the household watches daily"],
      preferredIndex: 0,
      feedback:
        "Category-boundary review starts by making the rule explicit."
    },
    sourceBoundary: {
      title: "What the source supports",
      body:
        "The source supports confusion around electric-vehicle category wording and plug-in/hybrid distinctions.",
      limits: [
        "No universal EV taxonomy is endorsed here.",
        "No replacement category list is validated.",
        "Vehicle-market prevalence is out of scope."
      ]
    }
  },
  "owner-advertising": {
    kind: "source_timeline",
    engine: {
      kind: "source_timeline",
      interaction: "source_timeline",
      actionLabel: "Set sequence rule",
      objectLabel: "Listing token",
      surfaceLabel: "Exposure timeline",
      feedbackLabel: "Overlap trace"
    },
    title: "Trace where each lead came from before the all-that-apply collapse.",
    lede:
      "Put the same listing on the timeline before deciding whether a later Yes is a repeat or a new source.",
    stakes:
      "What the data can hide: one listing can be counted as internet exposure, owner advertising, both, or neither depending on sequence instructions.",
    reviewerGoal:
      "Set whether the series wants exclusive causes or every channel that helped; re-read the answers.",
    surfaceTitle: "Exposure timeline",
    controlLabel: "Sequence rule",
    caseLabel: "Listing source",
    mapLabel: "How the source is coded",
    instrumentNote:
      "The AHS source documents overlap between internet listing and owner-advertising items.",
    zones: [
      {
        id: "internet-only",
        label: "Internet listing",
        description: "The exposure is coded to the internet item only.",
        tone: "target"
      },
      {
        id: "owner-only",
        label: "Owner advertising",
        description: "The exposure is coded to the owner-advertising item only.",
        tone: "edge"
      },
      {
        id: "both",
        label: "Same listing spans both",
        description: "The same exposure can satisfy both items.",
        tone: "warning"
      },
      {
        id: "outside",
        label: "Different source",
        description: "A yard sign, agent, or non-owner source needs its own route.",
        tone: "outside"
      }
    ],
    controls: [
      {
        id: "exclusive",
        label: "Exclusive sequence",
        description: "Treat a Yes as belonging to only one prior item.",
        effect: "Same-listing cases feel like repeats or contradictions."
      },
      {
        id: "all-that-apply",
        label: "All that applied",
        description: "License multiple Yes answers for sources that helped.",
        effect: "Overlap is allowed but still analytically visible."
      },
      {
        id: "owner-after-internet",
        label: "Owner after internet",
        description: "Ask owner advertising after internet listings without clarifying overlap.",
        effect: "Respondents must infer whether the later question excludes the earlier one."
      }
    ],
    cases: [
      {
        id: "zillow-owner",
        title: "Owner posted on Zillow",
        body: "The owner created the internet listing that helped the buyer find the home.",
        reading: "The respondent sees one source with two labels.",
        provenance: "reported",
        defaultZoneId: "both",
        tags: ["same listing", "overlap"],
        resultByControl: {
          exclusive: {
            zoneId: "internet-only",
            note: "An exclusive sequence pushes the respondent to pick one label."
          },
          "all-that-apply": {
            zoneId: "both",
            note: "Multiple-response wording licenses both, while preserving the overlap tradeoff."
          },
          "owner-after-internet": {
            zoneId: "both",
            note: "The overlap remains unresolved if the later item does not say whether repeats count."
          }
        }
      },
      {
        id: "yard-sign",
        title: "Owner yard sign",
        body: "A buyer noticed a For Sale By Owner sign in the yard.",
        reading: "This is owner advertising but not an internet listing.",
        provenance: "source_grounded",
        defaultZoneId: "owner-only",
        tags: ["owner", "offline"],
        resultByControl: {
          exclusive: {
            zoneId: "owner-only",
            note: "The offline owner source is clean even under an exclusive sequence."
          },
          "all-that-apply": {
            zoneId: "owner-only",
            note: "It remains owner advertising without needing overlap."
          },
          "owner-after-internet": {
            zoneId: "owner-only",
            note: "This is the easy owner-advertising center case."
          }
        }
      },
      {
        id: "agent-listing",
        title: "Agent-managed listing",
        body: "The listing was posted by an agent rather than by the owner.",
        reading: "Internet exposure is clear; owner advertising is not.",
        provenance: "teaching",
        defaultZoneId: "internet-only",
        tags: ["internet", "not owner"],
        resultByControl: {
          exclusive: {
            zoneId: "internet-only",
            note: "The source belongs with internet listing, not owner advertising."
          },
          "all-that-apply": {
            zoneId: "internet-only",
            note: "All-that-apply does not make the owner label true."
          },
          "owner-after-internet": {
            zoneId: "internet-only",
            note: "The later owner item still needs a clear owner-source rule."
          }
        }
      }
    ],
    repair: {
      title: "License overlap without hiding it",
      lede:
        "A better sequence says whether repeat sources count and what analytic tradeoff remains.",
      options: [
        {
          id: "explicit-multi",
          label: "Explicit multi",
          headline: "Answer Yes to each source that helped, even if the same listing fits more than one source.",
          body: "Tells respondents not to treat later items as mutually exclusive.",
          effects: [
            "Reduces accidental undercount of secondary channels.",
            "Preserves same-source overlap for analysis.",
            "Does not decide whether double-coding is desirable."
          ],
          caution: "Overlap is licensed, not solved."
        },
        {
          id: "dedupe",
          label: "Deduplicate",
          headline: "If you already counted this listing as internet advertising, do not count it again here.",
          body: "Creates exclusive categories, but it can suppress owner-origin information.",
          effects: [
            "Cleaner exclusive counts.",
            "Less information about source ownership."
          ],
          caution: "A clean table may lose the thing the later item wanted to know."
        }
      ]
    },
    transfer: {
      title: "Apply it to disaster moving reasons",
      prompt: "A move was partly about cost and partly about storm risk. What should the sequence say?",
      options: ["Whether multiple reasons can be Yes", "Which reason sounds more dramatic", "Whether the respondent moved far away"],
      preferredIndex: 0,
      feedback:
        "Sequence-overlap review checks the response rule before interpreting a Yes."
    },
    sourceBoundary: {
      title: "What the source supports",
      body:
        "The source supports the overlap concern between internet listing and owner-advertising items.",
      limits: [
        "No claim about which source caused a sale.",
        "No validated double-counting policy is asserted.",
        "The timeline is an editorial reviewer aid."
      ]
    }
  },
  "usual-hours": {
    kind: "schedule_trace",
    engine: {
      kind: "schedule_trace",
      interaction: "schedule_trace",
      actionLabel: "Choose recall rule",
      objectLabel: "Schedule case",
      surfaceLabel: "Week trace",
      feedbackLabel: "Provenance"
    },
    title: "Pick the counting rule, then read what the week's number means.",
    lede:
      "Switch the counting rule and watch the same work history produce different exact-looking answers.",
    stakes:
      "What the data can hide: a single number can conceal average, mode, last week, desired schedule, or guess.",
    reviewerGoal:
      "Pick how the weekly number was built; then read what it actually reports.",
    surfaceTitle: "Weekly schedule trace",
    controlLabel: "Counting rule",
    caseLabel: "Schedule",
    mapLabel: "Number provenance",
    instrumentNote:
      "The CPS source documents difficulty reporting usual hours when schedules vary.",
    zones: [
      {
        id: "stable-count",
        label: "Stable count",
        description: "The number is recoverable from a regular schedule.",
        tone: "target"
      },
      {
        id: "average",
        label: "Average over window",
        description: "The number is an aggregation choice.",
        tone: "method"
      },
      {
        id: "modal-week",
        label: "Most common week",
        description: "The number reflects a typical week, not an average.",
        tone: "edge"
      },
      {
        id: "hidden-method",
        label: "Hidden private method",
        description: "The respondent supplies a number but the method is unrecoverable.",
        tone: "warning"
      }
    ],
    controls: [
      {
        id: "last-week",
        label: "Last week",
        description: "Use the most recent completed week.",
        effect: "Concrete, but can miss normal variation."
      },
      {
        id: "four-weeks",
        label: "Four-week average",
        description: "Average across the last four weeks.",
        effect: "Makes variation visible but asks for a calculation."
      },
      {
        id: "usual-no-window",
        label: "Usual, no window",
        description: "Ask for the respondent's usual hours without a time frame.",
        effect: "Easy to answer but method stays hidden."
      }
    ],
    cases: [
      {
        id: "rotating-shift",
        title: "Rotating shift",
        body: "The worker alternates 32, 40, 48, and 40 hour weeks.",
        reading: "Any one number depends on the rule.",
        provenance: "reported",
        defaultZoneId: "hidden-method",
        tags: ["variable", "average"],
        resultByControl: {
          "last-week": {
            zoneId: "modal-week",
            note: "Last week gives one concrete number but may not be representative."
          },
          "four-weeks": {
            zoneId: "average",
            note: "The four-week average exposes the aggregation rule."
          },
          "usual-no-window": {
            zoneId: "hidden-method",
            note: "The respondent can answer, but the private rule is hidden."
          }
        }
      },
      {
        id: "ninety-percent",
        title: "Ninety percent schedule",
        body: "The worker is scheduled near full time most weeks but has occasional short weeks.",
        reading: "Usual could mean contract hours or recent actual hours.",
        provenance: "source_grounded",
        defaultZoneId: "hidden-method",
        tags: ["contract", "actual"],
        resultByControl: {
          "last-week": {
            zoneId: "modal-week",
            note: "A recent week may overstate or understate the regular pattern."
          },
          "four-weeks": {
            zoneId: "average",
            note: "Averaging states the method but still costs calculation."
          },
          "usual-no-window": {
            zoneId: "hidden-method",
            note: "Usual without a window does not reveal whether contract or actual hours were used."
          }
        }
      },
      {
        id: "stable-forty",
        title: "Stable forty",
        body: "The worker has worked 40 hours every week for months.",
        reading: "Any reasonable rule lands on 40.",
        provenance: "teaching",
        defaultZoneId: "stable-count",
        tags: ["stable", "center"],
        resultByControl: {
          "last-week": {
            zoneId: "stable-count",
            note: "The recent week reflects the usual schedule."
          },
          "four-weeks": {
            zoneId: "stable-count",
            note: "The average is also 40."
          },
          "usual-no-window": {
            zoneId: "stable-count",
            note: "This is a center case where hidden method matters less."
          }
        }
      }
    ],
    repair: {
      title: "Show the method carried by the number",
      lede:
        "A repair can choose a window, give an averaging rule, or acknowledge that no single number is stable.",
      options: [
        {
          id: "windowed-average",
          label: "Windowed",
          headline: "During the last four weeks, about how many hours did you work per week on average?",
          body: "Makes the aggregation method visible.",
          effects: [
            "Reduces private interpretation.",
            "Adds calculation burden.",
            "May not capture long-term regularity."
          ],
          caution: "A clearer rule can be less easy to answer."
        },
        {
          id: "usual-plus-note",
          label: "Method note",
          headline: "If your hours vary, give your best estimate for a typical week.",
          body: "Keeps respondent burden low while admitting approximation.",
          effects: [
            "Keeps the item compact.",
            "Still leaves typical-week logic partly hidden."
          ],
          caution: "This remains a forced-precision compromise."
        }
      ]
    },
    transfer: {
      title: "Apply it to monthly income",
      prompt: "Income varies by tips. What should the reviewer inspect?",
      options: ["The time window and aggregation rule", "The highest earning month", "Whether tips are common"],
      preferredIndex: 0,
      feedback:
        "Forced precision often lives in the hidden method behind an exact-looking number."
    },
    sourceBoundary: {
      title: "What the source supports",
      body:
        "The source supports that varying schedules make usual-hours answers hard to compute consistently.",
      limits: [
        "Hidden private method remains a risk unless the item records the counting rule.",
        "No single replacement window is validated here.",
        "No claim about prevalence of each counting method.",
        "The trace is a reviewer aid, not a statistical adjustment."
      ]
    }
  },
  "notebook-computer": {
    kind: "device_label_splitter",
    engine: {
      kind: "device_label_splitter",
      interaction: "device_shelf",
      actionLabel: "Toggle label",
      objectLabel: "Device",
      surfaceLabel: "Device shelf",
      feedbackLabel: "Invited device"
    },
    title: "Sort four devices the survey thinks are one word.",
    lede:
      "Toggle the label terms and watch which devices are invited into the yes answer.",
    stakes:
      "What the data can hide: notebook can mean laptop, small paper notebook, Chromebook, tablet, or lower-function device depending on the respondent.",
    reviewerGoal:
      "Swap the example anchor; watch the device boundary slide with it.",
    surfaceTitle: "Device shelf",
    controlLabel: "Label term",
    caseLabel: "Device",
    mapLabel: "Device route",
    instrumentNote:
      "The NTIA source documents confusion around laptop or notebook wording.",
    zones: [
      {
        id: "laptop-family",
        label: "Laptop family",
        description: "Laptop, notebook computer, or portable computer in the intended sense.",
        tone: "target"
      },
      {
        id: "chromebook-edge",
        label: "Chromebook edge",
        description: "Portable computer that may or may not be recognized under the label.",
        tone: "edge"
      },
      {
        id: "tablet-neighbor",
        label: "Tablet neighbor",
        description: "Touch device that respondents may compare with laptops.",
        tone: "outside"
      },
      {
        id: "misread",
        label: "Non-computer misread",
        description: "The word notebook points away from computers.",
        tone: "warning"
      }
    ],
    controls: [
      {
        id: "laptop",
        label: "Laptop",
        description: "Use the common portable-computer term.",
        effect: "Center cases are clearer."
      },
      {
        id: "notebook",
        label: "Notebook",
        description: "Use the term that some respondents misread.",
        effect: "Paper and lower-function associations appear."
      },
      {
        id: "with-examples",
        label: "Examples",
        description: "Add examples such as Chromebook only if they are in scope.",
        effect: "Edge devices become visible but the boundary must be explicit."
      }
    ],
    cases: [
      {
        id: "plain-laptop",
        title: "Plain laptop",
        body: "A household member uses a standard Windows laptop.",
        reading: "The respondent recognizes laptop immediately.",
        provenance: "teaching",
        defaultZoneId: "laptop-family",
        tags: ["center", "laptop"],
        resultByControl: {
          laptop: {
            zoneId: "laptop-family",
            note: "Laptop gives the center case a clear route."
          },
          notebook: {
            zoneId: "laptop-family",
            note: "Notebook may still work for this respondent, but is less universally clear."
          },
          "with-examples": {
            zoneId: "laptop-family",
            note: "Examples are not needed for the easy case."
          }
        }
      },
      {
        id: "chromebook",
        title: "Chromebook",
        body: "A child uses a Chromebook for schoolwork.",
        reading: "The respondent is unsure whether Chromebook counts as laptop.",
        provenance: "reported",
        defaultZoneId: "chromebook-edge",
        tags: ["edge", "school device"],
        resultByControl: {
          laptop: {
            zoneId: "chromebook-edge",
            note: "Laptop may or may not catch the Chromebook."
          },
          notebook: {
            zoneId: "chromebook-edge",
            note: "Notebook does not settle whether Chromebook is in scope."
          },
          "with-examples": {
            zoneId: "laptop-family",
            note: "If Chromebook is intended, examples can make the route visible."
          }
        }
      },
      {
        id: "tablet-only",
        title: "Tablet only",
        body: "The household has only an iPad with a detachable keyboard.",
        reading: "The respondent compares it with a laptop because it is used for similar tasks.",
        provenance: "source_grounded",
        defaultZoneId: "tablet-neighbor",
        tags: ["neighbor", "2-in-1"],
        resultByControl: {
          laptop: {
            zoneId: "tablet-neighbor",
            note: "Laptop alone usually keeps a tablet outside, unless the keyboard changes the interpretation."
          },
          notebook: {
            zoneId: "tablet-neighbor",
            note: "Notebook does not clarify the tablet boundary."
          },
          "with-examples": {
            zoneId: "tablet-neighbor",
            note: "Examples need exclusions as well as inclusions if tablets are out."
          }
        }
      }
    ],
    repair: {
      title: "Clarify by inclusion and exclusion",
      lede:
        "Device examples work only when the boundary is explicit.",
      options: [
        {
          id: "laptop-plus-examples",
          label: "Inclusion",
          headline: "Laptop computer, including a Chromebook if you consider it a laptop",
          body: "Names the center term and points to a known edge.",
          effects: [
            "Reduces notebook misread.",
            "Makes Chromebook visible.",
            "Still needs a tablet rule."
          ],
          caution: "An example can pull an edge device in; that must match the measure."
        },
        {
          id: "remove-notebook",
          label: "Remove synonym",
          headline: "Laptop computer",
          body: "Drops the term most likely to point outside the device family.",
          effects: [
            "Cleaner for center cases.",
            "May under-cue Chromebooks or 2-in-1s."
          ],
          caution: "Simpler wording can become underinclusive."
        }
      ]
    },
    transfer: {
      title: "Apply it to routers",
      prompt: "A household has a gateway supplied by an ISP. What is the first label check?",
      options: ["Whether the term names the device family respondents use", "Whether the device is expensive", "Whether it is in the living room"],
      preferredIndex: 0,
      feedback:
        "Label review starts with ordinary device names and their nearest neighbors."
    },
    sourceBoundary: {
      title: "What the source supports",
      body:
        "The source supports label confusion around laptop/notebook wording in an internet-use survey.",
      limits: [
        "No generation-level device adoption claim is made.",
        "No validated device list is supplied.",
        "Tablet and Chromebook cases are teaching applications of the source concern."
      ]
    }
  },
  "ons-kashmiri": {
    kind: "visibility_route",
    engine: {
      kind: "visibility_route",
      interaction: "visibility_route",
      actionLabel: "Show route",
      objectLabel: "Respondent route",
      surfaceLabel: "Form route map",
      feedbackLabel: "Visibility tradeoff"
    },
    title: "Compare two answer paths before reading either as endorsement.",
    lede:
      "Compare printed tick-box, broad category, and write-in routes as respondent effort and visibility change.",
    stakes:
      "What the data can hide: a specific identity can be reportable yet practically less visible if the route is broad or buried.",
    reviewerGoal:
      "Compare two answer routes; read what each leaves visible — without reading the comparison as endorsement.",
    surfaceTitle: "Form route mockup",
    controlLabel: "Visible route",
    caseLabel: "Respondent route",
    mapLabel: "Visibility and effort",
    instrumentNote:
      "The ONS source documents Kashmiri tick-box and write-in tradeoffs for the 2011 Census design decision.",
    zones: [
      {
        id: "printed-specific",
        label: "Printed specific tick-box",
        description: "High visibility for the subgroup identity.",
        tone: "target"
      },
      {
        id: "broad-box",
        label: "Broad printed box",
        description: "Lower effort but less specific route.",
        tone: "edge"
      },
      {
        id: "write-in",
        label: "Write-in route",
        description: "Specific but higher effort and less visible.",
        tone: "warning"
      },
      {
        id: "policy-tradeoff",
        label: "Classification tradeoff",
        description: "Visibility, comparability, and parallel-subgroup decisions conflict.",
        tone: "method"
      }
    ],
    controls: [
      {
        id: "show-specific",
        label: "Show Kashmiri box",
        description: "Give the identity its own visible route.",
        effect: "Visibility rises; comparability and parallel-box questions remain."
      },
      {
        id: "broad-plus-write",
        label: "Broad + write-in",
        description: "Route through broad Asian categories and a write-in.",
        effect: "Form stays compact; specific identity requires extra work."
      },
      {
        id: "broad-only",
        label: "Broad only",
        description: "Rely on broad boxes without a specific visible route.",
        effect: "Lowest effort for the form, weakest specific visibility."
      }
    ],
    cases: [
      {
        id: "wants-specific",
        title: "Wants Kashmiri visible",
        body: "A respondent wants Kashmiri recorded without writing it in.",
        reading: "The broad box feels like a partial answer.",
        provenance: "reported",
        defaultZoneId: "printed-specific",
        tags: ["visibility", "identity"],
        resultByControl: {
          "show-specific": {
            zoneId: "printed-specific",
            note: "The specific box gives the clearest route."
          },
          "broad-plus-write": {
            zoneId: "write-in",
            note: "The respondent can report it, but only through extra write-in work."
          },
          "broad-only": {
            zoneId: "broad-box",
            note: "The specific identity is absorbed into a broader category."
          }
        }
      },
      {
        id: "habit-broad",
        title: "Habitual broad response",
        body: "A respondent usually ticks Pakistani or Indian because that is what the form shows.",
        reading: "A visible broad box can become the default path.",
        provenance: "source_grounded",
        defaultZoneId: "broad-box",
        tags: ["broad habit", "visibility"],
        resultByControl: {
          "show-specific": {
            zoneId: "printed-specific",
            note: "A specific box can interrupt the broad-category habit."
          },
          "broad-plus-write": {
            zoneId: "broad-box",
            note: "The broad box remains the easiest visible path."
          },
          "broad-only": {
            zoneId: "broad-box",
            note: "Specific visibility is lowest."
          }
        }
      },
      {
        id: "policy-parallel",
        title: "Parallel subgroup concern",
        body: "Adding one subgroup raises questions about other subgroup identities and comparability.",
        reading: "The form decision is not only about individual recognition.",
        provenance: "reported",
        defaultZoneId: "policy-tradeoff",
        tags: ["policy", "comparability"],
        resultByControl: {
          "show-specific": {
            zoneId: "policy-tradeoff",
            note: "Visibility improves but classification-policy tradeoffs remain."
          },
          "broad-plus-write": {
            zoneId: "policy-tradeoff",
            note: "The route keeps comparability concerns visible but costs respondent effort."
          },
          "broad-only": {
            zoneId: "policy-tradeoff",
            note: "The compact form still makes a policy tradeoff."
          }
        }
      }
    ],
    repair: {
      title: "Discuss visibility without pretending it settles policy",
      lede:
        "The review can show route effort and visibility while keeping classification decisions bounded.",
      options: [
        {
          id: "specific-plus-boundary",
          label: "Visible route",
          headline: "Kashmiri printed as a visible option",
          body: "Maximizes route visibility for the identity.",
          effects: [
            "Reduces write-in burden.",
            "Makes the identity easier to notice.",
            "Raises parallel-category and comparability questions."
          ],
          caution: "This workspace does not endorse a classification policy."
        },
        {
          id: "write-in-supported",
          label: "Supported write-in",
          headline: "Broad category plus clearly signposted write-in",
          body: "Preserves a specific route but keeps it secondary.",
          effects: [
            "Keeps form shorter.",
            "Specific route remains less visible than a tick-box."
          ],
          caution: "Reportability is not the same as salience."
        }
      ]
    },
    transfer: {
      title: "Apply it to language reporting",
      prompt: "A language can be written in under Other. What should the reviewer inspect?",
      options: ["Visibility, effort, and policy tradeoff", "Whether the language is easy to spell", "Whether the respondent speaks more than one language"],
      preferredIndex: 0,
      feedback:
        "Broad-bucket review can be about route visibility, not just whether a write-in exists."
    },
    sourceBoundary: {
      title: "Source boundary",
      body:
        "This illustrates response-route visibility and tradeoffs documented by ONS. It is not an endorsement of any category policy.",
      limits: [
        "No claim that ONS should have adopted a Kashmiri tick-box.",
        "No claim about identity legitimacy or population counts.",
        "The route mockup is editorial, not a reproduced ONS form."
      ]
    }
  },
  "sump-pump": {
    kind: "premise_stack",
    engine: {
      kind: "premise_stack",
      interaction: "premise_stack",
      actionLabel: "Set premise",
      objectLabel: "Home case",
      surfaceLabel: "Premise stack",
      feedbackLabel: "No meaning"
    },
    title: "Stack the eligibility check above the yes/no answer.",
    lede:
      "Turn each premise on and off before treating No as a clean outcome.",
    stakes:
      "What the data can hide: No can mean no basement, no pump, pump worked, no outage, or no water.",
    reviewerGoal:
      "Stack the hidden eligibility checks above the yes/no; watch what each No actually says.",
    surfaceTitle: "Premise stack",
    controlLabel: "Visible premise",
    caseLabel: "Home",
    mapLabel: "No meaning",
    instrumentNote:
      "The AHS source includes a no-sump-pump route and documents how applicability help can matter.",
    zones: [
      {
        id: "has-pump-failed",
        label: "Pump existed and failed",
        description: "The target event occurred.",
        tone: "target"
      },
      {
        id: "has-pump-no-failure",
        label: "Pump existed, no failure",
        description: "Eligible home, no target event.",
        tone: "edge"
      },
      {
        id: "no-pump",
        label: "No sump pump",
        description: "The core premise does not hold.",
        tone: "warning"
      },
      {
        id: "wrong-water-cause",
        label: "Water from another cause",
        description: "Flooding occurred but not because the pump stopped.",
        tone: "outside"
      }
    ],
    controls: [
      {
        id: "plain-no",
        label: "Plain No",
        description: "Ask only whether water collected because the sump pump stopped.",
        effect: "No absorbs missing equipment and no failure."
      },
      {
        id: "pump-screener",
        label: "Pump screener",
        description: "Ask whether the home has a sump pump first.",
        effect: "No-pump homes leave the target denominator."
      },
      {
        id: "cause-followup",
        label: "Cause follow-up",
        description: "Ask whether water was caused by pump failure after eligibility.",
        effect: "Wrong-cause flooding stays separate."
      }
    ],
    cases: [
      {
        id: "no-sump-pump",
        title: "Basement, no pump",
        body: "The home has a basement but no sump pump.",
        reading: "No is true, but the equipment assumption is false.",
        provenance: "reported",
        defaultZoneId: "no-pump",
        tags: ["false premise", "equipment"],
        resultByControl: {
          "plain-no": {
            zoneId: "has-pump-no-failure",
            note: "Plain No can look like an eligible home with no pump failure."
          },
          "pump-screener": {
            zoneId: "no-pump",
            note: "The screener gives a clean no-pump route."
          },
          "cause-followup": {
            zoneId: "no-pump",
            note: "Cause follow-up still needs eligibility first."
          }
        }
      },
      {
        id: "pump-worked",
        title: "Pump worked",
        body: "The home has a sump pump and it worked during the outage.",
        reading: "No means no target event among eligible homes.",
        provenance: "source_grounded",
        defaultZoneId: "has-pump-no-failure",
        tags: ["eligible", "no failure"],
        resultByControl: {
          "plain-no": {
            zoneId: "has-pump-no-failure",
            note: "This is the clean No the item wants."
          },
          "pump-screener": {
            zoneId: "has-pump-no-failure",
            note: "Eligibility makes the No interpretable."
          },
          "cause-followup": {
            zoneId: "has-pump-no-failure",
            note: "The cause follow-up confirms no pump-failure event."
          }
        }
      },
      {
        id: "water-other-cause",
        title: "Water from seepage",
        body: "Water collected in the crawl space, but the pump did not stop working.",
        reading: "Flooding happened; the tested cause did not.",
        provenance: "teaching",
        defaultZoneId: "wrong-water-cause",
        tags: ["cause boundary", "water"],
        resultByControl: {
          "plain-no": {
            zoneId: "wrong-water-cause",
            note: "Plain No hides that water still collected."
          },
          "pump-screener": {
            zoneId: "wrong-water-cause",
            note: "Eligibility alone does not separate the cause."
          },
          "cause-followup": {
            zoneId: "wrong-water-cause",
            note: "A cause follow-up keeps wrong-cause water out of the pump-failure count."
          }
        }
      }
    ],
    repair: {
      title: "Screen the equipment before the event",
      lede:
        "The key repair is not prettier wording; it is the order of hidden premises.",
      options: [
        {
          id: "equipment-first",
          label: "Equipment first",
          headline: "Does this home have a sump pump?",
          body: "Establishes whether the later failure question can apply.",
          effects: [
            "Separates no-pump homes.",
            "Makes a later No interpretable.",
            "Still needs water/cause follow-up."
          ],
          caution: "Applicability is necessary but not sufficient."
        },
        {
          id: "no-pump-option",
          label: "Visible No route",
          headline: "No, this home does not have a sump pump",
          body: "Keeps ineligible homes from being treated as no-failure homes.",
          effects: [
            "Lower burden than a separate screener.",
            "Can still be missed if placed in help text."
          ],
          caution: "The route must be visible at the decision point."
        }
      ]
    },
    transfer: {
      title: "Apply it to generator use",
      prompt: "A question asks whether a generator failed. What should be checked first?",
      options: ["Whether the household has a generator", "Whether the household lost power", "Whether generators are expensive"],
      preferredIndex: 0,
      feedback:
        "False-premise review starts by making equipment ownership explicit."
    },
    sourceBoundary: {
      title: "What the source supports",
      body:
        "The source supports the need to make no-sump-pump applicability visible in the AHS flooding module.",
      limits: [
        "No claim about flooding prevalence.",
        "No validated complete module rewrite is provided.",
        "Some premise-stack homes are authored teaching cases."
      ]
    }
  },
  "ons-ethnic-group-heading": {
    kind: "heading_scanner",
    engine: {
      kind: "heading_scanner",
      interaction: "heading_scanner",
      actionLabel: "Scan cue",
      objectLabel: "Navigation case",
      surfaceLabel: "Heading scanner",
      feedbackLabel: "Section route"
    },
    title: "Watch a heading reroute the respondent across sections.",
    lede:
      "Choose the cue the respondent scans for first, then see which heading lights up.",
    stakes:
      "What the data can hide: color, geography, and national identity cues can send people to different sections.",
    reviewerGoal:
      "Watch each heading reroute the respondent; the alternate paths are stress routes, not ONS recommendations.",
    surfaceTitle: "Heading scanner",
    controlLabel: "First cue searched",
    caseLabel: "Navigation case",
    mapLabel: "Section route",
    instrumentNote:
      "The ONS source documents heading recommendations and the risk around African/Caribbean/Black/Black British wording.",
    zones: [
      {
        id: "black-heading",
        label: "Black / African / Caribbean heading",
        description: "The intended section for many Black identities.",
        tone: "target"
      },
      {
        id: "white-heading",
        label: "White heading",
        description: "A possible route when White is the first cue.",
        tone: "edge"
      },
      {
        id: "asian-heading",
        label: "Asian heading",
        description: "A nearby geographic/cultural section.",
        tone: "outside"
      },
      {
        id: "multi-route",
        label: "Multiple possible routes",
        description: "The heading does not settle the respondent's path.",
        tone: "warning"
      }
    ],
    controls: [
      {
        id: "color-cue",
        label: "Color cue",
        description: "The respondent scans for a color word (Black, White) first.",
        effect: "Color-named sections are found first."
      },
      {
        id: "geography-cue",
        label: "Geography cue",
        description: "The respondent scans for a place word (African, Caribbean, Asian) first.",
        effect: "Geography-named sections are found first."
      },
      {
        id: "both-cues",
        label: "Both at once",
        description: "The respondent weighs the color and geography cues together.",
        effect: "This is a hypothetical stress route, not an ONS-tested result."
      }
    ],
    cases: [
      {
        id: "black-african",
        title: "Black African",
        body: "A respondent identifies as Black African.",
        reading: "A color cue (Black) and a place cue (African) point to the same section.",
        provenance: "reported",
        defaultZoneId: "black-heading",
        tags: ["center", "reported"],
        resultByControl: {
          "color-cue": {
            zoneId: "black-heading",
            note: "The color cue Black lands in the intended section."
          },
          "geography-cue": {
            zoneId: "black-heading",
            note: "African also appears in the heading, so the place cue still works."
          },
          "both-cues": {
            zoneId: "black-heading",
            note: "Both cues point to the same section, so the heading holds."
          }
        }
      },
      {
        id: "mixed-white-asian",
        title: "Mixed: White and Asian",
        body: "A respondent identifies as mixed White and Asian, an official census Mixed category.",
        reading: "A color cue (White) and a place cue (Asian) point to different sections.",
        provenance: "teaching",
        defaultZoneId: "multi-route",
        tags: ["mixed heritage", "source boundary"],
        resultByControl: {
          "color-cue": {
            zoneId: "white-heading",
            note: "Scanning the color word White points toward the White section."
          },
          "geography-cue": {
            zoneId: "asian-heading",
            note: "Scanning the place word Asian points toward the Asian section."
          },
          "both-cues": {
            zoneId: "multi-route",
            note: "White and Asian cues point to different sections; the heading does not settle the path."
          }
        }
      },
      {
        id: "black-british",
        title: "Black British",
        body: "A respondent identifies as Black British.",
        reading: "The Black color cue is the first visible anchor.",
        provenance: "source_grounded",
        defaultZoneId: "black-heading",
        tags: ["center", "navigation"],
        resultByControl: {
          "color-cue": {
            zoneId: "black-heading",
            note: "The heading works for this center navigation route."
          },
          "geography-cue": {
            zoneId: "black-heading",
            note: "Black British sits inside the same heading."
          },
          "both-cues": {
            zoneId: "black-heading",
            note: "Both cues resolve to the same section for this case."
          }
        }
      }
    ],
    repair: {
      title: "Make navigation cues testable",
      lede:
        "Heading review should ask which cue respondents search for first and whether the section name supports that path.",
      options: [
        {
          id: "cue-stack",
          label: "Cue stack",
          headline: "Section heading lists the most searched cues in a tested order",
          body: "Treats heading order as navigation design rather than decoration.",
          effects: [
            "Supports first-cue testing.",
            "Surfaces multi-route cases.",
            "Does not settle classification policy."
          ],
          caution: "The mixed-heritage case here is a stress route, not a reported ONS test case."
        },
        {
          id: "write-in-safety",
          label: "Safety route",
          headline: "Keep a visible write-in or other route for unresolved paths",
          body: "Avoids forcing every complex identity into the heading text itself.",
          effects: [
            "Preserves an escape route.",
            "May reduce visibility compared with printed labels."
          ],
          caution: "A safety route is not the same as a clear primary route."
        }
      ]
    },
    transfer: {
      title: "Apply it to device sections",
      prompt: "A form section says Entertainment devices. A smart TV could fit several places. What do you test?",
      options: ["Which cue the respondent scans for first", "Whether the respondent owns many devices", "Whether the term is fashionable"],
      preferredIndex: 0,
      feedback:
        "Heading review is navigation review: what cue gets the person to the right section?"
    },
    sourceBoundary: {
      title: "Source boundary",
      body:
        "The source supports the heading concern and recommendation context. The mixed-heritage route is an authored stress case.",
      limits: [
        "No claim that ONS tested the mixed-heritage route as shown here.",
        "No universal heading order is endorsed.",
        "The scanner is an editorial abstraction."
      ]
    }
  },
  "avoid-natural-disasters": {
    kind: "reason_strength_board",
    engine: {
      kind: "reason_strength_board",
      interaction: "reason_lanes",
      actionLabel: "Set reason threshold",
      objectLabel: "Reason card",
      surfaceLabel: "Reason lanes",
      feedbackLabel: "Yes threshold"
    },
    title: "Weigh a primary cause against any contributing reason.",
    lede:
      "Move the reason across strength lanes before deciding whether Yes means main reason or any influence.",
    stakes:
      "What the data can hide: a secondary reason can become No under one sequence and Yes under another.",
    reviewerGoal:
      "Move each reason between the primary and any-contributing lanes; re-read the Yes.",
    surfaceTitle: "Reason-strength board",
    controlLabel: "Yes threshold",
    caseLabel: "Move reason",
    mapLabel: "Answer lane",
    instrumentNote:
      "The AHS source documents concerns that a yes/no moving-reason series can be read as main-reason only.",
    zones: [
      {
        id: "primary",
        label: "Primary reason",
        description: "The disaster risk was the main reason for moving.",
        tone: "target"
      },
      {
        id: "secondary",
        label: "Secondary influence",
        description: "Disaster risk mattered but was not the main reason.",
        tone: "edge"
      },
      {
        id: "forced-main",
        label: "Forced main-reason reading",
        description: "The respondent says No because Yes sounds too strong.",
        tone: "warning"
      },
      {
        id: "no-influence",
        label: "No influence",
        description: "Disaster risk did not affect the move.",
        tone: "outside"
      }
    ],
    controls: [
      {
        id: "main-only",
        label: "Main reason only",
        description: "Read Yes as only for the main reason.",
        effect: "Secondary influences are pushed toward No."
      },
      {
        id: "any-influence",
        label: "Any influence",
        description: "Read Yes as any reason that influenced the move.",
        effect: "Secondary influences can be Yes without exaggeration."
      },
      {
        id: "series-unclear",
        label: "Unclear series",
        description: "Ask a sequence of Yes/No reasons without the threshold.",
        effect: "Respondents infer the threshold from context."
      }
    ],
    cases: [
      {
        id: "small-factor",
        title: "Small storm-risk factor",
        body: "Lower rent was the main reason, but storm risk was part of the decision.",
        reading: "The respondent hesitates because Yes sounds like a stronger claim.",
        provenance: "reported",
        defaultZoneId: "secondary",
        tags: ["secondary", "threshold"],
        resultByControl: {
          "main-only": {
            zoneId: "forced-main",
            note: "Main-only wording turns a real influence into a likely No."
          },
          "any-influence": {
            zoneId: "secondary",
            note: "Any-influence wording lets the respondent answer Yes proportionately."
          },
          "series-unclear": {
            zoneId: "forced-main",
            note: "Without a threshold, the respondent may infer that Yes means main reason."
          }
        }
      },
      {
        id: "primary-risk",
        title: "Storm risk drove the move",
        body: "The household moved mainly to avoid recurring storm damage.",
        reading: "Yes is easy under either threshold.",
        provenance: "source_grounded",
        defaultZoneId: "primary",
        tags: ["primary", "center"],
        resultByControl: {
          "main-only": {
            zoneId: "primary",
            note: "The case clears even under the strict threshold."
          },
          "any-influence": {
            zoneId: "primary",
            note: "Any-influence also catches it."
          },
          "series-unclear": {
            zoneId: "primary",
            note: "A center case hides less threshold risk."
          }
        }
      },
      {
        id: "no-risk",
        title: "No disaster influence",
        body: "The household moved for school district reasons only.",
        reading: "Disaster avoidance was not part of the decision.",
        provenance: "teaching",
        defaultZoneId: "no-influence",
        tags: ["negative control"],
        resultByControl: {
          "main-only": {
            zoneId: "no-influence",
            note: "No is clean."
          },
          "any-influence": {
            zoneId: "no-influence",
            note: "No remains clean because there was no influence."
          },
          "series-unclear": {
            zoneId: "no-influence",
            note: "The threshold does not matter when the reason had no role."
          }
        }
      }
    ],
    repair: {
      title: "State the Yes threshold",
      lede:
        "The repair should say whether the item wants primary reasons, any influence, or something in between.",
      options: [
        {
          id: "any-reason",
          label: "Any influence",
          headline: "Answer Yes if this was one of the reasons you moved, even if it was not the main reason.",
          body: "Lets secondary motives be reported without overstating them.",
          effects: [
            "Reduces underreporting of secondary influences.",
            "Changes what a Yes means.",
            "Requires analysis to respect multi-reason data."
          ],
          caution: "Broader Yes rules must be visible in analysis labels."
        },
        {
          id: "main-reason",
          label: "Main reason",
          headline: "Was avoiding natural disasters the main reason you moved?",
          body: "Makes the strict threshold explicit.",
          effects: [
            "Cleaner primary-reason measure.",
            "Drops secondary influence information."
          ],
          caution: "A precise threshold can intentionally exclude useful influence data."
        }
      ]
    },
    transfer: {
      title: "Apply it to owner advertising",
      prompt: "A source helped a little after another source helped a lot. What rule matters?",
      options: ["Whether Yes means any contribution or the main contribution", "Whether the source was memorable", "Whether the source was online"],
      preferredIndex: 0,
      feedback:
        "Sequence-overlap review often turns on the threshold carried by Yes."
    },
    sourceBoundary: {
      title: "What the source supports",
      body:
        "The source supports the concern that respondents can read a moving-reason series as asking for main reasons only.",
      limits: [
        "No model of moving-cause prevalence is provided.",
        "No validated threshold wording is claimed.",
        "Secondary-reason lanes are editorial teaching aids."
      ]
    }
  },
  "acs-weeks-worked": {
    kind: "counting_workbench",
    engine: {
      kind: "counting_workbench",
      interaction: "counting_calendar",
      actionLabel: "Choose count method",
      objectLabel: "Work spell",
      surfaceLabel: "Counting calendar",
      feedbackLabel: "Method provenance"
    },
    title: "Pick the counting method before the number means anything.",
    lede:
      "Choose the counting method before reading the final number.",
    stakes:
      "What the data can hide: the same work history can become exact count, rounded guess, month conversion, or wrong method.",
    reviewerGoal:
      "Pick the counting method first; then read what the count actually reports.",
    surfaceTitle: "Weeks-worked counter",
    controlLabel: "Counting method",
    caseLabel: "Work history",
    mapLabel: "Number provenance",
    instrumentNote:
      "The ACS source documents difficulties with weeks-worked counting, including partial weeks and recall strategies.",
    zones: [
      {
        id: "exact-count",
        label: "Exact count",
        description: "Weeks can be counted directly from a stable history.",
        tone: "target"
      },
      {
        id: "conversion",
        label: "Conversion",
        description: "Months or spells are converted into weeks.",
        tone: "method"
      },
      {
        id: "rounded-guess",
        label: "Rounded guess",
        description: "The respondent estimates because recall is hard.",
        tone: "warning"
      },
      {
        id: "wrong-method",
        label: "Wrong method",
        description: "Days, partial weeks, or calendar assumptions are counted inconsistently.",
        tone: "outside"
      }
    ],
    controls: [
      {
        id: "calendar-weeks",
        label: "Calendar weeks",
        description: "Count each week in the 52-week reference period.",
        effect: "Best when work spells are known."
      },
      {
        id: "months-first",
        label: "Months first",
        description: "Recall months worked, then convert to weeks.",
        effect: "Helps memory but creates conversion method."
      },
      {
        id: "days-divided",
        label: "Days divided by five",
        description: "Turn worked days into approximate weeks.",
        effect: "Can generate a plausible but wrong method."
      },
      {
        id: "partial-week",
        label: "Partial-week cue",
        description: "Count any week with a few hours worked.",
        effect: "Clarifies inclusion but does not solve recall."
      }
    ],
    cases: [
      {
        id: "full-year",
        title: "Full-year stable work",
        body: "The person worked every week of the past year.",
        reading: "The count is direct: 52.",
        provenance: "teaching",
        defaultZoneId: "exact-count",
        tags: ["center", "52"],
        resultByControl: {
          "calendar-weeks": {
            zoneId: "exact-count",
            note: "Calendar-week counting is straightforward."
          },
          "months-first": {
            zoneId: "exact-count",
            note: "The conversion still lands on 52 for this center case."
          },
          "days-divided": {
            zoneId: "wrong-method",
            note: "Days divided by five is unnecessary and can distort partial weeks."
          },
          "partial-week": {
            zoneId: "exact-count",
            note: "Partial-week cue does not change the stable case."
          }
        }
      },
      {
        id: "seasonal-months",
        title: "Seasonal work by months",
        body: "The person remembers working from March through August but not each week.",
        reading: "Months are easier than weeks.",
        provenance: "reported",
        defaultZoneId: "conversion",
        tags: ["months", "recall"],
        resultByControl: {
          "calendar-weeks": {
            zoneId: "rounded-guess",
            note: "Calendar weeks require recall the person may not have."
          },
          "months-first": {
            zoneId: "conversion",
            note: "Months-first makes the recall aid visible but the result is converted."
          },
          "days-divided": {
            zoneId: "wrong-method",
            note: "Dividing days is the wrong route for month-spell memory."
          },
          "partial-week": {
            zoneId: "conversion",
            note: "Partial-week instructions help boundaries but do not remove conversion."
          }
        }
      },
      {
        id: "sporadic-days",
        title: "Sporadic day work",
        body: "The person worked scattered single days across many weeks.",
        reading: "They are tempted to add days and divide.",
        provenance: "source_grounded",
        defaultZoneId: "wrong-method",
        tags: ["partial weeks", "days"],
        resultByControl: {
          "calendar-weeks": {
            zoneId: "exact-count",
            note: "Counting weeks with any work can be exact if the weeks are recoverable."
          },
          "months-first": {
            zoneId: "rounded-guess",
            note: "Months do not capture scattered weeks well."
          },
          "days-divided": {
            zoneId: "wrong-method",
            note: "Days divided by five undercounts weeks with only one day worked."
          },
          "partial-week": {
            zoneId: "exact-count",
            note: "The partial-week cue tells the person to count weeks with any work."
          }
        }
      }
    ],
    repair: {
      title: "Carry the counting method with the answer",
      lede:
        "A better item can support recall without pretending every number has the same provenance.",
      options: [
        {
          id: "partial-cue",
          label: "Partial-week cue",
          headline: "Count any week in which this person worked even a few hours.",
          body: "Clarifies the inclusion rule for scattered work.",
          effects: [
            "Reduces days-divided-by-five errors.",
            "Still leaves recall difficulty for long histories.",
            "Makes the method more visible."
          ],
          caution: "A cue can improve method without validating every resulting number."
        },
        {
          id: "months-aid",
          label: "Recall aid",
          headline: "First think about the months or seasons worked, then count the weeks.",
          body: "Supports memory but marks the result as converted or estimated.",
          effects: [
            "Helps seasonal workers start.",
            "Can produce conversion rather than exact count."
          ],
          caution: "The interface should not hide converted estimates behind exact styling."
        }
      ]
    },
    transfer: {
      title: "Apply it to arrival weeks",
      prompt: "A person worked before and after moving. What should the reviewer carry forward?",
      options: ["The counting rule and provenance label", "The person's occupation", "The month of the move only"],
      preferredIndex: 0,
      feedback:
        "The important artifact is not only the number. It is how the number was produced."
    },
    sourceBoundary: {
      title: "What the source supports",
      body:
        "The source supports weeks-worked recall and partial-week counting issues in ACS testing.",
      limits: [
        "No replacement item is validated here.",
        "No adjustment from guesses to true weeks is computed.",
        "Counting labels are editorial teaching diagnostics."
      ]
    }
  }
};
