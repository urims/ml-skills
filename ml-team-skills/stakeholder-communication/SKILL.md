---
name: stakeholder-communication
description: Craft stakeholder-aligned communications about ML projects — including project updates, forecast delivery emails, model change announcements, limitation disclosures, and confidence communications. Use this skill when preparing any written communication about ML work for non-technical audiences: status updates, results presentations, model version announcements, risk disclosures, or project proposals. Trigger on: "write an update for stakeholders", "communicate the results", "announcement", "present the forecast", "explain the delay", "stakeholder presentation", "project proposal for business", "communicate model change", "model rollout".
---

# Stakeholder Communication

## Core Principle: Lead with Business Impact

Stakeholders don't care about your model. They care about what the model enables them to do better.

**Wrong**: "We trained a TFT with attention mechanism and achieved MASE of 0.87"
**Right**: "Our new forecasting system predicts sales within 8% accuracy — 13% better than last quarter — which means your team can place orders with greater confidence"

---

## Communication Templates

### Forecast Delivery (Regular)

```
Subject: [Product/Store] Forecast — Week of [date]

Hi [Name],

Here's your forecast summary for this week.

HEADLINE
────────
Sales are expected to be [X units / $Y], [up/down] [Z%] vs last week.
We're [highly/moderately] confident in this forecast (typical error: ±[N]%).

TOP 3 ITEMS TO WATCH
────────────────────
1. [Item A]: Expected spike (+28%) — likely driven by upcoming promotion
2. [Item B]: Below-trend prediction — model detects early seasonal slowdown
3. [Item C]: Higher uncertainty than usual — insufficient recent data

RECOMMENDED ACTIONS
──────────────────
• [Action 1 based on forecast]
• [Action 2]

DETAIL
──────
[Link to dashboard / attached table]

Questions? Reply here or book 15 min: [calendar link]

[Name], [Team]
```

---

### Model Update Announcement

```
Subject: Forecasting Update — New Model Live [date]

Hi [Stakeholder Group],

We've updated our forecasting model. Here's what changed and what it means for you.

WHAT'S NEW
──────────
Our forecasts are now [X%] more accurate for [product/category/region].
The biggest improvement is in [specific area].

WHAT STAYS THE SAME
───────────────────
• How you access forecasts: [same dashboard/API/report]
• Forecast frequency: [weekly]
• Format of the output: [same columns/structure]

WHAT TO EXPECT
──────────────
You may notice [specific change, e.g., "tighter prediction intervals" or
"different holiday patterns"]. This is expected and reflects [brief reason].

For 2–4 weeks after the switch, we'll monitor performance closely and are
happy to discuss any forecasts that look surprising.

PERFORMANCE SUMMARY
───────────────────
Previous model accuracy: ±[X]%
New model accuracy:      ±[Y]%

[Your name] is available to walk through examples with your team.

[Name], [Team]
```

---

### Communicating Uncertainty to Stakeholders

Bad: "The model has an MAPE of 12%"
Good framework:

```
Confidence level language guide:
  High confidence   → "We expect X, and our forecasts are usually within 5–10% of actual"
  Medium confidence → "Our best estimate is X, though we'd plan for a range of [A–B]"
  Low confidence    → "This is harder to predict — we suggest planning for both [low] and [high] scenarios"
  
Uncertainty causes (explain simply):
  New product       → "Less history means more uncertainty — we'll refine as data comes in"
  Unusual event     → "This situation is different from what the model was trained on"
  Long horizon      → "Forecasts further out are naturally less certain, like a weather forecast"
```

---

### Disclosing Limitations Proactively

Template:
```
KNOWN LIMITATIONS
─────────────────
Our forecasts work best for:
  ✅ Established products (12+ months of history)
  ✅ Normal business conditions
  ✅ 1–8 week forecast horizons

They are less reliable for:
  ⚠️  New products or relaunches (we flag these with a caution indicator)
  ⚠️  Periods with large promotions not seen before
  ⚠️  Forecasts beyond 8 weeks

We will always flag forecasts in these categories. For these cases,
please apply business judgment alongside the model output.
```

---

## Meeting Facilitation: Forecast Review

Agenda template (30 min):
```
1. [5 min] What happened last week vs forecast (show 3 examples: good, average, bad)
2. [10 min] This week's forecast — top signals and recommendations
3. [10 min] Business context the model doesn't know (promotions, supply issues, news)
4. [5 min] Flag any forecasts to watch / override decisions

Output: Action list with owners
```

---

## Escalation Language

When the model should NOT be trusted for a decision:
```
"For [specific situation], we recommend not relying solely on the model forecast.
Here's why: [brief reason].
Suggested approach: [manual review / conservative buffer / human judgment].
We're working on improving this — [timeline if known]."
```

Never: Hide limitations. Always: Surface them proactively with a suggested workaround.
