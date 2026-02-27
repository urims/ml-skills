---
name: validation-feedback-loop
description: Design and execute rigorous validation frameworks for time series forecasting models, including backtesting strategies, metric selection, stakeholder feedback integration, and production monitoring loops. Use this skill when setting up model evaluation, designing backtests, interpreting metrics, building feedback collection systems, or closing the loop between production performance and model updates. Trigger on: "validate the model", "backtest", "evaluation strategy", "which metric to use", "is the model good enough", "production monitoring", "feedback loop", "model drift", "compare models", "evaluation framework", "acceptance criteria".
---

# Validation & Feedback Loop

## Validation Philosophy
Validation is not just about metrics — it's about answering: *"Should we trust this model to make business decisions?"*

---

## Backtesting Strategy

### Expanding Window (recommended default)
```
|——train——|—val—|
|———train———|—val—|
|————train————|—val—|
```

### Rolling Window (use for drift-sensitive problems)
```
|—train—|—val—|
        |—train—|—val—|
                |—train—|—val—|
```

### Implementation
```python
from sklearn.model_selection import TimeSeriesSplit

tscv = TimeSeriesSplit(
    n_splits=5,
    gap=0,                    # Gap between train/test (set to horizon for realistic eval)
    max_train_size=None,      # None = expanding, set int = rolling
    test_size=forecast_horizon
)

results = []
for fold, (train_idx, test_idx) in enumerate(tscv.split(data)):
    model.fit(data[train_idx])
    preds = model.predict(horizon=forecast_horizon)
    metrics = evaluate(preds, data[test_idx])
    results.append({"fold": fold, "origin_date": data.index[train_idx[-1]], **metrics})
```

---

## Metric Selection Guide

| Objective | Primary Metric | Secondary | Notes |
|-----------|---------------|-----------|-------|
| Symmetric accuracy | MASE | sMAPE | MASE > 1 means worse than seasonal naïve |
| Business (% error OK) | MAPE | MAE | Avoid if zeros in series |
| Probabilistic | CRPS | WQL | Gold standard for intervals |
| Interval coverage | Empirical Coverage | | Should match stated level |
| Extreme events | P90 MAE | Max Error | |
| Business value | Custom (cost-asymmetric) | | Work with stakeholders |

### Reporting Template
```
Model: TFT v2.1
Evaluation period: 2023-Q4 (13 weeks, 5 backtests)
Series: 47 SKUs, 3 stores

PRIMARY METRICS:
  MASE:     0.87  (target: < 1.0, baseline Seasonal Naïve: 1.00)
  Coverage: 91%   (target: 90% for 90% PI)
  CRPS:     12.3  (vs 14.1 baseline)

SEGMENT BREAKDOWN:
  High-volume SKUs:  MASE 0.72  ✅
  Low-volume SKUs:   MASE 1.14  ⚠️
  New products:      MASE 2.31  ❌ (cold start issue)

FAILURE MODES IDENTIFIED:
  - Series with < 6 months history (cold start)
  - Holiday weeks (coverage drops to 78%)
  - Stockout periods (leaks into training signal)
```

---

## Stakeholder Acceptance Criteria Framework

Before model goes to production, stakeholders must sign off on:

```
Business Acceptance Criteria:
  □ Primary metric meets agreed threshold: [metric] < [threshold]
  □ No more than [X]% of series perform below baseline
  □ Behavior on edge cases reviewed and accepted:
      □ Holiday/event performance
      □ New product cold start behavior
      □ Extreme demand periods
  □ Non-technical stakeholder has seen 3 representative examples
  □ Failure mode communication strategy agreed
```

---

## Production Monitoring Loop

```
Deploy Model
     │
     ▼
Collect Actuals (T+horizon)
     │
     ▼
Compute Live Metrics
  - Rolling MASE (28-day window)
  - Coverage rate
  - Bias (systematic over/under)
     │
     ▼
Trigger Alerts If:
  - MASE > 1.5 × validation MASE
  - Coverage < threshold - 10%
  - Bias > ±15%
     │
     ▼
Root Cause Analysis
  - Data drift (input distribution change)
  - Concept drift (relationship changed)
  - System issue (pipeline problem)
     │
     ▼
Retrain / Fine-tune / Alert team
```

### Monitoring Dashboard Requirements
- Live metric vs. validation benchmark
- Per-segment breakdown (don't hide struggling segments)
- Recent worst-performing series (surfaced automatically)
- Data freshness indicator

---

## Feedback Collection from Stakeholders

Structured feedback template to give stakeholders:
```
Forecast Review — Week of [date]
Series: [series_id]

Forecast: 1,240 units (+12% vs last week)
Actual:   1,180 units

Accuracy: 5% error  ✅

Questions:
1. Did anything unexpected happen this week that we should capture? [Y/N + notes]
2. Were there any decisions made based on this forecast? [Y/N]
3. Was the forecast directionally useful? [Yes / Somewhat / No]
4. Confidence in next forecast: [High / Medium / Low]
```

Feedback → logged → tagged → fed back into model improvement backlog.
