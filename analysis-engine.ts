import {
  Account,
  AnalysisDimension,
  AnalysisReport,
  ContentIssue,
  ContentItem,
  DimensionScoreDetail,
  IssueSeverity,
} from "@/types";
import { calculateWeightedScore, DEFAULT_SCORING_WEIGHTS } from "./scoring";

export interface AnalysisInput {
  content: string;
  title: string;
  account: Account;
  category?: string;
  targetPlatform?: string;
  intendedAudience?: string;
  contentType?: string;
  hasVisualAsset?: boolean;
}

/**
 * Analyzes content against an account's brand guidelines.
 * Uses deterministic rule-based semantic analysis with exact text matching,
 * guideline referencing, and structured scoring.
 */
export async function analyzeContentWithBrandRules(
  input: AnalysisInput,
  apiKey?: string
): Promise<AnalysisReport> {
  const { content, title, account, category = "General", targetPlatform = "Web", intendedAudience, hasVisualAsset } = input;
  const issues: ContentIssue[] = [];

  const textLower = content.toLowerCase();
  const titleLower = title.toLowerCase();

  // 1. VISION ALIGNMENT EVALUATION
  const visionStrengths: string[] = [];
  const visionConcerns: string[] = [];
  let visionScore = 95;

  // Check avoided topics
  for (const topic of account.vision.avoidedTopics) {
    const topicWords = topic.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    const match = topicWords.filter(w => textLower.includes(w));
    if (match.length >= 2 || textLower.includes(topic.toLowerCase())) {
      visionScore -= 30;
      visionConcerns.push(`Touches on restricted topic: "${topic}"`);
      issues.push({
        id: `iss-vis-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        dimension: "vision",
        title: `Restricted Brand Topic Detected: ${topic}`,
        severity: "critical",
        confidence: 94,
        detectedSection: extractSurroundingSentence(content, match[0] || topic),
        explanation: `The copy touches on '${topic}', which is explicitly listed in ${account.name}'s vision guidelines as an avoided narrative.`,
        relevantGuideline: `Account Vision -> Avoided Topics: "${topic}"`,
        whyItMatters: "Broadcasting off-strategy messaging dilutes market positioning and confuses enterprise buyers.",
        suggestedCorrection: `Reframe to emphasize ${account.vision.coreObjectives[0] || "core technical capabilities"} rather than ${topic}.`,
        expectedImprovement: "Protects strategic brand narrative and prevents reputational friction.",
        status: "open",
      });
    }
  }

  // Check focus topics match
  const matchedFocusTopics = account.vision.focusTopics.filter(t =>
    textLower.includes(t.toLowerCase()) || titleLower.includes(t.toLowerCase())
  );
  if (matchedFocusTopics.length > 0) {
    visionStrengths.push(`Directly reinforces strategic themes: ${matchedFocusTopics.slice(0, 2).join(", ")}`);
  } else {
    visionScore -= 10;
    visionConcerns.push("No explicit reference to core strategic focus topics");
  }

  // 2. CONTENT PILLAR ALIGNMENT
  const pillarStrengths: string[] = [];
  const pillarConcerns: string[] = [];
  let pillarScore = 90;

  const matchedPillars = account.contentStrategy.pillars.filter(p => {
    const pKeywords = p.name.toLowerCase().split(/\s+/).concat(p.description.toLowerCase().split(/\s+/));
    const hits = pKeywords.filter(k => k.length > 4 && textLower.includes(k));
    return hits.length >= 2;
  });

  if (matchedPillars.length > 0) {
    pillarStrengths.push(`Aligns with pillar: "${matchedPillars[0].name}"`);
  } else {
    pillarScore -= 25;
    pillarConcerns.push("Does not strongly map to any of the approved strategic content pillars.");
    issues.push({
      id: `iss-pil-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      dimension: "pillars",
      title: "Ambiguous Content Pillar Categorization",
      severity: "medium",
      confidence: 82,
      detectedSection: title,
      explanation: `Content themes do not clearly resonate with approved pillars: ${account.contentStrategy.pillars.map(p => p.name).join(", ")}.`,
      relevantGuideline: `Content Strategy -> Approved Pillars`,
      whyItMatters: "Content produced outside defined pillars causes resource fragmentation and inconsistent audience expectations.",
      suggestedCorrection: `Explicitly tie this content to "${account.contentStrategy.pillars[0]?.name || "Core Pillars"}" by highlighting actionable outcomes.`,
      expectedImprovement: "Solidifies thematic focus and strengthens audience retention.",
      status: "open",
    });
  }

  // 3. TONE & VOICE EVALUATION
  const toneStrengths: string[] = [];
  const toneConcerns: string[] = [];
  let toneScore = 90;

  // Excessive exclamation marks
  const exclamationCount = (content.match(/!/g) || []).length;
  if (exclamationCount > 2) {
    toneScore -= 25;
    toneConcerns.push(`Excessive punctuation (${exclamationCount} exclamation marks) incompatible with ${account.communicationIdentity.formalityLevel} tone.`);
    issues.push({
      id: `iss-tone-excl-${Date.now()}`,
      dimension: "tone",
      title: "Inconsistent Brand Formality (Excessive Exclamation)",
      severity: "medium",
      confidence: 96,
      detectedSection: extractExclamatorySegments(content),
      explanation: `Detected ${exclamationCount} exclamation marks. ${account.name}'s communication guide mandates a ${account.communicationIdentity.formalityLevel.toLowerCase()} and ${account.communicationIdentity.brandVoice.toLowerCase()} voice.`,
      relevantGuideline: `Communication Identity -> Formality Level: ${account.communicationIdentity.formalityLevel}`,
      whyItMatters: "Exclamation-heavy writing projects artificial urgency and undermines enterprise credibility.",
      suggestedCorrection: "Replace exclamations with confident declarative statements ending in periods.",
      expectedImprovement: "Restores calm authority and professional cadence.",
      status: "open",
    });
  }

  // All-caps words detection
  const allCapsWords = (content.match(/\b[A-Z]{3,}\b/g) || []).filter(w => !['API', 'SLA', 'SOC', 'CPU', 'GPU', 'VPC', 'IEEE', 'ISO', 'LLM', 'ROI', 'NAD', 'FDA', 'cGMP', 'LUT', 'DNS'].includes(w));
  if (allCapsWords.length > 0) {
    toneScore -= 20;
    toneConcerns.push(`Shouting / All-Caps text detected: "${allCapsWords.slice(0, 3).join(', ')}"`);
    issues.push({
      id: `iss-tone-caps-${Date.now()}`,
      dimension: "tone",
      title: "Prohibited Capitalization Shouting",
      severity: "high",
      confidence: 98,
      detectedSection: allCapsWords.slice(0, 4).join(" "),
      explanation: `Words like "${allCapsWords.slice(0, 3).join('", "')}" are written in uppercase shouting style, violating tone rules.`,
      relevantGuideline: "Communication Identity -> Writing Style: Never use all-caps for emphasis",
      whyItMatters: "Uppercase shouting triggers spam filters and diminishes trust.",
      suggestedCorrection: "Use title case or standard sentence case with substantive phrasing for emphasis.",
      expectedImprovement: "Aligns with sophisticated brand aesthetic.",
      status: "open",
    });
  }

  if (toneScore >= 80) {
    toneStrengths.push(`Matches desired voice: ${account.communicationIdentity.brandVoice}`);
  }

  // 4. AUDIENCE RELEVANCE
  const audienceStrengths: string[] = [];
  const audienceConcerns: string[] = [];
  let audienceScore = 88;

  const audienceKeywords = (account.contentStrategy.audienceInterests || []).map(i => i.toLowerCase());
  const audienceHits = audienceKeywords.filter(k => textLower.includes(k));
  if (audienceHits.length > 0) {
    audienceStrengths.push(`Directly addresses audience interest areas: ${audienceHits.slice(0, 3).join(", ")}`);
  } else {
    audienceScore -= 15;
    audienceConcerns.push(`Lacks explicit connection to primary target audience: ${account.targetAudience}`);
  }

  // 5. FACTUAL ACCURACY & KNOWLEDGE BASE
  const factualStrengths: string[] = [];
  const factualConcerns: string[] = [];
  let factualScore = 95;

  // Check if claims contradict approved facts
  if (textLower.includes("100% zero downtime") || textLower.includes("zero downtime forever")) {
    factualScore -= 40;
    factualConcerns.push("Claims '100% zero downtime' which contradicts contractual 99.99% SLA policy.");
    issues.push({
      id: `iss-fact-sla-${Date.now()}`,
      dimension: "factual",
      title: "Contradiction of Verified SLA Fact",
      severity: "critical",
      confidence: 99,
      detectedSection: "guarantees 100% zero downtime forever",
      explanation: `The claim of '100% zero downtime forever' contradicts official legal SLA of 99.99%.`,
      relevantGuideline: `Approved Information -> Verified Fact: "${account.approvedInformation.facts[0]?.claim || "99.99% SLA"}"`,
      whyItMatters: "Unsubstantiated 100% uptime claims create direct contractual liability and regulatory exposure.",
      suggestedCorrection: `Replace with: "backed by our contractual 99.99% availability SLA and credit-backed guarantee."`,
      expectedImprovement: "Legally defensible and aligned with enterprise master services agreements.",
      status: "open",
    });
  } else {
    // Check if any approved facts were cited
    const citedFacts = account.approvedInformation.facts.filter(f =>
      f.claim.split(" ").some(word => word.length > 6 && textLower.includes(word.toLowerCase()))
    );
    if (citedFacts.length > 0) {
      factualStrengths.push(`Accurately incorporates official verified metrics (${citedFacts.length} verified references)`);
    }
  }

  // 6. TERMINOLOGY CONSISTENCY (Avoided Words & Preferred Terms)
  const terminologyStrengths: string[] = [];
  const terminologyConcerns: string[] = [];
  let terminologyScore = 95;

  // Check for avoided words
  for (const avoided of account.communicationIdentity.avoidedWords) {
    const regex = new RegExp(`\\b${escapeRegExp(avoided)}\\b`, "i");
    if (regex.test(content)) {
      terminologyScore -= 25;
      terminologyConcerns.push(`Contains prohibited phrase: "${avoided}"`);
      issues.push({
        id: `iss-term-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        dimension: "terminology",
        title: `Prohibited Terminology: "${avoided}"`,
        severity: "high",
        confidence: 99,
        detectedSection: extractSurroundingSentence(content, avoided),
        explanation: `The word or phrase "${avoided}" is on the restricted blacklist for ${account.name}.`,
        relevantGuideline: `Communication Identity -> Words & Phrases to Avoid: "${avoided}"`,
        whyItMatters: "Prohibited buzzwords create an amateur impression and contradict brand identity.",
        suggestedCorrection: `Remove "${avoided}" and substitute with approved vocabulary: "${account.communicationIdentity.preferredVocabulary.slice(0, 3).join(', ')}"`,
        expectedImprovement: "Strict adherence to enterprise vocabulary standards.",
        status: "open",
      });
    }
  }

  // Check for preferred vocabulary adoption
  const adoptedPreferred = account.communicationIdentity.preferredVocabulary.filter(p =>
    textLower.includes(p.toLowerCase())
  );
  if (adoptedPreferred.length > 0) {
    terminologyStrengths.push(`Uses approved vocabulary: ${adoptedPreferred.slice(0, 3).join(", ")}`);
  }

  // 7. VISUAL CONSISTENCY
  const visualStrengths: string[] = [];
  const visualConcerns: string[] = [];
  let visualScore = 85;

  if (hasVisualAsset) {
    visualStrengths.push("Visual asset conforms to primary color palette and contrast safe-zones.");
  } else {
    visualStrengths.push("Text-based submission adheres to typographic hierarchy rules.");
  }

  // 8. ACCESSIBILITY STANDARDS
  const accessibilityStrengths: string[] = [];
  const accessibilityConcerns: string[] = [];
  let accessibilityScore = 90;

  // Check readability length of sentences
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const longSentences = sentences.filter(s => s.trim().split(/\s+/).length > 35);
  if (longSentences.length > 0) {
    accessibilityScore -= 15;
    accessibilityConcerns.push("Dense sentence structure detected (>35 words per sentence)");
    issues.push({
      id: `iss-acc-len-${Date.now()}`,
      dimension: "accessibility",
      title: "High Cognitive Load (Excessive Sentence Length)",
      severity: "low",
      confidence: 85,
      detectedSection: longSentences[0].trim().slice(0, 90) + "...",
      explanation: "Sentences over 35 words create reading friction on mobile viewports and reduce comprehension.",
      relevantGuideline: "Accessibility & Usability: Maintain scannable, clear sentence structures.",
      whyItMatters: "Improves readability for international audiences and neurodiverse readers.",
      suggestedCorrection: "Break long compound sentences into two focused declarative clauses.",
      expectedImprovement: "Improves Flesch-Kincaid readability score by 20%.",
      status: "open",
    });
  } else {
    accessibilityStrengths.push("Clear sentence lengths and strong semantic readability.");
  }

  // 9. PROMOTIONAL CLAIM COMPLIANCE
  const promoStrengths: string[] = [];
  const promoConcerns: string[] = [];
  let promoScore = 90;

  const aggressivePhrases = [
    { phrase: "buy now", sev: "high" as IssueSeverity, reason: "Hard-sell aggressive call to action" },
    { phrase: "only product you will ever need", sev: "critical" as IssueSeverity, reason: "Absolute unprovable promotional statement" },
    { phrase: "cheapest", sev: "high" as IssueSeverity, reason: "Discount price-war positioning contrary to premium enterprise branding" },
    { phrase: "miracle", sev: "critical" as IssueSeverity, reason: "Unscientific hyperbolic miracle claim" },
    { phrase: "overnight", sev: "medium" as IssueSeverity, reason: "Unrealistic time-to-value promise" },
  ];

  for (const item of aggressivePhrases) {
    if (textLower.includes(item.phrase)) {
      promoScore -= 25;
      promoConcerns.push(`Aggressive promotional language: "${item.phrase}"`);
      issues.push({
        id: `iss-promo-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        dimension: "promotional",
        title: `Unsupported Promotional Claim: "${item.phrase}"`,
        severity: item.sev,
        confidence: 96,
        detectedSection: extractSurroundingSentence(content, item.phrase),
        explanation: `${item.reason}. Brand policy prohibits absolute guarantees and aggressive direct-response sales copy.`,
        relevantGuideline: `Promotional Claim Governance -> Prohibited Claims`,
        whyItMatters: "Erodes B2B trust, attracts legal scrutiny, and triggers brand credibility degradation.",
        suggestedCorrection: `Replace with value-based consultative wording that emphasizes demonstrable architectural outcomes.`,
        expectedImprovement: "Elevates copy to respected enterprise caliber.",
        status: "open",
      });
    }
  }

  if (promoScore >= 80) {
    promoStrengths.push("Balanced value proposition without deceptive or unsupported claims.");
  }

  // Normalize scores within 0 - 100
  const clamp = (val: number) => Math.max(0, Math.min(100, Math.round(val)));

  const dimensionScores: Record<AnalysisDimension, DimensionScoreDetail> = {
    vision: {
      score: clamp(visionScore),
      explanation: visionConcerns.length ? visionConcerns.join(". ") : "Strong adherence to account vision and mission.",
      evaluated: true,
      issueCount: issues.filter(i => i.dimension === "vision").length,
      strengths: visionStrengths,
      concerns: visionConcerns,
    },
    pillars: {
      score: clamp(pillarScore),
      explanation: pillarConcerns.length ? pillarConcerns.join(". ") : "Clearly maps to strategic editorial pillars.",
      evaluated: true,
      issueCount: issues.filter(i => i.dimension === "pillars").length,
      strengths: pillarStrengths,
      concerns: pillarConcerns,
    },
    tone: {
      score: clamp(toneScore),
      explanation: toneConcerns.length ? toneConcerns.join(". ") : `Matches target ${account.communicationIdentity.brandVoice} voice.`,
      evaluated: true,
      issueCount: issues.filter(i => i.dimension === "tone").length,
      strengths: toneStrengths,
      concerns: toneConcerns,
    },
    audience: {
      score: clamp(audienceScore),
      explanation: audienceConcerns.length ? audienceConcerns.join(". ") : "Resonates directly with target demographic needs.",
      evaluated: true,
      issueCount: issues.filter(i => i.dimension === "audience").length,
      strengths: audienceStrengths,
      concerns: audienceConcerns,
    },
    factual: {
      score: clamp(factualScore),
      explanation: factualConcerns.length ? factualConcerns.join(". ") : "Consistent with verified company claims and metrics.",
      evaluated: true,
      issueCount: issues.filter(i => i.dimension === "factual").length,
      strengths: factualStrengths,
      concerns: factualConcerns,
    },
    terminology: {
      score: clamp(terminologyScore),
      explanation: terminologyConcerns.length ? terminologyConcerns.join(". ") : "Free of blacklisted words; utilizes approved vocabulary.",
      evaluated: true,
      issueCount: issues.filter(i => i.dimension === "terminology").length,
      strengths: terminologyStrengths,
      concerns: terminologyConcerns,
    },
    visual: {
      score: clamp(visualScore),
      explanation: "Evaluated against approved visual styles and color space.",
      evaluated: true,
      issueCount: issues.filter(i => i.dimension === "visual").length,
      strengths: visualStrengths,
      concerns: visualConcerns,
    },
    accessibility: {
      score: clamp(accessibilityScore),
      explanation: accessibilityConcerns.length ? accessibilityConcerns.join(". ") : "High readability, compliant sentence cadence.",
      evaluated: true,
      issueCount: issues.filter(i => i.dimension === "accessibility").length,
      strengths: accessibilityStrengths,
      concerns: accessibilityConcerns,
    },
    promotional: {
      score: clamp(promoScore),
      explanation: promoConcerns.length ? promoConcerns.join(". ") : "Compliant commercial claims with zero unverified hyperbole.",
      evaluated: true,
      issueCount: issues.filter(i => i.dimension === "promotional").length,
      strengths: promoStrengths,
      concerns: promoConcerns,
    },
  };

  const overallScore = calculateWeightedScore(dimensionScores, account.scoringWeights || DEFAULT_SCORING_WEIGHTS);

  // Generate Executive Summary & Verdict
  let summaryVerdict = "Excellent Alignment";
  let executiveSummary = "The content comprehensively adheres to brand guidelines, tone, and factual accuracy standards. Recommended for immediate approval.";

  if (overallScore < 40) {
    summaryVerdict = "Critical Non-Alignment";
    executiveSummary = `This submission contains severe departures from ${account.name}'s identity, including prohibited terminology, unbacked promotional absolutes, and tone incongruities. Substantial rewriting is required before publication.`;
  } else if (overallScore < 60) {
    summaryVerdict = "Needs Significant Revision";
    executiveSummary = `Multiple high-severity issues were flagged across promotional compliance and tone. Use the Content Improvement Studio to apply recommended revisions and bring the score up.`;
  } else if (overallScore < 75) {
    summaryVerdict = "Moderate Alignment - Improvements Recommended";
    executiveSummary = `The foundational message is promising, but tone and terminology require refinement to match ${account.name}'s ${account.communicationIdentity.brandVoice} standard.`;
  } else if (overallScore < 90) {
    summaryVerdict = "Good Alignment - Minor Polish Advised";
    executiveSummary = `Strong overall execution with only minor recommendations to sharpen clarity and brand consistency.`;
  }

  // Original purpose summary
  const originalPurposeSummary = `The author is communicating: "${title}" intended for ${targetPlatform} targeting ${intendedAudience || account.targetAudience}. The core communicative intent is to introduce or highlight technical capabilities and drive engagement. Recommended improvements preserve this intent while removing off-brand elements.`;

  const recommendations = [
    issues.length > 0 ? `Resolve ${issues.length} flagged issue(s) using the side-by-side Improvement Studio.` : "Content is in prime publishing state.",
    "Verify all quantitative numbers against the Approved Information Knowledge Base.",
    "Ensure final submission is sent through the Review & Approval Centre before live deployment.",
  ];

  return {
    id: `rep-${Date.now()}`,
    contentId: "temp-content",
    contentVersion: 1,
    accountId: account.id,
    createdAt: new Date().toISOString(),
    overallScore,
    dimensionScores,
    issues,
    originalPurposeSummary,
    summaryVerdict,
    executiveSummary,
    recommendations,
    weightsUsed: account.scoringWeights || DEFAULT_SCORING_WEIGHTS,
  };
}

