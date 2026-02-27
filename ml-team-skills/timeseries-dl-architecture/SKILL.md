---
name: timeseries-dl-architecture
description: Expert guidance on selecting, designing, and justifying deep learning architectures for time series forecasting problems. Use this skill whenever the task involves choosing or designing a neural network for time series — including univariate/multivariate forecasting, probabilistic forecasting, multi-step prediction, hierarchical forecasting, or anomaly detection on temporal data. Trigger on: "which model should I use", "architecture for forecasting", "LSTM vs Transformer", "design the model", "TFT", "N-BEATS", "N-HiTS", "PatchTST", "iTransformer", "Chronos", "TimesFM", or any request about DL model design for time series.
---

# Timeseries DL Architecture Expert

## Architecture Selection Process

Follow this decision tree before recommending any architecture:

### Step 1: Problem Characterization
```
□ Forecast horizon: short (≤24), medium (25–168), long (>168 steps)
□ Frequency: sub-hourly / hourly / daily / weekly / monthly
□ Series count: single / small batch (<100) / large scale (>1000)
□ Covariates: none / known-future / past-only / static metadata
□ Output type: point / quantile / full distribution
□ Interpretability requirement: none / partial / full
□ Latency constraint: batch / near-real-time (<1s) / real-time (<100ms)
□ Data volume: <1K / 1K–100K / >100K time steps per series
```

### Step 2: Architecture Shortlist

| Scenario | Primary Recommendation | Alternative |
|----------|----------------------|-------------|
| Short horizon, high interpretability | TFT (Temporal Fusion Transformer) | N-HiTS |
| Long horizon, many series | PatchTST / iTransformer | TimesNet |
| Zero-shot / few-shot | Chronos, TimesFM, MOIRAI | Lag-Llama |
| Univariate, fast iteration | N-BEATS / N-HiTS | DLinear |
| Probabilistic output | TFT / DeepAR | TimeGrad |
| Multivariate with cross-series dependencies | iTransformer | Crossformer |
| Limited data (<500 steps) | N-HiTS with data augmentation | Prophet + residuals |
| Production / latency-sensitive | DLinear / NLinear | Optimized N-HiTS |

---

## Architecture Deep Dives

Read `references/architectures.md` for detailed notes on each architecture. Key dimensions covered:
- Inductive biases and what makes each architecture tick
- Implementation libraries (GluonTS, NeuralForecast, PyTorch Forecasting)
- Common failure modes
- Recommended hyperparameter ranges

---

## Architecture Decision Record (ADR) Template

Always produce an ADR when recommending an architecture:

```markdown
## Architecture Decision Record

**Decision**: Use [Architecture Name]
**Date**: [date]
**Status**: Proposed / Accepted / Deprecated

### Context
[Problem description, data characteristics, constraints]

### Decision Drivers
- [Driver 1: e.g., interpretability required by stakeholder]
- [Driver 2: e.g., multivariate with 500 series]

### Considered Options
1. [Option A] — rejected because [reason]
2. [Option B] — rejected because [reason]
3. **[Chosen Option]** — selected because [reason]

### Consequences
- Positive: [list]
- Negative / risks: [list]
- Mitigation: [list]

### Metrics for Success
- Primary: [metric + threshold, e.g., MASE < 1.2]
- Secondary: [metric + threshold]
- Guardrails: [metric + threshold, e.g., P90 coverage > 88%]
```

---

## Common Anti-Patterns

❌ **Overcomplicated default**: Defaulting to Transformers for short univariate series (linear models often win)
❌ **Ignoring seasonality**: Not accounting for multiple seasonal periods (use STL decomposition or model with multiple attention heads)
❌ **Leaking future covariates**: Using features at time t that wouldn't be available in production
❌ **Wrong loss for the task**: MSE for skewed distributions → use quantile or CRPS loss
❌ **Benchmark-less decisions**: Always compare against a naive seasonal baseline (Seasonal Naïve) and a classical model (ETS/ARIMA)

---

## Baseline Hierarchy

Before any DL model, establish:
1. **Naive**: Last value / seasonal naive
2. **Statistical**: ETS, ARIMA, TBATS
3. **ML**: LightGBM with lag features
4. **Simple DL**: DLinear / NLinear
5. **Target architecture**: Complex DL model

Each step should justify the added complexity with measurable gains.
