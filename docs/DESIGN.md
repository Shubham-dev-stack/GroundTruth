# Design System & UI Direction — GroundTruth

## 1. Aesthetic Identity: Premium Geospatial Intelligence Platform

GroundTruth has been completely rebuilt as a dark, cinematic, scientific geospatial intelligence platform inspired by NASA Worldview, Linear, and modern high-end mission control operations.

### Core Philosophy:
* **The map IS the environment**: Geography dominates the screen rather than being squeezed into a card.
* **Spatial Storytelling**: `India 3D Satellite Overview → Maharashtra Operations → Local Taluka Triage → Field Ground Truth`.
* **Subtle, disciplined depth**: 3D is strictly used for geographic scale, globe perspective, and camera transitions.

---

## 2. Color Palette & Semantic System

| Token | Hex Value | Semantic Usage |
| :--- | :--- | :--- |
| **Deep Space Base** | `#070B12` | Primary background, viewport canvas, globe backdrop. |
| **Tactical Surface** | `#0D1420` | Operational panels, drawer surfaces, table rows. |
| **Active Surface** | `#111927` | Filter buttons, row hovers, control containers. |
| **Hairline Border** | `#263244` | Technical gridlines, panel borders, subtle dividers. |
| **Brand Accent (Lime)** | `#D7FF65` | Active indicators, CTAs, highlight rings, pilot markers. |
| **Critical Stress** | `#FF5A52` | Critical priority, severe moisture deficit, hotspot rings. |
| **Warning / Alert** | `#F4B740` | High priority, assigned squad in transit, moderate deficit. |
| **Verified Ground Truth** | `#55D6A0` | Confirmed ground observation, low uncertainty. |
| **Epistemic Uncertainty** | `#8D98A8` | Uncertainty metrics, unverified inference noise. |

---

## 3. Motion System & Interaction Timings

* **Spatial Camera Drill-Down**: `950ms` ease-in-out transition between India and Maharashtra.
* **Inspection Drawer Entrance**: `240ms` cubic-bezier(0.16, 1, 0.3, 1) (`translateX + opacity`).
* **Table Row Hover & Selection**: `150ms` ease.
* **Settlement Pulse**: `600ms` ease-out green pulse when field ground-truth is verified.
* **Bar Fill Calibration**: `500ms` cubic-bezier.

---

## 4. Anti-Generic-UI Rules

1. **Zero Glassmorphism / Neon overload**: Technical dark surfaces with solid contrast.
2. **Zero Floating Card Walls**: Layout is structured as integrated tactical viewports with hairline dividers.
3. **Disciplined Radii**: 6–8px for buttons and inspection panels.
4. **No Fake AI Badges**: Machine intelligence is communicated through deterministic triage behavior and uncertainty reduction, not marketing badges.
