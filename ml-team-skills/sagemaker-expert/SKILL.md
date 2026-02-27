---
name: sagemaker-expert
description: Expert guidance on using AWS SageMaker for ML workflows including training jobs, experiments, model registry, endpoints, pipelines, and monitoring for time series forecasting. Use this skill for anything SageMaker-related: setting up training jobs, deploying endpoints, using SageMaker Experiments, configuring spot training, SageMaker Pipelines, Feature Store, Model Monitor, or integrating SageMaker with MLflow. Trigger on: "SageMaker", "AWS training job", "SageMaker endpoint", "spot instances", "SageMaker Pipelines", "model registry AWS", "SageMaker Studio", "container for SageMaker", "deploying on AWS".
---

# SageMaker Expert

## SageMaker Workflow for Time Series Teams

```
Data Prep          Training              Deployment         Monitoring
─────────         ─────────────         ──────────         ──────────
S3 (raw data)  → Processing Job  →  Training Job  →  Endpoint      → Model Monitor
Feature Store  → SageMaker        →  Experiments  →  Async/Batch   → Data Quality
Data Wrangler    Pipelines         →  Model Reg.   →  Serverless    → Drift Detection
```

---

## Training Job Setup (PyTorch/Custom Container)

```python
from sagemaker.pytorch import PyTorch

estimator = PyTorch(
    entry_point="train.py",
    source_dir="src/",
    role=role,
    framework_version="2.1",
    py_version="py310",
    instance_type="ml.g4dn.xlarge",    # cost-effective GPU
    instance_count=1,
    
    # Cost optimization
    use_spot_instances=True,
    max_wait=7200,                      # 2hr max wait for spot
    max_run=3600,                       # 1hr max runtime
    checkpoint_s3_uri=f"s3://{bucket}/checkpoints/{job_name}",
    
    # Reproducibility
    hyperparameters={
        "seed": 42,
        "config": "configs/model_config.yaml",
    },
    
    # Experiment tracking
    enable_sagemaker_metrics=True,
    metric_definitions=[
        {"Name": "train:loss", "Regex": "train_loss=([0-9.]+)"},
        {"Name": "val:loss",   "Regex": "val_loss=([0-9.]+)"},
        {"Name": "val:mase",   "Regex": "val_mase=([0-9.]+)"},
    ],
)

estimator.fit({"train": train_uri, "val": val_uri}, wait=False)
```

---

## Instance Selection Guide

| Workload | Instance | Notes |
|----------|----------|-------|
| Small model (<50M params), prototyping | `ml.g4dn.xlarge` | $0.74/hr, T4 GPU |
| Medium model, standard training | `ml.g4dn.2xlarge` | $1.12/hr, T4 + more RAM |
| Large model / long sequences | `ml.g5.xlarge` | $1.41/hr, A10G GPU |
| Distributed training | `ml.g5.12xlarge` | 4x A10G |
| CPU-only (inference / preprocessing) | `ml.m5.xlarge` | $0.23/hr |
| Spot savings | Any above with `use_spot_instances=True` | 60–90% cheaper |

**Rule**: Always use spot for experimentation. Use on-demand only for production training jobs where interruption is unacceptable.

---

## SageMaker Experiments Integration

```python
import sagemaker
from sagemaker.experiments.run import Run

with Run(
    experiment_name="ts-forecasting-v2",
    run_name=f"tft-horizon24-{timestamp}",
    sagemaker_session=session,
) as run:
    run.log_parameter("architecture", "TFT")
    run.log_parameter("horizon", 24)
    run.log_metric("val_mase", 0.87)
    run.log_metric("val_coverage_90", 0.91)
    run.log_artifact(name="model_config", value="s3://path/config.yaml")
```

---

## Model Registry Workflow

```python
from sagemaker.model import Model
from sagemaker import ModelPackage

# Register model after training
model_package = estimator.register(
    model_package_group_name="ts-forecasting-models",
    content_types=["application/json"],
    response_types=["application/json"],
    inference_instances=["ml.m5.xlarge"],
    transform_instances=["ml.m5.xlarge"],
    approval_status="PendingManualApproval",  # Require human approval
    description=f"TFT model, val_mase=0.87, trained on {date}",
)
```

Always use `PendingManualApproval` for production-bound models. Build a lightweight approval checklist into the team workflow.

---

## Endpoint Deployment Patterns

| Pattern | Use Case | Config |
|---------|----------|--------|
| Real-time | Dashboard, API with <1s SLA | `ml.m5.xlarge`, auto-scaling |
| Async | Batch requests, large payloads | Async endpoint |
| Serverless | Sporadic traffic, cost-sensitive | Serverless config |
| Batch Transform | Scheduled forecasting jobs | No endpoint needed |

**Recommended for most forecasting**: Batch Transform (run nightly/weekly forecast job) rather than always-on endpoint.

---

## SageMaker Pipelines Template

```python
from sagemaker.workflow.pipeline import Pipeline
from sagemaker.workflow.steps import ProcessingStep, TrainingStep, TransformStep

pipeline = Pipeline(
    name="ts-forecasting-pipeline",
    steps=[
        data_quality_step,      # Check input data
        preprocessing_step,     # Feature engineering
        training_step,          # Train model
        evaluation_step,        # Compute metrics
        register_step,          # Register if metrics pass
        # Conditional: only deploy if val_mase < threshold
    ]
)
```

---

## Cost Management Rules

1. **Always** use spot for experimental runs
2. **Always** set `max_run` to prevent runaway jobs
3. Use `ml.g4dn.xlarge` as default GPU (not `ml.p3.2xlarge`)
4. Use Batch Transform over persistent endpoints when SLA allows
5. Enable S3 lifecycle policies on checkpoint buckets (delete after 30 days)
6. Tag all resources: `project`, `team`, `environment` (dev/staging/prod)
