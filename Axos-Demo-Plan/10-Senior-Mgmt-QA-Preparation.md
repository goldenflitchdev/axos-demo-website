# 10 — Senior Management Q&A Preparation

*← Back to `09-Extension-Capabilities.md` | Next: `11-Competitive-Intelligence.md` →*

---

> **Source:** RFP Pages 24-26 list specific questions that senior management and the evaluation team will ask. Prepared answers below.

---

## 10.1 Seven Senior Management Questions (RFP Page 24)

### Question 1: "How does your solution ensure data privacy and security?"

**Prepared Answer:**

> *"Our architecture is built on a zero data egress principle. All LLM inference runs locally on Axos-owned GPU hardware — no data is sent to OpenAI, Anthropic, Google, or any external AI provider. The only outbound traffic is model weight updates (pulled by Axos, not pushed by us) and integration API calls that Axos already routes through your existing perimeter.*
>
> *Specifically:*
> - *All data processing occurs within your VPC / data center*
> - *No inbound ports are opened on your firewall — our integration gateway is outbound-only*
> - *Data at rest is encrypted with AES-256-GCM using Axos-managed keys*
> - *Data in transit uses TLS 1.3 between all components*
> - *The audit log is immutable — blockchain-style hash chain meeting SEC Rule 17a-4 standards*
> - *Every agent operates on least-privilege — Agent 1 has read-only access, only Agent 4 can write to Archer*
>
> *This is fundamentally different from solutions that send your compliance data to cloud AI APIs. If a competitor tells you they use GPT-4 or Claude, ask them: where does the inference happen? If the answer is 'in the cloud,' your data is leaving your building."*

---

### Question 2: "What is the expected ROI and how do you measure it?"

**Prepared Answer:**

> *"We guarantee two performance metrics contractually:*
> - *75% net time savings per control test (we demonstrated 91.7% today)*
> - *5× volume increase in testing capacity (we demonstrated 13-26× today)*
>
> *In dollar terms, for a GRC team testing 200 controls quarterly:*
> - *Current manual cost: ~800 hours per quarter × loaded analyst rate = significant labor allocation*
> - *With Goldenflitch: 200 hours per quarter (at 75% savings) — freeing 600 hours for higher-value activities*
> - *With volume increase: The same team can now test 1,000+ controls per quarter, or test the existing 200 controls at much greater depth (larger samples, full-population ML)*
>
> *ROI measurement is built into the system. Agent 4's dashboard tracks time savings per test, volume processed, findings per hour, and false positive rates. We provide quarterly ROI reports as part of our support agreement.*
>
> *Year 1 investment: $810,000 fixed. Year 1 value: If we save 2,400 analyst hours annually at a loaded rate, plus the risk reduction from catching exceptions that manual testing would miss — like the CSR behavioral pattern we found today — the ROI is demonstrable within the first quarter."*

---

### Question 3: "How does the system handle false positives?"

**Prepared Answer:**

> *"False positive management is a first-class feature, not an afterthought:*
>
> *1. **At test time:** When a human reviewer identifies a false positive in Agent 2's results, they can mark it with a reason code. This feeds back into the test script library — the specific condition that generated the false positive is added to the exclusion list for future test runs.*
>
> *2. **At the ML layer:** Agent 2's anomaly detection model incorporates human dispositions over time. Each quarter, the model retrains on confirmed true positives and false positives, improving precision. We track false positive rate as a KPI — target is <5% after the first 6 months.*
>
> *3. **For Market Surveillance:** The alert triage phase includes ML-based priority scoring that reduces low-quality alerts by 60-70%. Historical disposition data trains the priority model to suppress patterns that analysts have consistently marked as non-actionable.*
>
> *4. **Transparency:** Every false positive suppression is logged and auditable. An examiner can ask: 'What are you suppressing, and why?' and we can provide the complete suppression log with justifications."*

---

### Question 4: "How do you handle model updates and ensure they don't introduce regressions?"

