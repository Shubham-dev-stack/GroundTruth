# GroundTruth

### Evidence-Guided Drought Verification Intelligence

GroundTruth is an operational geospatial decision-support workbench built for disaster and relief administrators (District Collectors, Tahsildars, Sub-Divisional Officers, and Taluka Agriculture Officers) to answer:

> **"Which location should be verified next, and how does new field evidence change our understanding?"**

GroundTruth operationalizes an active learning triage loop:
$$\text{SIGNAL} \longrightarrow \text{PRIORITIZE} \longrightarrow \text{VERIFY} \longrightarrow \text{UPDATE} \longrightarrow \text{RE-PLAN}$$

---

## Prototype Notice & Data Transparency

> [!NOTE]
> **Prototype Data — Simulated for Demonstration.**
> Location names and administrative geometries correspond to real talukas in Maharashtra (Latur, Beed, Solapur, Dharashiv, Jalna, Parbhani, Nanded, Washim, Amravati, Akola). Indicator values and exposure metrics are simulated for demonstrating the epistemic verification triage loop. GroundTruth does not claim official statutory authority.

---

## Complete Visual Redesign (Dark Geospatial Intelligence Platform)

1. **Level 1: 3D Satellite India Overview**:
   - The map IS the environment: Deep space canvas (`#070B12`) with atmospheric globe horizon and India subcontinent geometry.
   - Left storytelling hero: *"From Satellite Signals to Ground Truth"*, active pilot highlight box, and single-click access to Maharashtra.
   - Right situational card: 4 macro indicators (`Flagged: 265`, `Uncertain: 42`, `Active: 38`, `Verified: 17`) and regional stress feeds.
   - Clean opening state: Starts on India overview with NO pre-selected unit, NO open drawer, and NO clutter.
2. **Smooth Spatial Camera Drill-Down Transition (950ms)**:
   - Clicking Maharashtra triggers a smooth camera descent, highlighting the pilot boundary before revealing the operational workspace.
3. **Level 2: Maharashtra Operations Command Center**:
   - **Dominant GIS Working Canvas (~65–75% width)**: Real vector cartography with thermal drought epicenter at Marathwada, regional overlays (Vidarbha, Western Maharashtra), layer controls (*Priority*, *Confidence*, *Stress*, *Coverage*), and interactive taluka markers.
   - **Verification Queue (~25–35% width)**: Tactical table with rank, location, stress, uncertainty, and status badges.
   - **Inspection Drawer (~380–420px)**: Slides in mechanically ONLY when a location is clicked, displaying telemetry indicators, stepped evidence confidence, and numbered *"Why Prioritized"* justification rows.
4. **Level 3: Mobile Field Verification App**:
   - Tactical mobile interface with large tap radio options (*Crop*, *Water*, *Fodder*), field notes, geotagged EXIF photo mock, and electric lime submit button.
5. **Level 4: Real-Time Audit Stream**:
   - Horizontal bottom telemetry bar with real-time timestamps and event feeds.

---

## Acceptance Test Walkthrough ("The Wow Moment")

1. **Launch**: App lands on **3D Satellite India Overview**.
2. **Transition**: Click **"Explore Maharashtra"** or click Maharashtra on the globe. Observe the smooth 950ms camera descent into the tactical operations workspace.
3. **Inspect Queue**: Select **Latur Rural & Ausa** (or any unit). Notice the slide-in inspection drawer with:
   - **Confidence: 48%**, **Uncertainty: 52%**, **Status: PENDING**, priority `#02`.
   - Numbered *"Why Prioritized"* evidence breakdown.
4. **Assign Squad**: Click **"Assign Verification"** and confirm dispatch.
5. **Open Field Form**: Click **"Open Field Form"** to open the mobile inspection modal.
6. **Submit Ground Evidence**:
   - Select *Crop: Severe*, *Drinking Water: Shortage*, *Fodder: Shortage*.
   - Click **"Submit Verification"**.
7. **Observe Dynamic Recalculation**:
   - Status transitions to **VERIFIED** (pill turns green).
   - Confidence increases **48% → 88%**, uncertainty drops **52% → 12%**.
   - Queue row animates and Latur is deprioritized from the urgent triage roster.
   - Map node settles into verified ground truth with a green pulse.
   - Activity feed appends the update in real time.

---

## Running the Application

```bash
# In c:\Users\dell\OneDrive\Desktop\GroundTruth
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.
Verified with `npm run build` with 0 errors.
