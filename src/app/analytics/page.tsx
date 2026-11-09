"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useApp } from "@/context/AppContext";
import { BrandDriftDetector } from "@/components/drift/BrandDriftDetector";
import { StorageService } from "@/lib/storage";
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  Download,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Printer,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

export default function AnalyticsPage() {
  const { activeAccount, activeAccountContentItems } = useApp();

  const [dateRange, setDateRange] = useState("30d");
  const driftReport = StorageService.getDriftReport(activeAccount.id, activeAccount, activeAccountContentItems);

  // Trend data
  const trendLine = [
    { period: "Week 1", score: 64, uploads: 3 },
    { period: "Week 2", score: 71, uploads: 6 },
    { period: "Week 3", score: 69, uploads: 5 },
    { period: "Week 4", score: 78, uploads: 8 },
    { period: "Week 5", score: 85, uploads: 9 },
  ];

  // Recurring Mistake Categories
  const recurringMistakes = [
    { mistake: "Prohibited Hype / Exclamation", count: 14, severity: "High", dimension: "Tone & Voice" },
    { mistake: "Absolute Promotional Claims ('100% zero downtime')", count: 9, severity: "Critical", dimension: "Promotional Claims" },
    { mistake: "Restricted Word Usage ('cheapest', 'magic')", count: 8, severity: "High", dimension: "Terminology" },
    { mistake: "Missing Regulatory / FDA Disclaimers", count: 4, severity: "Medium", dimension: "Promotional Claims" },
    { mistake: "Excessive Sentence Length (>35 words)", count: 3, severity: "Low", dimension: "Accessibility" },
  ];

  // Automated Governance Recommendations
  const governanceRecommendations = [
    {
      id: "rec-1",
      title: "Update Terminology Lexicon with Approved Cloud Synonyms",
      type: "guideline_enhancement",
      observation: "Team members have repeatedly used 'cheapest cloud' and 'effortless overnight' in 8 recent product announcement drafts.",
      recommendation: "Formally add 'cost-efficient deterministic compute' and 'accelerated onboarding' into the preferred vocabulary dictionary to guide creators towards enterprise phrasing.",
      impact: "Expected 18% reduction in high-severity terminology alerts.",
    },
    {
      id: "rec-2",
      title: "Standardize Architectural SLA Citation Snippets",
      type: "knowledge_base",
      observation: "In 3 out of 5 recent drafts, authors claimed '100% zero downtime' instead of citing the official 99.99% contractual SLA.",
      recommendation: "Provide 1-click approved copy blocks in the upload centre containing exact legal language for MSA Section 9 SLAs.",
      impact: "Eliminates legal contradiction exposure.",
    },
    {
      id: "rec-3",
      title: "Provide Social Media Thumbnail & Palette Templates",
      type: "asset_update",
      observation: "Visual consistency warnings increased by 12% across recent LinkedIn image uploads due to uncalibrated gradient backgrounds.",
      recommendation: "Publish updated Figma templates with locked #0B0F19 navy background values into the Visual Guidelines tab.",
      impact: "Improves cross-channel visual coherence.",
    },
  ];

  const handleExportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Mistake Category,Occurrences,Severity,Dimension",
       ...recurringMistakes.map(m => `"${m.mistake}",${m.count},"${m.severity}","${m.dimension}"`)
      ].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${activeAccount.slug}_recurring_mistakes_audit.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintPDF = () => {
    window.print();
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
              <span className="text-xs text-slate-400">Insights & Recommendations</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
              <BarChart3 className="w-7 h-7 text-purple-400" />
              Governance Analytics & Insights
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintPDF}
              className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-850 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-4 h-4 text-slate-400" />
              Print / Save PDF
            </button>
            <button
              onClick={handleExportCSV}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-glow-purple flex items-center gap-1.5 transition-all"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>

        {/* FEATURE ONE: BRAND DNA DRIFT DETECTOR */}
        <div className="p-6 sm:p-8 rounded-2xl bg-navy-900/80 border border-slate-800 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  <TrendingUp className="w-4 h-4" />
                </span>
                <h2 className="text-base sm:text-lg font-bold text-white">
                  Brand DNA Drift Detector
                </h2>
              </div>
              <p className="text-xs text-slate-400">
                Continuous temporal analysis comparing newly approved content with historical Brand DNA baseline across Tone, Editorial Pillars, Promotional Balance, and Vocabulary.
              </p>
            </div>
          </div>

          <BrandDriftDetector report={driftReport} brandName={activeAccount.name} />
        </div>

        {/* Top 3 Analytical Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-navy-900/80 border border-slate-800 shadow-xl">
            <div className="text-xs font-semibold text-slate-400 mb-1">Overall Guideline Adherence</div>
            <div className="text-3xl font-extrabold text-white font-mono">86.4%</div>
            <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+7.2% improvement since guidelines v3.1</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-navy-900/80 border border-slate-800 shadow-xl">
            <div className="text-xs font-semibold text-slate-400 mb-1">Most Common Off-Brand Vector</div>
            <div className="text-xl font-bold text-amber-300 mt-1">Tone & Voice Exclamations</div>
            <div className="text-[11px] text-slate-400 mt-1">
              Responsible for 34% of all flagged alerts
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-navy-900/80 border border-slate-800 shadow-xl">
            <div className="text-xs font-semibold text-slate-400 mb-1">Brand Health Grade</div>
            <div className="text-3xl font-extrabold text-emerald-400 font-mono">A- (Excellent)</div>
            <div className="text-[11px] text-slate-400 mt-1">
              Based on trailing 30-day upload batches
            </div>
          </div>
        </div>

        {/* AI Recommendations for Brand Guidelines Improvement */}
        <div className="p-6 rounded-2xl bg-navy-900/80 border border-purple-500/30 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-400" />
              <h2 className="text-base font-bold text-white">
                Intelligent Guidelines Drift & Improvement Recommendations
              </h2>
            </div>
            <span className="text-xs font-mono font-bold text-purple-300 px-2.5 py-0.5 rounded bg-purple-500/10 border border-purple-500/20">
              AI Continuous Learning
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            BRANDCHECKER AI monitors recurring mistakes across all creators to identify areas where brand guidelines
            are either ambiguous, outdated, or in need of additional approved templates.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {governanceRecommendations.map(rec => (
              <div
                key={rec.id}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-purple-500/40 transition-colors space-y-2.5 flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-mono font-bold text-purple-400 uppercase tracking-wider block">
                    {rec.type.replace(/_/g, " ")}
                  </span>
                  <h3 className="text-xs font-bold text-white mt-1">{rec.title}</h3>
                  <div className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                    <span className="text-slate-300 font-semibold">Observed Pattern:</span> {rec.observation}
                  </div>
                  <div className="text-[11px] text-emerald-300/90 mt-2 leading-relaxed">
                    <span className="text-emerald-400 font-semibold">Action:</span> {rec.recommendation}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 text-[10px] text-slate-400 italic">
                  Impact: {rec.impact}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recurring Mistakes Audit Table */}
        <div className="p-6 rounded-2xl bg-navy-900/70 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Frequently Detected Inconsistencies
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Aggregated error patterns observed across recent content submissions
              </p>
            </div>
            <span className="text-xs text-slate-400">Past 30 Days</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                  <th className="pb-3 font-semibold">Issue Description</th>
                  <th className="pb-3 font-semibold">Dimension</th>
                  <th className="pb-3 font-semibold">Severity</th>
                  <th className="pb-3 font-semibold">Occurrences</th>
                  <th className="pb-3 font-semibold text-right">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {recurringMistakes.map((m, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 font-semibold text-white">{m.mistake}</td>
                    <td className="py-3 text-slate-300">{m.dimension}</td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          m.severity === "Critical"
                            ? "bg-red-500/15 text-red-400 border border-red-500/30"
                            : m.severity === "High"
                            ? "bg-orange-500/15 text-orange-400 border border-orange-500/30"
                            : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                        }`}
                      >
                        {m.severity}
                      </span>
                    </td>
                    <td className="py-3 font-mono font-bold text-purple-300">{m.count} times</td>
                    <td className="py-3 text-right text-emerald-400 text-[11px] font-medium">
                      ↓ Decreasing
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
