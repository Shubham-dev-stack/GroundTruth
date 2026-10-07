'use client';

import React from 'react';
import Image from 'next/image';
import { useGroundTruth } from '@/context/GroundTruthContext';
import { 
  ArrowRight, 
  MapPin, 
  Satellite, 
  ShieldCheck, 
  ChevronRight
} from 'lucide-react';

export function IndiaGlobe() {
  const { drillIntoState } = useGroundTruth();

  return (
    <div className="flex-1 flex flex-col bg-[#050A12] relative overflow-hidden select-none h-full justify-between">
      {/* Background Ambience / Deep Oceanic Space Vignette */}
      <div 
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: 'radial-gradient(circle at 75% 50%, transparent 45%, rgba(5, 10, 18, 0.45) 75%, #050A12 100%)'
        }}
      />

      {/* Main Full-Height Viewport Container */}
      <div className="flex-1 flex flex-col lg:flex-row items-center relative z-10 w-full max-w-[1850px] mx-auto px-6 lg:px-14 py-4 lg:py-0 overflow-y-auto lg:overflow-hidden">
        
        {/* LEFT EDITORIAL CONTENT COLUMN (~38-40% Width) */}
        <div className="w-full lg:w-[38%] xl:w-[36%] flex flex-col justify-center space-y-5 lg:space-y-6 z-20 py-6 lg:py-0 shrink-0">
          
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center space-x-2 text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-[#D7FF65] bg-[#0D1420]/95 border border-[#263244] px-3 py-1 rounded-full w-fit shadow-md">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D7FF65] animate-ping" />
            <span>CLIMATE & DROUGHT INTELLIGENCE</span>
          </div>

          {/* Editorial Title */}
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl lg:text-[44px] xl:text-[48px] font-extrabold text-[#F4F7FA] tracking-tight leading-[1.12]">
              From Satellite Signals <br />
              to <span className="text-[#D7FF65] font-black">Ground Truth</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#8D98A8] leading-relaxed max-w-md pt-1 font-normal">
              GroundTruth helps disaster administrators identify where environmental signals indicate stress, where evidence is missing, and where field verification should happen next.
            </p>
          </div>

          {/* Compact Active Pilot System Annotation (Visually Light & Refined) */}
          <div className="p-3.5 bg-[#0D1420]/90 backdrop-blur-md border border-[#263244] rounded-[8px] space-y-2.5 max-w-sm shadow-md">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[10px] text-[#8D98A8] tracking-widest uppercase">ACTIVE PILOT</span>
              <span className="text-[10px] text-[#55D6A0] bg-[#55D6A0]/10 border border-[#55D6A0]/30 px-2 py-0.2 rounded font-bold">
                OPERATIONAL
              </span>
            </div>

            <div className="flex items-baseline justify-between border-b border-[#263244]/60 pb-2">
              <span className="text-base font-bold text-[#F4F7FA] font-mono tracking-wide">
                MAHARASHTRA
              </span>
              <span className="text-[11px] text-[#D7FF65] font-mono font-medium">
                Marathwada & Vidarbha
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-0.5">
              <div className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D7FF65]" />
                <span className="text-[#F4F7FA] font-semibold text-xs">12</span>
                <span className="text-[#8D98A8] text-[11px]">monitored units</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#55D6A0]" />
                <span className="text-[#F4F7FA] font-semibold text-xs">4</span>
                <span className="text-[#8D98A8] text-[11px]">field teams deployed</span>
              </div>
            </div>
          </div>

          {/* Primary Action Button */}
          <div className="flex items-center space-x-4 pt-1">
            <button
              onClick={() => drillIntoState('MH')}
              className="inline-flex items-center space-x-2.5 bg-[#D7FF65] hover:bg-[#cbf552] text-[#070B12] px-6 py-3 rounded-[8px] font-bold text-xs sm:text-sm tracking-wide transition-all shadow-xl hover:shadow-[0_0_25px_rgba(215,255,101,0.35)] group cursor-pointer"
            >
              <span className="font-mono">EXPLORE INDIA</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </button>

            <button
              onClick={() => drillIntoState('MH')}
              className="hidden sm:inline-flex items-center space-x-1.5 text-xs font-mono text-[#8D98A8] hover:text-[#F4F7FA] transition-colors py-2 px-3 border border-transparent hover:border-[#263244] rounded-[6px]"
            >
              <span>Maharashtra Ops</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Micro Telemetry Indicators */}
          <div className="flex items-center space-x-5 text-[10px] font-mono text-[#8D98A8] pt-1">
            <span className="flex items-center space-x-1.5">
              <Satellite className="w-3.5 h-3.5 text-[#55D6A0]" />
              <span>CHIRPS & MODIS Live Feed</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D7FF65]" />
              <span>Epistemic Queue Active</span>
            </span>
          </div>
        </div>

        {/* RIGHT HERO EARTH / INDIA MONUMENTAL VISUAL (~62-64% Width) */}
        <div className="w-full lg:w-[62%] xl:w-[64%] h-[420px] sm:h-[580px] lg:h-full flex items-center justify-center relative select-none overflow-hidden">
          
          {/* Monumental Scaling & Positioning Frame for Earth & India */}
          <div className="relative w-full h-full flex items-center justify-center">
            
            {/* Scaled Earth Image Asset with Subtle Celestial Float */}
            <div className="relative w-full h-full celestial-orbit-drift origin-center">
              <Image
                src="/images/groundtruth-india-hero.png"
                alt="Earth from orbit with India prominently illuminated and highlighted"
                fill
                priority
                className="object-cover lg:object-contain object-[70%_50%] lg:object-[68%_50%] filter contrast-[1.05] brightness-[0.98]"
                sizes="(max-width: 1024px) 100vw, 65vw"
              />

              {/* Seamless Edge Blends into #050A12 so no image edges are perceived */}
              {/* Left soft feather */}
              <div 
                className="absolute inset-y-0 left-0 w-36 lg:w-56 pointer-events-none hidden lg:block"
                style={{
                  background: 'linear-gradient(to right, #050A12 0%, rgba(5, 10, 18, 0.85) 50%, transparent 100%)'
                }}
              />
              {/* Top soft feather */}
              <div 
                className="absolute inset-x-0 top-0 h-24 lg:h-32 pointer-events-none"
                style={{
                  background: 'linear-gradient(to bottom, #050A12 0%, transparent 100%)'
                }}
              />
              {/* Bottom soft feather */}
              <div 
                className="absolute inset-x-0 bottom-0 h-28 lg:h-36 pointer-events-none"
                style={{
                  background: 'linear-gradient(to top, #050A12 0%, transparent 100%)'
                }}
              />
            </div>

            {/* Geographic Annotation Tag Pinned Directly onto Maharashtra */}
            <div 
              onClick={() => drillIntoState('MH')}
              className="absolute top-[51%] left-[51%] sm:left-[55%] lg:left-[58%] transform -translate-x-1/2 -translate-y-1/2 z-30 cursor-pointer group pointer-events-auto"
            >
              <div className="relative flex items-center space-x-2 bg-[#050A12]/90 backdrop-blur-md border border-[#D7FF65]/50 hover:border-[#D7FF65] px-3 py-2 rounded-[6px] shadow-2xl transition-all duration-300 group-hover:scale-105">
                <span className="w-2 h-2 rounded-full bg-[#D7FF65] animate-ping" />
                <div className="text-left font-mono leading-tight">
                  <div className="text-[11px] font-bold text-[#F4F7FA] group-hover:text-[#D7FF65] transition-colors flex items-center space-x-1">
                    <span>MAHARASHTRA PILOT</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  <div className="text-[9px] text-[#8D98A8] mt-0.5">
                    265 / 358 Talukas Drought-Affected
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Discrete Technical Footer Strip */}
      <footer className="w-full px-6 lg:px-14 py-2.5 border-t border-[#263244]/40 bg-[#050A12]/95 flex items-center justify-between text-[11px] font-mono text-[#8D98A8] relative z-20 shrink-0">
        <div className="flex items-center space-x-3">
          <span className="flex items-center space-x-1.5 text-[#55D6A0]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#55D6A0]" />
            <span>ORBITAL TELEMETRY: SENTINEL-2 • MODIS • CHIRPS</span>
          </span>
          <span className="text-[#263244] hidden sm:inline">|</span>
          <span className="hidden sm:inline">COORDINATE SYSTEM: WGS84 EPSG:4326</span>
        </div>

        <div className="text-[10px] sm:text-[11px] text-[#8D98A8]">
          <span className="text-[#F4B740] font-bold">PROTOTYPE DATA</span> — Simulated for demonstration
        </div>
      </footer>
    </div>
  );
}
