---
name: limited-resources-expert
description: Optimize ML workflows, training, and inference for constrained compute, memory, time, or data budgets. Use this skill when operating under resource constraints: small GPU memory, limited training data, tight inference latency, cost budgets, CPU-only environments, or edge deployment. Trigger on: "out of memory", "OOM", "too slow", "reduce cost", "small dataset", "CPU only", "optimize memory", "quantization", "pruning", "distillation", "few-shot", "low data regime", "edge deployment", "cheap alternative", "limited GPU", "optimize inference".
---

# Limited Resources Expert

## Resource Constraint Triage

Identify the binding constraint first:

```
□ GPU memory (OOM errors)    → Section: Memory Optimization
□ Training time too long     → Section: Training Speed
□ Inference latency too high → Section: Inference Optimization
□ Too little data            → Section: Low Data Regime
□ Cost too high              → Section: Cost Reduction
□ CPU-only environment       → Section: CPU-Optimized Models
```

---

## Memory Optimization

### Immediate fixes (no accuracy loss)
```python
# 1. Mixed precision training
from torch.cuda.amp import autocast, GradScaler
scaler = GradScaler()
with autocast():
    output = model(batch)
    loss = criterion(output, target)

# 2. Gradient accumulation (simulate larger batches)
accumulation_steps = 4  # Effective batch = batch_size * 4
for i, batch in enumerate(loader):
    loss = model(batch) / accumulation_steps
    loss.backward()
    if (i + 1) % accumulation_steps == 0:
        optimizer.step()
        optimizer.zero_grad()

# 3. Gradient checkpointing (trade compute for memory)
model.gradient_checkpointing_enable()

# 4. Reduce sequence length
# Cut input_chunk_length — often 50% reduction with <5% accuracy loss
```

### Architecture changes for memory
- Switch from Transformer to N-HiTS/DLinear (10–100x smaller)
- Use `float16` or `bfloat16` for model weights
- Channel-independent models (PatchTST style) vs full multivariate

---

## Training Speed

```python
# 1. torch.compile (PyTorch 2.0+)
model = torch.compile(model)

# 2. Increase num_workers (match to CPU cores - 1)
DataLoader(dataset, num_workers=4, pin_memory=True, prefetch_factor=2)

# 3. Profile bottleneck
with torch.profiler.profile() as prof:
    train_step()
print(prof.key_averages().table(sort_by="cuda_time_total", row_limit=10))

# 4. Reduce validation frequency
# Validate every 5 epochs instead of every epoch during early training
```

---

## Low Data Regime (< 500 timesteps)

| Strategy | Implementation | Notes |
|----------|---------------|-------|
| Pre-trained foundation model | Chronos (zero-shot) | No training needed |
| Transfer learning | Pre-train on similar domain, fine-tune | Requires source dataset |
| Data augmentation | Window jitter, magnitude scaling, frequency mixing | +20–40% effective data |
| Classical hybrids | ETS/ARIMA residuals as DL input | Handles trend robustly |
| Global model with regularization | Pool multiple short series | Needs related series |
| Reduce model size aggressively | N-HiTS with small MLP | Fewer params → less data needed |

### Data Augmentation for Time Series
```python
def augment_timeseries(x, config):
    augmentations = [
        ("jitter",      lambda x: x + np.random.normal(0, 0.05*x.std(), x.shape)),
        ("scaling",     lambda x: x * np.random.uniform(0.8, 1.2)),
        ("time_warp",   time_warp_transform),
        ("window_crop", lambda x: x[np.random.randint(0, len(x)//4):]),
    ]
    for name, fn in augmentations:
        if np.random.rand() < config.get(f"p_{name}", 0.5):
            x = fn(x)
    return x
```

---

## Inference Optimization

```python
# 1. Quantization (INT8 — 4x memory reduction, ~2x speedup)
quantized_model = torch.quantization.quantize_dynamic(
    model, {torch.nn.Linear}, dtype=torch.qint8
)

# 2. ONNX export for cross-platform speed
torch.onnx.export(model, dummy_input, "model.onnx", opset_version=14)

# 3. TorchScript
scripted = torch.jit.script(model)
scripted.save("model_scripted.pt")

# 4. Batch inference (always prefer over single-sample)
# Group series by forecast date and batch-infer together
```

**Latency targets by deployment type**:
- Dashboard / batch: No strict requirement — optimize cost instead
- API (background): < 500ms
- Real-time API: < 100ms → Use DLinear or quantized N-HiTS

---

## CPU-Optimized Model Stack

When GPU is unavailable:
1. **LightGBM with lag features** — Often matches DL quality, fast on CPU
2. **N-HiTS (small config)** — 30s/epoch on CPU for medium datasets
3. **DLinear** — Seconds per epoch, surprisingly competitive
4. **Chronos-tiny** — Foundation model, fast CPU inference
5. **statsforecast (nixtla)** — Classical models vectorized with numba, very fast

---

## Quick Cost-Reduction Checklist

```
Training:
  □ Spot instances enabled?
  □ max_run set appropriately?
  □ Right-sized instance (don't use p3 for small models)?
  □ Mixed precision enabled?
  □ Early stopping set?

Inference:
  □ Batch transform vs persistent endpoint?
  □ Serverless config considered?
  □ Auto-scaling configured (scale to zero)?
  □ Model quantized?
```
