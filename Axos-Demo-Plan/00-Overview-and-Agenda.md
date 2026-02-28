# Axos Bank — Agentic ERM Demo Plan (Comprehensive Edition)
## Goldenflitch Studios | February 2026
### Prepared for: Ian Gilligan, Subodh Rai, Anthony Tricaso — Axos GRC Division

---

> **Demo Context:** This demo uses the Axos-provided process map — *Customer Verification – Personal Identifying Information (v0.0.7, CTL-CC-385650)* — as the live demonstration substrate. This process was deliberately chosen because it is a real, internal Axos workflow that the evaluation team knows intimately. Every agent output shown will be directly traceable to the actual content of the provided document. All data shown is synthetic — no production Axos data is used.

---

## Master Table of Contents (Across All Files)

| File | Section | Contents |
|------|---------|----------|
| `00-Overview-and-Agenda.md` | Overview | Pre-Demo Checklist, Minute-by-Minute Agenda |
| `01-Architecture-Overview.md` | Architecture | 3-Layer Architecture, Data Privacy, Data Flow, GPU Auto-Scaling, API Docs (35pp), Benchmarks (20pp), SOC 2 Status |
| `02-Process-Map-Deep-Dive.md` | Process Analysis | Complete Shape Inventory, Version History, Flow Graph, Verification Pools |
| `03-Section-A-Process-Ingestion.md` | Section A | Manual PDF Upload, iGrafx OData API, Comparison Table |
| `04-Agent-1-Documentation-Retrieval.md` | Agent 1 | Secure API, Document Discovery, Tagging, Audit Log, Version Control, Evidence Validation |
| `05-Agent-2-Test-of-Effectiveness.md` | Agent 2 | Sampling Logic, 3 Test Scenarios, Anomaly Detection, TOE Conclusion |
| `06-Agent-3-Test-of-Design.md` | Agent 3 | COSO Matrix, Gap Analysis, Remediation, Benchmarking, TOD Rating |
| `07-Agent-4-Supervisory-Agent.md` | Agent 4 | Orchestration, Dashboard, RBAC, Audit Trail, NLU Query, Human Review, Archer Push |
| `08-Market-Surveillance.md` | Market Surveillance | 12 Rules, Market Data Ingestion, Alert Engine, Investigation, SAR Filing |
| `09-Extension-Capabilities.md` | Extensions | Vendor Risk, Fraud Detection (4-Layer), 8210 Automation, Exam Readiness |
| `10-Senior-Mgmt-QA-Preparation.md` | Q&A Prep | 7 Senior Management Questions, 10 System Questions, Model Update Protocol |
| `11-Competitive-Intelligence.md` | Competitive | Cloud Competitor Analysis, Data Egress Flaw, All-Advantage Comparison Matrix, Talking Points |
| `12-Post-Demo-and-Scoring.md` | Closing | Post-Demo Deliverables, Scoring Strategy (100-pt Rubric), Full Compliance Checklist |

---

## Pre-Demo Preparation Checklist

### A. Staging Environment Setup

| # | Task | Owner | Status | Due |
|---|------|-------|--------|-----|
| 1 | Provision GPU staging server (min: 1× NVIDIA A100 80GB or 2× A10G 24GB) | DevOps | ☐ | Demo -7 days |
| 2 | Deploy Kubernetes cluster (3 nodes minimum: 1 control plane + 2 workers) | DevOps | ☐ | Demo -7 days |
| 3 | Load local LLM models — Llama 3 70B (quantized GGUF) + Mixtral 8x7B | AI Architect | ☐ | Demo -5 days |
| 4 | Validate model inference speed: target < 2 seconds per reasoning chain | AI Architect | ☐ | Demo -5 days |
| 5 | Deploy Agent 1-4 containers to staging cluster | Workflow Engineers | ☐ | Demo -5 days |
| 6 | Configure Agent 4 orchestration state machine (Agent 1→2→3→4 pipeline) | Workflow Engineers | ☐ | Demo -5 days |
| 7 | Verify all agents report healthy on Agent 4 System Health Dashboard | QA Lead | ☐ | Demo -4 days |

### B. Synthetic Data Preparation

