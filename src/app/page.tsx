'use client';

import React from 'react';
import { useGroundTruth } from '@/context/GroundTruthContext';
import { Sidebar } from '@/components/navigation/Sidebar';
import { TopBar } from '@/components/navigation/TopBar';
import { IndiaGlobe } from '@/components/geo/IndiaGlobe';
import { MaharashtraMap } from '@/components/geo/MaharashtraMap';
import { VerificationQueue } from '@/components/queue/VerificationQueue';
import { UnitDrawer } from '@/components/detail/UnitDrawer';
import { ActivityTimeline } from '@/components/audit/ActivityTimeline';
import { FieldVerificationForm } from '@/components/field/FieldVerificationForm';
import { EvidencePanel } from '@/components/evidence/EvidencePanel';
import { AuditScreen } from '@/components/audit/AuditScreen';

export default function Home() {
  const { geoScope, activeView } = useGroundTruth();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#070B12] text-[#F4F7FA] font-sans antialiased">
      {/* Compact Tactical Left Rail (60-64px) */}
      <Sidebar />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Top Technical Bar */}
        <TopBar />

        {/* Dynamic Viewport */}
        {activeView === 'command' && (
          <>
            {/* LEVEL 1: 3D SATELLITE INDIA GLOBE OVERVIEW */}
            {geoScope === 'national' && <IndiaGlobe />}

            {/* LEVEL 2: MAHARASHTRA TACTICAL OPERATIONS WORKSPACE */}
            {geoScope === 'state' && (
              <div className="flex-1 flex flex-col overflow-hidden relative">
                {/* Center Workspace: Maharashtra Map (~65-75%) + Verification Queue (~25-35%) */}
                <div className="flex-1 flex overflow-hidden relative">
                  <MaharashtraMap />
                  <VerificationQueue />

                  {/* Contextual Unit Drawer (~380-420px) — Slides in ONLY on selection */}
                  <UnitDrawer />
                </div>

                {/* Bottom Horizontal Activity Stream */}
                <ActivityTimeline />
              </div>
            )}
          </>
        )}

        {/* Dedicated Operational Views */}
        {activeView === 'field' && <FieldVerificationForm />}
        {activeView === 'reports' && <EvidencePanel />}
        {activeView === 'audit' && <AuditScreen />}
      </div>
    </div>
  );
}
