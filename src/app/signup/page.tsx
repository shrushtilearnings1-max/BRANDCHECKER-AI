"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { ShieldCheck, UserCheck, Lock, Mail, Building } from "lucide-react";
import { UserRole } from "@/types";

export default function SignupPage() {
  const router = useRouter();
  const { switchUserRole } = useApp();
  const [name, setName] = useState("Alex Morgan");
  const [email, setEmail] = useState("alex@enterprise.com");
  const [org, setOrg] = useState("Horizon Media");
  const [role, setRole] = useState<UserRole>("ADMIN");

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    switchUserRole(role);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
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
          Create an enterprise workspace
        </h2>
        <p className="mt-2 text-xs text-slate-400">
          Already have an account?{" "}
          <Link href="/login" className="text-purple-400 hover:text-purple-300 font-medium">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="bg-navy-900/90 py-8 px-6 sm:px-8 border border-slate-800 rounded-2xl shadow-2xl">
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300">Work Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300">Organization Name</label>
              <input
                type="text"
                value={org}
                onChange={e => setOrg(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300">Primary Role</label>
              <select
                value={role}
                onChange={e => setRole(e.target.value as UserRole)}
                className="mt-1 w-full py-2 px-3 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500"
              >
                <option value="ADMIN">ADMIN (Workspace Owner)</option>
                <option value="MANAGER">MANAGER (Brand & Review Lead)</option>
                <option value="CREATOR">CREATOR (Content Author)</option>
                <option value="REVIEWER">REVIEWER (Compliance Auditor)</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full mt-4 flex justify-center py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-glow-purple transition-all active:scale-95"
            >
              Get Started with Brandchecker
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
