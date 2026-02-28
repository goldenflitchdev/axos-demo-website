# 02 — Process Map Deep-Dive: Customer Verification — Personal Identifying Information

*← Back to `01-Architecture-Overview.md` | Next: `03-Section-A-Process-Ingestion.md` →*

---

## 2.1 Document Metadata (Extracted by Agent 1)

| Field | Value |
|-------|-------|
| **Control ID** | CTL-CC-385650 |
| **Process Name** | Customer Verification – Personal Identifying Information |
| **Document Title** | Customer Verification - Personal Identifying Information 127933 |
| **Source System** | iGrafx Process Management Platform |
| **Diagram Version** | v0.0.7 |
| **Approval Status** | UNAPPROVED |
| **Last Modified** | November 19, 2025, 7:57:39 PM |
| **Modified By** | Jhun Pratt Carag |
| **Process Owner** | Customer Service Division |
| **Control Type** | Preventive (Authentication) |
| **Testing Frequency** | Quarterly |
| **Risk Domain** | Operational Risk → Customer Authentication |
| **Regulatory Drivers** | OCC Heightened Standards, FFIEC Authentication Guidance, Reg E (unauthorized access), GLBA/Reg P (customer privacy), UDAAP (unfair practices) |
| **Subprocess References** | Customer Verification – One-time Passcode (separate process, linked) |

---

## 2.2 Complete Shape Inventory

Agent 1's structural parser identifies every shape in the iGrafx process diagram. The Customer Verification PII process contains **19 shapes** organized across **2 swim lanes**:

### Swim Lanes

| Lane | Actor | Description |
|------|-------|-------------|
| **Lane 1** | Customer | The person calling in or interacting with the bank. Passive participant — responds to CSR prompts. |
| **Lane 2** | Customer Service Representative (CSR) | The bank employee conducting the verification. Active participant — drives the workflow, makes decisions, records outcomes. |

### Shape-by-Shape Inventory

| Shape # | Type | Swim Lane | Content | Agent Significance |
|---------|------|-----------|---------|-------------------|
| 1 | Start (Circle) | Customer | Customer initiates contact (call, chat, or in-person) | **Agent 2 sampling anchor:** Each record in the test population begins with this trigger event |
| 2 | Decision (Diamond) | CSR | "Does customer need account-specific information or assistance?" | **Agent 3 design check:** This is the gatekeeping decision — if NO, verification may be bypassed. Agent 3 checks: Is the "NO" path adequately defined? What happens when customers don't need account-specific help but still interact? |
| 3 | Process (Rectangle) | CSR | Proceed without full verification (non-account-specific request) | **Agent 3 gap:** What constitutes "non-account-specific"? The process map doesn't define the boundary, creating ambiguity that Agent 3 will flag as a design weakness |
| 4 | Decision (Diamond) | CSR | "Is there a security word on file?" | **Agent 2 stratification point:** This decision splits the population into Track A (no security word) and Track B (security word present). Agent 2 uses this to create stratified samples |
| 5 | Decision (Diamond) | CSR | "Is the security word valid?" | **Agent 2 test point:** If customer provides incorrect security word, what happens? The process map routes to Track A (4 PII items). Agent 2 tests: Are failed security word attempts logged? |
| 6 | Process (Rectangle) | CSR | Collect security word + 2 PII items from approved list (Track B) | **Agent 2 core test:** For Track B calls, Agent 2 verifies: (a) Security word was collected, (b) exactly 2 additional PII items were collected, (c) both PII items are from the approved list |
| 7 | Process (Rectangle) | CSR | Collect 4 PII items from approved list (Track A) | **Agent 2 core test:** For Track A calls, Agent 2 verifies: (a) exactly 4 PII items were collected, (b) all 4 are from the approved list (standard or supplemental) |
| 8 | Decision (Diamond) | CSR | "Did the customer answer all verification questions correctly, without errors?" | **Agent 2 critical test point:** This is the PASS/FAIL gate. Agent 2 checks: (a) Was this decision properly recorded? (b) What happens on partial correct (3 of 4)? The process doesn't define partial pass behavior — another gap for Agent 3 |
| 9 | Process (Rectangle) | CSR | Customer is fully verified | **Agent 2 success path terminus.** Agent 2 counts these as compliant records |
| 10 | Decision (Diamond) | CSR | "Does the customer need to update contact information?" | **Agent 2 OTP routing check:** If YES, the process routes to OTP subprocess. Agent 2 verifies: Were contact update requests properly routed to OTP? |
| 11 | Subprocess (Rectangle w/ borders) | CSR | "Customer Verification – One-time Passcode" subprocess reference | **Agent 1 completeness trigger:** This shape tells Agent 1 that a secondary document (the OTP process) must be retrieved for evidence completeness. **Agent 3 design check:** Is the OTP handoff bidirectional? What happens if OTP fails — does the customer return to this process? |
| 12 | Decision (Diamond) | CSR | "Is the customer fully verified?" (post-OTP) | **Agent 2 verification point:** After OTP, is the customer marked as fully verified? Agent 2 checks for records where OTP was triggered but verification status is still incomplete |
| 13 | Decision (Diamond) | CSR | "Is the customer partially verified?" (first instance) | **Agent 2 partial verification test:** What does "partial" mean? The process allows CSRs to proceed with limited assistance if partially verified. Agent 2 tests: Are partially verified customers receiving only the limited service scope defined? |
| 14 | Process (Rectangle) | CSR | Provide limited assistance (partial verification) | **Agent 3 design check:** What constitutes "limited assistance"? The process map doesn't define boundaries. Agent 3 flags this as a design gap — without clear limits, CSRs may inadvertently provide account-specific information to insufficiently verified callers |
| 15 | Decision (Diamond) | CSR | "Is the customer partially verified?" (second instance, different path) | **Agent 3 design check:** Why does this decision appear twice? Agent 3 analyzes: Are the two instances contextually different (one post-Track A, one post-OTP)? If identical, this is a design redundancy that could confuse CSRs |
| 16 | Process (Rectangle) | CSR | Deny service / Request alternative verification | **Agent 2 denial tracking:** Agent 2 checks: How many customers were denied? Are denial rates consistent across CSRs? A CSR with 0% denial rate may be bypassing verification |
| 17 | Process (Rectangle) | CSR | Record call outcome and close | **Agent 2 data completeness:** Agent 2 verifies every sample record has a completion entry. Missing completion entries indicate potential data quality issues |
| 18 | End (Circle) | Customer | Customer interaction complete | Terminal state |
| 19 | Annotation (Note) | N/A | Security word hint policy: "CSR may provide a hint for the security word if customer requests" | **Agent 3 critical finding:** The hint policy is documented as an annotation, not a formal process step. This means: (a) It's not tracked in call disposition data, (b) CSRs may not consistently apply it, (c) It weakens the security word control. Agent 3 will flag this as a design gap with regulatory implications |

