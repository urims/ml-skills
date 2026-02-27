---
name: api-design-expert
description: Design clean, robust, and well-documented APIs for ML model serving, forecasting endpoints, and data pipelines. Use this skill when designing or reviewing REST APIs, async APIs, batch APIs, or internal ML service interfaces. Trigger on: "design an API", "API endpoint", "REST API for the model", "API schema", "request/response format", "API documentation", "FastAPI", "API contract", "versioning", "rate limiting", or any request to expose ML model functionality as a service.
---

# API Design Expert for ML Services

## Design Principles for ML APIs

1. **Contract-first**: Define schema before implementation
2. **Stakeholder-readable**: Non-technical users may call or inspect these APIs
3. **Explicit uncertainty**: Forecasting APIs must expose prediction intervals, not just point forecasts
4. **Idempotency**: Same request → same response (critical for reproducibility)
5. **Version from day 1**: Breaking changes are inevitable in ML systems

---

## Forecasting API Standard Schema

### Request
```json
{
  "series_id": "store_001_product_A",
  "forecast_horizon": 24,
  "frequency": "H",
  "history": {
    "timestamps": ["2024-01-01T00:00:00Z", "..."],
    "values": [142.5, 138.2, "..."]
  },
  "covariates": {
    "known_future": {
      "is_holiday": [false, true, "..."],
      "temperature_forecast": [12.3, 11.8, "..."]
    }
  },
  "options": {
    "quantiles": [0.1, 0.5, 0.9],
    "return_explanations": false,
    "model_version": "v2.1"
  }
}
```

### Response
```json
{
  "series_id": "store_001_product_A",
  "model_version": "v2.1",
  "generated_at": "2024-01-15T10:23:45Z",
  "forecast": {
    "timestamps": ["2024-01-16T00:00:00Z", "..."],
    "point_forecast": [145.2, 148.7, "..."],
    "quantiles": {
      "0.1": [120.1, 123.4, "..."],
      "0.5": [145.2, 148.7, "..."],
      "0.9": [168.3, 172.1, "..."]
    }
  },
  "metadata": {
    "input_length_used": 168,
    "model_confidence": "high",
    "warnings": []
  }
}
```

---

## API Endpoint Structure

```
POST   /v1/forecasts              — Single series forecast
POST   /v1/forecasts/batch        — Multiple series (async)
GET    /v1/forecasts/{job_id}     — Retrieve async result
GET    /v1/models                 — List available models
GET    /v1/models/{version}       — Model card & metadata
POST   /v1/explain                — Feature attribution for a forecast
GET    /v1/health                 — Health + model loaded status
GET    /v1/metrics                — Prometheus-compatible metrics
```

---

## FastAPI Implementation Template

```python
from fastapi import FastAPI, BackgroundTasks, HTTPException
from pydantic import BaseModel, Field
from typing import Optional
import uuid

app = FastAPI(
    title="Time Series Forecasting API",
    version="1.0.0",
    description="Forecasting service for [business context]"
)

class ForecastRequest(BaseModel):
    series_id: str = Field(..., description="Unique series identifier")
    forecast_horizon: int = Field(..., ge=1, le=720, description="Steps to forecast")
    history: TimeSeriesHistory
    options: Optional[ForecastOptions] = ForecastOptions()

    class Config:
        schema_extra = {"example": {...}}  # Always include example

class ForecastResponse(BaseModel):
    series_id: str
    model_version: str
    generated_at: datetime
    forecast: ForecastResult
    metadata: ForecastMetadata

@app.post("/v1/forecasts", response_model=ForecastResponse)
async def create_forecast(request: ForecastRequest):
    try:
        result = await forecast_service.predict(request)
        return result
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except ModelNotReadyError:
        raise HTTPException(status_code=503, detail="Model not loaded")
```

---

## Error Response Standard

```json
{
  "error": {
    "code": "INSUFFICIENT_HISTORY",
    "message": "Requires at least 48 data points, received 12",
    "detail": "The model needs sufficient history to detect seasonal patterns",
    "docs_url": "https://docs.yourservice.com/errors/INSUFFICIENT_HISTORY"
  },
  "request_id": "req_abc123",
  "timestamp": "2024-01-15T10:23:45Z"
}
```

Error codes for ML services:
- `INSUFFICIENT_HISTORY` — Too few data points
- `FUTURE_COVARIATE_MISMATCH` — Covariates don't cover forecast horizon
- `SERIES_NOT_FOUND` — Series ID unknown
- `MODEL_VERSION_UNAVAILABLE` — Requested version not deployed
- `FORECAST_HORIZON_EXCEEDED` — Request beyond model capability
- `DATA_QUALITY_WARNING` — Input passed but with quality issues

---

## API Documentation Standards

Every endpoint must have:
- [ ] Description of business use case (not just technical)
- [ ] Example request and response (real data, not dummy)
- [ ] All error codes documented
- [ ] Rate limits stated
- [ ] SLA for response time stated
- [ ] Model version changelog link

---

## Versioning Strategy

```
/v1/forecasts  — Stable, no breaking changes
/v2/forecasts  — New version (parallel deployment)

Deprecation policy:
- Announce 60 days before sunset
- Return Deprecation header in responses
- Sunset: 90 days after v+1 launch
```
