# 04 — Agent 1: Documentation Retrieval Agent

*← Back to `03-Section-A-Process-Ingestion.md` | Next: `05-Agent-2-Test-of-Effectiveness.md` →*

---

> **RFP Requirement (Section III.B.i — Agent 1):** The RFP defines the following bullet-point criteria for the Documentation Retrieval Agent. Each is addressed below with specific demo evidence.

---

## 4.1 RFP Criteria Mapping

### Criterion 1: "Secure API integration with document management systems"

**How We Demonstrate It:**

Agent 1 connects to document repositories using a secure, standards-based integration layer:

| Integration Target | Protocol | Authentication | Encryption | Demo Evidence |
|-------------------|----------|---------------|------------|---------------|
| iGrafx | OData REST API (HTTPS) | OAuth 2.0 Bearer Token | TLS 1.3 | Live API call visible in activity feed |
| RSA Archer | REST API v6 (HTTPS) | OAuth 2.0 + API Key | TLS 1.3 + mTLS | Archer handshake visible in audit log |
| SharePoint / OneDrive | Microsoft Graph API (HTTPS) | OAuth 2.0 (Azure AD) | TLS 1.3 | Supported but not demonstrated live (no SharePoint sandbox in demo) |
| Google Drive | Google Drive API v3 (HTTPS) | OAuth 2.0 (Service Account) | TLS 1.3 | Supported but not demonstrated live |
| Network File Shares | SFTP / SMB | SSH Key / Kerberos | SSH / SMB Encryption | SFTP file watcher demonstrated in Section A |
| Email Attachments | IMAP / MS Graph | OAuth 2.0 | TLS 1.3 | Supported — for emailed documents (e.g., auditor transmittals) |
| Axos Internal APIs | REST / SOAP | OAuth 2.0 / API Key / mTLS | TLS 1.3 | Connector framework supports custom endpoints |

**Demo Moment (0:22–0:24):**

The activity feed shows the authentication handshake:

```
[09:15:01.234] Agent 1 → Document Repository: OAuth2 token request
               ├── Client ID: agent-1-doc-retrieval
               ├── Scope: documents.read, metadata.read
               ├── Grant type: client_credentials
               └── Token endpoint: https://auth.axos.internal/oauth2/token

[09:15:01.456] Document Repository → Agent 1: Token granted
               ├── Token type: Bearer
               ├── Expires in: 3600 seconds
               ├── Scopes granted: documents.read, metadata.read
               └── Token fingerprint: sha256:f4a7...

[09:15:01.567] Agent 1 → iGrafx: mTLS handshake initiated
               ├── Client certificate: CN=agent-1.goldenflitch.axos.internal
               ├── Certificate chain: 3 certificates (agent → intermediate → Axos root CA)
               ├── TLS version: 1.3
               └── Cipher suite: TLS_AES_256_GCM_SHA384
```

**Narration:** *"Every connection Agent 1 makes is authenticated with OAuth 2.0 and encrypted with TLS 1.3. Notice the scope — documents.read and metadata.read. Agent 1 has read-only access. It cannot modify, delete, or create documents in any repository. This is the least-privilege principle at the agent level."*

---

### Criterion 2: "Automated discovery of relevant documents across multiple repositories"

**How We Demonstrate It:**

Agent 1 doesn't just retrieve documents it's told about — it actively discovers related documents. The discovery algorithm works in three stages:

**Stage 1: Primary Document Retrieval**
- Agent 4 passes the control ID (CTL-CC-385650) to Agent 1
- Agent 1 queries the Vector DB for documents semantically associated with this control
- Result: The PII verification process document (primary match, cosine similarity 0.97)

**Stage 2: Reference Resolution**
- Agent 1 parses the primary document and identifies all references to other documents:
  - Subprocess reference: "Customer Verification – One-time Passcode"
  - Policy references (if any): Authentication policy documents
  - Regulatory references: OCC Heightened Standards, FFIEC Authentication Guidance
- For each reference, Agent 1 queries:
  1. Vector DB (semantic similarity search)
  2. RSA Archer Control Library (control cross-references)
  3. Connected document repositories (keyword + metadata search)

