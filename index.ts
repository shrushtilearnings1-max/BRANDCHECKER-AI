export type UserRole = 'ADMIN' | 'MANAGER' | 'CREATOR' | 'REVIEWER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  title: string;
  assignedAccounts: string[];
}

export interface ContentPillar {
  id: string;
  name: string;
  description: string;
  targetPercentage: number;
}

export interface ApprovedFact {
  id: string;
  claim: string;
  category: string;
  verifiedSource: string;
  approvedDate: string;
}

export interface ApprovedProduct {
  id: string;
  name: string;
  description: string;
  officialTagline: string;
  keyFeatures: string[];
  pricingClaim: string;
  disclaimerRequired: boolean;
  requiredDisclaimerText?: string;
}

export interface ApprovedStatistic {
  id?: string;
  statistic: string;
  metric: string;
  context: string;
  source: string;
  validUntil: string;
}

export interface GuidelineFile {
  id: string;
  name: string;
  size: string;
  type: string;
  uploadDate: string;
  summary: string;
  extractedSections?: string[];
}

export interface GuidelineVersion {
  version: string;
  updatedDate: string;
  updatedBy: string;
  changeSummary: string;
}

export interface AccountVision {
  longTermVision: string;
  mission: string;
  coreObjectives: string[];
  contentPhilosophy: string;
  desiredAudiencePerception: string;
  focusTopics: string[];
  avoidedTopics: string[];
}

export interface AccountContentStrategy {
  pillars: ContentPillar[];
  preferredCategories: string[];
  postingStyle: string;
  contentBalance: {
    educational: number;
    entertainment: number;
    promotional: number;
  };
  audienceInterests: string[];
  communicationApproach: string;
}

export interface AccountCommunicationIdentity {
  brandVoice: string;
  tone: string;
  formalityLevel: 'Casual' | 'Conversational' | 'Professional' | 'Authoritative';
  preferredVocabulary: string[];
  avoidedWords: string[];
  languagePreferences: string;
  writingStyleGuide: string;
}

export interface AccountVisualIdentity {
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  typographyPrimary: string;
  typographySecondary: string;
  imageStyle: string;
  designReferences: string[];
  approvedGraphics: string[];
}

export interface AccountApprovedInformation {
  facts: ApprovedFact[];
  products: ApprovedProduct[];
  statistics: ApprovedStatistic[];
  officialClaims: string[];
  importantDates: Array<{ event: string; date: string }>;
  trustedDocs: GuidelineFile[];
}

export interface ScoringWeights {
  vision: number;         // default 20%
  pillars: number;        // default 15%
  tone: number;           // default 15%
  audience: number;       // default 10%
  factual: number;        // default 15%
  terminology: number;    // default 5%
  visual: number;         // default 10%
  accessibility: number;  // default 5%
  promotional: number;    // default 5%
}

export interface Account {
  id: string;
  name: string;
  slug: string;
  logo: string;
  description: string;
  industry: string;
  website: string;
  platforms: ('YouTube' | 'Instagram' | 'LinkedIn' | 'Twitter/X' | 'TikTok' | 'Blog' | 'Website' | 'Email')[];
  targetAudience: string;
  accountPurpose: string;
  vision: AccountVision;
  contentStrategy: AccountContentStrategy;
  communicationIdentity: AccountCommunicationIdentity;
  visualIdentity: AccountVisualIdentity;
  approvedInformation: AccountApprovedInformation;
  guidelineFiles: GuidelineFile[];
  versionHistory: GuidelineVersion[];
  scoringWeights: ScoringWeights;
  createdAt: string;
  updatedAt: string;
}

export type ContentStatus =
  | 'draft'
  | 'uploaded'
  | 'analysing'
  | 'analysis_completed'
  | 'needs_improvement'
  | 'submitted_for_review'
  | 'under_review'
  | 'approved'
  | 'rejected'
  | 'published'
  | 'archived';

export type AnalysisDimension =
  | 'vision'
  | 'pillars'
  | 'tone'
  | 'audience'
  | 'factual'
  | 'terminology'
  | 'visual'
  | 'accessibility'
  | 'promotional';

export type IssueSeverity = 'critical' | 'high' | 'medium' | 'low' | 'informational';

export type IssueStatus = 'open' | 'resolved' | 'ignored' | 'escalated_for_review';

export interface ContentIssue {
  id: string;
  dimension: AnalysisDimension;
  title: string;
  severity: IssueSeverity;
  confidence: number; // 0-100 percentage
  detectedSection: string;
  explanation: string;
  relevantGuideline: string;
  whyItMatters: string;
  suggestedCorrection: string;
  expectedImprovement: string;
  status: IssueStatus;
  resolutionComment?: string;
}

export interface DimensionScoreDetail {
  score: number; // 0-100
  explanation: string;
  evaluated: boolean;
  issueCount: number;
  strengths: string[];
  concerns: string[];
}

export interface ContentVersion {
  versionNumber: number;
  createdAt: string;
  content: string;
  title: string;
  changeSummary: string;
  analysisReportId?: string;
  alignmentScore?: number;
}

export interface AnalysisReport {
  id: string;
  contentId: string;
  contentVersion: number;
  accountId: string;
  createdAt: string;
  overallScore: number;
  dimensionScores: Record<AnalysisDimension, DimensionScoreDetail>;
  issues: ContentIssue[];
  originalPurposeSummary: string;
  summaryVerdict: string;
  executiveSummary: string;
  recommendations: string[];
  weightsUsed: ScoringWeights;
  claimTrace?: ClaimTraceReport;
  personaResonance?: PersonaResonanceReport;
}

