'use client';

import React, { useState } from 'react';
import { useGroundTruth } from '@/context/GroundTruthContext';
import { 
  X, 
  Send, 
  FileCheck, 
  CloudRain, 
  Sprout, 
  Droplets, 
  Users,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export function UnitDrawer() {
  const { 
    selectedUnit, 
    isDrawerOpen,
    closeDrawer,
    assignVerification, 
    setActiveView 
  } = useGroundTruth();

  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedSquad, setSelectedSquad] = useState('Field Squad Marathwada 01');
  const [officerName, setOfficerName] = useState('S. S. Shinde (Taluka Agri Officer)');

  if (!isDrawerOpen || !selectedUnit) {
    return null;
  }

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    assignVerification(selectedUnit.id, selectedSquad, officerName);
    setShowAssignModal(false);
  };

  return (
    <div 
      className="fixed inset-y-0 right-0 w-[380px] lg:w-[420px] max-w-[90vw] bg-[#0D1420] border-l border-[#263244] shadow-2xl z-40 flex flex-col drawer-slide-in select-none text-[#F4F7FA]"
    >
      {/* Drawer Header (Matching Visual Target Right Panel) */}
      <div className="p-4 border-b border-[#263244] flex items-start justify-between bg-[#070B12]">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#D7FF65]" />
            <h3 className="text-base font-bold text-[#F4F7FA] font-mono leading-tight">
              {selectedUnit.name}
            </h3>
          </div>
          <div className="text-[12px] text-[#8D98A8] mt-0.5 font-mono">
            {selectedUnit.district} District • {selectedUnit.division}
          </div>
        </div>
        <button
          onClick={closeDrawer}
          className="text-[#8D98A8] hover:text-[#F4F7FA] p-1 rounded hover:bg-[#111927] transition-colors"
          title="Close Inspection Drawer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Drawer Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {/* Status & Priority Badge Bar */}
        <div className="flex items-center justify-between p-3 bg-[#070B12] rounded-[8px] border border-[#263244]">
          <div>
            <span className="text-[10px] text-[#8D98A8] font-mono uppercase block">Verification Status</span>
            <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold mt-1 ${
              selectedUnit.status === 'VERIFIED'
                ? 'bg-[#55D6A0]/20 text-[#55D6A0] border border-[#55D6A0]/40'
                : selectedUnit.status === 'ASSIGNED'
                ? 'bg-[#F4B740]/20 text-[#F4B740] border border-[#F4B740]/40'
                : 'bg-[#FF5A52]/20 text-[#FF5A52] border border-[#FF5A52]/40'
            }`}>
              <span>{selectedUnit.status}</span>
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-[#8D98A8] font-mono uppercase block">Calculated Priority</span>
            <span className="text-sm font-bold font-mono text-[#D7FF65]">
              {selectedUnit.priorityScore} / 100
            </span>
          </div>
        </div>

        {/* 3 Metric Readouts: Stress, Confidence, Uncertainty */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-[#070B12] p-2.5 rounded-[6px] border border-[#263244]">
            <span className="text-[10px] text-[#8D98A8] font-mono uppercase block">Stress</span>
            <span className="text-lg font-bold font-mono text-[#FF5A52]">{selectedUnit.stress}</span>
          </div>
          <div className="bg-[#070B12] p-2.5 rounded-[6px] border border-[#263244]">
            <span className="text-[10px] text-[#8D98A8] font-mono uppercase block">Confidence</span>
            <span className="text-lg font-bold font-mono text-[#55D6A0]">{selectedUnit.confidence}%</span>
          </div>
          <div className="bg-[#070B12] p-2.5 rounded-[6px] border border-[#263244]">
            <span className="text-[10px] text-[#8D98A8] font-mono uppercase block">Uncertainty</span>
            <span className="text-lg font-bold font-mono text-[#8D98A8]">{selectedUnit.uncertainty}%</span>
          </div>
        </div>

        {/* Stepped Progress Indicator for Evidence */}
        <div className="space-y-1.5 p-3 rounded-[8px] border border-[#263244] bg-[#070B12]">
          <div className="flex justify-between items-center text-[11px] font-mono">
            <span className="text-[#8D98A8] uppercase">Evidence Confidence</span>
            <span className="text-[#55D6A0] font-bold">{selectedUnit.confidence}%</span>
          </div>
          <div className="w-full bg-[#111927] h-2.5 rounded-[4px] overflow-hidden flex border border-[#263244]">
            <div 
              className="h-full bg-[#55D6A0] fill-transition"
              style={{ width: `${selectedUnit.confidence}%` }}
            />
            <div 
              className="h-full bg-[#263244] fill-transition"
              style={{ width: `${selectedUnit.uncertainty}%` }}
            />
          </div>
          <div className="text-[10px] font-mono text-[#8D98A8] pt-0.5">
            {selectedUnit.status === 'VERIFIED' ? 'Ground-truth evidence verified by field squad' : 'Field verification pending — satellite inference only'}
          </div>
        </div>

        {/* Section: WHY PRIORITIZED (Matching Target Reference) */}
        <div className="p-3 bg-[#070B12] border border-[#263244] rounded-[8px] space-y-2">
          <div className="text-[11px] font-mono font-bold text-[#D7FF65] uppercase tracking-wider flex items-center space-x-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Why Prioritized</span>
          </div>
          <div className="space-y-1.5 text-[11px] text-[#8D98A8]">
            {selectedUnit.whyPrioritized.map((reason, idx) => (
              <div key={idx} className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D7FF65] mt-1 shrink-0" />
                <span className="leading-snug">{reason}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Operational Indicators */}
        <div className="space-y-2.5 p-3 rounded-[8px] border border-[#263244] bg-[#070B12]">
          <div className="text-[11px] font-mono font-bold text-[#F4F7FA] uppercase border-b border-[#263244] pb-1">
            Biophysical Telemetry
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-[#8D98A8]">Rainfall Deficit Index</span>
              <span className="font-mono text-[#FF5A52] font-bold">{selectedUnit.rainfallStress}%</span>
            </div>
            <div className="w-full bg-[#111927] h-1.5 rounded overflow-hidden">
              <div className="h-full bg-[#FF5A52]" style={{ width: `${selectedUnit.rainfallStress}%` }} />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-[#8D98A8]">Vegetation Deficit (NDVI)</span>
              <span className="font-mono text-[#F4B740] font-bold">{selectedUnit.vegStress}%</span>
            </div>
            <div className="w-full bg-[#111927] h-1.5 rounded overflow-hidden">
              <div className="h-full bg-[#F4B740]" style={{ width: `${selectedUnit.vegStress}%` }} />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-[#8D98A8]">Water Storage Deficit</span>
              <span className="font-mono text-[#F4B740] font-bold">{selectedUnit.waterContext}%</span>
            </div>
            <div className="w-full bg-[#111927] h-1.5 rounded overflow-hidden">
              <div className="h-full bg-[#F4B740]" style={{ width: `${selectedUnit.waterContext}%` }} />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-[#8D98A8]">Agrarian Population Exposure</span>
              <span className="font-mono text-[#F4F7FA] font-bold">{selectedUnit.exposure}%</span>
            </div>
            <div className="w-full bg-[#111927] h-1.5 rounded overflow-hidden">
              <div className="h-full bg-[#38BDF8]" style={{ width: `${selectedUnit.exposure}%` }} />
            </div>
          </div>
        </div>

        {/* Assigned Team Info */}
        {selectedUnit.assignedTeam && (
          <div className="p-2.5 bg-[#070B12] border border-[#263244] rounded-[8px] text-[11px] space-y-0.5 font-mono">
            <div className="text-[9px] uppercase text-[#8D98A8]">Assigned Squad</div>
            <div className="font-bold text-[#F4F7FA]">{selectedUnit.assignedTeam}</div>
            <div className="text-[#8D98A8]">Officer: {selectedUnit.assignedOfficerName || 'Officer assigned'}</div>
          </div>
        )}
      </div>

      {/* Footer CTA: Lime Accent Button matching reference */}
      <div className="p-3 border-t border-[#263244] bg-[#070B12] space-y-2 shrink-0">
        {selectedUnit.status === 'VERIFIED' ? (
          <div className="flex items-center justify-center space-x-2 py-2 px-3 bg-[#55D6A0]/15 text-[#55D6A0] border border-[#55D6A0]/40 rounded-[6px] font-mono text-xs font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Field Verified & Ground-Truthed</span>
          </div>
        ) : (
          <button
            onClick={() => setShowAssignModal(true)}
            className="w-full flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-[6px] bg-[#D7FF65] hover:bg-[#cbf552] text-[#070B12] font-bold text-xs transition-colors shadow-md cursor-pointer"
          >
            <span>{selectedUnit.status === 'ASSIGNED' ? 'Re-assign Squad' : 'Assign Verification'}</span>
          </button>
        )}

        <div className="flex space-x-2">
          <button
            onClick={() => {
              closeDrawer();
              setActiveView('field');
            }}
            className="flex-1 flex items-center justify-center space-x-1 py-1.5 px-3 rounded-[6px] border border-[#263244] bg-[#111927] hover:bg-[#162235] text-[#F4F7FA] text-xs font-mono transition-colors"
          >
            <Send className="w-3.5 h-3.5 text-[#D7FF65]" />
            <span>Open Field Form</span>
          </button>

          <button
            onClick={() => {
              closeDrawer();
              setActiveView('reports');
            }}
            className="flex-1 flex items-center justify-center space-x-1 py-1.5 px-3 rounded-[6px] border border-[#263244] bg-[#111927] hover:bg-[#162235] text-[#8D98A8] hover:text-white text-xs font-mono transition-colors"
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>View Evidence</span>
          </button>
        </div>
      </div>

      {/* Assignment Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0D1420] rounded-[8px] shadow-2xl border border-[#263244] max-w-sm w-full p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-[#263244] pb-2">
              <h4 className="font-bold text-[#F4F7FA] text-xs font-mono">Assign Verification Squad</h4>
              <button onClick={() => setShowAssignModal(false)} className="text-[#8D98A8] hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAssignSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] font-mono uppercase text-[#8D98A8] mb-1">Target Location</label>
                <div className="p-2 bg-[#070B12] rounded border border-[#263244] text-[#F4F7FA] font-mono">
                  {selectedUnit.name} ({selectedUnit.district})
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-[#8D98A8] mb-1">Squad Dispatch</label>
                <select
                  value={selectedSquad}
                  onChange={(e) => setSelectedSquad(e.target.value)}
                  className="w-full p-2 border border-[#263244] rounded bg-[#070B12] text-[#F4F7FA] font-mono text-xs focus:outline-none"
                >
                  <option value="Field Squad Marathwada 01">Field Squad Marathwada 01 (Latur)</option>
                  <option value="Field Squad Marathwada 02">Field Squad Marathwada 02 (Jalna/Beed)</option>
                  <option value="Vidarbha Rapid Agri Cell">Vidarbha Rapid Agri Cell (Amravati)</option>
                  <option value="Western Drought Taskforce">Western Drought Taskforce (Solapur)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-[#8D98A8] mb-1">Reporting Officer</label>
                <input
                  type="text"
                  value={officerName}
                  onChange={(e) => setOfficerName(e.target.value)}
                  className="w-full p-2 border border-[#263244] rounded bg-[#070B12] text-[#F4F7FA] font-mono text-xs focus:outline-none"
                  required
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-[#263244]">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="px-3 py-1.5 rounded border border-[#263244] text-[#8D98A8] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-[#D7FF65] text-[#070B12] font-bold"
                >
                  Confirm Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
