# 07 — Agent 4: Supervisory / Administrative Agent

*← Back to `06-Agent-3-Test-of-Design.md` | Next: `08-Market-Surveillance.md` →*

---

> **RFP Requirement (Section III.B.iv — Agent 4):** The RFP defines the following criteria for the Supervisory Agent. Agent 4's mission: orchestrate the other agents, provide a unified dashboard, enforce human review points, and deliver examination-ready outputs.
>
> **Critical Commercial Note:** Per Goldenflitch's proposal, **Agent 4 is provided at no cost.** This is a direct response to the RFP's requirement that "Agent 4 should be provided as a value-add" and significantly differentiates Goldenflitch's pricing.

---

## 7.1 RFP Criteria Mapping

### Criterion 1: "Workflow orchestration with dependency management"

**How We Demonstrate It:**

Agent 4 operates as the master orchestrator, managing the execution sequence of Agents 1-3 using a Directed Acyclic Graph (DAG):

```
                    ┌───────────┐
                    │  TRIGGER  │
                    │  (Archer  │
                    │  or Manual)│
                    └─────┬─────┘
                          │
                    ┌─────▼─────┐
                    │  AGENT 4  │
                    │ Initialize │
                    │ Test Run   │
                    └─────┬─────┘
                          │
                    ┌─────▼─────┐
                    │  AGENT 1  │
                    │ Doc Retriev│──── Dependency: None (first in chain)
                    └─────┬─────┘
                          │
              ┌───────────┼───────────┐
              │                       │
        ┌─────▼─────┐          ┌─────▼─────┐
        │  AGENT 2  │          │  AGENT 3  │
        │  TOE      │──┐       │  TOD      │──── Dependency: Agent 1 output
        └─────┬─────┘  │       │ (Phase 1: │     (can start COSO assessment
              │        │       │  design-   │      in parallel with Agent 2)
              │        │       │  only)     │
              │        │       └─────┬─────┘
              │        │             │
              │        └─────────────┤
              │                      │
        ┌─────▼──────────────────────▼─────┐
        │           AGENT 3 (Phase 2)       │
        │  TOD Cross-Reference with TOE     │──── Dependency: Agent 2 output
        │  (TOE-informed design assessment) │     (cannot complete without TOE)
        └─────────────┬────────────────────┘
                      │
                ┌─────▼─────┐
                │  AGENT 4  │
                │ Compile    │
                │ Review     │──── Human-in-the-Loop Checkpoint (if applicable)
                │ Publish    │
                └─────┬─────┘
                      │
                ┌─────▼─────┐
                │  RSA      │
                │  ARCHER   │
                └───────────┘
```

**State Machine:**

```
STATES:
  INITIALIZED    → Agent 4 has received trigger, created test run ID
  AGENT_1_ACTIVE → Agent 1 executing (document retrieval)
  AGENT_2_ACTIVE → Agent 2 executing (TOE) — parallel with Agent 3 Phase 1
  AGENT_3_ACTIVE → Agent 3 executing (TOD Phase 1 + Phase 2)
  REVIEW         → Human review checkpoint (triggered by high-severity findings)
  COMPILING      → Agent 4 assembling final workpaper
  PUBLISHING     → Agent 4 pushing to RSA Archer
  COMPLETE       → Test run finished, all outputs stored
  ERROR          → Agent failure, retry logic engaged
  PAUSED         → Human intervention required (evidence gap, agent conflict)

TRANSITIONS:
  INITIALIZED → AGENT_1_ACTIVE     [always]
  AGENT_1_ACTIVE → AGENT_2_ACTIVE  [on Agent 1 success + evidence sufficient]
  AGENT_1_ACTIVE → PAUSED          [on Agent 1 failure OR evidence insufficient]
  AGENT_2_ACTIVE → AGENT_3_ACTIVE  [Agent 3 Phase 2 starts after Agent 2 completes]
  AGENT_3_ACTIVE → REVIEW          [if any finding severity ≥ HIGH]
  AGENT_3_ACTIVE → COMPILING       [if all findings severity < HIGH]
  REVIEW → COMPILING               [on human approval]
  REVIEW → AGENT_2_ACTIVE          [on human request for re-test]
  COMPILING → PUBLISHING           [always]
  PUBLISHING → COMPLETE            [on Archer API success]
  PUBLISHING → ERROR               [on Archer API failure → retry 3×]
  ANY → ERROR                      [on unrecoverable agent failure]
  ERROR → INITIALIZED              [on manual retry with issue resolved]
```

