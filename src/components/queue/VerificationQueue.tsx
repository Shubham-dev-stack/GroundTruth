'use client';

import React from 'react';
import { useGroundTruth } from '@/context/GroundTruthContext';
import { Search, ArrowUpDown, Filter } from 'lucide-react';

export function VerificationQueue() {
  const {
    units,
    selectedUnitId,
    selectUnit,
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    recentlyUpdatedUnitId,
    sortBy,
    setSortBy,
    sortOrder,
    toggleSortOrder
  } = useGroundTruth();

  const filteredUnits = units.filter((unit) => {
    if (statusFilter === 'CRITICAL' && unit.priorityLevel !== 'CRITICAL') return false;
    if (statusFilter === 'HIGH_UNCERTAINTY' && unit.uncertainty < 50) return false;
    if (statusFilter === 'PENDING' && unit.status !== 'PENDING') return false;
    if (statusFilter === 'ASSIGNED' && unit.status !== 'ASSIGNED') return false;
    if (statusFilter === 'VERIFIED' && unit.status !== 'VERIFIED') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = unit.name.toLowerCase().includes(q);
      const matchDistrict = unit.district.toLowerCase().includes(q);
      if (!matchName && !matchDistrict) return false;
    }

    return true;
  });

  return (
    <div className="w-[380px] lg:w-[420px] flex flex-col bg-[#0D1420] border-l border-[#263244] h-full shrink-0 select-none z-10">
      {/* Queue Header & Filter Controls (Matching Reference Table) */}
      <div className="p-3 border-b border-[#263244] space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h2 className="text-xs font-bold font-mono text-[#F4F7FA] uppercase tracking-wider">
              Verification Queue
            </h2>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#111927] text-[#D7FF65] border border-[#263244]">
              {filteredUnits.length}
            </span>
          </div>

          <div className="flex items-center space-x-1.5 text-[11px] font-mono text-[#8D98A8]">
            <span>Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#111927] border border-[#263244] rounded px-1.5 py-0.5 text-[#F4F7FA] text-[11px] focus:outline-none cursor-pointer"
            >
              <option value="priority">Priority</option>
              <option value="stress">Stress</option>
              <option value="uncertainty">Uncertainty</option>
              <option value="name">Name</option>
            </select>
          </div>
        </div>

        {/* Filter Badges */}
        <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar text-xs">
          {(
            [
              { key: 'ALL', label: 'All' },
              { key: 'CRITICAL', label: 'Critical' },
              { key: 'HIGH_UNCERTAINTY', label: 'Uncertain' },
              { key: 'PENDING', label: 'Pending' },
              { key: 'ASSIGNED', label: 'Assigned' },
              { key: 'VERIFIED', label: 'Verified' },
            ] as const
          ).map((f) => (
            <button
              key={f.key}
              onClick={() => setStatusFilter(f.key)}
              className={`px-2 py-0.5 rounded text-[10px] font-mono whitespace-nowrap transition-colors border ${
                statusFilter === f.key
                  ? 'bg-[#D7FF65] text-[#070B12] border-[#D7FF65] font-bold'
                  : 'bg-[#111927] text-[#8D98A8] border-[#263244] hover:text-[#F4F7FA]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-[#8D98A8] absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search talukas, districts..."
            className="w-full text-xs pl-8 pr-2.5 py-1.5 rounded-[6px] border border-[#263244] bg-[#070B12] text-[#F4F7FA] focus:outline-none focus:border-[#D7FF65] transition-colors"
          />
        </div>
      </div>

      {/* Dense Table Header */}
      <div className="bg-[#070B12] border-b border-[#263244] px-3 py-1.5 grid grid-cols-12 gap-1 text-[10px] font-mono text-[#8D98A8] uppercase tracking-wider shrink-0">
        <div className="col-span-2"># / Rank</div>
        <div className="col-span-4">Location</div>
        <div className="col-span-2 text-right">Stress</div>
        <div className="col-span-2 text-right">Uncert</div>
        <div className="col-span-2 text-right">Status</div>
      </div>

      {/* DataTable Body */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#263244]/60">
        {filteredUnits.length === 0 ? (
          <div className="p-8 text-center text-[#8D98A8] text-xs font-mono">
            No matching units in this filter.
          </div>
        ) : (
          filteredUnits.map((unit, index) => {
            const isSelected = selectedUnitId === unit.id;
            const isRecentlyUpdated = recentlyUpdatedUnitId === unit.id;

            return (
              <div
                key={unit.id}
                onClick={() => selectUnit(unit.id)}
                className={`h-[44px] px-3 grid grid-cols-12 gap-1 items-center cursor-pointer transition-colors duration-150 text-xs select-none ${
                  isSelected
                    ? 'bg-[#162235] border-l-2 border-l-[#D7FF65]'
                    : 'hover:bg-[#111927] border-l-2 border-l-transparent'
                } ${isRecentlyUpdated ? 'bg-[#55D6A0]/20 ring-1 ring-[#55D6A0] ring-inset duration-500' : ''}`}
              >
                {/* Priority */}
                <div className="col-span-2 font-mono font-bold text-[#F4F7FA] flex items-center space-x-1">
                  <span className="text-[#8D98A8] text-[11px]">#{String(index + 1).padStart(2, '0')}</span>
                </div>

                {/* Location */}
                <div className="col-span-4 truncate text-[#F4F7FA]">
                  <div className="font-semibold truncate leading-tight">{unit.name}</div>
                  <div className="text-[10px] text-[#8D98A8] truncate">{unit.district}</div>
                </div>

                {/* Stress Index */}
                <div className="col-span-2 text-right font-mono text-[11px]">
                  <span className={unit.stress >= 75 ? 'text-[#FF5A52] font-bold' : 'text-[#F4B740]'}>
                    {unit.stress}
                  </span>
                </div>

                {/* Uncertainty */}
                <div className="col-span-2 text-right font-mono text-[11px] text-[#8D98A8]">
                  {unit.uncertainty}%
                </div>

                {/* Status Pill */}
                <div className="col-span-2 flex justify-end">
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono uppercase font-bold border ${
                    unit.status === 'VERIFIED'
                      ? 'bg-[#55D6A0]/15 text-[#55D6A0] border-[#55D6A0]/40'
                      : unit.status === 'ASSIGNED'
                      ? 'bg-[#F4B740]/15 text-[#F4B740] border-[#F4B740]/40'
                      : 'bg-[#FF5A52]/15 text-[#FF5A52] border-[#FF5A52]/40'
                  }`}>
                    {unit.status === 'VERIFIED' ? 'VERIFIED' : unit.status === 'ASSIGNED' ? 'ACTIVE' : 'PENDING'}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
