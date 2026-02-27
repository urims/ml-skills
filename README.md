# c-skills — ML Team Agent Skills Framework

> **14 Claude skills for ML teams that deliver time series forecasting to non-technical stakeholders.**  
> Standardized. Reproducible. Stakeholder-aligned.

---

## What This Is

`c-skills` is a library of [Claude Skills](https://docs.claude.com) — structured prompt libraries that guide Claude toward consistent, high-quality, context-aware outputs across the full ML development lifecycle.

Each skill lives in its own folder with a `SKILL.md` file that Claude reads before responding. Skills are organized into **4 pillars** and **2 cross-cutting layers**.

---

## Skill Map

```
┌──────────────────────────────────────────────────────────────────┐
│              ML TEAM AGENT SKILLS FRAMEWORK                      │
├──────────────┬───────────────┬──────────────┬────────────────────┤
│   DELIVER    │     BUILD     │   OPERATE    │     GOVERN         │
│              │               │              │                    │
│ 🧿 Non-Tech  │ 🧬 TS DL Arch │ ☁️ SageMaker  │ 🔒 Reproducibility │
│ Explainability│ 📖 TS DL     │ ⚙️ Limited   │ 🛡️ Data Quality   │
│ 🔬 Technical │    Teacher    │   Resources  │   Guardian        │
│ Explainability│ ⚡ TS DL     │ 🔌 API Design│                    │
│ 📣 Stakeholder│   Training   │ ✨ UX for    │                    │
│ Comms        │               │   Developers │                    │
├──────────────┴───────────────┴──────────────┴────────────────────┤
│   CROSS-CUTTING:  🔄 Validation & Feedback Loop                  │
│   CROSS-CUTTING:  🧪 Experiment Facilitator                      │
└──────────────────────────────────────────────────────────────────┘
```

---

## Skill Index

| # | Skill Folder | Pillar | Type | Token Budget |
|---|---|---|---|---|
| 1 | [`non-technical-explainability`](ml-team-skills/non-technical-explainability/SKILL.md) | Deliver | Spell Card | Low ~800t |
| 2 | [`technical-explainability`](ml-team-skills/technical-explainability/SKILL.md) | Deliver | Effect Monster | Medium ~2kt |
| 3 | [`stakeholder-communication`](ml-team-skills/stakeholder-communication/SKILL.md) | Deliver | Spell Card | Low ~800t |
| 4 | [`timeseries-dl-architecture`](ml-team-skills/timeseries-dl-architecture/SKILL.md) | Build | Fusion Monster | High ~4kt |
| 5 | [`timeseries-dl-teacher`](ml-team-skills/timeseries-dl-teacher/SKILL.md) | Build | Effect Monster | Medium ~2kt |
| 6 | [`timeseries-dl-training`](ml-team-skills/timeseries-dl-training/SKILL.md) | Build | Ritual Monster | High ~4kt |
| 7 | [`sagemaker-expert`](ml-team-skills/sagemaker-expert/SKILL.md) | Operate | XYZ Monster | High ~3.5kt |
| 8 | [`limited-resources`](ml-team-skills/limited-resources/SKILL.md) | Operate | Effect Monster | Medium ~2kt |
| 9 | [`api-design`](ml-team-skills/api-design/SKILL.md) | Operate | Spell Card | Medium ~2kt |
| 10 | [`ux-developer`](ml-team-skills/ux-developer/SKILL.md) | Operate | Effect Monster | Medium ~2kt |
| 11 | [`reproducibility-standards`](ml-team-skills/reproducibility-standards/SKILL.md) | Govern | Continuous Spell | Medium ~2kt |
| 12 | [`data-quality-guardian`](ml-team-skills/data-quality-guardian/SKILL.md) | Govern | Effect Monster | Medium ~2kt |
| 13 | [`validation-feedback-loop`](ml-team-skills/validation-feedback-loop/SKILL.md) | Cross-Cutting | Trap Card | Medium ~2kt |
| 14 | [`experiment-facilitator`](ml-team-skills/experiment-facilitator/SKILL.md) | Cross-Cutting | Continuous Trap | Medium ~2kt |

---

## Repo Structure

```
c-skills/
│
├── README.md                          ← You are here
├── MLSkillCards.jsx                   ← Interactive card viewer (React)
│
└── ml-team-skills/
    ├── FRAMEWORK.md                   ← Architecture overview & design principles
    │
    ├── non-technical-explainability/
    │   └── SKILL.md
    ├── technical-explainability/
    │   └── SKILL.md
    ├── stakeholder-communication/
    │   └── SKILL.md
    ├── timeseries-dl-architecture/
    │   ├── SKILL.md
    │   └── references/
    │       └── architectures.md       ← Deep architecture comparison (TFT, N-HiTS, Chronos…)
    ├── timeseries-dl-teacher/
    │   └── SKILL.md
    ├── timeseries-dl-training/
    │   └── SKILL.md
    ├── sagemaker-expert/
    │   └── SKILL.md
    ├── limited-resources/
    │   └── SKILL.md
    ├── api-design/
    │   └── SKILL.md
    ├── ux-developer/
    │   └── SKILL.md
    ├── reproducibility-standards/
    │   └── SKILL.md
    ├── data-quality-guardian/
    │   └── SKILL.md
    ├── validation-feedback-loop/
    │   └── SKILL.md
    └── experiment-facilitator/
        └── SKILL.md
```

---

## The Forecasting Pipeline

Skills are designed to **chain**. A complete forecasting delivery follows this sequence:

```
data-quality-guardian
  └── timeseries-dl-architecture
        └── timeseries-dl-training
              └── validation-feedback-loop
                    └── non-technical-explainability
                          └── stakeholder-communication

Supporting at every stage:
  experiment-facilitator   → before every experiment
  reproducibility-standards → enforced throughout
  limited-resources        → on-demand optimization
  sagemaker-expert         → cloud execution
  timeseries-dl-teacher    → upskilling at any stage
```

---

## Design Principles

| # | Principle | What it means |
|---|---|---|
| 01 | **Stakeholder Alignment First** | Every technical decision traces back to a business outcome |
| 02 | **Token Efficiency** | Low / Medium / High budget tiers — no wasteful preamble |
| 03 | **Reproducibility by Default** | All outputs include seed, config hash, data checksum, git commit |
| 04 | **Explainability at Every Layer** | What happened → why → what it means for the business |
| 05 | **Compounding Skills** | Skills chain from raw data to stakeholder delivery |

---

## Interactive Card Viewer

`MLSkillCards.jsx` is a React component that presents all 14 skills as **Yu-Gi-Oh style trading cards** — built for team onboarding, demos, and sprint planning conversations.

### Run it

Drop it into any React project or paste it into [claude.ai](https://claude.ai) as an artifact:

```bash
# In a Vite/CRA project
cp MLSkillCards.jsx src/
# Import and render <MLSkillCards /> in your App
```

### Features

- **Gallery mode** — browse all 14 cards, filter by pillar, click to inspect full card effect
- **Duel mode** — draw random cards into a hand, play them to the field (max 4), build a "sprint lineup"
- Each card has: ATK/DEF stats, rarity foil effects, card type (Spell/Trap/Monster), flavor text, effect text, and keyword tags

### Card → Skill mapping

| Card Type | Skill Type |
|---|---|
| Effect Monster | Core skill with conditional logic |
| Spell Card | Always-on, no conditions |
| Trap Card | Reactive — activates on a trigger |
| Fusion Monster | Requires combining multiple skills |
| Ritual Monster | Requires a pre-activation checklist |
| XYZ Monster | Stacks resources (spot instances, logs…) |
| Continuous Spell/Trap | Permanent field effect |

---

## How to Add a New Skill

1. **Create the folder**: `ml-team-skills/your-skill-name/`
2. **Write `SKILL.md`** with YAML frontmatter:

```markdown
---
name: your-skill-name
description: >
  [What this skill does]. Use this skill when [context].
  Trigger on: "phrase 1", "phrase 2", [technical term].
  Always use this skill when [strong trigger condition].
---

# Your Skill Name

## Goal
[One paragraph on what this enables.]

## [Decision Tree / Mode Selection]
...

## Quality Checklist
- [ ] Criterion 1
- [ ] Criterion 2
```

3. **Add reference files** for deep content (`references/` subfolder, loaded on demand)
4. **Test with 3–5 prompts** — verify it triggers and produces the expected output
5. **Register in this README** (add a row to the Skill Index table)
6. **Add a card to `MLSkillCards.jsx`** (add an entry to the `CARDS` array)

### Description writing rules

The `description` field is the **trigger mechanism**. Claude decides whether to invoke a skill based solely on this field.

```
✅ Include:
  - Multiple trigger phrases (words a user would naturally type)
  - Domain-specific terms
  - Concrete example contexts
  - A "pushy" closing: "Always use this skill when X"

❌ Avoid:
  - Too short ("helps with time series")
  - Too generic ("use for any ML task")
  - Missing trigger phrases
  - No "always use" directive
```

---

## Token Budget Tiers

| Tier | Budget | Skills | Behavior |
|---|---|---|---|
| **Low** | ~800 tokens | Non-Tech Explainability, Stakeholder Comms | Structured templates only, no preamble |
| **Medium** | ~2,000 tokens | Teacher, Validation, API Design, UX, Reproducibility, Data Quality, Limited Resources | Step-by-step with checkpoints, reference files on demand |
| **High** | ~4,000 tokens | TS DL Architecture, TS DL Training, SageMaker | Full context reasoning, ADRs, statistical rigor |

---

## Governance

| Activity | Standard |
|---|---|
| **Review cycle** | Monthly — rotating reviewer checks output quality |
| **Updating a skill** | Any team member can PR; description changes require team review |
| **Deprecating a skill** | Add `DEPRECATED` notice, keep 60 days, remove after successor is proven |
| **Adding a skill** | Follow 5-step process above; 3 test prompts required before merge |
| **Skill conflicts** | If overlap > 50%, merge or add explicit exclusion language |

---

## Contributing

PRs welcome. When contributing a new skill:

- [ ] `SKILL.md` has YAML frontmatter with `name` and `description`
- [ ] Description includes at least 5 trigger phrases
- [ ] Body is under 500 lines
- [ ] Deep content is in `references/` (not inline)
- [ ] README Skill Index updated
- [ ] Card added to `MLSkillCards.jsx`
- [ ] 3 test prompts documented in the PR description

---

## License

MIT — use, adapt, and extend freely. Attribution appreciated.

---

*Built with Claude · Designed for ML teams delivering time series forecasting to business stakeholders*
