import { Account, ActivityLog, ContentItem, NotificationItem, ReviewComment, User } from "@/types";
import { DEFAULT_SCORING_WEIGHTS } from "./scoring";

export const INITIAL_USERS: User[] = [
  {
    id: "usr-admin-1",
    name: "Elena Rostova",
    email: "elena@brandchecker.ai",
    role: "ADMIN",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    title: "Chief Brand Governance Officer",
    assignedAccounts: ["acc-nexus", "acc-lumina", "acc-pulse"],
  },
  {
    id: "usr-mgr-1",
    name: "Marcus Vance",
    email: "marcus@nexuscloud.io",
    role: "MANAGER",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    title: "Global Marketing Director",
    assignedAccounts: ["acc-nexus"],
  },
  {
    id: "usr-creator-1",
    name: "Sophia Chen",
    email: "sophia@nexuscloud.io",
    role: "CREATOR",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    title: "Senior Content & Developer Advocate",
    assignedAccounts: ["acc-nexus"],
  },
  {
    id: "usr-rev-1",
    name: "David Kim",
    email: "david.kim@nexuscloud.io",
    role: "REVIEWER",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    title: "Lead Brand Compliance Specialist",
    assignedAccounts: ["acc-nexus", "acc-lumina"],
  },
];

export const INITIAL_ACCOUNTS: Account[] = [
  {
    id: "acc-nexus",
    name: "Nexus Cloud AI",
    slug: "nexus-cloud-ai",
    logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80",
    description: "Enterprise multi-agent orchestration and autonomous cloud infrastructure platform.",
    industry: "Enterprise Cloud & Artificial Intelligence",
    website: "https://nexuscloud.ai",
    platforms: ["LinkedIn", "Twitter/X", "YouTube", "Blog", "Website"],
    targetAudience: "CTOs, VP of Engineering, Cloud Architects, and Enterprise Infrastructure Leaders.",
    accountPurpose: "Establish Nexus as the most reliable, deterministic, enterprise-grade AI cloud platform with zero hype.",
    scoringWeights: { ...DEFAULT_SCORING_WEIGHTS },
    createdAt: "2024-01-15T09:00:00Z",
    updatedAt: "2024-11-01T14:30:00Z",
    vision: {
      longTermVision: "To power 80% of Fortune 500 autonomous enterprise systems with zero data leaks and 99.99% deterministic uptime.",
      mission: "Eliminate infrastructure friction for engineering leaders through transparent, provable, and secure multi-agent computing.",
      coreObjectives: [
        "Position Nexus as the serious engineering alternative to consumer hype AI",
        "Maintain industry-leading trust, compliance and security certifications",
        "Empower DevOps teams to ship agentic pipelines in minutes with provable safety",
      ],
      contentPhilosophy: "Zero hyperbole. Always ground every metric in benchmark data, verified customer testimonials, or reproducible engineering proofs.",
      desiredAudiencePerception: "Rigorous, highly capable, quiet confidence, dependable, and deeply respectful of technical accuracy.",
      focusTopics: [
        "Distributed agent coordination",
        "Zero-trust VPC security",
        "Deterministic latency optimization",
        "SOC 2 Type II compliance",
        "Engineering postmortems",
      ],
      avoidedTopics: [
        "Replacing software engineers completely",
        "General Artificial Intelligence doomsday hype",
        "Unbacked benchmark comparisons against competitors",
        "Price wars or cheap-discount positioning",
      ],
    },
    contentStrategy: {
      pillars: [
        {
          id: "pil-1",
          name: "Engineering Architecture & Deep Dives",
          description: "Technical teardowns of real customer deployments, latency graphs, and code snippets.",
          targetPercentage: 40,
        },
        {
          id: "pil-2",
          name: "Enterprise Compliance & Governance",
          description: "Data privacy regulations, SOC 2, HIPAA, audit trails, and deterministic security practices.",
          targetPercentage: 30,
        },
        {
          id: "pil-3",
          name: "Customer Proven Outcomes",
          description: "Case studies with quantified ROI, verified quote approvals, and architectural diagrams.",
          targetPercentage: 20,
        },
        {
          id: "pil-4",
          name: "Product Releases & Changelogs",
          description: "Quarterly feature launches, RFC summaries, and ecosystem integrations.",
          targetPercentage: 10,
        },
      ],
      preferredCategories: ["Whitepaper", "Technical Article", "Case Study", "Executive Briefing", "Demo Video"],
      postingStyle: "Structured, insightful, markdown-formatted with clear visual code snippets or verified benchmarks.",
      contentBalance: {
        educational: 60,
        entertainment: 10,
        promotional: 30,
      },
      audienceInterests: ["Kubernetes", "LLM Orchestration", "Infra Cost Optimization", "Security Audits", "Data Governance"],
      communicationApproach: "Peer-to-peer engineering dialogue. Write like a Staff Infrastructure Engineer communicating with a Principal Architect.",
    },
    communicationIdentity: {
      brandVoice: "Authoritative, precise, calm, and intellectually honest.",
      tone: "Measured, clear, technical without being obscure, confident without boasting.",
      formalityLevel: "Professional",
      preferredVocabulary: [
        "deterministic",
        "orchestration",
        "enterprise-grade",
        "low-latency",
        "zero-trust",
        "provable reliability",
        "governance",
        "resilience",
        "distributed systems",
      ],
      avoidedWords: [
        "magic",
        "magical",
        "effortless overnight",
        "cheat code",
        "revolutionary disruptor",
        "kill all engineers",
        "cheapest",
        "BUY NOW",
        "unbelievable insane",
        "secret hack",
      ],
      languagePreferences: "US English, standard industry nomenclature (RFC, ISO, IEEE conventions).",
      writingStyleGuide: "Lead with the engineering problem. Use bullet points for specifications. Always specify units (ms, GB/s, %). Never use all-caps or multiple exclamation points.",
    },
    visualIdentity: {
      logoUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80",
      primaryColor: "#0B0F19", // Dark Navy
      secondaryColor: "#6D28D9", // Deep Purple
      accentColor: "#06B6D4", // Cyan
      backgroundColor: "#030712",
      typographyPrimary: "Inter, system-ui",
      typographySecondary: "JetBrains Mono, monospace",
      imageStyle: "Dark mode high-contrast UI screens, architectural node diagrams, blueprint-style vectors, crisp photography with cool lighting.",
      designReferences: ["Vercel dark dashboard", "Stripe radar documentation", "AWS architecture center"],
      approvedGraphics: ["nexus-logo-white.svg", "node-cluster-diagram.png", "benchmark-bar-template.png"],
    },
    approvedInformation: {
      facts: [
        {
          id: "fct-1",
          claim: "Nexus Cloud AI maintains a 99.99% uptime SLA backed by contractual credit guarantees.",
          category: "Performance SLA",
          verifiedSource: "Master Services Agreement (MSA) v4.2 Section 9",
          approvedDate: "2024-01-10",
        },
        {
          id: "fct-2",
          claim: "Nexus is certified compliant with SOC 2 Type II, ISO/IEC 27001:2022, and HIPAA Security Rule.",
          category: "Security Certifications",
          verifiedSource: "Coalfire Audit Report 2024-Q3",
          approvedDate: "2024-09-15",
        },
        {
          id: "fct-3",
          claim: "Nexus agents process inference with sub-14 millisecond internal orchestration overhead.",
          category: "Benchmarks",
          verifiedSource: "IEEE Micro 2024 Benchmarking Paper #8812",
          approvedDate: "2024-08-20",
        },
        {
          id: "fct-4",
          claim: "Nexus currently manages over 450,000 active enterprise container nodes across 3 continents.",
          category: "Scale & Deployment",
          verifiedSource: "Q3 2024 Investor & Board Deck",
          approvedDate: "2024-10-01",
        },
      ],
      products: [
        {
          id: "prd-1",
          name: "Nexus Core Mesh",
          description: "Deterministic routing mesh for multi-agent LLM systems with zero cross-tenant contamination.",
          officialTagline: "The Deterministic Backbone for Agentic Infrastructure",
          keyFeatures: ["Zero-trust tenant isolation", "Distributed state recovery in <50ms", "Auto-failover"],
          pricingClaim: "Transparent per-second compute billing without hidden API markup.",
          disclaimerRequired: true,
          requiredDisclaimerText: "Enterprise SLAs apply to dedicated VPC clusters. Standard tier rates subject to regional availability.",
        },
        {
          id: "prd-2",
          name: "Nexus Guardrail Shield",
          description: "Real-time hallucination, PII leak, and prompt injection defense gateway.",
          officialTagline: "Hardware-accelerated semantic firewall",
          keyFeatures: ["Sub-2ms inline inspection", "Custom regex & vector rules", "GDPR/HIPAA redaction"],
          pricingClaim: "Included free on Enterprise Tier plans.",
          disclaimerRequired: false,
        },
      ],
      statistics: [
        {
          statistic: "42% reduction in cloud GPU idling cost",
          metric: "Cost Savings",
          context: "Measured across 38 enterprise pilot customers migrating from unmanaged Kubernetes pools",
          source: "Forrester Total Economic Impact Study 2024",
          validUntil: "2025-12-31",
        },
        {
          statistic: "99.99% Availability",
          metric: "Uptime",
          context: "Trailing 12-month average across US-East, US-West, and EU-Central regions",
          source: "status.nexuscloud.ai historical log",
          validUntil: "2025-06-30",
        },
      ],
      officialClaims: [
        "Zero customer data is ever retained or reused for model training.",
        "Encrypted at rest using AES-256-GCM and in transit using TLS 1.3.",
        "Deterministic execution guarantees predictable JSON responses.",
      ],
      importantDates: [
        { event: "Nexus Con 2025 Annual Developer Keynote", date: "2025-04-18" },
        { event: "EU Data Sovereignty VPC Launch", date: "2025-02-01" },
      ],
      trustedDocs: [
        {
          id: "doc-1",
          name: "Nexus_Brand_Guidelines_2025.pdf",
          size: "4.8 MB",
          type: "application/pdf",
          uploadDate: "2024-10-15",
          summary: "Master brand guidelines including logo clear space, navy color gamut, and typography rules.",
        },
        {
          id: "doc-2",
          name: "Engineering_Claims_Verification_Manual.docx",
          size: "1.2 MB",
          type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          uploadDate: "2024-11-01",
          summary: "List of all approved engineering claims, benchmark citations, and prohibited hyperbole.",
        },
      ],
    },
    guidelineFiles: [
      {
        id: "gfl-1",
        name: "Nexus_Brand_Guidelines_v3.2.pdf",
        size: "4.8 MB",
        type: "pdf",
        uploadDate: "2024-10-15",
        summary: "Visual palette, typography, tone of voice, terminology blacklists, and logo isolation distances.",
      },
      {
        id: "gfl-2",
        name: "Approved_Enterprise_Facts_2024.txt",
        size: "42 KB",
        type: "txt",
        uploadDate: "2024-11-01",
        summary: "Contains all current SOC 2, HIPAA, SLA metrics and official leadership bios.",
      },
    ],
    versionHistory: [
      {
        version: "v3.2",
        updatedDate: "2024-11-01T10:00:00Z",
        updatedBy: "Elena Rostova",
        changeSummary: "Added strict prohibition on 'AI replacement of developers' phrasing; updated SLA claim to 99.99%.",
      },
      {
        version: "v3.1",
        updatedDate: "2024-07-20T16:00:00Z",
        updatedBy: "Marcus Vance",
        changeSummary: "Incorporated SOC 2 Type II audit completion and updated customer count facts.",
      },
      {
        version: "v3.0",
        updatedDate: "2024-01-15T09:00:00Z",
        updatedBy: "Elena Rostova",
        changeSummary: "Initial brand guidelines baseline and communication principles established.",
      },
    ],
  },
  {
    id: "acc-lumina",
    name: "Lumina Health & Longevity",
    slug: "lumina-health",
    logo: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=150&auto=format&fit=crop&q=80",
    description: "Clinical-grade cellular nutrition and metabolic longevity science brand.",
    industry: "Health, Biotech & Preventive Wellness",
    website: "https://luminahealth.com",
    platforms: ["Instagram", "TikTok", "YouTube", "Website", "Email"],
    targetAudience: "Health-conscious professionals, biohackers, endurance athletes, and preventative medicine advocates aged 28-55.",
    accountPurpose: "Translate complex cellular longevity research into actionable, uplifting, and rigorously compliant daily habits.",
    scoringWeights: {
      vision: 20,
      pillars: 15,
      tone: 15,
      audience: 10,
      factual: 20, // Higher factual accuracy weight for health
      terminology: 5,
      visual: 5,
      accessibility: 5,
      promotional: 5,
    },
    createdAt: "2024-03-10T11:00:00Z",
    updatedAt: "2024-10-28T09:15:00Z",
    vision: {
      longTermVision: "To empower 10 million individuals to extend their active healthspan through scientifically validated cellular protocols.",
      mission: "Bridge the gap between peer-reviewed longevity biochemistry and clean, daily cellular vitality without pseudo-science.",
      coreObjectives: [
        "Educate audiences on mitochondrial biogenesis and NAD+ metabolism",
        "Maintain zero unapproved FDA disease treatment claims",
        "Promote holistic lifestyle synergy (sleep, light exposure, nutrition, movement)",
      ],
      contentPhilosophy: "Science first, human always. Ground every statement in PubMed literature. Never promise overnight miracle cures.",
      desiredAudiencePerception: "Trustworthy, compassionate, clinically backed, radiant, and empowering.",
      focusTopics: ["Mitochondrial health", "NAD+ pathways", "Circadian biology", "Intermittent fasting science", "Third-party purity tests"],
      avoidedTopics: ["Curing cancer or chronic diseases", "Extreme dangerous crash diets", "Denigrating conventional medicine", "Miracle weight loss"],
    },
    contentStrategy: {
      pillars: [
        { id: "lum-pil-1", name: "Cellular Biochemistry Explained", description: "Breakdowns of NAD+, autophagy, and mitochondrial dynamics.", targetPercentage: 40 },
        { id: "lum-pil-2", name: "Daily Longevity Protocols", description: "Morning light exposure, sleep optimization, and cold therapy guides.", targetPercentage: 30 },
        { id: "lum-pil-3", name: "Ingredient Sourcing & Purity", description: "Chromatography testing, botanical harvesting, and zero-filler philosophy.", targetPercentage: 20 },
        { id: "lum-pil-4", name: "Community & Clinical Stories", description: "Physician interviews and documented biomarkers.", targetPercentage: 10 },
      ],
      preferredCategories: ["Video Reel", "Infographic", "Longform Article", "Ingredient Deep Dive", "Scientific AMA"],
      postingStyle: "Clean aesthetic, warm natural light, soft botanical accents, clear FDA disclaimers on all dietary statements.",
      contentBalance: { educational: 70, entertainment: 10, promotional: 20 },
      audienceInterests: ["Longevity", "Huberman Lab", "NAD+ Boosters", "VO2 Max", "Biohacking"],
      communicationApproach: "Warm, respectful, and clinically educational. Speak as a knowledgeable functional medicine mentor.",
    },
    communicationIdentity: {
      brandVoice: "Empathetic, clear, scientifically grounded, and uplifting.",
      tone: "Encouraging, authentic, calm, and rigorous.",
      formalityLevel: "Conversational",
      preferredVocabulary: ["cellular vitality", "mitochondrial support", "bio-available", "clinical trials", "synergistic", "evidence-based", "longevity protocol"],
      avoidedWords: ["miracle cure", "instant fix", "melts belly fat", "detoxify overnight", "toxic chemicals", "big pharma conspiracy", "guaranteed disease prevention"],
      languagePreferences: "Warm US English with clear explanations of medical terminology.",
      writingStyleGuide: "Always append standard FDA disclaimers to ingestible recommendations: '*These statements have not been evaluated by the Food and Drug Administration...'",
    },
    visualIdentity: {
      logoUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=150&auto=format&fit=crop&q=80",
      primaryColor: "#064E3B", // Forest Deep Green
      secondaryColor: "#10B981", // Emerald
      accentColor: "#F59E0B", // Warm Amber
      backgroundColor: "#022C22",
      typographyPrimary: "Plus Jakarta Sans, sans-serif",
      typographySecondary: "Merriweather, serif",
      imageStyle: "Warm sunlit laboratory, natural botanical ingredients, micro-cellular microscopy, clean glassware, diverse healthy active people.",
      designReferences: ["Seed Health", "WHOOP journal", "Equinox wellness"],
      approvedGraphics: ["lumina-monogram-gold.svg", "mitochondria-render-3d.png"],
    },
    approvedInformation: {
      facts: [
        { id: "lum-fct-1", claim: "All Lumina formulations undergo triple third-party testing for heavy metals and solvent residues.", category: "Purity & Quality", verifiedSource: "Eurofins Scientific Certificate #EF-2024-912", approvedDate: "2024-04-12" },
        { id: "lum-fct-2", claim: "Our liposomal NAD+ precursor demonstrates 3.4x higher cellular absorption compared to standard powders.", category: "Bioavailability", verifiedSource: "Journal of Cellular Nutritional Biochemistry 2024", approvedDate: "2024-08-11" },
      ],
      products: [
        {
          id: "lum-prd-1",
          name: "Lumina CellVitality 900",
          description: "Liposomal cellular energy precursor combining NMN, Trans-Resveratrol, and PQQ.",
          officialTagline: "Recharge Your Mitochondria at the Source",
          keyFeatures: ["Liposomal delivery", "99.8% pure trans-resveratrol", "Non-GMO certified"],
          pricingClaim: "$79 for 30-day supply with subscription discount.",
          disclaimerRequired: true,
          requiredDisclaimerText: "*These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease.",
        },
      ],
      statistics: [
        { statistic: "92% of participants reported sustained morning focus within 14 days", metric: "Customer Perception", context: "Double-blind, placebo-controlled study with n=120 participants", source: "Lumina Clinical Trial Report LC-2024", validUntil: "2025-12-31" },
      ],
      officialClaims: ["Free from artificial colorants, synthetic binders, and magnesium stearate.", "Manufactured in a cGMP-certified facility in California."],
      importantDates: [{ event: "Global Longevity Summit Panel", date: "2025-05-12" }],
      trustedDocs: [
        { id: "lum-doc-1", name: "Lumina_Regulatory_Compliance_Checklist.pdf", size: "2.1 MB", type: "pdf", uploadDate: "2024-09-01", summary: "FTC and FDA advertising compliance guidelines for dietary supplements." },
      ],
    },
    guidelineFiles: [
      { id: "lum-gfl-1", name: "Lumina_Health_Brand_Guidelines.pdf", size: "3.4 MB", type: "pdf", uploadDate: "2024-03-10", summary: "Compliance rules, aesthetic guides, photography direction, and required disclaimers." },
    ],
    versionHistory: [
      { version: "v2.0", updatedDate: "2024-10-28T09:15:00Z", updatedBy: "David Kim", changeSummary: "Updated FTC disclosure regulations for influencer social posts." },
      { version: "v1.0", updatedDate: "2024-03-10T11:00:00Z", updatedBy: "Elena Rostova", changeSummary: "Initial brand guidelines and regulatory protocols established." },
    ],
  },
  {
    id: "acc-pulse",
    name: "Pulse Media Network",
    slug: "pulse-media",
    logo: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150&auto=format&fit=crop&q=80",
    description: "Digital creator agency & YouTube network covering the cutting edge of tech, AI tools, and culture.",
    industry: "Digital Media & Creator Economy",
    website: "https://pulsemedianetwork.com",
    platforms: ["YouTube", "TikTok", "Instagram", "Twitter/X", "Email"],
    targetAudience: "Gen Z and Millennial tech enthusiasts, digital creators, indie hackers, and startup builders.",
    accountPurpose: "Demystify emerging creative tools with high-energy, entertaining, and ruthlessly honest reviews.",
    scoringWeights: { ...DEFAULT_SCORING_WEIGHTS },
    createdAt: "2024-05-01T10:00:00Z",
    updatedAt: "2024-11-04T12:00:00Z",
    vision: {
      longTermVision: "Build the most respected independent creator media network reaching 50M monthly active viewers.",
      mission: "Provide unfiltered, deeply researched creative tool reviews and workflows that elevate creators' craft.",
      coreObjectives: ["Deliver honest testing over paid promotional fluff", "Test tools in real client production environments", "Inspire next-generation solo digital entrepreneurs"],
      contentPhilosophy: "Always state whether a software tool was provided for free or paid for. Never accept editorial control from sponsors.",
      desiredAudiencePerception: "Honest, fast-paced, insightful, fun, highly skilled, and on the creator's side.",
      focusTopics: ["AI video generation", "Motion graphics workflows", "Camera gear comparisons", "Creator business monetization", "Open-source tools"],
      avoidedTopics: ["Crypto pump and dump coins", "Get rich quick schemes", "Unverified hardware rumors without attribution"],
    },
    contentStrategy: {
      pillars: [
        { id: "pul-pil-1", name: "Real-World Tool Benchmarks", description: "Hands-on stress tests comparing render speeds and workflow bottlenecks.", targetPercentage: 45 },
        { id: "pul-pil-2", name: "Creator Economy Teardowns", description: "How channels scale revenue, sponsorships, and digital product sales.", targetPercentage: 25 },
        { id: "pul-pil-3", name: "Behind the Edit", description: "Editing timelines, sound design techniques, and motion graphics breakdowns.", targetPercentage: 20 },
        { id: "pul-pil-4", name: "Industry News & Hot Takes", description: "Weekly breakdowns of tech announcements and algorithmic shifts.", targetPercentage: 10 },
      ],
      preferredCategories: ["YouTube Longform", "Shorts/Reels", "Community Post", "Behind the Scenes", "Newsletter"],
      postingStyle: "High retention, punchy hooks in the first 3 seconds, dynamic kinetic typography, vibrant thumbnail styling.",
      contentBalance: { educational: 45, entertainment: 45, promotional: 10 },
      audienceInterests: ["Premiere Pro", "DaVinci Resolve", "Runway Gen-3", "Midjourney", "Camera rigs", "Podcasting setups"],
      communicationApproach: "Enthusiastic, approachable, sharp, and community-centric. Like talking to your most creative friend.",
    },
    communicationIdentity: {
      brandVoice: "High-energy, direct, conversational, and fiercely authentic.",
      tone: "Vibrant, witty, technically savvy without snobbery, optimistic.",
      formalityLevel: "Conversational",
      preferredVocabulary: ["breakdown", "stress test", "workflow", "production-ready", "bottleneck", "hands-on review", "game changer", "deep dive"],
      avoidedWords: ["guaranteed overnight riches", "secret loophole that makes you rich", "passive income while you sleep", "foolproof miracle"],
      languagePreferences: "Modern colloquial English, punchy short sentences, engaging questions.",
      writingStyleGuide: "Hooks must establish the stakes immediately. Every video caption must include clear timestamp chapters and hardware gear links.",
    },
    visualIdentity: {
      logoUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150&auto=format&fit=crop&q=80",
      primaryColor: "#0F172A", // Slate Dark
      secondaryColor: "#E11D48", // Rose Red
      accentColor: "#8B5CF6", // Violet
      backgroundColor: "#090D16",
      typographyPrimary: "Cabinet Grotesk, Inter, sans-serif",
      typographySecondary: "JetBrains Mono, monospace",
      imageStyle: "High-contrast neon backlights, studio microphone in frame, bold yellow/white YouTube thumbnail text, cinematic color grading.",
      designReferences: ["MKBHD studio", "Veritasium thumbnails", "Linus Tech Tips set"],
      approvedGraphics: ["pulse-soundwave-logo.svg", "pulse-lower-third-overlay.png"],
    },
    approvedInformation: {
      facts: [
        { id: "pul-fct-1", claim: "Pulse Media Network videos maintain an average retention rate of 58% past the 5-minute mark.", category: "Audience Retention", verifiedSource: "YouTube Creator Studio Analytics 2024", approvedDate: "2024-10-01" },
      ],
      products: [
        {
          id: "pul-prd-1",
          name: "Pulse Creator LUTs & Preset Pack",
          description: "Custom color grading curves and Premiere Pro timeline motion presets used across all Pulse productions.",
          officialTagline: "The Signature Cinematic Look for Tech Creators",
          keyFeatures: ["12 Cinematic LUTs", "24 Kinetic Motion presets", "Lifetime free updates"],
          pricingClaim: "$39 one-time download.",
          disclaimerRequired: false,
        },
      ],
      statistics: [
        { statistic: "Over 4.2M views generated across Q3 editorial reviews", metric: "Reach", context: "Audited YouTube and TikTok impressions across network channels", source: "Pulse Network Q3 Report", validUntil: "2025-03-31" },
      ],
      officialClaims: ["All hardware products reviewed are purchased at retail unless explicitly announced in the first 10 seconds of the video."],
      importantDates: [{ event: "Pulse Creator Camp 2025", date: "2025-06-20" }],
      trustedDocs: [],
    },
    guidelineFiles: [
      { id: "pul-gfl-1", name: "Pulse_Creator_Network_Standards.pdf", size: "1.9 MB", type: "pdf", uploadDate: "2024-05-01", summary: "Creator disclosure guidelines, FTC sponsorship rules, thumbnail composition guides." },
    ],
    versionHistory: [
      { version: "v1.2", updatedDate: "2024-11-04T12:00:00Z", updatedBy: "Sophia Chen", changeSummary: "Clarified sponsorship disclosure language in shortform video descriptions." },
      { version: "v1.0", updatedDate: "2024-05-01T10:00:00Z", updatedBy: "Elena Rostova", changeSummary: "Initial network guidelines established." },
    ],
  },
];