**Stage 3: Evidence Completeness Assessment**
- Agent 1 evaluates whether the evidence package is sufficient for Agent 2 and Agent 3
- Assessment criteria:
  - Does the package include the process definition? ✓
  - Does it include all referenced subprocesses? (Check)
  - Does it include the governing policy? (Check)
  - Does it include prior test results (if available)? (Check)
  - Are there version conflicts (e.g., process v0.0.7 but policy references v0.0.6)? (Check)

**Demo Moment (0:24–0:26):**

```
[09:15:02.100] Agent 1: Initiating document discovery for CTL-CC-385650
               ├── Step 1: Query Vector DB — semantic search for "CTL-CC-385650"
               │   ├── Match 1: "Customer Verification – PII" (similarity: 0.97) ✓ PRIMARY
               │   ├── Match 2: "Customer Verification – OTP" (similarity: 0.89) ✓ SUBPROCESS
               │   └── Match 3: "Customer Authentication Policy" (similarity: 0.82) ✓ POLICY
               │
               ├── Step 2: Parse primary document for references
               │   ├── Found: Subprocess reference → "Customer Verification – One-time Passcode"
               │   ├── Cross-check: Match 2 from Vector DB corresponds → CONFIRMED
               │   └── Found: No explicit policy reference in document text
               │       └── Agent 1 inference: Control type is "Authentication" →
               │           search for authentication policies → Match 3 confirmed
               │
               ├── Step 3: Retrieve all discovered documents
               │   ├── Document 1: PII Process v0.0.7 — already ingested (ING-2026-0204-001) ✓
               │   ├── Document 2: OTP Subprocess v1.2.0 — retrieving from iGrafx...
               │   │   └── Retrieved: sha256:c8d5e9f2... (4 pages, APPROVED)
               │   └── Document 3: Auth Policy v3.1 — retrieving from SharePoint...
               │       └── Retrieved: sha256:e1f3a7b9... (12 pages, APPROVED, last reviewed: 2025-09)
               │
               └── Step 4: Evidence Completeness Assessment
                   ├── Process definition: ✓ (PII Process v0.0.7)
                   ├── Referenced subprocesses: ✓ (OTP v1.2.0)
                   ├── Governing policy: ✓ (Auth Policy v3.1)
                   ├── Prior test results: ⚠ None found (first test of this control)
                   ├── Version conflicts: ⚠ PII Process is UNAPPROVED; OTP and Policy are APPROVED
                   └── Assessment: EVIDENCE SUFFICIENT — proceed to Agent 2
                       └── Flags: [GOV-001, GOV-002, GOV-003] forwarded to Agent 3
```

**Narration:** *"Agent 1 found three documents autonomously. It started with the primary process map, then discovered the OTP subprocess by parsing the subprocess reference in the diagram. It then inferred that an authentication control should have a governing policy and searched for that. Three documents, two repositories, one agent, no human intervention. And it flagged the version governance issues for Agent 3 to assess."*

---

### Criterion 3: "Auto-tagging with regulatory domain, control type, and risk category"

**How We Demonstrate It:**

Every document Agent 1 retrieves is automatically tagged with structured metadata using the local LLM (Llama 3 70B):

