"use client";

import React from "react";
import { getScoreTier } from "@/lib/scoring";

interface CircularScoreProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  showTierLabel?: boolean;
  animate?: boolean;
  className?: string;
}

export function CircularScore({
  score,
  size = 120,
  strokeWidth = 10,
  showTierLabel = true,
  className = "",
}: CircularScoreProps) {
  const normalized = Math.max(0, Math.min(100, Math.round(score)));
  const tier = getScoreTier(normalized);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalized / 100) * circumference;

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="w-full h-full -rotate-90 transform" viewBox={`0 0 ${size} ${size}`}>
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-slate-800"
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={tier.color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
            fill="transparent"
            style={{
              filter: `drop-shadow(0 0 6px ${tier.color}66)`,
            }}
          />
        </svg>

        {/* Inner number */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-bold tracking-tight text-white font-mono">
            {normalized}%
          </span>
          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">
            Alignment
          </span>
        </div>
      </div>

      {showTierLabel && (
        <div className="mt-2 text-center">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${tier.badgeBg} ${tier.badgeBorder} ${tier.badgeText}`}
          >
            {tier.label}
          </span>
        </div>
      )}
    </div>
  );
}
