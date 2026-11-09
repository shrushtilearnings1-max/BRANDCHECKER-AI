"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useApp } from "@/context/AppContext";
import {
  Users2,
  UserPlus,
  ShieldCheck,
  Building2,
  Mail,
  CheckCircle2,
  Clock,
  MoreVertical,
  Trash2,
  Lock,
} from "lucide-react";
import { RoleBadge } from "@/components/common/Badge";
import { User, UserRole } from "@/types";
import { StorageService } from "@/lib/storage";

export default function TeamManagementPage() {
  const { activeAccount, currentUser, accounts, logActivity } = useApp();
  const [users, setUsers] = useState<User[]>(StorageService.getUsers());

  // Invite Member Modal State
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<UserRole>("CREATOR");
  const [inviteTitle, setInviteTitle] = useState("");

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) return;

    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: inviteName.trim(),
      email: inviteEmail.trim(),
      role: inviteRole,
      avatar: `https://images.unsplash.com/photo-${1534528741775 + users.length * 1000}?w=150&auto=format&fit=crop&q=80`,
      title: inviteTitle.trim() || `${inviteRole.toLowerCase()} member`,
      assignedAccounts: [activeAccount.id],
    };

    setUsers(prev => [...prev, newUser]);
    logActivity("Invited Team Member", `Invited ${newUser.name} as ${newUser.role}`);
    setShowInviteModal(false);
    setInviteName("");
    setInviteEmail("");
    setInviteTitle("");
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
                Workspace Governance
              </span>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs text-slate-400">Role-Based Access Control</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
              <Users2 className="w-7 h-7 text-purple-400" />
              Team & Permissions
            </h1>
          </div>

          <button
            onClick={() => setShowInviteModal(true)}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-glow-purple flex items-center gap-1.5 transition-all active:scale-95"
          >
            <UserPlus className="w-4 h-4" />
            Invite Member
          </button>
        </div>

        {/* Roles & Permissions Breakdown Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { role: "ADMIN" as UserRole, desc: "Full permissions: configure guidelines, edit scoring weights, manage teams & sign off." },
            { role: "MANAGER" as UserRole, desc: "Manage assigned accounts, inspect reports, assign reviewers, and approve submissions." },
            { role: "CREATOR" as UserRole, desc: "Upload copy/assets, run AI analyses, modify drafts in Studio, and submit for review." },
            { role: "REVIEWER" as UserRole, desc: "Inspect analyses, add public & internal notes, request revisions, approve or reject." },
          ].map(r => (
            <div key={r.role} className="p-4 rounded-xl bg-navy-900/60 border border-slate-800 space-y-2">
              <RoleBadge role={r.role} />
              <p className="text-[11px] text-slate-400 leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>

        {/* Team Members Table */}
        <div className="p-6 rounded-2xl bg-navy-900/80 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Active Team Members ({users.length})</h3>
            <span className="text-xs text-slate-400">Account: {activeAccount.name}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                  <th className="pb-3 font-semibold">User</th>
                  <th className="pb-3 font-semibold">Role</th>
                  <th className="pb-3 font-semibold">Job Title</th>
                  <th className="pb-3 font-semibold">Assigned Brands</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {users.map(user => (
                  <tr key={user.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 pr-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-8 h-8 rounded-full object-cover border border-slate-700"
                        />
                        <div>
                          <div className="font-semibold text-white">{user.name}</div>
                          <div className="text-[10px] text-slate-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5">
                      <RoleBadge role={user.role} />
                    </td>
                    <td className="py-3.5 text-slate-300 font-medium">{user.title}</td>
                    <td className="py-3.5 text-slate-400">
                      <div className="flex flex-wrap gap-1">
                        {user.assignedAccounts.map(aid => {
                          const acc = accounts.find(a => a.id === aid);
                          return (
                            <span key={aid} className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
                              {acc?.name || aid}
                            </span>
                          );
                        })}
                      </div>
                    </td>
                    <td className="py-3.5">
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Active
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      <button className="text-slate-500 hover:text-white p-1">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Invite Modal */}
        {showInviteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <div className="w-full max-w-md p-6 rounded-2xl bg-navy-900 border border-slate-700 shadow-2xl space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-purple-400" />
                Invite Team Member
              </h3>
              <p className="text-xs text-slate-400">
                Grant access to {activeAccount.name} with designated governance permissions.
              </p>

              <form onSubmit={handleInvite} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={inviteName}
                    onChange={e => setInviteName(e.target.value)}
                    required
                    placeholder="e.g. Maya Lin"
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Work Email</label>
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={e => setInviteEmail(e.target.value)}
                    required
                    placeholder="maya@company.com"
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Job Title</label>
                  <input
                    type="text"
                    value={inviteTitle}
                    onChange={e => setInviteTitle(e.target.value)}
                    placeholder="e.g. Lead Copywriter"
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Assigned Role</label>
                  <select
                    value={inviteRole}
                    onChange={e => setInviteRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white"
                  >
                    <option value="ADMIN">ADMIN - Full permissions</option>
                    <option value="MANAGER">MANAGER - Approvals & accounts</option>
                    <option value="CREATOR">CREATOR - Upload & studio</option>
                    <option value="REVIEWER">REVIEWER - Quality reviews</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowInviteModal(false)}
                    className="px-3.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md"
                  >
                    Send Invitation
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