```json
{
  "document_id": "DOC-2026-0204-001",
  "title": "Customer Verification – Personal Identifying Information",
  "auto_tags": {
    "regulatory_domains": [
      {
        "regulation": "OCC Heightened Standards",
        "section": "§30.5(b) — Control Design and Documentation",
        "confidence": 0.94,
        "reasoning": "Process defines customer authentication controls for a national bank supervised by OCC"
      },
      {
        "regulation": "FFIEC Authentication Guidance",
        "section": "Multi-factor authentication for high-risk transactions",
        "confidence": 0.91,
        "reasoning": "Process implements multi-factor verification (knowledge-based + security word)"
      },
      {
        "regulation": "Regulation E (EFTA)",
        "section": "§1005.6 — Unauthorized electronic fund transfers",
        "confidence": 0.87,
        "reasoning": "Customer verification prevents unauthorized access to electronic accounts"
      },
      {
        "regulation": "GLBA / Regulation P",
        "section": "§1016.4 — Privacy notice requirements / Safeguard rule",
        "confidence": 0.85,
        "reasoning": "Process handles PII (SSN, DOB, email, address) — subject to privacy safeguards"
      },
      {
        "regulation": "PCI DSS",
        "section": "Requirement 3 — Protect stored cardholder data",
        "confidence": 0.78,
        "reasoning": "Supplemental item #6 includes full ATM/Debit card number — PCI implications"
      },
      {
        "regulation": "UDAAP",
        "section": "Unfair practices — customer access to own accounts",
        "confidence": 0.72,
        "reasoning": "Denial of service to insufficiently verified customers could be challenged under UDAAP if applied inconsistently"
      }
    ],
    "control_type": {
      "primary": "Preventive",
      "secondary": "Detective",
      "reasoning": "Primary: Prevents unauthorized access (authentication gate). Secondary: Detects anomalous verification patterns (via monitoring and QA review)"
    },
    "risk_categories": [
      {
        "category": "Operational Risk",
        "subcategory": "Customer Authentication",
        "confidence": 0.96
      },
      {
        "category": "Compliance Risk",
        "subcategory": "Privacy / PII Handling",
        "confidence": 0.89
      },
      {
        "category": "Fraud Risk",
        "subcategory": "Social Engineering / Identity Theft",
        "confidence": 0.84
      },
      {
        "category": "Reputational Risk",
        "subcategory": "Customer Experience / Service Denial",
        "confidence": 0.71
      }
    ],
    "testing_frequency_recommendation": "Quarterly",
    "testing_frequency_reasoning": "High-volume control (~65K interactions/quarter) with direct customer impact and multi-regulatory exposure. Quarterly provides adequate coverage without over-testing."
  }
}
```

**Narration:** *"Every tag includes a confidence score and a reasoning chain. An auditor reviewing this can see not just what the system tagged, but why it made that determination. This is critical for model transparency — we're not operating a black box. The reasoning chain is logged and can be examined during any regulatory examination."*

---

### Criterion 4: "Version control and change tracking"

**How We Demonstrate It:**

Agent 1 maintains a complete version registry for every document:

```json
{
  "control_id": "CTL-CC-385650",
  "version_registry": {
    "pii_process": {
      "current_version": "0.0.7",
      "current_status": "UNAPPROVED",
      "version_count": 7,
      "version_timeline": [
        { "version": "0.0.1", "date": "2025-01-21", "status": "APPROVED", "days_since_prev": null },
        { "version": "0.0.2", "date": "2025-01-22", "status": "APPROVED", "days_since_prev": 1 },
        { "version": "0.0.3", "date": "2025-01-28", "status": "APPROVED", "days_since_prev": 6 },
        { "version": "0.0.4", "date": "2025-02-04", "status": "APPROVED", "days_since_prev": 7 },
        { "version": "0.0.5", "date": "2025-02-05", "status": "APPROVED", "days_since_prev": 1 },
        { "version": "0.0.6", "date": "2025-02-18", "status": "APPROVED", "days_since_prev": 13 },
        { "version": "0.0.7", "date": "2025-11-19", "status": "UNAPPROVED", "days_since_prev": 274 }
      ],
      "change_velocity": {
        "first_month_avg_days_between_versions": 5.6,
        "latest_gap_days": 274,
        "anomaly_flag": true,
        "anomaly_reasoning": "274-day gap is 49× longer than the first-month average. Either the process was stable for 9 months (expected) or maintenance was deferred (risk)."
      }
    },
    "otp_subprocess": {
      "current_version": "1.2.0",
      "current_status": "APPROVED",
      "version_count": 5,
      "last_reviewed": "2025-08-15"
    },
    "auth_policy": {
      "current_version": "3.1",
      "current_status": "APPROVED",
      "version_count": 12,
      "last_reviewed": "2025-09-22"
    }
  },
  "cross_version_compatibility": {
    "status": "WARNING",
    "detail": "PII Process v0.0.7 is UNAPPROVED while its subprocess (OTP v1.2.0) and policy (Auth v3.1) are APPROVED. The unapproved process may contain changes that are inconsistent with the approved policy."
  }
}
```

**When iGrafx Webhook Triggers a Version Change (demonstrated at 0:16–0:20):**

