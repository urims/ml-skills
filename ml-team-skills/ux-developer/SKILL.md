---
name: ux-developer
description: Design excellent developer experience (DX) for ML tools, SDKs, notebooks, internal tools, and CLI interfaces used by the ML team or consuming developers. Use this skill when designing interfaces, tooling, or workflows that developers interact with — including Python SDK design, CLI design, notebook UX, error messages, logging output, configuration schemas, and internal tooling. Trigger on: "developer experience", "DX", "SDK design", "CLI design", "notebook design", "error messages", "logging format", "config design", "internal tool", "make it easier to use", "onboarding", or any request about how developers will interact with a system.
---

# UX for Developers (DX)

## Core DX Principle: Pit of Success
Design so the right thing is easy and the wrong thing is hard (or impossible).

---

## Python SDK Design

### Naming & Discoverability
```python
# ❌ Bad: Cryptic, inconsistent
forecaster.fit_transform_v2(X, y, cfg={"lr": 1e-3, "ep": 50})

# ✅ Good: Self-documenting, discoverable
forecaster.train(
    history=series_data,
    config=TrainingConfig(learning_rate=1e-3, max_epochs=50)
)
```

### Progressive Complexity
```python
# Level 1: Works with sensible defaults
model = TimeSeriesForecaster()
forecast = model.fit(data).predict(horizon=24)

# Level 2: Tune important parameters
model = TimeSeriesForecaster(
    architecture="tft",
    forecast_horizon=24,
)

# Level 3: Full control
model = TimeSeriesForecaster(
    architecture=TFTConfig(hidden_size=256, attention_heads=8),
    training=TrainingConfig(optimizer=AdamWConfig(lr=1e-3)),
)
```

### Helpful Errors
```python
# ❌ Bad
raise ValueError("Invalid input")

# ✅ Good
raise InsufficientHistoryError(
    f"Model requires at least {self.min_history} data points, "
    f"but received {len(data)}.\n"
    f"Tip: Consider using a foundation model (Chronos) for short series, "
    f"or collect more historical data before training.\n"
    f"Docs: https://docs.yourteam.com/errors/InsufficientHistory"
)
```

---

## CLI Design Standards

```bash
# Structure: tool verb [target] [--options]
forecast train --config configs/tft.yaml --experiment exp_001
forecast predict --model-version v2.1 --input data.csv --output forecasts.csv
forecast evaluate --run-id abc123 --metrics mase,coverage
forecast serve --model-version v2.1 --port 8080

# Always support:
--dry-run           # Show what would happen without doing it
--verbose / -v      # Detailed output
--quiet / -q        # Suppress all output except errors
--output-format     # json | table | csv
--help              # Auto-generated, always present
```

### Progress Feedback
```
$ forecast train --config tft.yaml

✓ Config loaded (tft.yaml)
✓ Data validated (52,416 timesteps, 12 series, no missing values)
⟳ Training TFT | Epoch 15/100 | Loss: 0.0842 | ETA: 8 min
```

---

## Notebook UX Standards

Notebooks are stakeholder artifacts. Design them to be:

### Structure Template
```
Cell 1: Title + Business Context (Markdown)
Cell 2: Setup + Imports (collapsed in output)
Cell 3: Configuration block (all params in ONE cell)
---
Cell N: Each analysis step with:
  - Markdown header explaining "why"
  - Code that does one thing
  - Output that is self-explanatory
---
Last cell: Summary section with key findings (Markdown)
```

### Configuration Cell Pattern
```python
# ============================================================
# CONFIGURATION — Edit this cell to change the analysis
# ============================================================
SERIES_ID       = "store_001"
FORECAST_HORIZON = 24        # hours
CONFIDENCE_LEVEL = 0.9       # 90% prediction intervals
MODEL_VERSION    = "v2.1"
# ============================================================
```

### Visual Output Standards
- All plots must have: title, axis labels with units, legend
- Use a consistent color scheme across the project
- Include a one-line takeaway as a comment after each plot
- Never leave raw DataFrames as output — format with `.style`

---

## Logging Design

```python
# Log levels for ML jobs
logging.DEBUG    → Hyperparameter values, tensor shapes, per-batch details
logging.INFO     → Epoch summaries, dataset stats, key milestones
logging.WARNING  → Data quality issues, fallback behavior, deprecation
logging.ERROR    → Recoverable errors with guidance
logging.CRITICAL → Job failure with diagnostics

# Standard log format
"[{timestamp}] [{level}] [{component}] {message}"

# Progress log standard (machine-parseable for metrics)
"train_loss=0.0842 val_loss=0.0931 epoch=15 lr=0.0008"
```

---

## Onboarding Experience Checklist

For any new tool or SDK:
- [ ] `README.md` has a working example in < 5 minutes
- [ ] One-command setup: `make setup` or `pip install -e .`
- [ ] `examples/` directory with real, runnable notebooks
- [ ] Error messages explain what went wrong AND how to fix it
- [ ] `--help` covers all commands with examples
- [ ] Change log exists and is maintained

---

## Internal Tool Review Heuristic

Before shipping an internal ML tool, ask:
1. Can a new team member use it on day one without asking for help?
2. Does every error message tell the user what to do next?
3. Is the happy path ≤ 3 steps?
4. Are defaults sensible for 80% of use cases?
