# ML Team Agent Skills Framework
## Purpose & Design Philosophy

This framework standardizes how Claude assists an ML team that builds **time series forecasting solutions** and delivers results to **non-technical stakeholders**. It is organized around four core pillars:

```
┌──────────────────────────────────────────────────────────────────┐
│              ML TEAM AGENT SKILLS FRAMEWORK                      │
├──────────────┬───────────────┬──────────────┬────────────────────┤
│   DELIVER    │     BUILD     │   OPERATE    │     GOVERN         │
│              │               │              │                    │
│ Non-Tech     │ TS DL Arch    │ SageMaker    │ Reproducibility    │
│ Explainability│ TS DL Teacher │ Limited Res  │ Standards          │
│ Tech         │ TS DL Training│ API Design   │ Data Quality       │
│ Explainability│              │ UX Dev       │ Guardian           │
│ Stakeholder  │              │              │                    │
│ Communication│              │              │                    │
├──────────────┴───────────────┴──────────────┴────────────────────┤
│              CROSS-CUTTING: Validation & Feedback Loop           │
│              CROSS-CUTTING: Experiment Facilitator               │
└──────────────────────────────────────────────────────────────────┘
```

---

## Skill Inventory

| # | Skill | Pillar | Token Budget |
|---|-------|--------|-------------|
| 1 | non-technical-explainability | Deliver | Low |
| 2 | technical-explainability | Deliver | Medium |
| 3 | stakeholder-communication | Deliver | Low |
| 4 | timeseries-dl-architecture | Build | High |
| 5 | timeseries-dl-teacher | Build | Medium |
| 6 | timeseries-dl-training | Build | High |
| 7 | sagemaker-expert | Operate | High |
| 8 | limited-resources | Operate | Medium |
| 9 | api-design | Operate | Medium |
| 10 | ux-developer | Operate | Medium |
| 11 | validation-feedback-loop | Cross-cutting | Medium |
| 12 | experiment-facilitator | Cross-cutting | Medium |
| 13 | reproducibility-standards | Govern | Medium |
| 14 | data-quality-guardian | Govern | Medium |

---

## Design Principles

### 1. Stakeholder Alignment First
Every technical decision should trace back to a business outcome. Skills that produce outputs for stakeholders must include a non-technical summary layer.

### 2. Token Efficiency
- **Low budget skills**: Deliver concise, structured output. No preamble.
- **Medium budget skills**: Step-by-step reasoning with clear checkpoints.
- **High budget skills**: Full context reasoning, but compress artifacts.

### 3. Reproducibility by Default
All code-generating skills must emit: seed values, library versions, config snapshots, and data checksums.

### 4. Explainability at Every Layer
Each skill distinguishes: what happened, why it happened, what it means for the business.

### 5. Compounding Skills
Skills are designed to chain. Example pipeline:
```
data-quality-guardian
  → timeseries-dl-architecture
    → timeseries-dl-training
      → validation-feedback-loop
        → non-technical-explainability
          → stakeholder-communication
```
