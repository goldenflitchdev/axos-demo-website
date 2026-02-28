# 12 — Post-Demo Deliverables & Scoring Strategy

*← Back to `11-Competitive-Intelligence.md`*

---

## 12.1 Post-Demo Deliverables (Within 48 Hours)

| # | Deliverable | Description | Owner | Format |
|---|-------------|-------------|-------|--------|
| 1 | **API Documentation (Full)** | 35-page REST API specification (OpenAPI 3.1): OAuth 2.0 + mTLS authentication, all 4 agent endpoints, NLU query interface, Archer integration, webhook schemas with HMAC verification, rate limits, circuit-breaker behavior, complete data schemas. Sample code in Python, JavaScript, and cURL. Delivered at demo time — not a follow-up. | Engineering | PDF + Markdown + Swagger |
| 2 | **Architecture Handout** | 2-page summary: high-level diagram, key differentiators (zero egress, outbound-only, local LLM), infrastructure requirements | AI Architect | PDF |
| 3 | **Performance Benchmark Report (Full)** | 20-page formal benchmark report using k6/JMeter methodology: p50/p95/p99 latencies, end-to-end times for PII/BSA/FINRA controls, sustained throughput (47 concurrent tests), GPU scaling analysis (1→4 nodes), cost-per-test ($0.12 vs. cloud est. $2.80–$6.50). Delivered at demo time alongside live evidence. | Engineering | PDF |
| 4 | **Security Architecture Summary** | 5 pages: encryption (AES-256-GCM, TLS 1.3), network posture (zero inbound), authentication (OAuth2, SAML, RBAC), audit (hash chain), key management (Axos HSM/KMS), SOC 2 Type II status (audit underway, 94% readiness, projected Aug 2026), pen test summary | Security Lead | PDF |
| 5 | **Sample Workpaper** | The complete workpaper generated during the demo (finding FND-2026-Q4-00147), formatted as it would appear in RSA Archer | PM | PDF |
| 6 | **Competitive Differentiation Brief** | 1-page bullet list: Data residency, network posture, vendor risk, iGrafx integration, pricing transparency. No competitor names — focus on architectural advantages. | PM | PDF |
| 7 | **Implementation Timeline (Detailed)** | Gantt chart with: Phase 1 (ERM, Months 1-4), Phase 2 (Market Surveillance, Months 5-7), Phase 3 (TPRM, Months 8-10), milestones, Axos dependencies, payment schedule | PM | PDF + MPP |
| 8 | **Reference Client List** | 2 existing financial institution references willing to take a call with Axos | BD | Email introduction |

---

## 12.2 Scoring Strategy (100-Point Rubric)

Based on the RFP's evaluation criteria, we project the following scoring areas and our strategy for maximizing each:

### Category 1: Technical Capability (40 points)

| Sub-Category | Max Points | Our Target | Strategy |
|--------------|-----------|------------|----------|
| Four-agent model implementation | 10 | 9-10 | Live demo of all 4 agents on real Axos process. NLU query moment. Agent 4 free. |
| Process map ingestion (iGrafx) | 5 | 5 | Native iGrafx OData API + webhook + SFTP. PDF upload. Competitor likely can't match. |
| Statistical sampling & ML | 5 | 5 | Cochran's formula with finite population correction. Isolation Forest + DBSCAN. CSR anomaly is the "wow" finding. |
| COSO framework / TOD depth | 5 | 4-5 | 5-component COSO matrix. 4 gaps. Regulatory benchmarks (FFIEC, NIST, PCI). |
| Audit trail / evidence integrity | 5 | 5 | SHA-256 hash chain. Live verification demo. SEC 17a-4 grade. |
| RSA Archer integration | 5 | 5 | Live workpaper push (201 Created). Bi-directional (read schedule, write findings). |
| Market Surveillance | 5 | 4-5 | 12 rules fully specified. Data architecture. Alert flow. SAR automation. No live UI (per brief). |