export const INITIAL_CONTENT_ITEMS: ContentItem[] = [
  {
    id: "cnt-001",
    accountId: "acc-nexus",
    title: "Q4 Enterprise Launch LinkedIn Announcement",
    category: "Product Launch",
    targetPlatform: "LinkedIn",
    intendedAudience: "CTOs and VP of Engineering",
    campaignName: "Core Mesh 2.0 Launch",
    description: "Launch announcement for Nexus Core Mesh highlighting deterministic orchestration and 99.99% uptime.",
    contentType: "social_post",
    status: "needs_improvement",
    authorId: "usr-creator-1",
    authorName: "Sophia Chen",
    authorRole: "CREATOR",
    assignedReviewerId: "usr-rev-1",
    assignedReviewerName: "David Kim",
    currentVersion: 1,
    latestScore: 54,
    latestReportId: "rep-001",
    createdAt: "2024-11-06T08:30:00Z",
    updatedAt: "2024-11-06T09:15:00Z",
    rawContent: `🚀 THIS IS THE ONLY PRODUCT YOU WILL EVER NEED! BUY NOW!

Tired of lazy software engineers writing buggy microservices? Nexus Core Mesh is our new magical cheat code that will effortlessly replace all your backend developers overnight! 

We are proud to offer the cheapest cloud solution in the entire universe. Forget SOC 2 security audits or boring uptime SLAs—our revolutionary disruptor system guarantees 100% zero downtime forever without any effort! 

Click here right now to fire your dev team and let Nexus do everything for you! 💥💥💥`,
    versions: [
      {
        versionNumber: 1,
        title: "Q4 Enterprise Launch LinkedIn Announcement",
        createdAt: "2024-11-06T08:30:00Z",
        content: `🚀 THIS IS THE ONLY PRODUCT YOU WILL EVER NEED! BUY NOW!

Tired of lazy software engineers writing buggy microservices? Nexus Core Mesh is our new magical cheat code that will effortlessly replace all your backend developers overnight! 

We are proud to offer the cheapest cloud solution in the entire universe. Forget SOC 2 security audits or boring uptime SLAs—our revolutionary disruptor system guarantees 100% zero downtime forever without any effort! 

Click here right now to fire your dev team and let Nexus do everything for you! 💥💥💥`,
        changeSummary: "Initial draft submitted by Sophia Chen for compliance check.",
        alignmentScore: 54,
        analysisReportId: "rep-001",
      },
    ],
  },
  {
    id: "cnt-002",
    accountId: "acc-nexus",
    title: "Technical Whitepaper: Deterministic Agent Orchestration",
    category: "Technical Architecture",
    targetPlatform: "Blog",
    intendedAudience: "Cloud Architects and Infrastructure Engineers",
    campaignName: "Thought Leadership Series",
    description: "In-depth architecture breakdown of sub-14ms state synchronization across distributed VPC nodes.",
    contentType: "blog_article",
    status: "submitted_for_review",
    authorId: "usr-creator-1",
    authorName: "Sophia Chen",
    authorRole: "CREATOR",
    assignedReviewerId: "usr-rev-1",
    assignedReviewerName: "David Kim",
    currentVersion: 2,
    latestScore: 84,
    latestReportId: "rep-002",
    createdAt: "2024-11-05T14:00:00Z",
    updatedAt: "2024-11-06T11:20:00Z",
    rawContent: `Enterprise multi-agent systems face a persistent engineering hurdle: unmanaged state drift during inter-agent delegation. In traditional Kubernetes orchestrations, coordinating asynchronous LLM agents across geographically separated clusters introduces volatile latency spikes, often surpassing 320ms.

Nexus Core Mesh resolves this through a deterministic event log and hardware-accelerated routing mesh. In verified benchmark trials audited by IEEE Micro, our protocol sustained sub-14 millisecond internal orchestration overhead while preserving tenant isolation.

Every deployment operates within a dedicated zero-trust VPC, reinforced by our ISO/IEC 27001:2022 and SOC 2 Type II compliance controls. Furthermore, contractual SLAs provide 99.99% availability guarantees. For engineering leaders seeking provable resilience without vendor lock-in, deterministic orchestration provides the foundation for autonomous compute.`,
    versions: [
      {
        versionNumber: 1,
        title: "Technical Whitepaper Draft",
        createdAt: "2024-11-05T14:00:00Z",
        content: `Enterprise multi-agent systems are cool but hard. We have a fast system that does under 14ms and has good uptime.`,
        changeSummary: "First raw outline.",
        alignmentScore: 68,
      },
      {
        versionNumber: 2,
        title: "Technical Whitepaper: Deterministic Agent Orchestration",
        createdAt: "2024-11-06T11:20:00Z",
        content: `Enterprise multi-agent systems face a persistent engineering hurdle: unmanaged state drift during inter-agent delegation. In traditional Kubernetes orchestrations, coordinating asynchronous LLM agents across geographically separated clusters introduces volatile latency spikes, often surpassing 320ms.

Nexus Core Mesh resolves this through a deterministic event log and hardware-accelerated routing mesh. In verified benchmark trials audited by IEEE Micro, our protocol sustained sub-14 millisecond internal orchestration overhead while preserving tenant isolation.

Every deployment operates within a dedicated zero-trust VPC, reinforced by our ISO/IEC 27001:2022 and SOC 2 Type II compliance controls. Furthermore, contractual SLAs provide 99.99% availability guarantees. For engineering leaders seeking provable resilience without vendor lock-in, deterministic orchestration provides the foundation for autonomous compute.`,
        changeSummary: "Added verified ISO/IEC and IEEE citations and tightened tone to authoritative engineering standard.",
        alignmentScore: 84,
        analysisReportId: "rep-002",
      },
    ],
  },
  {
    id: "cnt-003",
    accountId: "acc-nexus",
    title: "Quarterly Case Study: Global FinTech Infrastructure Migration",
    category: "Case Study",
    targetPlatform: "Website",
    intendedAudience: "Enterprise VP of Engineering and Security Directors",
    campaignName: "Enterprise Proof Points",
    description: "Detailed case study covering a Tier-1 financial institution migrating 120,000 workloads to Nexus.",
    contentType: "document",
    status: "approved",
    authorId: "usr-mgr-1",
    authorName: "Marcus Vance",
    authorRole: "MANAGER",
    assignedReviewerId: "usr-admin-1",
    assignedReviewerName: "Elena Rostova",
    currentVersion: 1,
    latestScore: 96,
    latestReportId: "rep-003",
    createdAt: "2024-11-03T10:00:00Z",
    updatedAt: "2024-11-04T15:30:00Z",
    rawContent: `How a Tier-1 Global Financial Institution Migrated 120,000 Concurrent Autonomous Agent Workloads to Nexus Core Mesh

Executive Overview:
Managing high-frequency risk modeling with autonomous agents requires uncompromising determinism, sub-millisecond audit trails, and strict data residency. In Q2 2024, an international payment processor transitioned their distributed agent cluster to Nexus Cloud AI.

Quantified Results:
• 42% reduction in idle GPU infrastructure costs within 90 days.
• 100% adherence to FINRA and SOC 2 Type II audit trail requirements.
• Zero data leakage across dedicated VPC boundaries.
• 99.99% contractual uptime maintained over trailing 180 days.

"Nexus Core Mesh gave our engineering organization the deterministic stability required to deploy mission-critical financial agents into live production with confidence." — Chief Information Security Officer.`,
    versions: [
      {
        versionNumber: 1,
        title: "Quarterly Case Study: Global FinTech Infrastructure Migration",
        createdAt: "2024-11-03T10:00:00Z",
        content: `How a Tier-1 Global Financial Institution Migrated 120,000 Concurrent Autonomous Agent Workloads to Nexus Core Mesh

Executive Overview:
Managing high-frequency risk modeling with autonomous agents requires uncompromising determinism, sub-millisecond audit trails, and strict data residency. In Q2 2024, an international payment processor transitioned their distributed agent cluster to Nexus Cloud AI.

Quantified Results:
• 42% reduction in idle GPU infrastructure costs within 90 days.
• 100% adherence to FINRA and SOC 2 Type II audit trail requirements.
• Zero data leakage across dedicated VPC boundaries.
• 99.99% contractual uptime maintained over trailing 180 days.

"Nexus Core Mesh gave our engineering organization the deterministic stability required to deploy mission-critical financial agents into live production with confidence." — Chief Information Security Officer.`,
        changeSummary: "Fully audited case study with signed legal clearance from client.",
        alignmentScore: 96,
        analysisReportId: "rep-003",
      },
    ],
  },
  {
    id: "cnt-004",
    accountId: "acc-lumina",
    title: "Instagram Carousel: Cellular Energy & Mitochondria 101",
    category: "Educational",
    targetPlatform: "Instagram",
    intendedAudience: "Biohackers and Wellness Advocates",
    description: "Educational slides breaking down NAD+ depletion and how circadian rhythm supports mitochondrial biogenesis.",
    contentType: "social_post",
    status: "analysis_completed",
    authorId: "usr-creator-1",
    authorName: "Sophia Chen",
    authorRole: "CREATOR",
    assignedReviewerId: "usr-rev-1",
    assignedReviewerName: "David Kim",
    currentVersion: 1,
    latestScore: 78,
    latestReportId: "rep-004",
    createdAt: "2024-11-04T12:00:00Z",
    updatedAt: "2024-11-04T13:10:00Z",
    rawContent: `Did you know that by age 40, your cellular NAD+ levels drop by almost 50%? 🧬

Your mitochondria are the microscopic engines inside every cell, responsible for generating over 90% of the energy your body needs to think, repair tissue, and thrive.

Three research-backed ways to support cellular vitality:
1. Morning Photobiomodulation: Get 10–15 minutes of direct sunlight within 30 minutes of waking to set your circadian clock.
2. Intermittent Nutrient Signaling: Allow a 12 to 14 hour digestive rest window to trigger cellular autophagy.
3. Targeted Liposomal Precursors: Supplement with bioavailable cellular substrates verified by independent batch testing.

Explore our pure liposomal formula at luminahealth.com.

*These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease.`,
    versions: [
      {
        versionNumber: 1,
        title: "Instagram Carousel: Cellular Energy & Mitochondria 101",
        createdAt: "2024-11-04T12:00:00Z",
        content: `Did you know that by age 40, your cellular NAD+ levels drop by almost 50%? 🧬

Your mitochondria are the microscopic engines inside every cell, responsible for generating over 90% of the energy your body needs to think, repair tissue, and thrive.

Three research-backed ways to support cellular vitality:
1. Morning Photobiomodulation: Get 10–15 minutes of direct sunlight within 30 minutes of waking to set your circadian clock.
2. Intermittent Nutrient Signaling: Allow a 12 to 14 hour digestive rest window to trigger cellular autophagy.
3. Targeted Liposomal Precursors: Supplement with bioavailable cellular substrates verified by independent batch testing.

Explore our pure liposomal formula at luminahealth.com.

*These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease.`,
        changeSummary: "First carousel caption drafted with FDA disclaimer included.",
        alignmentScore: 78,
        analysisReportId: "rep-004",
      },
    ],
  },
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    title: "Critical Issue Flagged",
    message: "Q4 Enterprise Launch LinkedIn Announcement contains 4 high/critical violations (Tone, Claims, Prohibited Vocabulary).",
    type: "critical",
    link: "/reports/rep-001",
    read: false,
    createdAt: "2024-11-06T09:16:00Z",
  },
  {
    id: "notif-2",
    title: "Content Submitted for Review",
    message: "Sophia Chen submitted 'Technical Whitepaper: Deterministic Agent Orchestration' for final approval.",
    type: "review_submitted",
    link: "/approval?id=cnt-002",
    read: false,
    createdAt: "2024-11-06T11:21:00Z",
  },
  {
    id: "notif-3",
    title: "Content Approved",
    message: "Elena Rostova approved 'Quarterly Case Study: Global FinTech Infrastructure Migration' (Score: 96%).",
    type: "approved",
    link: "/history?id=cnt-003",
    read: true,
    createdAt: "2024-11-04T15:32:00Z",
  },
  {
    id: "notif-4",
    title: "AI Analysis Completed",
    message: "Analysis report generated for 'Instagram Carousel: Cellular Energy & Mitochondria 101' (Score: 78%).",
    type: "analysis",
    link: "/reports/rep-004",
    read: true,
    createdAt: "2024-11-04T13:11:00Z",
  },
];