---

## 2.3 Verification Item Pools (Referenced in Shapes 6 & 7)

### Standard PII Items

These are the primary verification items available to CSRs:

| # | Item | Data Source | Sensitivity | Agent 2 Testable |
|---|------|-------------|-------------|------------------|
| 1 | Primary email address on file | CRM / Core Banking | Medium | YES — verify email in CRM matches what CSR recorded |
| 2 | Date of birth as notated on file | Core Banking | High (PII) | YES — verify DOB match |
| 3 | Social Security Number / Last 4 SSN | Core Banking | Critical (PII) | YES — verify SSN/last-4 usage pattern (full SSN should be discouraged, last-4 preferred) |
| 4 | Mother's Maiden Name | Core Banking | High (PII) | YES — verify collection. **Agent 3 note:** MMN is increasingly deprecated as a security question due to social engineering vulnerability |
| 5 | Primary physical address (including apt/unit) | CRM / Core Banking | Medium | YES — verify address match. Agent 2 checks: Partial matches (street but not apt) — are they counted as valid? |

### Supplemental PII Items

Used when standard items are insufficient or for enhanced verification:

| # | Item | Data Source | Sensitivity | Agent 2 Testable |
|---|------|-------------|-------------|------------------|
| 6 | Full ATM/Debit card number with expiration | Card Management | Critical (PCI) | YES — verify card data. **PCI Compliance Note:** Agent 2 must check that full card numbers are not stored in call disposition records (PCI DSS requirement) |
| 7 | Full account number | Core Banking | High | YES — verify account number match |
| 8 | Year account was opened | Core Banking | Low | YES — verify year accuracy |
| 9 | Approximate account balance (within 10% variance) | Core Banking | High | YES — verify balance within 10% tolerance. Agent 2 calculates: ABS(stated_balance - actual_balance) / actual_balance ≤ 0.10 |
| 10 | Name of beneficiary | Trust/Account Records | Medium | YES — verify beneficiary name match |

---

## 2.4 Version History Analysis

Agent 1 extracts the complete version history from the document. This is critical for Agent 3's design assessment because it reveals the control's maturity and governance cadence:

| Version | Date | Author | Status | Key Changes | Agent 3 Observations |
|---------|------|--------|--------|-------------|---------------------|
| v0.0.1 | January 21, 2025 | Jhun Pratt Carag | APPROVED (Jhun Pratt Carag) | Initial creation | Process originated in Q1 2025 — relatively new control |
| v0.0.2 | January 22, 2025 | Jhun Pratt Carag | APPROVED (Jhun Pratt Carag) | Day-1 revision — likely formatting or minor edits | Rapid iteration suggests initial design was being refined collaboratively |
| v0.0.3 | January 28, 2025 | Jhun Pratt Carag | APPROVED (Jhun Pratt Carag) | 6-day revision | Stabilizing the design |
| v0.0.4 | February 4, 2025 | Jhun Pratt Carag | APPROVED (Jhun Pratt Carag) | ~1 week later | Continued refinement |
| v0.0.5 | February 5, 2025 | Jhun Pratt Carag | APPROVED (Jhun Pratt Carag) | Day-after revision | Minor adjustments |
| v0.0.6 | February 18, 2025 | Jhun Pratt Carag | APPROVED (Jhun Pratt Carag) | ~2 weeks later — last approved version | **This is the last approved baseline.** All testing before Nov 2025 should reference this version. |
| v0.0.7 | November 19, 2025 | Jhun Pratt Carag | **UNAPPROVED** | **9-month gap** since v0.0.6 | **Critical Agent 3 finding:** (1) 9-month gap between approved versions suggests the control was stable OR was not being maintained. (2) Current version is UNAPPROVED — the process running in production may not reflect the latest design intent. (3) Single author across all 7 versions — no evidence of independent review or segregation of duties in process design. |

