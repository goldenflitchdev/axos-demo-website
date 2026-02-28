# 01 — Architecture Overview

*← Back to `00-Overview-and-Agenda.md` | Next: `02-Process-Map-Deep-Dive.md` →*

---

## 1.1 Guiding Architecture Principles

Goldenflitch's architecture is designed from first principles around a single constraint imposed by the RFP (Section IV, Architectural Requirements): **Axos data must never leave Axos infrastructure.** Every architecture decision flows from this:

| Principle | Description | How We Implement It |
|-----------|-------------|---------------------|
| **Zero Data Egress** | No customer, compliance, or trade data leaves the Axos VPC/data center | All LLM inference runs locally on Axos-owned GPU hardware. No API calls to OpenAI, Anthropic, or any cloud LLM provider. The only outbound traffic is (a) model weight updates from Goldenflitch's signed model registry (HTTPS pull, no data sent), (b) system telemetry (CPU/GPU utilization, no business data), and (c) optional Archer/integration API calls that Axos already routes through their perimeter. |
| **Outbound-Only Network Posture** | Zero inbound ports opened on Axos's firewall | Goldenflitch's integration gateway operates as an outbound-only proxy. All connections are initiated from inside the Axos perimeter. This eliminates an entire category of attack surface (inbound exploitation). **Contrast with competitor:** Some cloud competitors' security architecture documents explicitly list inbound ports including TCP/443, 8443, 6443, 22, 5432 for their AWS deployment — each of which represents a potential attack vector. |
| **Least Privilege** | Every agent, every container, every API call runs with the minimum necessary permissions | Agent 1 has read-only access to document repositories. Agent 2 has read-only access to sampling data. Agent 3 has read-only access to Agent 1 and Agent 2 outputs plus regulatory reference data. Only Agent 4 has write access to RSA Archer, and even then, only to the Findings and Workpaper endpoints, not the Control Library (which remains human-administered). |
| **Immutable Audit** | Every decision, every action, every piece of evidence is cryptographically chained | Blockchain-style hash chain: each log entry includes the SHA-256 hash of the previous entry + the current entry's content. Tampering with any historical entry invalidates all subsequent hashes. This exceeds SEC Rule 17a-4's immutability requirements. |
| **Model Explainability** | Every LLM output traces back to source evidence | Chain-of-thought reasoning is logged and stored alongside every agent decision. An auditor can follow: Input Document → Prompt Template → Reasoning Chain → Output. No "black box" decisions. This directly addresses SR 11-7 (Model Risk Management) requirements for model validation. |

---

## 1.2 Three-Layer Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           LAYER 1: AGENT CLUSTER                        │
│                         (Axos Kubernetes / On-Premise)                  │
│                                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐ │
│  │   AGENT 1    │  │   AGENT 2    │  │   AGENT 3    │  │   AGENT 4   │ │
│  │  Doc Retriev  │  │  TOE Engine  │  │  TOD Engine  │  │ Supervisory │ │
│  │              │  │              │  │              │  │             │ │
│  │ Llama 3 70B  │  │ Mixtral 8×7B │  │ Llama 3 70B  │  │ Llama 3 70B │ │
│  │ (reasoning)  │  │ (statistical │  │ (regulatory  │  │ (orchest.+  │ │
│  │              │  │  analysis)   │  │  analysis)   │  │  NLU)       │ │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬──────┘ │
│         │                 │                 │                  │        │
│         └────────────┬────┴──────┬──────────┘                  │        │
│                      │           │                             │        │
│              ┌───────▼───────────▼──────────────────────┐      │        │
│              │     SHARED INFERENCE ENGINE              │      │        │
│              │  (vLLM / TensorRT-LLM / llama.cpp)      │      │        │
│              │  GPU: NVIDIA A100 80GB or 2× A10G        │      │        │
│              │  Quantization: 4-bit GPTQ / GGUF         │      │        │
│              │  Batch Size: 8-16 concurrent inferences   │      │        │
│              │  Throughput: ~50 tokens/sec (Llama 70B)   │      │        │
│              └──────────────────────────────────────────┘      │        │
│                                                                │        │
│                   ┌────────────────────────────────────────────┘        │
│                   │                                                     │
│                   │  ┌──────────────────────────────────────────────┐   │
│                   │  │          AGENT 4 ORCHESTRATION               │   │
│                   │  │  - Dependency Graph (DAG)                    │   │
│                   │  │  - State Machine (INITIALIZED → RUNNING →   │   │
│                   │  │    REVIEW → FINALIZED → PUBLISHED)          │   │
│                   │  │  - Retry Logic (3× with exponential backoff)│   │
│                   │  │  - Human-in-the-Loop Checkpoints            │   │
│                   │  └──────────────────────────────────────────────┘   │
│                                                                         │
└──────────────────────────────────┬──────────────────────────────────────┘
                                   │
                                   │ Internal API (mTLS, JWT)
                                   │
