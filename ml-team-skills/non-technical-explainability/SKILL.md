---
name: non-technical-explainability
description: Translate ML model results, forecasts, errors, and decisions into plain business language for non-technical stakeholders. Use this skill whenever you need to explain model outputs, forecast results, prediction intervals, model limitations, or ML concepts to executives, product owners, clients, or any audience without a data science background. Trigger when the user says "explain this to stakeholders", "make this non-technical", "business summary", "executive summary", or when presenting model results to non-ML audiences. Always use this skill before delivering any ML output to a non-technical audience.
---

# Non-Technical Explainability

## Goal
Convert ML complexity into clear, confidence-inspiring narratives that drive stakeholder decisions — without sacrificing accuracy.

## Output Structure (always follow this order)

### 1. The Bottom Line (2–3 sentences max)
State the finding, what it means for the business, and the recommended action. Use present tense and active voice.

### 2. What We Did (1 short paragraph)
Describe the process in business terms. No algorithm names. Use analogies.

### 3. What We Found (visualizable)
Use one of these formats:
- **Traffic light table**: Red/Yellow/Green status per metric
- **Before/After comparison**: Baseline vs model
- **Simple forecast chart description**: "Sales are expected to rise 12% in Q2, with a likely range of 8%–16%"

### 4. Confidence & Caveats (bullet list, max 4 items)
Be honest about uncertainty. Frame caveats as conditions, not failures.

### 5. What Happens Next
One clear recommended next step for the stakeholder.

---

## Language Rules

| ❌ Avoid | ✅ Use Instead |
|---------|---------------|
| RMSE, MAE, MAPE | "Our predictions are typically within X% of actual values" |
| Hyperparameter tuning | "We adjusted the model's settings to improve accuracy" |
| Overfitting | "The model worked well in testing but may struggle with unusual future patterns" |
| Training/Validation split | "We tested predictions on data the model had never seen before" |
| Neural network / LSTM / Transformer | "A pattern-learning system trained on historical data" |
| Confidence interval | "The likely range" or "we expect values between X and Y" |
| Feature importance | "The factors that most influenced this forecast" |
| Anomaly | "Unusual pattern" or "unexpected spike/drop" |

---

## Analogy Bank (use when explaining models)

- **Time series forecasting** → "Like a weather forecast, but for your business metrics"
- **Model training** → "Like teaching an intern by showing them thousands of past examples"
- **Prediction intervals** → "Like a GPS saying 'arrive in 20–30 minutes' — a range, not a guarantee"
- **Feature importance** → "Which dials matter most when the model makes a prediction"
- **Model drift** → "Like a recipe that works perfectly one season but needs adjusting when ingredients change"

---

## Quality Checklist
Before delivering a non-technical explanation, verify:
- [ ] No unexplained acronyms or technical terms
- [ ] Numbers are contextual (not just percentages — say "12% more than last year")
- [ ] Uncertainty is framed positively ("we're confident within this range")
- [ ] There is exactly ONE clear recommended action
- [ ] The explanation would make sense to a smart 12-year-old
