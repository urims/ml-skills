import { useState, useEffect, useRef } from "react";

const CARDS = [
  {
    id: 1,
    name: "The Stakeholder Whisperer",
    skill: "non-technical-explainability",
    pillar: "DELIVER",
    type: "Spell Card",
    attribute: "LIGHT",
    atk: 800, def: 2800,
    level: 3,
    rarity: "Rare",
    art: "🧿",
    flavorText: "Transforms cryptic model outputs into business clarity. Non-technical stakeholders gain +2800 trust points.",
    effect: "When this card is activated, translate any ML result into: Bottom Line → What We Did → Confidence & Caveats → Next Action. Cannot be countered by technical jargon.",
    tags: ["stakeholder", "communication", "explainability"],
    pillarColor: "#0E8C8C",
    cardColor: "#0a6060",
    foilColor: "linear-gradient(135deg, #00ffcc22, #ffffff11, #00ffcc22)",
  },
  {
    id: 2,
    name: "Technical Oracle",
    skill: "technical-explainability",
    pillar: "DELIVER",
    type: "Effect Monster",
    attribute: "DARK",
    atk: 2100, def: 1600,
    level: 6,
    rarity: "Super Rare",
    art: "🔬",
    flavorText: "Sees through the model's layers. Wields SHAP values like a blade and reads attention maps like ancient scrolls.",
    effect: "Choose 1 mode: Architecture / Training Dynamics / Prediction Attribution / Error Analysis / Experiment Comparison. Apply that mode's template. Gain statistical significance before reporting results.",
    tags: ["debugging", "attribution", "SHAP", "error analysis"],
    pillarColor: "#0E8C8C",
    cardColor: "#0a6060",
    foilColor: "linear-gradient(135deg, #cc00ff22, #ffffff11, #cc00ff22)",
  },
  {
    id: 3,
    name: "Stakeholder Herald",
    skill: "stakeholder-communication",
    pillar: "DELIVER",
    type: "Spell Card",
    attribute: "LIGHT",
    atk: 600, def: 2400,
    level: 2,
    rarity: "Common",
    art: "📣",
    flavorText: "Master of business narrative. Turns model updates into executive-ready announcements that inspire confidence, not confusion.",
    effect: "Write forecast delivery emails, model announcements, and limitation disclosures. All communications include Confidence Level (High/Medium/Low) and One Clear Next Action. Permanently silences the question 'what does this mean for us?'",
    tags: ["email", "announcement", "confidence language"],
    pillarColor: "#0E8C8C",
    cardColor: "#0a6060",
    foilColor: "linear-gradient(135deg, #ffcc0022, #ffffff11, #ffcc0022)",
  },
  {
    id: 4,
    name: "Architecture Archfiend",
    skill: "timeseries-dl-architecture",
    pillar: "BUILD",
    type: "Fusion Monster",
    attribute: "DARK",
    atk: 3200, def: 2400,
    level: 9,
    rarity: "Secret Rare",
    art: "🧬",
    flavorText: "Born from the fusion of TFT, N-HiTS, and PatchTST knowledge. Speaks fluent inductive bias. Writes ADRs in its sleep.",
    effect: "Step 1: Run Problem Characterization Checklist. Step 2: Consult Architecture Selection Matrix. Step 3: Generate Architecture Decision Record. This card cannot be Normal Summoned — must be Special Summoned by completing a baseline hierarchy (Naive → Statistical → ML → Simple DL).",
    tags: ["TFT", "N-BEATS", "PatchTST", "Chronos", "architecture decision"],
    pillarColor: "#1A4D8C",
    cardColor: "#102a55",
    foilColor: "linear-gradient(135deg, #ff000033, #ffffff11, #ff000033)",
  },
  {
    id: 5,
    name: "Sensei of Sequences",
    skill: "timeseries-dl-teacher",
    pillar: "BUILD",
    type: "Effect Monster",
    attribute: "LIGHT",
    atk: 1200, def: 2000,
    level: 4,
    rarity: "Rare",
    art: "📖",
    flavorText: "Speaks to beginners in analogies, to experts in equations. Has never let a student leave confused — not even about positional encoding.",
    effect: "Assess student level (Beginner/Intermediate/Advanced/Expert). Apply Concept Teaching Template: One-line intuition → Why it matters → How it works (calibrated) → Code sketch → Misconceptions → What to learn next. Can teach any concept from stationarity to foundation models.",
    tags: ["teaching", "curriculum", "analogies", "learning path"],
    pillarColor: "#1A4D8C",
    cardColor: "#102a55",
    foilColor: "linear-gradient(135deg, #00ccff22, #ffffff11, #00ccff22)",
  },
  {
    id: 6,
    name: "Gradient Descent God",
    skill: "timeseries-dl-training",
    pillar: "BUILD",
    type: "Ritual Monster",
    attribute: "FIRE",
    atk: 3000, def: 1800,
    level: 8,
    rarity: "Ultra Rare",
    art: "⚡",
    flavorText: "Summoned only after the Pre-Training Checklist ritual is complete. Commands loss curves to converge. Destroys NaN gradients on sight.",
    effect: "ALWAYS activate Pre-Training Checklist before summoning. Select correct Loss Function from matrix (MAE/MSE/CRPS/Tweedie). On training failure, activate Debugging Decision Tree. When opponent plays 'Overfitting', counter with dropout + weight decay. Uses Optuna for hyperparameter ritualism.",
    tags: ["optimizer", "loss function", "debugging", "Optuna", "mixed precision"],
    pillarColor: "#1A4D8C",
    cardColor: "#102a55",
    foilColor: "linear-gradient(135deg, #ff660033, #ffffff11, #ff880033)",
  },
  {
    id: 7,
    name: "Cloud Warlord SageMaker",
    skill: "sagemaker-expert",
    pillar: "OPERATE",
    type: "XYZ Monster",
    attribute: "WIND",
    atk: 2800, def: 2200,
    level: 7,
    rarity: "Ultra Rare",
    art: "☁️",
    flavorText: "Ruler of all training jobs. Hoards spot instances. Demands all resources be tagged with project, team, and environment.",
    effect: "Attach 1 Spot Instance token (save 60-90% cost). Equip SageMaker Experiments to log all metrics. When model passes evaluation, send to Model Registry (PendingManualApproval). Special ability: Deploy as Batch Transform — destroy persistent endpoints to cut cost.",
    tags: ["AWS", "spot instances", "model registry", "pipelines", "batch transform"],
    pillarColor: "#5C3A7A",
    cardColor: "#321548",
    foilColor: "linear-gradient(135deg, #cc99ff33, #ffffff11, #cc99ff33)",
  },
  {
    id: 8,
    name: "Resource Miser",
    skill: "limited-resources-expert",
    pillar: "OPERATE",
    type: "Effect Monster",
    attribute: "EARTH",
    atk: 1600, def: 2600,
    level: 5,
    rarity: "Super Rare",
    art: "⚙️",
    flavorText: "Does more with less. Has trained a model on a CPU with 4GB RAM and still beat the baseline. Mixed precision flows through its veins.",
    effect: "Identify binding constraint (GPU Memory / Training Time / Latency / Data / Cost / CPU-only). Activate matching optimization: OOM → Mixed Precision + Gradient Accumulation. Low data → Chronos zero-shot + augmentation. Latency → INT8 Quantization + ONNX. Always uses DLinear as sanity check.",
    tags: ["OOM", "quantization", "ONNX", "mixed precision", "low data", "CPU"],
    pillarColor: "#5C3A7A",
    cardColor: "#321548",
    foilColor: "linear-gradient(135deg, #aaffaa22, #ffffff11, #aaffaa22)",
  },
  {
    id: 9,
    name: "API Architect Prime",
    skill: "api-design-expert",
    pillar: "OPERATE",
    type: "Spell Card",
    attribute: "WIND",
    atk: 1800, def: 1800,
    level: 5,
    rarity: "Rare",
    art: "🔌",
    flavorText: "Summoner of clean contracts. Every endpoint has an example. Every error code has a human-readable message. Versioning from Day 1, always.",
    effect: "Generate Forecast API schema (request + response with quantiles). Structure: POST /v1/forecasts, GET /models/{version}, POST /v1/explain. All error responses include code, message, detail, docs_url. Must include Deprecation policy (60-day notice, 90-day sunset).",
    tags: ["REST", "FastAPI", "Pydantic", "versioning", "error codes"],
    pillarColor: "#5C3A7A",
    cardColor: "#321548",
    foilColor: "linear-gradient(135deg, #00ffff22, #ffffff11, #00ffff22)",
  },
  {
    id: 10,
    name: "DX Deity",
    skill: "ux-developer",
    pillar: "OPERATE",
    type: "Effect Monster",
    attribute: "LIGHT",
    atk: 1400, def: 2200,
    level: 4,
    rarity: "Super Rare",
    art: "✨",
    flavorText: "Patron god of developer experience. Writes error messages that actually help. Configuration cells. Progressive complexity. The Pit of Success is its home.",
    effect: "Apply Pit of Success principle: right thing easy, wrong thing hard. SDK must support 3 levels (default → config → full control). CLI must include --dry-run, --verbose, --help. Every error message includes: what went wrong + how to fix it + docs link. New tool must be usable on Day 1 without asking for help.",
    tags: ["SDK", "CLI", "notebooks", "error messages", "onboarding"],
    pillarColor: "#5C3A7A",
    cardColor: "#321548",
    foilColor: "linear-gradient(135deg, #ffffaa22, #ffffff11, #ffffaa22)",
  },
  {
    id: 11,
    name: "The Eternal Seed",
    skill: "reproducibility-standards",
    pillar: "GOVERN",
    type: "Continuous Spell",
    attribute: "EARTH",
    atk: 0, def: 3500,
    level: 4,
    rarity: "Super Rare",
    art: "🔒",
    flavorText: "set_all_seeds(42). The one invocation that must always come first. Keeper of checksums. Author of model cards. Enemy of undocumented runs.",
    effect: "Permanent field effect: ALL experiments must include seed, git commit, requirements-lock.txt, and data checksum. Generate Model Card on every deployment. DVC tracks all data versions. This card cannot be destroyed while a training job is active.",
    tags: ["DVC", "seeds", "model cards", "git", "environment pinning"],
    pillarColor: "#7A3A1A",
    cardColor: "#3d1c0a",
    foilColor: "linear-gradient(135deg, #ffd70033, #ffffff11, #ffd70033)",
  },
  {
    id: 12,
    name: "Data Guardian Beast",
    skill: "data-quality-guardian",
    pillar: "GOVERN",
    type: "Effect Monster",
    attribute: "EARTH",
    atk: 2200, def: 2800,
    level: 6,
    rarity: "Ultra Rare",
    art: "🛡️",
    flavorText: "Stands at the gates of the training pipeline. Nothing passes without a checksum. Detects stockouts, leakage, and structural breaks with preternatural accuracy.",
    effect: "Run full audit: Completeness → Temporal Integrity → Value Integrity → Distribution → Series-Level. On detection: Missing Values → forward-fill protocol. Outliers → IQR containment. Structural Break → regime split. Leakage → immediately halt training and report. Produce signed Data Quality Report before any model trains.",
    tags: ["missing values", "outliers", "leakage", "structural breaks", "drift"],
    pillarColor: "#7A3A1A",
    cardColor: "#3d1c0a",
    foilColor: "linear-gradient(135deg, #00ff8833, #ffffff11, #00ff8833)",
  },
  {
    id: 13,
    name: "Validation Loop Sentinel",
    skill: "validation-feedback-loop",
    pillar: "CROSS-CUTTING",
    type: "Trap Card",
    attribute: "DARK",
    atk: 1900, def: 2500,
    level: 5,
    rarity: "Ultra Rare",
    art: "🔄",
    flavorText: "Always watching. When a model underperforms in production, this card activates automatically. MASE > 1.5× threshold triggers the alarm.",
    effect: "TRAP — Activate when model is deployed: initiate production monitoring loop. Collect actuals at T+horizon. If MASE > 1.5× validation MASE OR Coverage < threshold-10% OR Bias > ±15%, force Root Cause Analysis. Counter target: 'Expanding Window Backtest' before any production claim. Minimum 5 folds. Mean ± std across 3 seeds.",
    tags: ["MASE", "CRPS", "backtesting", "monitoring", "coverage"],
    pillarColor: "#0E8C8C",
    cardColor: "#054040",
    foilColor: "linear-gradient(135deg, #ff00aa33, #ffffff11, #ff00aa33)",
  },
  {
    id: 14,
    name: "Experiment Alchemist",
    skill: "experiment-facilitator",
    pillar: "CROSS-CUTTING",
    type: "Continuous Trap",
    attribute: "FIRE",
    atk: 2000, def: 2000,
    level: 6,
    rarity: "Secret Rare",
    art: "🧪",
    flavorText: "No undirected exploration on its watch. Every run has a falsifiable hypothesis. Cherry-picking, HiPPO opinions, and unnamed MLflow runs are instantly destroyed.",
    effect: "PERMANENT FIELD EFFECT: No experiment may begin without a complete Hypothesis Template. Destroy any experiment lacking: Hypothesis / Baseline / Success Criteria / Compute Budget / Expected Outcome. Anti-pattern detector: automatically flags Cherry-Picking, HiPPO, Metric Shopping, and Undocumented Runs. Prioritize by: Impact × Confidence × Cost_inverse.",
    tags: ["hypothesis", "A/B testing", "ablation", "MLflow", "prioritization"],
    pillarColor: "#0E8C8C",
    cardColor: "#054040",
    foilColor: "linear-gradient(135deg, #ff880033, #ffffff11, #ff880033)",
  },
];