┌──────────────────────────────────▼──────────────────────────────────────┐
│                    LAYER 2: INTEGRATION GATEWAY                         │
│                    (Outbound-Only Proxy Layer)                          │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  OUTBOUND-ONLY REVERSE PROXY (Envoy / Nginx)                   │   │
│  │  - TLS 1.3 for all outbound connections                        │   │
│  │  - Certificate pinning for known integration endpoints          │   │
│  │  - Request/Response logging (sanitized, no PII in logs)         │   │
│  │  - Rate limiting per integration partner                        │   │
│  │  - Circuit breaker pattern (prevent cascade failures)           │   │
│  └──────────────────┬───────────────────────┬──────────────────────┘   │
│                     │                       │                          │
│  ┌──────────────────▼──┐   ┌────────────────▼──────────────────────┐   │
│  │  CONNECTORS         │   │  DATA SOURCE ADAPTERS                 │   │
│  │  ■ RSA Archer REST  │   │  ■ SQL (ODBC/JDBC) → Axos DW/Lakes   │   │
│  │  ■ iGrafx OData     │   │  ■ SFTP → File-based exports          │   │
│  │  ■ Email (IMAP/SMTP)│   │  ■ SOAP → Legacy systems              │   │
│  │  ■ MS Graph API     │   │  ■ REST → Internal Axos APIs          │   │
│  │  ■ Google Drive API │   │  ■ Bloomberg/Reuters → Market Data     │   │
│  │  ■ FinCEN API       │   │  ■ Webhook Receiver (for iGrafx push) │   │
│  └─────────────────────┘   └───────────────────────────────────────┘   │
│                                                                         │
└──────────────────────────────────┬──────────────────────────────────────┘
                                   │
                                   │ Internal API (mTLS)
                                   │
┌──────────────────────────────────▼──────────────────────────────────────┐
│                    LAYER 3: STORAGE & AUDIT                             │
│                    (Axos-Owned Infrastructure)                          │
│                                                                         │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────────────┐   │
│  │  VECTOR DATABASE │  │  RELATIONAL DB   │  │  IMMUTABLE AUDIT LOG │   │
│  │  (Chroma / FAISS │  │  (PostgreSQL)    │  │  (Hash-Chain Store)  │   │
│  │   on local SSD)  │  │                  │  │                      │   │
│  │                  │  │  Tables:         │  │  Entry Structure:    │   │
│  │  Stores:        │  │  - controls      │  │  {                   │   │
│  │  - Document     │  │  - test_runs     │  │    seq_id: uint64    │   │
│  │    embeddings   │  │  - exceptions    │  │    timestamp: ISO    │   │
│  │  - Process map  │  │  - findings      │  │    agent_id: str     │   │
│  │    embeddings   │  │  - evidence_meta │  │    action: str       │   │
│  │  - Regulatory   │  │  - agent_configs │  │    input_hash: sha256│   │
│  │    reference    │  │  - user_sessions │  │    output_hash: sha256│  │
│  │    embeddings   │  │  - archer_sync   │  │    reasoning_chain:  │   │
│  │                  │  │  - audit_queries │  │      str (full CoT)  │   │
│  │  Similarity:    │  │                  │  │    prev_hash: sha256 │   │
│  │    cosine       │  │  Replication:    │  │    entry_hash: sha256│   │
│  │  Index: HNSW    │  │    streaming     │  │  }                   │   │
│  │  Dims: 4096     │  │    replica (DR)  │  │                      │   │
│  └─────────────────┘  └─────────────────┘  │  Retention:          │   │
│                                             │    7 years (17a-4)   │   │
│                                             │  Verification:       │   │
│                                             │    On-demand hash    │   │
│                                             │    chain validation  │   │
│                                             └──────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  ENCRYPTION AT REST                                            │   │
│  │  Algorithm: AES-256-GCM                                        │   │
│  │  Key Management: Axos-managed HSM or KMS (customer holds keys) │   │
│  │  Rotation: 90-day automatic rotation, 0-day emergency rotation │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 1.3 Data Flow — Life of a Control Test

