# Architecture Reference Guide

## Table of Contents
1. Transformer-based: TFT, PatchTST, iTransformer, Crossformer
2. MLP-based: N-BEATS, N-HiTS, DLinear, NLinear
3. Foundation Models: Chronos, TimesFM, MOIRAI, Lag-Llama
4. Probabilistic: DeepAR, TimeGrad
5. CNN-based: TimesNet, SCINet

---

## 1. TFT — Temporal Fusion Transformer

**Library**: PyTorch Forecasting, GluonTS
**Inductive bias**: Explicit covariate handling, learned gating for variable selection
**Best for**: Forecasting with rich covariates (weather, promotions, calendar), interpretability required
**Horizon**: Short-medium (≤96 steps)
**Key hyperparameters**:
- `hidden_size`: 16–256 (scale with data volume)
- `attention_head_size`: 4
- `dropout`: 0.1–0.3
- `hidden_continuous_size`: 8–64
**Interpretability**: Native — variable importance + attention over time
**Weakness**: Slow training, needs substantial data per series

---

## 2. PatchTST

**Library**: Hugging Face, custom PyTorch
**Inductive bias**: Patches of time as tokens, channel-independent
**Best for**: Long-horizon, large dataset, univariate or weakly-coupled multivariate
**Horizon**: Medium-long (up to 720 steps)
**Key hyperparameters**:
- `patch_len`: 16 (typical)
- `stride`: 8
- `d_model`: 128–512
**Weakness**: No covariate support natively, channel-independent assumption

---

## 3. iTransformer

**Library**: Time-Series-Library (TSLib)
**Inductive bias**: Inverted attention — each variate as a token, attends across variables
**Best for**: Multivariate with strong cross-series correlations
**Horizon**: Long (96–720)
**Weakness**: Computationally expensive for many variates (>200)

---

## 4. N-BEATS / N-HiTS

**Library**: NeuralForecast (nixtla)
**Inductive bias**: Basis expansion, interpretable trend/seasonality decomposition (N-BEATS-I)
**Best for**: Univariate, mid-scale datasets, need fast training
**N-HiTS advantage**: Multi-rate sampling, better long-horizon
**Key hyperparameters**:
- `stack_types`: ["trend", "seasonality", "generic"]
- `n_blocks`: [3, 3, 3]
- `mlp_units`: [[512, 512], ...]
**Weakness**: No covariate support in base version

---

## 5. DLinear / NLinear

**Library**: TSLib, easy custom implementation
**Inductive bias**: Pure linear decomposition (trend + residual)
**Best for**: Baseline, production-constrained, surprisingly competitive
**Training time**: Minutes
**Rule**: Always run DLinear as a sanity check — if your complex model doesn't beat it, reconsider

---

## 6. Chronos (Amazon)

**Library**: `autogluon.timeseries` or `chronos-forecasting` (Hugging Face)
**Type**: Foundation model (T5-based)
**Best for**: Zero-shot or few-shot, diverse datasets, rapid prototyping
**Horizon**: Up to 64 steps zero-shot
**Sizes**: Tiny (8M) → Large (710M)
**Weakness**: Not fine-tunable easily, fixed context window

---

## 7. DeepAR

**Library**: GluonTS, SageMaker built-in
**Inductive bias**: Autoregressive RNN with global model across series
**Best for**: Probabilistic forecasting, many related series, sparse data
**Output**: Full distribution (parametric)
**SageMaker**: Native built-in algorithm — use for fast deployment
**Weakness**: Slow inference for large horizons, RNN limitations

---

## Comparison Summary Table

| Model | Covariates | Probabilistic | Interpretable | Horizon | Scale |
|-------|-----------|---------------|---------------|---------|-------|
| TFT | ✅ Rich | ✅ Quantile | ✅ Native | Short-Med | Medium |
| PatchTST | ❌ | ❌ | ❌ | Long | Large |
| iTransformer | ⚠️ Limited | ❌ | ❌ | Long | Large |
| N-BEATS | ❌ | ❌ | ✅ (I variant) | Short-Med | Medium |
| N-HiTS | ⚠️ Exogenous | ❌ | ❌ | Long | Medium |
| DLinear | ❌ | ❌ | ✅ | Long | Any |
| Chronos | ❌ | ✅ | ❌ | Short | Any |
| DeepAR | ✅ | ✅ Full dist | ❌ | Med | Large |
