# 05 — Agent 2: Test of Effectiveness (TOE) Agent

*← Back to `04-Agent-1-Documentation-Retrieval.md` | Next: `06-Agent-3-Test-of-Design.md` →*

---

> **RFP Requirement (Section III.B.ii — Agent 2):** The RFP defines the following criteria for the Test of Effectiveness Agent. Agent 2's mission: determine whether the control, as operated, is achieving its intended objective.

---

## 5.1 RFP Criteria Mapping

### Criterion 1: "Statistical sampling methodologies — stratified, matched pair, outlier detection"

**How We Demonstrate It:**

Agent 2 implements multiple sampling strategies, selected automatically based on the control's characteristics:

#### Strategy Selection Logic

```
IF control_type = "Preventive" AND population_size > 1000:
    primary_method = "Stratified Random Sampling"
    secondary_method = "Outlier Detection (ML-based)"
ELIF control_type = "Detective" AND population_size > 1000:
    primary_method = "Matched Pair Sampling"
    secondary_method = "Time-Series Anomaly Detection"
ELIF population_size <= 1000:
    primary_method = "Census (100% review)"
    secondary_method = null
```

For CTL-CC-385650 (Preventive, population = 65,000):
- **Primary:** Stratified Random Sampling
- **Secondary:** Outlier Detection (unsupervised ML)

#### Stratified Random Sampling — Detailed Implementation

**Population Analysis:**

```json
{
  "population": {
    "total_records": 65000,
    "period": "Q4-2025 (October 1 – December 31)",
    "source": "call_dispositions table via ODBC",
    "query_timestamp": "2026-02-04T09:15:10.000Z",
    "population_breakdown": {
      "track_a_no_security_word": {
        "count": 39000,
        "percentage": 60.0,
        "description": "Customers without a security word on file — required 4 PII items"
      },
      "track_b_security_word": {
        "count": 26000,
        "percentage": 40.0,
        "description": "Customers with security word on file — required security word + 2 PII items"
      }
    },
    "additional_stratification_dimensions": {
      "by_channel": {
        "phone": 52000,
        "chat": 8500,
        "in_person": 4500
      },
      "by_time_of_day": {
        "business_hours_8am_6pm": 55250,
        "after_hours_6pm_8am": 9750
      },
      "by_csr": {
        "unique_csrs": 187,
        "avg_calls_per_csr": 347.6,
        "max_calls_single_csr": 892,
        "min_calls_single_csr": 42
      }
    }
  }
}
```

**Sample Size Calculation:**

```
Cochran's Formula: n₀ = (z² × p × q) / e²

Where:
  z = 1.96 (95% confidence level)
  p = 0.03 (expected exception rate — conservative estimate based on industry benchmarks)
  q = 1 - p = 0.97
  e = 0.025 (2.5% margin of error — tighter than standard 5% for regulatory testing)

n₀ = (1.96² × 0.03 × 0.97) / 0.025²
n₀ = (3.8416 × 0.0291) / 0.000625
n₀ = 0.1119 / 0.000625
n₀ = 179.0

Finite Population Correction: n = n₀ / (1 + (n₀ - 1) / N)
n = 179 / (1 + 178 / 65000)
n = 179 / 1.00274
n = 178.5 → round up to 179

With stratification overhead (proportional allocation + minimum stratum size of 30):
  Track A stratum: max(30, round(179 × 0.60)) = max(30, 107) = 107
  Track B stratum: max(30, round(179 × 0.40)) = max(30, 72) = 72
  Channel sub-stratification adjustment: +28 (to ensure each channel has ≥20 samples)
  Total adjusted sample: 207

Agent 2 rounds up to 385 (doubling for statistical power and to allow for incomplete records):
  Track A: 231 records
  Track B: 154 records
```

**Narration:** *"Agent 2 calculated a sample of 385 from 65,000 calls. It used Cochran's formula with a 95% confidence level and a tighter 2.5% margin of error — half the standard 5% — because this is a high-risk authentication control. It then stratified by verification track to ensure both Track A and Track B are proportionally represented. The sample size is documented with the full formula so any auditor can reproduce the calculation."*

#### Matched-Pair Sampling (Shown as Capability)

While not used for this specific control, the presenter briefly explains:

> *"For detective controls — like transaction monitoring — Agent 2 uses matched-pair sampling. It pairs each flagged transaction with a similar unflagged transaction (matched on amount, time, account type) and tests whether the control correctly distinguished between them. This is particularly valuable for BSA/AML testing."*

#### Outlier Detection (ML-Based) — Full-Sample Analysis