This traces a single control test from trigger to Archer publication:

```
STEP 1: TRIGGER
  ├── Source: RSA Archer scheduled task OR Agent 4 manual trigger
  ├── Payload: { control_id: "CTL-CC-385650", test_type: ["TOE","TOD"], period: "Q4-2025" }
  └── Logged: Audit entry #N (action: "test_initiated", agent: "agent-4")

STEP 2: AGENT 1 — DOCUMENT RETRIEVAL
  ├── Agent 4 dispatches Agent 1 with the control ID
  ├── Agent 1 queries Vector DB for documents associated with CTL-CC-385650
  │   ├── Result: 3 documents (PII process v0.0.7, OTP subprocess, Auth policy)
  │   └── Similarity score threshold: 0.85 cosine
  ├── Agent 1 validates evidence completeness
  │   ├── Check: Does process map reference external subprocesses? → YES (OTP)
  │   └── Action: Auto-fetch OTP document from document repository
  ├── Agent 1 flags governance issues
  │   └── Flag: v0.0.7 has approval_status = UNAPPROVED
  ├── Output: Evidence Package { docs: [...], flags: [...], ready: true }
  └── Logged: Audit entries #N+1 through #N+8 (each fetch, each check, each flag)

STEP 3: AGENT 2 — TEST OF EFFECTIVENESS
  ├── Agent 4 dispatches Agent 2 with Evidence Package + sampling parameters
  ├── Agent 2 connects to Data Warehouse via ODBC
  │   └── Query: SELECT * FROM call_dispositions WHERE period = 'Q4-2025' AND control_id = 'CTL-CC-385650'
  │   └── Result: 65,000 records
  ├── Agent 2 calculates sample size
  │   ├── Method: Cochran's formula (z²pq/e²) with finite population correction
  │   ├── Parameters: 95% confidence, 2.5% margin, expected exception rate 3%
  │   └── Sample size: 385
  ├── Agent 2 applies stratified random sampling
  │   ├── Stratum 1: Track A (no security word) — ~60% of population → 231 records
  │   ├── Stratum 2: Track B (security word) — ~40% of population → 154 records
  │   └── Stratification maintains proportional representation
  ├── Agent 2 executes test scripts (3 scenarios)
  │   ├── Scenario 1: Track B compliance (security word + 2 PII)
  │   ├── Scenario 2: Track A compliance (4 standard/supplemental PII)
  │   └── Scenario 3: Anomaly detection (full-sample unsupervised ML)
  ├── Agent 2 produces TOE Result
  │   └── { verdict: "QUALIFIED", confidence: 0.873, exceptions: [...], ml_flags: [...] }
  └── Logged: Audit entries #N+9 through #N+40+ (each sample drawn, each test run, each exception)

STEP 4: AGENT 3 — TEST OF DESIGN
  ├── Agent 4 dispatches Agent 3 with Evidence Package + Agent 2 Results
  ├── Agent 3 loads the COSO Internal Control framework from regulatory Vector DB
  ├── Agent 3 maps CTL-CC-385650's design to COSO 5 components
  │   ├── Control Environment ✓
  │   ├── Risk Assessment △ (lacks formal risk scoring)
  │   ├── Control Activities ✓
  │   ├── Information & Communication △ (OTP handoff ambiguity)
  │   └── Monitoring Activities △ (no self-testing loop)
  ├── Agent 3 performs gap analysis (4 gaps identified)
  ├── Agent 3 cross-references Agent 2 exceptions with design gaps
  │   └── Key finding: Agent 2's security word bypass → Agent 3's Gap 2 (no escalation)
  ├── Agent 3 produces TOD Rating: NEEDS IMPROVEMENT
  │   └── { rating: "NEEDS IMPROVEMENT", gaps: [...], recommendations: [...] }
  └── Logged: Audit entries #N+41 through #N+55

STEP 5: AGENT 4 — COMPILATION & PUBLICATION
  ├── Agent 4 receives all outputs
  ├── Agent 4 checks for Human-in-the-Loop requirement
  │   └── Rule: Any exception with severity ≥ HIGH requires human approval before Archer push
  │   └── Result: 7 high/critical exceptions → HOLD for approval
  ├── [HUMAN REVIEW POINT] Compliance analyst reviews, approves
  ├── Agent 4 compiles workpaper
  │   ├── Executive Summary (auto-generated natural language)
  │   ├── TOE Detail Section
  │   ├── TOD Detail Section
  │   ├── Exception Register
  │   ├── Remediation Tracker
  │   └── Evidence Index with SHA-256 hashes
  ├── Agent 4 pushes to RSA Archer via REST API
  │   ├── POST /api/findings → 201 Created
  │   └── Archer Finding ID: FND-2026-Q4-00147
  ├── Agent 4 sends notification
  │   └── Email + MS Teams webhook to assigned control owner
  └── Logged: Audit entries #N+56 through #N+65 (final entry seals the test run)
```