**Prepared Answer:**

> *"We have a formal Model Update & Rollback Protocol:*
>
> *1. New model weights are published to a signed registry — Axos pulls them via HTTPS (outbound-only)*
> *2. New models deploy as a canary — 5% of inference traffic for 72 hours*
> *3. A 500-case regression suite runs automatically, testing against known-good outputs*
> *4. If the canary passes (≥99.2% consistency, zero regressions on critical tests), it gradually rolls out: 5% → 25% → 50% → 100% over 5 days*
> *5. If it fails, it rolls back automatically. The previous model version is retained for 90 days.*
> *6. Every agent output records which model version produced it — so you always know which model made which decision*
>
> *This is an SR 11-7-compliant model risk management process. We maintain full model lineage, and any model version used in a regulatory examination period is preserved indefinitely."*

---

### Question 5: "What happens if the system goes down? What's your disaster recovery plan?"

**Prepared Answer:**

> *"The system runs on Kubernetes with automatic pod restart — if an agent container crashes, it restarts in under 60 seconds. For a full environment failure:*
> - *RTO (Recovery Time Objective): < 4 hours*
> - *RPO (Recovery Point Objective): < 15 minutes*
>
> *PostgreSQL uses streaming replication to a standby instance. The audit log replicates synchronously. Persistent volumes snapshot every 15 minutes. We test DR quarterly with a simulated failover exercise — results are documented and shared with Axos.*
>
> *Importantly, the system failing does not create a compliance gap — it reverts to manual testing. The test schedule in Archer still exists, the data is still accessible, and analysts can perform manual tests if needed. The system is an accelerator, not a dependency."*

---

### Question 6: "How does the system work with our existing RSA Archer deployment?"

**Prepared Answer:**

> *"Native integration via Archer's REST API v6. Specifically:*
> - *Agent 4 reads the testing schedule from Archer (GET /api/controls/{id}/schedule)*
> - *Agent 4 writes completed findings to Archer (POST /api/findings)*
> - *Agent 4 updates remediation status in Archer (PATCH /api/findings/{id}/remediation)*
> - *The workpaper schema maps directly to your Archer fields — we configure this during implementation based on your specific Archer configuration*
>
> *We don't replace Archer — we feed it. Archer remains your system of record. We make it 10× more useful by filling it with AI-generated, examination-ready workpapers instead of waiting for manual test results."*

---

### Question 7: "Can we customize the system for our specific regulatory environment?"

**Prepared Answer:**

> *"Absolutely. Customization happens at three levels:*
>
> *1. **Test Scripts:** YAML-based, version-controlled, no-code. Your compliance team can add, modify, or deactivate test scripts. We provide a library of 50+ pre-built scripts covering OCC, FDIC, FINRA, SEC, and consumer compliance — but every parameter is adjustable.*
>
> *2. **Regulatory Reference Database:** The Vector DB contains regulatory guidance documents. When new guidance is issued (e.g., updated FFIEC Authentication Guidance), we add it to the reference corpus. Agent 3 automatically incorporates new guidance in future assessments.*
>
> *3. **LLM Fine-Tuning:** During implementation Phase 2 (Months 3-4), we fine-tune the Llama 3 model on your specific regulatory corpus — your existing workpapers, your OCC examination findings, your internal policies. This trains the model to speak 'Axos language.' Fine-tuning runs entirely on your hardware — your training data never leaves your building.*
>
> *We designed the system for a bank that operates across commercial banking, securities, clearing, and digital banking — because that's exactly what Axos is."*

---

## 10.2 Ten System Questions (RFP Page 26)

### SQ-1: "Describe your system's scalability limits."

