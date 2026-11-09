"use client";

import React from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { useApp } from "@/context/AppContext";
import { FileSearch, Sparkles, ArrowRight, ShieldCheck, AlertTriangle } from "lucide-react";
import { CircularScore } from "@/components/common/CircularScore";
import { ContentStatusBadge } from "@/components/common/Badge";
import { StorageService } from "@/lib/storage";

export default function ReportsIndexPage() {
  const { activeAccount, activeAccountContentItems } = useApp();
  const reports = StorageService.getReports().filter(r => r.accountId === activeAccount.id);

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
                {activeAccount.name}
              </span>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs text-slate-400">Analysis Directory</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
              <FileSearch className="w-7 h-7 text-purple-400" />
              Content Alignment Reports
            </h1>
          </div>

          <Link
            href="/upload"
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-glow-purple transition-all inline-flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Analyse New Content
          </Link>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reports.map(report => {
            const content = activeAccountContentItems.find(c => c.id === report.contentId);
            const title = content?.title || "Content Submission";

            return (
              <div
                key={report.id}
                className="p-6 rounded-2xl bg-navy-900/80 border border-slate-800 hover:border-purple-500/40 transition-all shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <span className="text-[10px] font-mono text-purple-400 uppercase tracking-wider">
                        {report.id}
                      </span>
                      <h3 className="text-base font-bold text-white mt-0.5 line-clamp-1">{title}</h3>
                      <div className="text-[11px] text-slate-400 mt-1">
                        {content?.category} • {content?.targetPlatform} • Version {report.contentVersion}
                      </div>
                    </div>
                    <CircularScore score={report.overallScore} size={68} strokeWidth={6} showTierLabel={false} />
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-4">
                    {report.executiveSummary}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-800/80 text-[11px]">
                    <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20 font-medium">
                      {report.issues.length} Issues Flagged
                    </span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-400">
                      Generated {new Date(report.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-800/60 flex items-center justify-between">
                  {content && <ContentStatusBadge status={content.status} />}
                  <Link
                    href={`/reports/${report.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-400 hover:text-purple-300"
                  >
                    <span>View Full 9-Dimension Report</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
