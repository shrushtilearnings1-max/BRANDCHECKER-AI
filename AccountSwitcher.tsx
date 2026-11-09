"use client";

import React, { useState, useRef, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { ChevronDown, Plus, Check, ShieldCheck, Building2 } from "lucide-react";
import Link from "next/link";

export function AccountSwitcher() {
  const { accounts, activeAccount, setActiveAccount } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-2 rounded-xl bg-slate-900/90 border border-slate-800/80 hover:border-purple-500/40 hover:bg-slate-850 transition-all text-left group"
      >
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-8 h-8 rounded-lg overflow-hidden bg-purple-950/60 border border-purple-500/30 flex-shrink-0 flex items-center justify-center font-bold text-xs text-purple-300">
            {activeAccount.logo ? (
              <img src={activeAccount.logo} alt={activeAccount.name} className="w-full h-full object-cover" />
            ) : (
              <Building2 className="w-4 h-4 text-purple-400" />
            )}
          </div>
          <div className="truncate">
            <div className="text-xs font-semibold text-white truncate flex items-center gap-1.5">
              <span>{activeAccount.name}</span>
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
            </div>
            <div className="text-[10px] text-slate-400 truncate">
              {activeAccount.industry || "Brand Governance"}
            </div>
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-400 group-hover:text-white transition-transform flex-shrink-0 ml-1 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1.5 z-50 rounded-xl bg-navy-900 border border-slate-700/80 shadow-2xl p-1.5 space-y-1">
          <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Switch Brand Account
          </div>
          {accounts.map(acc => {
            const isSelected = acc.id === activeAccount.id;
            return (
              <button
                key={acc.id}
                onClick={() => {
                  setActiveAccount(acc.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs transition-all ${
                  isSelected
                    ? "bg-purple-600/20 text-purple-200 border border-purple-500/30 font-medium"
                    : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <div className="w-5 h-5 rounded overflow-hidden bg-slate-800 flex items-center justify-center text-[10px] text-slate-400 font-bold flex-shrink-0">
                    {acc.name.slice(0, 1)}
                  </div>
                  <span className="truncate">{acc.name}</span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />}
              </button>
            );
          })}

          <div className="pt-1 border-t border-slate-800">
            <Link
              href="/setup"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-medium text-purple-400 hover:text-purple-300 hover:bg-purple-950/40 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create New Account</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
