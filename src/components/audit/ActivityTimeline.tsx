'use client';

import React from 'react';
import { useGroundTruth } from '@/context/GroundTruthContext';
import { 
  CheckCircle2, 
  RefreshCw, 
  UserCheck, 
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';

export function ActivityTimeline() {
  const { activityLog, setActiveView } = useGroundTruth();

  const getIcon = (type: string) => {
    switch (type) {
      case 'FIELD_REPORT':
        return <CheckCircle2 className="w-3.5 h-3.5 text-[#55D6A0]" />;
      case 'CONFIDENCE_UPDATE':
        return <RefreshCw className="w-3.5 h-3.5 text-[#D7FF65]" />;
      case 'ASSIGNMENT':
        return <UserCheck className="w-3.5 h-3.5 text-[#F4B740]" />;
      case 'QUEUE_RECALCULATED':
        return <RefreshCw className="w-3.5 h-3.5 text-[#38BDF8]" />;
      default:
        return <Calendar className="w-3.5 h-3.5 text-[#8D98A8]" />;
    }
  };

  return (
    <div className="h-14 border-t border-[#263244] bg-[#070B12] flex items-center px-4 justify-between shrink-0 select-none z-10 text-xs">
      {/* Activity Feed Label with Live indicator */}
      <div className="flex items-center space-x-3 shrink-0">
        <div className="flex items-center space-x-1.5 font-mono text-[11px] font-bold text-[#F4F7FA]">
          <span className="w-2 h-2 rounded-full bg-[#55D6A0] animate-pulse" />
          <span>Activity & Audit Stream</span>
        </div>
        <span className="text-[#263244]">|</span>
      </div>

      {/* Horizontal Recent Event Feed (Matching Visual Reference Bottom Bar) */}
      <div className="flex-1 overflow-x-auto no-scrollbar flex items-center space-x-6 px-4">
        {activityLog.slice(0, 4).map((entry, idx) => (
          <div key={entry.id} className="flex items-center space-x-2 shrink-0 font-mono text-[11px]">
            <span className="text-[#8D98A8] text-[10px]">{entry.timestamp}</span>
            <div className="shrink-0">{getIcon(entry.type)}</div>
            <span className="text-[#F4F7FA] font-medium truncate max-w-[280px]">
              {entry.message}
            </span>
          </div>
        ))}
      </div>

      {/* View All Button */}
      <div className="shrink-0 pl-2">
        <button
          onClick={() => setActiveView('audit')}
          className="text-[11px] font-mono text-[#D7FF65] hover:underline flex items-center space-x-1"
        >
          <span>View All</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
