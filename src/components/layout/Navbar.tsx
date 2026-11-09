"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { NotificationDropdown } from "./NotificationDropdown";
import { RoleBadge } from "../common/Badge";
import {
  UploadCloud,
  Menu,
  X,
  Sparkles,
  Key,
  ShieldAlert,
  ChevronRight,
} from "lucide-react";

export function Navbar({ onMobileMenuToggle }: { onMobileMenuToggle?: () => void }) {
  const pathname = usePathname();
  const { activeAccount, currentUser, geminiApiKey } = useApp();

  const getBreadcrumb = () => {
    const parts = pathname.split("/").filter(Boolean);
    if (parts.length === 0 || parts[0] === "dashboard") return "Overview";
    const title = parts[0].replace(/-/g, " ");
    return title.charAt(0).toUpperCase() + title.slice(1);
  };

  return (
    <header className="h-16 border-b border-slate-800/80 bg-navy-950/80 backdrop-blur-xl px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Mobile hamburger & breadcrumbs */}
      <div className="flex items-center gap-3">
        {onMobileMenuToggle && (
          <button
            onClick={onMobileMenuToggle}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white md:hidden"
            aria-label="Toggle navigation"
          >
            <Menu className="w-4 h-4" />
          </button>
        )}

        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-white">{activeAccount.name}</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-slate-400 font-medium capitalize">{getBreadcrumb()}</span>
        </div>
      </div>

      {/* Right: Actions, AI indicator, Notifications & User Role */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Gemini Engine Status Pill */}
        <Link
          href="/settings"
          className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 hover:border-purple-500/40 text-[11px] text-slate-300 transition-colors"
          title={geminiApiKey ? "Gemini 2.5 API Key Configured" : "Operating on Intelligent Local Rule Engine"}
        >
          <Sparkles className="w-3 h-3 text-purple-400" />
          <span>{geminiApiKey ? "Gemini LLM Connected" : "Local Governance Engine"}</span>
        </Link>

        {/* Upload Button */}
        <Link
          href="/upload"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-glow-purple transition-all active:scale-95"
        >
          <UploadCloud className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Upload Content</span>
        </Link>

        {/* In-app Notification Dropdown */}
        <NotificationDropdown />

        {/* Current User Role Pill */}
        <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-800">
          <RoleBadge role={currentUser.role} />
        </div>
      </div>
    </header>
  );
}
