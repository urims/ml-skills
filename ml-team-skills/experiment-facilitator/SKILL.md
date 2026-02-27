---
name: experiment-facilitator
description: Structure, track, and synthesize ML experiments to ensure they are purposeful, reproducible, and lead to actionable conclusions. Use this skill when designing an experiment plan, reviewing experiment results, deciding what to try next, writing experiment summaries, or ensuring the team doesn't repeat experiments or lose findings. Trigger on: "run an experiment", "what should we try next", "experiment plan", "ablation study", "A/B test the model", "compare these runs", "experiment log", "what did we learn", "hypothesis", "experiment summary", "MLflow", "experiment tracking".
---

# Experiment Facilitator

## Experiment-Driven Development Philosophy

Every experiment should start with a **falsifiable hypothesis** and end with a **decision**. No undirected exploration.

---

## Experiment Design Template

Before running any experiment, fill this out:

```markdown
## Experiment: [short name]
**Date**: [date]
**Owner**: [name]
**Status**: Planned / Running / Completed / Archived

### Hypothesis
"We believe that [change] will [improve/affect] [metric]
because [reasoning based on theory or prior evidence].
This is falsified if [metric] does not improve by [threshold] on [dataset]."

### Motivation
[1–2 sentences on why this experiment matters now]

### What We're Changing
- Baseline: [config / model version]
- Experiment: [config / model version]
- Isolated change: [exactly one variable if possible]

### Success Criteria
- Primary: [metric] improves by ≥ [threshold]
- Secondary: [other metric] does not regress by > [threshold]
- Guardrail: Training time does not exceed [budget]

### Compute Budget
- Estimated runtime: [X hours]
- Estimated cost: [$Y on SageMaker]
- Seeds to run: [3 minimum]

### Expected Outcome
[Your prediction before running]
```

---

## Experiment Hierarchy

Organize experiments in a tree:

```
Project Goal: Reduce MASE below 0.85 for high-volume SKUs
│
├── EXP-001: Baseline TFT (reference)
│
├── EXP-002: Architecture ablations
│   ├── EXP-002a: TFT vs N-HiTS
│   └── EXP-002b: TFT vs PatchTST
│
├── EXP-003: Feature engineering
│   ├── EXP-003a: + weather covariates
│   └── EXP-003b: + promotional calendar
│
└── EXP-004: Training improvements
    ├── EXP-004a: Extended context window (168 → 336)
    └── EXP-004b: Loss function (MSE → QuantileLoss)
```

Rule: **One variable per experiment where possible.** When testing multiple changes, document explicitly that it's a combined experiment and interpret accordingly.

---

## Experiment Log Summary Format

After each experiment, write:

```markdown
## EXP-003a: + Weather Covariates
**Status**: ✅ Completed
**Date**: 2024-01-20
**Owner**: Ana

### Result
| Metric | Baseline | Experiment | Δ | Significant? |
|--------|----------|-----------|---|--------------|
| MASE   | 0.94     | 0.89      | -5.3% | Yes (p=0.02) |
| Coverage 90% | 91% | 92% | +1% | No |
| Training time | 45 min | 47 min | +4% | — |

### Conclusion
**Hypothesis confirmed.** Weather covariates improve MASE by 5.3%, statistically significant.

### Decision
✅ Include weather covariates in production model (EXP-baseline-v2)

### Key Learnings
- Temperature is the most predictive weather feature (see attribution analysis)
- Precipitation features added noise for indoor retail — exclude in v2
- Weather forecast quality matters: use ensemble mean, not single provider

### Next Experiments Suggested
- EXP-003c: Try longer weather forecast horizon (3-day vs 1-day ahead)
- EXP-005: Test weather + promotion interaction features
```

---

## Experiment Prioritization Matrix

Score each candidate experiment (1–5 each):

| Experiment | Expected Impact | Confidence | Compute Cost (inv) | Priority Score |
|-----------|----------------|------------|-------------------|---------------|
| + Weather | High (5) | Medium (3) | Low (5) | 13 |
| Longer context | Medium (3) | High (4) | Medium (3) | 10 |
| Foundation model | High (5) | Low (2) | High (2) | 9 |

**Priority = Impact × Confidence × Cost_inverse** (roughly)

---

## Anti-Patterns to Flag

🚩 **HiPPO experiments**: Running experiments to justify the highest-paid person's opinion. Always require a hypothesis.

🚩 **Cherry-picking**: Reporting only the best seed. Always report mean ± std across ≥ 3 seeds.

🚩 **Metric shopping**: Switching the primary metric after seeing results. Pre-register the metric.

🚩 **Undocumented exploratory runs**: Every run in MLflow should have a description. No unnamed runs.

🚩 **Re-running known results**: Check experiment log before starting. "We already tried this in EXP-002b."

---

## Experiment Review Meeting Template

Timebox: 30 min maximum

```
Agenda:
1. [5 min] Completed experiments — owner presents summary table
2. [10 min] Key learnings discussion — what do we now believe?
3. [10 min] Next experiments — prioritize backlog together
4. [5 min] Blockers + compute budget check

Output:
- Updated experiment log
- Top 3 experiments to run next (assigned)
- Any hypothesis updates
```