### Agent 3 Governance Assessment from Version History

| Finding | Severity | Regulatory Reference |
|---------|----------|---------------------|
| Current production version (v0.0.7) is UNAPPROVED | **HIGH** | OCC Heightened Standards §30.5(b) — "Controls should be formally approved before implementation" |
| 9-month gap between v0.0.6 (approved) and v0.0.7 (unapproved) | **MEDIUM** | FFIEC IT Examination Handbook — "Process documentation should be reviewed and updated at least annually, or more frequently when changes occur" |
| Single author across all versions, no independent reviewer documented | **MEDIUM** | COSO Principle 3 — "Management establishes... structures, reporting lines, and appropriate authorities and responsibilities" — implies segregation of duties in control design |
| Version numbering suggests pre-release (0.0.x) — no v1.0 milestone | **LOW** | Informational — may indicate the process is still considered "draft" by the organization |

---

## 2.5 Process Flow Graph (Logical Model)

Agent 1 converts the visual iGrafx diagram into a formal directed graph for machine processing:

```
START → [Decision: Account-specific info needed?]
  ├── NO → [Proceed without verification] → END
  └── YES → [Decision: Security word on file?]
              ├── NO → [Collect 4 PII items] → (Track A)
              └── YES → [Decision: Security word valid?]
                          ├── NO → [Collect 4 PII items] → (Track A)
                          └── YES → [Collect security word + 2 PII] → (Track B)

(Track A) & (Track B) → [Decision: All answers correct?]
  ├── YES → [Customer fully verified]
  │          → [Decision: Contact update needed?]
  │             ├── NO → [Record & Close] → END
  │             └── YES → [OTP Subprocess]
  │                        → [Decision: Fully verified post-OTP?]
  │                           ├── YES → [Record & Close] → END
  │                           └── NO → (Partial Path)
  │
  └── NO → (Partial Path)

(Partial Path) → [Decision: Partially verified?]
  ├── YES → [Provide limited assistance] → [Record & Close] → END
  └── NO → [Deny service / Alternative verification] → [Record & Close] → END
```

### Graph Statistics (Agent 1 Output)

| Metric | Value |
|--------|-------|
| Total nodes | 19 |
| Decision nodes | 8 |
| Process nodes | 7 |
| Start/End nodes | 2 |
| Subprocess references | 1 |
| Annotations | 1 |
| Swim lanes | 2 |
| Possible paths through the process | 7 distinct end-to-end paths |
| Longest path (by node count) | 8 nodes (START → account-specific → security word → valid → collect → correct → contact update → OTP → fully verified → END) |
| Shortest path (by node count) | 3 nodes (START → not account-specific → proceed without verification → END) |
| Cyclomatic complexity | 9 (8 decision nodes + 1) — moderately complex, appropriate for an authentication workflow |

---

## 2.6 Why This Process Was Chosen for the Demo

This process is the ideal demonstration substrate for several reasons:

1. **Real Axos Process**: The evaluators know this process intimately. Every output the agents produce will be immediately recognizable and verifiable.

2. **Right Complexity Level**: With 19 shapes and 8 decision nodes, it's complex enough to demonstrate all four agents meaningfully, but simple enough to walk through in 20 minutes.

3. **Rich Testing Surface**: The two verification tracks (Track A and Track B) create natural stratification for Agent 2's sampling. The governance issues (UNAPPROVED status, single author, 9-month gap) provide immediate findings for Agent 3.

4. **Subprocess Dependency**: The OTP subprocess reference demonstrates Agent 1's evidence completeness checking — it must discover and retrieve a secondary document.

5. **Regulatory Breadth**: This single control touches OCC, FFIEC, Reg E, GLBA, PCI (through card data handling), and UDAAP — demonstrating the system's ability to map one control to multiple regulatory domains.

6. **Deliberate Imperfections**: The UNAPPROVED status, the annotation-based hint policy, the undefined "limited assistance" boundaries, and the duplicate decision diamond all provide natural findings that demonstrate the system's analytical depth without requiring contrived scenarios.

---

*← Back to `01-Architecture-Overview.md` | Next: `03-Section-A-Process-Ingestion.md` →*