Agent 2 runs unsupervised ML across the entire 65,000-record population in parallel with the stratified sampling:

```json
{
  "anomaly_detection": {
    "method": "Isolation Forest + DBSCAN clustering",
    "input_features": [
      "csr_id",
      "time_of_day",
      "verification_track",
      "pii_items_count",
      "pii_items_from_approved_list",
      "security_word_attempts",
      "call_duration_seconds",
      "contact_update_requested",
      "otp_triggered",
      "outcome (verified/partial/denied)"
    ],
    "training": "Self-supervised on the Q4 2025 population (no labeled anomalies needed)",
    "results": {
      "total_anomalies_detected": 4,
      "anomaly_clusters": [
        {
          "cluster_id": "ANOM-001",
          "type": "CSR Behavioral Pattern",
          "description": "CSR #C-1147 has 12 calls where customer was marked 'partially verified' but then received full account access",
          "z_score": 3.2,
          "severity": "HIGH",
          "records_affected": 12,
          "detail": "Statistical analysis: Average partial-verification rate across all CSRs is 4.2%. CSR C-1147's rate is 14.1% — 3.2 standard deviations above mean. Furthermore, 10 of 12 partial-verification calls resulted in account balance inquiries, which typically require full verification.",
          "potential_concern": "Possible verification bypass — CSR may be granting access without completing full verification procedure",
          "recommended_action": "Escalate to CSR manager for targeted review of C-1147's call recordings"
        },
        {
          "cluster_id": "ANOM-002",
          "type": "Temporal Pattern",
          "description": "8 calls between 11 PM and 2 AM using supplemental PII items exclusively (no standard items)",
          "z_score": 2.8,
          "severity": "MEDIUM",
          "records_affected": 8,
          "detail": "After-hours calls (11 PM–2 AM) represent 0.08% of total volume but account for 22% of supplemental-only verification attempts. Supplemental items (card number, account number, balance) are easier to obtain through social engineering than standard items (DOB, SSN, mother's maiden name).",
          "potential_concern": "After-hours social engineering attempts using easily-obtainable account data",
          "recommended_action": "Flag for fraud investigation team review"
        },
        {
          "cluster_id": "ANOM-003",
          "type": "Data Quality",
          "description": "23 records with missing or null verification item fields",
          "z_score": 1.9,
          "severity": "LOW",
          "records_affected": 23,
          "detail": "0.035% of records have incomplete data. Likely data entry errors rather than control failures. However, incomplete records cannot be tested and reduce the effective sample.",
          "recommended_action": "Include in exception report as data quality observation. Investigate root cause (system issue vs. CSR omission)."
        },
        {
          "cluster_id": "ANOM-004",
          "type": "Volume Pattern",
          "description": "December 23-27 shows 40% drop in verification completion rate",
          "z_score": 2.1,
          "severity": "MEDIUM",
          "records_affected": 340,
          "detail": "Holiday period shows significantly lower completion rates. May indicate skeleton staffing leading to abbreviated verification, or seasonal call patterns (e.g., gift card inquiries that don't require full verification).",
          "recommended_action": "Investigate whether the drop is legitimate (call type mix) or a control weakness (abbreviated verification under volume pressure)."
        }
      ]
    }
  }
}
```

**Narration:** *"While the statistical sampling tests a representative subset, the ML anomaly detection scans the entire population. It found four patterns that no manual reviewer would catch in a reasonable timeframe. The most concerning is CSR C-1147 — 12 calls where partial verification was recorded but full account access was granted. That's a 3.2-sigma outlier. A traditional quarterly test samples 25-50 calls. The probability of catching a specific CSR's 12 anomalous calls in a 25-call sample from 65,000 is effectively zero. This is why ML-augmented testing changes the game."*

---

### Criterion 2: "Pre-built and customizable test scripts per regulatory domain"

**How We Demonstrate It:**

Agent 2 maintains a script library organized by regulatory domain and control type:

```
SCRIPT LIBRARY
├── Authentication Controls
│   ├── CTL-AUTH-VERIFY-PII ← ACTIVE (used for this demo)
│   ├── CTL-AUTH-VERIFY-OTP
│   ├── CTL-AUTH-VERIFY-MFA
│   └── CTL-AUTH-VERIFY-BIOMETRIC
├── BSA/AML Controls
│   ├── CTL-BSA-SAR-FILING
│   ├── CTL-BSA-CTR-THRESHOLD
│   ├── CTL-BSA-KYC-CDD
│   └── CTL-BSA-EDD-HIGH-RISK
├── Fair Lending Controls
│   ├── CTL-FAIR-HMDA-DATA
│   ├── CTL-FAIR-ECOA-PRICING
│   └── CTL-FAIR-REDLINING
├── FINRA Controls
│   ├── CTL-FINRA-3110-SUPERVISION
│   ├── CTL-FINRA-2111-SUITABILITY
│   ├── CTL-FINRA-2090-KYC
│   └── CTL-FINRA-REG-BI
└── Consumer Compliance
    ├── CTL-TILA-DISCLOSURES
    ├── CTL-RESPA-SERVICING
    └── CTL-UDAAP-COMPLAINTS
```

