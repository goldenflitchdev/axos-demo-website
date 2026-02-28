# 06 — Agent 3: Test of Design (TOD) Agent

*← Back to `05-Agent-2-Test-of-Effectiveness.md` | Next: `07-Agent-4-Supervisory-Agent.md` →*

---

> **RFP Requirement (Section III.B.iii — Agent 3):** The RFP defines the following criteria for the Test of Design Agent. Agent 3's mission: evaluate whether the control is designed adequately to mitigate the identified risk, independent of how well it is currently operating.

---

## 6.1 Key Distinction: TOD vs. TOE

| Dimension | Agent 2 (TOE) | Agent 3 (TOD) |
|-----------|---------------|---------------|
| **Question Answered** | "Is the control working?" | "Is the control designed correctly?" |
| **Input Data** | Transaction/call records (operational data) | Process map, policy documents, regulatory standards |
| **Method** | Statistical sampling + ML | COSO framework mapping + gap analysis |
| **Can Pass TOE but Fail TOD?** | N/A | YES — a control can work 100% of the time today but have a design flaw that will cause future failures |
| **Can Fail TOE but Pass TOD?** | N/A | YES — a well-designed control can have execution issues (training, system bugs) |

**Narration:** *"Agent 2 told us the control works 96.6% of the time. Agent 3 asks: 'Should we be comfortable with that design?' A control can have a 100% pass rate today and still be poorly designed — because the design flaw hasn't been exploited yet. Agent 3 finds those latent risks."*

---

## 6.2 COSO Internal Control Framework Mapping

Agent 3 maps the control against the COSO 2013 Internal Control — Integrated Framework's five components and seventeen principles. For the demo, the five-component summary is shown:

