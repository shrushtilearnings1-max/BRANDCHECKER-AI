"use client";

import React from "react";
import { ClaimVerificationStatus, ContentStatus, DriftLevel, IssueSeverity, UserRole } from "@/types";

export function SeverityBadge({ severity }: { severity: IssueSeverity }) {
  switch (severity) {
    case "critical":
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wider bg-red-500/15 text-red-400 border border-red-500/30">
          Critical
        </span>
      );
    case "high":
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wider bg-orange-500/15 text-orange-400 border border-orange-500/30">
          High
        </span>
      );
    case "medium":
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wider bg-amber-500/15 text-amber-400 border border-amber-500/30">
          Medium
        </span>
      );
    case "low":
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wider bg-blue-500/15 text-blue-400 border border-blue-500/30">
          Low
        </span>
      );
    case "informational":
    default:
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wider bg-slate-700/50 text-slate-300 border border-slate-600/40">
          Info
        </span>
      );
  }
}

export function ContentStatusBadge({ status }: { status: ContentStatus }) {
  const configs: Record<ContentStatus, { label: string; bg: string; text: string; border: string }> = {
    draft: { label: "Draft", bg: "bg-slate-800", text: "text-slate-300", border: "border-slate-700" },
    uploaded: { label: "Uploaded", bg: "bg-blue-900/30", text: "text-blue-300", border: "border-blue-700/50" },
    analysing: { label: "Analysing...", bg: "bg-purple-900/40", text: "text-purple-300", border: "border-purple-600/50" },
    analysis_completed: { label: "Analysed", bg: "bg-indigo-900/30", text: "text-indigo-300", border: "border-indigo-700/50" },
    needs_improvement: { label: "Needs Improvement", bg: "bg-amber-900/30", text: "text-amber-300", border: "border-amber-700/50" },
    submitted_for_review: { label: "Pending Review", bg: "bg-cyan-900/30", text: "text-cyan-300", border: "border-cyan-700/50" },
    under_review: { label: "Under Review", bg: "bg-sky-900/30", text: "text-sky-300", border: "border-sky-700/50" },
    approved: { label: "Approved", bg: "bg-emerald-900/30", text: "text-emerald-300", border: "border-emerald-700/50" },
    rejected: { label: "Rejected", bg: "bg-red-900/30", text: "text-red-300", border: "border-red-700/50" },
    published: { label: "Published", bg: "bg-teal-900/30", text: "text-teal-300", border: "border-teal-700/50" },
    archived: { label: "Archived", bg: "bg-slate-900/40", text: "text-slate-400", border: "border-slate-800" },
  };

  const c = configs[status] || configs.draft;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${c.bg} ${c.text} ${c.border}`}>
      {c.label}
    </span>
  );
}

export function RoleBadge({ role }: { role: UserRole }) {
  switch (role) {
    case "ADMIN":
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/40">
          ADMIN
        </span>
      );
    case "MANAGER":
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/40">
          MANAGER
        </span>
      );
    case "CREATOR":
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
          CREATOR
        </span>
      );
    case "REVIEWER":
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40">
          REVIEWER
        </span>
      );
  }
}

export function ClaimStatusBadge({ status }: { status: ClaimVerificationStatus }) {
  switch (status) {
    case "verified":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          Verified
        </span>
      );
    case "unsupported":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          Unsupported
        </span>
      );
    case "contradicted":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-500/15 text-red-400 border border-red-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
          Contradicted
        </span>
      );
    case "outdated":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
          Outdated
        </span>
      );
    case "needs_review":
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-500/15 text-sky-400 border border-sky-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
          Needs Review
        </span>
      );
  }
}

export function DriftLevelBadge({ level }: { level: DriftLevel }) {
  switch (level) {
    case "low":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          Low Drift (Stable)
        </span>
      );
    case "medium":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          Medium Drift (Caution)
        </span>
      );
    case "high":
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-500/15 text-red-400 border border-red-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
          High Drift (Warning)
        </span>
      );
  }
}