**Active Script Detail — CTL-AUTH-VERIFY-PII:**

```yaml
script_id: CTL-AUTH-VERIFY-PII
version: 2.1
description: "Tests the effectiveness of PII-based customer verification processes"
applicable_controls:
  - CTL-CC-385650
  - CTL-CC-385651 (variant for online banking)
  - CTL-CC-385652 (variant for mobile banking)

test_scenarios:
  - scenario_id: TOE-S1
    name: "Track B Compliance"
    description: "Verify that calls with security words follow the Track B procedure"
    population_filter: "security_word_present = TRUE"
    test_steps:
      - step: 1
        action: "Verify security word was collected"
        field: "security_word_collected"
        expected: true
        exception_if: "security_word_collected = false AND security_word_present = true"
        exception_severity: "CRITICAL"
        exception_label: "Security word bypass — customer had a security word but it was not used"
      - step: 2
        action: "Verify security word validation result"
        field: "security_word_valid"
        expected: true
        exception_if: "security_word_valid = false AND verification_outcome = 'FULLY_VERIFIED'"
        exception_severity: "CRITICAL"
        exception_label: "Invalid security word accepted — customer verified despite wrong security word"
      - step: 3
        action: "Verify 2 PII items collected from approved list"
        field: "pii_items_collected"
        expected: "count >= 2 AND all items IN approved_list"
        exception_if: "count < 2 OR any item NOT IN approved_list"
        exception_severity: "HIGH"
        exception_label: "Insufficient or non-approved PII items in Track B"
      - step: 4
        action: "Verify verification outcome consistency"
        field: "verification_outcome"
        expected: "FULLY_VERIFIED if all steps pass, PARTIAL or DENIED otherwise"
        exception_if: "verification_outcome = 'FULLY_VERIFIED' AND (step_1.exception OR step_2.exception OR step_3.exception)"
        exception_severity: "CRITICAL"
        exception_label: "Verification outcome inconsistent with verification steps"

  - scenario_id: TOE-S2
    name: "Track A Compliance"
    description: "Verify that calls without security words follow the Track A procedure"
    population_filter: "security_word_present = FALSE OR security_word_valid = FALSE"
    test_steps:
      - step: 1
        action: "Verify 4 PII items collected"
        field: "pii_items_collected"
        expected: "count >= 4"
        exception_if: "count < 4"
        exception_severity: "HIGH"
        exception_label: "Insufficient PII items in Track A (required: 4, found: {count})"
      - step: 2
        action: "Verify all PII items from approved list"
        field: "pii_items_collected"
        expected: "all items IN standard_pii_list UNION supplemental_pii_list"
        exception_if: "any item NOT IN approved list"
        exception_severity: "HIGH"
        exception_label: "Non-approved PII item used: {item}"
      - step: 3
        action: "Verify all answers correct"
        field: "all_answers_correct"
        expected: true
        exception_if: "all_answers_correct = false AND verification_outcome = 'FULLY_VERIFIED'"
        exception_severity: "CRITICAL"
        exception_label: "Incorrect answers but customer marked fully verified"
      - step: 4
        action: "Verify outcome consistency"
        field: "verification_outcome"
        expected: "Consistent with step results"
        exception_if: "Mismatch detected"
        exception_severity: "CRITICAL"

  - scenario_id: TOE-S3
    name: "Anomaly Detection (Full Population)"
    description: "ML-based anomaly detection across the entire population"
    population_filter: null  # Full population
    test_steps:
      - step: 1
        action: "Run Isolation Forest on feature matrix"
        parameters:
          contamination: 0.01
          n_estimators: 200
          random_state: 42
      - step: 2
        action: "Run DBSCAN clustering on Isolation Forest anomaly scores"
        parameters:
          eps: 0.5
          min_samples: 3
      - step: 3
        action: "For each cluster, compute z-scores and generate narrative"
      - step: 4
        action: "Cross-reference anomalies with sampled exceptions for correlation"

customization_points:
  - "approved_pii_list: Can be modified by Axos to add/remove items"
  - "exception_severity_thresholds: Adjustable per organizational risk appetite"
  - "anomaly_detection_contamination: Adjustable sensitivity (default 1%)"
  - "sampling_confidence_level: Adjustable (default 95%)"
  - "sampling_margin_of_error: Adjustable (default 2.5%)"
```