const PILLAR_CONFIG = {
  "DELIVER":      { bg: "#0a4a4a", border: "#0E8C8C", glow: "#0E8C8C" },
  "BUILD":        { bg: "#0a1f3d", border: "#1A4D8C", glow: "#3a7dd4" },
  "OPERATE":      { bg: "#1a0a2e", border: "#5C3A7A", glow: "#9b59d4" },
  "GOVERN":       { bg: "#2a0f05", border: "#7A3A1A", glow: "#c46020" },
  "CROSS-CUTTING":{ bg: "#020f1a", border: "#0E8C8C", glow: "#00ffcc" },
};

const RARITY_CONFIG = {
  "Common":      { label: "N",  color: "#888", shine: "none" },
  "Rare":        { label: "R",  color: "#4af", shine: "linear-gradient(135deg, rgba(100,200,255,0.15) 0%, transparent 50%, rgba(100,200,255,0.15) 100%)" },
  "Super Rare":  { label: "SR", color: "#fa0", shine: "linear-gradient(135deg, rgba(255,200,50,0.2) 0%, transparent 50%, rgba(255,200,50,0.2) 100%)" },
  "Ultra Rare":  { label: "UR", color: "#f4f", shine: "linear-gradient(135deg, rgba(255,100,255,0.25) 0%, transparent 30%, rgba(100,255,255,0.2) 70%, transparent 100%)" },
  "Secret Rare": { label: "ScR",color: "#fff", shine: "linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,100,100,0.15) 25%, rgba(100,255,100,0.15) 50%, rgba(100,100,255,0.15) 75%, rgba(255,255,255,0.3) 100%)" },
};

