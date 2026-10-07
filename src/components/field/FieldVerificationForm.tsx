'use client';

import React, { useState } from 'react';
import { useGroundTruth } from '@/context/GroundTruthContext';
import { 
  Camera, 
  MapPin, 
  CheckCircle, 
  AlertCircle,
  X,
  Radio,
  FileText
} from 'lucide-react';
import { CropCondition, WaterStatus, FodderStatus } from '@/types';

export function FieldVerificationForm() {
  const { 
    units, 
    selectedUnit, 
    selectUnit, 
    submitFieldVerification, 
    setActiveView 
  } = useGroundTruth();

  const activeUnit = selectedUnit || units[0];

  const [cropCondition, setCropCondition] = useState<CropCondition>('Severe');
  const [waterStatus, setWaterStatus] = useState<WaterStatus>('Shortage');
  const [fodderStatus, setFodderStatus] = useState<FodderStatus>('Shortage');
  const [notes, setNotes] = useState(
    'Ground transect inspection shows acute moisture stress in Kharif pulse and oilseed plots. Village open well levels depleted; tanker demand confirmed by Gram Panchayat.'
  );
  const [officerName, setOfficerName] = useState(
    activeUnit.assignedOfficerName || 'P. M. Jadhav (Taluka Agri Officer)'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage('Transmitting ground evidence & updating epistemic state...');

    setTimeout(() => {
      submitFieldVerification({
        unitId: activeUnit.id,
        officer: officerName,
        cropCondition,
        waterStatus,
        fodderStatus,
        notes,
        photoFileName: 'IMG_20261007_Plot_Transect.jpg',
      });
      setIsSubmitting(false);
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#070B12]/80 backdrop-blur-md flex items-center justify-center p-4">
      {/* Mobile-First Tactical Inspection Modal */}
      <div className="w-full max-w-lg bg-[#0D1420] rounded-[10px] shadow-2xl border border-[#263244] overflow-hidden flex flex-col max-h-[92vh] text-[#F4F7FA]">
        {/* Modal Header */}
        <div className="p-4 border-b border-[#263244] flex items-center justify-between bg-[#070B12]">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#D7FF65]" />
            <h2 className="text-[16px] font-bold font-mono tracking-tight text-[#F4F7FA]">
              Field Verification
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#111927] text-[#D7FF65] border border-[#263244]">
              Mobile Unit
            </span>
          </div>
          <button
            onClick={() => setActiveView('command')}
            className="text-[#8D98A8] hover:text-[#F4F7FA] p-1 rounded hover:bg-[#111927] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Location Target Banner */}
        <div className="px-4 py-3 bg-[#070B12] border-b border-[#263244] flex items-center justify-between text-xs">
          <div>
            <div className="text-[10px] font-mono text-[#8D98A8] uppercase">Target Location</div>
            <div className="font-bold text-[#F4F7FA] font-mono flex items-center space-x-1.5 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-[#FF5A52]" />
              <span>{activeUnit.name} ({activeUnit.district})</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-mono text-[#8D98A8] uppercase">Uncertainty</span>
            <div className="font-mono font-bold text-[#FF5A52]">{activeUnit.uncertainty}%</div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 overflow-y-auto space-y-4 text-xs flex-1">
          {/* Target Location switcher */}
          <div>
            <label className="block text-[11px] font-mono uppercase text-[#8D98A8] mb-1">
              Select Inspection Unit:
            </label>
            <select
              value={activeUnit.id}
              onChange={(e) => selectUnit(e.target.value)}
              className="w-full p-2 border border-[#263244] rounded-[6px] bg-[#070B12] text-[#F4F7FA] font-mono text-xs focus:outline-none focus:border-[#D7FF65]"
            >
              {units.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.status}) — Uncert: {u.uncertainty}%
                </option>
              ))}
            </select>
          </div>

          {/* Officer */}
          <div>
            <label className="block text-[11px] font-mono uppercase text-[#8D98A8] mb-1">
              Reporting Field Officer:
            </label>
            <input
              type="text"
              value={officerName}
              onChange={(e) => setOfficerName(e.target.value)}
              className="w-full p-2 border border-[#263244] rounded-[6px] bg-[#070B12] text-[#F4F7FA] font-mono text-xs focus:outline-none focus:border-[#D7FF65]"
              required
            />
          </div>

          {/* Radio Option 1: Crop Condition */}
          <div>
            <label className="block text-[11px] font-mono uppercase text-[#F4F7FA] mb-1.5">
              Crop Moisture Condition
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Normal', 'Moderate', 'Severe'] as const).map((cond) => (
                <label
                  key={cond}
                  className={`flex items-center justify-center p-2 rounded-[6px] border cursor-pointer text-xs font-mono transition-colors ${
                    cropCondition === cond
                      ? cond === 'Severe'
                        ? 'border-[#FF5A52] bg-[#FF5A52]/20 text-[#FF5A52] font-bold'
                        : cond === 'Moderate'
                        ? 'border-[#F4B740] bg-[#F4B740]/20 text-[#F4B740] font-bold'
                        : 'border-[#55D6A0] bg-[#55D6A0]/20 text-[#55D6A0] font-bold'
                      : 'border-[#263244] bg-[#070B12] text-[#8D98A8] hover:border-slate-500'
                  }`}
                >
                  <input
                    type="radio"
                    name="cropCondition"
                    value={cond}
                    checked={cropCondition === cond}
                    onChange={() => setCropCondition(cond)}
                    className="sr-only"
                  />
                  <span>{cond}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Radio Option 2: Drinking Water */}
          <div>
            <label className="block text-[11px] font-mono uppercase text-[#F4F7FA] mb-1.5">
              Drinking Water Availability
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['Available', 'Shortage'] as const).map((water) => (
                <label
                  key={water}
                  className={`flex items-center justify-center p-2 rounded-[6px] border cursor-pointer text-xs font-mono transition-colors ${
                    waterStatus === water
                      ? water === 'Shortage'
                        ? 'border-[#FF5A52] bg-[#FF5A52]/20 text-[#FF5A52] font-bold'
                        : 'border-[#55D6A0] bg-[#55D6A0]/20 text-[#55D6A0] font-bold'
                      : 'border-[#263244] bg-[#070B12] text-[#8D98A8] hover:border-slate-500'
                  }`}
                >
                  <input
                    type="radio"
                    name="waterStatus"
                    value={water}
                    checked={waterStatus === water}
                    onChange={() => setWaterStatus(water)}
                    className="sr-only"
                  />
                  <span>{water === 'Shortage' ? 'Acute Shortage' : 'Adequate'}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Radio Option 3: Fodder */}
          <div>
            <label className="block text-[11px] font-mono uppercase text-[#F4F7FA] mb-1.5">
              Cattle Fodder Situation
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['Available', 'Shortage'] as const).map((fodder) => (
                <label
                  key={fodder}
                  className={`flex items-center justify-center p-2 rounded-[6px] border cursor-pointer text-xs font-mono transition-colors ${
                    fodderStatus === fodder
                      ? fodder === 'Shortage'
                        ? 'border-[#F4B740] bg-[#F4B740]/20 text-[#F4B740] font-bold'
                        : 'border-[#55D6A0] bg-[#55D6A0]/20 text-[#55D6A0] font-bold'
                      : 'border-[#263244] bg-[#070B12] text-[#8D98A8] hover:border-slate-500'
                  }`}
                >
                  <input
                    type="radio"
                    name="fodderStatus"
                    value={fodder}
                    checked={fodderStatus === fodder}
                    onChange={() => setFodderStatus(fodder)}
                    className="sr-only"
                  />
                  <span>{fodder}</span>
                </label>
              ))}
            </div>
          </div>

          {/* TextArea for notes */}
          <div>
            <label className="block text-[11px] font-mono uppercase text-[#8D98A8] mb-1">
              Field Notes
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2 border border-[#263244] rounded-[6px] bg-[#070B12] text-[#F4F7FA] text-xs focus:outline-none focus:border-[#D7FF65]"
              placeholder="Record ground observations, well depletion, farmer reports..."
              required
            />
          </div>

          {/* Placeholder for Photo */}
          <div>
            <label className="block text-[11px] font-mono uppercase text-[#8D98A8] mb-1">
              Geotagged Photo Evidence
            </label>
            <div className="w-full h-20 bg-[#070B12] border border-[#263244] rounded-[6px] flex flex-col items-center justify-center text-[#8D98A8] space-y-1">
              <Camera className="w-4 h-4 text-[#D7FF65]" />
              <span className="text-[10px] font-mono">Geotagged Transect Lock: ±3.2m EXIF Verified</span>
            </div>
          </div>

          {statusMessage && (
            <div className="p-2 bg-[#111927] border border-[#D7FF65] text-[#D7FF65] rounded-[6px] text-xs font-mono flex items-center space-x-1.5">
              <AlertCircle className="w-3.5 h-3.5 animate-spin" />
              <span>{statusMessage}</span>
            </div>
          )}

          {/* Buttons: Submit (Lime) and Cancel */}
          <div className="pt-2 border-t border-[#263244] flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={() => setActiveView('command')}
              className="px-4 py-2 border border-[#263244] rounded-[6px] text-[#8D98A8] hover:text-white font-mono text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-[#D7FF65] hover:bg-[#cbf552] text-[#070B12] rounded-[6px] font-bold text-xs font-mono shadow-md flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{isSubmitting ? 'Transmitting...' : 'Submit Verification'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
