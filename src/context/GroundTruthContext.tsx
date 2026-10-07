'use client';

import React, { createContext, useContext, useState, useTransition, useMemo } from 'react';
import { LocationUnit, FieldReport, ActivityLogEntry, StateOverviewSummary, MapLayerMode } from '@/types';
import { getInitialUnits, INITIAL_ACTIVITY_LOG, INITIAL_FIELD_REPORTS, NATIONAL_STATES_DATA } from '@/data/demo/seed';
import { applyFieldVerificationToUnit } from '@/lib/scoring';

interface GroundTruthContextType {
  // Navigation & Scope
  geoScope: 'national' | 'state';
  activeView: 'command' | 'field' | 'reports' | 'audit';
  
  // Transition state
  isTransitioningGeo: boolean;
  
  // Data
  units: LocationUnit[];
  nationalStates: StateOverviewSummary[];
  selectedStateId: string;
  selectedUnitId: string | null;
  selectedUnit: LocationUnit | null;
  activityLog: ActivityLogEntry[];
  fieldReports: FieldReport[];
  
  // UI filter & sort states
  statusFilter: 'ALL' | 'CRITICAL' | 'HIGH_UNCERTAINTY' | 'PENDING' | 'ASSIGNED' | 'VERIFIED';
  searchQuery: string;
  sortBy: 'priority' | 'stress' | 'uncertainty' | 'exposure' | 'name';
  sortOrder: 'asc' | 'desc';
  
  // Map Layer
  mapLayer: MapLayerMode;
  setMapLayer: (layer: MapLayerMode) => void;
  
  // Drawer visibility
  isDrawerOpen: boolean;
  
  // Sidebar collapsed state (64px vs 220px)
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  
  // Highlighting state for subtle demo transitions
  recentlyUpdatedUnitId: string | null;

  // Actions
  setGeoScope: (scope: 'national' | 'state') => void;
  drillIntoState: (stateId: string) => void;
  selectState: (stateId: string) => void;
  selectUnit: (id: string | null) => void;
  closeDrawer: () => void;
  setActiveView: (view: 'command' | 'field' | 'reports' | 'audit') => void;
  setStatusFilter: (filter: 'ALL' | 'CRITICAL' | 'HIGH_UNCERTAINTY' | 'PENDING' | 'ASSIGNED' | 'VERIFIED') => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (sortBy: 'priority' | 'stress' | 'uncertainty' | 'exposure' | 'name') => void;
  toggleSortOrder: () => void;
  
  // Core workflows
  assignVerification: (unitId: string, teamName?: string, officerName?: string) => void;
  submitFieldVerification: (reportData: {
    unitId: string;
    officer: string;
    cropCondition: 'Normal' | 'Moderate' | 'Severe';
    waterStatus: 'Available' | 'Shortage';
    fodderStatus: 'Available' | 'Shortage';
    notes: string;
    photoFileName?: string;
  }) => void;
  generateVerificationPlan: () => void;
  resetDemoData: () => void;
}

const GroundTruthContext = createContext<GroundTruthContextType | undefined>(undefined);

