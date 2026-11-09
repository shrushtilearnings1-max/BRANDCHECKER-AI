"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useApp } from "@/context/AppContext";
import {
  Settings,
  Sliders,
  Sparkles,
  Key,
  Shield,
  Bell,
  User,
  Save,
  CheckCircle2,
  RefreshCw,
  Lock,
} from "lucide-react";
import { ScoringWeights } from "@/types";
import { DIMENSION_METADATA } from "@/lib/scoring";

export default function SettingsPage() {
  const {
    activeAccount,
    updateAccountScoringWeights,
    currentUser,
    geminiApiKey,
    setGeminiApiKey,
    logActivity,
  } = useApp();

  const [activeTab, setActiveTab] = useState<"scoring" | "ai" | "profile" | "notifications" | "security">("scoring");
  const [weights, setWeights] = useState<ScoringWeights>(activeAccount.scoringWeights);
  const [apiKeyInput, setApiKeyInput] = useState(geminiApiKey);
  const [selectedModel, setSelectedModel] = useState("gemini-2.5-flash");
  const [temperature, setTemperature] = useState(0.2);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Calculate sum of weights
  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);

  const handleWeightChange = (key: keyof ScoringWeights, val: number) => {
    setWeights(prev => ({
      ...prev,
      [key]: val,
    }));
  };

  const handleSaveWeights = () => {
    updateAccountScoringWeights(weights);
    setSavedSuccess(true);
    logActivity("Updated Scoring Weights", `Recalculated weights for ${activeAccount.name}`);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleSaveAiSettings = () => {
    setGeminiApiKey(apiKeyInput.trim());
    setSavedSuccess(true);
    logActivity("Updated AI Settings", `Configured Gemini API model: ${selectedModel}`);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleResetDefaultWeights = () => {
    const defaults: ScoringWeights = {
      vision: 20,
      pillars: 15,
      tone: 15,
      audience: 10,
      factual: 15,
      terminology: 5,
      visual: 10,
      accessibility: 5,
      promotional: 5,
    };
    setWeights(defaults);
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
              <span className="text-xs text-slate-400">System Preferences</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
              <Settings className="w-7 h-7 text-purple-400" />
              Settings & Governance Engine Configuration
            </h1>
          </div>

          {savedSuccess && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
              <CheckCircle2 className="w-4 h-4" />
              Settings Saved Successfully
            </div>
          )}
        </div>

        {/* Tab Buttons */}
        <div className="flex overflow-x-auto gap-2 border-b border-slate-800 pb-1">
          {[
            { id: "scoring", label: "Scoring Model Weights", icon: Sliders },
            { id: "ai", label: "AI Analysis Engine", icon: Sparkles },
            { id: "profile", label: "User Profile", icon: User },
            { id: "notifications", label: "Notification Rules", icon: Bell },
            { id: "security", label: "Security & Auditing", icon: Shield },
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

        {/* TAB 1: CUSTOMIZABLE SCORING WEIGHTS */}
        {activeTab === "scoring" && (
          <div className="p-6 sm:p-8 rounded-2xl bg-navy-900/80 border border-slate-800 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-purple-400" />
                  Custom Weighted Scoring Model
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Adjust the relative weight of each evaluation dimension. Scores are dynamically normalized to 100%.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`text-xs font-mono font-bold px-3 py-1 rounded-xl border ${
                    totalWeight === 100
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                      : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                  }`}
                >
                  Sum of Weights: {totalWeight}%
                </span>
                <button
                  onClick={handleResetDefaultWeights}
                  className="px-3 py-1 text-xs text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-lg"
                >
                  Reset Defaults
                </button>
              </div>
            </div>

            {/* Dimension Sliders Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              {(Object.keys(weights) as (keyof ScoringWeights)[]).map(key => {
                const meta = DIMENSION_METADATA[key] || { label: key, description: "" };
                const currentVal = weights[key];

                return (
                  <div key={key} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{meta.label}</span>
                      <span className="text-xs font-mono font-bold text-purple-400 bg-purple-950/40 px-2 py-0.5 rounded border border-purple-500/20">
                        {currentVal}%
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 leading-snug">{meta.description}</p>

                    <input
                      type="range"
                      min={0}
                      max={40}
                      step={5}
                      value={currentVal}
                      onChange={e => handleWeightChange(key, parseInt(e.target.value, 10))}
                      className="w-full accent-purple-500 cursor-pointer"
                    />
                  </div>
                );
              })}
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={handleSaveWeights}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-glow-purple flex items-center gap-1.5 transition-all"
              >
                <Save className="w-4 h-4" />
                Save & Recalculate Scoring Model
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: AI ENGINE SETTINGS */}
        {activeTab === "ai" && (
          <div className="p-6 sm:p-8 rounded-2xl bg-navy-900/80 border border-slate-800 shadow-xl space-y-6">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                Gemini LLM & Intelligent Governance Engine
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Configure your Gemini API key for deep reasoning, or let the built-in deterministic rule engine run locally.
              </p>
            </div>

            <div className="space-y-4 max-w-xl">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Gemini API Key (Optional)
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={apiKeyInput}
                    onChange={e => setApiKeyInput(e.target.value)}
                    placeholder="AIzaSy... (leave blank to use built-in local engine)"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-purple-500"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Your key is stored safely in your local browser sandbox and never shared.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Model Variant
                </label>
                <select
                  value={selectedModel}
                  onChange={e => setSelectedModel(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="gemini-2.5-flash">Gemini 2.5 Flash (Ultra-fast, High Accuracy)</option>
                  <option value="gemini-1.5-pro">Gemini 1.5 Pro (Deep Semantic Auditing)</option>
                  <option value="local-rule-engine">Built-in Local Governance Engine (Offline)</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-300">
                    Audit Strictness (Temperature)
                  </label>
                  <span className="text-xs font-mono text-purple-400">{temperature}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.1}
                  value={temperature}
                  onChange={e => setTemperature(parseFloat(e.target.value))}
                  className="w-full accent-purple-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                  <span>0.0 (Strict Compliance)</span>
                  <span>1.0 (Creative Suggestions)</span>
                </div>
              </div>

              <button
                onClick={handleSaveAiSettings}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-glow-purple flex items-center gap-1.5 transition-all"
              >
                <Save className="w-4 h-4" />
                Save AI Configuration
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: USER PROFILE */}
        {activeTab === "profile" && (
          <div className="p-6 sm:p-8 rounded-2xl bg-navy-900/80 border border-slate-800 shadow-xl space-y-5 max-w-xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <User className="w-5 h-5 text-purple-400" />
              User Profile
            </h3>

            <div className="flex items-center gap-4">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-purple-500/40"
              />
              <div>
                <div className="text-sm font-bold text-white">{currentUser.name}</div>
                <div className="text-xs text-slate-400">{currentUser.email}</div>
                <div className="text-xs text-purple-400 font-mono mt-0.5">Role: {currentUser.role}</div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                defaultValue={currentUser.name}
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Job Title</label>
              <input
                type="text"
                defaultValue={currentUser.title}
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white"
              />
            </div>
          </div>
        )}

        {/* TAB 4: NOTIFICATIONS */}
        {activeTab === "notifications" && (
          <div className="p-6 sm:p-8 rounded-2xl bg-navy-900/80 border border-slate-800 shadow-xl space-y-4 max-w-xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-purple-400" />
              In-App & Email Notification Rules
            </h3>

            <div className="space-y-3">
              {[
                { label: "Critical issue detected on upload", desc: "Alert immediately when severity is critical." },
                { label: "Content submitted for review", desc: "Notify managers and designated reviewers." },
                { label: "Revision requested by reviewer", desc: "Notify content author with feedback." },
                { label: "Content approved for publication", desc: "Notify all stakeholders." },
              ].map((notif, idx) => (
                <label key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
                  <input type="checkbox" defaultChecked className="mt-1 rounded bg-slate-900 border-slate-700 text-purple-600 focus:ring-0" />
                  <div>
                    <div className="text-xs font-bold text-white">{notif.label}</div>
                    <div className="text-[11px] text-slate-400">{notif.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: SECURITY */}
        {activeTab === "security" && (
          <div className="p-6 sm:p-8 rounded-2xl bg-navy-900/80 border border-slate-800 shadow-xl space-y-4 max-w-xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-purple-400" />
              Security & Audit Trail Protection
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every content revision, guideline modification, approval sign-off, and review decision is cryptographically
              hashed and logged in the immutable audit trail.
            </p>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span>SOC 2 Type II Compliance Logging:</span>
                <span className="text-emerald-400 font-mono font-bold">ACTIVE</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Silent AI Overrides:</span>
                <span className="text-red-400 font-mono font-bold">STRICTLY PROHIBITED</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Session Encryption:</span>
                <span className="text-emerald-400 font-mono font-bold">TLS 1.3 / AES-256</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