export interface ContentItem {
  id: string;
  accountId: string;
  title: string;
  category: string;
  targetPlatform: string;
  intendedAudience: string;
  campaignName?: string;
  publicationDate?: string;
  description: string;
  contentType: 'text' | 'image' | 'document' | 'video' | 'social_post' | 'blog_article';
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
  rawContent: string;
  currentVersion: number;
  versions: ContentVersion[];
  status: ContentStatus;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  assignedReviewerId?: string;
  assignedReviewerName?: string;
  latestScore?: number;
  latestReportId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewComment {
  id: string;
  contentId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userRole: UserRole;
  content: string;
  createdAt: string;
  isInternalNote: boolean;
}

export interface NotificationItem {
  id: string;
  userId?: string;
  title: string;
  message: string;
  type: 'upload' | 'analysis' | 'critical' | 'review_submitted' | 'revision_requested' | 'approved' | 'rejected' | 'assignment';
  link: string;
  read: boolean;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  accountId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  action: string;
  details: string;
  timestamp: string;
}

// ==========================================
// BRAND DNA DRIFT DETECTOR TYPES
// ==========================================
export type DriftLevel = 'low' | 'medium' | 'high';

export interface BrandDriftDimensionMetric {
  dimension: string;
  baselineValue: string;
  currentValue: string;
  driftPercentage: number;
  driftLevel: DriftLevel;
  trend: 'stable' | 'drifting_moderate' | 'drifting_severe';
  observation: string;
}

export interface BrandDnaProfile {
  accountId: string;
  baselineSampleCount: number;
  dominantTone: string;
  establishedFormality: string;
  pillarDistribution: Record<string, number>;
  promotionalContentRatio: number;
  topVocabularyKeywords: string[];
  restrictedTermOccurrences: number;
  lastUpdated: string;
}

export interface BrandDnaDriftReport {
  id: string;
  accountId: string;
  calculatedAt: string;
  consistencyScore: number; // 0-100% (100 = perfect alignment to Brand DNA, <70 = drift warning)
  driftPercentage: number;  // 100 - consistencyScore
  driftLevel: DriftLevel;   // 'low' | 'medium' | 'high'
  warningTriggered: boolean;
  warningTitle?: string;
  warningMessage?: string;
  historicalBaselineSummary: string;
  currentPatternSummary: string;
  detectedChanges: string[];
  contentPatternsCausingDrift: string[];
  recommendations: string[];
  dimensionMetrics: BrandDriftDimensionMetric[];
  timeline: Array<{
    period: string;
    consistencyScore: number;
    driftPercentage: number;
    driftLevel: DriftLevel;
    sampleCount: number;
    promotionalRatio: number;
  }>;
}

// ==========================================
// CLAIMTRACE — INTELLIGENT CLAIM VERIFICATION TYPES
// ==========================================
export type ClaimVerificationStatus =
  | 'verified'      // Supported by available approved evidence
  | 'unsupported'   // No sufficient evidence found in brand sources
  | 'contradicted'  // Available evidence explicitly conflicts with the claim
  | 'outdated'      // Supporting information may no longer be current
  | 'needs_review'; // Human verification is required

export type ClaimCategory =
  | 'statistic'
  | 'numerical'
  | 'specification'
  | 'performance_promise'
  | 'date_timeline'
  | 'health_financial';

export interface ExtractedClaim {
  id: string;
  claimText: string;
  category: ClaimCategory;
  status: ClaimVerificationStatus;
  confidence: number; // 0-100 percentage
  detectedSection: string;
  supportingEvidence?: string;
  sourceReference?: string;
  contradictionReason?: string;
  suggestedCorrection?: string;
  isReviewed: boolean;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewerNote?: string;
}

export interface ClaimTraceReport {
  id: string;
  contentId: string;
  contentTitle: string;
  accountId: string;
  extractedAt: string;
  overallClaimIntegrityScore: number; // 0-100%
  totalClaimsCount: number;
  verifiedCount: number;
  unsupportedCount: number;
  contradictedCount: number;
  outdatedCount: number;
  needsReviewCount: number;
  claims: ExtractedClaim[];
  summaryVerdict: string;
}

// ==========================================
// FEATURE THREE: AUDIENCE PERSONA RESONANCE SIMULATOR TYPES
// ==========================================
export type ToneFitQuality = "optimal" | "acceptable" | "misaligned";
export type JargonFrictionLevel = "low" | "moderate" | "excessive";
export type CognitiveLoadLevel = "optimal" | "dense" | "overwhelming";

export interface AudiencePersonaAnalysis {
  personaId: string;
  personaName: string;
  avatarIcon: string;
  roleDescription: string;
  resonanceScore: number; // 0-100
  comprehensionIndex: number; // 0-100
  toneFit: ToneFitQuality;
  jargonFriction: JargonFrictionLevel;
  predictedReaction: string;
  perceivedStrengths: string[];
  resonanceBarriers: string[];
  tailoredAdjustment: string;
}

export interface PersonaResonanceReport {
  id: string;
  contentId: string;
  targetAudienceClaimed: string;
  overallAudienceFitScore: number; // 0-100
  fleschReadingEaseEstimate: number;
  cognitiveLoadLevel: CognitiveLoadLevel;
  personaAnalyses: AudiencePersonaAnalysis[];
  strategicAudienceAdvice: string[];
}

