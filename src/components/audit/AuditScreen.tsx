'use client';

import React from 'react';
import { useGroundTruth } from '@/context/GroundTruthContext';
import { 
  History, 
  ArrowLeft
} from 'lucide-react';

export function AuditScreen() {
  const { activityLog, setActiveView } = useGroundTruth();

  const getBadge = (type: string) => {
    switch (type) {
      case 'FIELD_REPORT':
        return <span className="px-2 py-0.5 rounded bg-[#55D6A0]/20 text-[#55D6A0] border border-[#55D6A0]/40 font-mono text-[10px]">FIELD_REPORT</span>;
      case 'CONFIDENCE_UPDATE':
        return <span className="px-2 py-0.5 rounded bg-[#D7FF65]/20 text-[#D7FF65] border border-[#D7FF65]/40 font-mono text-[10px]">CONFIDENCE_UPDATE</span>;
      case 'ASSIGNMENT':
        return <span className="px-2 py-0.5 rounded bg-[#F4B740]/20 text-[#F4B740] border border-[#F4B740]/40 font-mono text-[10px]">ASSIGNMENT</span>;
      case 'QUEUE_RECALCULATED':
        return <span className="px-2 py-0.5 rounded bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/40 font-mono text-[10px]">QUEUE_RECALCULATED</span>;
      default:
        return <span className="px-2 py-0.5 rounded bg-[#263244] text-[#8D98A8] font-mono text-[10px]">SYSTEM</span>;
    }
  };

  return (
    <div className="flex-1 bg-[#070B12] p-6 overflow-y-auto text-[#F4F7FA]">
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#263244]">
          <div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setActiveView('command')}
                className="text-[#8D98A8] hover:text-white p-1 rounded hover:bg-[#111927]"
                title="Return to Command Center"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <h2 className="text-base font-bold font-mono text-[#F4F7FA]">
                Operational Audit & Epistemic Ledger
              </h2>
            </div>
            <p className="text-xs text-[#8D98A8] mt-0.5 ml-7 font-mono">
              Immutable sequence of field evidence dispatches, confidence calibrations, and queue updates
            </p>
          </div>
          <span className="text-xs font-mono text-[#D7FF65]">
            {activityLog.length} Records Ingested
          </span>
        </div>

        {/* Audit Table */}
        <div className="bg-[#0D1420] border border-[#263244] rounded-[8px] overflow-hidden">
          <div className="px-4 py-2 bg-[#070B12] border-b border-[#263244] flex items-center justify-between text-xs font-mono text-[#8D98A8]">
            <span>Timestamped Operational Ledger</span>
            <span>Real-time Stream</span>
          </div>

          <div className="divide-y divide-[#263244]/60 text-xs font-mono">
            {activityLog.map((log) => (
              <div key={log.id} className="p-3.5 hover:bg-[#111927] transition-colors flex items-start space-x-3">
                <span className="text-[#8D98A8] text-[10px] pt-0.5 shrink-0 w-12">
                  {log.timestamp}
                </span>

                <div className="shrink-0 pt-0.5">
                  {getBadge(log.type)}
                </div>

                <div className="flex-1 min-w-0 space-y-0.5">
                  <div className="font-bold text-[#F4F7FA] leading-snug">
                    {log.message}
                  </div>
                  {log.details && (
                    <div className="text-[#8D98A8] text-[11px]">
                      {log.details}
                    </div>
                  )}
                  {log.unitName && (
                    <div className="text-[10px] text-[#D7FF65]">
                      Unit ID: {log.unitId || 'N/A'} • {log.unitName}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