> *"The system scales horizontally on Kubernetes. Current single-GPU configuration (A100 80GB) supports:*
> - *~50 tokens/second inference (Llama 3 70B, 4-bit quantized)*
> - *~20-30 concurrent agent tasks*
> - *~500 control tests per month with current throughput*
>
> *To scale beyond this, add GPU nodes to the Kubernetes cluster. Each additional A100 adds another ~50 tokens/sec. For Axos's projected 200 controls per quarter, a single A100 is more than sufficient with significant headroom.*
>
> *Breaking point estimates:*
> - *1 GPU: ~500 tests/month*
> - *2 GPUs: ~1,000 tests/month*
> - *4 GPUs: ~2,000 tests/month*
>
> *Market Surveillance scales independently — the rule engine is CPU-bound (not GPU-bound) and can process millions of trade events per day on commodity hardware."*

---

### SQ-2: "How do you handle concurrent users?"

> *"Agent 4's dashboard supports up to 50 concurrent viewers with no performance impact (read-only dashboard queries are cached and served from PostgreSQL read replicas). For concurrent test execution, the system queues tests via Agent 4's orchestrator — tests run sequentially per control (to avoid data conflicts) but can run in parallel across different controls. 5-10 concurrent test executions is the target operating range for a single GPU."*

---

### SQ-3: "What is your approach to system monitoring and alerting?"