const TYPE_ICONS = {
  "Spell Card":       { icon: "✦", color: "#2ecc71" },
  "Trap Card":        { icon: "▲", color: "#e74c3c" },
  "Continuous Spell": { icon: "∞", color: "#27ae60" },
  "Continuous Trap":  { icon: "∞", color: "#c0392b" },
  "Effect Monster":   { icon: "★", color: "#f39c12" },
  "Fusion Monster":   { icon: "◈", color: "#8e44ad" },
  "Ritual Monster":   { icon: "◉", color: "#2980b9" },
  "XYZ Monster":      { icon: "⬟", color: "#2c3e50" },
};

const ATTR_COLORS = {
  LIGHT: { bg: "#fff9e6", text: "#c8a000" },
  DARK:  { bg: "#1a0a2e", text: "#cc88ff" },
  FIRE:  { bg: "#2e0a00", text: "#ff6633" },
  WIND:  { bg: "#0a1a0a", text: "#44ff88" },
  EARTH: { bg: "#1a1000", text: "#cc9933" },
};

function Stars({ count }) {
  return (
    <div style={{ display: "flex", gap: "2px", justifyContent: "flex-end" }}>
      {Array.from({ length: count }, (_, i) => (
        <span key={i} style={{ color: "#f5a623", fontSize: "11px", textShadow: "0 0 4px #f5a623" }}>★</span>
      ))}
    </div>
  );
}