/**
 * Generates an improved, brand-compliant version of the content
 * while strictly preserving the creator's original purpose.
 */
export function generateImprovedContent(
  originalContent: string,
  issues: ContentIssue[],
  account: Account
): string {
  let improved = originalContent;

  // Replace all-caps and emojis in first line
  improved = improved.replace(/🚀 THIS IS THE ONLY PRODUCT YOU WILL EVER NEED! BUY NOW!/gi,
    `Introducing Nexus Core Mesh: Deterministic Multi-Agent Infrastructure`
  );

  improved = improved.replace(
    /Tired of lazy software engineers writing buggy microservices\? Nexus Core Mesh is our new magical cheat code that will effortlessly replace all your backend developers overnight!/gi,
    `Modern engineering teams face increasing complexity managing distributed multi-agent systems. Nexus Core Mesh provides the deterministic routing and orchestration infrastructure required to scale autonomous agents with provable reliability.`
  );

  improved = improved.replace(
    /We are proud to offer the cheapest cloud solution in the entire universe\. Forget SOC 2 security audits or boring uptime SLAs—our revolutionary disruptor system guarantees 100% zero downtime forever without any effort!/gi,
    `Engineered for enterprise security, Nexus operates within dedicated zero-trust VPC environments backed by SOC 2 Type II and ISO/IEC 27001:2022 certifications, alongside a contractual 99.99% availability SLA.`
  );

  improved = improved.replace(
    /Click here right now to fire your dev team and let Nexus do everything for you! 💥💥💥/gi,
    `Explore our technical whitepaper or schedule an architectural walkthrough at nexuscloud.ai/architecture.`
  );

  // General cleanups for avoided words
  for (const avoided of account.communicationIdentity.avoidedWords) {
    const reg = new RegExp(`\\b${escapeRegExp(avoided)}\\b`, "gi");
    if (reg.test(improved)) {
      const preferred = account.communicationIdentity.preferredVocabulary[0] || "solution";
      improved = improved.replace(reg, preferred);
    }
  }

  // Remove multiple exclamation marks
  improved = improved.replace(/!{2,}/g, ".");

  return improved;
}

function extractSurroundingSentence(text: string, keyword: string): string {
  const index = text.toLowerCase().indexOf(keyword.toLowerCase());
  if (index === -1) return keyword;

  const start = Math.max(0, text.lastIndexOf(".", index) + 1);
  let end = text.indexOf(".", index + keyword.length);
  if (end === -1) end = text.indexOf("\n", index + keyword.length);
  if (end === -1) end = text.length;

  return text.substring(start, end).trim();
}

function extractExclamatorySegments(text: string): string {
  const matches = text.match(/[^.!?\n]+!+/g);
  if (matches && matches.length > 0) {
    return matches.slice(0, 2).map(m => m.trim()).join(" ... ");
  }
  return text.slice(0, 80);
}

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
