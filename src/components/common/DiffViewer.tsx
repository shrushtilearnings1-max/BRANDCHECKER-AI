"use client";

import React, { useState } from "react";
import { Columns, Eye, CheckCircle2, ArrowRight } from "lucide-react";

interface DiffViewerProps {
  originalText: string;
  improvedText: string;
  onApplyAll?: () => void;
  onApplyPart?: (part: string) => void;
}

export function DiffViewer({
  originalText,
  improvedText,
  onApplyAll,
}: DiffViewerProps) {
  const [viewMode, setViewMode] = useState<"side-by-side" | "inline">("side-by-side");

  // Simple paragraph/sentence based diff generator
  const origParagraphs = originalText.split(/\n+/).filter(Boolean);
  const impParagraphs = improvedText.split(/\n+/).filter(Boolean);

  return (
    <div className="w-full rounded-xl border border-slate-800 bg-navy-900/60 overflow-hidden shadow-xl">
      {/* Diff Controls Header */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-800 bg-slate-900/80 px-4 py-3 gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Comparison Mode:
          </span>
          <div className="flex rounded-lg bg-slate-800/80 p-0.5 border border-slate-700/60">
            <button
              onClick={() => setViewMode("side-by-side")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-all ${
                viewMode === "side-by-side"
                  ? "bg-purple-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              Side by Side
            </button>
            <button
              onClick={() => setViewMode("inline")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-all ${
                viewMode === "inline"
                  ? "bg-purple-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              Inline Highlights
            </button>
          </div>
        </div>

        {onApplyAll && (
          <button
            onClick={onApplyAll}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition-all active:scale-95"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Accept & Apply Improvements
          </button>
        )}
      </div>

      {/* Content Rendering */}
      {viewMode === "side-by-side" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-800 font-sans text-sm leading-relaxed">
          {/* Left: Original Content */}
          <div className="p-4 md:p-6 bg-red-950/5">
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium">
                Original Upload (Has Issues)
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                {originalText.length} chars
              </span>
            </div>
            <div className="space-y-4 whitespace-pre-wrap text-slate-300">
              {origParagraphs.map((para, i) => (
                <p key={i} className="p-2.5 rounded border border-red-900/30 bg-red-950/20 text-red-200/90 text-sm">
                  {para}
                </p>
              ))}
            </div>
          </div>

          {/* Right: AI-Improved Brand-Compliant Content */}
          <div className="p-4 md:p-6 bg-emerald-950/5">
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                AI Suggested Brand Alignment
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                {improvedText.length} chars
              </span>
            </div>
            <div className="space-y-4 whitespace-pre-wrap text-slate-200">
              {impParagraphs.map((para, i) => (
                <p key={i} className="p-2.5 rounded border border-emerald-900/40 bg-emerald-950/25 text-emerald-200/95 text-sm">
                  {para}
                </p>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Inline Unified Diff */
        <div className="p-6 space-y-4">
          <div className="space-y-4">
            <div className="p-4 rounded-lg border border-red-900/40 bg-red-950/30 text-red-300/90 text-sm line-through decoration-red-400/80">
              <span className="block text-[11px] uppercase font-bold text-red-400 mb-1">Original Draft</span>
              {originalText}
            </div>
            <div className="flex justify-center">
              <div className="p-1 rounded-full bg-slate-800 text-slate-400">
                <ArrowRight className="w-4 h-4 rotate-90" />
              </div>
            </div>
            <div className="p-4 rounded-lg border border-emerald-900/50 bg-emerald-950/35 text-emerald-200 text-sm font-medium">
              <span className="block text-[11px] uppercase font-bold text-emerald-400 mb-1">Aligned Version</span>
              {improvedText}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