### Category 2: Data Privacy & Security (25 points)

| Sub-Category | Max Points | Our Target | Strategy |
|--------------|-----------|------------|----------|
| Data residency / zero egress | 10 | 10 | This is our strongest category. Zero data egress, local LLMs, outbound-only network. This is where we create maximum separation from the competitor. |
| Encryption & key management | 5 | 5 | AES-256-GCM at rest, TLS 1.3 in transit, Axos-managed keys. |
| Access control (RBAC) | 5 | 5 | 4-role matrix. SSO integration. MFA. Demonstrated in live demo. |
| Audit & compliance | 5 | 5 | Hash chain (equivalent immutability to Hyperledger, on Axos hardware). SOC 2 Type II audit underway (94% readiness, projected Aug 2026). |

### Category 3: Performance & Scalability (15 points)

| Sub-Category | Max Points | Our Target | Strategy |
|--------------|-----------|------------|----------|
| Time savings (≥75% SLA) | 5 | 5 | Demonstrated 91.7%. Contractually guaranteed. |
| Volume increase (≥5× SLA) | 5 | 5 | Demonstrated 13-26× (statistical) + full-population ML scan. |
| Scalability architecture | 5 | 5 | Kubernetes HPA auto-scaling: 1→4 GPU nodes in <90s, 47 concurrent tests. On-premise elastic capacity matches cloud auto-scaling without cloud dependency. |

### Category 4: Commercial Terms (10 points)

| Sub-Category | Max Points | Our Target | Strategy |
|--------------|-----------|------------|----------|
| Year 1 pricing | 5 | 4-5 | $810,000 fixed. Transparent. No variable cloud costs. Agent 4 free. |
| Long-term value | 5 | 4-5 | Fixed cost structure doesn't compound. Open-source models = no AI vendor lock-in. No cloud provider dependency. |

### Category 5: Vendor Viability & Support (10 points)

| Sub-Category | Max Points | Our Target | Strategy |
|--------------|-----------|------------|----------|
| Company stability | 5 | 3-4 | Honest about size. Mitigate with code escrow, open-source dependency, on-premise ownership. |
| Support model | 5 | 4-5 | Dedicated engineer, defined SLAs, quarterly on-site. Included in Year 1 price. |

### Projected Total: 85-93 / 100

**Where We Win:** Data privacy (10/10), iGrafx integration (5/5), time/volume SLAs (10/10), pricing transparency, Agent 4 free, NLU demo moment.

**Where We're At Risk:** SOC 2 gap (-1 to -2), company size (-1 to -2), formal benchmarks (-1), scalability vs. cloud (-1).

**Net Assessment:** The data privacy advantage (10-point category) likely outweighs all risk areas combined. If the evaluators weight data residency as they should for a $20B bank, this is a decisive advantage.

---

## 12.3 Risk Mitigation: Worst-Case Scenarios

| Scenario | Probability | Impact | Mitigation |
|----------|------------|--------|------------|
| Live demo fails mid-presentation | Low (5%) | High | Pre-recorded backup video. Static screenshot deck. Secondary presenter with separate environment. |
| Evaluator asks about GPT-4 superiority | High (60%) | Medium | Prepared response: "Trade-off between raw capability and data privacy. Fine-tuned Llama 3 matches for this specific domain. And your data stays in your building." |
| Evaluator asks about SOC 2 | High (70%) | Medium | Honest acknowledgment + 12-month commitment + interim mitigations (pentest, Axos audit rights, escrow) |
| Evaluator asks about company size/stability | Medium (40%) | Medium | Code escrow, open-source model dependency (survives Goldenflitch), on-premise deployment (Axos owns everything), knowledge transfer |
| Competitor shows a more polished UI | Medium (30%) | Low | "We focus on substance over presentation. Every element you saw today is functional. We're happy to conduct a side-by-side POC where both solutions process the same Axos control." |
| Evaluator challenges ML anomaly as "cherry-picked" | Medium (30%) | Medium | "We embedded 13 deliberate exceptions in the synthetic data. The ML found 4 additional anomalies we didn't plant. We can provide the synthetic data set and the seeded exceptions for you to verify independently." |