**Narration:** *"This test script is pre-built for PII verification controls, but every parameter is customizable. If Axos decides to change the approved PII list — say, removing Mother's Maiden Name — an analyst can update the script without touching code. If the risk team wants 99% confidence instead of 95%, they change one parameter. The script is versioned and audited, just like the control itself."*

---

### Criterion 3: "Anomaly detection using unsupervised ML"

Covered in detail in Section 5.1, Criterion 1 (Outlier Detection above). The key points for the presenter:

- Isolation Forest + DBSCAN (dual-algorithm approach for robustness)
- No labeled training data required (self-supervised on the test period data)
- 4 anomaly clusters detected in the demo data
- The CSR behavioral pattern (ANOM-001) is the demo's "wow moment" for Agent 2

---

### Criterion 4: "Exception identification, categorization, and severity assessment"

**How We Demonstrate It:**

Agent 2 produces a structured exception register:

```json
{
  "exception_register": {
    "test_run_id": "TOE-2026-Q4-001",
    "control_id": "CTL-CC-385650",
    "total_exceptions": 13,
    "exceptions_by_severity": {
      "CRITICAL": 2,
      "HIGH": 5,
      "MEDIUM": 4,
      "ML_OBSERVATION": 2
    },
    "exceptions": [
      {
        "exception_id": "EXC-001",
        "scenario": "TOE-S1 (Track B)",
        "severity": "CRITICAL",
        "title": "Security Word Bypass",
        "description": "2 sampled calls where customer had security word on file, security word was not collected, and customer was marked fully verified using Track A procedure (4 PII items). While the customer was technically verified via Track A, the process design requires Track B when a security word exists.",
        "records_affected": 2,
        "sample_record_ids": ["CALL-Q4-044721", "CALL-Q4-051903"],
        "root_cause_hypothesis": "CSR may have bypassed security word step due to customer impatience or system prompt error",
        "regulatory_impact": "OCC Heightened Standards — control not operating as designed",
        "remediation_suggestion": "System prompt should enforce Track B when security word is on file — CSR should not be able to proceed to Track A without documenting why"
      },
      {
        "exception_id": "EXC-002",
        "scenario": "TOE-S2 (Track A)",
        "severity": "HIGH",
        "title": "Insufficient PII Items",
        "description": "5 sampled calls where fewer than 4 PII items were collected but customer was marked fully verified. Breakdown: 3 calls with 3 items, 2 calls with 2 items.",
        "records_affected": 5,
        "sample_record_ids": ["CALL-Q4-012847", "CALL-Q4-023156", "CALL-Q4-034982", "CALL-Q4-045671", "CALL-Q4-056293"],
        "root_cause_hypothesis": "CSR may be accepting fewer items for repeat/known callers (an informal practice not documented in the process)",
        "regulatory_impact": "FFIEC Authentication Guidance — authentication strength below documented minimum",
        "remediation_suggestion": "Enforce minimum item count in the call system UI — prevent CSR from marking 'verified' without meeting minimum threshold"
      },
      {
        "exception_id": "EXC-003",
        "scenario": "TOE-S2 (Track A)",
        "severity": "HIGH",
        "title": "Non-Approved PII Item Used",
        "description": "2 sampled calls where PII items not on the approved list were used for verification. Items used: 'employer name' (not on list) and 'account opening branch' (not on list).",
        "records_affected": 2,
        "sample_record_ids": ["CALL-Q4-063815", "CALL-Q4-071249"],
        "root_cause_hypothesis": "CSR improvising verification questions — indicates training gap or unclear documentation",
        "regulatory_impact": "OCC Heightened Standards — control not operating within documented parameters",
        "remediation_suggestion": "Display approved item list prominently in CSR UI; system should only accept items from the approved dropdown"
      },
      {
        "exception_id": "EXC-004",
        "scenario": "TOE-S1 (Track B)",
        "severity": "MEDIUM",
        "title": "Security Word Hint Inconsistency",
        "description": "4 Track B calls where security word hints were provided (per the annotation policy) but the hint text exceeded what would be considered a 'hint' — in 2 cases, the hint was essentially the full security word minus one character.",
        "records_affected": 4,
        "sample_record_ids": ["CALL-Q4-018234", "CALL-Q4-029567", "CALL-Q4-037891", "CALL-Q4-048123"],
        "root_cause_hypothesis": "The hint policy is documented as an annotation (not a formal step) — no clear definition of what constitutes an acceptable hint",
        "regulatory_impact": "Moderate — weakens the security word control but does not eliminate it",
        "remediation_suggestion": "Formalize the hint policy as a process step with clear guidelines (e.g., 'hint may describe the category of the word but not the word itself')"
      },
      {
        "exception_id": "EXC-005",
        "scenario": "TOE-S3 (Anomaly)",
        "severity": "ML_OBSERVATION",
        "title": "CSR Behavioral Pattern — Elevated Partial Verification Rate",
        "description": "CSR C-1147 shows a statistically significant deviation in partial verification behavior (z-score: 3.2). 12 calls marked 'partially verified' but granted full account access (balance inquiries, transaction details).",
        "records_affected": 12,
        "z_score": 3.2,
        "root_cause_hypothesis": "Possible intentional bypass or misunderstanding of 'limited assistance' scope",
        "regulatory_impact": "HIGH if confirmed — could constitute a systemic control bypass by a single actor",
        "remediation_suggestion": "Immediate supervisory review of CSR C-1147's call recordings; system should enforce limited-assistance boundaries programmatically"
      },
      {
        "exception_id": "EXC-006",
        "scenario": "TOE-S3 (Anomaly)",
        "severity": "ML_OBSERVATION",
        "title": "After-Hours Supplemental-Only Verification Cluster",
        "description": "8 calls between 11 PM and 2 AM used exclusively supplemental PII items (card number, account number, balance). No standard items (DOB, SSN, MMN) were collected.",
        "records_affected": 8,
        "z_score": 2.8,
        "root_cause_hypothesis": "Possible social engineering targeting after-hours staff with less supervision. Supplemental items are obtainable from physical cards and statements.",
        "regulatory_impact": "Fraud risk — supplemental-only verification is weaker than standard-item verification",
        "remediation_suggestion": "Require at least 1 standard PII item in every verification regardless of track; flag supplemental-only verifications for supervisor review"
      }
    ]
  }
}
```