```json
{
  "coso_assessment": {
    "control_id": "CTL-CC-385650",
    "framework": "COSO 2013 Internal Control — Integrated Framework",
    "assessment_date": "2026-02-04",
    "assessor": "Agent 3 (Goldenflitch AI)",
    "evidence_base": [
      "PII Process v0.0.7 (primary process map)",
      "OTP Subprocess v1.2.0 (referenced subprocess)",
      "Auth Policy v3.1 (governing policy)",
      "Agent 2 TOE Results (13 exceptions, 4 ML anomalies)"
    ],

    "components": [
      {
        "component": "1. Control Environment",
        "rating": "SATISFACTORY",
        "score": 0.82,
        "assessment": "The control exists within Axos's formal GRC framework. It has a designated process owner, is documented in iGrafx (industry-standard BPM tool), and has a version history demonstrating ongoing maintenance. However, the single-author observation (GOV-003) and the UNAPPROVED status of v0.0.7 weaken the control environment.",
        "strengths": [
          "Formal process documentation in enterprise BPM tool (iGrafx)",
          "Clear swim-lane structure separating customer and CSR responsibilities",
          "Version history demonstrates active maintenance (7 versions in 10 months)",
          "Control is part of a broader verification framework (OTP subprocess linkage)"
        ],
        "weaknesses": [
          "Current version (v0.0.7) is UNAPPROVED — production may not match documented design",
          "Single author across all 7 versions — no evidence of independent review",
          "No documented approval workflow for process changes (who approves, what criteria?)"
        ],
        "relevant_coso_principles": [
          "Principle 1: Organization demonstrates commitment to integrity and ethical values",
          "Principle 2: Board of directors demonstrates independence from management",
          "Principle 3: Management establishes structures, reporting lines, and appropriate authorities"
        ]
      },
      {
        "component": "2. Risk Assessment",
        "rating": "NEEDS IMPROVEMENT",
        "score": 0.58,
        "assessment": "The process map does not contain a formal risk assessment. There is no documented risk scoring, no threat model, and no assessment of the probability and impact of verification failures. The process appears to have been designed based on operational requirements rather than a risk-based approach.",
        "strengths": [
          "Implicit risk awareness — the existence of two verification tracks (Track A and B) shows recognition that different risk levels require different controls",
          "OTP subprocess provides step-up authentication for sensitive actions (contact updates)"
        ],
        "weaknesses": [
          "No formal risk assessment document linked to this control",
          "No threat model — what specific threats is this control designed to mitigate? (Social engineering? Insider threat? Account takeover?)",
          "No risk scoring — how does Axos quantify the risk this control addresses?",
          "The 'non-account-specific' bypass path (Shape 3) has no risk assessment — what constitutes non-account-specific, and what's the risk of that boundary being drawn incorrectly?",
          "Supplemental PII items include high-risk data (full card number, account balance) but are treated with the same weight as standard items"
        ],
        "relevant_coso_principles": [
          "Principle 6: Organization specifies objectives with sufficient clarity to enable identification of risks",
          "Principle 7: Organization identifies risks to achievement of objectives and analyzes risks",
          "Principle 8: Organization considers the potential for fraud in assessing risks"
        ],
        "gap_id": "GAP-001"
      },
      {
        "component": "3. Control Activities",
        "rating": "SATISFACTORY",
        "score": 0.75,
        "assessment": "The control activities are generally well-defined. The two-track verification model provides appropriate rigor, and the process includes clear decision points. However, several boundary conditions are undefined, and the hint policy weakens the security word control.",
        "strengths": [
          "Clear verification thresholds (4 items for Track A, security word + 2 for Track B)",
          "Defined item pools (standard and supplemental) provide structure for CSR interactions",
          "OTP step-up for contact changes adds a second authentication factor",
          "Partial verification path prevents complete denial of service while maintaining access restrictions"
        ],
        "weaknesses": [
          "Security word hint policy is an annotation, not a formal process step — inconsistent application",
          "No escalation path for failed security word attempts — customer simply falls back to Track A",
          "'Limited assistance' for partially verified customers is undefined — scope creep risk",
          "No maximum attempt limit documented — how many verification attempts before lockout?",
          "Supplemental items are not risk-weighted — using a card number (easily stolen) counts the same as a DOB (harder to obtain)"
        ],
        "relevant_coso_principles": [
          "Principle 10: Organization selects and develops control activities that contribute to mitigation of risks",
          "Principle 11: Organization selects and develops general control activities over technology",
          "Principle 12: Organization deploys control activities through policies that establish what is expected"
        ],
        "gap_id": "GAP-002"
      },
      {
        "component": "4. Information & Communication",
        "rating": "NEEDS IMPROVEMENT",
        "score": 0.55,
        "assessment": "The process map communicates the basic verification flow, but several critical information paths are ambiguous or missing. The OTP subprocess handoff is one-directional (no documented return path), and the process doesn't specify how verification outcomes are communicated to downstream systems.",
        "strengths": [
          "Process documented in a standard BPM tool (iGrafx) accessible to relevant stakeholders",
          "Swim lanes clearly delineate customer vs. CSR responsibilities",
          "Decision points are explicit with labeled outcomes"
        ],
        "weaknesses": [
          "OTP subprocess handoff: The process shows a one-way arrow to OTP but doesn't clearly document what happens when OTP completes — does the customer return to the main process? At which point?",
          "Verification outcome is not documented as flowing to downstream systems (CRM, audit log, QA system) — how does the rest of the bank know a customer was verified?",
          "The security word hint annotation is in a note, not in the CSR training materials or system prompts — communication gap",
          "No documented feedback mechanism — if a CSR encounters a scenario not covered by the process, there's no documented path for reporting it"
        ],
        "relevant_coso_principles": [
          "Principle 13: Organization obtains or generates and uses relevant, quality information",
          "Principle 14: Organization internally communicates information necessary to support functioning of internal control",
          "Principle 15: Organization communicates with external parties regarding matters affecting functioning of internal control"
        ],
        "gap_id": "GAP-003"
      },
      {
        "component": "5. Monitoring Activities",
        "rating": "NEEDS IMPROVEMENT",
        "score": 0.50,
        "assessment": "The process map contains no self-monitoring mechanisms. There is no documented QA review loop, no sampling protocol for supervisory oversight, and no KPI/KRI definition for this control. Monitoring appears to be entirely external (this test being a prime example).",
        "strengths": [
          "The fact that this control is being tested (via Goldenflitch's system) demonstrates some level of monitoring commitment",
          "Call recording infrastructure exists (enabling retrospective review)"
        ],
        "weaknesses": [
          "No embedded monitoring within the process itself — no real-time alerts for verification failures",
          "No documented QA sampling cadence — how often does a supervisor review a CSR's verification calls?",
          "No KPIs/KRIs defined for this control (e.g., verification success rate, average verification time, exception rate by CSR)",
          "No documented escalation threshold — at what exception rate does management get notified?",
          "No documented self-testing mechanism — the process doesn't specify how it validates itself"
        ],
        "relevant_coso_principles": [
          "Principle 16: Organization selects, develops, and performs ongoing and/or separate evaluations to ascertain whether components of internal control are present and functioning",
          "Principle 17: Organization evaluates and communicates internal control deficiencies in a timely manner"
        ],
        "gap_id": "GAP-004"
      }
    ],

    "overall_rating": "NEEDS IMPROVEMENT",
    "overall_score": 0.64,
    "overall_narrative": "The control is designed to a functional level — it achieves its basic objective of verifying customer identity before granting account access. However, the design has significant gaps in risk assessment (no formal threat model or risk scoring), information flows (ambiguous subprocess handoffs), and monitoring (no embedded self-testing or KPIs). The control would benefit from: (1) a formal risk assessment, (2) an escalation path for failed security word attempts, (3) clearer boundaries for 'limited assistance,' (4) embedded monitoring with defined KRIs, and (5) formalization of the hint policy."
  }
}
```

