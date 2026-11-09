"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { useApp } from "@/context/AppContext";
import { CircularScore } from "@/components/common/CircularScore";
import { SeverityBadge, ContentStatusBadge } from "@/components/common/Badge";
import {
  FileSearch,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Check,
  X,
  Send,
  Sliders,
  ChevronDown,
  Layers,
  Compass,
  Volume2,
  Users,
  Eye,
  BookOpen,
} from "lucide-react";
import { StorageService } from "@/lib/storage";
import {
  AnalysisDimension,
  ContentIssue,
  IssueSeverity,
  ClaimTraceReport,
  ClaimVerificationStatus,
  PersonaResonanceReport,
} from "@/types";
import { DIMENSION_METADATA } from "@/lib/scoring";
import { extractAndVerifyClaims } from "@/lib/claim-trace";
import { simulatePersonaResonance } from "@/lib/persona-resonance";
import { ClaimTraceCard } from "@/components/claimtrace/ClaimTraceCard";
import { PersonaResonanceCard } from "@/components/persona/PersonaResonanceCard";

export default function ReportDetailPage() {
  const params = useParams();
  const router = useRouter();
  const reportId = params?.id as string;
  const { activeAccount, activeAccountContentItems, logActivity } = useApp();

  const report = StorageService.getReportById(reportId);
  const content = activeAccountContentItems.find(c => c.id === report?.contentId);

  const [selectedSeverity, setSelectedSeverity] = useState<string>("all");
  const [issuesList, setIssuesList] = useState<ContentIssue[]>(report?.issues || []);
  const [activeTab, setActiveTab] = useState<"dimensions" | "issues" | "claimtrace" | "persona">("dimensions");

  const [claimTrace, setClaimTrace] = useState<ClaimTraceReport | null>(() => {
    if (report?.claimTrace) return report.claimTrace;
    if (report?.contentId) {
      const stored = StorageService.getClaimTraceReport(report.contentId);
      if (stored) return stored;
    }
    if (content && activeAccount) {
      const gen = extractAndVerifyClaims({
        content: content.currentText,
        title: content.title,
        account: activeAccount,
        contentId: content.id,
      });
      StorageService.saveClaimTraceReport(gen);
      if (report) {
        report.claimTrace = gen;
        StorageService.saveReport(report);
      }
      return gen;
    }
    return null;
  });

  const [personaResonance, setPersonaResonance] = useState<PersonaResonanceReport | null>(() => {
    if (report?.personaResonance) return report.personaResonance;
    if (report?.contentId) {
      const stored = StorageService.getPersonaResonanceReport(report.contentId);
      if (stored) return stored;
    }
    if (content && activeAccount) {
      const gen = simulatePersonaResonance({
        content: content.currentText,
        targetAudience: content.intendedAudience,
        account: activeAccount,
        contentId: content.id,
      });
      StorageService.savePersonaResonanceReport(gen);
      if (report) {
        report.personaResonance = gen;
        StorageService.saveReport(report);
      }
      return gen;
    }
    return null;
  });

  if (!report) {
    return (
      <AppShell>
        <div className="py-16 text-center space-y-4">
          <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto" />
          <h2 className="text-xl font-bold text-white">Report Not Found</h2>
          <p className="text-xs text-slate-400">The requested report ID could not be loaded.</p>
          <Link href="/reports" className="px-4 py-2 bg-purple-600 rounded-xl text-xs font-bold text-white">
            Return to Reports
          </Link>
        </div>
      </AppShell>
    );
  }

  const dimensions = Object.keys(report.dimensionScores) as AnalysisDimension[];

  const handleResolveIssue = (issueId: string) => {
    const updated = issuesList.map(iss =>
      iss.id === issueId ? { ...iss, status: "resolved" as const } : iss
    );
    setIssuesList(updated);
    report.issues = updated;
    StorageService.saveReport(report);
    logActivity("Marked Issue Resolved", `Resolved issue: ${issueId} in report ${report.id}`);
  };

  const handleIgnoreIssue = (issueId: string) => {
    const updated = issuesList.map(iss =>
      iss.id === issueId ? { ...iss, status: "ignored" as const, resolutionComment: "Ignored by auditor with approval" } : iss
    );
    setIssuesList(updated);
    report.issues = updated;
    StorageService.saveReport(report);
    logActivity("Ignored Issue", `Ignored issue: ${issueId} in report ${report.id}`);
  };

  const handleUpdateClaimStatus = (claimId: string, newStatus: ClaimVerificationStatus, note?: string) => {
    if (!claimTrace) return;
    const updatedClaims = claimTrace.claims.map(c =>
      c.id === claimId
        ? {
            ...c,
            status: newStatus,
            isReviewed: true,
            reviewedBy: "Compliance Auditor",
            reviewedAt: new Date().toISOString(),
            reviewerNote: note || c.reviewerNote,
          }
        : c
    );

    const verified = updatedClaims.filter(c => c.status === "verified").length;
    const contradicted = updatedClaims.filter(c => c.status === "contradicted").length;
    const unsupported = updatedClaims.filter(c => c.status === "unsupported").length;
    const outdated = updatedClaims.filter(c => c.status === "outdated").length;
    const needsReview = updatedClaims.filter(c => c.status === "needs_review" && !c.isReviewed).length;

    const total = updatedClaims.length;
    const integrityScore =
      total > 0
        ? Math.round(((verified + (total - contradicted - unsupported * 0.5)) / (total * 2)) * 100)
        : 100;

    const updatedReport: ClaimTraceReport = {
      ...claimTrace,
      claims: updatedClaims,
      verifiedCount: verified,
      contradictedCount: contradicted,
      unsupportedCount: unsupported,
      outdatedCount: outdated,
      needsReviewCount: needsReview,
      overallClaimIntegrityScore: Math.min(100, Math.max(0, integrityScore)),
    };

    setClaimTrace(updatedReport);
    StorageService.saveClaimTraceReport(updatedReport);
    if (report) {
      report.claimTrace = updatedReport;
      StorageService.saveReport(report);
    }
    logActivity("Updated Claim Verification", `Claim ${claimId} marked as ${newStatus}`);
  };

  const filteredIssues = issuesList.filter(iss => {
    if (selectedSeverity === "all") return true;
    return iss.severity === selectedSeverity;
  });

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
                {activeAccount.name}
              </span>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs text-slate-400 font-mono">Report #{report.id}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
              <FileSearch className="w-7 h-7 text-purple-400" />
              {content?.title || "Content Alignment Analysis"}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href={`/studio?id=${report.contentId}`}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-glow-purple transition-all flex items-center gap-1.5 active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-purple-200" />
              Open in Improvement Studio
            </Link>

            <Link
              href="/approval"
              className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
            >
              Approval Workflow
            </Link>
          </div>
        </div>

        {/* Top Executive Summary & Scorecard */}
        <div className="p-6 sm:p-8 rounded-2xl bg-navy-900/80 border border-slate-800 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30">
                Verdict: {report.summaryVerdict}
              </span>
              {content && <ContentStatusBadge status={content.status} />}
              {claimTrace && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  Claim Integrity: {claimTrace.overallClaimIntegrityScore}%
                </span>
              )}
              {personaResonance && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-indigo-400" />
                  Audience Fit: {personaResonance.overallAudienceFitScore}%
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
              {report.executiveSummary}
            </p>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs text-slate-300">
              <span className="font-bold text-purple-300 uppercase tracking-wider text-[10px] block mb-1">
                Original Author's Communicative Intent
              </span>
              {report.originalPurposeSummary}
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col items-center justify-center p-4 bg-slate-950/60 rounded-xl border border-slate-800/80">
            <CircularScore score={report.overallScore} size={130} />
            <div className="text-[11px] text-slate-400 mt-2 text-center">
              Evaluated against {activeAccount.name} active baseline
            </div>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex flex-wrap border-b border-slate-800 gap-2 sm:gap-6">
          <button
            onClick={() => setActiveTab("dimensions")}
            className={`pb-3 text-xs font-bold flex items-center gap-1.5 border-b-2 transition-all ${
              activeTab === "dimensions"
                ? "border-purple-500 text-white"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            <Compass className="w-4 h-4" />
            9 Evaluation Dimensions
          </button>

          <button
            onClick={() => setActiveTab("issues")}
            className={`pb-3 text-xs font-bold flex items-center gap-1.5 border-b-2 transition-all ${
              activeTab === "issues"
                ? "border-purple-500 text-white"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            Detected Issues ({issuesList.length})
          </button>

          <button
            onClick={() => setActiveTab("claimtrace")}
            className={`pb-3 text-xs font-bold flex items-center gap-1.5 border-b-2 transition-all ${
              activeTab === "claimtrace"
                ? "border-cyan-500 text-white"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            ClaimTrace — Claim Verification ({claimTrace?.claims.length || 0})
          </button>

          <button
            onClick={() => setActiveTab("persona")}
            className={`pb-3 text-xs font-bold flex items-center gap-1.5 border-b-2 transition-all ${
              activeTab === "persona"
                ? "border-indigo-500 text-white"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            <Users className="w-4 h-4 text-indigo-400" />
            Audience Persona Resonance
          </button>
        </div>

        {/* TAB 1: 9 EVALUATION DIMENSIONS */}
        {activeTab === "dimensions" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dimensions.map(dim => {
              const meta = DIMENSION_METADATA[dim] || { label: dim, description: "", defaultWeight: 10 };
              const scoreData = report.dimensionScores[dim];
              const score = scoreData?.score ?? 0;

              return (
                <div
                  key={dim}
                  className="p-5 rounded-2xl bg-navy-900/70 border border-slate-800 flex flex-col justify-between shadow-lg"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-white">{meta.label}</span>
                      <span
                        className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
                          score >= 85
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : score >= 70
                            ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                            : "bg-red-500/10 text-red-400 border-red-500/20"
                        }`}
                      >
                        {score}%
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed mb-3">
                      {scoreData?.explanation}
                    </p>

                    {scoreData?.strengths && scoreData.strengths.length > 0 && (
                      <div className="space-y-1 mb-2">
                        {scoreData.strengths.map((str, i) => (
                          <div key={i} className="text-[11px] text-emerald-300 flex items-start gap-1">
                            <span className="text-emerald-400">✓</span>
                            <span>{str}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {scoreData?.concerns && scoreData.concerns.length > 0 && (
                      <div className="space-y-1">
                        {scoreData.concerns.map((con, i) => (
                          <div key={i} className="text-[11px] text-red-300 flex items-start gap-1">
                            <span className="text-red-400">!</span>
                            <span>{con}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
                    <span>Weight: {report.weightsUsed[dim] || meta.defaultWeight}%</span>
                    <span>{scoreData?.issueCount || 0} Issues Flagged</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 2: DETECTED ISSUES INSPECTOR */}
        {activeTab === "issues" && (
          <div className="space-y-4">
            {/* Severity Filter Pills */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-navy-900/60 border border-slate-800">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                <span>Filter by Severity:</span>
                {["all", "critical", "high", "medium", "low"].map(sev => (
                  <button
                    key={sev}
                    onClick={() => setSelectedSeverity(sev)}
                    className={`px-2.5 py-1 rounded-lg capitalize text-xs font-medium transition-all ${
                      selectedSeverity === sev
                        ? "bg-purple-600 text-white"
                        : "text-slate-400 hover:text-white hover:bg-slate-800"
                    }`}
                  >
                    {sev}
                  </button>
                ))}
              </div>
              <span className="text-xs text-slate-400">
                Showing {filteredIssues.length} of {issuesList.length} issues
              </span>
            </div>

            {/* Issues List */}
            <div className="space-y-4">
              {filteredIssues.map((issue, idx) => (
                <div
                  key={issue.id}
                  className={`p-6 rounded-2xl border transition-all ${
                    issue.status === "resolved"
                      ? "bg-slate-950/40 border-slate-800 opacity-60"
                      : "bg-navy-900/90 border-slate-800 shadow-xl"
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <SeverityBadge severity={issue.severity} />
                      <span className="text-xs font-bold text-white">{issue.title}</span>
                      <span className="text-[10px] font-mono text-purple-400 px-2 py-0.5 rounded bg-purple-500/10">
                        {issue.confidence}% confidence
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {issue.status === "resolved" ? (
                        <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Resolved
                        </span>
                      ) : issue.status === "ignored" ? (
                        <span className="text-xs font-medium text-slate-400">Ignored</span>
                      ) : (
                        <>
                          <button
                            onClick={() => handleResolveIssue(issue.id)}
                            className="px-3 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition-colors flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" /> Mark Resolved
                          </button>
                          <button
                            onClick={() => handleIgnoreIssue(issue.id)}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-medium transition-colors"
                          >
                            Ignore
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Detected Segment */}
                  <div className="p-3 rounded-xl bg-red-950/20 border border-red-900/30 text-xs text-red-200 mb-3 font-mono leading-relaxed">
                    <span className="text-[10px] uppercase font-bold text-red-400 block mb-1">
                      Detected In Content:
                    </span>
                    "{issue.detectedSection}"
                  </div>

                  {/* Problem & Guideline */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs mb-3">
                    <div>
                      <span className="font-bold text-slate-400 block mb-0.5">Problem:</span>
                      <p className="text-slate-300 leading-relaxed">{issue.explanation}</p>
                    </div>
                    <div>
                      <span className="font-bold text-slate-400 block mb-0.5">Relevant Brand Guideline:</span>
                      <p className="text-purple-300 font-mono text-[11px] leading-relaxed">
                        {issue.relevantGuideline}
                      </p>
                    </div>
                  </div>

                  {/* Why it matters & Suggestion */}
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 text-xs space-y-2">
                    <div>
                      <span className="font-bold text-amber-300">Why It Matters: </span>
                      <span className="text-slate-300">{issue.whyItMatters}</span>
                    </div>

                    <div className="pt-2 border-t border-slate-800/60">
                      <span className="font-bold text-emerald-400">Suggested Correction: </span>
                      <span className="text-emerald-200">{issue.suggestedCorrection}</span>
                    </div>

                    <div className="text-[11px] text-slate-400 italic">
                      Expected Improvement: {issue.expectedImprovement}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: FEATURE TWO: CLAIMTRACE — INTELLIGENT CLAIM VERIFICATION */}
        {activeTab === "claimtrace" && (
          <div className="space-y-6">
            {claimTrace ? (
              <>
                {/* ClaimTrace Summary Header & Stats */}
                <div className="p-6 rounded-2xl bg-navy-900/80 border border-slate-800 shadow-xl space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                          <ShieldCheck className="w-4 h-4" />
                        </span>
                        <h3 className="text-base font-bold text-white">
                          ClaimTrace — Intelligent Claim Verification
                        </h3>
                      </div>
                      <p className="text-xs text-slate-400">
                        Cross-referenced against {activeAccount.name}'s verified knowledge base and official SLA documents.
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-[10px] font-mono uppercase text-slate-400">Claim Integrity</div>
                        <div className="text-xl font-bold font-mono text-cyan-300">
                          {claimTrace.overallClaimIntegrityScore}%
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Crucial Accuracy Rule Callout */}
                  <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-500/30 text-xs text-cyan-200/90 leading-relaxed flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-cyan-300">Important Accuracy Rule: </span>
                      Never automatically label a claim as false merely because supporting evidence is unavailable. Clear statuses distinguish between verified facts, unsupported statements needing proof, and direct contradictions against approved specifications.
                    </div>
                  </div>

                  {/* Summary Metric Counters */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-1">
                    <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
                      <div className="text-[10px] uppercase font-bold text-slate-400">Total Claims</div>
                      <div className="text-lg font-bold text-white mt-0.5">{claimTrace.totalClaimsCount}</div>
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-center">
                      <div className="text-[10px] uppercase font-bold text-emerald-400">Verified</div>
                      <div className="text-lg font-bold text-emerald-300 mt-0.5">{claimTrace.verifiedCount}</div>
                    </div>
                    <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/20 text-center">
                      <div className="text-[10px] uppercase font-bold text-amber-400">Unsupported</div>
                      <div className="text-lg font-bold text-amber-300 mt-0.5">{claimTrace.unsupportedCount}</div>
                    </div>
                    <div className="p-3 rounded-xl bg-red-950/20 border border-red-500/20 text-center">
                      <div className="text-[10px] uppercase font-bold text-red-400">Contradicted</div>
                      <div className="text-lg font-bold text-red-300 mt-0.5">{claimTrace.contradictedCount}</div>
                    </div>
                    <div className="p-3 rounded-xl bg-sky-950/20 border border-sky-500/20 text-center">
                      <div className="text-[10px] uppercase font-bold text-sky-400">Needs Review</div>
                      <div className="text-lg font-bold text-sky-300 mt-0.5">{claimTrace.needsReviewCount}</div>
                    </div>
                  </div>
                </div>

                {/* Extracted Claims List */}
                <div className="space-y-4">
                  <div className="text-xs font-bold text-slate-400 flex items-center justify-between">
                    <span>Detected Factual Claims ({claimTrace.claims.length})</span>
                    <span className="text-[11px] text-slate-500">
                      Click "Mark as Reviewed" or add auditor notes to maintain audit trail
                    </span>
                  </div>

                  {claimTrace.claims.length === 0 ? (
                    <div className="p-8 rounded-2xl bg-navy-900/40 border border-slate-800 text-center text-slate-400 text-xs">
                      No factual statistics or quantitative claims detected in this content piece.
                    </div>
                  ) : (
                    claimTrace.claims.map(claim => (
                      <ClaimTraceCard
                        key={claim.id}
                        claim={claim}
                        onUpdateStatus={handleUpdateClaimStatus}
                        showReviewActions={true}
                      />
                    ))
                  )}
                </div>
              </>
            ) : (
              <div className="p-8 rounded-2xl bg-navy-900/60 border border-slate-800 text-center text-slate-400 text-xs">
                No claim trace report available for this content piece.
              </div>
            )}
          </div>
        )}

        {/* TAB 4: FEATURE THREE: AUDIENCE PERSONA RESONANCE SIMULATOR */}
        {activeTab === "persona" && (
          <div>
            {personaResonance ? (
              <PersonaResonanceCard report={personaResonance} />
            ) : (
              <div className="p-8 rounded-2xl bg-navy-900/60 border border-slate-800 text-center text-slate-400 text-xs">
                Persona resonance simulation not available for this item.
              </div>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}
