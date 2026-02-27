---
name: technical-explainability
description: Produce rigorous, reproducible technical explanations of ML model behavior, architecture choices, training dynamics, and forecast quality for ML engineers, data scientists, and technical reviewers. Use this skill when a technical audience needs to understand model internals, debugging information, architecture trade-offs, error analysis, or experiment results. Trigger on: "explain the model technically", "why did the model predict X", "architecture decision", "error analysis", "interpret attention weights", "feature attribution", "gradient analysis", or any deep-dive into model mechanics for a technical audience.
---

# Technical Explainability

## Goal
Provide technically precise, traceable, and reproducible explanations of model behavior that enable peer review, debugging, and informed architectural decisions.

## Explanation Modes

Identify which mode the request requires before responding:

| Mode | Trigger | Focus |
|------|---------|-------|
| **Architecture** | "Why this model?" | Design decisions, inductive biases, trade-offs |
| **Training Dynamics** | "How did it learn?" | Loss curves, gradient flow, convergence behavior |
| **Prediction Attribution** | "Why this forecast?" | Feature importance, attention, SHAP/LIME |
| **Error Analysis** | "Where does it fail?" | Error distribution, failure modes, edge cases |
| **Experiment Comparison** | "Which is better and why?" | Metric deltas, statistical significance, ablation |

---

## Architecture Explanation Template

```
Model: [name + version]
Problem framing: [univariate/multivariate, horizon, frequency]
Architecture choice rationale:
  - Inductive bias: [why this matches the data structure]
  - Alternatives considered: [list with 1-line reason rejected]
  - Key design decisions: [e.g., attention window, positional encoding choice]
Complexity: [parameters, FLOPs if relevant]
Known limitations for this use case: [explicit list]
```

---

## Prediction Attribution Workflow

For time series DL models:
1. **Global importance**: Which input features/lags drive predictions most across the dataset
2. **Local importance**: For a specific forecast, which timesteps and features drove this prediction
3. **Temporal attention**: If transformer-based, visualize attention patterns over input window
4. **Counterfactual**: "If feature X had been Y, the forecast would have changed by Z"

Tools to reference by architecture:
- LSTM/GRU → Integrated Gradients, LIME on lag features
- Transformer → Attention weights + Captum
- N-BEATS/N-HiTS → Built-in interpretable basis expansion
- TFT (Temporal Fusion Transformer) → Native variable importance + attention

---

## Error Analysis Framework

Always characterize errors along these dimensions:

```python
# Error decomposition template
error_analysis = {
    "bias": mean_error,           # Systematic over/under-prediction
    "variance": std_error,        # Inconsistency across samples
    "temporal_pattern": ...,      # Does error grow with horizon?
    "segment_breakdown": ...,     # Errors by series, season, regime
    "tail_behavior": ...,         # P90/P95/P99 error percentiles
    "failure_modes": [            # Explicit list of when model struggles
        "cold start (< N observations)",
        "regime change (structural break)",
        "extreme events (beyond training distribution)"
    ]
}
```

---

## Statistical Rigor Requirements

When comparing experiments:
- Report mean ± std across seeds (minimum 3 seeds)
- Use paired statistical tests (Wilcoxon signed-rank for non-normal distributions)
- State null hypothesis explicitly
- Report effect size, not just p-value
- Flag practical vs. statistical significance separately

---

## Reproducibility Anchor

Every technical explanation must include:
```
Reproducibility:
  seed: [value]
  framework: [name==version]
  hardware: [GPU type, CUDA version]
  config_hash: [short hash of hyperparameter config]
  data_hash: [checksum of train/val/test splits]
```
