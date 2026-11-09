"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { useApp } from "@/context/AppContext";
import {
  Building2,
  Compass,
  Layers,
  Volume2,
  Palette,
  FileCheck2,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Upload,
  Plus,
  Trash2,
} from "lucide-react";
import { Account, ContentPillar, ApprovedFact } from "@/types";
import { DEFAULT_SCORING_WEIGHTS } from "@/lib/scoring";

const STEPS = [
  { id: 1, label: "Basic Info", icon: Building2 },
  { id: 2, label: "Brand Vision", icon: Compass },
  { id: 3, label: "Content Strategy", icon: Layers },
  { id: 4, label: "Communication Identity", icon: Volume2 },
  { id: 5, label: "Visual Identity", icon: Palette },
  { id: 6, label: "Approved Facts & Docs", icon: FileCheck2 },
];

export default function AccountSetupPage() {
  const router = useRouter();
  const { updateAccount, setActiveAccount, logActivity } = useApp();
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [industry, setIndustry] = useState("Technology & SaaS");
  const [website, setWebsite] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [accountPurpose, setAccountPurpose] = useState("");

  // Step 2: Vision
  const [mission, setMission] = useState("");
  const [longTermVision, setLongTermVision] = useState("");
  const [contentPhilosophy, setContentPhilosophy] = useState("");
  const [desiredPerception, setDesiredPerception] = useState("");
  const [focusTopics, setFocusTopics] = useState("Enterprise Security, High Performance, Architecture");
  const [avoidedTopics, setAvoidedTopics] = useState("Replacing Engineers, Discount Price Wars, Unverified Benchmarks");

  // Step 3: Strategy
  const [pillars, setPillars] = useState<ContentPillar[]>([
    { id: "p1", name: "Engineering Architecture", description: "Deep technical articles and blueprints", targetPercentage: 40 },
    { id: "p2", name: "Security & Governance", description: "Compliance, audits, and SLA verification", targetPercentage: 35 },
    { id: "p3", name: "Customer Outocmes", description: "Case studies with quantified ROI", targetPercentage: 25 },
  ]);
  const [postingStyle, setPostingStyle] = useState("Insightful, markdown-formatted, clear benchmarks.");

  // Step 4: Communication
  const [brandVoice, setBrandVoice] = useState("Authoritative, calm, and intellectually honest");
  const [tone, setTone] = useState("Measured, technical, confident without boasting");
  const [formalityLevel, setFormalityLevel] = useState<"Professional" | "Conversational" | "Casual" | "Authoritative">("Professional");
  const [preferredVocab, setPreferredVocab] = useState("deterministic, orchestration, enterprise-grade, low-latency");
  const [avoidedWords, setAvoidedWords] = useState("magic, cheat code, effortless overnight, cheapest, BUY NOW");

  // Step 5: Visual
  const [primaryColor, setPrimaryColor] = useState("#0B0F19");
  const [secondaryColor, setSecondaryColor] = useState("#7C3AED");
  const [accentColor, setAccentColor] = useState("#06B6D4");
  const [typographyPrimary, setTypographyPrimary] = useState("Inter, system-ui");
  const [imageStyle, setImageStyle] = useState("High-contrast dark mode screens and architectural node diagrams.");

  // Step 6: Approved Information
  const [facts, setFacts] = useState<ApprovedFact[]>([
    { id: "f1", claim: "99.99% contractual uptime SLA guaranteed", category: "Performance SLA", verifiedSource: "Master Services Agreement", approvedDate: "2024-01-01" },
    { id: "f2", claim: "SOC 2 Type II and ISO 27001 certified", category: "Security", verifiedSource: "Third-party audit", approvedDate: "2024-06-01" },
  ]);
  const [newClaim, setNewClaim] = useState("");
  const [newSource, setNewSource] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([
    "Brand_Standards_Master.pdf (3.4 MB)",
  ]);

  const handleAddFact = () => {
    if (!newClaim.trim()) return;
    setFacts(prev => [
      ...prev,
      {
        id: `f-${Date.now()}`,
        claim: newClaim.trim(),
        category: "General",
        verifiedSource: newSource.trim() || "Official Documentation",
        approvedDate: new Date().toISOString().split("T")[0],
      },
    ]);
    setNewClaim("");
    setNewSource("");
  };

  const handleAddFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFiles(prev => [...prev, `${file.name} (${(file.size / (1024 * 1024)).toFixed(1)} MB)`]);
    }
  };

  const handleFinishSetup = () => {
    const accountId = `acc-${Date.now()}`;
    const newAccount: Account = {
      id: accountId,
      name: name || "New Enterprise Brand",
      slug: (name || "brand").toLowerCase().replace(/\s+/g, "-"),
      logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80",
      description: description || "Enterprise brand profile.",
      industry,
      website: website || "https://example.com",
      platforms: ["LinkedIn", "Twitter/X", "Blog", "Website"],
      targetAudience: targetAudience || "Enterprise technology leaders and professionals",
      accountPurpose: accountPurpose || "Ensure consistent high-fidelity communication.",
      scoringWeights: { ...DEFAULT_SCORING_WEIGHTS },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      vision: {
        longTermVision: longTermVision || "Lead industry standards with verified trust.",
        mission: mission || "Empower users with transparent and reliable solutions.",
        coreObjectives: ["Drive brand authority", "Enforce compliance", "Maintain trust"],
        contentPhilosophy: contentPhilosophy || "Zero hyperbole, grounded in reproducible evidence.",
        desiredAudiencePerception: desiredPerception || "Dependable, precise, and thoughtful.",
        focusTopics: focusTopics.split(",").map(t => t.trim()).filter(Boolean),
        avoidedTopics: avoidedTopics.split(",").map(t => t.trim()).filter(Boolean),
      },
      contentStrategy: {
        pillars,
        preferredCategories: ["Article", "Technical Deep Dive", "Case Study"],
        postingStyle,
        contentBalance: { educational: 60, entertainment: 10, promotional: 30 },
        audienceInterests: ["Infrastructure", "Compliance", "Security"],
        communicationApproach: "Professional and consultative.",
      },
      communicationIdentity: {
        brandVoice,
        tone,
        formalityLevel,
        preferredVocabulary: preferredVocab.split(",").map(v => v.trim()).filter(Boolean),
        avoidedWords: avoidedWords.split(",").map(w => w.trim()).filter(Boolean),
        languagePreferences: "Standard US English.",
        writingStyleGuide: "Lead with the solution. Ground every claim with verified facts.",
      },
      visualIdentity: {
        logoUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80",
        primaryColor,
        secondaryColor,
        accentColor,
        backgroundColor: "#030712",
        typographyPrimary,
        typographySecondary: "JetBrains Mono, monospace",
        imageStyle,
        designReferences: [],
        approvedGraphics: [],
      },
      approvedInformation: {
        facts,
        products: [],
        statistics: [],
        officialClaims: ["Backed by official enterprise SLAs."],
        importantDates: [],
        trustedDocs: uploadedFiles.map((f, idx) => ({
          id: `doc-${idx}`,
          name: f,
          size: "2 MB",
          type: "application/pdf",
          uploadDate: new Date().toISOString().split("T")[0],
          summary: "Uploaded brand guidelines documentation.",
        })),
      },
      guidelineFiles: uploadedFiles.map((f, idx) => ({
        id: `gfl-${idx}`,
        name: f,
        size: "2 MB",
        type: "pdf",
        uploadDate: new Date().toISOString().split("T")[0],
        summary: "Ingested guideline source document.",
      })),
      versionHistory: [
        {
          version: "v1.0",
          updatedDate: new Date().toISOString(),
          updatedBy: "Admin",
          changeSummary: "Initial brand baseline created via Onboarding Wizard.",
        },
      ],
    };

    updateAccount(newAccount);
    setActiveAccount(accountId);
    logActivity("Created New Account Profile", `Created brand profile: "${newAccount.name}"`);
    router.push("/guidelines");
  };

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-xs text-purple-400 font-semibold mb-1 uppercase tracking-wider">
            <span>Onboarding Wizard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Account & Brand Identity Setup
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Define your account's vision, communication standards, approved facts, and visual assets.
            All future AI content analyses will compare incoming uploads directly against this identity.
          </p>
        </div>

        {/* Wizard Steps Navigation Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {STEPS.map(step => {
            const Icon = step.icon;
            const isCurrent = step.id === currentStep;
            const isCompleted = step.id < currentStep;

            return (
              <button
                key={step.id}
                onClick={() => setCurrentStep(step.id)}
                className={`flex flex-col items-center p-3 rounded-xl border text-center transition-all ${
                  isCurrent
                    ? "bg-purple-600/20 border-purple-500/50 text-white shadow-glow-purple"
                    : isCompleted
                    ? "bg-slate-900 border-emerald-500/30 text-emerald-300"
                    : "bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-900"
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-mono font-bold">Step {step.id}</span>
                </div>
                <span className="text-xs font-semibold truncate w-full">{step.label}</span>
              </button>
            );
          })}
        </div>

        {/* Step Content Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-navy-900/80 border border-slate-800 shadow-xl space-y-6">
          {/* STEP 1: BASIC INFO */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-purple-400" />
                Step 1: Account Basic Information
              </h2>
              <p className="text-xs text-slate-400">
                Identify the channel, organization, or media property you are governing.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Brand / Account Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Apex Security Labs"
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Industry / Category</label>
                  <input
                    type="text"
                    value={industry}
                    onChange={e => setIndustry(e.target.value)}
                    placeholder="e.g. Enterprise Cloud & Cybersecurity"
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Official Website</label>
                  <input
                    type="text"
                    value={website}
                    onChange={e => setWebsite(e.target.value)}
                    placeholder="https://apexsecurity.io"
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Target Audience</label>
                  <input
                    type="text"
                    value={targetAudience}
                    onChange={e => setTargetAudience(e.target.value)}
                    placeholder="e.g. CISOs, Security Engineers, and IT Directors"
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Brand Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Provide a concise description of your organization's mission and offerings..."
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Account Purpose</label>
                <input
                  type="text"
                  value={accountPurpose}
                  onChange={e => setAccountPurpose(e.target.value)}
                  placeholder="e.g. Establish technical thought leadership and maintain trusted customer communication."
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
          )}

          {/* STEP 2: BRAND VISION */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Compass className="w-5 h-5 text-purple-400" />
                Step 2: Account Vision & Boundaries
              </h2>
              <p className="text-xs text-slate-400">
                Establish strategic objectives and explicitly declare topics your brand embraces or avoids.
              </p>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Mission Statement</label>
                <textarea
                  rows={2}
                  value={mission}
                  onChange={e => setMission(e.target.value)}
                  placeholder="e.g. Deliver deterministic, zero-trust cloud infrastructure with uncompromised resilience."
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Content Philosophy</label>
                <textarea
                  rows={2}
                  value={contentPhilosophy}
                  onChange={e => setContentPhilosophy(e.target.value)}
                  placeholder="e.g. Zero hyperbole. Always ground every metric in verified benchmark data or customer proofs."
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-emerald-400 mb-1">
                    Topics the Account Focuses On (Comma Separated)
                  </label>
                  <textarea
                    rows={3}
                    value={focusTopics}
                    onChange={e => setFocusTopics(e.target.value)}
                    placeholder="Zero-trust VPC, SOC 2, latency benchmarks, deterministic failover"
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-emerald-900/40 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-red-400 mb-1">
                    Topics the Account Avoids (Strict Prohibitions)
                  </label>
                  <textarea
                    rows={3}
                    value={avoidedTopics}
                    onChange={e => setAvoidedTopics(e.target.value)}
                    placeholder="Replacing all engineers, discount pricing wars, unverified competitor bashing"
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-red-900/40 rounded-xl text-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: CONTENT STRATEGY */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-purple-400" />
                Step 3: Strategic Content Pillars
              </h2>
              <p className="text-xs text-slate-400">
                Pillars maintain editorial balance and prevent category drift.
              </p>

              <div className="space-y-3">
                {pillars.map((pillar, idx) => (
                  <div key={pillar.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-purple-400">{idx + 1}.</span>
                    <div className="flex-1">
                      <div className="text-xs font-bold text-white">{pillar.name}</div>
                      <div className="text-[11px] text-slate-400">{pillar.description}</div>
                    </div>
                    <span className="text-xs font-mono font-bold text-purple-300 px-2 py-0.5 rounded bg-purple-500/10">
                      {pillar.targetPercentage}%
                    </span>
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Posting Style & Cadence</label>
                <input
                  type="text"
                  value={postingStyle}
                  onChange={e => setPostingStyle(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
          )}

          {/* STEP 4: COMMUNICATION IDENTITY */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-purple-400" />
                Step 4: Communication Tone & Vocabulary
              </h2>
              <p className="text-xs text-slate-400">
                Define the voice of your brand and configure prohibited keywords that trigger automated alerts.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Brand Voice</label>
                  <input
                    type="text"
                    value={brandVoice}
                    onChange={e => setBrandVoice(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Formality Level</label>
                  <select
                    value={formalityLevel}
                    onChange={e => setFormalityLevel(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="Professional">Professional (Enterprise)</option>
                    <option value="Conversational">Conversational (Modern B2B)</option>
                    <option value="Authoritative">Authoritative (Academic / Clinical)</option>
                    <option value="Casual">Casual (Creator Community)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-emerald-400 mb-1">
                  Preferred Vocabulary (Approved Lexicon)
                </label>
                <input
                  type="text"
                  value={preferredVocab}
                  onChange={e => setPreferredVocab(e.target.value)}
                  placeholder="deterministic, orchestration, enterprise-grade, low-latency, provable"
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-emerald-900/40 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-red-400 mb-1">
                  Words & Phrases to Avoid (Strict Blacklist)
                </label>
                <input
                  type="text"
                  value={avoidedWords}
                  onChange={e => setAvoidedWords(e.target.value)}
                  placeholder="magic, cheat code, effortless overnight, cheapest, BUY NOW, revolutionary disruptor"
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-red-900/40 rounded-xl text-white focus:outline-none focus:border-red-500"
                />
              </div>
            </div>
          )}

          {/* STEP 5: VISUAL IDENTITY */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Palette className="w-5 h-5 text-purple-400" />
                Step 5: Visual Standards & Color Space
              </h2>
              <p className="text-xs text-slate-400">
                Visual identity rules applied when auditing image uploads and design assets.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Primary Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={e => setPrimaryColor(e.target.value)}
                      className="w-8 h-8 rounded border border-slate-800 bg-transparent cursor-pointer"
                    />
                    <input
                      type="text"
                      value={primaryColor}
                      onChange={e => setPrimaryColor(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Secondary Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={secondaryColor}
                      onChange={e => setSecondaryColor(e.target.value)}
                      className="w-8 h-8 rounded border border-slate-800 bg-transparent cursor-pointer"
                    />
                    <input
                      type="text"
                      value={secondaryColor}
                      onChange={e => setSecondaryColor(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Accent Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={accentColor}
                      onChange={e => setAccentColor(e.target.value)}
                      className="w-8 h-8 rounded border border-slate-800 bg-transparent cursor-pointer"
                    />
                    <input
                      type="text"
                      value={accentColor}
                      onChange={e => setAccentColor(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Image Style & Aesthetic</label>
                <input
                  type="text"
                  value={imageStyle}
                  onChange={e => setImageStyle(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
          )}

          {/* STEP 6: APPROVED INFORMATION & FILES */}
          {currentStep === 6 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-purple-400" />
                Step 6: Approved Information & Source Documents
              </h2>
              <p className="text-xs text-slate-400">
                Ground the AI governance engine in verified company facts and upload existing brand guidelines files (PDF, DOCX, TXT).
              </p>

              {/* Upload Guideline File */}
              <div className="p-4 rounded-xl border border-dashed border-slate-700 bg-slate-950/60 text-center">
                <Upload className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                <div className="text-xs font-semibold text-white">Upload Existing Brand Guidelines File</div>
                <div className="text-[11px] text-slate-400 mb-3">Accepts PDF, DOCX, or TXT documents</div>
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium cursor-pointer transition-colors">
                  <span>Browse File</span>
                  <input type="file" accept=".pdf,.docx,.txt" onChange={handleAddFile} className="hidden" />
                </label>

                {uploadedFiles.length > 0 && (
                  <div className="mt-3 flex flex-wrap justify-center gap-2">
                    {uploadedFiles.map((file, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-purple-950/40 border border-purple-500/30 text-purple-300">
                        ✓ {file}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Verified Facts List */}
              <div className="pt-2">
                <div className="text-xs font-bold text-white mb-2">Verified Company Facts</div>
                <div className="space-y-2 mb-3">
                  {facts.map((fact, idx) => (
                    <div key={fact.id} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-semibold text-white">{fact.claim}</div>
                        <div className="text-[10px] text-slate-500">Source: {fact.verifiedSource} • {fact.approvedDate}</div>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10">
                        Verified
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newClaim}
                    onChange={e => setNewClaim(e.target.value)}
                    placeholder="Enter an official claim or fact..."
                    className="flex-1 px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white"
                  />
                  <input
                    type="text"
                    value={newSource}
                    onChange={e => setNewSource(e.target.value)}
                    placeholder="Source citation"
                    className="w-40 px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white"
                  />
                  <button
                    onClick={handleAddFact}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-800">
            {currentStep > 1 ? (
              <button
                onClick={() => setCurrentStep(prev => prev - 1)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-800 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Previous Step
              </button>
            ) : <div />}

            {currentStep < 6 ? (
              <button
                onClick={() => setCurrentStep(prev => prev + 1)}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-glow-purple transition-all"
              >
                Next Step
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleFinishSetup}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                Complete Account Setup
              </button>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
