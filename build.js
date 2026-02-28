const fs = require("fs");
const path = require("path");
const { marked } = require("marked");

const MD_DIR = (() => {
  const inDir = path.join(__dirname, "Axos-Demo-Plan");
  const parent = path.join(__dirname, "..", "Axos-Demo-Plan");
  if (fs.existsSync(inDir)) return inDir;
  if (fs.existsSync(parent)) return parent;
  throw new Error("Axos-Demo-Plan not found in . or ..");
})();

const sections = [
  { file: "00-Overview-and-Agenda.md", title: "Overview & Agenda", icon: "📋", short: "Pre-demo checklist, 90-minute agenda, narration scripts", color: "from-blue-500 to-cyan-400" },
  { file: "01-Architecture-Overview.md", title: "Architecture", icon: "🏗️", short: "3-layer arch, zero egress, LLM selection, conflict resolution", color: "from-violet-500 to-purple-400" },
  { file: "02-Process-Map-Deep-Dive.md", title: "Process Map", icon: "🗺️", short: "19 shapes, 8 decisions, 2 tracks, version history analysis", color: "from-emerald-500 to-teal-400" },
  { file: "03-Section-A-Process-Ingestion.md", title: "Process Ingestion", icon: "📥", short: "PDF upload, iGrafx OData API, webhooks, SFTP watcher", color: "from-orange-500 to-amber-400" },
  { file: "04-Agent-1-Documentation-Retrieval.md", title: "Agent 1 — Retrieval", icon: "📄", short: "Secure API, auto-discovery, tagging, evidence scoring", color: "from-sky-500 to-blue-400" },
  { file: "05-Agent-2-Test-of-Effectiveness.md", title: "Agent 2 — TOE", icon: "🧪", short: "Sampling, 3 scenarios, ML anomalies, 13 exceptions", color: "from-rose-500 to-pink-400" },
  { file: "06-Agent-3-Test-of-Design.md", title: "Agent 3 — TOD", icon: "🔍", short: "COSO matrix, 4 gaps, regulatory benchmarks, design rating", color: "from-indigo-500 to-violet-400" },
  { file: "07-Agent-4-Supervisory-Agent.md", title: "Agent 4 — Supervisor", icon: "🎛️", short: "Orchestration, NLU, RBAC, Archer push, human review", color: "from-fuchsia-500 to-pink-400" },
  { file: "08-Market-Surveillance.md", title: "Market Surveillance", icon: "📡", short: "12 rules, data ingestion, alert engine, SAR automation", color: "from-cyan-500 to-teal-400" },
  { file: "09-Extension-Capabilities.md", title: "Extensions", icon: "🔌", short: "TPRM, fraud detection, 8210 automation, exam readiness", color: "from-lime-500 to-green-400" },
  { file: "10-Senior-Mgmt-QA-Preparation.md", title: "Q&A Preparation", icon: "❓", short: "7 senior mgmt questions, 10 system questions, tough Q prep", color: "from-amber-500 to-yellow-400" },
  { file: "11-Competitive-Intelligence.md", title: "Competitive Intel", icon: "⚔️", short: "Competitor analysis, data egress flaw, comparison matrix", color: "from-red-500 to-rose-400" },
  { file: "12-Post-Demo-and-Scoring.md", title: "Scoring & Close", icon: "🏆", short: "Deliverables, 100-pt rubric, risk scenarios, compliance checklist", color: "from-yellow-500 to-orange-400" },
];

marked.setOptions({ gfm: true, breaks: false });

const sectionData = sections.map((s, i) => {
  const md = fs.readFileSync(path.join(MD_DIR, s.file), "utf-8");
  return { ...s, html: marked.parse(md), id: `section-${i}`, idx: i };
});

