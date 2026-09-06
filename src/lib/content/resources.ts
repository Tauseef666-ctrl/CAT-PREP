import type { ResourceEntry, RCPassage, DILRSet, ReadingItem, NoteEntry } from "../types";
import type { Question } from "../types";

export const RESOURCES: ResourceEntry[] = [
  {
    id: "res-official-cat",
    name: "CAT — Official Information (IIM CAT Website)",
    type: "website",
    category: "Official",
    source: "Official CAT admission website",
    url: "https://iimcat.ac.in",
    free: true,
    verified: true,
    note: "The only authoritative source for exam dates, pattern and notification. Always verify numbers here before trusting third parties.",
  },
  {
    id: "res-official-sample",
    name: "Official CAT Sample/Practice Papers",
    type: "pdf",
    category: "Official",
    source: "Official CAT website material",
    free: true,
    verified: true,
    note: "Official sample material published for candidates. Linked via the official site's candidate portal.",
  },
  {
    id: "res-iim-brochure",
    name: "IIM Admission Brochures",
    type: "website",
    category: "Official",
    source: "Individual IIM websites",
    free: true,
    verified: true,
    note: "Weightage, cutoffs and selection formulas differ per IIM — read each college's own brochure.",
  },
  {
    id: "res-rc-reading",
    name: "The Economist",
    type: "website",
    category: "Reading Habit",
    source: "The Economist",
    free: false,
    verified: true,
    note: "Editorial-length nonfiction passage — excellent RC stamina training.",
  },
  {
    id: "res-rc-aeon",
    name: "Aeon Essays",
    type: "website",
    category: "Reading Habit",
    source: "Aeon.co",
    free: true,
    verified: true,
    note: "Long-form philosophy/science essays that mirror CAT's abstract passage style.",
  },
  {
    id: "res-math-khan",
    name: "Khan Academy — Algebra & Arithmetic",
    type: "website",
    category: "Concept",
    source: "Khan Academy",
    url: "https://www.khanacademy.org",
    free: true,
    verified: true,
    note: "Free structured micro-videos for any weak conceptual corner.",
  },
  {
    id: "res-quants-tip",
    name: "Bodhee Prep — CAT Quant Concepts (Free Articles)",
    type: "website",
    category: "Articles",
    source: "Bodhee Prep",
    free: true,
    verified: true,
    note: "Free concept articles and formula sheets for QA topics.",
  },
  {
    id: "res-varc-wordpower",
    name: "Word Power Made Easy (Norman Lewis)",
    type: "book",
    category: "Vocabulary",
    source: "Publisher/Authorized retailers",
    free: false,
    verified: true,
    note: "Classic vocabulary builder. Buy or borrow a legitimate copy; do not use pirated PDFs.",
  },
];

// ---------- RC Passages ----------

const rcQ = (
  id: string,
  passageId: string,
  topicId: string,
  difficulty: 1 | 2 | 3 | 4 | 5 | 6,
  prompt: string,
  options: string[],
  correctIndex: number,
  explanation: string
): Question => ({
  id,
  section: "varc",
  topicId,
  chapterId: "varc-rc",
  difficulty,
  type: "mcq",
  prompt,
  options,
  correctIndex,
  explanation,
});

