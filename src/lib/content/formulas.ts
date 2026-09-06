import type { FormulaEntry } from "../types";

// Every formula is standard CAT curriculum. Each carries a one-line worked example,
// as required. No dubious "shortcuts" are included.
export const FORMULAS: FormulaEntry[] = [
  // Arithmetic
  { id: "f-percent-1", section: "qa", category: "Arithmetic", topicId: "qa-arithmetic-percentages", name: "Percentage", formula: "x% of y = (x/100) × y", example: "20% of 150 = 30" },
  { id: "f-percent-2", section: "qa", category: "Arithmetic", topicId: "qa-arithmetic-percentages", name: "Change %", formula: "Change% = (Change / Original) × 100", example: "₹50 → ₹60 gives +20%" },
  { id: "f-percent-3", section: "qa", category: "Arithmetic", topicId: "qa-arithmetic-successive-percent", name: "Successive change", formula: "Net% = x + y + xy/100", example: "+10% then +20% → +32%" },
  { id: "f-pnl-1", section: "qa", category: "Arithmetic", topicId: "qa-arithmetic-profit-loss", name: "Profit", formula: "Profit% = (SP − CP)/CP × 100", example: "CP 80, SP 100 → 25%" },
  { id: "f-pnl-2", section: "qa", category: "Arithmetic", topicId: "qa-arithmetic-marked-price", name: "Discount chain", formula: "SP = MP × (1 − d₁/100) × (1 − d₂/100)", example: "2000 −10% −20% → 1440" },
  { id: "f-si-1", section: "qa", category: "Arithmetic", topicId: "qa-arithmetic-si", name: "Simple Interest", formula: "SI = P×R×T/100", example: "10000 at 8% for 2y → 1600" },
  { id: "f-ci-1", section: "qa", category: "Arithmetic", topicId: "qa-arithmetic-ci", name: "Compound Interest", formula: "A = P(1 + R/100)^T", example: "10000 at 10% 2y → 12100" },
  { id: "f-ratio-1", section: "qa", category: "Arithmetic", topicId: "qa-arithmetic-ratio-proportion", name: "Ratio division", formula: "a:b :: c:d ⟹ ad = bc", example: "2:3 = 4:6" },
  { id: "f-avg-1", section: "qa", category: "Arithmetic", topicId: "qa-arithmetic-averages", name: "Average", formula: "Average = Sum / Count", example: "10,20,30 → 20" },
  { id: "f-mix-1", section: "qa", category: "Arithmetic", topicId: "qa-arithmetic-mixtures", name: "Alligation", formula: "Cheap:Dear = (d−m):(m−c)", example: "20%&50% → 35% => 1:1" },
  { id: "f-tw-1", section: "qa", category: "Arithmetic", topicId: "qa-arithmetic-time-work", name: "Combined work", formula: "Time = ab/(a+b) for two workers", example: "6 and 12 days → 4 days" },
  { id: "f-tsd-1", section: "qa", category: "Arithmetic", topicId: "qa-arithmetic-tsd", name: "Speed", formula: "Speed = Distance / Time", example: "60 km in 1.5h → 40 km/h" },
  { id: "f-tsd-2", section: "qa", category: "Arithmetic", topicId: "qa-arithmetic-tsd", name: "km/h to m/s", formula: "×5/18", example: "18 km/h = 5 m/s" },
  { id: "f-boats-1", section: "qa", category: "Arithmetic", topicId: "qa-arithmetic-boats", name: "Boats & streams", formula: "b = (v↓+v↑)/2, s = (v↓−v↑)/2", example: "18 & 12 → b=15, s=3" },
  { id: "f-clock-1", section: "qa", category: "Arithmetic", topicId: "qa-arithmetic-clocks", name: "Clock angle", formula: "|30H − 5.5M|°", example: "4:30 → 45°" },
  { id: "f-calc-1", section: "qa", category: "Arithmetic", topicId: "qa-arithmetic-calendars", name: "Odd days", formula: "Day = base + odd-days mod 7", example: "normal year → +1 day" },

  // Algebra
  { id: "f-alg-1", section: "qa", category: "Algebra", topicId: "qa-algebra-identities", name: "Square identity", formula: "(a+b)² = a² + 2ab + b²", example: "(x+3)² = x² + 6x + 9" },
  { id: "f-alg-2", section: "qa", category: "Algebra", topicId: "qa-algebra-identities", name: "Diff of squares", formula: "a² − b² = (a+b)(a−b)", example: "49 − 9 = 40" },
  { id: "f-alg-3", section: "qa", category: "Algebra", topicId: "qa-algebra-identities", name: "x + 1/x", formula: "x² + 1/x² = (x + 1/x)² − 2", example: "x+1/x=5 → value 23" },
  { id: "f-alg-4", section: "qa", category: "Algebra", topicId: "qa-algebra-quadratic", name: "Quadratic roots", formula: "x = (−b ± √D)/2a", example: "x²−5x+6=0 → x=2,3" },
  { id: "f-alg-5", section: "qa", category: "Algebra", topicId: "qa-algebra-quadratic", name: "Root relations", formula: "Sum = −b/a, Product = c/a", example: "x²−6x+8 → 6, 8" },
  { id: "f-alg-6", section: "qa", category: "Algebra", topicId: "qa-algebra-logarithms", name: "Log laws", formula: "log aⁿ = n log a; log(ab) = log a + log b", example: "log₂8 = 3" },
  { id: "f-alg-7", section: "qa", category: "Algebra", topicId: "qa-algebra-exponents", name: "Exponent laws", formula: "aᵐ·aⁿ = aᵐ⁺ⁿ; (aᵐ)ⁿ = aᵐⁿ", example: "2³·2² = 32" },
  { id: "f-alg-8", section: "qa", category: "Algebra", topicId: "qa-algebra-gp", name: "GP sum to ∞", formula: "S∞ = a/(1−r), |r|<1", example: "1+½+¼+… = 2" },
  { id: "f-alg-9", section: "qa", category: "Algebra", topicId: "qa-algebra-ap", name: "AP sum", formula: "Sₙ = n/2(2a + (n−1)d)", example: "1..10 sum = 55" },
  { id: "f-alg-10", section: "qa", category: "Algebra", topicId: "qa-algebra-max-min", name: "AM–GM", formula: "(a+b)/2 ≥ √(ab), equality a=b", example: "x+y=20 → max xy=100" },

  // Number System
  { id: "f-num-1", section: "qa", category: "Number System", topicId: "qa-num-factors-multiples", name: "Factor count", formula: "d(N) = Π(eᵢ+1)", example: "72=2³3² → 12 factors" },
  { id: "f-num-2", section: "qa", category: "Number System", topicId: "qa-num-hcf-lcm", name: "HCF × LCM", formula: "HCF·LCM = a·b", example: "4 & 6 → HCF2 LCM12" },
  { id: "f-num-3", section: "qa", category: "Number System", topicId: "qa-num-factorial", name: "Trailing zeros", formula: "Σ ⌊n/5ᵏ⌋", example: "100! → 24 zeros" },
  { id: "f-num-4", section: "qa", category: "Number System", topicId: "qa-num-sum-factors", name: "Sum of factors", formula: "σ(N) = Π (p^(e+1)−1)/(p−1)", example: "12 → 28" },
  { id: "f-num-5", section: "qa", category: "Number System", topicId: "qa-num-divisibility", name: "9-test", formula: "digit-sum ÷ 9", example: "738 → 18 → divisible" },

  // Geometry
  { id: "f-geo-1", section: "qa", category: "Geometry", topicId: "qa-geo-triangles", name: "Triangle exterior", formula: "Exterior = sum of remote interiors", example: "50°+60° → 110°" },
  { id: "f-geo-2", section: "qa", category: "Geometry", topicId: "qa-geo-pythagoras", name: "Pythagoras", formula: "a² + b² = c²", example: "3,4 → 5" },
  { id: "f-geo-3", section: "qa", category: "Geometry", topicId: "qa-geo-similarity", name: "Similar areas", formula: "Area ratio = (side ratio)²", example: "2:3 → 4:9" },
  { id: "f-geo-4", section: "qa", category: "Geometry", topicId: "qa-geo-polygons", name: "Polygon angle", formula: "Σ interior = (n−2)×180°", example: "hexagon → 720°" },
  { id: "f-geo-5", section: "qa", category: "Geometry", topicId: "qa-geo-circles", name: "Circle", formula: "C = 2πr, A = πr²", example: "r=7 → C=14π, A=49π" },
  { id: "f-geo-6", section: "qa", category: "Geometry", topicId: "qa-geo-chords", name: "Power of point", formula: "PA·PB = PT²", example: "PA4, PB9 → PT=6" },

  // Mensuration
  { id: "f-mens-1", section: "qa", category: "Mensuration", topicId: "qa-mens-3d", name: "Cylinder", formula: "V=πr²h; TSA=2πr(r+h)", example: "r7 h10 → 490π" },
  { id: "f-mens-2", section: "qa", category: "Mensuration", topicId: "qa-mens-cone", name: "Cone", formula: "V=πr²h/3; l=√(r²+h²)", example: "r3 h4 → l=5" },
  { id: "f-mens-3", section: "qa", category: "Mensuration", topicId: "qa-mens-sphere", name: "Sphere", formula: "V=4πr³/3; SA=4πr²", example: "r3 → V=36π" },
  { id: "f-mens-4", section: "qa", category: "Mensuration", topicId: "qa-mens-frustum", name: "Frustum", formula: "V=(πh/3)(R²+Rr+r²)", example: "R10 r5 h9 → 525π" },

  // Modern Math
  { id: "f-pnc-1", section: "qa", category: "Permutation & Combination", topicId: "qa-mod-permutations", name: "Permutation", formula: "nPr = n!/(n−r)!", example: "5P3 = 60" },
  { id: "f-pnc-2", section: "qa", category: "Permutation & Combination", topicId: "qa-mod-combinations", name: "Combination", formula: "nCr = n!/r!(n−r)!", example: "8C3 = 56" },
  { id: "f-pnc-3", section: "qa", category: "Permutation & Combination", topicId: "qa-mod-probability", name: "At least one", formula: "P(≥1) = 1 − P(0)", example: "2 dice, P(≥1 six)=11/36" },
  { id: "f-set-1", section: "qa", category: "Permutation & Combination", topicId: "qa-mod-set-theory", name: "Two sets", formula: "n(A∪B) = nA + nB − n(A∩B)", example: "30,20,10 → 40" },

  // DILR
  { id: "f-di-1", section: "dilr", category: "Data Interpretation", topicId: "dilr-di-pie", name: "Pie share", formula: "category% = angle/360 × 100", example: "90° → 25%" },
  { id: "f-lr-1", section: "dilr", category: "Logical Reasoning", topicId: "dilr-lr-tournaments", name: "League matches", formula: "Matches = nC2 (round robin)", example: "4 teams → 6 matches" },
  { id: "f-lr-2", section: "dilr", category: "Logical Reasoning", topicId: "dilr-lr-tournaments", name: "Knockout games", formula: "Games = n − 1", example: "8 entrants → 7 games" },
];