**Demo Moment (0:52–0:54):**

The BOTTOM panel shows the DAG visualization with real-time status indicators:

```
[Agent 1: Doc Retrieval]  ████████████ COMPLETE (47s)
  └── 3 documents, 3 flags, evidence score: 88%

[Agent 2: TOE]            ████████████ COMPLETE (12m 24s)
  ├── 385 samples tested
  ├── 13 exceptions (2 CRIT, 5 HIGH, 4 MED, 2 ML)
  └── Verdict: QUALIFIED (96.6%)

[Agent 3: TOD]            ████████████ COMPLETE (8m 42s)
  ├── COSO 5-component assessment
  ├── 4 design gaps (2 HIGH, 2 MED)
  └── Rating: NEEDS IMPROVEMENT (0.64)

[Agent 4: Supervisory]    ██████░░░░░░ REVIEW CHECKPOINT
  ├── Human review required: 7 high/critical findings
  ├── Waiting for: compliance_analyst@axos.com
  └── Auto-escalation in: 48 hours
```

**Narration:** *"Agent 4 is the air traffic controller. It knows that Agent 2 can't start until Agent 1 delivers the evidence package. It knows Agent 3 can begin its COSO assessment in parallel with Agent 2, but can't complete the cross-reference until Agent 2 is done. Right now, it's holding at a human review checkpoint because 7 findings are HIGH or CRITICAL severity. It won't publish to Archer until a human approves."*

---

### Criterion 2: "Real-time supervisory dashboard"

**How We Demonstrate It:**

The dashboard displays in the BOTTOM panel throughout the demo:

**Dashboard Components:**

| Panel Section | Content | Update Frequency |
|--------------|---------|-----------------|
| **Status Bar** | Current state (INITIALIZED / RUNNING / REVIEW / COMPLETE) | Real-time |
| **Agent Progress** | Per-agent progress bars with timing | Real-time |
| **Finding Counter** | Rolling count of exceptions/gaps by severity | As agents report |
| **Performance Ticker** | Time elapsed vs. manual equivalent | Real-time |
| **Evidence Tracker** | Documents retrieved, hashes, completeness score | On Agent 1 completion |
| **Audit Log Stream** | Last 10 audit entries (scrollable) | Real-time |
| **System Health** | CPU/GPU utilization, memory, inference queue depth | Every 5 seconds |

**Performance Metrics Displayed at Demo End (0:60–0:62):**

```
╔══════════════════════════════════════════════════════════════╗
║                    PERFORMANCE SUMMARY                       ║
╠══════════════════════════════════════════════════════════════╣
║  Control: CTL-CC-385650 — Customer Verification PII          ║
║  Test Type: TOE + TOD                                        ║
║  Period: Q4 2025                                             ║
║                                                              ║
║  ┌────────────────────────────────────────────────────────┐  ║
║  │  TOTAL AGENT PROCESSING TIME:  24 minutes 53 seconds   │  ║
║  │  MANUAL EQUIVALENT:            4-6 hours (avg 5.0 hrs) │  ║
║  │  NET TIME SAVINGS:             91.7%                    │  ║
║  │  SLA GUARANTEE:                75%      ✓ EXCEEDED      │  ║
║  └────────────────────────────────────────────────────────┘  ║
║                                                              ║
║  ┌────────────────────────────────────────────────────────┐  ║
║  │  RECORDS PROCESSED:            65,000                   │  ║
║  │  RECORDS SAMPLED:              385                      │  ║
║  │  ML FULL-POPULATION SCAN:      65,000                   │  ║
║  │  MANUAL CAPACITY:              25-50 samples             │  ║
║  │  VOLUME INCREASE:              13×–26× (statistical)    │  ║
║  │                                + ML full-scan (∞×)      │  ║
║  │  SLA GUARANTEE:                5×       ✓ EXCEEDED      │  ║
║  └────────────────────────────────────────────────────────┘  ║
║                                                              ║
║  ┌────────────────────────────────────────────────────────┐  ║
║  │  FINDINGS:                                              │  ║
║  │    TOE Exceptions:  13 (2 CRIT, 5 HIGH, 4 MED, 2 ML)  │  ║
║  │    TOD Gaps:        4  (2 HIGH, 2 MED)                  │  ║
║  │    Governance Flags: 3 (1 HIGH, 2 MED)                  │  ║
║  │    Total:           20 findings                         │  ║
║  └────────────────────────────────────────────────────────┘  ║
║                                                              ║
║  ┌────────────────────────────────────────────────────────┐  ║
║  │  SYSTEM RESOURCES USED:                                 │  ║
║  │    GPU Utilization (peak):    78%                       │  ║
║  │    GPU Memory (peak):         62 GB / 80 GB             │  ║
║  │    CPU Utilization (peak):    45%                       │  ║
║  │    Memory (peak):             12 GB / 64 GB             │  ║
║  │    LLM Inference Calls:       847                       │  ║
║  │    Avg Inference Latency:     1.3 seconds               │  ║
║  └────────────────────────────────────────────────────────┘  ║
╚══════════════════════════════════════════════════════════════╝
```