export const RC_PASSAGES: RCPassage[] = [
  {
    id: "rc-science-biodiversity",
    title: "The Quiet Economics of Biodiversity",
    domain: "Science",
    length: "Medium",
    difficulty: 3,
    estimatedMinutes: 10,
    passage:
      "Biodiversity is usually discussed in the language of loss — species lists, extinction rates, degraded habitats. Economists have tried for years to translate this loss into money, hoping that a price tag would sharpen political attention. The effort has succeeded unevenly. Valuation exercises reliably show that intact ecosystems provide billions of dollars in 'services' — pollination, flood buffering, soil renewal — yet the figures rarely survive contact with a budget debate. The reason may be less about arithmetic than about imagination. A hectare of forest is easy to price when it is converted into timber and hard to price when it is keeping a flood off a city street, because the second kind of value shows up on no balance sheet. The policy problem, then, is not that nature lacks value but that our accounting systems are built to see only the narrowest slice of it.",
    questions: [
      rcQ(
        "q-rc-sci-1",
        "rc-science-biodiversity",
        "varc-rc-main-idea",
        3,
        "The author's central argument is that:",
        [
          "Biodiversity loss is irreversible and accelerating worldwide.",
          "Nature's economic value is real but our accounting systems fail to capture most of it.",
          "Economists have successfully monetized ecosystem services.",
          "Forests are more valuable as timber than as protection.",
        ],
        1,
        "The passage builds toward the claim that value exists but accounting systems only see a narrow slice — the 'not that nature lacks value but that our systems are blind' sentence is the thesis."
      ),
      rcQ(
        "q-rc-sci-2",
        "rc-science-biodiversity",
        "varc-rc-tone",
        2,
        "The tone of the passage is best described as:",
        ["Sarcastic", "Analytical and measured", "Alarmist", "Celebratory"],
        1,
        "The author analyses valuation attempts with balance (successes and failures) — analytical and measured, not sarcastic or alarmist."
      ),
      rcQ(
        "q-rc-sci-3",
        "rc-science-biodiversity",
        "varc-rc-inference",
        3,
        "It can be inferred that the author would most likely agree with which statement?",
        [
          "Monetary valuation of nature is doomed and should be abandoned.",
          "Better accounting frameworks could surface environmental value that currently goes unseen.",
          "Pollination services are worth more than flood buffering.",
          "Debate in a budget office is the best forum for environmental decisions.",
        ],
        1,
        "The author treats valuation as useful but limited by the accounting frame, so improving the frame (rather than abandoning or celebrating it) is the consistent inference."
      ),
    ],
  },
  {
    id: "rc-history-illiterate",
    title: "On Medieval Book Ownership",
    domain: "History",
    length: "Short",
    difficulty: 3,
    estimatedMinutes: 8,
    passage:
      "Owning a book in the twelfth century was a statement of status, rarely of personal literacy. Manuscripts were expensive enough that a noble household might own a handful, and reading was typically performed aloud by a clerk to a listening family. The written word, in other words, functioned less as a private technology than as a public performance — a way of displaying learning that one need not personally possess. It is only when printing lowered the price of words that ownership and reading began to fuse into the private, silent act we now take for granted.",
    questions: [
      rcQ(
        "q-rc-hist-1",
        "rc-history-illiterate",
        "varc-rc-inference",
        3,
        "From the passage, it can be inferred that in the twelfth century:",
        [
          "most book owners could read fluently in private",
          "book ownership signalled wealth and learning, not necessarily personal literacy",
          "clergy owned most manuscripts",
          "books were printed at low cost",
        ],
        1,
        "The passage explicitly frames ownership as status 'rarely of personal literacy' — option 2 is a direct inference."
      ),
      rcQ(
        "q-rc-hist-2",
        "rc-history-illiterate",
        "varc-rc-main-idea",
        3,
        "The main idea is:",
        [
          "Reading has always been a private act.",
          "The invention of printing made books cheap.",
          "The relationship between owning and reading books became intimate only after printing lowered their price.",
          "Nobles disliked reading.",
        ],
        2,
        "The passage contrasts public performance with private reading, and credits printing for the fusion — the closing claim is the main idea."
      ),
    ],
  },
  {
    id: "rc-tech-sleep",
    title: "Screens, Sleep and the Adolescent Clock",
    domain: "Technology",
    length: "Medium",
    difficulty: 3,
    estimatedMinutes: 10,
    passage:
      "Adolescents get less sleep than a generation ago, and screens are the convenient villain. The evidence, however, is more interesting than a simple guilt verdict. Evening light — especially the short-wavelength light emitted by LED screens — does delay melatonin release, nudging the body clock later. But studies that actually manipulate screen use rarely find large effects, and many find teenagers delaying sleep anyway, on paper books, in conversation, in productive worry. The strongest correlate of short adolescent sleep turns out to be the school start time, a variable no app can fix. The moral is not that screens are innocent, only that blaming them makes for a satisfying story with suboptimal payload.",
    questions: [
      rcQ(
        "q-rc-tech-1",
        "rc-tech-sleep",
        "varc-rc-strong-weak",
        3,
        "Which finding would most weaken the passage author's position?",
        [
          "A study where screen-free students still slept less than older cohorts.",
          "A controlled experiment showing screen removal alone restored full sleep in most teenagers.",
          "Data showing school start times were unchanged while sleep declined.",
          "Evidence that adults also lost sleep in the same period.",
        ],
        1,
        "The author argues screens are a minor factor; a large causal effect from screen removal would directly contradict the stance."
      ),
      rcQ(
        "q-rc-tech-2",
        "rc-tech-sleep",
        "varc-rc-fact-inference",
        2,
        "Which of these is stated as a fact in the passage?",
        [
          "Screens are the main cause of adolescent sleep loss.",
          "LED screens delay melatonin release.",
          "Paper books delay sleep more than screens.",
          "School start times change melatonin.",
        ],
        1,
        "The melatonin delay is 'namely, does delay melatonin release' — explicitly stated. The others are opinion, contrast or unmentioned."
      ),
    ],
  },
];

// ---------- DILR Sets ----------