```
[Event] iGrafx webhook received: process 127933 updated to v0.0.8

[09:16:00.001] Agent 1: New version detected for CTL-CC-385650
               ├── Previous: v0.0.7 (UNAPPROVED, 2025-11-19)
               ├── New: v0.0.8 (status TBD, 2025-XX-XX)
               ├── Action: Re-ingesting process document
               │
               ├── Diff analysis:
               │   ├── Shapes added: 1 (SH-20: "Escalate to supervisor on 3rd failed attempt")
               │   ├── Shapes removed: 0
               │   ├── Shapes modified: 0
               │   ├── Connections added: 2 (DN-03 → SH-20, SH-20 → existing escalation path)
               │   ├── Status changed: UNAPPROVED → APPROVED
               │   └── Author: Jane Smith (different from previous sole author)
               │
               ├── Impact assessment:
               │   ├── GOV-001 (UNAPPROVED): RESOLVED ✓
               │   ├── GOV-003 (Single author): PARTIALLY RESOLVED (new author on v0.0.8)
               │   ├── Agent 3 Gap #2 (No escalation path): POTENTIALLY RESOLVED (new shape adds escalation)
               │   └── Recommendation: Re-run Agent 3 TOD to validate design gap closure
               │
               └── Notification sent to: Control owner, QA lead, scheduled for Agent 3 re-assessment
```

---

### Criterion 5: "Audit trail for all document access and modifications"

**How We Demonstrate It:**

Every action Agent 1 performs is recorded in the immutable hash-chain audit log:

```json
{
  "audit_entries": [
    {
      "seq_id": 1001,
      "timestamp": "2026-02-04T09:15:01.234Z",
      "agent_id": "agent-1",
      "action": "OAUTH2_TOKEN_REQUEST",
      "target": "auth.axos.internal",
      "detail": "Requested token with scopes: documents.read, metadata.read",
      "input_hash": null,
      "output_hash": "sha256:f4a7...",
      "reasoning_chain": null,
      "prev_hash": "sha256:0000...0000",
      "entry_hash": "sha256:a1b2..."
    },
    {
      "seq_id": 1002,
      "timestamp": "2026-02-04T09:15:01.456Z",
      "agent_id": "agent-1",
      "action": "OAUTH2_TOKEN_GRANTED",
      "target": "auth.axos.internal",
      "detail": "Token granted, expires in 3600s, scopes: documents.read, metadata.read",
      "input_hash": "sha256:f4a7...",
      "output_hash": "sha256:b3c4...",
      "reasoning_chain": null,
      "prev_hash": "sha256:a1b2...",
      "entry_hash": "sha256:c5d6..."
    },
    {
      "seq_id": 1003,
      "timestamp": "2026-02-04T09:15:02.100Z",
      "agent_id": "agent-1",
      "action": "VECTOR_DB_QUERY",
      "target": "vector-db.internal",
      "detail": "Semantic search for CTL-CC-385650, top-3 results requested",
      "input_hash": "sha256:e7f8...",
      "output_hash": "sha256:g9h0...",
      "reasoning_chain": "Control ID CTL-CC-385650 provided by Agent 4. Querying Vector DB with control ID as primary key and semantic expansion using control description embedding.",
      "prev_hash": "sha256:c5d6...",
      "entry_hash": "sha256:i1j2..."
    },
    {
      "seq_id": 1004,
      "timestamp": "2026-02-04T09:15:02.300Z",
      "agent_id": "agent-1",
      "action": "DOCUMENT_RETRIEVED",
      "target": "doc-repo.axos.internal",
      "detail": "Retrieved: Customer Verification – PII v0.0.7",
      "input_hash": "sha256:g9h0...",
      "output_hash": "sha256:a3f9...",
      "reasoning_chain": "Vector DB returned 3 matches. Match 1 (similarity: 0.97) is the primary process document. Retrieving full document content.",
      "prev_hash": "sha256:i1j2...",
      "entry_hash": "sha256:k3l4..."
    }
  ],
  "chain_integrity": {
    "verified": true,
    "total_entries": 4,
    "first_hash": "sha256:a1b2...",
    "last_hash": "sha256:k3l4...",
    "verification_timestamp": "2026-02-04T09:15:03.000Z"
  }
}
```

