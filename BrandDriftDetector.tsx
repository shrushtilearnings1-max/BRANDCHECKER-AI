"use client";

import React from "react";
import { BrandDnaDriftReport } from "@/types";
import { DriftLevelBadge } from "@/components/common/Badge";
import { CircularScore } from "@/components/common/CircularScore";
import {
  TrendingUp,
  AlertTriangle,
  ShieldCheck,
  Compass,
  CheckCircle2,
  Lightbulb,
  ArrowRight,
  Layers,
  Sparkles,
  RotateCcw,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

interface BrandDriftDetectorProps {
  report: BrandDnaDriftReport;
  brandName: string;
}

export function BrandDriftDetector({ report, brandName }: BrandDriftDetectorProps) {
  return (
    <div className="space-y-6">
      {/* Warning Banner if Drift Detected */}
      {report.warningTriggered ? (
        <div className="p-5 rounded-2xl bg-red-950/30 border border-red-500/50 shadow-xl space-y-2">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 animate-pulse" />
            <h3 className="text-sm font-bold text-red-200">
              {report.warningTitle || "Potential Brand Drift Detected"}
            </h3>
            <DriftLevelBadge level={report.driftLevel} />
          </div>
          <p className="text-xs text-red-200/90 leading-relaxed">
            {report.warningMessage}
          </p>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 shadow-lg flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <div>
              <div className="text-xs font-bold text-white">Brand DNA Baseline Stable</div>
              <div className="text-[11px] text-emerald-300">
                Recent content uploads consistently reflect {brandName}'s core identity.
              </div>
            </div>
          </div>
          <DriftLevelBadge level={report.driftLevel} />
        </div>
      )}

      {/* Top Drift Scorecard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center p-6 sm:p-8 rounded-2xl bg-navy-900/80 border border-slate-800 shadow-xl">
        <div className="lg:col-span-8 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-300 px-2.5 py-0.5 rounded bg-purple-500/10 border border-purple-500/20">
              Brand DNA Drift Detector
            </span>
            <DriftLevelBadge level={report.driftLevel} />
          </div>

          <h2 className="text-lg sm:text-xl font-bold text-white">
            Historical Brand Consistency: {report.consistencyScore}%
          </h2>

          <p className="text-xs text-slate-300 leading-relaxed font-medium">
            {report.historicalBaselineSummary}
          </p>
          <p className="text-xs text-slate-400 leading-relaxed">
            {report.currentPatternSummary}
          </p>
        </div>

        <div className="lg:col-span-4 flex flex-col items-center justify-center p-4 bg-slate-950/70 rounded-xl border border-slate-800">
          <CircularScore score={report.consistencyScore} size={130} />
          <div className="text-[11px] text-slate-400 mt-2 text-center font-medium">
            Current Brand DNA Integrity
          </div>
        </div>
      </div>

      {/* Trend Timeline Visualization (Recharts) */}
      <div className="p-6 rounded-2xl bg-navy-900/70 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-400" />
              Brand Consistency Trajectory Over Time
            </h3>
            <p className="text-xs text-slate-400">
              Tracks whether identity is eroding across recent upload batches
            </p>
          </div>
          <span className="text-xs text-purple-300 font-mono font-semibold">
            Baseline Target: &gt;85%
          </span>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={report.timeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="driftGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="period" stroke="#64748B" fontSize={11} tickLine={false} />
              <YAxis domain={[40, 100]} stroke="#64748B" fontSize={11} tickLine={false} />
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
                dataKey="consistencyScore"
                stroke="#8B5CF6"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#driftGrad)"
                name="Brand DNA Consistency %"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4 Dimension Drift Metrics Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {report.dimensionMetrics.map((dim, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-navy-900/70 border border-slate-800 space-y-3 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold text-white">{dim.dimension}</span>
                <span
                  className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded border ${
                    dim.driftLevel === "high"
                      ? "bg-red-500/10 text-red-400 border-red-500/20"
                      : dim.driftLevel === "medium"
                      ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  }`}
                >
                  {dim.driftPercentage}% Drift
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] mb-2">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">Brand Baseline:</span>
                  <span className="text-slate-300 font-medium">{dim.baselineValue}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">Observed Pattern:</span>
                  <span className="text-purple-300 font-medium">{dim.currentValue}</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{dim.observation}</p>
            </div>

            <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-500 flex items-center justify-between">
              <span>Status: <strong className="capitalize text-slate-300">{dim.trend.replace(/_/g, " ")}</strong></span>
              <DriftLevelBadge level={dim.driftLevel} />
            </div>
          </div>
        ))}
      </div>

      {/* Detected Changes & Corrective Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Detected Changes */}
        <div className="p-6 rounded-2xl bg-navy-900/70 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Compass className="w-4 h-4 text-purple-400" />
            Detected Brand DNA Shifts
          </h3>
          <ul className="space-y-2.5 text-xs text-slate-300">
            {report.detectedChanges.map((change, i) => (
              <li key={i} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start gap-2.5">
                <span className="text-purple-400 font-bold mt-0.5">•</span>
                <span className="leading-relaxed">{change}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Corrective Actions */}
        <div className="p-6 rounded-2xl bg-navy-900/70 border border-purple-500/30 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              Recommended Corrective Actions
            </h3>
            <span className="text-[10px] font-mono text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
              Drift Prevention
            </span>
          </div>
          <ul className="space-y-2.5 text-xs text-slate-300">
            {report.recommendations.map((rec, i) => (
              <li key={i} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
