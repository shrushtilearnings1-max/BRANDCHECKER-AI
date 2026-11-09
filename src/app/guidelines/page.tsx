"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useApp } from "@/context/AppContext";
import {
  BookOpen,
  Compass,
  Layers,
  Volume2,
  Palette,
  FileCheck2,
  History,
  Save,
  Plus,
  Trash2,
  FileText,
  Upload,
  CheckCircle2,
  ShieldAlert,
} from "lucide-react";
import { GuidelineVersion, ContentPillar, ApprovedFact } from "@/types";

export default function GuidelinesPage() {
  const { activeAccount, updateAccount, logActivity } = useApp();
  const [activeTab, setActiveTab] = useState<
    "vision" | "strategy" | "communication" | "visual" | "approved_info" | "history"
  >("vision");

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Editable copies
  const [vision, setVision] = useState(activeAccount.vision);
  const [contentStrategy, setContentStrategy] = useState(activeAccount.contentStrategy);
  const [communication, setCommunication] = useState(activeAccount.communicationIdentity);
  const [visual, setVisual] = useState(activeAccount.visualIdentity);
  const [approvedInfo, setApprovedInfo] = useState(activeAccount.approvedInformation);
  const [versionHistory, setVersionHistory] = useState(activeAccount.versionHistory || []);

  // Quick inputs
  const [newAvoidedWord, setNewAvoidedWord] = useState("");
  const [newPreferredVocab, setNewPreferredVocab] = useState("");
  const [newFocusTopic, setNewFocusTopic] = useState("");
  const [newAvoidedTopic, setNewAvoidedTopic] = useState("");
  const [newFactClaim, setNewFactClaim] = useState("");
  const [newFactSource, setNewFactSource] = useState("");
  const [versionSummary, setVersionSummary] = useState("");

  const handleSave = () => {
    const updatedHistory: GuidelineVersion[] = [
      {
        version: `v${(versionHistory.length * 0.1 + 3.0).toFixed(1)}`,
        updatedDate: new Date().toISOString(),
        updatedBy: "Elena Rostova",
        changeSummary: versionSummary || "Updated brand guidelines and communication lexicon.",
      },
      ...versionHistory,
    ];

    const updatedAccount = {
      ...activeAccount,
      vision,
      contentStrategy,
      communicationIdentity: communication,
      visualIdentity: visual,
      approvedInformation: approvedInfo,
      versionHistory: updatedHistory,
      updatedAt: new Date().toISOString(),
    };

    updateAccount(updatedAccount);
    setVersionHistory(updatedHistory);
    setVersionSummary("");
    setSavedSuccess(true);
    logActivity("Updated Brand Guidelines", `Saved guideline revisions for "${activeAccount.name}"`);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Page Title & Save Action */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
                {activeAccount.name}
              </span>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs text-slate-400">Current Guideline Baseline</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
              <BookOpen className="w-7 h-7 text-purple-400" />
              Brand Identity & Guidelines
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {savedSuccess && (
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1 animate-fade-in">
                <CheckCircle2 className="w-4 h-4" /> Guidelines Saved
              </span>
            )}
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-glow-purple transition-all flex items-center gap-1.5 active:scale-95"
            >
              <Save className="w-4 h-4" />
              Save Revisions
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto pb-1 gap-2 border-b border-slate-800">
          {[
            { id: "vision", label: "Vision & Philosophy", icon: Compass },
            { id: "strategy", label: "Editorial Pillars", icon: Layers },
            { id: "communication", label: "Communication & Vocabulary", icon: Volume2 },
            { id: "visual", label: "Visual Identity", icon: Palette },
            { id: "approved_info", label: "Approved Facts & Docs", icon: FileCheck2 },
            { id: "history", label: "Version History", icon: History },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-purple-600/20 text-purple-200 border border-purple-500/40"
                    : "text-slate-400 hover:text-white hover:bg-slate-900"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Vision */}
        {activeTab === "vision" && (
          <div className="p-6 sm:p-8 rounded-2xl bg-navy-900/70 border border-slate-800 shadow-xl space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Long-Term Vision
              </label>
              <textarea
                rows={2}
                value={vision.longTermVision}
                onChange={e => setVision({ ...vision, longTermVision: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500 leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Mission Statement
              </label>
              <textarea
                rows={2}
                value={vision.mission}
                onChange={e => setVision({ ...vision, mission: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500 leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Content Philosophy
              </label>
              <textarea
                rows={2}
                value={vision.contentPhilosophy}
                onChange={e => setVision({ ...vision, contentPhilosophy: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500 leading-relaxed"
              />
            </div>

            {/* Focus & Avoided Topics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Focus Topics */}
              <div className="p-4 rounded-xl bg-slate-950 border border-emerald-900/30">
                <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
                  Strategic Focus Topics
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {vision.focusTopics.map((topic, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 flex items-center gap-1.5"
                    >
                      {topic}
                      <button
                        onClick={() =>
                          setVision({
                            ...vision,
                            focusTopics: vision.focusTopics.filter((_, idx) => idx !== i),
                          })
                        }
                        className="hover:text-red-400"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newFocusTopic}
                    onChange={e => setNewFocusTopic(e.target.value)}
                    placeholder="Add focus topic..."
                    className="flex-1 px-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-white"
                  />
                  <button
                    onClick={() => {
                      if (!newFocusTopic.trim()) return;
                      setVision({
                        ...vision,
                        focusTopics: [...vision.focusTopics, newFocusTopic.trim()],
                      });
                      setNewFocusTopic("");
                    }}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Avoided Topics */}
              <div className="p-4 rounded-xl bg-slate-950 border border-red-900/30">
                <div className="text-xs font-bold text-red-400 uppercase tracking-wider mb-2">
                  Strictly Avoided Topics (Triggers Critical Alerts)
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {vision.avoidedTopics.map((topic, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium bg-red-950/40 border border-red-500/30 text-red-300 flex items-center gap-1.5"
                    >
                      {topic}
                      <button
                        onClick={() =>
                          setVision({
                            ...vision,
                            avoidedTopics: vision.avoidedTopics.filter((_, idx) => idx !== i),
                          })
                        }
                        className="hover:text-white"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newAvoidedTopic}
                    onChange={e => setNewAvoidedTopic(e.target.value)}
                    placeholder="Add avoided topic..."
                    className="flex-1 px-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-white"
                  />
                  <button
                    onClick={() => {
                      if (!newAvoidedTopic.trim()) return;
                      setVision({
                        ...vision,
                        avoidedTopics: [...vision.avoidedTopics, newAvoidedTopic.trim()],
                      });
                      setNewAvoidedTopic("");
                    }}
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-lg"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Strategy */}
        {activeTab === "strategy" && (
          <div className="p-6 sm:p-8 rounded-2xl bg-navy-900/70 border border-slate-800 shadow-xl space-y-6">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Approved Content Pillars
              </div>
              <div className="space-y-3">
                {contentStrategy.pillars.map((pillar, idx) => (
                  <div
                    key={pillar.id}
                    className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex-1">
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        <span className="font-mono text-purple-400">Pillar {idx + 1}:</span>
                        <span>{pillar.name}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1">
                        {pillar.description}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                        Target: {pillar.targetPercentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Posting Style & Cadence
              </label>
              <input
                type="text"
                value={contentStrategy.postingStyle}
                onChange={e =>
                  setContentStrategy({ ...contentStrategy, postingStyle: e.target.value })
                }
                className="w-full px-3.5 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>
        )}

        {/* Tab 3: Communication & Vocabulary */}
        {activeTab === "communication" && (
          <div className="p-6 sm:p-8 rounded-2xl bg-navy-900/70 border border-slate-800 shadow-xl space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Brand Voice
                </label>
                <input
                  type="text"
                  value={communication.brandVoice}
                  onChange={e =>
                    setCommunication({ ...communication, brandVoice: e.target.value })
                  }
                  className="w-full px-3.5 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Formality Level
                </label>
                <select
                  value={communication.formalityLevel}
                  onChange={e =>
                    setCommunication({ ...communication, formalityLevel: e.target.value as any })
                  }
                  className="w-full px-3.5 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white"
                >
                  <option value="Professional">Professional</option>
                  <option value="Conversational">Conversational</option>
                  <option value="Authoritative">Authoritative</option>
                  <option value="Casual">Casual</option>
                </select>
              </div>
            </div>

            {/* Avoided Words Blacklist */}
            <div className="p-5 rounded-xl bg-slate-950 border border-red-900/30">
              <div className="text-xs font-bold text-red-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>Prohibited Words & Phrases (Blacklist)</span>
                <span className="text-[10px] text-slate-400 lowercase">
                  {communication.avoidedWords.length} restricted terms
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mb-3">
                Any incoming upload containing these words will trigger high-severity terminology alerts.
              </p>

              <div className="flex flex-wrap gap-2 mb-3">
                {communication.avoidedWords.map((word, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-red-950/40 border border-red-500/30 text-red-300 flex items-center gap-1.5"
                  >
                    "{word}"
                    <button
                      onClick={() =>
                        setCommunication({
                          ...communication,
                          avoidedWords: communication.avoidedWords.filter((_, idx) => idx !== i),
                        })
                      }
                      className="hover:text-white"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newAvoidedWord}
                  onChange={e => setNewAvoidedWord(e.target.value)}
                  placeholder="Add restricted word or phrase..."
                  className="flex-1 px-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-white"
                />
                <button
                  onClick={() => {
                    if (!newAvoidedWord.trim()) return;
                    setCommunication({
                      ...communication,
                      avoidedWords: [...communication.avoidedWords, newAvoidedWord.trim()],
                    });
                    setNewAvoidedWord("");
                  }}
                  className="px-4 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-lg"
                >
                  Add to Blacklist
                </button>
              </div>
            </div>

            {/* Preferred Lexicon */}
            <div className="p-5 rounded-xl bg-slate-950 border border-emerald-900/30">
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
                Approved Vocabulary & Preferred Terminology
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                {communication.preferredVocabulary.map((word, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 flex items-center gap-1.5"
                  >
                    {word}
                    <button
                      onClick={() =>
                        setCommunication({
                          ...communication,
                          preferredVocabulary: communication.preferredVocabulary.filter(
                            (_, idx) => idx !== i
                          ),
                        })
                      }
                      className="hover:text-white"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newPreferredVocab}
                  onChange={e => setNewPreferredVocab(e.target.value)}
                  placeholder="Add approved vocabulary word..."
                  className="flex-1 px-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-white"
                />
                <button
                  onClick={() => {
                    if (!newPreferredVocab.trim()) return;
                    setCommunication({
                      ...communication,
                      preferredVocabulary: [...communication.preferredVocabulary, newPreferredVocab.trim()],
                    });
                    setNewPreferredVocab("");
                  }}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg"
                >
                  Add Approved Term
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Visual Identity */}
        {activeTab === "visual" && (
          <div className="p-6 sm:p-8 rounded-2xl bg-navy-900/70 border border-slate-800 shadow-xl space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-xs font-bold text-slate-400 mb-2">Primary Color</div>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg border border-white/20 shadow-inner"
                    style={{ backgroundColor: visual.primaryColor }}
                  />
                  <div>
                    <div className="text-xs font-mono font-bold text-white">{visual.primaryColor}</div>
                    <div className="text-[10px] text-slate-500">Brand Surface</div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-xs font-bold text-slate-400 mb-2">Secondary Color</div>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg border border-white/20 shadow-inner"
                    style={{ backgroundColor: visual.secondaryColor }}
                  />
                  <div>
                    <div className="text-xs font-mono font-bold text-white">{visual.secondaryColor}</div>
                    <div className="text-[10px] text-slate-500">Accent & Action</div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-xs font-bold text-slate-400 mb-2">Accent Highlight</div>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg border border-white/20 shadow-inner"
                    style={{ backgroundColor: visual.accentColor }}
                  />
                  <div>
                    <div className="text-xs font-mono font-bold text-white">{visual.accentColor}</div>
                    <div className="text-[10px] text-slate-500">Metric Calls</div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Image Style & Aesthetic Guidelines
              </label>
              <textarea
                rows={3}
                value={visual.imageStyle}
                onChange={e => setVisual({ ...visual, imageStyle: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>
        )}

        {/* Tab 5: Approved Info & Facts */}
        {activeTab === "approved_info" && (
          <div className="p-6 sm:p-8 rounded-2xl bg-navy-900/70 border border-slate-800 shadow-xl space-y-6">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
                <span>Verified Facts Knowledge Base</span>
                <span className="text-[10px] text-emerald-400 font-mono">
                  {approvedInfo.facts.length} Verified Entries
                </span>
              </div>

              <div className="space-y-3 mb-4">
                {approvedInfo.facts.map(fact => (
                  <div
                    key={fact.id}
                    className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-4 text-xs"
                  >
                    <div>
                      <div className="font-semibold text-white leading-relaxed">{fact.claim}</div>
                      <div className="text-[10px] text-slate-400 mt-1">
                        Category: <span className="text-purple-300">{fact.category}</span> • Source:{" "}
                        <span className="text-slate-300">{fact.verifiedSource}</span> • Approved:{" "}
                        {fact.approvedDate}
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex-shrink-0">
                      Verified
                    </span>
                  </div>
                ))}
              </div>

              {/* Add Fact */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="text-xs font-bold text-white">Add Verified Fact to Knowledge Base</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={newFactClaim}
                    onChange={e => setNewFactClaim(e.target.value)}
                    placeholder="Exact verified claim or statistic..."
                    className="sm:col-span-2 px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-white"
                  />
                  <input
                    type="text"
                    value={newFactSource}
                    onChange={e => setNewFactSource(e.target.value)}
                    placeholder="Citation source (e.g. Audit report)"
                    className="px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-white"
                  />
                </div>
                <button
                  onClick={() => {
                    if (!newFactClaim.trim()) return;
                    setApprovedInfo({
                      ...approvedInfo,
                      facts: [
                        ...approvedInfo.facts,
                        {
                          id: `f-${Date.now()}`,
                          claim: newFactClaim.trim(),
                          category: "Corporate Fact",
                          verifiedSource: newFactSource.trim() || "Legal Clearance",
                          approvedDate: new Date().toISOString().split("T")[0],
                        },
                      ],
                    });
                    setNewFactClaim("");
                    setNewFactSource("");
                  }}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-lg flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Save to Knowledge Base
                </button>
              </div>
            </div>

            {/* Uploaded Documents */}
            <div className="pt-4 border-t border-slate-800">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Ingested Guideline Files
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeAccount.guidelineFiles.map(file => (
                  <div key={file.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3">
                    <FileText className="w-5 h-5 text-purple-400 flex-shrink-0" />
                    <div className="truncate flex-1">
                      <div className="text-xs font-semibold text-white truncate">{file.name}</div>
                      <div className="text-[10px] text-slate-500">{file.size} • Ingested {file.uploadDate}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: Version History */}
        {activeTab === "history" && (
          <div className="p-6 sm:p-8 rounded-2xl bg-navy-900/70 border border-slate-800 shadow-xl space-y-6">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Brand Guidelines Version History & Audit Trail
            </div>

            <div className="space-y-4">
              {versionHistory.map((v, i) => (
                <div key={i} className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-bold text-purple-300 text-sm">{v.version}</span>
                    <span className="text-[10px] text-slate-500">
                      {new Date(v.updatedDate).toLocaleDateString()} by {v.updatedBy}
                    </span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{v.changeSummary}</p>
                </div>
              ))}
            </div>

            {/* Version change log comment box */}
            <div className="pt-4 border-t border-slate-800 space-y-2">
              <label className="block text-xs font-bold text-white">Record Change Summary for Next Version</label>
              <input
                type="text"
                value={versionSummary}
                onChange={e => setVersionSummary(e.target.value)}
                placeholder="e.g. Added stricter wording around AI autonomy benchmarks..."
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white"
              />
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
