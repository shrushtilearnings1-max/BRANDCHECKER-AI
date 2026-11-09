"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { useApp } from "@/context/AppContext";
import { DiffViewer } from "@/components/common/DiffViewer";
import { CircularScore } from "@/components/common/CircularScore";
import { SeverityBadge } from "@/components/common/Badge";
import {
  Sparkles,
  CheckCircle2,
  Save,
  RotateCcw,
  Send,
  History,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  FileCheck,
  Check,
} from "lucide-react";
import { StorageService } from "@/lib/storage";
import { analyzeContentWithBrandRules, generateImprovedContent } from "@/lib/analysis-engine";
import { extractAndVerifyClaims } from "@/lib/claim-trace";
import { simulatePersonaResonance } from "@/lib/persona-resonance";
import { ContentItem, ContentVersion, ClaimTraceReport, PersonaResonanceReport } from "@/types";
import { ClaimStatusBadge } from "@/components/common/Badge";
import { ShieldCheck, Users } from "lucide-react";

function ImprovementStudioContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const contentId = searchParams.get("id");
  const {
    activeAccount,
    activeAccountContentItems,
    updateContentItem,
    logActivity,
    currentUser,
    geminiApiKey,
  } = useApp();

  // Find target item or default to first item
  const selectedItem =
    activeAccountContentItems.find(c => c.id === contentId) ||
    activeAccountContentItems[0];

  const report = selectedItem?.latestReportId
    ? StorageService.getReportById(selectedItem.latestReportId)
    : undefined;

  const [editableContent, setEditableContent] = useState(selectedItem?.rawContent || "");
  const [improvedDraft, setImprovedDraft] = useState("");
  const [isReanalyzing, setIsReanalyzing] = useState(false);
  const [activeScore, setActiveScore] = useState(selectedItem?.latestScore || 54);
  const [versions, setVersions] = useState<ContentVersion[]>(selectedItem?.versions || []);
  const [claimTrace, setClaimTrace] = useState<ClaimTraceReport | null>(null);
  const [personaResonance, setPersonaResonance] = useState<PersonaResonanceReport | null>(null);

  useEffect(() => {
    if (selectedItem) {
      setEditableContent(selectedItem.rawContent);
      setActiveScore(selectedItem.latestScore || 54);
      setVersions(selectedItem.versions || []);

      const existingClaims = StorageService.getClaimTraceReport(selectedItem.id);
      if (existingClaims) {
        setClaimTrace(existingClaims);
      } else {
        const ct = extractAndVerifyClaims({
          content: selectedItem.rawContent,
          title: selectedItem.title,
          account: activeAccount,
          contentId: selectedItem.id,
        });
        setClaimTrace(ct);
        StorageService.saveClaimTraceReport(ct);
      }

      const existingPersona = StorageService.getPersonaResonanceReport(selectedItem.id);
      if (existingPersona) {
        setPersonaResonance(existingPersona);
      } else {
        const pr = simulatePersonaResonance({
          content: selectedItem.rawContent,
          targetAudience: selectedItem.intendedAudience,
          account: activeAccount,
          contentId: selectedItem.id,
        });
        setPersonaResonance(pr);
        StorageService.savePersonaResonanceReport(pr);
      }

      if (report) {
        const autoImproved = generateImprovedContent(
          selectedItem.rawContent,
          report.issues,
          activeAccount
        );
        setImprovedDraft(autoImproved);
      }
    }
  }, [selectedItem?.id]);

  const handleApplyAllSuggestions = () => {
    if (improvedDraft) {
      setEditableContent(improvedDraft);
    }
  };

  const handleReanalyze = async () => {
    if (!selectedItem) return;
    setIsReanalyzing(true);

    const targetAccount = activeAccount;
    const freshReport = await analyzeContentWithBrandRules(
      {
        content: editableContent,
        title: selectedItem.title,
        account: targetAccount,
        category: selectedItem.category,
        targetPlatform: selectedItem.targetPlatform,
        intendedAudience: selectedItem.intendedAudience,
      },
      geminiApiKey
    );

    const newReportId = `rep-${Date.now()}`;
    const newVersionNumber = (selectedItem.currentVersion || 1) + 1;

    // Run ClaimTrace Verification on edited text
    const claimTraceReport = extractAndVerifyClaims({
      content: editableContent,
      title: selectedItem.title,
      account: targetAccount,
      contentId: selectedItem.id,
    });
    freshReport.claimTrace = claimTraceReport;
    StorageService.saveClaimTraceReport(claimTraceReport);
    setClaimTrace(claimTraceReport);

    // Run Persona Resonance Simulation on edited text
    const personaReport = simulatePersonaResonance({
      content: editableContent,
      targetAudience: selectedItem.intendedAudience,
      account: targetAccount,
      contentId: selectedItem.id,
    });
    freshReport.personaResonance = personaReport;
    StorageService.savePersonaResonanceReport(personaReport);
    setPersonaResonance(personaReport);

    freshReport.id = newReportId;
    freshReport.contentId = selectedItem.id;
    freshReport.contentVersion = newVersionNumber;
    StorageService.saveReport(freshReport);

    const newVersion: ContentVersion = {
      versionNumber: newVersionNumber,
      createdAt: new Date().toISOString(),
      content: editableContent,
      title: selectedItem.title,
      changeSummary: `Revision ${newVersionNumber}: Applied brand suggestions. Score lifted to ${freshReport.overallScore}%`,
      analysisReportId: newReportId,
      alignmentScore: freshReport.overallScore,
    };

    const updatedItem: ContentItem = {
      ...selectedItem,
      rawContent: editableContent,
      currentVersion: newVersionNumber,
      latestScore: freshReport.overallScore,
      latestReportId: newReportId,
      status: freshReport.overallScore >= 80 ? "analysis_completed" : "needs_improvement",
      versions: [...(selectedItem.versions || []), newVersion],
      updatedAt: new Date().toISOString(),
    };

    updateContentItem(updatedItem);
    setActiveScore(freshReport.overallScore);
    setVersions(updatedItem.versions);
    setIsReanalyzing(false);

    logActivity(
      "Reanalysed Content in Studio",
      `Score updated: ${selectedItem.latestScore}% -> ${freshReport.overallScore}%`
    );
  };

  const handleSubmitForReview = () => {
    if (!selectedItem) return;
    const updatedItem: ContentItem = {
      ...selectedItem,
      status: "submitted_for_review",
      updatedAt: new Date().toISOString(),
    };
    updateContentItem(updatedItem);
    StorageService.addNotification({
      title: "Content Submitted for Review",
      message: `${currentUser.name} submitted '${selectedItem.title}' (Score: ${activeScore}%) for approval.`,
      type: "review_submitted",
      link: `/approval?id=${selectedItem.id}`,
    });
    logActivity("Submitted for Review", `Submitted '${selectedItem.title}' for managerial sign-off.`);
    router.push("/approval");
  };

  if (!selectedItem) {
    return (
      <AppShell>
        <div className="py-16 text-center">
          <p className="text-slate-400">No content items found for this account.</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
                Studio Workspace
              </span>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs text-slate-400">Interactive Correction Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
              <Sparkles className="w-7 h-7 text-purple-400" />
              Content Improvement Studio
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleReanalyze}
              disabled={isReanalyzing}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-glow-purple transition-all flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isReanalyzing ? "animate-spin" : ""}`} />
              Re-Analyse Content
            </button>

            <button
              onClick={handleSubmitForReview}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg transition-all flex items-center gap-1.5 active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              Submit for Review
            </button>
          </div>
        </div>

        {/* Studio Top Control Strip: Current Score vs Version Progression */}
        <div className="p-5 rounded-2xl bg-navy-900/80 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <CircularScore score={activeScore} size={84} strokeWidth={8} showTierLabel={false} />
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Current Alignment
              </div>
              <div className="text-xl font-bold text-white mt-0.5">
                Version {selectedItem.currentVersion || 1} • {activeScore}%
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Target: {selectedItem.title}
              </div>
            </div>
          </div>

          {/* Revision Progress Trajectory */}
          <div className="flex-1 max-w-md bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-bold text-slate-300 flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-purple-400" />
                Score Progression
              </span>
              <span className="text-[11px] font-mono text-emerald-400 font-bold">
                {versions.length > 1 ? `+${activeScore - (versions[0]?.alignmentScore || 54)}% Lift` : "Baseline Draft"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {versions.map((ver, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center">
                  <span className="text-[10px] font-mono text-purple-300 font-bold">
                    v{ver.versionNumber} ({ver.alignmentScore || 54}%)
                  </span>
                  <div
                    className={`w-full h-1.5 rounded-full mt-1 ${
                      idx === versions.length - 1 ? "bg-purple-500 shadow-glow-purple" : "bg-purple-900/40"
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Side-by-Side Diff Comparison Viewer */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              Before & After Comparison (Original vs Brand-Aligned)
            </h3>
            <span className="text-xs text-slate-400">
              Preserves creator purpose while removing off-brand statements
            </span>
          </div>

          <DiffViewer
            originalText={selectedItem.rawContent}
            improvedText={improvedDraft || selectedItem.rawContent}
            onApplyAll={handleApplyAllSuggestions}
          />
        </div>

        {/* Live Manual / Fine-Tuning Editor */}
        <div className="p-6 rounded-2xl bg-navy-900/80 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
              Interactive Content Editor (Fine-Tune Your Revision)
            </label>
            <span className="text-[11px] text-slate-500 font-mono">
              {editableContent.length} chars • {editableContent.split(/\s+/).filter(Boolean).length} words
            </span>
          </div>

          <textarea
            rows={8}
            value={editableContent}
            onChange={e => setEditableContent(e.target.value)}
            className="w-full px-4 py-3 text-xs sm:text-sm bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500 leading-relaxed font-sans"
          />

          <div className="flex items-center justify-between pt-2">
            <p className="text-[11px] text-slate-400">
              Click <strong>"Re-Analyse Content"</strong> to evaluate edits against {activeAccount.name}'s guidelines and update your alignment score.
            </p>

            <button
              onClick={handleReanalyze}
              disabled={isReanalyzing}
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-glow-purple flex items-center gap-1.5"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isReanalyzing ? "animate-spin" : ""}`} />
              Re-Analyse Now
            </button>
          </div>
        </div>

        {/* ClaimTrace & Audience Fit Inspector in Studio */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* ClaimTrace Status */}
          <div className="p-5 rounded-2xl bg-navy-900/80 border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  ClaimTrace Claim Status
                </h4>
              </div>
              {claimTrace && (
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                  Integrity: {claimTrace.overallClaimIntegrityScore}%
                </span>
              )}
            </div>

            {claimTrace && claimTrace.claims.length > 0 ? (
              <div className="space-y-2.5">
                {claimTrace.claims.map(claim => (
                  <div
                    key={claim.id}
                    className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <ClaimStatusBadge status={claim.status} />
                      <span className="text-[10px] font-mono text-slate-400">{claim.confidence}% conf</span>
                    </div>
                    <p className="text-[11px] text-slate-200 font-sans italic">"{claim.claimText}"</p>
                    {claim.suggestedCorrection && (
                      <div className="text-[10px] text-purple-300 bg-purple-950/20 p-2 rounded border border-purple-900/30">
                        <span className="font-bold">Suggested: </span>
                        {claim.suggestedCorrection}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-slate-400 italic py-2">
                No quantitative or sensitive factual claims requiring verification.
              </div>
            )}
          </div>

          {/* Persona Resonance Status */}
          <div className="p-5 rounded-2xl bg-navy-900/80 border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Audience Persona Resonance
                </h4>
              </div>
              {personaResonance && (
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  Fit: {personaResonance.overallAudienceFitScore}%
                </span>
              )}
            </div>

            {personaResonance ? (
              <div className="space-y-2.5">
                {personaResonance.personaAnalyses.map(p => (
                  <div
                    key={p.personaId}
                    className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-bold text-white">{p.personaName}</div>
                      <div className="text-[10px] text-slate-400">Tone: {p.toneFit} • Friction: {p.jargonFriction}</div>
                    </div>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                      {p.resonanceScore}%
                    </span>
                  </div>
                ))}
                <div className="p-2.5 rounded-xl bg-indigo-950/20 border border-indigo-500/20 text-[11px] text-indigo-200">
                  Cognitive load is <strong>{personaResonance.cognitiveLoadLevel}</strong> (Reading ease: {personaResonance.fleschReadingEaseEstimate}/100).
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-400 italic py-2">
                Persona resonance analysis ready upon re-analysis.
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

export default function ImprovementStudioPage() {
  return (
    <Suspense
      fallback={
        <AppShell>
          <div className="py-20 text-center text-xs text-slate-400">
            Loading Improvement Studio...
          </div>
        </AppShell>
      }
    >
      <ImprovementStudioContent />
    </Suspense>
  );
}
