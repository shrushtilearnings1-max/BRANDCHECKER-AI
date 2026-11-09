"use client";

import React from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { useApp } from "@/context/AppContext";
import {
  Building2,
  Plus,
  Check,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  FileText,
  Clock,
  Layers,
} from "lucide-react";
import { CircularScore } from "@/components/common/CircularScore";

export default function AccountsPage() {
  const { accounts, activeAccount, setActiveAccount, contentItems } = useApp();

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
                Multi-Brand Portfolio
              </span>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs text-slate-400">Account Switcher</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
              <Building2 className="w-7 h-7 text-purple-400" />
              Managed Brand Accounts
            </h1>
          </div>

          <Link
            href="/setup"
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-glow-purple flex items-center gap-1.5 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Create Brand Profile
          </Link>
        </div>

        {/* Brand Accounts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accounts.map(acc => {
            const isSelected = acc.id === activeAccount.id;
            const brandUploads = contentItems.filter(c => c.accountId === acc.id);
            const scores = brandUploads
              .map(c => c.latestScore)
              .filter((s): s is number => s !== undefined);
            const avgScore =
              scores.length > 0
                ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
                : 82;

            return (
              <div
                key={acc.id}
                className={`p-6 rounded-2xl border transition-all flex flex-col justify-between ${
                  isSelected
                    ? "bg-navy-900 border-purple-500/60 shadow-glow-purple ring-1 ring-purple-500/30"
                    : "bg-navy-900/60 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-800 border border-slate-700 flex-shrink-0 flex items-center justify-center font-bold text-white text-base">
                        {acc.logo ? (
                          <img src={acc.logo} alt={acc.name} className="w-full h-full object-cover" />
                        ) : (
                          acc.name.slice(0, 1)
                        )}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                          <span>{acc.name}</span>
                          <ShieldCheck className="w-4 h-4 text-purple-400 flex-shrink-0" />
                        </h3>
                        <div className="text-xs text-slate-400">{acc.industry}</div>
                      </div>
                    </div>

                    {isSelected && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                        ACTIVE
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-2 mb-4">
                    {acc.description}
                  </p>

                  {/* Channels & Platforms */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {acc.platforms.map((plat, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-950 border border-slate-800 text-slate-400"
                      >
                        {plat}
                      </span>
                    ))}
                  </div>

                  {/* Metrics preview */}
                  <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs mb-4">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-semibold">Total Content</span>
                      <div className="text-base font-bold font-mono text-white mt-0.5">
                        {brandUploads.length} items
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-semibold">Avg Alignment</span>
                      <div className="text-base font-bold font-mono text-emerald-400 mt-0.5">
                        {avgScore}%
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800/60 flex items-center justify-between">
                  <Link
                    href="/guidelines"
                    className="text-xs text-slate-400 hover:text-white font-medium"
                  >
                    Guidelines & Facts →
                  </Link>

                  {isSelected ? (
                    <span className="text-xs font-semibold text-purple-400 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Selected Brand
                    </span>
                  ) : (
                    <button
                      onClick={() => setActiveAccount(acc.id)}
                      className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-purple-600 hover:text-white text-slate-300 text-xs font-semibold transition-all"
                    >
                      Switch to Brand
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