---

### Criterion 3: "Role-Based Access Control (RBAC)"

**How We Demonstrate It:**

Agent 4 enforces a 4-role permission matrix:

```json
{
  "rbac_matrix": {
    "roles": [
      {
        "role": "VIEWER",
        "description": "Read-only access to completed test results and dashboards",
        "permissions": {
          "view_dashboard": true,
          "view_test_results": true,
          "view_audit_log": true,
          "trigger_test": false,
          "approve_findings": false,
          "configure_agents": false,
          "manage_users": false,
          "export_data": true,
          "modify_scripts": false
        },
        "typical_user": "Auditor, examiner, senior management"
      },
      {
        "role": "ANALYST",
        "description": "Can trigger tests, review results, and interact with agents via NLU",
        "permissions": {
          "view_dashboard": true,
          "view_test_results": true,
          "view_audit_log": true,
          "trigger_test": true,
          "approve_findings": false,
          "configure_agents": false,
          "manage_users": false,
          "export_data": true,
          "modify_scripts": false,
          "nlu_query": true,
          "upload_documents": true
        },
        "typical_user": "Control tester, compliance analyst"
      },
      {
        "role": "MANAGER",
        "description": "Can approve findings, override agent decisions, assign remediation",
        "permissions": {
          "view_dashboard": true,
          "view_test_results": true,
          "view_audit_log": true,
          "trigger_test": true,
          "approve_findings": true,
          "configure_agents": false,
          "manage_users": false,
          "export_data": true,
          "modify_scripts": true,
          "nlu_query": true,
          "upload_documents": true,
          "assign_remediation": true,
          "override_agent_decision": true
        },
        "typical_user": "ERM manager, compliance director, line-of-defense lead"
      },
      {
        "role": "ADMIN",
        "description": "Full system access including agent configuration, user management, and model tuning",
        "permissions": {
          "ALL": true,
          "additionally": [
            "configure_agent_parameters",
            "manage_user_roles",
            "configure_integrations",
            "model_version_management",
            "system_health_management",
            "backup_restore"
          ]
        },
        "typical_user": "System administrator, Goldenflitch support engineer"
      }
    ],
    "sso_integration": "SAML 2.0 / OAuth 2.0 with Axos's existing identity provider (Okta, Azure AD, or Ping Identity)",
    "mfa_required": true,
    "session_timeout_minutes": 30,
    "concurrent_session_limit": 1
  }
}
```

**Demo Moment (0:55–0:56):**

The presenter shows the permission matrix and demonstrates attempting an action not permitted for the current role:

> *"I'm logged in as an Analyst. Watch what happens when I try to approve a finding..."*
> → System returns: "Permission denied. Finding approval requires MANAGER or ADMIN role. Current role: ANALYST."
> *"The system enforces role boundaries at every interaction point. This is logged in the audit trail."*

---

### Criterion 4: "Immutable audit trail with hash-chain integrity"

Covered extensively in `01-Architecture-Overview.md` (Section 1.2, Layer 3) and `04-Agent-1-Documentation-Retrieval.md` (Criterion 5). The key demo moment for Agent 4 specifically:

**Hash Chain Verification Demo (0:55):**

```
[Agent 4 Dashboard → Audit Log → Verify Chain Integrity]

Chain Verification Report:
  Total entries: 65
  First entry: seq_id=1001, hash=sha256:a1b2...
  Last entry: seq_id=1065, hash=sha256:z9y8...
  Chain status: ✓ VALID — all 65 entries form an unbroken chain
  Verification time: 0.003 seconds

  If any entry were modified:
    Entry 1042 modified → sha256 mismatch at entry 1043
    Status: ✗ INVALID — chain broken at entry 1043
    All entries from 1043 onward are suspect
```

---

### Criterion 5: "Natural Language Interface for supervisory queries"

**How We Demonstrate It — The Demo's "Wow Moment" (0:57–0:59):**

The presenter opens a chat-style interface overlaying the dashboard:

**Query 1 (Simple Lookup):**

```
User: "What controls related to customer authentication had exceptions this quarter?"

Agent 4 (via local Llama 3 70B):
  "In Q4 2025, one control related to customer authentication was tested:

   CTL-CC-385650 — Customer Verification – Personal Identifying Information

   Results:
   • TOE Verdict: QUALIFIED (96.6% compliance)
   • 13 exceptions identified:
     - 2 CRITICAL (security word bypass)
     - 5 HIGH (insufficient PII / non-approved items)
     - 4 MEDIUM (hint inconsistency)
     - 2 ML OBSERVATIONS (CSR behavioral pattern, after-hours pattern)
   • TOD Rating: NEEDS IMPROVEMENT (4 design gaps)

   Would you like details on any specific exception or the full workpaper?"
```

**Query 2 (Analytical):**

```
User: "Compare the exception rate for CSR C-1147 against the department average"

Agent 4:
  "CSR C-1147 Performance Analysis:

   | Metric                    | CSR C-1147 | Dept. Average | Delta   |
   |---------------------------|------------|---------------|---------|
   | Total calls (Q4 2025)     | 487        | 347.6         | +40.1%  |
   | Partial verification rate | 14.1%      | 4.2%          | +9.9pp  |
   | Full access after partial | 10/12 (83%)| 2/14 (14%)    | +69pp   |
   | Supplemental-only calls   | 3.1%       | 0.8%          | +2.3pp  |
   | After-hours calls         | 1.2%       | 0.7%          | +0.5pp  |

   CSR C-1147's partial verification rate is 3.2 standard deviations above
   the department mean. This was flagged as Anomaly ANOM-001 in the TOE test.

   Recommendation: Supervisory review of CSR C-1147's call recordings,
   focusing on the 12 calls where partial verification led to full account access."
```

**Query 3 (Regulatory):**

```
User: "What OCC requirements apply to this control and are we compliant?"

Agent 4:
  "OCC Heightened Standards applicable to CTL-CC-385650:

   1. §30.4 — Risk Management Framework
      Status: PARTIAL COMPLIANCE
      Gap: No formal risk assessment linked to this control (TOD Gap GAP-001)

   2. §30.5(b) — Control Design and Documentation
      Status: NON-COMPLIANT
      Gap: Current version v0.0.7 is UNAPPROVED (Governance Flag GOV-001)

   3. §30.5(c) — Escalation Procedures
      Status: NON-COMPLIANT
      Gap: No escalation path for failed security word (TOD Gap GAP-002)

   4. §30.6 — Monitoring
      Status: PARTIAL COMPLIANCE
      Gap: No embedded real-time monitoring or KRIs (TOD Gap GAP-004)

   Overall OCC compliance assessment: 2 of 4 applicable requirements are
   non-compliant. Recommend prioritizing GOV-001 (approval) and GAP-002
   (escalation) for immediate remediation."
```

**Narration:** *"Everything you just saw — the data retrieval, the analysis, the regulatory mapping — happened entirely on your local LLM. The query never left your building. The response was generated by Llama 3 70B running on the GPU in your data center. This is why our zero-egress architecture matters: you get the intelligence of a large language model without any data leaving your perimeter."*

---

### Criterion 6: "RSA Archer integration — workpaper publication"

**How We Demonstrate It (0:59–1:00):**