export const INITIAL_ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: "act-1",
    accountId: "acc-nexus",
    userId: "usr-creator-1",
    userName: "Sophia Chen",
    action: "Uploaded & Analysed Content",
    details: "Uploaded 'Q4 Enterprise Launch LinkedIn Announcement' - Score: 54% (Needs Improvement)",
    timestamp: "2024-11-06T09:15:00Z",
  },
  {
    id: "act-2",
    accountId: "acc-nexus",
    userId: "usr-creator-1",
    userName: "Sophia Chen",
    action: "Revised Content in Studio",
    details: "Applied 3 suggested improvements to Technical Whitepaper. Score increased 68% -> 84%",
    timestamp: "2024-11-06T11:20:00Z",
  },
  {
    id: "act-3",
    accountId: "acc-nexus",
    userId: "usr-admin-1",
    userName: "Elena Rostova",
    action: "Approved Content",
    details: "Approved 'Quarterly Case Study: Global FinTech Infrastructure Migration' for publication",
    timestamp: "2024-11-04T15:30:00Z",
  },
  {
    id: "act-4",
    accountId: "acc-nexus",
    userId: "usr-admin-1",
    userName: "Elena Rostova",
    action: "Updated Brand Guidelines",
    details: "Updated version history to v3.2: Added strict prohibition on 'AI replacement of developers' phrasing",
    timestamp: "2024-11-01T10:00:00Z",
  },
];