---

## 12.4 Post-Demo Follow-Up Sequence

| Day | Action | Owner |
|-----|--------|-------|
| Day 0 (demo day) | Send thank-you email to Ian, Subodh, Anthony | BD |
| Day 1 | Deliver API Documentation Preview (10-15 pages) | Engineering |
| Day 1 | Deliver Architecture Handout (2 pages) | AI Architect |
| Day 1 | Deliver Performance Data Sheet (1 page) | PM |
| Day 2 | Deliver Security Architecture Summary (3-5 pages) | Security Lead |
| Day 2 | Deliver Sample Workpaper (PDF) | PM |
| Day 2 | Deliver Competitive Differentiation Brief (1 page) | PM |
| Day 3 | Deliver Implementation Timeline (Gantt chart) | PM |
| Day 3 | Send reference client introductions | BD |
| Day 7 | Follow-up email: "Any questions from the demo?" | BD |
| Day 14 | Offer technical deep-dive session (if evaluators want to explore any area further) | Engineering + PM |
| Day 21 | Offer POC proposal (2-week technical proof of concept on Axos hardware) | BD |

---

## 12.5 Full Compliance Requirements Checklist

This checklist maps every regulatory and compliance requirement mentioned across all RFP documents to our solution:

| # | Requirement | Source | Status | Demo Evidence |
|---|-------------|--------|--------|---------------|
| 1 | OCC Heightened Standards (12 CFR Part 30, Appendix D) | RFP §II | ✓ Addressed | Agent 3 COSO assessment, GOV flags |
| 2 | FDIC Risk Management Examination | RFP §II | ✓ Addressed | Agent 4 examination readiness mode |
| 3 | Federal Reserve Regulation E | RFP §II | ✓ Addressed | Agent 3 regulatory benchmarking |
| 4 | Federal Reserve Regulation Z | RFP §II | ✓ Addressed | Pre-built test scripts |
| 5 | Federal Reserve Regulation D | RFP §II | ✓ Addressed | Pre-built test scripts |
| 6 | FINRA Rule 3110 (Supervision) | RFP §II | ✓ Addressed | Market surveillance + FINRA test scripts |
| 7 | FINRA Rule 2111 (Suitability) | RFP §II | ✓ Addressed | MSR-005 (Churning), MSR-010 (Concentration) |
| 8 | FINRA Rule 2090 (KYC) | RFP §II | ✓ Addressed | Pre-built test scripts |
| 9 | FINRA Rule 2210 (Communications) | RFP §II | ✓ Addressed | MSR-012 (Communication Surveillance) |
| 10 | FINRA Regulation Best Interest | RFP §II | ✓ Addressed | MSR-010, pre-built test scripts |
| 11 | FINRA Rule 4210 (Margin) | RFP §II | ✓ Addressed | Pre-built test scripts |
| 12 | SEC Rule 17a-3 (Records) | RFP §II | ✓ Addressed | Immutable audit log, 7-year retention |
| 13 | SEC Rule 17a-4 (Record Preservation) | RFP §II | ✓ Addressed | Hash-chain immutability, WORM-equivalent |
| 14 | SEC Rule 15c3-1 (Net Capital) | RFP §II | ✓ Addressed | Pre-built test scripts |
| 15 | SEC Rule 15c3-3 (Customer Protection) | RFP §II | ✓ Addressed | Pre-built test scripts |
| 16 | Sarbanes-Oxley (SOX) | RFP §II | ✓ Addressed | COSO framework alignment, audit trail |
| 17 | GLBA / Regulation P | RFP §II | ✓ Addressed | Zero data egress architecture |
| 18 | FCRA | RFP §II | ✓ Addressed | Pre-built test scripts |
| 19 | ECOA / Regulation B | RFP §II | ✓ Addressed | Fair lending test scripts |
| 20 | HMDA | RFP §II | ✓ Addressed | Fair lending test scripts |
| 21 | HPA | RFP §II | ✓ Addressed | Pre-built test scripts |
| 22 | SCRA / MLA | RFP §II | ✓ Addressed | Pre-built test scripts |
| 23 | SAFE Act | RFP §II | ✓ Addressed | Pre-built test scripts |
| 24 | UDAAP | RFP §II | ✓ Addressed | Agent 3 regulatory benchmarking |
| 25 | TISA | RFP §II | ✓ Addressed | Pre-built test scripts |
| 26 | FEAR Act | RFP §II | ✓ Addressed | Pre-built test scripts |
| 27 | TCPA | RFP §II | ✓ Addressed | Pre-built test scripts |
| 28 | CRA | RFP §II | ✓ Addressed | Pre-built test scripts |
| 29 | FFIEC IT Examination Handbook | RFP §II | ✓ Addressed | Agent 3 benchmarking |
| 30 | BSA/AML | RFP §II | ✓ Addressed | MSR-011 (Wire monitoring), SAR automation |
| 31 | COSO ERM Framework | RFP §III.B.iii | ✓ Addressed | Agent 3 5-component assessment |
| 32 | SR 11-7 (Model Risk Management) | RFP §IV | ✓ Addressed | Model update protocol, canary deployment, regression testing |
| 33 | 75% Net Time Savings guarantee | RFP §III.D | ✓ Demonstrated | 91.7% achieved in demo |
| 34 | 5× Volume Increase guarantee | RFP §III.D | ✓ Demonstrated | 13-26× achieved in demo |
| 35 | Agent 4 at no cost | RFP §III.E | ✓ Committed | $0 for Agent 4 |
| 36 | iGrafx integration | Demo Brief | ✓ Demonstrated | OData API + Webhook + SFTP |
| 37 | RSA Archer integration | RFP §III.C | ✓ Demonstrated | Live workpaper push |
| 38 | Market Surveillance (12 rules) | Demo Brief | ✓ Described | Full YAML specifications for all 12 rules |
| 39 | Market Data Ingestion | Demo Brief | ✓ Described | 4-source architecture, unified schema |
| 40 | Daily Alert Engine + SAR | Demo Brief | ✓ Described | 4-phase alert flow, sample investigation narrative |

