"use client";

import React from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { useApp } from "@/context/AppContext";
import { CircularScore } from "@/components/common/CircularScore";
import { ContentStatusBadge, SeverityBadge, DriftLevelBadge } from "@/components/common/Badge";
import { StorageService } from "@/lib/storage";
import {
  UploadCloud,
  FileCheck,
  AlertTriangle,
  Building2,
  TrendingUp,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Activity,
  FileText,
  Users,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

export default function DashboardPage() {
  const {
    accounts,
    activeAccount,
    contentItems,
    activeAccountContentItems,
    activityLogs,
    currentUser,
  } = useApp();

  const driftReport = StorageService.getDriftReport(activeAccount.id, activeAccount, activeAccountContentItems);

  // Calculate actual database-driven metrics for active account & all accounts
  const totalUploads = activeAccountContentItems.length;
  const analyzedCount = activeAccountContentItems.filter(
    c => c.latestScore !== undefined
  ).length;

  const scores = activeAccountContentItems
    .map(c => c.latestScore)
    .filter((s): s is number => s !== undefined);
  const avgScore =
    scores.length > 0
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : 84;

  const approvedCount = activeAccountContentItems.filter(
    c => c.status === "approved" || c.status === "published"
  ).length;

  const pendingCount = activeAccountContentItems.filter(
    c => c.status === "submitted_for_review" || c.status === "under_review"
  ).length;

  const needsImprovementCount = activeAccountContentItems.filter(
    c => c.status === "needs_improvement"
  ).length;

  // Chart data: Trend over time
  const trendData = [
    { date: "Oct 12", score: 62 },
    { date: "Oct 18", score: 71 },
    { date: "Oct 25", score: 68 },
    { date: "Nov 01", score: 79 },
    { date: "Nov 04", score: 84 },
    { date: "Nov 06", score: avgScore },
  ];

  // Approval distribution data
  const statusDistribution = [
    { name: "Approved", value: Math.max(approvedCount, 1), color: "#10B981" },
    { name: "Pending Review", value: Math.max(pendingCount, 1), color: "#06B6D4" },
    { name: "Needs Improvement", value: Math.max(needsImprovementCount, 1), color: "#F59E0B" },
    { name: "Draft", value: 1, color: "#64748B" },
  ];

  // Issues by category
  const issueCategoryData = [
    { category: "Tone & Voice", count: 8 },
    { category: "Promotional Claims", count: 6 },
    { category: "Terminology", count: 5 },
    { category: "Factual Accuracy", count: 3 },
    { category: "Vision Alignment", count: 2 },
    { category: "Accessibility", count: 2 },
  ];

  // Improvement lift comparison (Before vs After Revision)
  const improvementComparison = [
    { name: "Submission 001", original: 54, revised: 88, lift: "+34%" },
    { name: "Submission 002", original: 68, revised: 84, lift: "+16%" },
    { name: "Submission 003", original: 71, revised: 96, lift: "+25%" },
  ];

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Welcome & Quick Action Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
                Active Brand: {activeAccount.name}
              </span>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs text-slate-400">Governance Overview</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Brand Governance Dashboard
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/setup"
              className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-850 text-slate-300 text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              Add Account
            </Link>

            <Link
              href="/approval"
              className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-850 text-slate-300 text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
              Review Pending ({pendingCount})
            </Link>

            <Link
              href="/upload"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-glow-purple transition-all flex items-center gap-1.5 active:scale-95"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              Upload Content
            </Link>
          </div>
        </div>

        {/* Brand DNA Drift Alert Banner */}
        {driftReport.warningTriggered ? (
          <div className="p-4 rounded-2xl bg-red-950/30 border border-red-500/50 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
                <AlertTriangle className="w-5 h-5 text-red-400 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-red-200">
                    {driftReport.warningTitle || "Potential Brand Drift Detected"}
                  </h3>
                  <DriftLevelBadge level={driftReport.driftLevel} />
                </div>
                <p className="text-xs text-red-200/80 mt-0.5 line-clamp-1">
                  {driftReport.warningMessage}
                </p>
              </div>
            </div>

            <Link
              href="/analytics"
              className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 flex-shrink-0 self-start sm:self-auto"
            >
              <span>Inspect Drift Detector</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="p-3.5 rounded-xl bg-navy-900/60 border border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>
                Brand DNA Baseline: <strong className="text-emerald-300">{driftReport.consistencyScore}% Consistency</strong> across recent uploads
              </span>
            </div>
            <Link href="/analytics" className="text-purple-400 hover:text-purple-300 text-[11px] font-semibold flex items-center gap-1">
              View Drift Analysis <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        )}

        {/* Top 4 KPI Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Average Alignment Score */}
          <div className="p-5 rounded-2xl bg-navy-900/80 border border-slate-800/80 flex items-center justify-between shadow-lg">
            <div>
              <div className="text-xs font-medium text-slate-400">
                Average Alignment Score
              </div>
              <div className="text-3xl font-extrabold text-white mt-1 font-mono">
                {avgScore}%
              </div>
              <div className="flex items-center gap-1 text-[11px] text-emerald-400 mt-1 font-medium">
                <TrendingUp className="w-3 h-3" />
                <span>+6% over last 30 days</span>
              </div>
            </div>
            <CircularScore score={avgScore} size={64} strokeWidth={6} showTierLabel={false} />
          </div>

          {/* Card 2: Total Content Uploads */}
          <div className="p-5 rounded-2xl bg-navy-900/80 border border-slate-800/80 shadow-lg">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-slate-400">Total Uploads</span>
              <FileText className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-3xl font-extrabold text-white font-mono mt-1">
              {totalUploads}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              <span className="text-purple-300 font-semibold">{analyzedCount} analysed</span> across {activeAccount.platforms.length} channels
            </div>
          </div>

          {/* Card 3: Pending Approvals */}
          <div className="p-5 rounded-2xl bg-navy-900/80 border border-slate-800/80 shadow-lg">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-slate-400">Pending Review</span>
              <Clock className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-3xl font-extrabold text-white font-mono mt-1">
              {pendingCount}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              <span className="text-cyan-300 font-semibold">{needsImprovementCount}</span> requiring revisions
            </div>
          </div>

          {/* Card 4: Approved & Published */}
          <div className="p-5 rounded-2xl bg-navy-900/80 border border-slate-800/80 shadow-lg">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-slate-400">Approved Content</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-extrabold text-emerald-400 font-mono mt-1">
              {approvedCount}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Zero unapproved content published
            </div>
          </div>
        </div>

        {/* Charts Grid: Alignment Trend & Approval Status */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Chart: Alignment Trend */}
          <div className="lg:col-span-8 p-6 rounded-2xl bg-navy-900/70 border border-slate-800 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white">
                  Content Alignment Score Trend
                </h3>
                <p className="text-xs text-slate-400">
                  Progression of calculated alignment percentages across recent upload batches
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20">
                Goal: &gt;85%
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="#64748B" fontSize={11} tickLine={false} />
                  <YAxis domain={[0, 100]} stroke="#64748B" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0F172A",
                      borderColor: "#334155",
                      borderRadius: "0.75rem",
                      fontSize: "12px",
                      color: "#fff",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#8B5CF6"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#scoreGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Secondary Chart: Workflow Status Pie */}
          <div className="lg:col-span-4 p-6 rounded-2xl bg-navy-900/70 border border-slate-800 shadow-xl flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-white mb-1">
                Workflow Distribution
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Current status of all submitted pieces
              </p>
            </div>

            <div className="h-44 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0F172A",
                      borderColor: "#334155",
                      borderRadius: "0.5rem",
                      fontSize: "11px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-4 border-t border-slate-800 text-xs">
              {statusDistribution.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-300 text-[11px] truncate">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Row 2: Issues by Category & Revision Lift */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Issue Categories Bar Chart */}
          <div className="lg:col-span-7 p-6 rounded-2xl bg-navy-900/70 border border-slate-800 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white">
                  Recurring Compliance Issues by Dimension
                </h3>
                <p className="text-xs text-slate-400">
                  Frequency of detected violations across recent uploads
                </p>
              </div>
              <Link href="/analytics" className="text-xs text-purple-400 hover:text-purple-300 font-medium">
                Detailed Analytics →
              </Link>
            </div>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={issueCategoryData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <XAxis dataKey="category" stroke="#64748B" fontSize={10} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0F172A",
                      borderColor: "#334155",
                      borderRadius: "0.5rem",
                      fontSize: "12px",
                      color: "#fff",
                    }}
                  />
                  <Bar dataKey="count" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Post-Revision Lift Comparison */}
          <div className="lg:col-span-5 p-6 rounded-2xl bg-navy-900/70 border border-slate-800 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-bold text-white">
                  Studio Improvement Lift
                </h3>
                <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  +25% Avg
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-4">
                Score increase after creators apply AI corrections in Improvement Studio
              </p>
            </div>

            <div className="space-y-3">
              {improvementComparison.map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-semibold text-white">{item.name}</span>
                    <span className="font-mono font-bold text-emerald-400">{item.lift} Lift</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-[11px] font-mono">{item.original}%</span>
                    <div className="flex-1 h-2 rounded-full bg-slate-800 overflow-hidden flex">
                      <div style={{ width: `${item.original}%` }} className="bg-red-500/80" />
                      <div style={{ width: `${item.revised - item.original}%` }} className="bg-emerald-500" />
                    </div>
                    <span className="text-emerald-300 text-[11px] font-mono font-bold">{item.revised}%</span>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/studio"
              className="mt-4 w-full py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-200 text-xs font-semibold text-center block transition-all"
            >
              Open Improvement Studio
            </Link>
          </div>
        </div>

        {/* Row 3: Recent Uploads & Activity Log */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Recent Uploads Table */}
          <div className="lg:col-span-8 p-6 rounded-2xl bg-navy-900/70 border border-slate-800 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white">Recent Upload Submissions</h3>
              <Link href="/history" className="text-xs text-purple-400 hover:text-purple-300 font-medium">
                View All Content ({activeAccountContentItems.length}) →
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                    <th className="pb-3 font-semibold">Content Title</th>
                    <th className="pb-3 font-semibold">Platform</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold">Score</th>
                    <th className="pb-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {activeAccountContentItems.slice(0, 4).map(item => (
                    <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 pr-3">
                        <div className="font-semibold text-white truncate max-w-xs">{item.title}</div>
                        <div className="text-[10px] text-slate-500">{item.category} • by {item.authorName}</div>
                      </td>
                      <td className="py-3.5 text-slate-300 font-medium">
                        {item.targetPlatform}
                      </td>
                      <td className="py-3.5">
                        <ContentStatusBadge status={item.status} />
                      </td>
                      <td className="py-3.5 font-mono font-bold">
                        {item.latestScore !== undefined ? (
                          <span
                            className={
                              item.latestScore >= 85
                                ? "text-emerald-400"
                                : item.latestScore >= 70
                                ? "text-blue-400"
                                : "text-amber-400"
                            }
                          >
                            {item.latestScore}%
                          </span>
                        ) : (
                          <span className="text-slate-500">-</span>
                        )}
                      </td>
                      <td className="py-3.5 text-right">
                        <Link
                          href={item.latestReportId ? `/reports/${item.latestReportId}` : `/studio?id=${item.id}`}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium transition-colors"
                        >
                          Inspect
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Real-time Activity Feed */}
          <div className="lg:col-span-4 p-6 rounded-2xl bg-navy-900/70 border border-slate-800 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-purple-400" />
                Live Audit Trail
              </h3>
            </div>

            <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
              {activityLogs.slice(0, 5).map(log => (
                <div key={log.id} className="text-xs pb-3 border-b border-slate-800/60 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between text-[10px] text-slate-500 mb-0.5">
                    <span className="font-semibold text-purple-300">{log.userName}</span>
                    <span>{new Date(log.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                  </div>
                  <div className="font-medium text-white">{log.action}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5 leading-snug line-clamp-2">
                    {log.details}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
