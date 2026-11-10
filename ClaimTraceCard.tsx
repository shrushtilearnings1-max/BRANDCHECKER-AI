"use client";

import React, { useState } from "react";
import { ExtractedClaim, ClaimVerificationStatus } from "@/types";
import { ClaimStatusBadge } from "@/components/common/Badge";
import {
  ShieldCheck,
  AlertTriangle,
  FileText,
  CheckCircle2,
  HelpCircle,
  Clock,
  Sparkles,
  Check,
  Edit3,
} from "lucide-react";

interface ClaimTraceCardProps {
  claim: ExtractedClaim;
  onUpdateStatus?: (claimId: string, newStatus: ClaimVerificationStatus, note?: string) => void;
  showReviewActions?: boolean;
}

export function ClaimTraceCard({
  claim,
  onUpdateStatus,
  showReviewActions = true,
}: ClaimTraceCardProps) {
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [noteText, setNoteText] = useState(claim.reviewerNote || "");

  const handleMarkReviewed = () => {
    if (onUpdateStatus) {
      onUpdateStatus(claim.id, claim.status, noteText);
    }
  };

  const getBorderColor = () => {
    switch (claim.status) {
      case "verified":
        return "border-emerald-500/30 bg-emerald-950/10";
      case "contradicted":
        return "border-red-500/40 bg-red-950/15";
      case "unsupported":
        return "border-amber-500/35 bg-amber-950/15";
      case "outdated":
        return "border-purple-500/30 bg-purple-950/10";
      case "needs_review":
      default:
        return "border-sky-500/30 bg-sky-950/10";
    }
  };

  return (
    <div className={`p-5 rounded-2xl border ${getBorderColor()} shadow-xl space-y-4 transition-all`}>
      {/* Header: Claim Category, Status Badge & Confidence */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ClaimStatusBadge status={claim.status} />
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
            {claim.category.replace(/_/g, " ")}
          </span>
          <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
            {claim.confidence}% confidence
          </span>
        </div>

        {claim.isReviewed && (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" /> Reviewed by Compliance
          </span>
        )}
      </div>

      {/* Extracted Claim Text */}
      <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 font-sans text-xs sm:text-sm text-slate-100 leading-relaxed">
        <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
          Extracted Statement / Factual Claim:
        </span>
        "{claim.claimText}"
      </div>

      {/* Evidence & Source or Contradiction Explanation */}
      <div className="space-y-2 text-xs">
        {claim.status === "verified" && claim.supportingEvidence && (
          <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-900/30 space-y-1">
            <div className="text-emerald-400 font-bold flex items-center gap-1.5 text-xs">
              <CheckCircle2 className="w-4 h-4" />
              Verified Supporting Evidence:
            </div>
            <p className="text-slate-200 leading-relaxed text-[11px]">
              {claim.supportingEvidence}
            </p>
            {claim.sourceReference && (
              <div className="text-[10px] text-emerald-300 font-mono pt-1">
                Official Source: <span className="underline">{claim.sourceReference}</span>
              </div>
            )}
          </div>
        )}

        {claim.status === "contradicted" && (
          <div className="p-3 rounded-xl bg-red-950/25 border border-red-900/40 space-y-1">
            <div className="text-red-400 font-bold flex items-center gap-1.5 text-xs">
              <AlertTriangle className="w-4 h-4" />
              Factual Contradiction Detected:
            </div>
            <p className="text-red-200 leading-relaxed text-[11px]">
              {claim.contradictionReason}
            </p>
            {claim.sourceReference && (
              <div className="text-[10px] text-red-300 font-mono pt-1">
                Contradicts Approved Source: <span className="underline">{claim.sourceReference}</span>
              </div>
            )}
          </div>
        )}

        {claim.status === "unsupported" && (
          <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-900/40 space-y-1">
            <div className="text-amber-400 font-bold flex items-center gap-1.5 text-xs">
              <HelpCircle className="w-4 h-4" />
              Insufficient Evidence in Knowledge Base:
            </div>
            <p className="text-amber-200/90 leading-relaxed text-[11px]">
              {claim.supportingEvidence || "No sufficient benchmark evidence or published audit documentation found in brand source repository."}
            </p>
            <div className="text-[10px] text-slate-400 italic">
              Rule: Never labeled false merely due to absence of proof. Evidence or source citation requested.
            </div>
          </div>
        )}

        {claim.status === "needs_review" && (
          <div className="p-3 rounded-xl bg-sky-950/20 border border-sky-900/40 space-y-1">
            <div className="text-sky-400 font-bold flex items-center gap-1.5 text-xs">
              <Clock className="w-4 h-4" />
              Human Compliance Review Required:
            </div>
            <p className="text-sky-200 leading-relaxed text-[11px]">
              {claim.supportingEvidence || "Sensitive structural, regulatory, or legal statement requires authorized human verification before publication."}
            </p>
          </div>
        )}

        {/* Suggested Correction */}
        {claim.suggestedCorrection && (
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-purple-400 block">
              Suggested Claim Correction:
            </span>
            <p className="text-purple-200 text-xs leading-relaxed italic">
              {claim.suggestedCorrection}
            </p>
          </div>
        )}
      </div>

      {/* Reviewer Note Display & Action */}
      {showReviewActions && (
        <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex-1">
            {claim.reviewerNote ? (
              <div className="text-[11px] text-slate-300">
                <span className="font-bold text-slate-400">Auditor Note: </span>
                <span>{claim.reviewerNote}</span>
              </div>
            ) : isEditingNote ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={noteText}
                  onChange={e => setNoteText(e.target.value)}
                  placeholder="Add compliance audit note..."
                  className="flex-1 px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
                <button
                  onClick={() => {
                    handleMarkReviewed();
                    setIsEditingNote(false);
                  }}
                  className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-semibold"
                >
                  Save Note
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditingNote(true)}
                className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
              >
                <Edit3 className="w-3 h-3" /> Add Auditor Note
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {!claim.isReviewed ? (
              <button
                onClick={handleMarkReviewed}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-all flex items-center gap-1 active:scale-95 shadow-sm"
              >
                <Check className="w-3.5 h-3.5" />
                Mark as Reviewed
              </button>
            ) : (
              <span className="text-xs text-slate-400 font-medium">Verified in Audit Log</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
