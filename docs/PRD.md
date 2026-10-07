# Product Requirements Document (PRD) — GroundTruth v0.1

**Product Name:** GroundTruth: Evidence-Guided Drought Verification Intelligence  
**Target Milestone:** Prototype v0.1  
**Target Audience:** District Collectors, Sub-Divisional Officers (SDO), Tahsildars, Taluka Agriculture Officers (TAO), Field Verification Squads.

---

## 1. Product Purpose & Executive Summary
In drought administration, decision-makers are frequently inundated with macro-level remote-sensing data (satellite vegetation indices, rainfall deficits) that suffer from substantial spatial variance and epistemic uncertainty. Conversely, ground inspections are labor-intensive, scarce, and slow.

**GroundTruth** solves a fundamental operational dilemma:
> *"Which location should be verified next, and how does new field evidence change our understanding?"*

GroundTruth operationalizes an active learning triage loop:
```
SIGNAL → PRIORITIZE → VERIFY → UPDATE → RE-PLAN
```

### What GroundTruth is NOT:
* **NOT** an automated drought declaration system (statutory declarations remain strictly human and regulatory).
* **NOT** an autonomous relief or compensation disbursement engine.
* **NOT** a speculative food crisis predictor.
* **NOT** a generic consumer weather dashboard or conversational chatbot.

---

## 2. Key Personas & Roles

1. **District Collector / Relief Commissioner (Primary Decision Maker)**
   * Needs a high-level view of monitored talukas.
   * Prioritizes where limited administrative resources, water tankers, and field squads must be dispatched.
2. **Tahsildar / Taluka Agriculture Officer (Operational Coordinator)**
   * Inspects why specific talukas are flagged.
   * Dispatches inspection squads to ambiguous zones with high uncertainty.
3. **Field Verification Squad / Agriculture Assistant (Field Reporter)**
   * Visits villages, assesses standing crop condition, checks village water sources, and submits geotagged observations.

---

## 3. V0.1 Core Requirements & Capabilities

### 3.1 Spatial Workspace (Map)
* Vector interactive workspace focused on drought-prone Maharashtra divisions (Marathwada, Vidarbha, Western Maharashtra rain-shadow).
* Visual differentiation between **Verification Priority**, **Uncertainty Gap**, and **Biophysical Stress**.
* Interactive node selection showing instant status and metrics.

### 3.2 Verification Priority Queue
* Deterministic prioritization score calculated as:
  $$\text{Priority Score} = 0.45 \times \text{Stress} + 0.35 \times \text{Uncertainty} + 0.20 \times \text{Exposure}$$
* Real-time sorting and filtering by: Critical, High Uncertainty, Pending, Assigned, Verified.
* Dynamic re-ranking when new evidence is ingested.

### 3.3 Epistemic Calibration (The Core Interaction)
* When a unit is unverified, uncertainty is high (e.g., Latur: Uncertainty 52%, Confidence 48%).
* Submission of ground evidence reduces uncertainty drastically (down to ~12%) and boosts confidence (up to ~88%).
* Verified units drop down the urgent verification queue, freeing administrative bandwidth for remaining unverified sectors.

### 3.4 Operational Audit & Timeline
* Real-time activity log tracking assignments, evidence reports, confidence changes, and queue recalculations.

---

## 4. Prototype Disclaimer & Data Integrity
> **Notice:** All biophysical and exposure indicator scores are prototype data simulated for demonstration. Location names and administrative geometries correspond to real talukas in Maharashtra. GroundTruth explicitly disclaims official authority until real data pipelines (CHIRPS, MODIS, CWC, Mahavedh) are certified and integrated.
