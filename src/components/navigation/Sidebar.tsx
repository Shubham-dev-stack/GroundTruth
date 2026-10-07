'use client';

import React from 'react';
import { useGroundTruth } from '@/context/GroundTruthContext';
import { 
  Compass, 
  ClipboardCheck, 
  FileText, 
  History, 
  MapPin, 
  Globe,
  Radio,
  Layers
} from 'lucide-react';

export function Sidebar() {
  const { 
    geoScope, 
    setGeoScope, 
    activeView, 
    setActiveView, 
    fieldReports, 
    activityLog,
    drillIntoState
  } = useGroundTruth();

  const navItems = [
    {
      id: 'command',
      label: 'Overview',
      icon: Compass,
      badge: null,
    },
    {
      id: 'field',
      label: 'Verification',
      icon: ClipboardCheck,
      badge: 'Field',
    },
    {
      id: 'reports',
      label: 'Evidence',
      icon: FileText,
      badge: fieldReports.length > 0 ? fieldReports.length : null,
    },
    {
      id: 'reports_view',
      label: 'Reports',
      icon: Layers,
      badge: null,
    },
    {
      id: 'audit',
      label: 'Audit',
      icon: History,
      badge: activityLog.length > 0 ? activityLog.length : null,
    },
  ];

  return (
    <aside className="w-[60px] md:w-[64px] bg-[#070B12] border-r border-[#263244] flex flex-col items-center py-4 select-none h-screen shrink-0 z-30">
      {/* Brand Icon (GroundTruth Leaf/Compass) */}
      <div 
        onClick={() => setGeoScope('national')}
        className="w-10 h-10 rounded-[8px] bg-[#0D1420] border border-[#263244] hover:border-[#D7FF65] flex items-center justify-center cursor-pointer transition-all duration-200 group mb-6 shadow-sm"
        title="GroundTruth National Overview"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-[#D7FF65] group-hover:scale-125 transition-transform" />
      </div>

      {/* Scope Toggles: Globe (India) vs MapPin (Maharashtra) */}
      <div className="flex flex-col space-y-2 mb-6">
        <button
          onClick={() => {
            setGeoScope('national');
            setActiveView('command');
          }}
          className={`w-10 h-10 rounded-[8px] flex items-center justify-center transition-all ${
            geoScope === 'national' && activeView === 'command'
              ? 'bg-[#111927] border border-[#D7FF65] text-[#D7FF65] shadow-xs'
              : 'text-[#8D98A8] hover:text-[#F4F7FA] hover:bg-[#0D1420]'
          }`}
          title="India National Spatial Overview"
        >
          <Globe className="w-5 h-5" />
        </button>

        <button
          onClick={() => drillIntoState('MH')}
          className={`w-10 h-10 rounded-[8px] flex items-center justify-center transition-all relative ${
            geoScope === 'state' && activeView === 'command'
              ? 'bg-[#111927] border border-[#55D6A0] text-[#55D6A0] shadow-xs'
              : 'text-[#8D98A8] hover:text-[#F4F7FA] hover:bg-[#0D1420]'
          }`}
          title="Maharashtra Active Pilot Operations"
        >
          <MapPin className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#55D6A0]" />
        </button>
      </div>

      <div className="w-6 h-[1px] bg-[#263244] mb-4" />

      {/* Navigation Icons */}
      <nav className="flex-1 flex flex-col space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = 
            (item.id === 'command' && activeView === 'command' && geoScope === 'state') ||
            (item.id === 'reports_view' && activeView === 'reports') ||
            (item.id === activeView && item.id !== 'command');

          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === 'reports_view') {
                  setActiveView('reports');
                } else {
                  setActiveView(item.id as any);
                }
                if (item.id !== 'command') {
                  setGeoScope('state');
                }
              }}
              className={`w-10 h-10 rounded-[8px] flex items-center justify-center transition-all relative group ${
                isActive
                  ? 'bg-[#111927] border border-[#263244] text-[#D7FF65]'
                  : 'text-[#8D98A8] hover:text-[#F4F7FA] hover:bg-[#0D1420]'
              }`}
              title={item.label}
            >
              <Icon className="w-4 h-4" />
              {item.badge !== null && (
                <span className="absolute -top-1 -right-1 text-[9px] font-mono px-1 rounded-full bg-[#263244] text-[#D7FF65] border border-[#263244]">
                  {item.badge}
                </span>
              )}

              {/* Tooltip on Hover */}
              <div className="absolute left-14 bg-[#0D1420] border border-[#263244] text-[#F4F7FA] text-[11px] font-medium px-2 py-1 rounded shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                {item.label}
              </div>
            </button>
          );
        })}
      </nav>

      {/* Bottom Live System Indicator */}
      <div className="flex flex-col items-center space-y-1 mt-auto">
        <div className="w-2 h-2 rounded-full bg-[#55D6A0] animate-pulse" title="System Operational" />
        <span className="text-[9px] font-mono text-[#8D98A8]">v0.3</span>
      </div>
    </aside>
  );
}
