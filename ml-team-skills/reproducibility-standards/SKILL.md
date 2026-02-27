---
name: reproducibility-standards
description: Enforce and implement reproducibility best practices across all ML workflows — from data versioning to model artifacts, ensuring any experiment can be re-run and any result can be traced. Use this skill when setting up a new project, reviewing code for reproducibility issues, creating model cards, setting up DVC/MLflow, or auditing whether results can be reproduced. Trigger on: "reproducibility", "reproduce this experiment", "model card", "data versioning", "DVC", "artifact tracking", "environment setup", "requirements.txt", "Docker", "seed", "determinism", or any question about ensuring results can be recreated.
---

# Reproducibility Standards

## Why Reproducibility Matters Here
Non-technical stakeholders will ask "can you prove this?" or "what changed between versions?" Reproducibility is your answer.

---

## Reproducibility Checklist (Required for All Experiments)

```
Code:
  □ All random seeds fixed (Python, NumPy, PyTorch, CUDA)
  □ Deterministic mode enabled where possible
  □ Config externalized (no magic numbers in code)
  □ Environment pinned (requirements.txt or conda env)
  □ Code versioned in Git (commit hash logged)

Data:
  □ Raw data versioned (DVC or S3 versioning)
  □ Train/val/test split logic is deterministic
  □ Preprocessing steps logged with checksum of output
  □ No manual data edits (all transformations in code)

Model:
  □ Best checkpoint saved with all metadata
  □ Model card written (see template below)
  □ Hyperparameter config saved as YAML artifact
  □ Training metrics logged to experiment tracker

Results:
  □ Predictions include model version and generation timestamp
  □ Evaluation metrics computed from saved artifacts (not live)
  □ Results table includes error bars (mean ± std)
```

---

## Seed Management

```python
def set_all_seeds(seed: int = 42):
    import random, os, numpy as np, torch
    random.seed(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)
    torch.cuda.manual_seed_all(seed)
    os.environ["PYTHONHASHSEED"] = str(seed)
    # For full determinism (may slow training)
    torch.backends.cudnn.deterministic = True
    torch.backends.cudnn.benchmark = False

# Always call before any data loading or model initialization
set_all_seeds(config.seed)
```

---

## Environment Pinning

```bash
# Generate locked requirements
pip freeze > requirements-lock.txt

# Better: use pip-tools
pip-compile requirements.in --output-file requirements.txt

# Best: containerize
# Dockerfile
FROM pytorch/pytorch:2.1.0-cuda11.8-cudnn8-runtime
COPY requirements-lock.txt .
RUN pip install --no-cache-dir -r requirements-lock.txt
```

Always record:
```python
reproducibility_metadata = {
    "python_version": sys.version,
    "pytorch_version": torch.__version__,
    "cuda_version": torch.version.cuda,
    "numpy_version": np.__version__,
    "git_commit": subprocess.check_output(["git", "rev-parse", "HEAD"]).decode().strip(),
    "git_dirty": bool(subprocess.check_output(["git", "status", "--porcelain"])),
}
```

---

## Data Versioning with DVC

```bash
# Initialize
dvc init
dvc remote add -d s3remote s3://your-bucket/dvc-cache

# Version a dataset
dvc add data/raw/sales_data.csv
git add data/raw/sales_data.csv.dvc .gitignore
git commit -m "Add sales data v1.0"

# Reproduce pipeline
dvc repro  # Runs only changed stages

# dvc.yaml pipeline definition
stages:
  preprocess:
    cmd: python src/preprocess.py
    deps:
      - data/raw/sales_data.csv
      - src/preprocess.py
      - configs/preprocess_config.yaml
    outs:
      - data/processed/train.parquet
      - data/processed/val.parquet
      - data/processed/test.parquet
    metrics:
      - metrics/data_stats.json
```

---

## Model Card Template

```markdown
# Model Card: [Model Name] v[Version]

## Model Details
- **Architecture**: [e.g., TFT]
- **Version**: v2.1
- **Trained**: 2024-01-20
- **Owner**: [team/person]
- **Git commit**: abc1234

## Intended Use
- **Primary use**: [Forecast weekly demand for SKUs in Store X]
- **Out-of-scope**: [Not intended for new products (<3 months history)]

## Training Data
- **Source**: [S3 path + DVC hash]
- **Period**: 2021-01-01 to 2023-12-31
- **Series count**: 487 SKUs
- **Frequency**: Weekly

## Performance
| Metric | Value | Baseline |
|--------|-------|----------|
| MASE | 0.87 | 1.00 |
| Coverage 90% | 91% | — |
| CRPS | 12.3 | 14.1 |

Evaluation: 5-fold backtest on 2023-Q3/Q4

## Limitations & Known Issues
- Cold start: MASE > 2.0 for series with < 26 weeks of history
- Holiday weeks: Coverage drops to ~82%
- Not tested on: new store formats, international markets

## Reproducibility
- Config: [S3 path/config.yaml]
- Checkpoint: [S3 path/model.pt]
- Environment: [requirements-lock.txt hash]
- Reproduce with: `make reproduce-v2.1`
```

---

## Git Practices for ML Teams

```bash
# Commit convention
feat: add weather covariates to TFT training
fix: correct temporal leakage in holiday feature
exp: EXP-003a weather covariate ablation
data: update sales data to include 2024-Q1
chore: pin torch==2.1.0 in requirements

# Never commit:
# - Model weights (use DVC or S3)
# - Data files (use DVC)
# - .env files with credentials
# - Jupyter notebook outputs (use nbstripout)
```