---

## 5.2 TOE Conclusion Output

After all scenarios complete, Agent 2 produces the formal TOE conclusion:

```json
{
  "toe_conclusion": {
    "test_run_id": "TOE-2026-Q4-001",
    "control_id": "CTL-CC-385650",
    "verdict": "QUALIFIED",
    "verdict_explanation": "The control is operating and generally effective (96.6% compliance rate), but with 13 exceptions including 2 critical items (security word bypass) and 2 ML observations suggesting potential systemic issues. The control meets its primary objective (preventing unauthorized access) in the vast majority of cases, but weaknesses exist in edge cases.",
    "confidence_score": 0.873,
    "statistics": {
      "total_population": 65000,
      "sample_size": 385,
      "sample_compliance_rate": 0.966,
      "projected_population_exceptions": {
        "point_estimate": 2210,
        "confidence_interval_95": [1430, 3190],
        "note": "Projected from sample to full population using stratified sampling weights"
      },
      "track_a_compliance_rate": 0.965,
      "track_b_compliance_rate": 0.968,
      "ml_anomalies_detected": 4,
      "ml_records_flagged": 43
    },
    "time_metrics": {
      "agent_processing_time_minutes": 12.4,
      "manual_equivalent_hours": 4.5,
      "net_time_savings_percent": 95.4,
      "records_per_minute": 5242
    },
    "evidence_sufficiency": {
      "score": 0.96,
      "incomplete_records": 23,
      "action_taken": "23 records excluded from sample due to data quality issues. Replacement records drawn from same stratum. Data quality observation logged (ANOM-003)."
    },
    "handoff_to": "agent-3",
    "handoff_payload": "TOE results + evidence package + exception register + ML anomaly report"
  }
}
```

**Narration:** *"Agent 2's verdict: QUALIFIED — meaning the control works, but with caveats. 96.6% compliance is good, but the 2 critical security word bypasses and the CSR behavioral pattern are significant. A traditional test that samples 25 calls would almost certainly have missed these. Agent 2 tested 385 samples AND scanned 65,000 records with ML — in 12 minutes. The manual equivalent would be 4-5 hours for a fraction of the coverage."*

**Performance Guarantee Check:**
- Net time savings: 95.4% (exceeds 75% SLA guarantee)
- Volume processed: 65,000 records (well beyond what's manually feasible — this demonstrates the "5× volume increase" guarantee)

---

*← Back to `04-Agent-1-Documentation-Retrieval.md` | Next: `06-Agent-3-Test-of-Design.md` →*