> *"Three layers:*
> - *Infrastructure: Prometheus + Grafana for CPU/GPU/memory/disk/network metrics*
> - *Application: Structured logging (JSON) to ELK stack (or Axos's existing SIEM)*
> - *Business: Agent 4 dashboard for test progress, finding counts, performance metrics*
>
> *Alerting via PagerDuty/Opsgenie/email for: agent failures, GPU utilization >90% for >5 min, inference latency >5 seconds, Archer API failures, hash chain integrity violations."*

---

### SQ-4: "How do you handle data retention and purging?"

> *"Configurable per data type:*
> - *Audit logs: 7 years minimum (SEC 17a-4, FINRA 3110, 4511)*
> - *Workpapers: Per Axos's existing Archer retention policy (typically 7-10 years)*
> - *Test data extracts: Retained for the test period + 1 year, then purged*
> - *Model inference logs (chain-of-thought): Same as audit logs (7 years)*
> - *Vector DB embeddings: Retained as long as the source document exists; re-embedded on document update*
>
> *Purging is automated, audited, and irreversible (with confirmation). Purge events are recorded in the audit log."*

---

### SQ-5: "What training is required for our team?"

> *"Three training tracks:*
> - *Analyst Training (8 hours): How to trigger tests, interpret results, use NLU queries, manage false positives*
> - *Manager Training (4 hours): How to approve findings, configure test scripts, manage remediation workflows*
> - *Admin Training (16 hours): Agent configuration, model management, integration management, troubleshooting*
>
> *Training is delivered during implementation Phase 4 (Months 5-6). We also provide a Knowledge Base (searchable documentation) and a dedicated Slack/Teams support channel for the first 12 months."*

---

### SQ-6: "What is your implementation timeline?"

> *"6 months for Phase 1 (ERM Control Testing):*
> - *Month 1-2: Environment setup, integration configuration, data mapping*
> - *Month 3-4: Model fine-tuning, test script development, pilot testing (10 controls)*
> - *Month 5-6: User training, production rollout, 90-day stabilization period*
>
> *Market Surveillance (Phase 2): Months 5-7 (overlaps with Phase 1 stabilization)*
> *TPRM (Phase 3): Months 8-10"*

---

### SQ-7: "What third-party dependencies does your system have?"

> *"Minimal:*
> - *GPU hardware (NVIDIA A100/H100 or A10G) — procured by Axos, owned by Axos*
> - *Kubernetes cluster (EKS, OpenShift, or vanilla K8s) — standard infrastructure*
> - *PostgreSQL database — open source, no license cost*
> - *Vector database (Chroma or FAISS) — open source, no license cost*
> - *LLM models (Llama 3, Mixtral) — open source, no license cost*
> - *RSA Archer — existing Axos license*
> - *iGrafx — existing Axos license*
>
> *We do not depend on any external SaaS service for core functionality. If the internet goes down, the system continues to operate (it only needs internal network access)."*

---

### SQ-8: "How do you handle multi-tenancy / data segregation?"

> *"For Axos, multi-tenancy is not relevant — this is a single-tenant, on-premise deployment. However, within the system, data is segregated by:*
> - *Business line (commercial banking, securities, clearing) — each has its own control library partition*
> - *Regulatory domain (OCC, FINRA, SEC, consumer) — test scripts and regulatory references are domain-tagged*
> - *User access (RBAC) — users only see controls and results within their authorized scope"*

---

### SQ-9: "What is your support model after go-live?"

> *"Year 1 Support ($150,000 included in the $810,000 fixed price):*
> - *Dedicated support engineer (named, not a rotating queue)*
> - *Response SLAs: P1 (system down) — 1 hour; P2 (degraded) — 4 hours; P3 (enhancement) — 1 business day*
> - *Quarterly model updates (included)*
> - *Monthly regulatory reference updates (included)*
> - *On-site support: Up to 4 on-site visits per year*
>
> *Year 2+ Support: Negotiated separately, estimated $150,000-200,000/year based on scope."*

---

### SQ-10: "Can we see the source code / conduct a code review?"

> *"We offer a code escrow arrangement — Axos's designated third party holds the source code in escrow, accessible if Goldenflitch ceases operations or fails to meet support obligations. For code review, we support a structured review process:*
> - *Architecture review: Open — we share architecture documents, API specifications, and deployment configurations*
> - *Model review: Open — we share model architectures, training methodologies, and benchmark results*
> - *Source code review: Available under NDA for Axos's security team, conducted on-site (code does not leave our control)*
>
> *This ensures Axos has continuity assurance without requiring full IP transfer."*

---

## 10.3 Additional Tough Questions to Prepare For

| Question | Prepared Response |
|----------|-------------------|
| "What if the LLM hallucinates?" | "Every LLM output is grounded in source evidence. The chain-of-thought reasoning cites specific document sections, data records, and regulatory references. If the LLM produces an output that cannot be traced to source evidence, the system flags it as 'UNGROUNDED' and requires human review. We also run a grounding validation check on every Agent 3 regulatory citation — if the cited regulation doesn't exist in our reference database, it's flagged." |
| "Why not use GPT-4 / Claude? They're more capable." | "On some benchmarks, yes. But GPT-4 and Claude require sending your data to external servers. For a bank processing PII, compliance findings, trade data, and employee communications, that creates regulatory exposure under GLBA, PCI DSS, and OCC supervisory expectations. We use Llama 3 70B and Mixtral 8×7B because they provide strong reasoning capability with zero data egress. When open-source models improve (and they improve monthly), you upgrade by pulling new weights — no architecture change, no new vendor risk." |
| "How do you compete with larger vendors (Deloitte, Accenture)?" | "Large firms deploy general-purpose AI platforms that require extensive customization. We built a purpose-specific system for ERM control testing with pre-built regulatory knowledge. Our Year 1 cost is $810,000 fixed — a large consulting firm's annual engagement for comparable work starts at $2-5M and comes with variable costs. More importantly, we deploy on-premise with zero data egress — many large firms' solutions require cloud deployment." |
| "What's your company size and financial stability?" | "Goldenflitch Studios is a focused AI firm. We mitigate this risk through: (a) code escrow, (b) open-source model dependency (if we disappear, the models still exist), (c) on-premise deployment (Axos owns the hardware and data — nothing is locked in our cloud), and (d) knowledge transfer during implementation (your team is trained to operate the system)." |
| "What about SOC 2 Type II certification?" | "We commit to pursuing SOC 2 Type II within 12 months of contract signing. In the interim, we conduct annual penetration testing by an independent firm and share results with Axos. We also support Axos's own security team conducting audits of our deployment." |

---

*← Back to `09-Extension-Capabilities.md` | Next: `11-Competitive-Intelligence.md` →*
