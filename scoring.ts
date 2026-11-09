import { AnalysisDimension, DimensionScoreDetail, ScoringWeights } from "@/types";

export const DEFAULT_SCORING_WEIGHTS: ScoringWeights = {
  vision: 20,
  pillars: 15,
  tone: 15,
  audience: 10,
  factual: 15,
  terminology: 5,
  visual: 10,
  accessibility: 5,
  promotional: 5,
};

export interface ScoreTier {
  label: string;
  min: number;
  max: number;
  color: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  description: string;
}

export const SCORE_TIERS: ScoreTier[] = [
  {
    label: "Excellent Alignment",
    min: 90,
    max: 100,
    color: "#10B981", // emerald-500
    badgeBg: "bg-emerald-500/10",
    badgeBorder: "border-emerald-500/20",
    badgeText: "text-emerald-400",
    description: "Fully aligned with brand identity and ready for publication with no material issues.",
  },
  {
    label: "Good Alignment",
    min: 75,
    max: 89,
    color: "#3B82F6", // blue-500
    badgeBg: "bg-blue-500/10",
    badgeBorder: "border-blue-500/20",
    badgeText: "text-blue-400",
    description: "Strong overall alignment; minor refinements recommended before final approval.",
  },
  {
    label: "Moderate Alignment",
    min: 60,
    max: 74,
    color: "#F59E0B", // amber-500
    badgeBg: "bg-amber-500/10",
    badgeBorder: "border-amber-500/20",
    badgeText: "text-amber-400",
    description: "Noticeable deviations detected. Review tone, claims or terminology before proceeding.",
  },
  {
    label: "Poor Alignment",
    min: 40,
    max: 59,
    color: "#F97316", // orange-500
    badgeBg: "bg-orange-500/10",
    badgeBorder: "border-orange-500/20",
    badgeText: "text-orange-400",
    description: "Significant off-brand elements, unsupported claims or tone mismatch requiring substantial revision.",
  },
  {
    label: "Critical Non-Alignment",
    min: 0,
    max: 39,
    color: "#EF4444", // red-500
    badgeBg: "bg-red-500/10",
    badgeBorder: "border-red-500/20",
    badgeText: "text-red-400",
    description: "Severe brand violation or prohibited topics/claims. Publication would jeopardize brand reputation.",
  },
];

export function getScoreTier(score: number): ScoreTier {
  const normalized = Math.max(0, Math.min(100, Math.round(score)));
  for (const tier of SCORE_TIERS) {
    if (normalized >= tier.min && normalized <= tier.max) {
      return tier;
    }
  }
  return SCORE_TIERS[SCORE_TIERS.length - 1];
}

/**
 * Calculates the overall weighted alignment score from individual dimension evaluations.
 * If a dimension could not be reliably evaluated, it is omitted from the denominator weight
 * so the score is never falsely penalized for unevaluated fields.
 */
export function calculateWeightedScore(
  dimensionScores: Record<AnalysisDimension, DimensionScoreDetail>,
  weights: ScoringWeights = DEFAULT_SCORING_WEIGHTS
): number {
  let weightedSum = 0;
  let activeWeightTotal = 0;

  const dimensions = Object.keys(weights) as AnalysisDimension[];

  for (const dim of dimensions) {
    const detail = dimensionScores[dim];
    const weight = weights[dim] || 0;

    if (detail && detail.evaluated) {
      weightedSum += (detail.score * weight);
      activeWeightTotal += weight;
    }
  }

  if (activeWeightTotal === 0) return 0;
  return Math.round((weightedSum / activeWeightTotal));
}

export const DIMENSION_METADATA: Record<
  AnalysisDimension,
  { label: string; description: string; iconName: string; defaultWeight: number }
> = {
  vision: {
    label: "Vision Alignment",
    description: "Supports long-term mission, core objectives and avoids prohibited topics",
    iconName: "Compass",
    defaultWeight: 20,
  },
  pillars: {
    label: "Content Pillar Alignment",
    description: "Maps directly into strategic pillars and thematic categories",
    iconName: "Layers",
    defaultWeight: 15,
  },
  tone: {
    label: "Tone & Voice",
    description: "Matches formality, cadence, attitude and emotional resonance",
    iconName: "Volume2",
    defaultWeight: 15,
  },
  audience: {
    label: "Audience Relevance",
    description: "Resonates with intended demographic pain points, interests and language",
    iconName: "Users",
    defaultWeight: 10,
  },
  factual: {
    label: "Factual Accuracy",
    description: "Aligns with official company knowledge base, approved stats and verified data",
    iconName: "CheckCircle2",
    defaultWeight: 15,
  },
  terminology: {
    label: "Terminology Consistency",
    description: "Uses approved naming conventions and rigorously eliminates forbidden words",
    iconName: "BookOpen",
    defaultWeight: 5,
  },
  visual: {
    label: "Visual Consistency",
    description: "Preserves palette, typography, logo safe zones and asset standards",
    iconName: "Palette",
    defaultWeight: 10,
  },
  accessibility: {
    label: "Accessibility Standards",
    description: "Evaluates text readability, contrast clarity, and sensory clarity",
    iconName: "Eye",
    defaultWeight: 5,
  },
  promotional: {
    label: "Promotional Claim Compliance",
    description: "Flags hyperbolic claims, unprovable absolutes, and required disclosures",
    iconName: "ShieldAlert",
    defaultWeight: 5,
  },
};
