"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { useApp } from "@/context/AppContext";
import {
  History,
  Search,
  Filter,
  Download,
  ArrowRight,
  Eye,
  FileText,
  Calendar,
  Layers,
} from "lucide-react";
import { ContentStatusBadge } from "@/components/common/Badge";
import { CircularScore } from "@/components/common/CircularScore";

export default function ContentHistoryPage() {
  const { activeAccount, activeAccountContentItems } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);

  const filtered = activeAccountContentItems.filter(item => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.rawContent.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlatform = selectedPlatform === "all" || item.targetPlatform === selectedPlatform;
    const matchesStatus = selectedStatus === "all" || item.status === selectedStatus;
    return matchesSearch && matchesPlatform && matchesStatus;
  });

  const exportCSV = () => {
    const headers = ["Title", "Category", "Platform", "Status", "Score", "Author", "Created At"];
    const rows = filtered.map(item => [
      `"${item.title.replace(/"/g, '""')}"`,
      `"${item.category}"`,
      `"${item.targetPlatform}"`,
      `"${item.status}"`,
      item.latestScore || "N/A",
      `"${item.authorName}"`,
      `"${item.createdAt}"`,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${activeAccount.slug}_content_history.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
                {activeAccount.name}
              </span>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs text-slate-400">Audit Trail</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
              <History className="w-7 h-7 text-purple-400" />
              Content Governance History
            </h1>
          </div>

          <button
            onClick={exportCSV}
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-850 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-4 h-4 text-purple-400" />
            Export History (CSV)
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 rounded-2xl bg-navy-900/80 border border-slate-800 shadow-xl flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search content by title, body, keyword..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              value={selectedPlatform}
              onChange={e => setSelectedPlatform(e.target.value)}
              className="py-2 px-3 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500"
            >
              <option value="all">All Channels</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Twitter/X">Twitter/X</option>
              <option value="Blog">Blog</option>
              <option value="Website">Website</option>
              <option value="Instagram">Instagram</option>
            </select>

            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="py-2 px-3 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500"
            >
              <option value="all">All Statuses</option>
              <option value="approved">Approved</option>
              <option value="submitted_for_review">Pending Review</option>
              <option value="needs_improvement">Needs Improvement</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        {/* Content History List */}
        <div className="space-y-4">
          {filtered.map(item => {
            const isExpanded = expandedItemId === item.id;
            return (
              <div
                key={item.id}
                className="p-6 rounded-2xl bg-navy-900/70 border border-slate-800 shadow-xl hover:border-slate-700 transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-purple-400 font-bold uppercase">
                        {item.id}
                      </span>
                      <ContentStatusBadge status={item.status} />
                      <span className="text-[11px] text-slate-400 font-medium">
                        Platform: {item.targetPlatform}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white">{item.title}</h3>

                    <div className="text-xs text-slate-400">
                      Author: <span className="text-slate-200">{item.authorName}</span> • Category:{" "}
                      <span className="text-purple-300">{item.category}</span> • Created:{" "}
                      {new Date(item.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">
                        Alignment
                      </div>
                      <div className="text-xl font-bold font-mono text-white">
                        {item.latestScore ? `${item.latestScore}%` : "Draft"}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setExpandedItemId(isExpanded ? null : item.id)}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
                      >
                        {isExpanded ? "Collapse History" : "Inspect Versions"}
                      </button>

                      {item.latestReportId && (
                        <Link
                          href={`/reports/${item.latestReportId}`}
                          className="px-3 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-300 text-xs font-semibold transition-colors"
                        >
                          Report
                        </Link>
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Version Timeline */}
                {isExpanded && (
                  <div className="pt-4 border-t border-slate-800 space-y-3 animate-fade-in">
                    <div className="text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5" />
                      Revision Timeline & Change Audit Trail ({item.versions.length} revisions preserved)
                    </div>

                    <div className="space-y-2">
                      {item.versions.map((ver, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div>
                            <div className="flex items-center gap-2 font-bold text-white mb-0.5">
                              <span className="font-mono text-purple-400">Version {ver.versionNumber}</span>
                              <span className="text-slate-500">•</span>
                              <span className="text-slate-400 text-[11px]">
                                {new Date(ver.createdAt).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-slate-300 text-[11px]">{ver.changeSummary}</p>
                          </div>

                          <div className="flex items-center gap-3">
                            {ver.alignmentScore && (
                              <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                                Score: {ver.alignmentScore}%
                              </span>
                            )}
                            <Link
                              href={`/studio?id=${item.id}`}
                              className="text-purple-400 hover:text-purple-300 font-semibold text-xs flex items-center gap-1"
                            >
                              <span>Open in Studio</span>
                              <ArrowRight className="w-3 h-3" />
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
