# Operational Rules & Data Integrity Standards

## 1. Golden Rule: No Fake Claims of Official Authority

1. **Simulated Labeling**:
   * Every prototype dataset, simulated biophysical score, or mock indicator must visibly declare:
     > *"Prototype data — simulated for demonstration"*
   * At no point does GroundTruth claim to represent official Gazette declarations or statutory IMD/Mahavedh figures in v0.1.

2. **No Autonomous High-Stakes Decisions**:
   * GroundTruth prioritizes locations for human verification; it does **not** automatically trigger drought relief packages, declaration orders, or water-tanker rationing without authorized human sign-off.

---

## 2. Epistemic Prioritization Formula

The verification priority queue computes ranking through the transparent, weighted formula:

$$\text{Priority Score} = w_{\text{stress}} \cdot \text{Stress} + w_{\text{uncertainty}} \cdot \text{Uncertainty} + w_{\text{exposure}} \cdot \text{Exposure}$$

* $w_{\text{stress}} = 0.45$
* $w_{\text{uncertainty}} = 0.35$
* $w_{\text{exposure}} = 0.20$

Where:
* **Stress (0–100):** Weighted combination of rainfall deficit and vegetation health anomaly.
* **Uncertainty (0–100):** $100 - \text{Confidence}$. Represents lack of recent on-the-ground verification evidence.
* **Exposure (0–100):** Vulnerability score based on smallholder rainfed agricultural population.

---

## 3. Ground Truth Ingestion Rules

When a field report is verified:
1. Epistemic confidence increases immediately to $\ge 85\%$.
2. Epistemic uncertainty decreases immediately to $\le 15\%$.
3. The location's priority score is re-evaluated and drops down the urgent triage queue.
4. An immutable audit record is appended to the operational log.