---

## 6.3 Design Gap Analysis — Detailed Findings

### Gap 1: Absent Formal Risk Assessment

| Field | Detail |
|-------|--------|
| **Gap ID** | GAP-001 |
| **COSO Component** | Risk Assessment |
| **Severity** | HIGH |
| **Title** | No formal risk assessment linked to the verification process |
| **Description** | The process map defines how verification is performed but does not document why specific design choices were made. There is no threat model identifying what threats the control mitigates (social engineering, account takeover, insider fraud), no risk scoring quantifying the probability and impact of verification failures, and no risk appetite statement defining acceptable exception rates. |
| **Regulatory References** | OCC Heightened Standards §30.4 ("risk management framework should include risk identification, measurement, and monitoring"); COSO Principle 7 ("Organization identifies risks to achievement of objectives"); SR 11-7 ("Model governance should include risk assessment for AI/ML-based controls") |
| **TOE Cross-Reference** | Agent 2's anomaly ANOM-002 (after-hours supplemental-only verifications) suggests a threat vector (social engineering) that a formal risk assessment would have identified and mitigated in the design |
| **Remediation Recommendation** | Create a formal Risk and Control Self-Assessment (RCSA) document linked to CTL-CC-385650. Include: threat catalog, probability/impact matrix, risk appetite thresholds, and residual risk calculation |
| **Remediation Priority** | P1 — Complete within 60 days |
| **Remediation Owner** | ERM / Operational Risk team |

### Gap 2: No Escalation Path for Failed Security Word

| Field | Detail |
|-------|--------|
| **Gap ID** | GAP-002 |
| **COSO Component** | Control Activities |
| **Severity** | HIGH |
| **Title** | Failed security word falls through to Track A without escalation or logging |
| **Description** | When a customer has a security word on file but provides it incorrectly (Decision Node DN-03, "Is the security word valid?" → NO), the process simply routes the customer to Track A (4 PII items). There is no escalation to a supervisor, no flag on the account, and no documented limit on failed attempts. This means: (a) An attacker who fails the security word gets a second chance with potentially easier-to-obtain PII, (b) Repeated failed attempts are not tracked, and (c) CSRs have no visibility into whether this is the customer's 1st or 10th attempt. |
| **Regulatory References** | FFIEC Authentication Guidance ("failed authentication attempts should be logged and monitored, with lockout or escalation after a defined threshold"); OCC Heightened Standards §30.5(c) ("controls should include escalation procedures for control failures") |
| **TOE Cross-Reference** | Agent 2 Exception EXC-001 (2 security word bypasses) is directly caused by this design gap. If an escalation path existed, these bypasses might have been caught in real-time rather than in a quarterly test. |
| **Remediation Recommendation** | (1) Add an escalation step after DN-03 = NO: After 2 failed security word attempts, escalate to supervisor. (2) Log all failed security word attempts in the CRM. (3) Define a lockout threshold (e.g., 3 failed attempts → require in-person verification). |
| **Remediation Priority** | P1 — Complete within 30 days |
| **Remediation Owner** | Customer Service Operations + InfoSec |

### Gap 3: Ambiguous OTP Subprocess Handoff