function CardFace({ card, flipped, onClick }) {
  const pillar = PILLAR_CONFIG[card.pillar];
  const rarity = RARITY_CONFIG[card.rarity];
  const typeInfo = TYPE_ICONS[card.type];
  const attr = ATTR_COLORS[card.attribute] || ATTR_COLORS.DARK;
  const isMonster = card.type.includes("Monster");
  const [hovered, setHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setMousePos({ x: 50, y: 50 }); }}
      onMouseMove={handleMouseMove}
      style={{
        width: "240px",
        height: "350px",
        borderRadius: "12px",
        border: `2px solid ${hovered ? pillar.glow : pillar.border}`,
        background: `radial-gradient(ellipse at ${mousePos.x}% ${mousePos.y}%, ${pillar.bg}dd, #050505)`,
        boxShadow: hovered
          ? `0 0 30px ${pillar.glow}99, 0 0 60px ${pillar.glow}44, inset 0 0 20px rgba(0,0,0,0.5)`
          : `0 4px 20px rgba(0,0,0,0.8), inset 0 0 15px rgba(0,0,0,0.4)`,
        cursor: "pointer",
        transition: "all 0.2s ease",
        transform: hovered ? "translateY(-8px) scale(1.03)" : "none",
        position: "relative",
        overflow: "hidden",
        fontFamily: "'Georgia', serif",
        color: "#f0e8d0",
        display: "flex",
        flexDirection: "column",
        userSelect: "none",
      }}
    >
      {/* Foil shine overlay */}
      <div style={{
        position: "absolute", inset: 0, borderRadius: "12px",
        background: hovered ? rarity.shine : "none",
        pointerEvents: "none", zIndex: 10, opacity: 0.8,
        mixBlendMode: "screen",
      }} />

      {/* Holographic shimmer for rare+ */}
      {rarity.label !== "N" && (
        <div style={{
          position: "absolute", inset: 0, borderRadius: "12px",
          background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, ${pillar.glow}22 0%, transparent 60%)`,
          pointerEvents: "none", zIndex: 9,
        }} />
      )}

      {/* Card Header */}
      <div style={{
        padding: "8px 10px 4px",
        borderBottom: `1px solid ${pillar.border}66`,
        display: "flex", flexDirection: "column", gap: "2px",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{
            fontSize: "13px", fontWeight: "bold", letterSpacing: "0.5px",
            color: hovered ? "#fff" : "#f0e8d0",
            textShadow: hovered ? `0 0 10px ${pillar.glow}` : "none",
            flex: 1, lineHeight: 1.2,
            maxWidth: "160px",
          }}>
            {card.name}
          </div>
          <div style={{
            background: attr.bg, border: `1px solid ${attr.text}`,
            borderRadius: "4px", padding: "1px 5px",
            fontSize: "9px", color: attr.text, letterSpacing: "1px", fontWeight: "bold",
            flexShrink: 0,
          }}>
            {card.attribute}
          </div>
        </div>
        <Stars count={Math.min(card.level, 10)} />
      </div>

      {/* Art Frame */}
      <div style={{
        margin: "6px 8px",
        height: "120px",
        borderRadius: "6px",
        border: `1px solid ${pillar.border}88`,
        background: `linear-gradient(135deg, ${pillar.bg}, ${card.cardColor})`,
        display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative", overflow: "hidden",
        flexShrink: 0,
      }}>
        {/* Art background pattern */}
        <div style={{
          position: "absolute", inset: 0,
          background: `repeating-linear-gradient(45deg, ${pillar.glow}08 0px, transparent 10px, ${pillar.glow}08 20px)`,
        }} />
        <div style={{ fontSize: "56px", position: "relative", zIndex: 1,
          filter: `drop-shadow(0 0 15px ${pillar.glow})`,
          animation: hovered ? "none" : undefined,
        }}>
          {card.art}
        </div>
        {/* Rarity badge */}
        <div style={{
          position: "absolute", top: "4px", right: "6px",
          fontSize: "9px", fontWeight: "bold", color: rarity.color,
          textShadow: `0 0 6px ${rarity.color}`, letterSpacing: "1px",
        }}>
          {rarity.label}
        </div>
        {/* Pillar tag */}
        <div style={{
          position: "absolute", bottom: "4px", left: "6px",
          fontSize: "8px", color: pillar.glow, letterSpacing: "2px",
          textTransform: "uppercase", opacity: 0.9,
        }}>
          {card.pillar}
        </div>
      </div>

      {/* Type bar */}
      <div style={{
        margin: "0 8px 4px",
        padding: "3px 8px",
        background: `${pillar.border}22`,
        borderRadius: "4px",
        border: `1px solid ${pillar.border}44`,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexShrink: 0,
      }}>
        <span style={{ color: typeInfo.color, fontSize: "10px", fontFamily: "monospace" }}>
          {typeInfo.icon} {card.type}
        </span>
        <span style={{ color: "#888", fontSize: "9px", fontFamily: "monospace" }}>
          {card.skill}
        </span>
      </div>

      {/* Flavor text */}
      <div style={{
        margin: "0 8px",
        padding: "4px 6px",
        fontSize: "9.5px",
        lineHeight: "1.4",
        color: "#c8b89a",
        fontStyle: "italic",
        background: "rgba(0,0,0,0.3)",
        borderRadius: "4px",
        borderLeft: `2px solid ${pillar.glow}66`,
        flex: 1,
        overflow: "hidden",
        display: "-webkit-box",
        WebkitLineClamp: 3,
        WebkitBoxOrient: "vertical",
      }}>
        {card.flavorText}
      </div>

      {/* Stats footer */}
      {isMonster && (
        <div style={{
          margin: "4px 8px 6px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          borderTop: `1px solid ${pillar.border}44`,
          paddingTop: "4px",
          flexShrink: 0,
        }}>
          <span style={{ fontSize: "11px", color: "#ff8844", fontWeight: "bold", fontFamily: "monospace" }}>
            ATK/{card.atk}
          </span>
          <span style={{ fontSize: "11px", color: "#88aaff", fontWeight: "bold", fontFamily: "monospace" }}>
            DEF/{card.def}
          </span>
        </div>
      )}
      {!isMonster && (
        <div style={{
          margin: "4px 8px 6px", paddingTop: "4px",
          borderTop: `1px solid ${pillar.border}44`,
          display: "flex", justifyContent: "center",
          flexShrink: 0,
        }}>
          <span style={{ fontSize: "10px", color: pillar.glow, fontFamily: "monospace", letterSpacing: "2px" }}>
            ◆ {card.type.toUpperCase()} ◆
          </span>
        </div>
      )}
    </div>
  );
}

function CardBack() {
  return (
    <div style={{
      width: "240px", height: "350px", borderRadius: "12px",
      background: "radial-gradient(ellipse at 50% 50%, #0a0a1a, #050508)",
      border: "2px solid #333",
      boxShadow: "0 4px 20px rgba(0,0,0,0.8)",
      display: "flex", alignItems: "center", justifyContent: "center",
      overflow: "hidden", position: "relative",
    }}>
      <div style={{
        position: "absolute", inset: 0,
        background: "repeating-linear-gradient(45deg, #0E8C8C08 0px, transparent 10px, #1A4D8C08 20px, transparent 30px)",
      }} />
      <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
        <div style={{ fontSize: "48px", marginBottom: "8px" }}>🤖</div>
        <div style={{ color: "#0E8C8C", fontSize: "12px", letterSpacing: "3px", fontFamily: "monospace" }}>
          ML SKILLS
        </div>
        <div style={{ color: "#444", fontSize: "10px", letterSpacing: "2px", marginTop: "4px" }}>
          AGENT FRAMEWORK
        </div>
      </div>
    </div>
  );
}

function DetailPanel({ card, onClose }) {
  const pillar = PILLAR_CONFIG[card.pillar];
  const typeInfo = TYPE_ICONS[card.type];
  const attr = ATTR_COLORS[card.attribute] || ATTR_COLORS.DARK;
  const isMonster = card.type.includes("Monster");
  const rarity = RARITY_CONFIG[card.rarity];

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 1000, backdropFilter: "blur(4px)",
    }} onClick={onClose}>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: `radial-gradient(ellipse at 30% 30%, ${pillar.bg}ee, #080810ee)`,
          border: `2px solid ${pillar.border}`,
          borderRadius: "20px",
          boxShadow: `0 0 60px ${pillar.glow}66, 0 0 120px ${pillar.glow}22`,
          padding: "32px",
          maxWidth: "680px",
          width: "90vw",
          maxHeight: "85vh",
          overflowY: "auto",
          color: "#f0e8d0",
          fontFamily: "'Georgia', serif",
          position: "relative",
        }}
      >
        {/* Close */}
        <button onClick={onClose} style={{
          position: "absolute", top: "16px", right: "20px",
          background: "none", border: "none", color: "#888",
          fontSize: "24px", cursor: "pointer", lineHeight: 1,
        }}>×</button>

        {/* Header */}
        <div style={{ display: "flex", gap: "24px", marginBottom: "24px" }}>
          <div style={{
            fontSize: "72px",
            filter: `drop-shadow(0 0 20px ${pillar.glow})`,
            flexShrink: 0,
          }}>{card.art}</div>
          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: "22px", fontWeight: "bold", color: "#fff",
              textShadow: `0 0 20px ${pillar.glow}`, marginBottom: "4px",
            }}>{card.name}</div>
            <div style={{ fontSize: "11px", color: pillar.glow, letterSpacing: "3px", marginBottom: "8px" }}>
              {card.pillar} PILLAR
            </div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <span style={{
                background: `${attr.bg}`, border: `1px solid ${attr.text}`,
                borderRadius: "4px", padding: "2px 8px",
                fontSize: "11px", color: attr.text, letterSpacing: "1px",
              }}>{card.attribute}</span>
              <span style={{
                background: `${pillar.border}22`, border: `1px solid ${pillar.border}`,
                borderRadius: "4px", padding: "2px 8px",
                fontSize: "11px", color: typeInfo.color,
              }}>{typeInfo.icon} {card.type}</span>
              <span style={{
                background: "rgba(0,0,0,0.4)", border: `1px solid ${rarity.color}66`,
                borderRadius: "4px", padding: "2px 8px",
                fontSize: "11px", color: rarity.color,
              }}>{card.rarity}</span>
            </div>
          </div>
        </div>

        {/* Skill name */}
        <div style={{
          background: "rgba(0,0,0,0.4)", borderLeft: `3px solid ${pillar.glow}`,
          padding: "8px 14px", marginBottom: "16px", borderRadius: "0 8px 8px 0",
          fontFamily: "monospace", fontSize: "13px", color: pillar.glow,
        }}>
          SKILL.md: {card.skill}
        </div>

        {/* Flavor text */}
        <div style={{
          fontStyle: "italic", color: "#c8b89a", fontSize: "14px",
          lineHeight: "1.6", marginBottom: "16px", padding: "12px",
          borderRadius: "8px", background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}>
          "{card.flavorText}"
        </div>

        {/* Effect */}
        <div style={{ marginBottom: "16px" }}>
          <div style={{ fontSize: "12px", color: pillar.glow, letterSpacing: "2px", marginBottom: "8px" }}>
            CARD EFFECT
          </div>
          <div style={{
            background: "rgba(0,0,0,0.4)", borderRadius: "8px",
            padding: "14px", fontSize: "13px", lineHeight: "1.7",
            border: `1px solid ${pillar.border}44`,
          }}>
            {card.effect}
          </div>
        </div>

        {/* Tags */}
        <div style={{ marginBottom: "16px" }}>
          <div style={{ fontSize: "12px", color: "#666", letterSpacing: "2px", marginBottom: "8px" }}>KEYWORDS</div>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {card.tags.map(tag => (
              <span key={tag} style={{
                background: `${pillar.border}22`, border: `1px solid ${pillar.border}66`,
                borderRadius: "20px", padding: "3px 10px",
                fontSize: "11px", color: pillar.glow, fontFamily: "monospace",
              }}>#{tag}</span>
            ))}
          </div>
        </div>

        {/* Stats */}
        {isMonster && (
          <div style={{
            display: "flex", gap: "16px", justifyContent: "flex-end",
            borderTop: `1px solid ${pillar.border}44`, paddingTop: "12px",
          }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "10px", color: "#666", letterSpacing: "2px" }}>ATK</div>
              <div style={{ fontSize: "24px", fontWeight: "bold", color: "#ff8844", fontFamily: "monospace" }}>{card.atk}</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "10px", color: "#666", letterSpacing: "2px" }}>DEF</div>
              <div style={{ fontSize: "24px", fontWeight: "bold", color: "#88aaff", fontFamily: "monospace" }}>{card.def}</div>
            </div>
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: "16px" }}>
          <button onClick={onClose} style={{
            background: `${pillar.border}33`, border: `1px solid ${pillar.border}`,
            color: pillar.glow, padding: "8px 24px", borderRadius: "8px",
            cursor: "pointer", fontFamily: "'Georgia', serif", fontSize: "13px",
            letterSpacing: "2px",
          }}>
            RETURN CARD
          </button>
        </div>
      </div>
    </div>
  );
}