Agent 4 compiles all outputs into an Archer-compatible workpaper and pushes it via the Archer REST API:

**Workpaper Structure (pushed to Archer):**

```json
{
  "archer_payload": {
    "endpoint": "POST /api/v6/content/findings",
    "content_type": "application/json",
    "payload": {
      "finding_id": "FND-2026-Q4-00147",
      "control_id": "CTL-CC-385650",
      "control_name": "Customer Verification – Personal Identifying Information",
      "test_date": "2026-02-04",
      "test_type": "TOE + TOD",
      "test_period": "Q4 2025",
      "tested_by": "Goldenflitch AI Agent System v2.1",
      "reviewed_by": "PENDING (compliance_analyst@axos.com)",
      "approved_by": "PENDING",

      "executive_summary": "Agent-based testing of CTL-CC-385650 identified 13 operational exceptions and 4 design gaps. The control achieves its primary objective (customer identity verification) with a 96.6% compliance rate but has latent design weaknesses, particularly in escalation handling and monitoring. Two critical exceptions involve security word bypasses. ML analysis flagged a CSR behavioral anomaly (C-1147) requiring supervisory investigation. Design assessment rates the control as NEEDS IMPROVEMENT, primarily due to absent risk assessment and missing escalation paths.",

      "toe_section": {
        "verdict": "QUALIFIED",
        "compliance_rate": 0.966,
        "sample_size": 385,
        "population_size": 65000,
        "exceptions_total": 13,
        "exceptions_critical": 2,
        "exceptions_high": 5,
        "exceptions_medium": 4,
        "ml_observations": 2,
        "exception_detail": "/* Full exception register — see file 05 */",
        "sampling_methodology": "Stratified random (Cochran's formula, 95% CI, 2.5% MOE)",
        "ml_methodology": "Isolation Forest + DBSCAN (unsupervised, full-population)"
      },

      "tod_section": {
        "rating": "NEEDS IMPROVEMENT",
        "overall_score": 0.64,
        "coso_scores": {
          "control_environment": 0.82,
          "risk_assessment": 0.58,
          "control_activities": 0.75,
          "information_communication": 0.55,
          "monitoring_activities": 0.50
        },
        "design_gaps_total": 4,
        "design_gaps_high": 2,
        "design_gaps_medium": 2,
        "gap_detail": "/* Full gap analysis — see file 06 */",
        "regulatory_benchmarks": "/* FFIEC, OCC, NIST, PCI — see file 06 */"
      },

      "remediation_tracker": [
        { "id": "REM-001", "gap": "GAP-001", "action": "Create RCSA document", "priority": "P1", "due_date": "2026-04-05", "owner": "ERM team", "status": "OPEN" },
        { "id": "REM-002", "gap": "GAP-002", "action": "Add escalation path + lockout", "priority": "P1", "due_date": "2026-03-06", "owner": "CS Ops + InfoSec", "status": "OPEN" },
        { "id": "REM-003", "gap": "GAP-003", "action": "Clarify OTP handoff", "priority": "P2", "due_date": "2026-05-05", "owner": "Process Design", "status": "OPEN" },
        { "id": "REM-004", "gap": "GAP-004", "action": "Implement KRIs + alerts", "priority": "P2", "due_date": "2026-05-05", "owner": "CS Ops + ERM", "status": "OPEN" }
      ],

      "evidence_index": [
        { "doc": "PII Process v0.0.7", "hash": "sha256:a3f9...", "source": "iGrafx" },
        { "doc": "OTP Subprocess v1.2.0", "hash": "sha256:c8d5...", "source": "iGrafx" },
        { "doc": "Auth Policy v3.1", "hash": "sha256:e1f3...", "source": "SharePoint" },
        { "doc": "TOE Test Scripts v2.1", "hash": "sha256:g7h8...", "source": "Goldenflitch" },
        { "doc": "ML Model Config (IF + DBSCAN)", "hash": "sha256:i9j0...", "source": "Goldenflitch" },
        { "doc": "Sampling Data Extract", "hash": "sha256:k1l2...", "source": "Axos DW" }
      ],

      "audit_trail_reference": {
        "total_audit_entries": 65,
        "first_entry_hash": "sha256:a1b2...",
        "last_entry_hash": "sha256:z9y8...",
        "chain_integrity": "VALID",
        "audit_log_location": "/audit/test-runs/TOE-2026-Q4-001/"
      },

      "performance_metrics": {
        "total_agent_time_minutes": 24.88,
        "manual_equivalent_hours": 5.0,
        "time_savings_percent": 91.7,
        "volume_increase_factor": "13×–26× (statistical) + full-population ML"
      }
    }
  }
}
```