| Field | Detail |
|-------|--------|
| **Gap ID** | GAP-003 |
| **COSO Component** | Information & Communication |
| **Severity** | MEDIUM |
| **Title** | OTP subprocess has unclear return path and failure handling |
| **Description** | Shape 11 references the OTP subprocess, but the process map only shows a one-directional arrow. Questions unanswered by the current design: (a) When OTP completes successfully, does the customer return to the main process? At which decision point? (b) If OTP fails (customer can't complete OTP), what happens? Is the customer denied the contact update? Can they try again? Is there a fallback? (c) Is the OTP subprocess version-locked to the main process, or can they evolve independently? |
| **Regulatory References** | FFIEC IT Examination Handbook — "Process documentation should clearly define handoffs between subprocesses"; COSO Principle 14 ("Organization internally communicates information necessary to support functioning of internal control") |
| **TOE Cross-Reference** | Agent 2 would benefit from testing OTP outcomes, but the ambiguous handoff makes it difficult to define expected behavior for OTP-related records |
| **Remediation Recommendation** | (1) Add explicit return arrows from OTP subprocess to the main process. (2) Define OTP failure handling (retry limit, fallback, escalation). (3) Version-lock subprocess references (e.g., "OTP v1.2.0") to prevent version drift. |
| **Remediation Priority** | P2 — Complete within 90 days |
| **Remediation Owner** | Process Design team |

### Gap 4: No Embedded Monitoring or KRIs

| Field | Detail |
|-------|--------|
| **Gap ID** | GAP-004 |
| **COSO Component** | Monitoring Activities |
| **Severity** | MEDIUM |
| **Title** | Process has no self-monitoring, no KPIs, no real-time alerting |
| **Description** | The process runs "open loop" — there is no feedback mechanism within the process itself to detect when it is failing. All monitoring is external (quarterly testing, ad-hoc supervisor reviews). This means: (a) Verification failures accumulate undetected between test cycles. (b) CSR behavioral deviations (like ANOM-001) persist for months before detection. (c) There are no defined KPIs (target verification success rate, average handling time, exception rate) or KRIs (alert thresholds for anomalous patterns). |
| **Regulatory References** | COSO Principle 16 ("Organization performs ongoing and/or separate evaluations"); OCC Heightened Standards §30.6 ("monitoring should be continuous or near-continuous for high-risk controls") |
| **TOE Cross-Reference** | Agent 2's ML anomalies (ANOM-001, ANOM-002) would have been detected weeks or months earlier if real-time monitoring were embedded in the process |
| **Remediation Recommendation** | (1) Define KPIs: Verification success rate (target: ≥98%), Average verification time (target: <3 min), Exception rate by CSR (alert threshold: >2σ). (2) Implement real-time dashboards for supervisors. (3) Configure alerts for anomalous patterns (e.g., any CSR with >10% partial verification rate). (4) Implement daily/weekly automated sampling (separate from quarterly testing). |
| **Remediation Priority** | P2 — Complete within 90 days |
| **Remediation Owner** | Customer Service Operations + ERM |

---

## 6.4 Regulatory Benchmarking

Agent 3 compares the control's design against industry standards and regulatory expectations:

```json
{
  "regulatory_benchmark": {
    "control_id": "CTL-CC-385650",
    "benchmarks": [
      {
        "standard": "FFIEC Authentication Guidance (2021 Update)",
        "requirement": "Multi-factor authentication for high-risk transactions",
        "control_alignment": "PARTIAL",
        "assessment": "The control implements knowledge-based authentication (PII items + security word) but does not include a second authentication factor (something the customer has or is). The OTP subprocess adds a possession factor (phone) but only for contact updates, not for general account access.",
        "gap": "General account access relies solely on knowledge factors. Industry trend is toward multi-factor for all account-specific interactions.",
        "recommendation": "Consider adding a second factor (SMS OTP, email verification, or biometric) for all account access, not just contact updates."
      },
      {
        "standard": "OCC Heightened Standards (12 CFR Part 30, Appendix D)",
        "requirement": "Controls should be formally approved, documented, and regularly reviewed",
        "control_alignment": "PARTIAL",
        "assessment": "The control is documented in iGrafx (good) but the current version is UNAPPROVED (bad). Version history shows active maintenance but with a single author and no independent review evidence.",
        "gap": "Approval workflow not operating for current version. No independent review.",
        "recommendation": "Implement dual-approval requirement. Complete v0.0.7 review and approval."
      },
      {
        "standard": "NIST SP 800-63B (Digital Identity Guidelines — Authentication)",
        "requirement": "Authentication Assurance Level 1 (AAL1) minimum for financial services",
        "control_alignment": "MEETS AAL1",
        "assessment": "Knowledge-based authentication with PII items meets AAL1 (single-factor). For AAL2 (multi-factor), a second factor would be needed. The OTP subprocess provides AAL2 but only for the contact update path.",
        "gap": "General verification meets AAL1 only. Industry and regulatory expectations are moving toward AAL2 for all financial account access.",
        "recommendation": "Roadmap to AAL2 for all account-specific interactions within 12 months."
      },
      {
        "standard": "PCI DSS v4.0 Requirement 3",
        "requirement": "Protect stored cardholder data; minimize card data exposure",
        "control_alignment": "CONCERN",
        "assessment": "Supplemental PII item #6 includes 'Full ATM/Debit card number with expiration.' If CSRs verbally collect and record full card numbers, this creates PCI scope for the call center, potentially including call recording systems.",
        "gap": "Full card number collection during verification may create unintended PCI scope.",
        "recommendation": "Replace full card number with 'last 4 digits of card number' in the supplemental item list. Review call recording retention and PCI masking policies."
      }
    ]
  }
}
```

---

## 6.5 TOD Conclusion Output

```json
{
  "tod_conclusion": {
    "test_run_id": "TOD-2026-Q4-001",
    "control_id": "CTL-CC-385650",
    "rating": "NEEDS IMPROVEMENT",
    "rating_explanation": "The control design achieves its primary objective (customer identity verification) but has four design gaps that create latent risk. Two gaps are HIGH severity (absent risk assessment, no escalation on failed security word). The control is functional today but vulnerable to future failures, particularly from social engineering vectors that exploit the after-hours supplemental-item pathway and the lack of failed-attempt tracking.",
    "overall_score": 0.64,
    "design_gaps_count": 4,
    "design_gaps_by_severity": { "HIGH": 2, "MEDIUM": 2 },
    "coso_component_scores": {
      "control_environment": 0.82,
      "risk_assessment": 0.58,
      "control_activities": 0.75,
      "information_communication": 0.55,
      "monitoring_activities": 0.50
    },
    "toe_cross_references": {
      "toe_exceptions_explained_by_design_gaps": 3,
      "detail": [
        "EXC-001 (security word bypass) ← explained by GAP-002 (no escalation path)",
        "EXC-004 (hint inconsistency) ← explained by GAP-002 (annotation-based policy)",
        "ANOM-001/002 (behavioral patterns) ← explained by GAP-004 (no embedded monitoring)"
      ]
    },
    "remediation_timeline": {
      "P1_items": "2 items, target completion: 30-60 days",
      "P2_items": "2 items, target completion: 90 days",
      "total_remediation_cost_estimate": "Low — primarily process documentation and system configuration changes"
    },
    "time_metrics": {
      "agent_processing_time_minutes": 8.7,
      "manual_equivalent_hours": 3.5,
      "net_time_savings_percent": 95.9
    },
    "handoff_to": "agent-4",
    "handoff_payload": "TOD results + COSO assessment + gap analysis + remediation recommendations + regulatory benchmarks"
  }
}
```

**Narration:** *"Agent 3's verdict: NEEDS IMPROVEMENT. The control is designed well enough to work today — as Agent 2 confirmed with a 96.6% pass rate — but it has four design gaps that create latent risk. The most important finding: Agent 2's security word bypass exception is directly explained by Agent 3's Gap 2 — there's no escalation path in the design. This is the power of having both TOE and TOD: Agent 2 tells you what went wrong; Agent 3 tells you why the design allowed it to go wrong."*

---

## 6.6 Agent 3 Summary: Demo Checklist

| RFP Criterion | Demonstrated? | Demo Timestamp | Key Evidence |
|--------------|---------------|----------------|--------------|
| COSO framework mapping | ✓ | 0:42–0:45 | 5-component matrix with scores and principles |
| Gap analysis with regulatory references | ✓ | 0:45–0:48 | 4 gaps, each with OCC/FFIEC/COSO/NIST citations |
| Remediation recommendations | ✓ | 0:48–0:50 | Priority-ordered with timelines and owners |
| Benchmarking against industry standards | ✓ | 0:50–0:52 | FFIEC, OCC, NIST SP 800-63B, PCI DSS v4.0 |
| TOE-TOD cross-reference | ✓ | 0:48 | 3 TOE exceptions directly explained by TOD gaps |
| Design rating with narrative | ✓ | 0:52 | NEEDS IMPROVEMENT, 0.64 overall score |

---

*← Back to `05-Agent-2-Test-of-Effectiveness.md` | Next: `07-Agent-4-Supervisory-Agent.md` →*