| # | Task | Details | Owner | Status |
|---|------|---------|-------|--------|
| 8 | Generate call disposition records for Q4 2025 | ~65,000 synthetic records with fields: call_id, csr_id, timestamp, security_word_present, security_word_valid, pii_items_collected (list), pii_items_from_approved_list (bool), all_answers_correct (bool), contact_update_requested (bool), otp_triggered (bool) | Data Scientists | ☐ |
| 9 | Embed 13 deliberate exceptions in the synthetic dataset | 2× security word bypass, 5× insufficient PII items (3 instead of 4), 4× non-approved item used, 2× CSR behavioral anomaly patterns (12 calls from 1 CSR with partial verification + 8 late-night calls using supplemental items) | Data Scientists | ☐ |
| 10 | Generate CRM contact update logs (Q4 2025) | For testing the OTP routing logic — ~3,200 contact update requests | Data Scientists | ☐ |
| 11 | Prepare QA review records | Random subset of ~500 calls with supervisor QA scores | Data Scientists | ☐ |
| 12 | Load the exact Axos PDF (`Customer Verification - Personal Identifying Information 127933.pdf`) into the document ingestion queue | PM | ☐ |
| 13 | Prepare a second document representing the OTP subprocess (for Agent 1's secondary fetch demo) | Data Scientists | ☐ |
| 14 | Prepare a third document representing the authentication policy (CTL-CC-385650 supporting policy) | Compliance SME | ☐ |

### C. RSA Archer Sandbox Configuration

| # | Task | Details | Owner | Status |
|---|------|---------|-------|--------|
| 15 | Deploy RSA Archer sandbox instance (or use Goldenflitch's staging Archer) | Must support REST API v6+ | Archer Specialist | ☐ |
| 16 | Populate Control Library with CTL-CC-385650 entry | Fields: Control ID, Name, Description ("Authentication controls across channels with different levels of sophistication"), Risk Domain (Operational Risk / Customer Authentication), Control Type (Preventive), Testing Frequency (Quarterly) | Archer Specialist | ☐ |
| 17 | Configure Archer Testing Schedule trigger for CTL-CC-385650 | Trigger type: Manual (for demo) with option to show scheduled cron | Archer Specialist | ☐ |
| 18 | Configure Archer Findings schema to accept Agent 4's JSON payload | Fields: Test ID, Control ID, TOE Result, TOD Result, Exception Count, Exception Details (array), Design Gaps (array), Assigned To, Due Date, Evidence Hashes | Archer Specialist | ☐ |
| 19 | Verify Archer API read/write connectivity from Agent 4 container | Test: GET /api/controls/{id} and POST /api/findings | Archer Specialist | ☐ |

### D. iGrafx Sandbox (for Section A demo)

| # | Task | Details | Owner | Status |
|---|------|---------|-------|--------|
| 20 | Configure iGrafx sandbox with the PII verification process loaded | Import the process as v0.0.7 with full shape list and version history | PM | ☐ |
| 21 | Verify iGrafx OData API endpoint is accessible from Agent 1 | Test: GET /api/v2/repositories/{repoId}/processes/{processId} | DevOps | ☐ |
| 22 | Prepare a version increment scenario (v0.0.7 → v0.0.8) for webhook demo | Simulate Axos saving a new version to trigger automatic re-ingestion | PM | ☐ |

### E. Screen Layout & Presentation Setup

| # | Task | Details | Owner | Status |
|---|------|---------|-------|--------|
| 23 | Configure 3-panel screen layout for screen share | LEFT: Agent Activity Feed (real-time log); RIGHT: RSA Archer Live View; BOTTOM: Agent 4 Supervisory Dashboard | DevOps | ☐ |
| 24 | Test screen share resolution (minimum 1920×1080, prefer 2560×1440 for readability) | Verify all 3 panels are readable in the evaluator's video client | PM | ☐ |
| 25 | Prepare architecture overview slide (single slide, PDF/PNG) | 3-layer diagram: Agent Cluster → Integration Gateway → Storage & Audit | AI Architect | ☐ |
| 26 | Prepare Market Surveillance slides (4-5 slides) | Rule engine architecture, 12-rule table, data ingestion diagram, alert flow, sample narrative | Compliance SME | ☐ |
| 27 | Prepare 1-page architecture handout for distribution | PDF: high-level diagram + key differentiators (zero egress, outbound-only proxy, Agent 4 no cost) | PM | ☐ |
| 28 | Prepare API reference preview handout (2 pages) | Key endpoints: POST /workflows, GET /controls/{id}, POST /findings, webhook schema | DevOps | ☐ |

### F. Contingency Planning

| # | Task | Details | Owner | Status |
|---|------|---------|-------|--------|
| 29 | Record full demo run-through as backup video (1080p, no audio) | If staging environment fails mid-demo, switch to pre-recorded video seamlessly | PM | ☐ |
| 30 | Prepare static screenshot deck (15-20 slides) of each demo screen | Fallback if both live and video fail | PM | ☐ |
| 31 | Identify a secondary presenter who can continue if primary has connectivity issues | Briefed and ready with access to same environment | PM | ☐ |
| 32 | Test connectivity to Axos's video conferencing platform (Zoom/Teams/WebEx) | Verify screen share, audio, and bandwidth (min 5 Mbps upstream) | PM | ☐ |

### G. Presenter Preparation

| # | Task | Details | Owner | Status |
|---|------|---------|-------|--------|
| 33 | Conduct full dry run #1 (internal team only) | Target: complete in <65 min, identify any demo-breaking issues | All | Demo -4 days |
| 34 | Conduct full dry run #2 (with Compliance SME as mock evaluator) | SME asks tough questions, presenter practices responses | All | Demo -2 days |
| 35 | Print talking point cards for each section (laminated, numbered) | One card per section with: key RFP criteria being addressed, exact narration script, competitive contrast points | Presenter | Demo -2 days |
| 36 | Review all 7 Senior Management questions from RFP page 24 and rehearse answers | See file `10-Senior-Mgmt-QA-Preparation.md` | Presenter | Demo -1 day |
| 37 | Review all 10 System Questions from RFP page 26 and rehearse answers | See file `10-Senior-Mgmt-QA-Preparation.md` | Presenter | Demo -1 day |

---

## Minute-by-Minute Demo Agenda

**Total Duration:** 90 minutes (65 min presentation + 25 min Q&A)
**Presenter:** [Primary Presenter Name], supported by [Compliance SME Name] for regulatory questions
**Format:** Remote screen share (3-panel layout) with architecture slides interspersed

---

### Opening Block (0:00 – 0:10)

| Time | Activity | Screen | Narration Notes |
|------|----------|--------|-----------------|
| 0:00–0:02 | **Welcome & Introductions** | Goldenflitch title slide | Thank evaluators by name (Ian, Subodh, Anthony). Acknowledge Axos's position as a $20B+ technology-driven financial services company. State: "We are here to show you exactly how our four-agent architecture will transform your ERM control testing from a periodic exercise into continuous, autonomous assurance." |
| 0:02–0:05 | **Demo Structure Overview** | Agenda slide | Explain the "life of one control test" narrative structure. State: "Everything you see today runs on a single thread — your own Customer Verification PII process. From raw document ingestion to a finished workpaper in RSA Archer." Mention the three sections: (A) Ingestion, (B) Four Agents, (C) Market Surveillance. |
| 0:05–0:08 | **Architecture Overview** | Architecture slide (see `01-Architecture-Overview.md`) | Walk through the 3-layer diagram. Emphasize: Layer 1 (local LLMs on your hardware), Layer 2 (outbound-only proxy, zero inbound ports), Layer 3 (vector DB + hash-chain audit + Archer). **Critical moment:** Deliver the data privacy declaration — *"Your data never leaves your building."* This is the competitive knife against cloud-based competitors' API dependency. |
| 0:08–0:10 | **Transition to Live Demo** | Switch from slides to 3-panel live screen | State: "Now let me show you this working. I'm going to trigger a control test on CTL-CC-385650 — your Customer Verification process — and you'll watch all four agents execute in real time." |

### Section A: Process Map Ingestion (0:10 – 0:20)

| Time | Activity | Screen | Narration Notes |
|------|----------|--------|-----------------|
| 0:10–0:14 | **Manual PDF Upload** | Document Ingestion Portal (LEFT panel) | Drag-and-drop the exact Axos PDF. Show SHA-256 hash, timestamp. Show the structural parsing pipeline running: OCR → Layout Analysis → Semantic NLP. Show the extracted JSON control object with all 19 shapes, 8 decision nodes, 2 verification tracks, version metadata. **Key moment:** Point out the UNAPPROVED status flag. |
| 0:14–0:16 | **Version History Extraction** | Extracted version table (LEFT panel) | Show Agent 1 extracting the complete version history (v0.0.1 through v0.0.7). Highlight the 9-month gap between v0.0.6 (approved Feb 2025) and v0.0.7 (unapproved Nov 2025). State: "Agent 1 doesn't just read documents — it understands document governance." |
| 0:16–0:20 | **iGrafx Automated Extraction** | Architecture diagram + live API call | Show the OData REST API endpoint. Demonstrate: (a) scheduled polling mechanism, (b) webhook trigger on version save, (c) file-watcher fallback for SFTP exports. Show the comparison table (Manual vs. API vs. File Export). **Offensive moment:** State: "You specifically asked about iGrafx in the demo brief. We have a native connector for iGrafx's OData API — not all solutions will." |

### Section B: Four-Agent Demonstration (0:20 – 0:62)

| Time | Activity | Screen | Narration Notes |
|------|----------|--------|-----------------|
| 0:20–0:22 | **Pre-Demo Setup** | Agent 4 Dashboard (BOTTOM panel) | Show the test trigger from Archer. Control ID: CTL-CC-385650, Test Type: TOE + TOD, Period: Q4 2025, Status: INITIALIZING. Show agents queuing: 1→2→3→4. |
| 0:22–0:28 | **Agent 1: Documentation Retrieval** | LEFT panel: activity feed; RIGHT panel: evidence list building | Show OAuth2 + mTLS handshake log. Show autonomous discovery of 3 documents (PII process, OTP subprocess, policy). Show auto-tagging. Show the UNAPPROVED version governance flag. Show the OTP subprocess secondary fetch (evidence completeness check). **Output:** Evidence package with 3/3 docs, 1 governance flag, "Ready for Agent 2: YES." See `04-Agent-1-Documentation-Retrieval.md` for full detail. |
| 0:28–0:35 | **Agent 2: TOE — Scenario Setup & Execution** | LEFT panel: test execution log; BOTTOM panel: progress bar | Show sampling logic (65,000 calls → 385 sample at 95% confidence). Show the pre-built script library with "CTL-AUTH-VERIFY-PII" highlighted. Launch 3 parallel test scenarios: Track B compliance (187 calls), Track A compliance (198 calls), Anomaly Detection (full sample). Show progress in real-time. See `05-Agent-2-Test-of-Effectiveness.md`. |
| 0:35–0:39 | **Agent 2: TOE — Results Review** | LEFT panel: exception details; BOTTOM panel: summary statistics | Walk through Track B results (96.8%, 4 exceptions + 2 security word bypasses). Walk through Track A results (96.5%, 5 + 2 exceptions). Show the ML anomaly flags: CSR behavioral pattern (3.2 sigma) and late-night supplemental-item cluster. Show evidence sufficiency assessment (1 incomplete record → retry, not fail). |
| 0:39–0:42 | **Agent 2: TOE — Conclusion** | BOTTOM panel: verdict block | Show the final conclusion: QUALIFIED, 87.3% confidence, 13 exceptions (2 critical, 5 high, 4 medium, 2 ML). Emphasize: "96.6% of calls are compliant. A standard test might pass this. Agent 2's ML caught a behavioral pattern no sampling approach would have found." |
| 0:42–0:48 | **Agent 3: TOD — Design Assessment** | LEFT panel: COSO matrix, gap analysis | Show Agent 3 receiving Agent 1 + Agent 2 outputs. Show COSO 5-component matrix. Show 4 design gaps with regulatory references. **Critical moment:** Show the TOE-TOD cross-reference — Agent 2's security word bypass is directly explained by Gap 2 (no escalation path in the process design). State: "Agent 3 doesn't repeat Agent 2's finding — it explains the root cause in the process architecture." See `06-Agent-3-Test-of-Design.md`. |
| 0:48–0:52 | **Agent 3: TOD — Rating & Recommendations** | LEFT panel: recommendations; RIGHT panel: Archer preview | Show Design Rating: NEEDS IMPROVEMENT. Show 4 specific remediation recommendations with regulatory citations. Show comparative benchmark against FFIEC Authentication Guidance. |
| 0:52–0:57 | **Agent 4: Orchestration & Dashboard** | BOTTOM panel: full dashboard | Show the workflow state machine (dependency graph). Show real-time performance metrics. Show the false-positive tuning scenario. Show RBAC permission matrix (4 roles). Show the Black Box audit log (every decision, every agent, every timestamp). See `07-Agent-4-Supervisory-Agent.md`. |
| 0:57–0:59 | **Agent 4: Natural Language Query** | Chat interface overlay | **Wow moment:** Type a natural language query into the chat interface: "What controls related to customer authentication had exceptions this quarter?" Show the LLM interpreting the query locally (zero egress) and returning CTL-CC-385650 with its 13 exceptions. |
| 0:59–0:60 | **Agent 4: Archer Workpaper Push** | RIGHT panel: RSA Archer UI updating live | Show Agent 4 formatting the complete findings into Archer schema and pushing via API. Show the workpaper appearing in Archer in real-time. State: "15 seconds from agent compilation to examination-ready workpaper in your system of record." |
| 0:60–0:62 | **Performance Summary** | BOTTOM panel: efficiency ticker | Show total agent processing time: ~25 minutes. Show manual equivalent: 4-6 hours. Show net time savings: ~88% (exceeds 75% SLA guarantee). Show volume extrapolation: at 5× capacity, this means [X] more controls per month. |

### Section C: Market Surveillance & Extensions (0:62 – 0:78)

| Time | Activity | Screen | Narration Notes |
|------|----------|--------|-----------------|
| 0:62–0:63 | **Transition** | Title slide: "Market Surveillance" | State: "Per your demo brief, no functional UI is required for this section. We'll walk you through the architecture and capabilities." |
| 0:63–0:66 | **Rule Engine Architecture** | Slide: rule engine diagram + YAML config | Show the 12-rule template set. Walk through one rule in detail (MSR-001: Insider Trading). Show threshold parameterization (no-code). Show watchlist management. See `08-Market-Surveillance.md`. |
| 0:66–0:69 | **Market Data Ingestion** | Slide: data source diagram | Show 4 data source categories (Internal, Exchange, Reference, Regulatory). Show the Unified Trade Event Schema (JSON). Emphasize data residency: Bloomberg/Reuters licenses stay with Axos. |
| 0:69–0:73 | **Daily Alert Engine & AI Investigation** | Slide: end-to-end alert flow | Walk through: Rule Engine → Alert Triage (de-dup, prioritize, ML pre-filter) → AI Investigation (context gather, analysis, narrative draft) → Analyst Review → SAR Drafting (dual-approval gate). Show sample investigation narrative. |
| 0:73–0:75 | **8210 & Regulatory Request Automation** | Slide: automation flow | Briefly cover: automated trade blotter extraction, statement/confirm gathering, BETA data download for SEC/FINRA market abuse requests. |
| 0:75–0:78 | **Extension Capabilities** | Slide: roadmap timeline | Briefly cover: Phase 2 (Market Surveillance, Months 5-7), Phase 3 (Vendor Risk, Months 8-10), Fraud Detection (4-layer architecture from Appendix 1). See `09-Extension-Capabilities.md`. |

### Commercial & Closing (0:78 – 0:82)

| Time | Activity | Screen | Narration Notes |
|------|----------|--------|-----------------|
| 0:78–0:80 | **Commercial Summary** | Slide: pricing table | Year 1: $810,000 fixed (Development $660K + Support $150K). Agent 4: $0. Payment: 40/20/20/20 milestones. Third-party exclusions (GPU hardware, LLM tokens if commercial, data feeds, Archer licenses). Emphasize: "Fixed price. No variable cloud costs that compound as your volume grows." |
| 0:80–0:82 | **Next Steps & Transition to Q&A** | Slide: next steps | Offer: (1) Full API documentation within 48 hours, (2) Technical POC environment for Axos load testing, (3) InfoSec architecture review with Axos security team, (4) Reference calls with 2 existing financial institution clients. |

### Q&A Block (0:82 – 0:90)

| Time | Activity | Notes |
|------|----------|-------|
| 0:82–0:90 | **Open Q&A** | Presenter + Compliance SME handle questions. Have prepared answers for the 7 Senior Management questions from RFP page 24 and the 10 System Questions from RFP page 26. See `10-Senior-Mgmt-QA-Preparation.md` for full prepared responses. If a question requires deep technical detail, offer a follow-up technical session rather than going over time. |

---

*Proceed to `01-Architecture-Overview.md` →*
