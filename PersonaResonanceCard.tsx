"use client";

import React, { useState } from "react";
import { PersonaResonanceReport, AudiencePersonaAnalysis } from "@/types";
import {
  Users,
  Briefcase,
  Cpu,
  ShieldCheck,
  Sparkles,
  BookOpen,
  AlertCircle,
  CheckCircle2,
  ThumbsUp,
  HelpCircle,
  Lightbulb,
  ArrowRight,
  Gauge,
} from "lucide-react";

interface PersonaResonanceCardProps {
  report: PersonaResonanceReport;
}

export function PersonaResonanceCard({ report }: PersonaResonanceCardProps) {
  const [selectedPersonaId, setSelectedPersonaId] = useState<string>(
    report.personaAnalyses[0]?.personaId || ""
  );

  const selectedPersona =
    report.personaAnalyses.find(p => p.personaId === selectedPersonaId) ||
    report.personaAnalyses[0];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Briefcase":
        return <Briefcase className="w-4 h-4 text-purple-400" />;
      case "Cpu":
        return <Cpu className="w-4 h-4 text-cyan-400" />;
      case "ShieldCheck":
        return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
      case "BookOpen":
        return <BookOpen className="w-4 h-4 text-amber-400" />;
      default:
        return <Users className="w-4 h-4 text-purple-400" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
    if (score >= 65) return "text-blue-400 bg-blue-500/10 border-blue-500/20";
    return "text-red-400 bg-red-500/10 border-red-500/20";
  };

  return (
    <div className="space-y-6">
      {/* Overview Top Metric Bar */}
      <div className="p-6 rounded-2xl bg-navy-900/80 border border-slate-800 shadow-xl grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-600/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
              Overall Audience Fit
            </div>
            <div className="text-2xl font-bold text-white flex items-center gap-2">
              {report.overallAudienceFitScore}%
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                High Resonance
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-slate-800 md:pl-5">
          <div className="w-14 h-14 rounded-2xl bg-cyan-600/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Gauge className="w-7 h-7" />
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
              Reading Ease Index
            </div>
            <div className="text-2xl font-bold text-white">
              {report.fleschReadingEaseEstimate} / 100
            </div>
            <div className="text-[11px] text-slate-400">
              Cognitive Load:{" "}
              <span className="capitalize font-bold text-cyan-300">
                {report.cognitiveLoadLevel}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-slate-800 md:pl-5">
          <div className="w-14 h-14 rounded-2xl bg-amber-600/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Sparkles className="w-7 h-7" />
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
              Target Audience
            </div>
            <div className="text-sm font-bold text-white line-clamp-1">
              {report.targetAudienceClaimed}
            </div>
            <div className="text-[11px] text-slate-400">
              Simulated across {report.personaAnalyses.length} distinct personas
            </div>
          </div>
        </div>
      </div>

      {/* Persona Selection Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {report.personaAnalyses.map(persona => {
          const isSelected = persona.personaId === selectedPersona?.personaId;
          return (
            <button
              key={persona.personaId}
              onClick={() => setSelectedPersonaId(persona.personaId)}
              className={`p-4 rounded-xl text-left border transition-all ${
                isSelected
                  ? "bg-purple-950/25 border-purple-500/50 shadow-glow-purple"
                  : "bg-navy-900/60 border-slate-800 hover:border-slate-700 hover:bg-navy-900/90"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800">
                    {getIcon(persona.avatarIcon)}
                  </div>
                  <span className="text-xs font-bold text-white">{persona.personaName}</span>
                </div>
                <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${getScoreColor(persona.resonanceScore)}`}>
                  {persona.resonanceScore}%
                </span>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-2">
                {persona.roleDescription}
              </p>
            </button>
          );
        })}
      </div>

      {/* Detailed Persona Analysis Card */}
      {selectedPersona && (
        <div className="p-6 rounded-2xl bg-navy-900/80 border border-slate-800 shadow-xl space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                  {getIcon(selectedPersona.avatarIcon)}
                </span>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white">
                    {selectedPersona.personaName}
                  </h3>
                  <p className="text-xs text-slate-400">{selectedPersona.roleDescription}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Resonance Index:</span>
              <span className={`text-sm font-mono font-bold px-2.5 py-1 rounded-lg border ${getScoreColor(selectedPersona.resonanceScore)}`}>
                {selectedPersona.resonanceScore}%
              </span>
            </div>
          </div>

          {/* Persona Signals: Tone Fit & Jargon Friction */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Tone Alignment
              </span>
              <span className="capitalize font-semibold text-emerald-400">
                {selectedPersona.toneFit}
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Jargon / Vocabulary Friction
              </span>
              <span className="capitalize font-semibold text-cyan-400">
                {selectedPersona.jargonFriction}
              </span>
            </div>
          </div>

          {/* Predicted Reaction */}
          <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/30 text-xs space-y-1">
            <span className="text-[10px] uppercase font-bold text-purple-400 block">
              Simulated Persona Reaction:
            </span>
            <p className="text-slate-200 text-xs sm:text-sm italic leading-relaxed">
              "{selectedPersona.predictedReaction}"
            </p>
          </div>

          {/* Strengths & Barriers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="text-emerald-400 font-bold flex items-center gap-1.5 text-xs">
                <CheckCircle2 className="w-4 h-4" />
                Resonance Drivers & Strengths:
              </div>
              <ul className="space-y-1.5">
                {selectedPersona.perceivedStrengths.map((str, idx) => (
                  <li key={idx} className="text-slate-300 flex items-start gap-1.5 text-[11px]">
                    <span className="text-emerald-400">✓</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="text-red-400 font-bold flex items-center gap-1.5 text-xs">
                <AlertCircle className="w-4 h-4" />
                Friction Points & Hesitations:
              </div>
              <ul className="space-y-1.5">
                {selectedPersona.resonanceBarriers.map((bar, idx) => (
                  <li key={idx} className="text-slate-300 flex items-start gap-1.5 text-[11px]">
                    <span className="text-red-400">•</span>
                    <span>{bar}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Actionable Tailored Adjustment */}
          <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/30 space-y-1">
            <div className="text-indigo-300 font-bold flex items-center gap-1.5 text-xs">
              <Lightbulb className="w-4 h-4 text-indigo-400" />
              Tailored Persona Calibration:
            </div>
            <p className="text-slate-200 text-xs leading-relaxed">
              {selectedPersona.tailoredAdjustment}
            </p>
          </div>
        </div>
      )}

      {/* Strategic Audience Advice Card */}
      <div className="p-5 rounded-2xl bg-navy-900/60 border border-slate-800 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-purple-400" />
          Strategic Audience Resonance Recommendations
        </h4>
        <div className="space-y-2">
          {report.strategicAudienceAdvice.map((adv, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 flex items-start gap-2"
            >
              <ArrowRight className="w-3.5 h-3.5 text-purple-400 flex-shrink-0 mt-0.5" />
              <span>{adv}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
