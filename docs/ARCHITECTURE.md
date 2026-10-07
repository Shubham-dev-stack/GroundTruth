# System Architecture — GroundTruth

## 1. Architectural Philosophy
GroundTruth is engineered with a strict separation between **epistemic intelligence** (scoring, uncertainty calibration, priority planning) and **presentation components** (GIS canvas, operational queue, mobile field form).

```
                      +-----------------------------+
                      |   Satellite & Remote Sensing| (Future: CHIRPS, MODIS,
                      |      Data Ingestion (Mock)  |  CWC Reservoir Levels)
                      +--------------+--------------+
                                     |
                                     v
                      +-----------------------------+
                      |     GroundTruth Core Engine |
                      |    [Deterministic Scoring]  |
                      |   Stress + Uncert + Exposure|
                      +--------------+--------------+
                                     |
                   +-----------------+-----------------+
                   |                                   |
                   v                                   v
+-----------------------------+     +-----------------------------+
| Verification Priority Queue |     |  Maharashtra Map Workspace  |
|  (Ranked Administrative     |     |   (Spatial Layer Views:     |
|   Triage Table)             |     |    Priority/Uncertainty)    |
+--------------+--------------+     +--------------+--------------+
               |                                   |
               +-----------------+-----------------+
                                 |
                                 v
                +----------------------------------+
                |     Unit Detail & Squad Dispatch |
                +----------------+-----------------+
                                 |
                                 v
                +----------------------------------+
                |    Mobile Field Verification     |
                |   (Crop, Water, Fodder Evidence) |
                +----------------+-----------------+
                                 |
                                 v
                +----------------------------------+
                |    Epistemic Calibration Engine  |
                |   Uncertainty drops 52% -> 12%   |
                |   Confidence jumps 48% -> 88%    |
                +----------------+-----------------+
                                 |
                                 v
                +----------------------------------+
                |  Queue Recalculation & Re-Plan   |
                |      + Audit Stream Ledger       |
                +----------------------------------+
```

---

## 2. Component Boundaries

| Module | Location | Responsibility |
| :--- | :--- | :--- |
| **Domain Types** | `src/types/index.ts` | Type definitions for `LocationUnit`, `FieldReport`, `ActivityLogEntry`, and `PriorityLevel`. |
| **Scoring Engine** | `src/lib/scoring.ts` | Deterministic priority formula, threshold rules, and epistemic calibration updates. |
| **Demo Seed** | `src/data/demo/seed.ts` | Structured realistic data for 12 Maharashtra talukas across Marathwada and Vidarbha. |
| **State Context** | `src/context/GroundTruthContext.tsx` | Central state management handling selections, squad dispatch, evidence submission, and recalculations. |
| **GIS Map Panel** | `src/components/map/MapPanel.tsx` | Visual vector map of Maharashtra, division outlines, and multi-layer node visualizations. |
| **Verification Queue** | `src/components/queue/VerificationQueue.tsx` | High-density operational table with sorting, search, and status filtering. |
| **Unit Drawer** | `src/components/detail/UnitDrawer.tsx` | Detailed metric drawer displaying the "Why Prioritized" justification and dispatch modal. |
| **Mobile Field App** | `src/components/field/FieldVerificationForm.tsx` | Clean, mobile-dimension form for field officers submitting ground observations. |
| **Audit Log** | `src/components/audit/ActivityTimeline.tsx` | Real-time chronological audit stream recording all administrative actions. |

---

## 3. Extensibility & Future Service Roadmap

The v0.1 architecture cleanly isolates data sources so they can be swapped for full-scale microservices without refactoring UI components:

1. **Indicator Service (`/api/indicators`)**:
   * Integrate automated ingestion of CHIRPS 0.05° precipitation grids, MODIS NDVI anomalies, and Central Water Commission (CWC) reservoir storage figures.
2. **PostGIS Spatial Database**:
   * Replace SVG coordinate geometries with GeoJSON taluka boundaries stored in PostgreSQL / PostGIS.
3. **Field Evidence Service (`/api/evidence`)**:
   * Store geotagged photographic evidence in S3-compatible object storage with cryptographic SHA-256 tamper-proof timestamps.
4. **Autonomous Routing & Tanker Optimization**:
   * Connect Google OR-Tools or Valhalla for optimal travel routing of field verification squads and water tankers.