**Narration:** *"Every entry in the audit log chains to the previous entry's hash. If you were to tamper with entry 1002, the hash chain would break at entry 1003. This gives you SEC Rule 17a-4 grade immutability — the same standard applied to broker-dealer records. During an OCC examination, you can hand the examiner a complete, tamper-evident trail of everything the system did, why it did it, and what evidence it used."*

---

### Criterion 6: "Evidence validation and completeness scoring"

**How We Demonstrate It:**

Agent 1 produces an evidence completeness scorecard before handing off to Agent 2:

```json
{
  "evidence_completeness_assessment": {
    "control_id": "CTL-CC-385650",
    "assessment_timestamp": "2026-02-04T09:15:04.500Z",
    "overall_score": 0.88,
    "overall_status": "SUFFICIENT — Proceed to Testing",
    "criteria": [
      {
        "criterion": "Process Definition Document",
        "required": true,
        "found": true,
        "document": "PII Process v0.0.7",
        "score": 1.0,
        "notes": null
      },
      {
        "criterion": "Referenced Subprocess Documents",
        "required": true,
        "found": true,
        "document": "OTP Subprocess v1.2.0",
        "score": 1.0,
        "notes": "1 subprocess referenced, 1 retrieved"
      },
      {
        "criterion": "Governing Policy Document",
        "required": true,
        "found": true,
        "document": "Auth Policy v3.1",
        "score": 1.0,
        "notes": "Inferred by Agent 1 (not explicitly referenced in process map)"
      },
      {
        "criterion": "Prior Test Results",
        "required": false,
        "found": false,
        "document": null,
        "score": 0.0,
        "notes": "No prior test results found. This appears to be the first test of this control. Non-blocking for initial test."
      },
      {
        "criterion": "Regulatory Reference Materials",
        "required": false,
        "found": true,
        "document": "Embedded in Vector DB (OCC, FFIEC, Reg E, GLBA, PCI, UDAAP)",
        "score": 1.0,
        "notes": "Agent 3 will use these during design assessment"
      },
      {
        "criterion": "Document Currency",
        "required": true,
        "found": "PARTIAL",
        "document": null,
        "score": 0.5,
        "notes": "PII Process is UNAPPROVED. OTP and Policy are current. Governance flags raised."
      },
      {
        "criterion": "Test Data Availability",
        "required": true,
        "found": true,
        "document": "Call disposition records Q4 2025 (65,000 records confirmed in data warehouse)",
        "score": 1.0,
        "notes": "Agent 2 confirmed data availability via pre-flight query"
      }
    ],
    "evidence_package_hash": "sha256:m5n6...",
    "handoff_to": "agent-2",
    "handoff_timestamp": "2026-02-04T09:15:05.000Z"
  }
}
```

**Narration:** *"Agent 1 scored the evidence package at 88%. The only deductions are: no prior test results — this is the first test — and the process document is UNAPPROVED. Agent 1 determined this is sufficient to proceed. If the score had dropped below 70%, Agent 1 would have paused the pipeline and requested human intervention to fill the gaps."*

---

## 4.2 Agent 1 Summary: Demo Checklist

| RFP Criterion | Demonstrated? | Demo Timestamp | Key Evidence |
|--------------|---------------|----------------|--------------|
| Secure API integration | ✓ | 0:22–0:24 | OAuth2 + mTLS handshake in activity feed |
| Automated document discovery | ✓ | 0:24–0:26 | 3 documents discovered across 2 repositories |
| Auto-tagging (regulatory, control type, risk) | ✓ | 0:26–0:27 | 6 regulatory domains, 4 risk categories, confidence scores |
| Version control and change tracking | ✓ | 0:16–0:20 (Section A) + 0:27 | 7-version history, 274-day gap analysis, webhook demo |
| Audit trail | ✓ | 0:27–0:28 | Hash-chain audit entries visible in real-time |
| Evidence validation and completeness | ✓ | 0:27–0:28 | 88% completeness score, 7 criteria evaluated |

---

*← Back to `03-Section-A-Process-Ingestion.md` | Next: `05-Agent-2-Test-of-Effectiveness.md` →*
