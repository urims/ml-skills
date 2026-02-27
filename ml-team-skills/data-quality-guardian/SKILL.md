---
name: data-quality-guardian
description: Detect, diagnose, and handle data quality issues in time series datasets — including missing values, outliers, structural breaks, leakage, stationarity problems, and distribution drift. Use this skill whenever working with raw or processed time series data before training or evaluation. Trigger on: "data quality", "missing values", "outliers", "data validation", "check the data", "data issues", "anomalies in data", "stockout", "sensor failure", "data drift", "stationarity", "leakage check", or at the start of any new modeling project.
---

# Data Quality Guardian

## Principle: Data Issues Compound
A model trained on bad data is confidently wrong. Run this skill before any training.

---

## Data Quality Audit Checklist

```python
def audit_timeseries(df, series_col, time_col, value_col):
    """Run all checks. Returns report dict."""
    
    checks = {}
    
    # 1. COMPLETENESS
    checks["missing_pct"] = df[value_col].isna().mean()
    checks["missing_runs"] = find_consecutive_missing(df, value_col)  # longest run
    
    # 2. TEMPORAL INTEGRITY
    checks["freq_consistent"] = check_frequency_consistency(df, time_col)
    checks["duplicates"] = df.duplicated([series_col, time_col]).sum()
    checks["gaps"] = find_temporal_gaps(df, time_col)
    
    # 3. VALUE INTEGRITY  
    checks["negative_values"] = (df[value_col] < 0).sum()  # if values should be positive
    checks["zero_pct"] = (df[value_col] == 0).mean()
    checks["outlier_pct"] = detect_outliers_iqr(df, value_col)
    
    # 4. DISTRIBUTION
    checks["is_stationary"] = adf_test(df[value_col])
    checks["structural_breaks"] = detect_structural_breaks(df, value_col)
    
    # 5. SERIES-LEVEL
    checks["series_lengths"] = df.groupby(series_col).size().describe()
    checks["short_series_count"] = (df.groupby(series_col).size() < 52).sum()
    
    return checks
```

---

## Issue-by-Issue Treatment Guide

### Missing Values

| Pattern | Likely Cause | Treatment |
|---------|-------------|-----------|
| Random single points | Sensor glitch, reporting error | Linear interpolation or forward-fill |
| Long consecutive runs | Stockout, system downtime | Impute as zero (stockout) or flag as unknown |
| Entire periods missing | Historical data gap | Remove from training or use global model |
| Trailing zeros | Product discontinuation | Truncate series end |

```python
# Stockout detection (zeros likely mean unavailability, not zero demand)
def detect_stockouts(series, zero_threshold=0.05, run_length=3):
    """Flag consecutive zero runs as likely stockouts"""
    zero_runs = (series == 0).astype(int)
    stockout_mask = (zero_runs.rolling(run_length).sum() >= run_length)
    return stockout_mask
```

### Outliers

```python
# IQR-based outlier detection
def flag_outliers(series, multiplier=3.0):
    Q1, Q3 = series.quantile([0.25, 0.75])
    IQR = Q3 - Q1
    lower = Q1 - multiplier * IQR
    upper = Q3 + multiplier * IQR
    return (series < lower) | (series > upper)

# Treatment options:
# 1. Cap to bounds (Winsorization) — preserves signal, reduces impact
# 2. Replace with local median — smooth
# 3. Keep and use robust loss (MAE > MSE) — let model handle it
# 4. Flag as a feature — "is_outlier_flag" covariate
```

### Target Leakage

```python
# Leakage audit: for each feature, check if it's available at inference time
feature_audit = {
    "is_holiday":        "SAFE — known future",
    "promotion_flag":    "SAFE — known future",
    "temperature":       "RISKY — forecast, not actual (use weather forecast, not actuals)",
    "actual_sales_t":    "UNSAFE — this IS the target",
    "cumsum_sales":      "UNSAFE — includes future information if computed on full series",
    "stock_level_t+1":   "UNSAFE — future information",
}
```

### Structural Breaks

```python
from ruptures import Pelt

def detect_structural_breaks(series, n_bkps=2):
    """Detect level shifts, trend changes using PELT algorithm"""
    model = Pelt(model="rbf").fit(series.values.reshape(-1, 1))
    breakpoints = model.predict(n_bkps=n_bkps)
    return breakpoints  # timestamps of detected breaks

# Treatment:
# - Use only post-break data for training
# - Add "post_break_period" as a binary feature
# - Train separate models per regime
```

---

## Data Quality Report Template

```markdown
## Data Quality Report
**Dataset**: [name]
**Date**: [date]
**Series count**: [N]
**Date range**: [start] to [end]

### Issues Found

| Issue | Severity | Count | Action |
|-------|----------|-------|--------|
| Missing values | 🟡 Medium | 2.3% | Forward-fill |
| Short series (<52 wks) | 🔴 High | 34 series | Exclude from DL, use Chronos |
| Structural breaks | 🟡 Medium | 12 series | Use post-break only |
| Suspected stockouts | 🟡 Medium | 5.1% of zeros | Flag as covariate |
| Duplicate timestamps | 🔴 High | 0 | ✅ None |
| Future leakage | 🟢 Low | 0 | ✅ None |

### Recommendation
[Proceed / Proceed with caveats / Do not proceed until fixed]

### Series Excluded and Reason
[List if any]
```

---

## Drift Detection (Production)

```python
# Monitor input distribution in production
from scipy.stats import ks_2samp

def detect_data_drift(reference_stats, current_data, threshold=0.05):
    """
    Kolmogorov-Smirnov test for distribution shift
    Returns True if drift detected
    """
    stat, p_value = ks_2samp(reference_stats, current_data)
    return p_value < threshold, p_value
```

Alert when:
- Input feature distributions shift significantly
- Proportion of zeros/nulls changes
- Series length distribution changes (new or discontinued series)
