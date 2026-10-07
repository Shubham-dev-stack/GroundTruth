'use client';

import React from 'react';
import { useGroundTruth } from '@/context/GroundTruthContext';
import { 
  FileText, 
  MapPin, 
  CheckCircle2, 
  Camera, 
  User,
  ArrowLeft
} from 'lucide-react';

export function EvidencePanel() {
  const { fieldReports, setActiveView, selectUnit, setGeoScope } = useGroundTruth();

  return (
    <div className="flex-1 bg-[#070B12] p-6 overflow-y-auto text-[#F4F7FA]">
      <div className="max-w-5xl mx-auto space-y-4">
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
                Ground Evidence & Field Inspection Records
              </h2>
            </div>
            <p className="text-xs text-[#8D98A8] mt-0.5 ml-7">
              Cryptographically timestamped field reports updating GroundTruth epistemic calibration
            </p>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 bg-[#0D1420] border border-[#263244] rounded text-[#D7FF65]">
            {fieldReports.length} Reports Logged
          </span>
        </div>

        {/* Reports Feed */}
        {fieldReports.length === 0 ? (
          <div className="p-12 text-center text-[#8D98A8] text-xs font-mono bg-[#0D1420] rounded-[8px] border border-[#263244]">
            No field reports submitted yet. Use the field verification form to log observations.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fieldReports.map((report) => (
              <div
                key={report.id}
                className="bg-[#0D1420] border border-[#263244] rounded-[8px] p-4 space-y-3 text-xs"
              >
                <div className="flex items-start justify-between border-b border-[#263244] pb-2">
                  <div>
                    <div className="font-bold text-[#F4F7FA] font-mono flex items-center space-x-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#FF5A52]" />
                      <span>{report.unitName}</span>
                    </div>
                    <div className="text-[11px] text-[#8D98A8] font-mono">{report.district} District • {report.timestamp}</div>
                  </div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#55D6A0]/15 text-[#55D6A0] border border-[#55D6A0]/40">
                    <CheckCircle2 className="w-3 h-3 mr-1" /> VERIFIED
                  </span>
                </div>

                {/* Evidence Indicators */}
                <div className="grid grid-cols-3 gap-2 bg-[#070B12] p-2.5 rounded-[6px] border border-[#263244] text-[10px] font-mono">
                  <div>
                    <span className="text-[#8D98A8] block uppercase">Crop</span>
                    <span className={`font-bold ${report.cropCondition === 'Severe' ? 'text-[#FF5A52]' : 'text-[#F4F7FA]'}`}>
                      {report.cropCondition}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#8D98A8] block uppercase">Water</span>
                    <span className={`font-bold ${report.waterStatus === 'Shortage' ? 'text-[#FF5A52]' : 'text-[#55D6A0]'}`}>
                      {report.waterStatus}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#8D98A8] block uppercase">Fodder</span>
                    <span className={`font-bold ${report.fodderStatus === 'Shortage' ? 'text-[#F4B740]' : 'text-[#55D6A0]'}`}>
                      {report.fodderStatus}
                    </span>
                  </div>
                </div>

                {/* Notes */}
                <div className="text-[#F4F7FA] text-xs leading-relaxed bg-[#070B12] p-2.5 rounded border border-[#263244]/60">
                  <span className="text-[#D7FF65] font-mono font-bold">Notes: </span>
                  {report.notes}
                </div>

                {/* Photo & Officer Meta */}
                <div className="flex items-center justify-between pt-1 text-[11px] text-[#8D98A8] font-mono">
                  <div className="flex items-center space-x-1.5 truncate max-w-[180px]">
                    <User className="w-3 h-3 text-[#D7FF65]" />
                    <span className="truncate">{report.officer}</span>
                  </div>
                  {report.photoFileName && (
                    <div className="flex items-center space-x-1 text-[#D7FF65] bg-[#111927] px-2 py-0.5 rounded border border-[#263244]">
                      <Camera className="w-3 h-3" />
                      <span className="text-[10px] truncate max-w-[120px]">
                        {report.photoFileName}
                      </span>
                    </div>
                  )}
                </div>

                <div className="pt-1">
                  <button
                    onClick={() => {
                      setGeoScope('state');
                      selectUnit(report.unitId);
                      setActiveView('command');
                    }}
                    className="text-xs text-[#D7FF65] hover:underline font-mono"
                  >
                    View location on workspace map →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