**Demo Moment (0:59–1:00):**

The RIGHT panel (RSA Archer) shows the workpaper appearing in real-time:

```
[09:40:01.234] Agent 4 → Archer API: POST /api/v6/content/findings
               ├── Payload size: 42 KB
               ├── Authentication: OAuth2 Bearer token
               └── TLS: 1.3

[09:40:01.891] Archer API → Agent 4: 201 Created
               ├── Finding ID: FND-2026-Q4-00147
               ├── Status: DRAFT (awaiting human review)
               └── URL: https://archer.axos.internal/findings/FND-2026-Q4-00147

[09:40:02.100] Archer UI refreshes → New finding visible in control library
```

**Narration:** *"15 seconds. From Agent 4 compilation to a fully populated workpaper in your system of record. Every field is mapped to your Archer schema. Every piece of evidence has a hash. The workpaper is created as DRAFT — it requires human review and approval before it's finalized. The system assists but does not replace human judgment on final disposition."*

---

## 7.2 Human-in-the-Loop Review Points

Agent 4 enforces mandatory human review at these checkpoints:

| Checkpoint | Trigger Condition | What Human Reviews | Human Options |
|------------|------------------|--------------------|---------------|
| **Evidence Gap** | Agent 1 completeness score < 70% | Missing documents, insufficient evidence | (a) Provide missing document, (b) Approve proceeding with gap noted, (c) Cancel test |
| **High-Severity Finding** | Any TOE exception with severity ≥ HIGH | Exception details, evidence, agent reasoning | (a) Accept finding, (b) Reject finding (with documented rationale), (c) Request re-test |
| **Agent Conflict** | Agent 2 and Agent 3 disagree on severity | Both agent outputs side-by-side | (a) Accept Agent 2's assessment, (b) Accept Agent 3's assessment, (c) Override with human assessment |
| **Workpaper Publication** | Always (before Archer push) | Complete workpaper, all findings | (a) Approve for publication, (b) Return for revision, (c) Escalate to management |
| **ML Anomaly Escalation** | Any ML observation with z-score > 3.0 | Anomaly details, affected records | (a) Confirm as finding, (b) Classify as false positive, (c) Escalate to investigation |
| **False Positive Tuning** | Human marks a finding as false positive | Finding details + tuning recommendation | (a) Suppress for this test only, (b) Suppress for this control permanently, (c) Update test script to prevent future false positives |

**Narration:** *"The system never publishes a finding without human approval. This is essential for regulatory acceptance — OCC and FINRA examiners need to know that a human made the final call. The AI augments human judgment; it doesn't replace it."*

---

## 7.3 Agent 4 Summary: Demo Checklist

| RFP Criterion | Demonstrated? | Demo Timestamp | Key Evidence |
|--------------|---------------|----------------|--------------|
| Workflow orchestration with dependency management | ✓ | 0:52–0:54 | DAG visualization, state machine transitions |
| Real-time supervisory dashboard | ✓ | Throughout (BOTTOM panel) | Progress bars, finding counters, performance ticker |
| RBAC with 4 roles | ✓ | 0:55–0:56 | Permission matrix, denied-action demo |
| Immutable audit trail | ✓ | 0:55 | Hash chain verification (65 entries, valid) |
| Natural Language Interface | ✓ | 0:57–0:59 | 3 live NLU queries with local LLM |
| RSA Archer integration | ✓ | 0:59–1:00 | Live workpaper push, 201 Created response |
| Human-in-the-Loop checkpoints | ✓ | 0:54 (REVIEW state) | 6 checkpoint types documented |
| Agent 4 at no cost | ✓ | Commercial section | Confirmed $0 for Agent 4 |

---

*← Back to `06-Agent-3-Test-of-Design.md` | Next: `08-Market-Surveillance.md` →*
