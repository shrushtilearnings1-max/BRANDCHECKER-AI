"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { ShieldCheck, ArrowRight, UserCheck, Lock, Mail } from "lucide-react";
import { UserRole } from "@/types";
import { RoleBadge } from "@/components/common/Badge";

export default function LoginPage() {
  const router = useRouter();
  const { switchUserRole } = useApp();
  const [email, setEmail] = useState("elena@brandchecker.ai");
  const [password, setPassword] = useState("••••••••••••");
  const [selectedRole, setSelectedRole] = useState<UserRole>("ADMIN");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    switchUserRole(selectedRole);
    router.push("/dashboard");
  };

  const handleQuickDemoLogin = (role: UserRole) => {
    switchUserRole(role);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        <Link href="/" className="inline-flex items-center gap-2.5 mb-6 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 p-0.5 flex items-center justify-center shadow-glow-purple">
            <div className="w-full h-full bg-navy-950 rounded-[10px] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-purple-400" />
            </div>
          </div>
          <span className="text-xl font-bold tracking-tight text-white font-mono">
            BRANDCHECKER<span className="text-purple-400">.AI</span>
          </span>
        </Link>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Sign in to your governance account
        </h2>
        <p className="mt-2 text-xs text-slate-400">
          Or{" "}
          <Link href="/signup" className="text-purple-400 hover:text-purple-300 font-medium">
            create a new organization profile
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="bg-navy-900/90 py-8 px-6 sm:px-8 border border-slate-800 rounded-2xl shadow-2xl space-y-6">
          {/* Quick Persona Selector for Judges & Reviewers */}
          <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5" />
                1-Click Demo Login By Role:
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { role: "ADMIN" as UserRole, name: "Elena (Admin)", desc: "Full permissions" },
                { role: "MANAGER" as UserRole, name: "Marcus (Mgr)", desc: "Approvals & team" },
                { role: "CREATOR" as UserRole, name: "Sophia (Creator)", desc: "Upload & Studio" },
                { role: "REVIEWER" as UserRole, name: "David (Reviewer)", desc: "Audits & feedback" },
              ].map(item => (
                <button
                  key={item.role}
                  type="button"
                  onClick={() => handleQuickDemoLogin(item.role)}
                  className="flex flex-col items-start p-2 rounded-lg bg-slate-900/80 border border-slate-700/80 hover:border-purple-500/60 hover:bg-purple-950/40 text-left transition-all group"
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs font-bold text-white group-hover:text-purple-300">
                      {item.name}
                    </span>
                    <RoleBadge role={item.role} />
                  </div>
                  <span className="text-[10px] text-slate-400">{item.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300">Email Address</label>
              <div className="mt-1 relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="block w-full pl-9 pr-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-xs font-medium text-slate-300">Password</label>
                <a href="#" className="text-[11px] text-purple-400 hover:text-purple-300">
                  Forgot password?
                </a>
              </div>
              <div className="mt-1 relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="block w-full pl-9 pr-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Account Role Simulation
              </label>
              <select
                value={selectedRole}
                onChange={e => setSelectedRole(e.target.value as UserRole)}
                className="w-full py-2 px-3 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500"
              >
                <option value="ADMIN">ADMIN - Full organization & guideline authority</option>
                <option value="MANAGER">MANAGER - Account manager & approver</option>
                <option value="CREATOR">CREATOR - Content author & editor</option>
                <option value="REVIEWER">REVIEWER - Quality auditor & compliance reviewer</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-glow-purple transition-all active:scale-95"
            >
              Sign In to Platform
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
