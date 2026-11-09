"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { useApp } from "@/context/AppContext";
import {
  UploadCloud,
  FileText,
  Image as ImageIcon,
  Sparkles,
  Save,
  CheckCircle2,
  AlertCircle,
  FileCode,
  Video,
} from "lucide-react";
import { ContentItem } from "@/types";
import { analyzeContentWithBrandRules } from "@/lib/analysis-engine";
import { extractAndVerifyClaims } from "@/lib/claim-trace";
import { simulatePersonaResonance } from "@/lib/persona-resonance";
import { calculateBrandDnaDrift } from "@/lib/drift-detector";
import { StorageService } from "@/lib/storage";

export default function UploadPage() {
  const router = useRouter();
  const {
    activeAccount,
    accounts,
    setActiveAccount,
    updateContentItem,
    currentUser,
    logActivity,
    geminiApiKey,
  } = useApp();

  // Form Fields
  const [title, setTitle] = useState("");
  const [selectedAccountId, setSelectedAccountId] = useState(activeAccount.id);
  const [category, setCategory] = useState("Product Announcement");
  const [targetPlatform, setTargetPlatform] = useState("LinkedIn");
  const [intendedAudience, setIntendedAudience] = useState(activeAccount.targetAudience);
  const [campaignName, setCampaignName] = useState("");
  const [publicationDate, setPublicationDate] = useState("");
  const [description, setDescription] = useState("");
  const [contentType, setContentType] = useState<
    "text" | "image" | "document" | "video" | "social_post" | "blog_article"
  >("social_post");

  const [rawContent, setRawContent] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    setUploadedFile(file);
    if (!title) {
      setTitle(file.name.replace(/\.[^/.]+$/, ""));
    }

    // If text or markdown file, read contents into editor
    if (file.type.includes("text") || file.name.endsWith(".txt") || file.name.endsWith(".md")) {
      const reader = new FileReader();
      reader.onload = e => {
        if (e.target?.result) {
          setRawContent(e.target.result as string);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleAnalyze = async () => {
    if (!title.trim()) {
      setErrorMessage("Please enter a content title.");
      return;
    }
    if (!rawContent.trim() && !uploadedFile) {
      setErrorMessage("Please enter content text or upload a media file.");
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(25);

    const targetAccount = accounts.find(a => a.id === selectedAccountId) || activeAccount;

    // Simulate upload progress
    await new Promise(r => setTimeout(r, 400));
    setUploadProgress(65);

    const contentId = `cnt-${Date.now()}`;
    const reportId = `rep-${Date.now()}`;

    // Run AI analysis
    const report = await analyzeContentWithBrandRules(
      {
        content: rawContent || `[Uploaded media file: ${uploadedFile?.name}]`,
        title,
        account: targetAccount,
        category,
        targetPlatform,
        intendedAudience,
        contentType,
        hasVisualAsset: !!uploadedFile && uploadedFile.type.startsWith("image/"),
      },
      geminiApiKey
    );

    report.id = reportId;
    report.contentId = contentId;
    report.contentVersion = 1;

    // Run ClaimTrace Intelligent Claim Verification
    const claimTraceReport = extractAndVerifyClaims({
      content: rawContent || `[Uploaded media file: ${uploadedFile?.name}]`,
      title,
      account: targetAccount,
      contentId,
    });
    report.claimTrace = claimTraceReport;
    StorageService.saveClaimTraceReport(claimTraceReport);

    // Run Audience Persona Resonance Simulation
    const personaResonanceReport = simulatePersonaResonance({
      content: rawContent || `[Uploaded media file: ${uploadedFile?.name}]`,
      targetAudience: intendedAudience,
      account: targetAccount,
      contentId,
    });
    report.personaResonance = personaResonanceReport;
    StorageService.savePersonaResonanceReport(personaResonanceReport);

    StorageService.saveReport(report);

    setUploadProgress(90);

    const newContentItem: ContentItem = {
      id: contentId,
      accountId: targetAccount.id,
      title,
      category,
      targetPlatform,
      intendedAudience,
      campaignName,
      publicationDate,
      description,
      contentType,
      fileName: uploadedFile?.name,
      fileSize: uploadedFile ? `${(uploadedFile.size / 1024).toFixed(1)} KB` : undefined,
      rawContent,
      status: report.overallScore < 70 ? "needs_improvement" : "analysis_completed",
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorRole: currentUser.role,
      currentVersion: 1,
      latestScore: report.overallScore,
      latestReportId: reportId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      versions: [
        {
          versionNumber: 1,
          createdAt: new Date().toISOString(),
          content: rawContent,
          title,
          changeSummary: "Initial content submission.",
          analysisReportId: reportId,
          alignmentScore: report.overallScore,
        },
      ],
    };

    updateContentItem(newContentItem);
    
    // Recalculate Brand DNA Drift with the newly added item
    const allItems = StorageService.getContentItems();
    const updatedDrift = calculateBrandDnaDrift(targetAccount, allItems);
    StorageService.saveDriftReport(updatedDrift);

    logActivity("Uploaded & Analysed Content", `Uploaded "${title}" - Score: ${report.overallScore}%`);

    setUploadProgress(100);
    router.push(`/reports/${reportId}`);
  };

  const handleSaveDraft = () => {
    if (!title.trim()) {
      setErrorMessage("Please enter a title for the draft.");
      return;
    }

    const contentId = `cnt-${Date.now()}`;
    const targetAccount = accounts.find(a => a.id === selectedAccountId) || activeAccount;

    const draftItem: ContentItem = {
      id: contentId,
      accountId: targetAccount.id,
      title,
      category,
      targetPlatform,
      intendedAudience,
      campaignName,
      publicationDate,
      description,
      contentType,
      fileName: uploadedFile?.name,
      fileSize: uploadedFile ? `${(uploadedFile.size / 1024).toFixed(1)} KB` : undefined,
      rawContent,
      status: "draft",
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorRole: currentUser.role,
      currentVersion: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      versions: [
        {
          versionNumber: 1,
          createdAt: new Date().toISOString(),
          content: rawContent,
          title,
          changeSummary: "Saved draft without analysis.",
        },
      ],
    };

    updateContentItem(draftItem);
    logActivity("Saved Content Draft", `Saved draft "${title}"`);
    router.push("/history");
  };

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
              Content Upload Centre
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            <UploadCloud className="w-7 h-7 text-purple-400" />
            Upload & Verify Content
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Submit marketing copy, articles, social posts, or design assets. The AI engine will test the content
            against the selected brand profile.
          </p>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Progress Bar when uploading */}
        {isSubmitting && (
          <div className="p-4 rounded-xl bg-navy-900 border border-purple-500/30 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-purple-300 font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 animate-spin text-purple-400" />
                Analyzing against {activeAccount.name} guidelines...
              </span>
              <span className="font-mono text-purple-400 font-bold">{uploadProgress}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        <div className="p-6 sm:p-8 rounded-2xl bg-navy-900/80 border border-slate-800 shadow-xl space-y-6">
          {/* Metadata Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                Content Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={e => {
                  setTitle(e.target.value);
                  setErrorMessage("");
                }}
                placeholder="e.g. Q4 Enterprise Architecture Announcement"
                className="w-full px-3.5 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                Target Brand Account *
              </label>
              <select
                value={selectedAccountId}
                onChange={e => {
                  setSelectedAccountId(e.target.value);
                  setActiveAccount(e.target.value);
                }}
                className="w-full px-3.5 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500"
              >
                {accounts.map(acc => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name} ({acc.industry})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                Content Category
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500"
              >
                <option value="Product Launch">Product Launch</option>
                <option value="Technical Architecture">Technical Architecture</option>
                <option value="Case Study">Case Study</option>
                <option value="Educational / How-To">Educational / How-To</option>
                <option value="Executive Commentary">Executive Commentary</option>
                <option value="Promotional Campaign">Promotional Campaign</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                Target Publishing Platform
              </label>
              <select
                value={targetPlatform}
                onChange={e => setTargetPlatform(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500"
              >
                <option value="LinkedIn">LinkedIn Post</option>
                <option value="Twitter/X">Twitter / X Post / Thread</option>
                <option value="Blog">Technical Blog Article</option>
                <option value="YouTube">YouTube Video Script / Description</option>
                <option value="Instagram">Instagram Caption / Carousel</option>
                <option value="Website">Website Landing Copy</option>
                <option value="Email">Customer Newsletter / Email</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                Intended Audience
              </label>
              <input
                type="text"
                value={intendedAudience}
                onChange={e => setIntendedAudience(e.target.value)}
                placeholder="e.g. Enterprise Engineering Directors"
                className="w-full px-3.5 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                Campaign Name (Optional)
              </label>
              <input
                type="text"
                value={campaignName}
                onChange={e => setCampaignName(e.target.value)}
                placeholder="e.g. Q4 Mesh Launch"
                className="w-full px-3.5 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Drag & Drop File Zone */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Attach Asset or Document (Images, PDF, DOCX, TXT)
            </label>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`p-6 rounded-2xl border-2 border-dashed text-center transition-all ${
                isDragging
                  ? "border-purple-500 bg-purple-950/30"
                  : "border-slate-800 bg-slate-950/60 hover:border-slate-700"
              }`}
            >
              <UploadCloud className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <div className="text-xs font-semibold text-white">
                Drag and drop your file here, or{" "}
                <label className="text-purple-400 hover:text-purple-300 cursor-pointer underline">
                  browse files
                  <input
                    type="file"
                    accept=".png,.jpg,.jpeg,.webp,.pdf,.docx,.txt"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                </label>
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Supported: PNG, JPG, WEBP, PDF, DOCX, TXT (Max 25MB)
              </div>

              {uploadedFile && (
                <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-950/50 border border-purple-500/30 text-xs text-purple-200">
                  <FileText className="w-4 h-4 text-purple-400" />
                  <span>{uploadedFile.name} ({(uploadedFile.size / 1024).toFixed(1)} KB)</span>
                  <button onClick={() => setUploadedFile(null)} className="text-slate-400 hover:text-white ml-2">
                    ×
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Text Content Editor */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Content Copy & Text Body *
              </label>
              <span className="text-[11px] text-slate-500 font-mono">
                {rawContent.length} characters • {rawContent.split(/\s+/).filter(Boolean).length} words
              </span>
            </div>
            <textarea
              rows={8}
              value={rawContent}
              onChange={e => {
                setRawContent(e.target.value);
                setErrorMessage("");
              }}
              placeholder="Paste draft copy, article, social caption, or transcript here for brand governance analysis..."
              className="w-full px-4 py-3 text-xs sm:text-sm bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 leading-relaxed font-sans"
            />
          </div>

          {/* Post-Upload Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-850 text-slate-300 text-xs font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save as Draft
            </button>

            <button
              type="button"
              onClick={handleAnalyze}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-glow-purple transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-purple-300" />
              <span>Analyse Content with AI</span>
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