---

## 1.4 LLM Model Selection Rationale

Goldenflitch uses two complementary open-source models, selected specifically for on-premise deployment compatibility and regulatory reasoning capability:

### Llama 3 70B (Meta)

| Attribute | Detail |
|-----------|--------|
| **Primary Use** | Agents 1, 3, 4 — document understanding, regulatory analysis, natural language queries |
| **Why This Model** | Best-in-class reasoning among open-source models at the 70B parameter class. Outperforms GPT-3.5 on multiple benchmarks (MMLU, HellaSwag, ARC). Strong instruction-following capability essential for structured output generation (JSON, workpaper formatting). |
| **Deployment Format** | 4-bit GPTQ quantized (fits in 40GB VRAM) or GGUF format for llama.cpp |
| **Fine-Tuning** | LoRA/QLoRA fine-tuning already completed on 12,000+ regulatory documents (OCC, FFIEC, FINRA, SEC, FinCEN). Domain benchmark results: 94.2% regulatory citation accuracy (vs. GPT-4's 87.1%), 91.8% control gap identification (vs. GPT-4's 85.4%), 93.5% COSO mapping (vs. GPT-4's 82.7%). Further Axos-specific fine-tuning during Phase 2 using Axos's existing workpapers. All training on Axos hardware — training data never leaves the perimeter. Quarterly re-fine-tuning with new regulatory guidance. |
| **Inference Speed** | ~45-55 tokens/sec on A100 80GB (4-bit quantized), ~25-30 tokens/sec on 2× A10G |

### Mixtral 8x7B (Mistral AI)

| Attribute | Detail |
|-----------|--------|
| **Primary Use** | Agent 2 — statistical analysis, sampling, anomaly detection |
| **Why This Model** | Mixture-of-Experts (MoE) architecture activates only 2 of 8 expert networks per token, delivering strong reasoning at lower computational cost than a dense 70B model. Excellent for structured analytical tasks where speed matters more than creative language generation. |
| **Deployment Format** | 4-bit quantized (fits in 24GB VRAM — can run on a single A10G) |
| **Inference Speed** | ~80-100 tokens/sec on A100 (only 12.9B active parameters per inference) |
| **Why Not Llama for Agent 2** | Agent 2 performs thousands of per-record evaluations during sampling. Mixtral's MoE architecture handles this volume 2-3× faster than Llama 70B, reducing total test execution time from ~35 min to ~12 min for a 65,000-record population. |

### Model Update & Rollback Protocol

```
MODEL UPDATE LIFECYCLE:
  1. Goldenflitch publishes new model weights to signed model registry (HTTPS)
  2. Axos DevOps pulls weights via outbound HTTPS (sha256 checksum verified)
  3. New model deployed as canary (5% of inference traffic for 72 hours)
  4. Automated regression suite runs (500 historical test cases)
     ├── Pass threshold: ≥99.2% consistency with previous model version
     ├── Critical threshold: 0 regressions on any SEC/OCC/FINRA-critical test
     └── If threshold fails → automatic rollback, Goldenflitch notified
  5. If canary passes → gradual rollout (5% → 25% → 50% → 100% over 5 days)
  6. Previous model version retained for 90 days (instant rollback capability)
  7. Full audit trail: which model version produced which output
```

---

## 1.5 Conflict Resolution Between Agents

When agents disagree or produce conflicting signals, the system follows a defined resolution protocol:

| Conflict Type | Example | Resolution |
|---------------|---------|------------|
| **Agent 2 says PASS, Agent 3 says FAIL** | TOE finds 97% compliance (within threshold), but TOD identifies missing controls in the design | Both results are preserved. Agent 4 flags as "EFFECTIVE BUT DESIGN-DEFICIENT" — the control works in practice but has architectural weaknesses. This is the most common and most valuable conflict because it reveals latent risk. |
| **Agent 1 evidence incomplete** | Agent 1 cannot locate a referenced subprocess document | Agent 4 pauses the pipeline. Sends alert to control owner: "Evidence gap: referenced document [OTP subprocess] not found in any connected repository." Human provides document or confirms it doesn't exist. If confirmed missing, Agent 3 notes this as a design gap (incomplete documentation). |
| **Agent 2 sampling anomaly** | ML model flags a pattern but statistical test says PASS | Both results recorded. ML flag becomes an "OBSERVATION" in the workpaper rather than an "EXCEPTION." Human reviewer decides if it warrants investigation. This preserves the ML insight without overriding the statistical test. |
| **Agent 3 regulatory reference mismatch** | Agent 3 cites a regulation that has been superseded | Agent 4 cross-checks against the regulatory reference database (updated monthly). If the citation is outdated, Agent 4 flags it for Agent 3 re-run with the correct reference. Audit log records both the original (incorrect) and corrected output. |

---

## 1.6 Security Architecture Summary

| Layer | Control | Implementation |
|-------|---------|----------------|
| **Network** | Zero inbound ports | Outbound-only proxy (Envoy), no NAT traversal, no port forwarding |
| **Transport** | TLS 1.3 everywhere | Certificate pinning for integration endpoints, mTLS between agents |
| **Authentication** | OAuth 2.0 + SAML 2.0 | SSO integration with Axos's existing IdP (Okta/Azure AD) |
| **Authorization** | RBAC (4 roles) | Viewer, Analyst, Manager, Admin — each with explicit permission matrix |
| **Data at Rest** | AES-256-GCM | Axos-managed keys (HSM or KMS), 90-day rotation |
| **Data in Transit** | TLS 1.3 | Between all components, including inter-agent communication |
| **Audit** | Hash-chain immutable log | Every action, every agent, every decision. 7-year retention. |
| **Secrets** | Vault / Secrets Manager | API keys, DB credentials, certificates — never in code or config files |
| **Vulnerability** | Continuous scanning | Container images scanned on build (Trivy/Snyk), runtime scanning (Falco) |
| **Penetration Testing** | Annual + on-demand | Goldenflitch commits to annual pentest by independent firm; results shared with Axos |
| **Compliance** | SOC 2 Type II in progress | Audit engagement signed with Top-10 CPA firm. Readiness assessment at 94%. Observation period underway (Jan 2026). Projected completion: Aug 2026. Interim: annual pen testing, Axos audit rights, code escrow, CAIQ completed. |

---

## 1.7 GPU Auto-Scaling Architecture

Goldenflitch provides Kubernetes-native GPU auto-scaling that delivers elastic capacity without cloud dependency:

| Attribute | Detail |
|-----------|--------|
| **Mechanism** | Kubernetes HPA (Horizontal Pod Autoscaler) on inference deployments |
| **Scale Trigger** | Inference queue depth > 10 OR p95 latency > 3 seconds |
| **GPU Node Pool** | Pre-provisioned GPU nodes in Axos's on-premise K8s cluster |
| **Scale Range** | 1 GPU node (baseline) → 8 GPU nodes (maximum) |
| **Scale-Up Time** | < 90 seconds from trigger to serving capacity |
| **Throughput** | 12 concurrent tests (1 node) → 47 concurrent tests (4 nodes), linear scaling |
| **Scale-Down** | Automatic after 15-minute idle period (GPU power savings) |
| **Capacity Planning** | Goldenflitch provides a GPU capacity calculator: input control volume/month, output recommended nodes |

---

## 1.8 API Documentation

Goldenflitch delivers a **35-page API documentation package** (OpenAPI 3.1 / Swagger) at demo time:

| Section | Coverage |
|---------|----------|
| **Authentication** | OAuth 2.0 + mTLS dual-mode, token lifecycle, refresh, revocation |
| **Agent Endpoints** | All 4 agents: trigger, status, results, cancel. JSON request/response with field-level annotations |
| **NLU Query** | Natural language query interface: POST /api/v1/nlu/query with streaming response |
| **Archer Integration** | Bi-directional: read control schedule, write findings/workpapers |
| **Webhooks** | Event triggers, retry policy (3× exponential backoff), HMAC-SHA256 signature verification |
| **Schemas** | Complete data schemas: controls, test runs, exceptions, findings, evidence, audit entries |
| **Sample Code** | Python, JavaScript, and cURL examples for every endpoint |
| **Rate Limits** | Per-endpoint rate limits, circuit-breaker behavior, error handling |
| **On-Premise Context** | Every endpoint resolves to `https://axos-erm.internal/api/v1/*` — no external URLs |

---

## 1.9 Formal Performance Benchmark Report

A **20-page performance benchmark report** accompanies the live demo:

| Metric | Result |
|--------|--------|
| **Methodology** | k6 + JMeter, industry-standard load testing |
| **API Latency (p50)** | 1.1 seconds (Agent 1–3 inference endpoints) |
| **API Latency (p95)** | 2.4 seconds |
| **API Latency (p99)** | 3.8 seconds |
| **End-to-End: PII Verification** | 24 minutes 53 seconds |
| **End-to-End: BSA/AML** | 38 minutes |
| **End-to-End: FINRA 3110** | 52 minutes |
| **Sustained Throughput** | 47 concurrent control tests over 4-hour window |
| **Scaling** | Linear from 1 to 4 GPU nodes |
| **Cost per Test** | $0.12 (amortized GPU) vs. est. $2.80–$6.50 for cloud LLM API calls |
| **Network Overhead** | 0ms external latency (all inference local) |

---

## 1.10 Disaster Recovery & Business Continuity

| Metric | Target | Implementation |
|--------|--------|----------------|
| **RTO (Recovery Time Objective)** | < 4 hours | Kubernetes pod auto-restart, persistent volume snapshots every 15 min |
| **RPO (Recovery Point Objective)** | < 15 minutes | PostgreSQL streaming replication to standby, audit log replicated synchronously |
| **Uptime SLA** | 99.5% (contractual) | Monitored via Prometheus + Grafana, alerting via PagerDuty |
| **Backup Frequency** | Daily full, 15-min incremental | Stored on Axos-owned storage, encrypted, retained for 90 days |
| **DR Test Frequency** | Quarterly | Simulated failover exercise documented and shared with Axos |

---

*← Back to `00-Overview-and-Agenda.md` | Next: `02-Process-Map-Deep-Dive.md` →*
