"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { useApp } from "@/context/AppContext";
import {
  CheckSquare,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Lock,
  UserCheck,
  Clock,
  ArrowRight,
  Send,
  Eye,
  AlertTriangle,
} from "lucide-react";
import { ContentItem, ContentStatus, ReviewComment, UserRole } from "@/types";
import { ContentStatusBadge, RoleBadge } from "@/components/common/Badge";
import { StorageService } from "@/lib/storage";

function ApprovalCentreContent() {
  const searchParams = useSearchParams();
  const requestedId = searchParams.get("id");
  const {
    activeAccount,
    activeAccountContentItems,
    updateContentItem,
    currentUser,
    logActivity,
  } = useApp();

  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>("all");
  const [activeItem, setActiveItem] = useState<ContentItem>(
    activeAccountContentItems.find(c => c.id === requestedId) ||
      activeAccountContentItems.find(c => c.status === "submitted_for_review") ||
      activeAccountContentItems[0]
  );

  const [commentText, setCommentText] = useState("");
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [decisionNotes, setDecisionNotes] = useState("");
  const [showDecisionModal, setShowDecisionModal] = useState<"approve" | "reject" | "revision" | null>(null);

  const comments = activeItem ? StorageService.getComments(activeItem.id) : [];
  const claimTrace = activeItem ? StorageService.getClaimTraceReport(activeItem.id) : null;

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !activeItem) return;

    const newComment: ReviewComment = {
      id: `cm-${Date.now()}`,
      contentId: activeItem.id,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      userRole: currentUser.role,
      content: commentText.trim(),
      createdAt: new Date().toISOString(),
      isInternalNote,
    };

    StorageService.addComment(newComment);
    setCommentText("");
    logActivity("Added Review Comment", `Comment on "${activeItem.title}": ${newComment.content.slice(0, 40)}...`);
  };

  const handleApplyDecision = (action: "approve" | "reject" | "revision") => {
    if (!activeItem) return;

    let newStatus: ContentStatus = "approved";
    let notifTitle = "Content Approved";
    let notifType: any = "approved";

    if (action === "reject") {
      newStatus = "rejected";
      notifTitle = "Content Rejected";
      notifType = "rejected";
    } else if (action === "revision") {
      newStatus = "needs_improvement";
      notifTitle = "Revisions Requested";
      notifType = "revision_requested";
    }

    const updated: ContentItem = {
      ...activeItem,
      status: newStatus,
      assignedReviewerId: currentUser.id,
      assignedReviewerName: currentUser.name,
      updatedAt: new Date().toISOString(),
    };

    updateContentItem(updated);
    setActiveItem(updated);

    if (decisionNotes.trim()) {
      StorageService.addComment({
        id: `cm-${Date.now()}`,
        contentId: activeItem.id,
        userId: currentUser.id,
        userName: currentUser.name,
        userAvatar: currentUser.avatar,
        userRole: currentUser.role,
        content: `[Decision Decision Note]: ${decisionNotes.trim()}`,
        createdAt: new Date().toISOString(),
        isInternalNote: false,
      });
    }

    StorageService.addNotification({
      title: notifTitle,
      message: `${currentUser.name} (${currentUser.role}) marked '${activeItem.title}' as ${newStatus.toUpperCase()}.${
        decisionNotes ? ` Note: "${decisionNotes}"` : ""
      }`,
      type: notifType,
      link: `/approval?id=${activeItem.id}`,
    });

    logActivity(`Recorded Decision: ${newStatus.toUpperCase()}`, `Content "${activeItem.title}" marked as ${newStatus}`);

    setShowDecisionModal(null);
    setDecisionNotes("");
  };

  const filteredItems = activeAccountContentItems.filter(item => {
    if (selectedStatusFilter === "all") return true;
    if (selectedStatusFilter === "pending") {
      return item.status === "submitted_for_review" || item.status === "under_review";
    }
    return item.status === selectedStatusFilter;
  });

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
                Governance Workflow
              </span>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs text-slate-400">Human-in-the-Loop Review</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
              <CheckSquare className="w-7 h-7 text-purple-400" />
              Review & Approval Centre
            </h1>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Acting as:</span>
            <RoleBadge role={currentUser.role} />
          </div>
        </div>

        {/* Workflow Split Screen: Left list, Right detail & comment thread */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Submissions Queue */}
          <div className="lg:col-span-5 space-y-3">
            {/* Filter buttons */}
            <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs">
              {["all", "pending", "approved", "needs_improvement"].map(st => (
                <button
                  key={st}
                  onClick={() => setSelectedStatusFilter(st)}
                  className={`flex-1 py-1.5 rounded-lg capitalize text-xs font-semibold transition-all ${
                    selectedStatusFilter === st
                      ? "bg-purple-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {st.replace(/_/g, " ")}
                </button>
              ))}
            </div>

            {/* Submissions List */}
            <div className="space-y-2.5 max-h-[700px] overflow-y-auto pr-1">
              {filteredItems.map(item => {
                const isSelected = item.id === activeItem?.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setActiveItem(item)}
                    className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? "bg-navy-900 border-purple-500/60 shadow-glow-purple"
                        : "bg-navy-900/40 border-slate-800 hover:border-slate-700 hover:bg-navy-900/80"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <span className="text-xs font-bold text-white line-clamp-1">
                        {item.title}
                      </span>
                      <ContentStatusBadge status={item.status} />
                    </div>

                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed mb-2">
                      {item.rawContent}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-slate-800/60">
                      <span>By {item.authorName} ({item.authorRole})</span>
                      <span className="font-mono font-bold text-purple-300">
                        Score: {item.latestScore || "-" }%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Submission Inspection, Actions & Comment Thread */}
          {activeItem && (
            <div className="lg:col-span-7 space-y-4">
              <div className="p-6 rounded-2xl bg-navy-900/80 border border-slate-800 shadow-xl space-y-5">
                {/* Item Details Header */}
                <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-slate-800">
                  <div>
                    <h2 className="text-lg font-bold text-white">{activeItem.title}</h2>
                    <div className="text-xs text-slate-400 mt-0.5">
                      Channel: <span className="text-purple-300">{activeItem.targetPlatform}</span> • Author:{" "}
                      <span className="text-slate-200">{activeItem.authorName}</span> • Version:{" "}
                      {activeItem.currentVersion}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                      Score: {activeItem.latestScore}%
                    </span>
                    <ContentStatusBadge status={activeItem.status} />
                  </div>
                </div>

                {/* Content Text Display */}
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Submission Content
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                    {activeItem.rawContent}
                  </div>
                </div>

                {/* ClaimTrace Audit Banner in Approval Centre */}
                {claimTrace && (
                  <div className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 text-xs ${
                    claimTrace.contradictedCount > 0
                      ? "bg-red-950/25 border-red-500/40 text-red-200"
                      : claimTrace.unsupportedCount > 0
                      ? "bg-amber-950/20 border-amber-500/30 text-amber-200"
                      : "bg-emerald-950/20 border-emerald-500/30 text-emerald-200"
                  }`}>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                      <div>
                        <span className="font-bold">ClaimTrace Verification: </span>
                        <span>{claimTrace.verifiedCount} Verified, {claimTrace.unsupportedCount} Unsupported, {claimTrace.contradictedCount} Contradicted</span>
                      </div>
                    </div>
                    <span className="font-mono font-bold px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                      Integrity {claimTrace.overallClaimIntegrityScore}%
                    </span>
                  </div>
                )}

                {/* Manager / Reviewer Decision Actions */}
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
                    <span>Authorized Human Decision:</span>
                    <span className="text-[10px] text-purple-400">Final Control Reserved for Reviewers</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <button
                      onClick={() => setShowDecisionModal("approve")}
                      className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 active:scale-95"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Approve Content
                    </button>

                    <button
                      onClick={() => setShowDecisionModal("revision")}
                      className="py-2.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 active:scale-95"
                    >
                      <AlertTriangle className="w-4 h-4" />
                      Request Revision
                    </button>

                    <button
                      onClick={() => setShowDecisionModal("reject")}
                      className="py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 active:scale-95"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject Content
                    </button>
                  </div>
                </div>

                {/* Comment & Internal Notes Thread */}
                <div className="space-y-4 pt-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                    <span>Collaborative Thread & Notes</span>
                    <span className="text-[10px] text-slate-500">{comments.length} entries</span>
                  </div>

                  <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                    {comments.length === 0 ? (
                      <div className="py-4 text-center text-xs text-slate-500">
                        No comments or review notes yet. Add one below.
                      </div>
                    ) : (
                      comments.map(c => (
                        <div
                          key={c.id}
                          className={`p-3 rounded-xl border text-xs ${
                            c.isInternalNote
                              ? "bg-amber-950/20 border-amber-900/30"
                              : "bg-slate-950 border-slate-800"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-white">{c.userName}</span>
                              <RoleBadge role={c.userRole} />
                              {c.isInternalNote && (
                                <span className="inline-flex items-center gap-1 text-[10px] text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                                  <Lock className="w-2.5 h-2.5" /> Internal Note
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-500">
                              {new Date(c.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </span>
                          </div>
                          <p className="text-slate-300 leading-relaxed">{c.content}</p>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add Comment Input Form */}
                  <form onSubmit={handleAddComment} className="space-y-2 pt-2 border-t border-slate-800">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-400">Post a comment or feedback</span>
                      <label className="flex items-center gap-1.5 text-xs text-amber-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isInternalNote}
                          onChange={e => setIsInternalNote(e.target.checked)}
                          className="rounded border-slate-700 bg-slate-900 text-purple-600 focus:ring-0"
                        />
                        <Lock className="w-3 h-3" />
                        <span>Private Internal Note (Reviewers only)</span>
                      </label>
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={commentText}
                        onChange={e => setCommentText(e.target.value)}
                        placeholder="Add review feedback, guidance, or compliance note..."
                        className="flex-1 px-3.5 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition-all shadow-glow-purple flex items-center gap-1"
                      >
                        <Send className="w-3.5 h-3.5" />
                        Post
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal for Decision Notes */}
        {showDecisionModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <div className="w-full max-w-md p-6 rounded-2xl bg-navy-900 border border-slate-700 shadow-2xl space-y-4">
              <h3 className="text-base font-bold text-white capitalize">
                Confirm Decision: {showDecisionModal}
              </h3>
              <p className="text-xs text-slate-400">
                Please provide an optional audit explanation or guidance for the creator.
              </p>
              <textarea
                rows={3}
                value={decisionNotes}
                onChange={e => setDecisionNotes(e.target.value)}
                placeholder="Enter audit note or justification..."
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500"
              />
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowDecisionModal(null)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleApplyDecision(showDecisionModal)}
                  className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md"
                >
                  Confirm Decision
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}

export default function ApprovalCentrePage() {
  return (
    <Suspense
      fallback={
        <AppShell>
          <div className="py-20 text-center text-xs text-slate-400">
            Loading Approval Centre...
          </div>
        </AppShell>
      }
    >
      <ApprovalCentreContent />
    </Suspense>
  );
}
