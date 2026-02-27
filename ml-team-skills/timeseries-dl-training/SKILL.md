---
name: timeseries-dl-training
description: Expert guidance on training deep learning models for time series forecasting — covering data pipelines, loss functions, optimization, regularization, hyperparameter tuning, and debugging training runs. Use this skill for anything related to the training process: loss not converging, choosing optimizers, setting up dataloaders for time series, mixed precision training, hyperparameter search, learning rate scheduling, early stopping strategies, or diagnosing training instabilities. Trigger on: "training the model", "loss diverging", "hyperparameter tuning", "optimizer", "learning rate", "overfitting", "batch size", "dataloader", "training loop", "fine-tuning", "transfer learning for time series".
---

# Timeseries DL Training Expert

## Pre-Training Checklist

Before writing any training code, verify:

```
Data:
  □ No target leakage in features (future information)
  □ Correct temporal train/val/test split (no shuffling across time)
  □ Scaling fit on train set only, applied to val/test
  □ NaN/inf checks passed
  □ Series with insufficient length removed or handled
  □ Frequency alignment verified (all series same freq)

Config:
  □ Random seed set (Python, NumPy, PyTorch)
  □ Deterministic mode enabled (torch.use_deterministic_algorithms)
  □ Config saved as artifact before training starts
  □ Experiment name registered in tracker
```

---

## Training Configuration Template

```python
training_config = {
    # Data
    "input_chunk_length": 168,      # context window (hours in a week for hourly data)
    "output_chunk_length": 24,       # forecast horizon
    "batch_size": 64,                # start here, tune if OOM
    
    # Optimization
    "optimizer": "AdamW",
    "learning_rate": 1e-3,           # start with 1e-3, use LR finder
    "weight_decay": 1e-5,
    "gradient_clip_val": 1.0,        # critical for RNNs, good practice for all
    
    # Scheduling
    "lr_scheduler": "ReduceLROnPlateau",
    "scheduler_patience": 5,
    "scheduler_factor": 0.5,
    
    # Regularization
    "dropout": 0.1,
    "early_stopping_patience": 15,
    "early_stopping_metric": "val_loss",
    
    # Reproducibility
    "seed": 42,
    "num_workers": 4,
    "pin_memory": True,
    
    # Logging
    "log_every_n_steps": 10,
    "val_check_interval": 1.0,       # validate every epoch
}
```

---

## Loss Function Selection

| Use Case | Recommended Loss | Notes |
|----------|-----------------|-------|
| Point forecast, symmetric errors | MAE (L1) | Robust to outliers |
| Point forecast, penalize large errors | MSE (L2) | Common default |
| Quantile forecast | Pinball / QuantileLoss | One per quantile level |
| Probabilistic, normal assumption | NLL-Gaussian | Fast, parametric |
| Probabilistic, flexible distribution | CRPS | Gold standard, expensive |
| Intermittent / zero-inflated | Tweedie / Zero-inflated NB | E-commerce, spare parts |
| Log-normal targets | Log-space MSE | Revenue, traffic |

---

## Debugging Training Runs

### Loss not decreasing
```
1. Check learning rate: try LR range test (fastai-style)
2. Check gradient flow: log grad_norm per layer
3. Verify loss is not NaN from the start (log first batch loss)
4. Reduce model size: is it under-constrained?
5. Check data pipeline: verify a batch looks correct
```

### Loss oscillating / unstable
```
1. Lower learning rate by 10x
2. Add gradient clipping (clip_val=1.0)
3. Check for extreme values in input (normalize properly)
4. Reduce batch size (smoother gradients)
5. Switch optimizer: SGD with momentum → AdamW
```

### Good train loss, poor val loss (overfitting)
```
1. Increase dropout (0.1 → 0.3)
2. Add weight decay (1e-5 → 1e-3)
3. Reduce model capacity (fewer layers/hidden units)
4. Add data augmentation (window jitter, magnitude scaling)
5. Use early stopping more aggressively
```

### Poor both train and val loss (underfitting)
```
1. Increase model capacity
2. Extend input_chunk_length (more context)
3. Add covariates (calendar, external features)
4. Train longer (more epochs)
5. Check if problem is fundamentally hard (noisy targets)
```

---

## Hyperparameter Tuning Strategy

Priority order (tune in this order, fix previous):
1. `learning_rate` — most impactful
2. `input_chunk_length` — task-specific
3. `hidden_size` / `d_model` — capacity
4. `batch_size` — training stability
5. `dropout` — regularization
6. Architecture-specific params

**Recommended approach**:
- Start with Optuna (TPE sampler)
- 50 trials for initial search, 20 for refinement
- Use Successive Halving for compute efficiency
- Always include a fixed seed trial (reference point)

```python
# Optuna objective template
def objective(trial):
    config = {
        "learning_rate": trial.suggest_float("lr", 1e-4, 1e-2, log=True),
        "hidden_size": trial.suggest_categorical("hidden", [64, 128, 256]),
        "dropout": trial.suggest_float("dropout", 0.0, 0.4),
        "batch_size": trial.suggest_categorical("batch", [32, 64, 128]),
    }
    val_loss = train_and_evaluate(config)
    return val_loss
```

---

## Experiment Tracking Requirements

Every training run must log:
```
- All config params (flattened)
- System info: GPU, CUDA, library versions
- Data stats: n_series, n_timesteps, split dates
- Per-epoch: train_loss, val_loss, grad_norm, lr
- Final: all eval metrics on test set
- Artifacts: best checkpoint, config.yaml, feature list
- Tags: architecture, dataset_name, experiment_group
```

Recommended tools: MLflow (SageMaker-compatible), Weights & Biases, or DVC.