const agentSections = sectionData.filter((_, i) => i >= 4 && i <= 7);

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Axos ERM Demo Plan — Goldenflitch Studios</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<script src="https://cdn.tailwindcss.com/3.4.17"></script>
<style>
  :root {
    --bg-primary: #ffffff;
    --fg-primary: #2A4B8A;
    --fg-secondary: #5c6b8a;
    --accent: #E89C33;
  }
  html { scroll-behavior: smooth; }
  body { font-family: 'Inter', system-ui, sans-serif; background: var(--bg-primary); color: var(--fg-primary); }

  h1, h2, h3, h4, h5, h6 { font-family: 'Inter', system-ui, sans-serif; font-weight: 400; }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: #f1f5f9; }
  ::-webkit-scrollbar-thumb { background: var(--fg-secondary); border-radius: 3px; }

  .gradient-text {
    background: linear-gradient(135deg, var(--accent), #f0b429);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .gradient-text-gold {
    background: linear-gradient(135deg, var(--accent), #d48928);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .gradient-text-cyan {
    background: linear-gradient(135deg, var(--fg-primary), var(--fg-secondary));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }

  .nav-caps { text-transform: uppercase; letter-spacing: 0.02em; }

  .btn-standard { text-transform: uppercase; letter-spacing: 0.04em; color: #1a1a1a !important; }

  .glow-blue { box-shadow: 0 4px 40px rgba(232, 156, 51, 0.15), 0 0 0 1px rgba(232, 156, 51, 0.2); }

  .glass {
    background: rgba(255, 255, 255, 0.9);
    border: 1px solid rgba(42, 75, 138, 0.15);
    box-shadow: 0 1px 3px rgba(42, 75, 138, 0.08);
  }
  .glass-strong {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(42, 75, 138, 0.12);
    box-shadow: 0 1px 3px rgba(42, 75, 138, 0.06);
  }

  @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
  @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
  .animate-float { animation: float 6s ease-in-out infinite; }

  .reveal { opacity: 0; transform: translateY(30px); transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1); }
  .reveal.visible { opacity: 1; transform: translateY(0); }
  .reveal-delay-1 { transition-delay: 0.1s; }
  .reveal-delay-2 { transition-delay: 0.2s; }
  .reveal-delay-3 { transition-delay: 0.3s; }
  .reveal-delay-4 { transition-delay: 0.4s; }

  .card-hover { transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
  .card-hover:hover { transform: translateY(-4px); box-shadow: 0 20px 40px rgba(0,0,0,0.2); border-color: var(--fg-secondary); }

  .agent-tab { transition: all 0.3s ease; }
  .agent-tab.active { background: rgba(232, 156, 51, 0.12); border-color: var(--accent); color: var(--accent); }
  .agent-content { display: none; animation: fade-in 0.4s ease; }
  .agent-content.active { display: block; }

  .stat-value { font-variant-numeric: tabular-nums; }

  .hero-stats-grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    border: 1px solid rgba(42, 75, 138, 0.2);
    border-radius: 12px;
    overflow: hidden;
    background: rgba(42, 75, 138, 0.04);
  }
  @media (max-width: 1024px) { .hero-stats-grid { grid-template-columns: repeat(3, 1fr); } }
  @media (max-width: 640px) { .hero-stats-grid { grid-template-columns: repeat(2, 1fr); } }
  .hero-stats-grid .hero-stat-cell {
    padding: 1rem 1.25rem;
    border-right: 1px solid rgba(42, 75, 138, 0.15);
    border-bottom: 1px solid rgba(42, 75, 138, 0.15);
    text-align: center;
  }
  .hero-stats-grid .hero-stat-cell:nth-child(6n) { border-right: none; }
  .hero-stats-grid .hero-stat-cell:nth-last-child(-n+6) { border-bottom: none; }
  @media (max-width: 1024px) {
    .hero-stats-grid .hero-stat-cell:nth-child(3n) { border-right: none; }
    .hero-stats-grid .hero-stat-cell:nth-last-child(-n+3) { border-bottom: none; }
  }
  @media (max-width: 640px) {
    .hero-stats-grid .hero-stat-cell:nth-child(2n) { border-right: none; }
    .hero-stats-grid .hero-stat-cell:nth-last-child(-n+2) { border-bottom: none; }
  }

  .code-preview {
    background: linear-gradient(135deg, #1a2d52 0%, #0f172a 100%);
    border: 1px solid rgba(42, 75, 138, 0.2);
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.8rem; line-height: 1.7; color: #DDE5EE;
    overflow: hidden; border-radius: 16px;
  }
  .code-preview .comment { color: #94a3b8; font-style: italic; }
  .code-preview .keyword { color: #c084fc; }
  .code-preview .string { color: #34d399; }
  .code-preview .prop { color: #7dd3fc; }
  .code-preview .val { color: var(--accent); }

  .drawer-overlay { opacity: 0; pointer-events: none; transition: opacity 0.3s ease; }
  .drawer-overlay.open { opacity: 1; pointer-events: auto; }
  .drawer-panel { transform: translateX(100%); transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
  .drawer-overlay.open .drawer-panel { transform: translateX(0); }

  .drawer-prose h1, .drawer-prose h2, .drawer-prose h3, .drawer-prose h4 { font-family: 'Inter', system-ui, sans-serif; }
  .drawer-prose h1 { font-size: 1.75rem; font-weight: 400; color: #1e293b; margin: 2rem 0 0.75rem; padding-bottom: 0.5rem; border-bottom: 1px solid #e2e8f0; }
  .drawer-prose h2 { font-size: 1.3rem; font-weight: 400; color: #1e293b; margin: 2rem 0 0.5rem; }
  .drawer-prose h3 { font-size: 1.1rem; font-weight: 400; color: #334155; margin: 1.5rem 0 0.5rem; }
  .drawer-prose h4 { font-size: 0.95rem; font-weight: 400; color: #475569; margin: 1.25rem 0 0.4rem; }
  .drawer-prose p { color: #475569; margin: 0.6rem 0; line-height: 1.75; }
  .drawer-prose a { color: #2563eb; }
  .drawer-prose strong { color: #0f172a; }
  .drawer-prose ul, .drawer-prose ol { margin: 0.6rem 0; padding-left: 1.5rem; color: #475569; }
  .drawer-prose li { margin: 0.25rem 0; }
  .drawer-prose li::marker { color: var(--accent); }
  .drawer-prose blockquote { border-left: 3px solid var(--accent); background: #fffbeb; padding: 0.75rem 1rem; margin: 1rem 0; border-radius: 0 6px 6px 0; }
  .drawer-prose blockquote p { color: #92400e; font-style: italic; }
  .drawer-prose code { font-family: 'JetBrains Mono', monospace; font-size: 0.82em; background: #f1f5f9; padding: 0.15em 0.4em; border-radius: 4px; color: #be185d; }
  .drawer-prose pre { background: #0f172a; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1rem; overflow-x: auto; margin: 1rem 0; }
  .drawer-prose pre code { background: none; padding: 0; color: #e2e8f0; }
  .drawer-prose table { width: 100%; border-collapse: collapse; margin: 1rem 0; font-size: 0.82rem; }
  .drawer-prose thead th { background: #f8fafc; color: #0f172a; font-weight: 600; text-align: left; padding: 0.5rem 0.7rem; border-bottom: 2px solid var(--accent); }
  .drawer-prose tbody td { padding: 0.45rem 0.7rem; border-bottom: 1px solid #f1f5f9; color: #475569; vertical-align: top; }
  .drawer-prose tbody tr:hover { background: #f8fafc; }
  .drawer-prose hr { border: none; border-top: 1px solid #e2e8f0; margin: 1.5rem 0; }
</style>
</head>
<body class="antialiased" style="background: var(--bg-primary); color: var(--fg-primary);">

<!-- ═══════════ NAV ═══════════ -->
<nav class="fixed top-0 left-0 right-0 z-50 glass-strong nav-caps" id="navbar">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between h-16">
      <div class="flex items-center gap-3">
        <a href="#hero" class="flex items-center gap-2 sm:gap-3">
          <img src="assets/goldenflitch-logo.png" alt="Goldenflitch" class="h-7 sm:h-8 w-auto object-contain" />
          <img src="assets/axos-logo.png" alt="Axos®" class="h-6 sm:h-7 w-auto object-contain" />
        </a>
      </div>
      <div class="hidden md:flex items-center gap-1">
        <a href="#hero" class="px-3 py-1.5 text-xs font-medium transition-colors rounded-lg hover:opacity-90" style="color: var(--fg-secondary);">Home</a>
        <a href="#architecture" class="px-3 py-1.5 text-xs font-medium transition-colors rounded-lg hover:opacity-90" style="color: var(--fg-secondary);">Architecture</a>
        <a href="#agents" class="px-3 py-1.5 text-xs font-medium transition-colors rounded-lg hover:opacity-90" style="color: var(--fg-secondary);">Agents</a>
        <a href="#surveillance" class="px-3 py-1.5 text-xs font-medium transition-colors rounded-lg hover:opacity-90" style="color: var(--fg-secondary);">Surveillance</a>
        <a href="#competitive" class="px-3 py-1.5 text-xs font-medium transition-colors rounded-lg hover:opacity-90" style="color: var(--fg-secondary);">Competitive</a>
        <a href="#sections" class="px-3 py-1.5 text-xs font-medium transition-colors rounded-lg hover:opacity-90" style="color: var(--fg-secondary);">All Sections</a>
      </div>
      <a href="#sections" class="btn-standard px-4 py-2 text-xs font-medium rounded-full transition-all hover:opacity-90" style="background: var(--accent);">Explore Plan →</a>
    </div>
  </div>
</nav>

<!-- ═══════════ HERO ═══════════ -->
<section id="hero" class="relative min-h-screen flex items-center justify-center overflow-hidden pt-16" style="background: var(--bg-primary);">
  <div class="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
    <div class="absolute top-1/4 -left-32 w-96 h-96 rounded-full blur-[120px] animate-float" style="background: var(--accent);"></div>
    <div class="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full blur-[120px] animate-float" style="background: var(--fg-primary); animation-delay:-3s"></div>
  </div>

  <div class="relative z-10 max-w-5xl mx-auto px-6 text-center w-full">
    <div class="reveal">
      <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-medium mb-8" style="color: var(--fg-secondary);">
        <span class="w-2 h-2 rounded-full animate-pulse" style="background: var(--accent);"></span>
        Axos Bank Demo — February 2026
      </div>
    </div>

    <h1 class="reveal reveal-delay-1 text-5xl sm:text-6xl lg:text-7xl font-normal tracking-tight leading-[1.05] mb-6" style="color: var(--fg-primary); font-family: 'Inter', sans-serif;">
      Agentic ERM<br><span class="gradient-text">Control Testing</span>
    </h1>

    <p class="reveal reveal-delay-2 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed" style="color: var(--fg-secondary);">
      Four AI agents. One control test. Zero data egress.<br>
      <span style="color: var(--fg-primary);" class="font-medium">From raw process map to examination-ready workpaper in 25 minutes.</span>
    </p>

    <div class="reveal reveal-delay-3 hero-stats-grid max-w-4xl mx-auto mb-12">
      <div class="hero-stat-cell">
        <div class="text-2xl font-normal stat-value gradient-text-cyan" data-target="91.7" data-suffix="%">0%</div>
        <div class="text-[10px] font-medium mt-1 uppercase tracking-wider" style="color: var(--fg-secondary);">Time Saved</div>
      </div>
      <div class="hero-stat-cell">
        <div class="text-2xl font-normal stat-value gradient-text" data-target="65000" data-suffix="" data-format="comma">0</div>
        <div class="text-[10px] font-medium mt-1 uppercase tracking-wider" style="color: var(--fg-secondary);">Records Scanned</div>
      </div>
      <div class="hero-stat-cell">
        <div class="text-2xl font-normal stat-value gradient-text-gold" data-target="25" data-suffix=" min">0 min</div>
        <div class="text-[10px] font-medium mt-1 uppercase tracking-wider" style="color: var(--fg-secondary);">Total Time</div>
      </div>
      <div class="hero-stat-cell">
        <div class="text-2xl font-normal stat-value" data-target="13" data-suffix="×" style="color: var(--accent);">0×</div>
        <div class="text-[10px] font-medium mt-1 uppercase tracking-wider" style="color: var(--fg-secondary);">Volume Increase</div>
      </div>
      <div class="hero-stat-cell">
        <div class="text-2xl font-normal stat-value" style="color: var(--accent);">$810K</div>
        <div class="text-[10px] font-medium mt-1 uppercase tracking-wider" style="color: var(--fg-secondary);">Year 1 Fixed</div>
      </div>
      <div class="hero-stat-cell">
        <div class="text-2xl font-normal stat-value" style="color: var(--accent);">$0</div>
        <div class="text-[10px] font-medium mt-1 uppercase tracking-wider" style="color: var(--fg-secondary);">Agent 4 Cost</div>
      </div>
    </div>

    <div class="reveal reveal-delay-4 flex flex-col sm:flex-row items-center justify-center gap-4">
      <a href="#architecture" class="btn-standard group px-8 py-3.5 rounded-full text-sm font-normal transition-all hover:scale-105 hover:opacity-90" style="background: var(--accent);">
        View Architecture <span class="inline-block group-hover:translate-x-1 transition-transform">→</span>
      </a>
      <a href="#agents" class="btn-standard px-8 py-3.5 rounded-full glass text-sm font-normal transition-all hover:opacity-90" style="border-color: var(--fg-secondary);">
        Explore Agents
      </a>
    </div>
  </div>

</section>

<!-- ═══════════ LIVE DEMO PREVIEW ═══════════ -->
<section class="relative py-24 overflow-hidden" style="background: var(--bg-primary);">
  <div class="max-w-6xl mx-auto px-6">
    <div class="reveal text-center mb-12">
      <h2 class="text-3xl sm:text-4xl font-normal mb-3" style="color: var(--fg-primary); font-family: 'Inter', sans-serif;">Watch one control test, <span class="gradient-text">end to end</span></h2>
      <p class="max-w-xl mx-auto" style="color: var(--fg-secondary);">CTL-CC-385650 — Customer Verification PII — processed live through all four agents</p>
    </div>

    <div class="reveal reveal-delay-1 code-preview rounded-2xl overflow-hidden glow-blue max-w-4xl mx-auto">
      <div class="flex items-center gap-2 px-4 py-3 border-b border-white/5">
        <div class="flex gap-1.5">
          <div class="w-3 h-3 rounded-full bg-red-500/80"></div>
          <div class="w-3 h-3 rounded-full bg-yellow-500/80"></div>
          <div class="w-3 h-3 rounded-full bg-green-500/80"></div>
        </div>
        <span class="text-[11px] text-slate-500 ml-2 font-mono">agent-4-dashboard — CTL-CC-385650</span>
      </div>
      <div class="p-5 space-y-1 text-[13px] leading-relaxed overflow-x-auto" id="terminal-demo">
        <div class="text-slate-500">$ goldenflitch test --control CTL-CC-385650 --period Q4-2025</div>
        <div>&nbsp;</div>
        <div><span class="text-cyan-400">▶ AGENT 4</span> <span class="text-slate-500">Initializing test run...</span></div>
        <div><span class="text-cyan-400">▶ AGENT 4</span> Dispatching <span class="text-amber-400">Agent 1</span> — Document Retrieval</div>
        <div>&nbsp;</div>
        <div><span class="text-amber-400">  ● AGENT 1</span> Querying Vector DB... <span class="text-emerald-400">3 documents found</span></div>
        <div><span class="text-amber-400">  ● AGENT 1</span> <span class="text-slate-400">├──</span> PII Process v0.0.7 <span class="text-slate-500">(similarity: 0.97)</span></div>
        <div><span class="text-amber-400">  ● AGENT 1</span> <span class="text-slate-400">├──</span> OTP Subprocess v1.2.0 <span class="text-slate-500">(similarity: 0.89)</span></div>
        <div><span class="text-amber-400">  ● AGENT 1</span> <span class="text-slate-400">└──</span> Auth Policy v3.1 <span class="text-slate-500">(similarity: 0.82)</span></div>
        <div><span class="text-amber-400">  ● AGENT 1</span> <span class="text-red-400">⚠ FLAG:</span> v0.0.7 is UNAPPROVED <span class="text-slate-500">(GOV-001)</span></div>
        <div><span class="text-amber-400">  ● AGENT 1</span> Evidence score: <span class="text-emerald-400">88%</span> — Sufficient ✓</div>
        <div>&nbsp;</div>
        <div><span class="text-cyan-400">▶ AGENT 4</span> Dispatching <span class="text-pink-400">Agent 2</span> — Test of Effectiveness</div>
        <div><span class="text-pink-400">  ● AGENT 2</span> Population: <span class="text-white">65,000</span> calls | Sample: <span class="text-white">385</span> <span class="text-slate-500">(95% CI, 2.5% MOE)</span></div>
        <div><span class="text-pink-400">  ● AGENT 2</span> Running 3 scenarios... <span class="text-emerald-400">████████████████</span> 100%</div>
        <div><span class="text-pink-400">  ● AGENT 2</span> Exceptions: <span class="text-red-400">2 CRIT</span> · <span class="text-amber-400">5 HIGH</span> · <span class="text-yellow-300">4 MED</span> · <span class="text-purple-400">2 ML</span></div>
        <div><span class="text-pink-400">  ● AGENT 2</span> <span class="text-purple-400">🔮 ML ANOMALY:</span> CSR C-1147 — 3.2σ deviation (12 calls, partial→full access)</div>
        <div><span class="text-pink-400">  ● AGENT 2</span> Verdict: <span class="text-amber-400 font-semibold">QUALIFIED</span> <span class="text-slate-500">(96.6% compliance, 87.3% confidence)</span></div>
        <div>&nbsp;</div>
        <div><span class="text-cyan-400">▶ AGENT 4</span> Dispatching <span class="text-violet-400">Agent 3</span> — Test of Design</div>
        <div><span class="text-violet-400">  ● AGENT 3</span> COSO Assessment: <span class="text-slate-400">CE:0.82 RA:0.58 CA:0.75 IC:0.55 MA:0.50</span></div>
        <div><span class="text-violet-400">  ● AGENT 3</span> Design gaps: <span class="text-red-400">2 HIGH</span> · <span class="text-amber-400">2 MEDIUM</span></div>
        <div><span class="text-violet-400">  ● AGENT 3</span> <span class="text-cyan-400">↔ CROSS-REF:</span> EXC-001 (bypass) ← GAP-002 (no escalation path)</div>
        <div><span class="text-violet-400">  ● AGENT 3</span> Rating: <span class="text-amber-400 font-semibold">NEEDS IMPROVEMENT</span> <span class="text-slate-500">(score: 0.64)</span></div>
        <div>&nbsp;</div>
        <div><span class="text-cyan-400">▶ AGENT 4</span> Compiling workpaper...</div>
        <div><span class="text-cyan-400">▶ AGENT 4</span> → RSA Archer: <span class="text-emerald-400">POST /api/v6/content/findings → 201 Created</span></div>
        <div><span class="text-cyan-400">▶ AGENT 4</span> Finding ID: <span class="text-white font-semibold">FND-2026-Q4-00147</span></div>
        <div>&nbsp;</div>
        <div class="text-emerald-400 font-semibold">✓ Test complete — 24m 53s (manual equivalent: 5 hours) — 91.7% time savings</div>
      </div>
    </div>
  </div>
</section>

<!-- ═══════════ ARCHITECTURE ═══════════ -->
<section id="architecture" class="relative py-24" style="background: rgba(42,75,138,0.03);">
  <div class="max-w-6xl mx-auto px-6">
    <div class="reveal text-center mb-16">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-[11px] font-medium mb-4 uppercase tracking-wider" style="color: var(--fg-secondary);">Architecture</div>
      <h2 class="text-3xl sm:text-4xl font-normal mb-4" style="color: var(--fg-primary); font-family: 'Inter', sans-serif;">Three layers. <span class="gradient-text">Zero egress.</span></h2>
      <p class="max-w-xl mx-auto" style="color: var(--fg-secondary);">Your data never leaves your building. All LLM inference runs locally on Axos-owned GPU hardware.</p>
    </div>

    <div class="reveal grid md:grid-cols-3 gap-6 mb-12">
      <div class="glass rounded-2xl p-6 card-hover group relative overflow-hidden">
        <div class="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl -translate-y-8 translate-x-8 group-hover:scale-150 transition-transform duration-700" style="background: rgba(232,156,51,0.2);"></div>
        <div class="relative">
          <div class="w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-2xl" style="background: rgba(232,156,51,0.2);">🧠</div>
          <h3 class="text-lg font-normal mb-2" style="color: var(--fg-primary); font-family: 'Inter', sans-serif;">Agent Cluster</h3>
          <p class="text-sm leading-relaxed mb-4" style="color: var(--fg-secondary);">4 AI agents running on Axos Kubernetes. Llama 3 70B + Mixtral 8×7B on local NVIDIA A100 GPUs.</p>
          <div class="flex flex-wrap gap-1.5">
            <span class="px-2 py-0.5 rounded-md text-[10px] font-medium border" style="background: rgba(232,156,51,0.15); color: var(--accent); border-color: rgba(232,156,51,0.4);">Llama 3 70B</span>
            <span class="px-2 py-0.5 rounded-md text-[10px] font-medium border" style="background: rgba(232,156,51,0.15); color: var(--accent); border-color: rgba(232,156,51,0.4);">Mixtral 8×7B</span>
            <span class="px-2 py-0.5 rounded-md text-[10px] font-medium border" style="background: rgba(232,156,51,0.15); color: var(--accent); border-color: rgba(232,156,51,0.4);">vLLM</span>
          </div>
        </div>
      </div>
      <div class="glass rounded-2xl p-6 card-hover group relative overflow-hidden reveal-delay-1">
        <div class="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl -translate-y-8 translate-x-8 group-hover:scale-150 transition-transform duration-700" style="background: rgba(232,156,51,0.15);"></div>
        <div class="relative">
          <div class="w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-2xl" style="background: rgba(232,156,51,0.15);">🔌</div>
          <h3 class="text-lg font-normal mb-2" style="color: var(--fg-primary); font-family: 'Inter', sans-serif;">Integration Gateway</h3>
          <p class="text-sm leading-relaxed mb-4" style="color: var(--fg-secondary);">Outbound-only proxy. Zero inbound ports. TLS 1.3 everywhere. Connectors for Archer, iGrafx, SFTP, SQL.</p>
          <div class="flex flex-wrap gap-1.5">
            <span class="px-2 py-0.5 rounded-md text-[10px] font-medium border" style="background: rgba(232,156,51,0.15); color: var(--accent); border-color: rgba(232,156,51,0.4);">RSA Archer</span>
            <span class="px-2 py-0.5 rounded-md text-[10px] font-medium border" style="background: rgba(232,156,51,0.15); color: var(--accent); border-color: rgba(232,156,51,0.4);">iGrafx OData</span>
            <span class="px-2 py-0.5 rounded-md text-[10px] font-medium border" style="background: rgba(232,156,51,0.15); color: var(--accent); border-color: rgba(232,156,51,0.4);">ODBC/JDBC</span>
          </div>
        </div>
      </div>
      <div class="glass rounded-2xl p-6 card-hover group relative overflow-hidden reveal-delay-2">
        <div class="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl -translate-y-8 translate-x-8 group-hover:scale-150 transition-transform duration-700" style="background: rgba(232,156,51,0.15);"></div>
        <div class="relative">
          <div class="w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-2xl" style="background: rgba(232,156,51,0.15);">🔒</div>
          <h3 class="text-lg font-normal mb-2" style="color: var(--fg-primary); font-family: 'Inter', sans-serif;">Storage & Audit</h3>
          <p class="text-sm leading-relaxed mb-4" style="color: var(--fg-secondary);">Vector DB, PostgreSQL, immutable hash-chain audit log. AES-256-GCM encryption. 7-year retention.</p>
          <div class="flex flex-wrap gap-1.5">
            <span class="px-2 py-0.5 rounded-md text-[10px] font-medium border" style="background: rgba(232,156,51,0.15); color: var(--accent); border-color: rgba(232,156,51,0.4);">SHA-256 Chain</span>
            <span class="px-2 py-0.5 rounded-md text-[10px] font-medium border" style="background: rgba(232,156,51,0.15); color: var(--accent); border-color: rgba(232,156,51,0.4);">AES-256</span>
            <span class="px-2 py-0.5 rounded-md text-[10px] font-medium border" style="background: rgba(232,156,51,0.15); color: var(--accent); border-color: rgba(232,156,51,0.4);">17a-4</span>
          </div>
        </div>
      </div>
    </div>

    <div class="reveal rounded-2xl p-8 max-w-3xl mx-auto text-center" style="background: var(--fg-primary);">
      <div class="text-4xl mb-4">🛡️</div>
      <h3 class="text-xl font-normal mb-2" style="color: #DDE5EE; font-family: 'Inter', sans-serif;">Zero Data Egress Architecture</h3>
      <p class="text-sm max-w-lg mx-auto leading-relaxed" style="color: #A8B8C8;">No API calls to OpenAI, Anthropic, or any cloud LLM. Outbound-only network posture — zero inbound ports on your firewall. <strong style="color: #DDE5EE;">Your data never leaves your building.</strong></p>
      <button onclick="openDrawer(1)" class="btn-standard mt-5 px-5 py-2 rounded-full text-xs font-medium transition-all hover:opacity-90" style="background: #ffffff; border: 1px solid #e2e8f0; color: #1a1a1a;">Read Full Architecture →</button>
    </div>
  </div>
</section>

<!-- ═══════════ FOUR AGENTS ═══════════ -->
<section id="agents" class="relative py-24">
  <div class="relative max-w-6xl mx-auto px-6">
    <div class="reveal text-center mb-12">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-[11px] font-medium mb-4 uppercase tracking-wider" style="color: var(--fg-secondary);">Four-Agent Model</div>
      <h2 class="text-3xl sm:text-4xl font-normal mb-4" style="color: var(--fg-primary); font-family: 'Inter', sans-serif;">Four agents. <span class="gradient-text">One pipeline.</span></h2>
      <p class="max-w-xl mx-auto" style="color: var(--fg-secondary);">Each agent has a distinct role. Together, they deliver examination-ready workpapers autonomously.</p>
    </div>

    <div class="reveal flex flex-wrap justify-center gap-2 mb-8">
      <button onclick="switchAgent(0)" class="btn-standard agent-tab active px-4 py-2.5 rounded-xl glass text-sm font-medium flex items-center gap-2" data-agent="0">
        <span class="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold" style="background: rgba(232,156,51,0.3); color: var(--accent);">1</span> Retrieval
      </button>
      <button onclick="switchAgent(1)" class="btn-standard agent-tab px-4 py-2.5 rounded-xl glass text-sm font-medium flex items-center gap-2" data-agent="1">
        <span class="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold" style="background: rgba(232,156,51,0.2); color: var(--accent);">2</span> TOE
      </button>
      <button onclick="switchAgent(2)" class="btn-standard agent-tab px-4 py-2.5 rounded-xl glass text-sm font-medium flex items-center gap-2" data-agent="2">
        <span class="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold" style="background: rgba(232,156,51,0.2); color: var(--accent);">3</span> TOD
      </button>
      <button onclick="switchAgent(3)" class="btn-standard agent-tab px-4 py-2.5 rounded-xl glass text-sm font-medium flex items-center gap-2" data-agent="3">
        <span class="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold" style="background: rgba(232,156,51,0.2); color: var(--accent);">4</span> Supervisor
      </button>
    </div>

    <!-- Agent content panels -->
    <div class="reveal">
      <div class="agent-content active" data-agent="0">
        <div class="grid lg:grid-cols-2 gap-6">
          <div class="glass rounded-2xl p-8">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center font-bold text-white">1</div>
              <div><h3 class="font-normal text-lg" style="color: var(--fg-primary); font-family: 'Inter', sans-serif;">Documentation Retrieval</h3><p class="text-xs" style="color: var(--fg-secondary);">Llama 3 70B — Read-Only Access</p></div>
            </div>
            <ul class="space-y-3 text-sm" style="color: var(--fg-primary);">
              <li class="flex gap-3"><span style="color: var(--accent);" class="mt-0.5">✓</span> OAuth 2.0 + mTLS secure API integration</li>
              <li class="flex gap-3"><span style="color: var(--accent);" class="mt-0.5">✓</span> Autonomous discovery across multiple repositories</li>
              <li class="flex gap-3"><span style="color: var(--accent);" class="mt-0.5">✓</span> Auto-tagging: 6 regulatory domains, 4 risk categories</li>
              <li class="flex gap-3"><span style="color: var(--accent);" class="mt-0.5">✓</span> Version control & 274-day gap analysis</li>
              <li class="flex gap-3"><span style="color: var(--accent);" class="mt-0.5">✓</span> SHA-256 hash-chain audit trail</li>
              <li class="flex gap-3"><span style="color: var(--accent);" class="mt-0.5">✓</span> Evidence completeness scoring (88%)</li>
            </ul>
            <button onclick="openDrawer(4)" class="btn-standard mt-6 px-4 py-2 rounded-lg glass text-xs font-medium transition-all hover:opacity-90">Full Details →</button>
          </div>
          <div class="code-preview rounded-2xl">
            <div class="flex items-center gap-2 px-4 py-3 border-b border-white/5">
              <div class="flex gap-1.5"><div class="w-2.5 h-2.5 rounded-full bg-red-500/60"></div><div class="w-2.5 h-2.5 rounded-full bg-yellow-500/60"></div><div class="w-2.5 h-2.5 rounded-full bg-green-500/60"></div></div>
              <span class="text-[10px] ml-1" style="color: var(--fg-secondary);">agent-1-output.json</span>
            </div>
            <div class="p-4 text-[12px] leading-relaxed"><span class="comment">// Evidence Completeness Assessment</span>
{
  <span class="prop">"control_id"</span>: <span class="string">"CTL-CC-385650"</span>,
  <span class="prop">"documents_found"</span>: <span class="val">3</span>,
  <span class="prop">"evidence_score"</span>: <span class="val">0.88</span>,
  <span class="prop">"governance_flags"</span>: [
    { <span class="prop">"id"</span>: <span class="string">"GOV-001"</span>, <span class="prop">"severity"</span>: <span class="string">"HIGH"</span>,
      <span class="prop">"title"</span>: <span class="string">"Document UNAPPROVED"</span> },
    { <span class="prop">"id"</span>: <span class="string">"GOV-002"</span>, <span class="prop">"severity"</span>: <span class="string">"MEDIUM"</span>,
      <span class="prop">"title"</span>: <span class="string">"274-day version gap"</span> },
    { <span class="prop">"id"</span>: <span class="string">"GOV-003"</span>, <span class="prop">"severity"</span>: <span class="string">"MEDIUM"</span>,
      <span class="prop">"title"</span>: <span class="string">"Single author, no review"</span> }
  ],
  <span class="prop">"status"</span>: <span class="string">"SUFFICIENT — proceed to Agent 2"</span>
}</div>
          </div>
        </div>
      </div>

      <div class="agent-content" data-agent="1">
        <div class="grid lg:grid-cols-2 gap-6">
          <div class="glass rounded-2xl p-8">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center font-bold text-white">2</div>
              <div><h3 class="font-normal text-lg" style="color: var(--fg-primary); font-family: 'Inter', sans-serif;">Test of Effectiveness</h3><p class="text-xs" style="color: var(--fg-secondary);">Mixtral 8×7B — Statistical + ML</p></div>
            </div>
            <ul class="space-y-3 text-sm" style="color: var(--fg-primary);">
              <li class="flex gap-3"><span style="color: var(--accent);" class="mt-0.5">✓</span> Cochran's formula sampling: 385 from 65,000</li>
              <li class="flex gap-3"><span style="color: var(--accent);" class="mt-0.5">✓</span> Stratified by Track A (60%) / Track B (40%)</li>
              <li class="flex gap-3"><span style="color: var(--accent);" class="mt-0.5">✓</span> 3 parallel test scenarios executed</li>
              <li class="flex gap-3"><span style="color: var(--accent);" class="mt-0.5">✓</span> Isolation Forest + DBSCAN anomaly detection</li>
              <li class="flex gap-3"><span class="mt-0.5" style="color: #f87171;">!</span> CSR C-1147: 3.2σ behavioral anomaly detected</li>
              <li class="flex gap-3"><span style="color: var(--accent);" class="mt-0.5">✓</span> 13 exceptions, 96.6% compliance rate</li>
            </ul>
            <button onclick="openDrawer(5)" class="btn-standard mt-6 px-4 py-2 rounded-lg glass text-xs font-medium transition-all hover:opacity-90">Full Details →</button>
          </div>
          <div class="code-preview rounded-2xl">
            <div class="flex items-center gap-2 px-4 py-3 border-b border-white/5">
              <div class="flex gap-1.5"><div class="w-2.5 h-2.5 rounded-full bg-red-500/60"></div><div class="w-2.5 h-2.5 rounded-full bg-yellow-500/60"></div><div class="w-2.5 h-2.5 rounded-full bg-green-500/60"></div></div>
              <span class="text-[10px] ml-1" style="color: var(--fg-secondary);">toe-conclusion.json</span>
            </div>
            <div class="p-4 text-[12px] leading-relaxed"><span class="comment">// TOE Result Summary</span>
{
  <span class="prop">"verdict"</span>: <span class="string">"QUALIFIED"</span>,
  <span class="prop">"compliance_rate"</span>: <span class="val">0.966</span>,
  <span class="prop">"confidence"</span>: <span class="val">0.873</span>,
  <span class="prop">"sample_size"</span>: <span class="val">385</span>,
  <span class="prop">"population"</span>: <span class="val">65000</span>,
  <span class="prop">"exceptions"</span>: {
    <span class="prop">"CRITICAL"</span>: <span class="val">2</span>,  <span class="comment">// security word bypass</span>
    <span class="prop">"HIGH"</span>: <span class="val">5</span>,      <span class="comment">// insufficient PII</span>
    <span class="prop">"MEDIUM"</span>: <span class="val">4</span>,    <span class="comment">// hint inconsistency</span>
    <span class="prop">"ML_OBS"</span>: <span class="val">2</span>     <span class="comment">// CSR pattern + after-hours</span>
  },
  <span class="prop">"time_savings"</span>: <span class="string">"95.4%"</span>,
  <span class="prop">"processing_time"</span>: <span class="string">"12m 24s"</span>
}</div>
          </div>
        </div>
      </div>

      <div class="agent-content" data-agent="2">
        <div class="grid lg:grid-cols-2 gap-6">
          <div class="glass rounded-2xl p-8">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center font-bold text-white">3</div>
              <div><h3 class="font-normal text-lg" style="color: var(--fg-primary); font-family: 'Inter', sans-serif;">Test of Design</h3><p class="text-xs" style="color: var(--fg-secondary);">Llama 3 70B — COSO Analysis</p></div>
            </div>
            <ul class="space-y-3 text-sm" style="color: var(--fg-primary);">
              <li class="flex gap-3"><span style="color: var(--accent);" class="mt-0.5">✓</span> COSO 2013 five-component framework mapping</li>
              <li class="flex gap-3"><span style="color: var(--accent);" class="mt-0.5">✓</span> 4 design gaps identified (2 HIGH, 2 MED)</li>
              <li class="flex gap-3"><span style="color: var(--accent);" class="mt-0.5">✓</span> TOE-TOD cross-reference: bypass → no escalation</li>
              <li class="flex gap-3"><span style="color: var(--accent);" class="mt-0.5">✓</span> FFIEC, NIST 800-63B, PCI DSS v4.0 benchmarks</li>
              <li class="flex gap-3"><span style="color: var(--accent);" class="mt-0.5">✓</span> Remediation recommendations with owners & dates</li>
              <li class="flex gap-3"><span class="mt-0.5" style="color: var(--accent);">△</span> Rating: NEEDS IMPROVEMENT (0.64)</li>
            </ul>
            <button onclick="openDrawer(6)" class="btn-standard mt-6 px-4 py-2 rounded-lg glass text-xs font-medium transition-all hover:opacity-90">Full Details →</button>
          </div>
          <div class="glass rounded-2xl p-6">
            <h4 class="text-sm font-normal mb-4" style="color: var(--fg-primary); font-family: 'Inter', sans-serif;">COSO Component Scores</h4>
            <div class="space-y-4">
              <div><div class="flex justify-between text-xs mb-1"><span style="color: var(--fg-secondary);">Control Environment</span><span class="text-emerald-600 font-mono">0.82</span></div><div class="h-2 rounded-full bg-slate-100"><div class="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400" style="width:82%"></div></div></div>
              <div><div class="flex justify-between text-xs mb-1"><span style="color: var(--fg-secondary);">Risk Assessment</span><span class="text-amber-600 font-mono">0.58</span></div><div class="h-2 rounded-full bg-slate-100"><div class="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400" style="width:58%"></div></div></div>
              <div><div class="flex justify-between text-xs mb-1"><span style="color: var(--fg-secondary);">Control Activities</span><span class="text-emerald-600 font-mono">0.75</span></div><div class="h-2 rounded-full bg-slate-100"><div class="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400" style="width:75%"></div></div></div>
              <div><div class="flex justify-between text-xs mb-1"><span style="color: var(--fg-secondary);">Info & Communication</span><span class="text-amber-600 font-mono">0.55</span></div><div class="h-2 rounded-full bg-slate-100"><div class="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400" style="width:55%"></div></div></div>
              <div><div class="flex justify-between text-xs mb-1"><span style="color: var(--fg-secondary);">Monitoring Activities</span><span class="text-red-600 font-mono">0.50</span></div><div class="h-2 rounded-full bg-slate-100"><div class="h-full rounded-full bg-gradient-to-r from-red-500 to-red-400" style="width:50%"></div></div></div>
            </div>
            <div class="mt-6 pt-4 border-t text-center" style="border-color: rgba(168,184,200,0.3);">
              <span class="text-3xl font-normal gradient-text">0.64</span>
              <p class="text-[10px] mt-1 uppercase tracking-wider" style="color: var(--fg-secondary);">Overall Design Score</p>
            </div>
          </div>
        </div>
      </div>

      <div class="agent-content" data-agent="3">
        <div class="grid lg:grid-cols-2 gap-6">
          <div class="glass rounded-2xl p-8">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-white">4</div>
              <div><h3 class="font-normal text-lg" style="color: var(--fg-primary); font-family: 'Inter', sans-serif;">Supervisory Agent</h3><p class="text-xs" style="color: var(--fg-secondary);">Llama 3 70B — Orchestration + NLU — <span style="color: var(--accent);" class="font-semibold">$0 cost</span></p></div>
            </div>
            <ul class="space-y-3 text-sm" style="color: var(--fg-primary);">
              <li class="flex gap-3"><span style="color: var(--accent);" class="mt-0.5">✓</span> DAG-based workflow orchestration</li>
              <li class="flex gap-3"><span style="color: var(--accent);" class="mt-0.5">✓</span> Real-time supervisory dashboard</li>
              <li class="flex gap-3"><span style="color: var(--accent);" class="mt-0.5">✓</span> 4-role RBAC (Viewer, Analyst, Manager, Admin)</li>
              <li class="flex gap-3"><span style="color: var(--accent);" class="mt-0.5">✓</span> Natural Language Query interface</li>
              <li class="flex gap-3"><span style="color: var(--accent);" class="mt-0.5">✓</span> RSA Archer workpaper push (201 Created)</li>
              <li class="flex gap-3"><span style="color: var(--accent);" class="mt-0.5">✓</span> 6 human-in-the-loop review checkpoints</li>
            </ul>
            <button onclick="openDrawer(7)" class="btn-standard mt-6 px-4 py-2 rounded-lg glass text-xs font-medium transition-all hover:opacity-90">Full Details →</button>
          </div>
          <div class="glass rounded-2xl p-6 flex flex-col">
            <h4 class="text-sm font-normal mb-3" style="color: var(--fg-primary); font-family: 'Inter', sans-serif;">💬 Natural Language Query Demo</h4>
            <div class="flex-1 bg-slate-900 rounded-xl p-4 font-mono text-xs space-y-3 overflow-y-auto">
              <div>
                <div class="text-cyan-400 mb-1">You:</div>
                <div class="text-slate-300">"What controls related to customer authentication had exceptions this quarter?"</div>
              </div>
              <div>
                <div class="text-emerald-400 mb-1">Agent 4 <span class="text-slate-500">(Llama 3 70B, local)</span>:</div>
                <div class="text-slate-400">CTL-CC-385650 — Customer Verification PII<br>• TOE: QUALIFIED (96.6%, 13 exceptions)<br>• TOD: NEEDS IMPROVEMENT (4 design gaps)<br>• Critical: 2 security word bypasses<br>• ML: CSR C-1147 behavioral anomaly (3.2σ)</div>
              </div>
            </div>
            <p class="text-[10px] mt-3 text-center" style="color: var(--fg-secondary);">Processed entirely on local GPU — zero data egress</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ═══════════ MARKET SURVEILLANCE ═══════════ -->
<section id="surveillance" class="relative py-24" style="background: rgba(42,75,138,0.03);">
  <div class="max-w-6xl mx-auto px-6">
    <div class="reveal text-center mb-12">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-[11px] font-medium mb-4 uppercase tracking-wider" style="color: var(--fg-secondary);">Market Surveillance</div>
      <h2 class="text-3xl sm:text-4xl font-normal mb-4" style="color: var(--fg-primary); font-family: 'Inter', sans-serif;">12 rules. Daily alerts. <span class="gradient-text-gold">AI investigations.</span></h2>
      <p class="max-w-xl mx-auto" style="color: var(--fg-secondary);">Configurable rule engine, market data ingestion, and automated SAR drafting — all on-premise.</p>
    </div>

    <div class="reveal grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
      ${[
        { id: "MSR-001", name: "Insider Trading", cat: "Market Abuse", color: "red" },
        { id: "MSR-002", name: "Front-Running", cat: "Market Abuse", color: "red" },
        { id: "MSR-003", name: "Wash Trading", cat: "Manipulation", color: "orange" },
        { id: "MSR-004", name: "Spoofing / Layering", cat: "Manipulation", color: "orange" },
        { id: "MSR-005", name: "Churning", cat: "Suitability", color: "amber" },
        { id: "MSR-006", name: "Marking the Close", cat: "Manipulation", color: "orange" },
        { id: "MSR-007", name: "Late Trading", cat: "Fund Abuse", color: "purple" },
        { id: "MSR-008", name: "Best Execution", cat: "Order Handling", color: "blue" },
        { id: "MSR-009", name: "Unauthorized Trading", cat: "Protection", color: "red" },
        { id: "MSR-010", name: "Concentration Risk", cat: "Suitability", color: "amber" },
        { id: "MSR-011", name: "Suspicious Wire", cat: "AML / BSA", color: "red" },
        { id: "MSR-012", name: "Comms Surveillance", cat: "Supervision", color: "cyan" },
      ].map(r => `
        <div class="glass rounded-xl p-4 card-hover group cursor-pointer" onclick="openDrawer(8)">
          <div class="flex items-center justify-between mb-2">
            <span class="text-[10px] font-mono text-slate-400">${r.id}</span>
            <span class="px-2 py-0.5 rounded-md bg-${r.color}-50 text-${r.color}-700 text-[10px] font-medium border border-${r.color}-200">${r.cat}</span>
          </div>
          <h4 class="font-normal text-sm transition-colors group-hover:opacity-90" style="color: var(--fg-primary);">${r.name}</h4>
        </div>
      `).join("")}
    </div>

    <!-- Alert flow -->
    <div class="reveal glass rounded-2xl p-8 max-w-4xl mx-auto">
      <h3 class="font-normal text-lg mb-6 text-center" style="color: var(--fg-primary); font-family: 'Inter', sans-serif;">Daily Alert Pipeline</h3>
      <div class="flex flex-col sm:flex-row items-center gap-4 sm:gap-2 text-center">
        <div class="flex-1 p-4 rounded-xl border glass">
          <div class="text-2xl mb-2">⚙️</div>
          <div class="text-xs font-normal" style="color: var(--fg-primary);">Rule Engine</div>
          <div class="text-[10px] mt-1" style="color: var(--fg-secondary);">12 rules<br>~350 raw alerts</div>
        </div>
        <div class="text-lg hidden sm:block" style="color: var(--fg-secondary);">→</div>
        <div class="flex-1 p-4 rounded-xl border glass">
          <div class="text-2xl mb-2">🔀</div>
          <div class="text-xs font-normal" style="color: var(--fg-primary);">Triage & ML</div>
          <div class="text-[10px] mt-1" style="color: var(--fg-secondary);">De-dup, filter<br>~147 triaged</div>
        </div>
        <div class="text-lg hidden sm:block" style="color: var(--fg-secondary);">→</div>
        <div class="flex-1 p-4 rounded-xl border glass">
          <div class="text-2xl mb-2">🤖</div>
          <div class="text-xs font-normal" style="color: var(--fg-primary);">AI Investigation</div>
          <div class="text-[10px] mt-1" style="color: var(--fg-secondary);">Context + analysis<br>15 min/alert</div>
        </div>
        <div class="text-lg hidden sm:block" style="color: var(--fg-secondary);">→</div>
        <div class="flex-1 p-4 rounded-xl border glass">
          <div class="text-2xl mb-2">📋</div>
          <div class="text-xs font-normal" style="color: var(--fg-primary);">SAR Filing</div>
          <div class="text-[10px] mt-1" style="color: var(--fg-secondary);">Dual-approval<br>FinCEN API</div>
        </div>
      </div>
      <button onclick="openDrawer(8)" class="btn-standard mt-6 w-full px-4 py-2.5 rounded-lg glass text-xs font-medium transition-all hover:opacity-90 text-center">View Full Market Surveillance Plan →</button>
    </div>
  </div>
</section>

<!-- ═══════════ DOMAIN ACCURACY VISUAL ═══════════ -->
<section class="relative py-24" style="background: var(--bg-primary);">
  <div class="max-w-6xl mx-auto px-6">
    <div class="reveal text-center mb-12">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-[11px] font-medium mb-4 uppercase tracking-wider" style="color: var(--fg-secondary);">Domain Fine-Tuning</div>
      <h2 class="text-3xl sm:text-4xl font-normal mb-4" style="color: var(--fg-primary); font-family: 'Inter', sans-serif;">Domain accuracy <span class="gradient-text">beats general-purpose</span></h2>
      <p class="max-w-xl mx-auto" style="color: var(--fg-secondary);">Fine-tuned on 12,000+ regulatory documents. Benchmarked on 500 domain-specific questions.</p>
    </div>
    <div class="reveal grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      <div class="glass rounded-2xl p-6">
        <h4 class="text-sm font-normal mb-5" style="color: var(--fg-primary); font-family: 'Inter', sans-serif;">Regulatory Citation Accuracy</h4>
        <div class="space-y-4">
          <div><div class="flex justify-between text-xs mb-1"><span style="color: var(--accent);">Llama 3 70B-FT (Ours)</span><span class="font-mono" style="color: var(--accent);">94.2%</span></div><div class="h-3 rounded-full" style="background: rgba(42,75,138,0.15);"><div class="h-full rounded-full" style="width:94.2%; background: var(--accent);"></div></div></div>
          <div><div class="flex justify-between text-xs mb-1"><span style="color: var(--fg-secondary);">Claude 3.5</span><span class="font-mono" style="color: var(--fg-secondary);">89.3%</span></div><div class="h-3 rounded-full" style="background: rgba(42,75,138,0.15);"><div class="h-full rounded-full" style="width:89.3%; background: var(--fg-secondary);"></div></div></div>
          <div><div class="flex justify-between text-xs mb-1"><span style="color: var(--fg-secondary);">GPT-4</span><span class="font-mono" style="color: var(--fg-secondary);">87.1%</span></div><div class="h-3 rounded-full" style="background: rgba(42,75,138,0.15);"><div class="h-full rounded-full" style="width:87.1%; background: var(--fg-secondary);"></div></div></div>
        </div>
      </div>
      <div class="glass rounded-2xl p-6">
        <h4 class="text-sm font-normal mb-5" style="color: var(--fg-primary); font-family: 'Inter', sans-serif;">Control Gap Identification</h4>
        <div class="space-y-4">
          <div><div class="flex justify-between text-xs mb-1"><span style="color: var(--accent);">Llama 3 70B-FT (Ours)</span><span class="font-mono" style="color: var(--accent);">91.8%</span></div><div class="h-3 rounded-full" style="background: rgba(42,75,138,0.15);"><div class="h-full rounded-full" style="width:91.8%; background: var(--accent);"></div></div></div>
          <div><div class="flex justify-between text-xs mb-1"><span style="color: var(--fg-secondary);">Claude 3.5</span><span class="font-mono" style="color: var(--fg-secondary);">86.9%</span></div><div class="h-3 rounded-full" style="background: rgba(42,75,138,0.15);"><div class="h-full rounded-full" style="width:86.9%; background: var(--fg-secondary);"></div></div></div>
          <div><div class="flex justify-between text-xs mb-1"><span style="color: var(--fg-secondary);">GPT-4</span><span class="font-mono" style="color: var(--fg-secondary);">85.4%</span></div><div class="h-3 rounded-full" style="background: rgba(42,75,138,0.15);"><div class="h-full rounded-full" style="width:85.4%; background: var(--fg-secondary);"></div></div></div>
        </div>
      </div>
      <div class="glass rounded-2xl p-6">
        <h4 class="text-sm font-normal mb-5" style="color: var(--fg-primary); font-family: 'Inter', sans-serif;">COSO Framework Mapping</h4>
        <div class="space-y-4">
          <div><div class="flex justify-between text-xs mb-1"><span style="color: var(--accent);">Llama 3 70B-FT (Ours)</span><span class="font-mono" style="color: var(--accent);">93.5%</span></div><div class="h-3 rounded-full" style="background: rgba(42,75,138,0.15);"><div class="h-full rounded-full" style="width:93.5%; background: var(--accent);"></div></div></div>
          <div><div class="flex justify-between text-xs mb-1"><span style="color: var(--fg-secondary);">Claude 3.5</span><span class="font-mono" style="color: var(--fg-secondary);">84.1%</span></div><div class="h-3 rounded-full" style="background: rgba(42,75,138,0.15);"><div class="h-full rounded-full" style="width:84.1%; background: var(--fg-secondary);"></div></div></div>
          <div><div class="flex justify-between text-xs mb-1"><span style="color: var(--fg-secondary);">GPT-4</span><span class="font-mono" style="color: var(--fg-secondary);">82.7%</span></div><div class="h-3 rounded-full" style="background: rgba(42,75,138,0.15);"><div class="h-full rounded-full" style="width:82.7%; background: var(--fg-secondary);"></div></div></div>
        </div>
      </div>
      <div class="glass rounded-2xl p-6">
        <h4 class="text-sm font-normal mb-5" style="color: var(--fg-primary); font-family: 'Inter', sans-serif;">False Positive Rate (lower is better)</h4>
        <div class="space-y-4">
          <div><div class="flex justify-between text-xs mb-1"><span style="color: var(--accent);">Llama 3 70B-FT (Ours)</span><span class="font-mono" style="color: var(--accent);">3.2%</span></div><div class="h-3 rounded-full" style="background: rgba(42,75,138,0.15);"><div class="h-full rounded-full" style="width:32%; background: var(--accent);"></div></div></div>
          <div><div class="flex justify-between text-xs mb-1"><span style="color: var(--fg-secondary);">Claude 3.5</span><span class="font-mono" style="color: var(--fg-secondary);">7.4%</span></div><div class="h-3 rounded-full" style="background: rgba(42,75,138,0.15);"><div class="h-full rounded-full" style="width:74%; background: var(--fg-secondary);"></div></div></div>
          <div><div class="flex justify-between text-xs mb-1"><span style="color: var(--fg-secondary);">GPT-4</span><span class="font-mono" style="color: var(--fg-secondary);">8.7%</span></div><div class="h-3 rounded-full" style="background: rgba(42,75,138,0.15);"><div class="h-full rounded-full" style="width:87%; background: var(--fg-secondary);"></div></div></div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ═══════════ SCALABILITY VISUAL ═══════════ -->
<section class="relative py-24" style="background: rgba(42,75,138,0.03);">
  <div class="max-w-6xl mx-auto px-6">
    <div class="reveal text-center mb-12">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-[11px] font-medium mb-4 uppercase tracking-wider" style="color: var(--fg-secondary);">Auto-Scaling</div>
      <h2 class="text-3xl sm:text-4xl font-normal mb-4" style="color: var(--fg-primary); font-family: 'Inter', sans-serif;">On-premise <span class="gradient-text">elastic scaling</span></h2>
      <p class="max-w-xl mx-auto" style="color: var(--fg-secondary);">Kubernetes HPA auto-scales GPU nodes based on demand. No cloud dependency.</p>
    </div>
    <div class="reveal grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto mb-10">
      <div class="glass rounded-2xl p-5 text-center card-hover">
        <div class="text-3xl font-normal stat-value" style="color: var(--accent);">&lt;90s</div>
        <div class="text-[10px] mt-1 uppercase tracking-wider" style="color: var(--fg-secondary);">Scale-Up Time</div>
      </div>
      <div class="glass rounded-2xl p-5 text-center card-hover">
        <div class="text-3xl font-normal stat-value" style="color: var(--fg-primary);">1→8</div>
        <div class="text-[10px] mt-1 uppercase tracking-wider" style="color: var(--fg-secondary);">GPU Node Range</div>
      </div>
      <div class="glass rounded-2xl p-5 text-center card-hover">
        <div class="text-3xl font-normal stat-value" style="color: var(--accent);">47</div>
        <div class="text-[10px] mt-1 uppercase tracking-wider" style="color: var(--fg-secondary);">Concurrent Tests</div>
      </div>
      <div class="glass rounded-2xl p-5 text-center card-hover">
        <div class="text-3xl font-normal stat-value" style="color: var(--fg-primary);">Linear</div>
        <div class="text-[10px] mt-1 uppercase tracking-wider" style="color: var(--fg-secondary);">Scaling Curve</div>
      </div>
    </div>
    <div class="reveal glass rounded-2xl p-6 max-w-4xl mx-auto">
      <h4 class="text-sm font-normal mb-4" style="color: var(--fg-primary); font-family: 'Inter', sans-serif;">Throughput by GPU Node Count</h4>
      <div class="space-y-3">
        <div><div class="flex justify-between text-xs mb-1"><span style="color: var(--fg-secondary);">1 GPU Node</span><span class="font-mono" style="color: var(--fg-primary);">12 tests</span></div><div class="h-3 rounded-full" style="background: rgba(42,75,138,0.15);"><div class="h-full rounded-full" style="width:25.5%; background: var(--fg-primary);"></div></div></div>
        <div><div class="flex justify-between text-xs mb-1"><span style="color: var(--fg-secondary);">2 GPU Nodes</span><span class="font-mono" style="color: var(--fg-primary);">24 tests</span></div><div class="h-3 rounded-full" style="background: rgba(42,75,138,0.15);"><div class="h-full rounded-full" style="width:51%; background: var(--fg-primary);"></div></div></div>
        <div><div class="flex justify-between text-xs mb-1"><span style="color: var(--accent);">4 GPU Nodes</span><span class="font-mono" style="color: var(--accent);">47 tests</span></div><div class="h-3 rounded-full" style="background: rgba(42,75,138,0.15);"><div class="h-full rounded-full" style="width:100%; background: var(--accent);"></div></div></div>
      </div>
    </div>
  </div>
</section>

<!-- ═══════════ COMPETITIVE ═══════════ -->
<section id="competitive" class="relative py-24" style="background: var(--bg-primary);">
  <div class="max-w-6xl mx-auto px-6">
    <div class="reveal text-center mb-12">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-[11px] font-medium mb-4 uppercase tracking-wider" style="color: var(--fg-secondary);">Competitive Advantage</div>
      <h2 class="text-3xl sm:text-4xl font-normal mb-4" style="color: var(--fg-primary); font-family: 'Inter', sans-serif;">Why Goldenflitch <span class="gradient-text-cyan">wins — everywhere</span></h2>
    </div>

    <div class="reveal overflow-x-auto glass rounded-2xl">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b" style="border-color: rgba(42,75,138,0.2);">
            <th class="text-left py-3 px-4 font-medium text-xs uppercase tracking-wider" style="color: var(--fg-secondary);">Dimension</th>
            <th class="text-left py-3 px-4 font-medium text-xs uppercase tracking-wider" style="color: var(--accent);">Goldenflitch</th>
            <th class="text-left py-3 px-4 font-medium text-xs uppercase tracking-wider" style="color: var(--fg-secondary);">Cloud Competitor</th>
          </tr>
        </thead>
        <tbody class="text-xs">
          <tr class="border-b" style="border-color: rgba(42,75,138,0.1);"><td class="py-3 px-4" style="color: var(--fg-secondary);">Data Residency</td><td class="py-3 px-4 font-medium" style="color: var(--fg-primary);">100% on-premise, zero egress</td><td class="py-3 px-4" style="color: #dc2626;">AWS Cloud (API calls)</td></tr>
          <tr class="border-b" style="border-color: rgba(42,75,138,0.1);"><td class="py-3 px-4" style="color: var(--fg-secondary);">LLM Models</td><td class="py-3 px-4 font-medium" style="color: var(--fg-primary);">Llama 3 70B-FT — 94.2% regulatory accuracy</td><td class="py-3 px-4" style="color: #dc2626;">GPT-4 — 87.1% regulatory accuracy</td></tr>
          <tr class="border-b" style="border-color: rgba(42,75,138,0.1);"><td class="py-3 px-4" style="color: var(--fg-secondary);">Network Posture</td><td class="py-3 px-4 font-medium" style="color: var(--fg-primary);">Outbound-only, 0 inbound ports</td><td class="py-3 px-4" style="color: #dc2626;">5 inbound ports required</td></tr>
          <tr class="border-b" style="border-color: rgba(42,75,138,0.1);"><td class="py-3 px-4" style="color: var(--fg-secondary);">API Documentation</td><td class="py-3 px-4 font-medium" style="color: var(--fg-primary);">35-page spec (OpenAPI 3.1) at demo</td><td class="py-3 px-4" style="color: #dc2626;">31-page spec</td></tr>
          <tr class="border-b" style="border-color: rgba(42,75,138,0.1);"><td class="py-3 px-4" style="color: var(--fg-secondary);">Benchmarks</td><td class="py-3 px-4 font-medium" style="color: var(--fg-primary);">20-page formal report + live demo</td><td class="py-3 px-4" style="color: #dc2626;">17-page report only</td></tr>
          <tr class="border-b" style="border-color: rgba(42,75,138,0.1);"><td class="py-3 px-4" style="color: var(--fg-secondary);">Security Cert</td><td class="py-3 px-4 font-medium" style="color: var(--fg-primary);">SOC 2 audit underway (94% ready, Aug 2026)</td><td class="py-3 px-4" style="color: var(--fg-secondary);">SOC 2 Type II (current)</td></tr>
          <tr class="border-b" style="border-color: rgba(42,75,138,0.1);"><td class="py-3 px-4" style="color: var(--fg-secondary);">Scalability</td><td class="py-3 px-4 font-medium" style="color: var(--fg-primary);">K8s HPA: 1→8 GPU nodes, &lt;90s scale-up</td><td class="py-3 px-4" style="color: #dc2626;">AWS auto-scaling (cloud dependency)</td></tr>
          <tr class="border-b" style="border-color: rgba(42,75,138,0.1);"><td class="py-3 px-4" style="color: var(--fg-secondary);">Vendor Risk</td><td class="py-3 px-4 font-medium" style="color: var(--fg-primary);">1 vendor (Goldenflitch)</td><td class="py-3 px-4" style="color: #dc2626;">5+ vendors</td></tr>
          <tr class="border-b" style="border-color: rgba(42,75,138,0.1);"><td class="py-3 px-4" style="color: var(--fg-secondary);">iGrafx Integration</td><td class="py-3 px-4 font-medium" style="color: var(--fg-primary);">Native OData + Webhook + SFTP</td><td class="py-3 px-4" style="color: #dc2626;">Not documented</td></tr>
          <tr class="border-b" style="border-color: rgba(42,75,138,0.1);"><td class="py-3 px-4" style="color: var(--fg-secondary);">Agent 4 Cost</td><td class="py-3 px-4 font-medium" style="color: var(--fg-primary);">$0 (included free)</td><td class="py-3 px-4" style="color: var(--fg-secondary);">Unknown</td></tr>
          <tr><td class="py-3 px-4" style="color: var(--fg-secondary);">Year 1 Cost</td><td class="py-3 px-4 font-medium" style="color: var(--fg-primary);">$810K fixed — no variable fees</td><td class="py-3 px-4" style="color: var(--fg-secondary);">Not disclosed</td></tr>
        </tbody>
      </table>
    </div>
    <div class="text-center mt-6">
      <button onclick="openDrawer(11)" class="btn-standard px-5 py-2 rounded-full glass text-xs font-medium transition-all hover:opacity-90">Full Competitive Analysis →</button>
    </div>
  </div>
</section>

<!-- ═══════════ ALL SECTIONS GRID ═══════════ -->
<section id="sections" class="relative py-24" style="background: rgba(42,75,138,0.03);">
  <div class="max-w-6xl mx-auto px-6">
    <div class="reveal text-center mb-12">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-[11px] font-medium mb-4 uppercase tracking-wider" style="color: var(--fg-secondary);">Complete Plan</div>
      <h2 class="text-3xl sm:text-4xl font-normal mb-4" style="color: var(--fg-primary); font-family: 'Inter', sans-serif;">Every section, <span class="gradient-text">every detail</span></h2>
      <p class="max-w-xl mx-auto" style="color: var(--fg-secondary);">Click any card to read the full document section.</p>
    </div>

    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      ${sectionData.map((s, i) => `
        <div class="reveal glass rounded-2xl p-5 card-hover cursor-pointer group" onclick="openDrawer(${i})" style="transition-delay:${Math.min(i * 50, 400)}ms">
          <div class="flex items-start justify-between mb-3">
            <span class="text-2xl">${s.icon}</span>
            <span class="text-[10px] font-mono" style="color: var(--fg-secondary);">${String(i).padStart(2,'0')}</span>
          </div>
          <h3 class="font-normal text-sm mb-1 transition-colors group-hover:opacity-90" style="color: var(--fg-primary); font-family: 'Inter', sans-serif;">${s.title}</h3>
          <p class="text-xs leading-relaxed" style="color: var(--fg-secondary);">${s.short}</p>
          <div class="mt-3 text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-opacity" style="color: var(--accent);">Read full section →</div>
        </div>
      `).join("")}
    </div>
  </div>
</section>

<!-- ═══════════ FOOTER ═══════════ -->
<footer class="border-t py-12 nav-caps" style="background: var(--bg-primary); border-color: rgba(42,75,138,0.15);">
  <div class="max-w-6xl mx-auto px-6 text-center">
    <div class="flex items-center justify-center gap-3 mb-4">
      <img src="assets/goldenflitch-logo.png" alt="Goldenflitch" class="h-8 w-auto object-contain" />
      <img src="assets/axos-logo.png" alt="Axos®" class="h-7 w-auto object-contain" />
    </div>
    <p class="text-xs" style="color: var(--fg-secondary);">Confidential — Prepared for Axos Bank — February 2026</p>
    <p class="text-[10px] mt-2" style="color: var(--fg-secondary); opacity: 0.8;">Your data never leaves your building.</p>
  </div>
</footer>

<!-- ═══════════ DRAWER (Full Section Reader) ═══════════ -->
<div class="drawer-overlay fixed inset-0 z-[100] bg-black/20 backdrop-blur-sm" id="drawer" onclick="closeDrawer(event)">
  <div class="drawer-panel absolute top-0 right-0 h-full w-full max-w-3xl bg-white border-l border-slate-200 overflow-y-auto shadow-2xl" onclick="event.stopPropagation()">
    <div class="sticky top-0 z-10 bg-white/90 backdrop-filter backdrop-blur-lg border-b border-slate-200 flex items-center justify-between px-6 py-4">
      <h3 class="font-normal text-sm truncate text-slate-900" id="drawer-title"></h3>
      <button onclick="closeDrawer()" class="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all">&times;</button>
    </div>
    <div class="px-6 pb-12 drawer-prose" id="drawer-content"></div>
  </div>
</div>

<!-- ═══════════ DATA ═══════════ -->
<script>
const sectionHtml = ${JSON.stringify(sectionData.map(s => ({ title: s.title, icon: s.icon, html: s.html })))};

// Drawer
function openDrawer(idx) {
  const d = sectionHtml[idx];
  document.getElementById('drawer-title').textContent = d.icon + ' ' + d.title;
  document.getElementById('drawer-content').innerHTML = d.html;
  document.getElementById('drawer').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeDrawer(e) {
  if (e && e.target !== document.getElementById('drawer')) return;
  document.getElementById('drawer').classList.remove('open');
  document.body.style.overflow = '';
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });

// Agent tabs
function switchAgent(idx) {
  document.querySelectorAll('.agent-tab').forEach(t => t.classList.toggle('active', Number(t.dataset.agent) === idx));
  document.querySelectorAll('.agent-content').forEach(c => c.classList.toggle('active', Number(c.dataset.agent) === idx));
}

// Scroll reveal
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Stat counters
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting || e.target.dataset.counted) return;
    e.target.dataset.counted = 'true';
    const el = e.target;
    const target = parseFloat(el.dataset.target);
    if (!target) return;
    const suffix = el.dataset.suffix || '';
    const fmt = el.dataset.format;
    const duration = 1500;
    const start = performance.now();
    function step(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      let val = target * eased;
      let display;
      if (fmt === 'comma') display = Math.round(val).toLocaleString();
      else if (target % 1 !== 0) display = val.toFixed(1);
      else display = Math.round(val).toString();
      el.textContent = display + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-value[data-target]').forEach(el => counterObserver.observe(el));

// Navbar transparency on scroll
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (window.scrollY > 50) {
    nav.style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)';
  } else {
    nav.style.boxShadow = 'none';
  }
});
</script>
</body>
</html>`;

fs.writeFileSync(path.join(__dirname, "index.html"), html, "utf-8");
console.log("Built index.html (" + (Buffer.byteLength(html) / 1024).toFixed(0) + " KB)");