function DeckFilter({ active, onChange }) {
  const filters = ["ALL", "DELIVER", "BUILD", "OPERATE", "GOVERN", "CROSS-CUTTING"];
  return (
    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}>
      {filters.map(f => {
        const cfg = f === "ALL" ? { glow: "#aaa", border: "#555" } : (PILLAR_CONFIG[f] || { glow: "#aaa", border: "#555" });
        return (
          <button key={f} onClick={() => onChange(f)} style={{
            padding: "6px 16px", borderRadius: "20px",
            background: active === f ? `${cfg.border}44` : "transparent",
            border: `1px solid ${active === f ? cfg.glow : "#333"}`,
            color: active === f ? cfg.glow : "#666",
            cursor: "pointer", fontFamily: "monospace",
            fontSize: "11px", letterSpacing: "2px",
            transition: "all 0.2s",
            textShadow: active === f ? `0 0 8px ${cfg.glow}` : "none",
            boxShadow: active === f ? `0 0 12px ${cfg.glow}44` : "none",
          }}>
            {f}
          </button>
        );
      })}
    </div>
  );
}

function HandCard({ card, handIndex, totalCards, onPlay }) {
  const [hovered, setHovered] = useState(false);
  const pillar = PILLAR_CONFIG[card.pillar];
  const fanAngle = totalCards <= 1 ? 0 : (handIndex / (totalCards - 1) - 0.5) * 30;
  const fanTranslate = totalCards <= 1 ? 0 : Math.abs(handIndex / (totalCards - 1) - 0.5) * -15;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onPlay(card)}
      style={{
        transform: hovered
          ? `rotate(0deg) translateY(-30px) scale(1.05)`
          : `rotate(${fanAngle}deg) translateY(${fanTranslate}px)`,
        transformOrigin: "bottom center",
        transition: "transform 0.2s ease",
        cursor: "pointer",
        zIndex: hovered ? 100 : handIndex,
        position: "relative",
        marginLeft: handIndex === 0 ? 0 : "-20px",
      }}
    >
      <div style={{ width: "80px", height: "112px", borderRadius: "6px",
        background: `radial-gradient(ellipse, ${pillar.bg}, #050505)`,
        border: `1.5px solid ${hovered ? pillar.glow : pillar.border}`,
        boxShadow: hovered ? `0 0 20px ${pillar.glow}88` : "0 2px 8px rgba(0,0,0,0.8)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "24px", flexDirection: "column", gap: "2px",
        overflow: "hidden", position: "relative",
      }}>
        <div style={{ filter: `drop-shadow(0 0 6px ${pillar.glow})` }}>{card.art}</div>
        <div style={{ fontSize: "7px", color: pillar.glow, letterSpacing: "1px", textAlign: "center", padding: "0 4px", lineHeight: 1.2 }}>
          {card.name.split(" ").slice(0, 2).join(" ")}
        </div>
      </div>
    </div>
  );
}

