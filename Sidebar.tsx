"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { AccountSwitcher } from "./AccountSwitcher";
import { RoleBadge } from "./src/components/common/Badge";
import {
  LayoutDashboard,
  Building2,
  BookOpen,
  UploadCloud,
  FileSearch,
  Sparkles,
  CheckSquare,
  History,
  BarChart3,
  Users2,
  Settings,
  ShieldCheck,
  ChevronRight,
  UserCheck,
} from "lucide-react";
import { UserRole } from "@/types";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/accounts", label: "My Accounts", icon: Building2 },
  { href: "/guidelines", label: "Brand Guidelines", icon: BookOpen },
  { href: "/upload", label: "Upload Content", icon: UploadCloud, highlight: true },
  { href: "/reports", label: "Analysis Reports", icon: FileSearch },
  { href: "/studio", label: "Improvement Studio", icon: Sparkles },
  { href: "/approval", label: "Approval Centre", icon: CheckSquare },
  { href: "/history", label: "Content History", icon: History },
  { href: "/analytics", label: "Analytics & Insights", icon: BarChart3 },
  { href: "/team", label: "Team Management", icon: Users2 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar({ className = "" }: { className?: string }) {
  const pathname = usePathname();
  const { currentUser, switchUserRole } = useApp();

  const roles: UserRole[] = ["ADMIN", "MANAGER", "CREATOR", "REVIEWER"];

  return (
    <aside
      className={`w-64 flex flex-col bg-navy-950/90 border-r border-slate-800/80 backdrop-blur-xl h-screen sticky top-0 z-40 select-none ${className}`}
    >
      {/* Brand & Logo Header */}
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 p-0.5 flex items-center justify-center shadow-glow-purple">
            <div className="w-full h-full bg-navy-950 rounded-[10px] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div>
            <span className="text-sm font-bold tracking-tight text-white flex items-center gap-1 font-mono">
              BRANDCHECKER<span className="text-purple-400">.AI</span>
            </span>
            <span className="block text-[10px] text-slate-400 font-medium">
              Governance Platform
            </span>
          </div>
        </Link>
      </div>

      {/* Account Switcher Widget */}
      <div className="p-3 border-b border-slate-800/60">
        <AccountSwitcher />
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
        {NAV_ITEMS.map(item => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group ${
                isActive
                  ? "bg-purple-600/20 text-purple-200 border border-purple-500/40 shadow-glow-purple"
                  : item.highlight
                  ? "text-purple-300 hover:bg-purple-950/30 hover:text-white"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/60"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive
                      ? "text-purple-400"
                      : item.highlight
                      ? "text-purple-400"
                      : "text-slate-500 group-hover:text-slate-300"
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {isActive && (
                <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User & Role Switcher Footer */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-900/40 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-7 h-7 rounded-full object-cover border border-purple-500/40 flex-shrink-0"
            />
            <div className="truncate">
              <div className="text-xs font-semibold text-white truncate leading-none mb-0.5">
                {currentUser.name}
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                {currentUser.title}
              </div>
            </div>
          </div>
          <RoleBadge role={currentUser.role} />
        </div>

        {/* Quick Role Tester Bar for Reviewers/Hackathon Demo */}
        <div className="pt-2 border-t border-slate-800/60">
          <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1 flex items-center justify-between">
            <span>Simulate Role:</span>
            <UserCheck className="w-3 h-3 text-purple-400" />
          </div>
          <div className="grid grid-cols-4 gap-1">
            {roles.map(r => (
              <button
                key={r}
                onClick={() => switchUserRole(r)}
                className={`py-1 text-[10px] font-bold rounded-lg border transition-all text-center ${
                  currentUser.role === r
                    ? "bg-purple-600 text-white border-purple-500 shadow-sm"
                    : "bg-slate-800/60 text-slate-400 border-slate-700/60 hover:text-white hover:bg-slate-800"
                }`}
                title={`Simulate ${r} permissions`}
              >
                {r.slice(0, 3)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
