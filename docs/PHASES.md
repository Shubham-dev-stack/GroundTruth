# Development Phases & Roadmap — GroundTruth

## Phase 1: Prototype v0.1 (Current Delivery)
- [x] End-to-end active learning triage loop: `SIGNAL -> PRIORITIZE -> VERIFY -> UPDATE -> RE-PLAN`
- [x] Clean Command Center layout with interactive Maharashtra vector GIS map
- [x] Real-time sorting and filtering verification queue
- [x] Detailed unit inspection drawer with epistemic confidence/uncertainty bars and "Why Prioritized" breakdown
- [x] Squad assignment workflow
- [x] Mobile-optimized field verification submission form with crop, drinking water, fodder status, and geotagged photo mock
- [x] Dynamic epistemic recalculation upon field submission (Uncertainty drops, queue re-ranks visibly)
- [x] Chronological operational audit stream
- [x] Modular TypeScript architecture ready for backend microservices

---

## Phase 2: Live Sensor & Spatial Data Ingestion
- [ ] Connect CHIRPS (Climate Hazards Group InfraRed Precipitation with Station data) daily precipitation API
- [ ] Ingest Sentinel-2 and MODIS NDVI / NDWI 250m vegetation anomaly rasters
- [ ] Ingest Central Water Commission (CWC) and Maharashtra Water Resources Department live reservoir storage levels
- [ ] Transition map from vector SVG to MapLibre GL with vector tiles of Maharashtra revenue taluka boundaries

---

## Phase 3: Spatial Bayesian Modeling & Intelligent Routing
- [ ] Replace linear weighted scoring with Bayesian Spatial Gaussian Process model to propagate uncertainty across adjacent uninspected talukas
- [ ] Implement vehicle routing optimization (VRP) using Google OR-Tools for optimal dispatch of field inspection squads
- [ ] Support offline-first mobile sync using IndexedDB for field officers working in zero-connectivity rural zones

---

## Phase 4: State-wide Rollout & Statutory Integration
- [ ] Multi-district role-based access control (Collector, Tahsildar, TAO, Circle Officer)
- [ ] Export formal drought memorandum dossiers conforming to the Manual for Drought Management (Ministry of Agriculture & Farmers Welfare, Govt of India)
- [ ] Full coverage across all 36 districts and 358 talukas of Maharashtra