export function GroundTruthProvider({ children }: { children: React.ReactNode }) {
  // Opening state: ALWAYS start at national overview, NO selected unit, NO open drawer
  const [geoScope, setGeoScope] = useState<'national' | 'state'>('national');
  const [selectedStateId, setSelectedStateId] = useState<string>('MH');
  const [isTransitioningGeo, setIsTransitioningGeo] = useState<boolean>(false);
  
  const [units, setUnits] = useState<LocationUnit[]>(() => getInitialUnits());
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  
  const [mapLayer, setMapLayer] = useState<MapLayerMode>('priority');
  const [activityLog, setActivityLog] = useState<ActivityLogEntry[]>(INITIAL_ACTIVITY_LOG);
  const [fieldReports, setFieldReports] = useState<FieldReport[]>(INITIAL_FIELD_REPORTS);
  const [nationalStates] = useState<StateOverviewSummary[]>(NATIONAL_STATES_DATA);
  const [activeView, setActiveView] = useState<'command' | 'field' | 'reports' | 'audit'>('command');
  
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'CRITICAL' | 'HIGH_UNCERTAINTY' | 'PENDING' | 'ASSIGNED' | 'VERIFIED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'priority' | 'stress' | 'uncertainty' | 'exposure' | 'name'>('priority');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [recentlyUpdatedUnitId, setRecentlyUpdatedUnitId] = useState<string | null>(null);

  const [, startTransition] = useTransition();

  const selectedUnit = useMemo(() => {
    if (!selectedUnitId) return null;
    return units.find((u) => u.id === selectedUnitId) || null;
  }, [units, selectedUnitId]);

  const selectUnit = (id: string | null) => {
    setSelectedUnitId(id);
    if (id) {
      setIsDrawerOpen(true);
    } else {
      setIsDrawerOpen(false);
    }
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  // Smooth spatial drill-down from India to Maharashtra (900-1100ms camera transition)
  const drillIntoState = (stateId: string) => {
    setSelectedStateId(stateId);
    if (stateId === 'MH') {
      setIsTransitioningGeo(true);
      setTimeout(() => {
        setGeoScope('state');
        setIsTransitioningGeo(false);
      }, 950);
    }
  };

  const selectState = (stateId: string) => {
    drillIntoState(stateId);
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  const getTimeString = () => {
    const d = new Date();
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Workflow: Assign verification team
  const assignVerification = (
    unitId: string,
    teamName: string = 'Field Squad Marathwada 01',
    officerName: string = 'A. S. Patil (Taluka Agri Officer)'
  ) => {
    const target = units.find((u) => u.id === unitId);
    if (!target) return;

    const timeStr = getTimeString();

    setUnits((prev) =>
      prev.map((unit) => {
        if (unit.id !== unitId) return unit;
        return {
          ...unit,
          status: 'ASSIGNED',
          assignedTeam: teamName,
          assignedOfficerName: officerName,
        };
      })
    );

    const newActivity: ActivityLogEntry = {
      id: `act-${Date.now()}`,
      type: 'ASSIGNMENT',
      unitId: target.id,
      unitName: target.name,
      message: `Verification assigned — ${target.name} (${target.district})`,
      details: `Dispatched to ${teamName} / Officer ${officerName}`,
      timestamp: timeStr,
    };

    setActivityLog((prev) => [newActivity, ...prev]);
  };

  // Workflow: Submit field verification report & trigger recalculation
  const submitFieldVerification = (reportData: {
    unitId: string;
    officer: string;
    cropCondition: 'Normal' | 'Moderate' | 'Severe';
    waterStatus: 'Available' | 'Shortage';
    fodderStatus: 'Available' | 'Shortage';
    notes: string;
    photoFileName?: string;
  }) => {
    const target = units.find((u) => u.id === reportData.unitId);
    if (!target) return;

    const timeStr = getTimeString();
    const oldConf = target.confidence;
    const oldUncert = target.uncertainty;
    const oldScore = target.priorityScore;

    // Apply calibration model
    const updatedUnit = applyFieldVerificationToUnit(
      target,
      reportData.cropCondition,
      reportData.waterStatus,
      reportData.fodderStatus
    );

    // Create Report Record
    const newReport: FieldReport = {
      id: `rep-${Date.now()}`,
      unitId: target.id,
      unitName: target.name,
      district: target.district,
      officer: reportData.officer,
      timestamp: `Today ${timeStr}`,
      cropCondition: reportData.cropCondition,
      waterStatus: reportData.waterStatus,
      fodderStatus: reportData.fodderStatus,
      notes: reportData.notes,
      photoFileName: reportData.photoFileName || 'ground_transect_evidence.jpg',
      gpsAccuracyMeters: 3.2,
    };

    // Prepare Activities
    const reportActivity: ActivityLogEntry = {
      id: `act-${Date.now()}-1`,
      type: 'FIELD_REPORT',
      unitId: target.id,
      unitName: target.name,
      message: `Field verification submitted — ${target.name}`,
      details: `${reportData.officer} reported: Crop ${reportData.cropCondition}, Water ${reportData.waterStatus}, Fodder ${reportData.fodderStatus}`,
      timestamp: timeStr,
    };

    const updateActivity: ActivityLogEntry = {
      id: `act-${Date.now()}-2`,
      type: 'CONFIDENCE_UPDATE',
      unitId: target.id,
      unitName: target.name,
      message: `Confidence updated: ${oldConf}% → ${updatedUnit.confidence}%`,
      details: `Uncertainty reduced ${oldUncert}% → ${updatedUnit.uncertainty}%. Score adjusted from ${oldScore} to ${updatedUnit.priorityScore}.`,
      timestamp: timeStr,
    };

    const queueActivity: ActivityLogEntry = {
      id: `act-${Date.now()}-3`,
      type: 'QUEUE_RECALCULATED',
      unitId: target.id,
      unitName: target.name,
      message: 'Priority queue recalculated',
      details: `${target.name} resolved to VERIFIED and reprioritized in triage list.`,
      timestamp: timeStr,
    };

    startTransition(() => {
      // Re-sort the queue deterministically
      setUnits((prev) => {
        const next = prev.map((u) => (u.id === target.id ? updatedUnit : u));
        return [...next].sort((a, b) => b.priorityScore - a.priorityScore);
      });

      setFieldReports((prev) => [newReport, ...prev]);
      setActivityLog((prev) => [queueActivity, updateActivity, reportActivity, ...prev]);
      setRecentlyUpdatedUnitId(target.id);
      setSelectedUnitId(target.id);
      setIsDrawerOpen(true);
      setActiveView('command');
      setGeoScope('state');
    });

    // Reset pulse highlight after 4 seconds
    setTimeout(() => {
      setRecentlyUpdatedUnitId((curr) => (curr === target.id ? null : curr));
    }, 4500);
  };

  // Workflow: Deterministic Plan Generation
  const generateVerificationPlan = () => {
    const timeStr = getTimeString();
    
    const pendingHighUnits = units
      .filter((u) => u.status === 'PENDING')
      .sort((a, b) => b.priorityScore - a.priorityScore);

    const top3 = pendingHighUnits.slice(0, 3).map((u) => u.name).join(', ');

    const newActivity: ActivityLogEntry = {
      id: `act-${Date.now()}`,
      type: 'PLAN_GENERATED',
      message: 'Verification plan regenerated',
      details: `High-priority dispatch recommended for: ${top3 || 'All units verified'}`,
      timestamp: timeStr,
    };

    setActivityLog((prev) => [newActivity, ...prev]);
  };

  const resetDemoData = () => {
    setUnits(getInitialUnits());
    setSelectedUnitId(null);
    setIsDrawerOpen(false);
    setActivityLog(INITIAL_ACTIVITY_LOG);
    setFieldReports(INITIAL_FIELD_REPORTS);
    setRecentlyUpdatedUnitId(null);
    setActiveView('command');
    setGeoScope('national');
  };

  return (
    <GroundTruthContext.Provider
      value={{
        geoScope,
        activeView,
        isTransitioningGeo,
        units,
        nationalStates,
        selectedStateId,
        selectedUnitId,
        selectedUnit,
        activityLog,
        fieldReports,
        statusFilter,
        searchQuery,
        sortBy,
        sortOrder,
        mapLayer,
        setMapLayer,
        isDrawerOpen,
        isSidebarCollapsed,
        toggleSidebar,
        recentlyUpdatedUnitId,
        setGeoScope,
        drillIntoState,
        selectState,
        selectUnit,
        closeDrawer,
        setActiveView,
        setStatusFilter,
        setSearchQuery,
        setSortBy,
        toggleSortOrder,
        assignVerification,
        submitFieldVerification,
        generateVerificationPlan,
        resetDemoData,
      }}
    >
      {children}
    </GroundTruthContext.Provider>
  );
}

export function useGroundTruth() {
  const context = useContext(GroundTruthContext);
  if (!context) {
    throw new Error('useGroundTruth must be used within a GroundTruthProvider');
  }
  return context;
}
