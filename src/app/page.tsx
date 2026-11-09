"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Compass,
  Volume2,
  FileSearch,
  Users,
  Eye,
  BarChart3,
  CheckSquare,
  Lock,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { CircularScore } from "@/components/common/CircularScore";

export default function LandingPage() {
  const [demoInput, setDemoInput] = useState(
    "🚀 BUY NOW! Our magical AI tool is the cheapest in the universe and will effortlessly replace all your lazy developers overnight! 100% zero downtime guaranteed forever!"
  );
  const [analyzed, setAnalyzed] = useState(true);

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 antialiased selection:bg-purple-600 selection:text-white">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-purple-900/60 via-indigo-900/60 to-purple-900/60 border-b border-purple-500/20 px-4 py-2 text-center text-xs text-purple-200">
        <span className="font-semibold text-white">BRANDCHECKER AI 2.0</span> — The Intelligent Verification Layer Between Content Creation & Publication.
        <Link href="/dashboard" className="ml-2 font-bold underline hover:text-white inline-flex items-center gap-1">
          Launch Dashboard <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Navigation */}
      <header className="border-b border-slate-800/80 bg-navy-950/70 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 p-0.5 flex items-center justify-center shadow-glow-purple">
              <div className="w-full h-full bg-navy-950 rounded-[10px] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-purple-400" />
              </div>
            </div>
            <span className="text-base font-bold tracking-tight text-white font-mono">
              BRANDCHECKER<span className="text-purple-400">.AI</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-slate-300">
            <a href="#how-it-works" className="hover:text-purple-400 transition-colors">How It Works</a>
            <a href="#capabilities" className="hover:text-purple-400 transition-colors">Governance Engine</a>
            <a href="#interactive-demo" className="hover:text-purple-400 transition-colors">Live Verification</a>
            <a href="#scoring" className="hover:text-purple-400 transition-colors">Scoring Model</a>
            <a href="#workflow" className="hover:text-purple-400 transition-colors">Human Approval</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-glow-purple transition-all active:scale-95"
            >
              Start Protecting Your Brand
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 overflow-hidden">
        {/* Glow background accents */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-purple-600/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-blue-600/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
            AI-Powered Brand & Content Governance Platform
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.1]">
            Every piece of content should{" "}
            <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
              reflect your identity.
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-base sm:text-xl text-slate-400 leading-relaxed mb-10">
            An intelligent governance platform that ensures every upload aligns with your brand vision,
            tone, approved facts, and regulatory standards before it reaches your audience.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-glow-purple flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <span>Start Protecting Your Brand</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-900 border border-slate-700/80 hover:bg-slate-800 text-slate-200 font-semibold text-sm transition-all flex items-center justify-center gap-2"
            >
              <span>Explore Platform</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </Link>
          </div>

          {/* Social Proof Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-12 border-t border-slate-800/80 text-left">
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">100%</div>
              <div className="text-xs text-slate-400 mt-1">Brand Guideline Enforcement</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">9 Dimensions</div>
              <div className="text-xs text-slate-400 mt-1">Multi-vector Content Evaluation</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-purple-400 font-mono">+28% Avg Lift</div>
              <div className="text-xs text-slate-400 mt-1">Post-Revision Alignment Score</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">Human in Loop</div>
              <div className="text-xs text-slate-400 mt-1">Zero Silent AI Overrides</div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Demonstration Section */}
      <section id="interactive-demo" className="py-20 bg-slate-950/60 border-y border-slate-800/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
              Interactive Demonstration
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-white mt-2">
              See the Verification Engine in Action
            </h2>
            <p className="text-sm text-slate-400 mt-3">
              Watch how BRANDCHECKER AI tests a piece of copy against an enterprise brand identity,
              detects hyperbole, tone violations, and unsupported claims, and calculates a weighted score.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-navy-900/90 shadow-2xl overflow-hidden p-6 lg:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-950 border border-purple-500/30 flex items-center justify-center font-bold text-purple-300">
                  N
                </div>
                <div>
                  <div className="text-sm font-bold text-white">Target Brand: Nexus Cloud AI</div>
                  <div className="text-xs text-slate-400">Guideline Profile: Enterprise B2B SaaS • Authoritative & Calm Voice</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
                  4 Violations Detected
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                  Draft Submission
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
              {/* Left Column: Sample Draft */}
              <div className="lg:col-span-7 space-y-4">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Uploaded Draft Content
                </label>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-sans text-sm leading-relaxed text-slate-200">
                  {demoInput}
                </div>

                {/* Detected Issues Callout */}
                <div className="space-y-2 pt-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Flagged Discrepancies
                  </div>

                  <div className="p-3 rounded-lg bg-red-950/20 border border-red-900/30 flex items-start gap-3">
                    <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <span className="font-bold text-red-300">Restricted Tone & Vocabulary:</span>{" "}
                      <span className="text-slate-300">
                        "BUY NOW!" and "magical cheat code" are prohibited by Nexus Cloud AI communication guidelines.
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-red-950/20 border border-red-900/30 flex items-start gap-3">
                    <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <span className="font-bold text-red-300">Factual Contradiction:</span>{" "}
                      <span className="text-slate-300">
                        "100% zero downtime guaranteed forever" contradicts official contractual 99.99% SLA policy.
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-900/30 flex items-start gap-3">
                    <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <span className="font-bold text-amber-300">Vision Topic Violation:</span>{" "}
                      <span className="text-slate-300">
                        "replace all your lazy developers overnight" touches explicitly avoided narrative topic.
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Instant Alignment Score & Suggested Correction */}
              <div className="lg:col-span-5 flex flex-col justify-between bg-slate-950/70 p-6 rounded-xl border border-slate-800">
                <div className="text-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Overall Calculated Alignment
                  </span>
                  <div className="mt-4 mb-2 flex justify-center">
                    <CircularScore score={54} size={130} />
                  </div>
                  <p className="text-xs text-slate-400 mt-2">
                    Score is weighted across 9 distinct brand dimensions. Substantial revision recommended.
                  </p>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-800">
                  <div className="text-xs font-bold text-emerald-400 mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Suggested Brand-Aligned Alternative:
                  </div>
                  <p className="text-xs text-slate-300 italic bg-emerald-950/20 p-3 rounded-lg border border-emerald-900/30 leading-relaxed">
                    "Modern engineering teams face increasing complexity managing multi-agent systems. Nexus Core Mesh provides the deterministic orchestration infrastructure required to scale autonomous agents with contractual 99.99% availability."
                  </p>

                  <Link
                    href="/studio"
                    className="mt-4 w-full py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold text-center block transition-colors"
                  >
                    Open in Improvement Studio
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
              End-to-End Governance Architecture
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-white mt-2">
              How BRANDCHECKER AI Protects Your Brand
            </h2>
            <p className="text-sm text-slate-400 mt-3">
              A four-step closed-loop system connecting guideline learning, automated evaluation,
              collaborative studio improvement, and final human sign-off.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-navy-900/70 border border-slate-800 relative group hover:border-purple-500/40 transition-all">
              <div className="w-10 h-10 rounded-xl bg-purple-950 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4 font-bold text-sm">
                01
              </div>
              <h3 className="text-base font-bold text-white mb-2">Ingest & Learn Identity</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Import brand guidelines, vision pillars, tone standards, avoided words, verified facts, and legal disclaimers.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-navy-900/70 border border-slate-800 relative group hover:border-purple-500/40 transition-all">
              <div className="w-10 h-10 rounded-xl bg-indigo-950 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4 font-bold text-sm">
                02
              </div>
              <h3 className="text-base font-bold text-white mb-2">Verify Uploaded Content</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Evaluate text, documents, images, and social posts across 9 weighted dimensions with zero generic standards.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-navy-900/70 border border-slate-800 relative group hover:border-purple-500/40 transition-all">
              <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4 font-bold text-sm">
                03
              </div>
              <h3 className="text-base font-bold text-white mb-2">Improve in Studio</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Side-by-side diff comparison. Accept AI suggestions or edit manually while preserving the creator's original purpose.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-navy-900/70 border border-slate-800 relative group hover:border-purple-500/40 transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 font-bold text-sm">
                04
              </div>
              <h3 className="text-base font-bold text-white mb-2">Collaborative Approval</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Role-based review workflows. Human reviewers retain final authority with internal comments and complete audit trails.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The 9 Dimensions of Evaluation */}
      <section id="capabilities" className="py-20 bg-slate-950/70 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
              Multi-Vector Governance
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-white mt-2">
              9 Evaluation Dimensions
            </h2>
            <p className="text-sm text-slate-400 mt-3">
              Every upload is analyzed against the selected brand profile across nine rigorous dimensions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Vision Alignment", weight: "20%", icon: Compass, desc: "Evaluates mission alignment, core objectives, and rigorously flags prohibited topics." },
              { title: "Content Pillar Alignment", weight: "15%", icon: Layers, desc: "Verifies strategic category assignment and prevents editorial drift." },
              { title: "Tone & Voice Consistency", weight: "15%", icon: Volume2, desc: "Ensures formality levels, emotional resonance, and writing style rules are honored." },
              { title: "Audience Relevance", weight: "10%", icon: Users, desc: "Checks that messaging directly addresses intended audience demographic and pain points." },
              { title: "Factual Accuracy", weight: "15%", icon: CheckCircle2, desc: "Grounds every metric in verified company facts, official citations, and approved data." },
              { title: "Terminology Consistency", weight: "5%", icon: FileSearch, desc: "Enforces approved company vocabulary while eliminating forbidden words and phrases." },
              { title: "Visual Consistency", weight: "10%", icon: Eye, desc: "Evaluates logo clear space, brand color palette compliance, and visual asset standards." },
              { title: "Accessibility Standards", weight: "5%", icon: ShieldCheck, desc: "Monitors sentence cognitive load, readability scores, and visual contrast clarity." },
              { title: "Promotional Compliance", weight: "5%", icon: AlertTriangle, desc: "Identifies unprovable absolutes, aggressive sales shouting, and missing disclaimers." },
            ].map((dim, i) => {
              const Icon = dim.icon;
              return (
                <div key={i} className="p-5 rounded-2xl bg-navy-900/60 border border-slate-800/80 hover:border-slate-700 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-950/60 border border-purple-500/20 flex items-center justify-center text-purple-400">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-mono font-bold text-purple-300 px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20">
                      Default: {dim.weight}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1.5">{dim.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{dim.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <section className="py-20 bg-gradient-to-b from-navy-950 to-slate-950 border-t border-slate-800 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-6">
            Protect your brand reputation before publication.
          </h2>
          <p className="text-base text-slate-400 max-w-2xl mx-auto mb-8">
            Empower creators, marketing teams, and brand managers with explainable AI governance that balances automation with human control.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-glow-purple flex items-center gap-2"
            >
              <span>Start Protecting Your Brand</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className="px-8 py-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 font-semibold text-sm"
            >
              Demo Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-navy-950 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            <span className="text-slate-300 font-mono font-bold">BRANDCHECKER AI</span>
            <span>— Intelligent Content Governance</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="hover:text-slate-300">Overview</Link>
            <Link href="/guidelines" className="hover:text-slate-300">Guidelines</Link>
            <Link href="/upload" className="hover:text-slate-300">Upload</Link>
            <Link href="/analytics" className="hover:text-slate-300">Analytics</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
