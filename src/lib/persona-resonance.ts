import {
  Account,
  AudiencePersonaAnalysis,
  CognitiveLoadLevel,
  PersonaResonanceReport,
} from "@/types";

interface PersonaSimulationInput {
  content: string;
  targetAudience: string;
  account: Account;
  contentId?: string;
}

/**
 * Feature Three: Audience Persona Resonance Simulator Engine
 *
 * Evaluates how uploaded content is perceived across diverse stakeholder personas
 * (e.g., C-Suite Executives, Technical Engineers, Compliance Risk Reviewers, End Users).
 * Calculates cognitive load, reading friction, resonance score, and predicts persona reactions.
 */
export function simulatePersonaResonance(input: PersonaSimulationInput): PersonaResonanceReport {
  const { content, targetAudience, account, contentId = `cnt-res-${Date.now()}` } = input;
  const textLower = content.toLowerCase();

  // Basic linguistic & readability metrics
  const words = content.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const sentenceCount = Math.max(1, sentences.length);
  const avgWordsPerSentence = wordCount / sentenceCount;

  // Estimate Flesch Reading Ease (approximate heuristic)
  // Higher = easier to read (60-70 standard, 30-50 academic/technical, <30 dense enterprise)
  const longWords = words.filter(w => w.length > 7).length;
  const longWordPercentage = wordCount > 0 ? (longWords / wordCount) * 100 : 0;
  let estimatedFlesch = Math.max(20, Math.min(95, Math.round(100 - avgWordsPerSentence * 1.5 - longWordPercentage * 1.8)));

  let cognitiveLoad: CognitiveLoadLevel = "optimal";
  if (avgWordsPerSentence > 28 || longWordPercentage > 35) {
    cognitiveLoad = "overwhelming";
  } else if (avgWordsPerSentence > 18 || longWordPercentage > 22) {
    cognitiveLoad = "dense";
  }

  // Detect content signal attributes
  const hasExecutiveSignals = /\b(roi|revenue|cost reduction|efficiency|governance|sla|strategy|velocity|bottom line|productivity|investment)\b/i.test(content);
  const hasTechnicalSignals = /\b(gpu|latency|architecture|orchestration|api|cluster|pipeline|deployment|sdk|throughput|runtime|node)\b/i.test(content);
  const hasComplianceSignals = /\b(compliance|audit|security|soc2|hipaa|gdpr|fda|sla|contract|liability|certified)\b/i.test(content);
  const hasPromotionalHype = /\b(revolutionary|unprecedented|magic|unbeatable|guaranteed 100%|disrupt everything)\b/i.test(content);

  const isB2BEnterprise = account.industry?.toLowerCase().includes("tech") || account.industry?.toLowerCase().includes("software") || account.id === "acc-nexus";

  const personaAnalyses: AudiencePersonaAnalysis[] = [];

  if (isB2BEnterprise) {
    // 1. PERSONA: C-Suite Executive (CTO / CIO / VP Engineering)
    const execStrengths: string[] = [];
    const execBarriers: string[] = [];
    let execScore = 75;

    if (hasExecutiveSignals) {
      execStrengths.push("Directly communicates business impact and enterprise efficiency");
      execScore += 10;
    } else {
      execBarriers.push("Lacks explicit financial or ROI tie-back for executive approval");
      execScore -= 12;
    }

    if (cognitiveLoad === "overwhelming") {
      execBarriers.push("Excessive paragraph density; executive reader may abandon scan");
      execScore -= 10;
    } else {
      execStrengths.push("Clear executive scanning hierarchy with rapid value articulation");
    }

    if (hasPromotionalHype) {
      execBarriers.push("Sensationalist superlatives reduce credibility among seasoned leaders");
      execScore -= 15;
    }

    personaAnalyses.push({
      personaId: "p-exec",
      personaName: "Enterprise C-Suite (CTO / CIO)",
      avatarIcon: "Briefcase",
      roleDescription: "Executive decision-maker focused on enterprise ROI, operational risk, and long-term tech strategy.",
      resonanceScore: Math.max(35, Math.min(98, execScore)),
      comprehensionIndex: cognitiveLoad === "overwhelming" ? 68 : 88,
      toneFit: hasPromotionalHype ? "misaligned" : hasExecutiveSignals ? "optimal" : "acceptable",
      jargonFriction: avgWordsPerSentence > 22 ? "moderate" : "low",
      predictedReaction: hasPromotionalHype
        ? "Skeptical of ungrounded hype; asks for proof of SLA before committing capital."
        : hasExecutiveSignals
        ? "Reassured by concrete operational claims and enterprise credibility."
        : "Neutral; needs clear business justification before championing.",
      perceivedStrengths: execStrengths,
      resonanceBarriers: execBarriers,
      tailoredAdjustment: "Lead with bottom-line productivity impact and verified 99.99% availability before delving into pipeline mechanics.",
    });

    // 2. PERSONA: Senior Architect & Engineering Lead
    const techStrengths: string[] = [];
    const techBarriers: string[] = [];
    let techScore = 78;

    if (hasTechnicalSignals) {
      techStrengths.push("Uses concrete systems vocabulary (latency, orchestration, GPU clusters)");
      techScore += 12;
    } else {
      techBarriers.push("Too vague or high-level; lacks architectural implementation specifics");
      techScore -= 15;
    }

    if (hasPromotionalHype) {
      techBarriers.push("Claims like 'instant zero-effort' trigger developer skepticism");
      techScore -= 18;
    } else {
      techStrengths.push("Grounded engineering tone without misleading marketing exaggerations");
    }

    personaAnalyses.push({
      personaId: "p-tech",
      personaName: "Lead Solutions Architect",
      avatarIcon: "Cpu",
      roleDescription: "Technical practitioner evaluating integration viability, API reliability, and architectural claims.",
      resonanceScore: Math.max(30, Math.min(96, techScore)),
      comprehensionIndex: hasTechnicalSignals ? 94 : 80,
      toneFit: hasPromotionalHype ? "misaligned" : hasTechnicalSignals ? "optimal" : "acceptable",
      jargonFriction: hasTechnicalSignals ? "low" : "moderate",
      predictedReaction: hasPromotionalHype
        ? "Dismisses copy as marketing fluff; requests benchmark reproducibility scripts."
        : hasTechnicalSignals
        ? "Values the precision around GPU latency and SLA parameters."
        : "Underwhelmed; seeks deep dive technical diagrams.",
      perceivedStrengths: techStrengths,
      resonanceBarriers: techBarriers,
      tailoredAdjustment: "Preserve technical accuracy and avoid over-promising automated zero-effort migration.",
    });

    // 3. PERSONA: Security, Compliance & Procurement Director
    const secStrengths: string[] = [];
    const secBarriers: string[] = [];
    let secScore = 80;

    if (hasComplianceSignals || content.includes("99.99%")) {
      secStrengths.push("Explicit reference to compliance standards and contractual uptime SLAs");
      secScore += 8;
    } else {
      secBarriers.push("Absence of explicit security verification or certified audit citations");
      secScore -= 10;
    }

    if (content.includes("100% zero downtime") || content.includes("100%")) {
      secBarriers.push("Absolute 100% zero-downtime promises trigger procurement contract redlines");
      secScore -= 20;
    }

    personaAnalyses.push({
      personaId: "p-sec",
      personaName: "Security & Risk Director",
      avatarIcon: "ShieldCheck",
      roleDescription: "Risk officer auditing vendor claims, regulatory adherence, and contractual SLA boundaries.",
      resonanceScore: Math.max(35, Math.min(95, secScore)),
      comprehensionIndex: 90,
      toneFit: content.includes("100%") ? "misaligned" : "acceptable",
      jargonFriction: "low",
      predictedReaction: content.includes("100%")
        ? "Redlines unconditional downtime claims; insists on fallback clauses."
        : "Approves publication provided all benchmark studies are verifiable.",
      perceivedStrengths: secStrengths,
      resonanceBarriers: secBarriers,
      tailoredAdjustment: "Anchor claims to official SOC-2 Type II standards and published MSA documentation.",
    });
  } else {
    // Consumer / Health / Lifestyle Brand Personas (e.g., Lumina Longevity or Eco)
    personaAnalyses.push({
      personaId: "p-health-enthusiast",
      personaName: "Health & Longevity Enthusiast",
      avatarIcon: "Sparkles",
      roleDescription: "Informed consumer seeking evidence-based wellness enhancements.",
      resonanceScore: 84,
      comprehensionIndex: 86,
      toneFit: "optimal",
      jargonFriction: "low",
      predictedReaction: "Excited by cellular longevity science when backed by readable research summaries.",
      perceivedStrengths: ["Clear biological mechanism explanations", "Inspiring lifestyle tone"],
      resonanceBarriers: ["Needs clear disclaimer separating dietary support from medical treatment"],
      tailoredAdjustment: "Keep mandatory FDA disclaimer accessible while highlighting natural cellular vitality.",
    });

    personaAnalyses.push({
      personaId: "p-clinical-skeptic",
      personaName: "Clinical & Scientific Skeptic",
      avatarIcon: "BookOpen",
      roleDescription: "Evidence-first practitioner scrutinizing wellness claims for scientific rigor.",
      resonanceScore: 68,
      comprehensionIndex: 92,
      toneFit: "acceptable",
      jargonFriction: "low",
      predictedReaction: "Scrutinizes clinical trial references; demands double-blind peer-reviewed citations.",
      perceivedStrengths: ["Cites cellular NAD+ metabolic pathways accurately"],
      resonanceBarriers: ["Absence of specific human clinical cohort size"],
      tailoredAdjustment: "Pair general claims with specific published study citations.",
    });
  }

  // Calculate overall audience fit score
  const avgResonance = Math.round(
    personaAnalyses.reduce((acc, p) => acc + p.resonanceScore, 0) / personaAnalyses.length
  );

  const strategicAdvice: string[] = [
    `Optimize paragraph pacing: Current average sentence length is ${avgWordsPerSentence.toFixed(1)} words (${cognitiveLoad} cognitive load).`,
    `Calibrate technical jargon: Maintain high credibility for practitioners while ensuring executives can immediately isolate the business thesis.`,
    `Reinforce claim provenance: Back numerical figures with source citations to reduce skepticism among risk-sensitive evaluators.`,
  ];

  return {
    id: `res-rep-${Date.now()}`,
    contentId,
    targetAudienceClaimed: targetAudience || account.targetAudience || "Enterprise Stakeholders",
    overallAudienceFitScore: avgResonance,
    fleschReadingEaseEstimate: estimatedFlesch,
    cognitiveLoadLevel: cognitiveLoad,
    personaAnalyses,
    strategicAudienceAdvice: strategicAdvice,
  };
}