export const INITIAL_REVIEW_COMMENTS: Record<string, ReviewComment[]> = {
  "cnt-001": [
    {
      id: "cm-1",
      contentId: "cnt-001",
      userId: "usr-rev-1",
      userName: "David Kim",
      userAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      userRole: "REVIEWER",
      content: "This draft directly violates our core brand principle against AI replacement hype. Please use the Improvement Studio to accept the suggested revisions immediately.",
      createdAt: "2024-11-06T09:20:00Z",
      isInternalNote: false,
    },
    {
      id: "cm-2",
      contentId: "cnt-001",
      userId: "usr-mgr-1",
      userName: "Marcus Vance",
      userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      userRole: "MANAGER",
      content: "Internal note: Sophia, let's make sure we reinforce our IEEE benchmarks here instead of aggressive promo claims.",
      createdAt: "2024-11-06T09:25:00Z",
      isInternalNote: true,
    },
  ],
  "cnt-002": [
    {
      id: "cm-3",
      contentId: "cnt-002",
      userId: "usr-creator-1",
      userName: "Sophia Chen",
      userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
      userRole: "CREATOR",
      content: "Revised version submitted! I have addressed the missing ISO citation and brought tone directly into our engineering standard.",
      createdAt: "2024-11-06T11:22:00Z",
      isInternalNote: false,
    },
  ],
};