export default function MLSkillCards() {
  const [selectedCard, setSelectedCard] = useState(null);
  const [filter, setFilter] = useState("ALL");
  const [mode, setMode] = useState("gallery"); // gallery | duel | hand
  const [hand, setHand] = useState([]);
  const [field, setField] = useState([]);
  const [deckCount, setDeckCount] = useState(CARDS.length);
  const [message, setMessage] = useState("Draw cards from the deck to build your hand, then play them to the field!");

  const filtered = CARDS.filter(c => filter === "ALL" || c.pillar === filter);

  const drawCard = () => {
    const notInHand = CARDS.filter(c => !hand.find(h => h.id === c.id));
    if (notInHand.length === 0) { setMessage("No more cards in deck!"); return; }
    const card = notInHand[Math.floor(Math.random() * notInHand.length)];
    setHand(prev => [...prev, card]);
    setDeckCount(prev => prev - 1);
    setMessage(`Drew: ${card.name}`);
  };

  const playToField = (card) => {
    if (field.length >= 4) { setMessage("Field is full! Max 4 cards."); return; }
    setHand(prev => prev.filter(c => c.id !== card.id));
    setField(prev => [...prev, card]);
    setMessage(`${card.name} summoned to the field!`);
  };

  const returnCard = (card) => {
    setField(prev => prev.filter(c => c.id !== card.id));
    setHand(prev => [...prev, card]);
    setMessage(`${card.name} returned to hand.`);
  };

  const resetDuel = () => {
    setHand([]);
    setField([]);
    setDeckCount(CARDS.length);
    setMessage("Deck reset. Draw cards from the deck!");
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "radial-gradient(ellipse at 50% 0%, #0a0f1a, #050508)",
      color: "#f0e8d0",
      fontFamily: "'Georgia', serif",
      padding: "24px 16px",
    }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <div style={{
          fontSize: "11px", letterSpacing: "6px", color: "#0E8C8C",
          marginBottom: "8px", fontFamily: "monospace",
        }}>ML TEAM · AGENT SKILLS FRAMEWORK</div>
        <h1 style={{
          margin: 0, fontSize: "clamp(24px, 4vw, 38px)",
          background: "linear-gradient(135deg, #0E8C8C, #88ccff, #ff88cc, #0E8C8C)",
          backgroundClip: "text", WebkitBackgroundClip: "text",
          color: "transparent",
          textShadow: "none",
          letterSpacing: "2px",
        }}>
          SKILL CARD COMPENDIUM
        </h1>
        <div style={{ fontSize: "13px", color: "#666", marginTop: "8px", letterSpacing: "2px" }}>
          {CARDS.length} CARDS · 4 PILLARS · 2 CROSS-CUTTING LAYERS
        </div>
      </div>

      {/* Mode switcher */}
      <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginBottom: "28px" }}>
        {[
          { key: "gallery", label: "📚 GALLERY", desc: "Browse all cards" },
          { key: "duel", key2: "hand", label: "⚔️ DUEL MODE", desc: "Build a hand & field" },
        ].map(m => (
          <button key={m.key} onClick={() => setMode(m.key === "duel" ? "duel" : "gallery")} style={{
            padding: "10px 24px", borderRadius: "8px",
            background: (mode === m.key || (m.key === "duel" && mode === "hand"))
              ? "rgba(14,140,140,0.2)" : "transparent",
            border: `1px solid ${(mode === m.key || (m.key === "duel" && mode === "hand")) ? "#0E8C8C" : "#333"}`,
            color: (mode === m.key || (m.key === "duel" && mode === "hand")) ? "#0E8C8C" : "#666",
            cursor: "pointer", fontFamily: "monospace", fontSize: "12px",
            letterSpacing: "2px", transition: "all 0.2s",
          }}>
            {m.label}
          </button>
        ))}
      </div>

      {/* GALLERY MODE */}
      {mode === "gallery" && (
        <>
          <div style={{ marginBottom: "24px" }}>
            <DeckFilter active={filter} onChange={setFilter} />
          </div>
          <div style={{ fontSize: "11px", color: "#444", textAlign: "center", marginBottom: "20px", letterSpacing: "2px" }}>
            {filtered.length} CARD{filtered.length !== 1 ? "S" : ""} · CLICK TO INSPECT
          </div>
          <div style={{
            display: "flex", flexWrap: "wrap", gap: "20px",
            justifyContent: "center", maxWidth: "1200px", margin: "0 auto",
          }}>
            {filtered.map(card => (
              <CardFace key={card.id} card={card} onClick={() => setSelectedCard(card)} />
            ))}
          </div>
        </>
      )}

      {/* DUEL MODE */}
      {mode === "duel" && (
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          {/* Status bar */}
          <div style={{
            background: "rgba(0,0,0,0.5)", border: "1px solid #222",
            borderRadius: "12px", padding: "16px 20px", marginBottom: "20px",
            display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap",
          }}>
            <div style={{ flex: 1, fontSize: "13px", color: "#aaa", fontStyle: "italic" }}>
              ⟩ {message}
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={drawCard} disabled={deckCount === 0} style={{
                background: deckCount > 0 ? "rgba(14,140,140,0.2)" : "rgba(50,50,50,0.2)",
                border: `1px solid ${deckCount > 0 ? "#0E8C8C" : "#333"}`,
                color: deckCount > 0 ? "#0E8C8C" : "#444",
                padding: "8px 16px", borderRadius: "8px", cursor: deckCount > 0 ? "pointer" : "not-allowed",
                fontFamily: "monospace", fontSize: "11px", letterSpacing: "1px",
              }}>
                🃏 DRAW ({deckCount})
              </button>
              <button onClick={resetDuel} style={{
                background: "rgba(80,20,20,0.3)", border: "1px solid #633",
                color: "#c44", padding: "8px 16px", borderRadius: "8px", cursor: "pointer",
                fontFamily: "monospace", fontSize: "11px", letterSpacing: "1px",
              }}>↺ RESET</button>
            </div>
          </div>

          {/* Field */}
          <div style={{
            background: "rgba(0,20,10,0.4)", border: "1px solid #0E8C8C33",
            borderRadius: "16px", padding: "20px", marginBottom: "24px",
            minHeight: "220px",
          }}>
            <div style={{ fontSize: "10px", color: "#0E8C8C", letterSpacing: "3px", marginBottom: "16px" }}>
              ⬤ FIELD ({field.length}/4) — Click a field card to return to hand
            </div>
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center", minHeight: "160px", alignItems: "center" }}>
              {field.length === 0 ? (
                <div style={{ color: "#333", fontSize: "13px", fontStyle: "italic" }}>Play cards from your hand to the field</div>
              ) : field.map(card => (
                <div key={card.id} onClick={() => { setSelectedCard(card); }} style={{ position: "relative" }}>
                  <CardFace card={card} onClick={() => setSelectedCard(card)} />
                  <button onClick={(e) => { e.stopPropagation(); returnCard(card); }} style={{
                    position: "absolute", top: "-8px", right: "-8px",
                    background: "#c44", border: "none", borderRadius: "50%",
                    width: "22px", height: "22px", cursor: "pointer",
                    fontSize: "12px", color: "white", display: "flex", alignItems: "center", justifyContent: "center",
                    zIndex: 20, fontWeight: "bold",
                  }}>×</button>
                </div>
              ))}
            </div>
          </div>

          {/* Hand */}
          <div style={{
            background: "rgba(0,0,20,0.4)", border: "1px solid #1A4D8C33",
            borderRadius: "16px", padding: "20px",
          }}>
            <div style={{ fontSize: "10px", color: "#3a7dd4", letterSpacing: "3px", marginBottom: "16px" }}>
              ◆ YOUR HAND ({hand.length}) — Click a card to play it to the field
            </div>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-end", minHeight: "120px", paddingBottom: "8px" }}>
              {hand.length === 0 ? (
                <div style={{ color: "#333", fontSize: "13px", fontStyle: "italic", alignSelf: "center" }}>Draw cards to start</div>
              ) : hand.map((card, i) => (
                <HandCard key={card.id} card={card} handIndex={i} totalCards={hand.length} onPlay={playToField} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Detail modal */}
      {selectedCard && <DetailPanel card={selectedCard} onClose={() => setSelectedCard(null)} />}

      {/* Footer */}
      <div style={{ textAlign: "center", marginTop: "48px", color: "#333", fontSize: "11px", letterSpacing: "2px" }}>
        ML TEAM AGENT SKILLS FRAMEWORK · 14 CARDS
      </div>
    </div>
  );
}
