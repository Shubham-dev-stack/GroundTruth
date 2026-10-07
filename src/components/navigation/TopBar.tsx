'use client';

import React from 'react';
import { useGroundTruth } from '@/context/GroundTruthContext';
import { ChevronRight, Radio } from 'lucide-react';

export function TopBar() {
  const { geoScope, setGeoScope, drillIntoState } = useGroundTruth();

  return (
    <header className="h-12 bg-[#070B12]/95 backdrop-blur-md border-b border-[#263244] px-4 flex items-center justify-between shrink-0 select-none z-20">
      {/* Left: Brand + Spatial Breadcrumbs */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-[#D7FF65]" />
          <span className="font-bold tracking-wider text-sm font-mono text-[#F4F7FA]">
            GROUNDTRUTH
          </span>
        </div>

        <span className="text-[#263244]">|</span>

        {/* Spatial Breadcrumbs */}
        <div className="flex items-center space-x-1.5 text-xs">
          <button
            onClick={() => setGeoScope('national')}
            className={`transition-colors font-mono ${
              geoScope === 'national' ? 'text-[#D7FF65] font-semibold' : 'text-[#8D98A8] hover:text-[#F4F7FA]'
            }`}
          >
            India
          </button>
          <ChevronRight className="w-3 h-3 text-[#263244]" />
          <button
            onClick={() => drillIntoState('MH')}
            className={`transition-colors font-mono ${
              geoScope === 'state' ? 'text-[#55D6A0] font-semibold' : 'text-[#8D98A8] hover:text-[#F4F7FA]'
            }`}
          >
            Maharashtra
          </button>
          <ChevronRight className="w-3 h-3 text-[#263244]" />
          <span className="text-[#F4F7FA] font-mono">Operations</span>
        </div>
      </div>

      {/* Center: Subtle Operational Loop Indicator */}
      <div className="hidden lg:flex items-center space-x-1.5 text-[10px] font-mono text-[#8D98A8] bg-[#0D1420] border border-[#263244] px-3 py-1 rounded-full">
        <span>SIGNAL</span>
        <span className="text-[#263244]">→</span>
        <span>PRIORITIZE</span>
        <span className="text-[#263244]">→</span>
        <span className="text-[#D7FF65] font-bold">VERIFY</span>
        <span className="text-[#263244]">→</span>
        <span>UPDATE</span>
        <span className="text-[#263244]">→</span>
        <span>RE-PLAN</span>
      </div>

      {/* Right: Telemetry Time + Mode Status */}
      <div className="flex items-center space-x-4 text-xs font-mono">
        <div className="flex items-center space-x-1.5 text-[#8D98A8]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#55D6A0] animate-pulse" />
          <span>Real-time Telemetry</span>
        </div>

        <span className="text-[#F4F7FA] font-mono text-[11px] hidden sm:inline">
          07 Oct 2026
        </span>

        {/* Prototype Pill */}
        <div className="flex items-center space-x-1.5 bg-[#0D1420] border border-[#263244] px-2.5 py-0.5 rounded-[6px] text-[10px] text-[#D7FF65]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D7FF65]" />
          <span className="font-semibold uppercase tracking-wider">Prototype Mode</span>
        </div>
      </div>
    </header>
  );
}