---

## 12.6 Final Presenter Notes

1. **Open strong with data privacy.** The zero-egress architecture is the single most differentiated feature. Deliver the "your data never leaves your building" line within the first 8 minutes.

2. **Let the agents speak.** Don't over-narrate. When Agent 2 finds the CSR anomaly, let the evaluators read the output. Silence is powerful.

3. **Cross-reference TOE and TOD.** The moment where Agent 3 explains Agent 2's security word bypass as a design gap is the intellectual climax of the demo. Build to it.

4. **The NLU query is the emotional climax.** Typing a natural language question and getting an instant, accurate, locally-processed response makes the system feel intelligent and accessible.

5. **Be honest about gaps.** "We don't have SOC 2 yet — here's our plan" is more credible than deflecting.

6. **Close with the commercial advantage.** $810,000 fixed. Agent 4 free. No variable cloud costs. No AI vendor lock-in. This is a message that resonates with both technical evaluators and budget holders.

7. **Offer the POC.** A 2-week technical proof of concept on Axos's own hardware is the strongest possible follow-up. It eliminates "demo magic" concerns and gives Axos hands-on experience.

---

*← Back to `11-Competitive-Intelligence.md`*

---

**END OF COMPREHENSIVE DEMO PLAN**

*Goldenflitch Studios — Confidential*
*Prepared: February 2026*