export const DILR_SETS: DILRSet[] = [
  {
    id: "set-cricket-schedule",
    chapterId: "dilr-lr",
    title: "Tournament — Six Teams, Six Days",
    statement:
      "Six teams — A through F — play exactly one match each on each of six days. Every team plays every other team exactly once across the tournament (round robin). The results table below records wins (W), losses (L) and the final points. Each win earns 2 points, a loss earns 0, and there are no draws.",
    dataBlocks: [
      "Standings after the full tournament (points, not matches, shown): A: 10 pts, B: 8 pts, C: 6 pts, D: 4 pts, E: 2 pts, F: 0 pts.",
      "Every team played exactly 5 matches.",
    ],
    questions: [
      {
        id: "q-set-tour-1",
        section: "dilr",
        topicId: "dilr-lr-tournaments",
        chapterId: "dilr-lr",
        difficulty: 3,
        type: "mcq",
        set: "set-cricket-schedule",
        prompt: "How many wins did B record across the tournament?",
        options: ["2", "3", "4", "5"],
        correctIndex: 2,
        explanation: "B has 8 points at 2 points per win, with no draws: 8 / 2 = 4 wins.",
      },
    ],
    hints: [
      "Convert every points tally into wins: points ÷ 2 = wins, since there are no draws.",
      "Check that wins across all teams sum to the total number of matches (15).",
      "Use the points column alone — you do not need the match-by-match results for the first questions.",
    ],
    fullSolution: [
      "No draws → points = 2 × wins for every team.",
      "Wins: A=5, B=4, C=3, D=2, E=1, F=0. Total wins = 15 = total matches (6C2) ✓ consistent.",
    ],
    alternativeApproach: ["Cross-check with losses: losses = 5 − wins for each team."],
    difficulty: 3,
    estimatedMinutes: 12,
    domain: "Tournaments",
  },
];

// ---------- Reading items (Daily Reading) ----------

export const READING_ITEMS: ReadingItem[] = [
  {
    id: "read-econ-1",
    title: "Why inflation feels worse than the statistics",
    source: "The Economist",
    url: "https://www.economist.com/",
    readingMinutes: 8,
    domain: "varc",
    category: "Economics",
    completed: false,
    comprehension: [
      { question: "What explains the gap between perceived and measured inflation?", answer: "Basket composition and the salience of frequently bought goods." },
      { question: "How might policymakers respond per the article?", answer: "Acknowledge perception gaps and weight communication accordingly." },
    ],
  },
  {
    id: "read-aeon-1",
    title: "The limits of cognitive bias folklore",
    source: "Aeon",
    url: "https://aeon.co/",
    readingMinutes: 10,
    domain: "varc",
    category: "Psychology",
    completed: false,
    comprehension: [
      { question: "What does the author claim about famous bias studies?", answer: "Many rest on small samples and fail to replicate." },
      { question: "What is the suggested corrective?", answer: "Heterogeneity, pre-registration and humility about generalization." },
    ],
  },
  {
    id: "read-safe-1",
    title: "The economics of open offices",
    source: "The Economist",
    url: "https://www.economist.com/",
    readingMinutes: 7,
    domain: "varc",
    category: "Business",
    completed: false,
    comprehension: [
      { question: "Why do open offices persist despite weak evidence?", answer: "Lower cost per square foot and symbolic 'collaboration' branding." },
      { question: "What did interaction studies actually find?", answer: "Often fewer face-to-face conversations than in closed offices." },
    ],
  },
];

// ---------- Seed Notes ----------

export const SEED_NOTES: NoteEntry[] = [
  {
    id: "note-percent-1",
    topicId: "qa-arithmetic-percentages",
    title: "Percentages — one-page revision",
    content:
      "x% of y = y% of x\n\nCommon conversions: 1/3=33.33%, 1/4=25%, 1/5=20%, 1/6=16.67%, 1/8=12.5%, 1/9=11.11%\n\nSuccessive change: x + y + xy/100\n\nA increased vs B decreased bases: A is 25% more than B → B is 20% less than A.",
    type: "concept",
    bookmarked: false,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "note-formula-1",
    topicId: "qa-arithmetic-profit-loss",
    title: "Profit-Loss factor chain",
    content:
      "Assume CP = 100, then MP = CP(1+m%), SP = MP(1−d%).\n\nNet% = x + y + xy/100 for mark-up then discount.\n\nSP = CP(1+p%) or CP(1−l%).",
    type: "formula",
    bookmarked: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "note-varc-1",
    topicId: "varc-rc-elimination",
    title: "RC elimination checklist",
    content:
      "1. Beyond scope?\n2. Contradicts text?\n3. Absolute qualifier (all/never/only)?\n4. Word-bait (same words, different claim)?\n5. Quantifier distortion (some vs most)?",
    type: "shortcut",
    bookmarked: false,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
];