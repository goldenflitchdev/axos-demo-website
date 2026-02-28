# 03 — Section A: Process Map Ingestion & Analysis

*← Back to `02-Process-Map-Deep-Dive.md` | Next: `04-Agent-1-Documentation-Retrieval.md` →*

---

> **RFP Requirement (Section III.A):** "How the process map will be ingested and analyzed by the system (i.e., can it accommodate manual upload and automated extraction from iGrafx?)"

This section demonstrates two ingestion pathways: manual PDF upload and automated iGrafx API extraction.

---

## 3.1 Ingestion Method 1: Manual PDF Upload

### Demo Narration Script

> *"Let me start by showing you the most basic way to get a process into the system. I have here your exact document — Customer Verification Personal Identifying Information, version 0.0.7. I'm going to drag it into the document ingestion portal."*

### Step-by-Step Demo Walkthrough

**Step 1: Upload Initiation**

The presenter opens the Document Ingestion Portal in the LEFT screen panel. This is a clean, purpose-built web interface (not a generic file manager) with:

- A drag-and-drop zone prominently displayed
- A list of recently ingested documents below
- Status indicators for each document (Processing, Complete, Error)

The presenter drags the PDF file `Customer Verification - Personal Identifying Information 127933.pdf` into the drop zone.

**Step 2: Integrity Verification (visible in < 1 second)**

The system immediately displays:

```json
{
  "upload_id": "ING-2026-0204-001",
  "filename": "Customer Verification - Personal Identifying Information 127933.pdf",
  "file_size_bytes": 1847293,
  "sha256_hash": "a3f9e72b4d1c8a56f0e3d9b7c2a8f4e1d6b3c9a7e5f2d8b4c1a6e3f9d7b2c8a5",
  "upload_timestamp": "2026-02-04T09:14:22.847Z",
  "uploaded_by": "demo-user@goldenflitch.com",
  "status": "INTEGRITY_VERIFIED"
}
```

**Narration:** *"The first thing that happens is cryptographic hashing. The system computes a SHA-256 hash of the document. This hash becomes the document's fingerprint — it's stored in the immutable audit log and referenced by every agent that touches this document. If anyone were to modify the PDF after ingestion, the hash would change and the system would flag it."*

**Step 3: Structural Parsing Pipeline (visible over ~5-8 seconds)**

The activity feed shows the parsing pipeline executing in sequence:

```
[09:14:23.102] Stage 1/5: OCR Engine — Extracting text from all 14 pages
               ├── Page 1: Cover sheet — Title, Control ID, Version metadata
               ├── Pages 2-8: Process diagram — 19 shapes detected
               ├── Pages 9-10: Verification item lists (Standard + Supplemental)
               ├── Pages 11-13: Version history table (7 rows)
               └── Page 14: Footer/legal
               Result: 100% text extraction confidence (native PDF, no image-only pages)

[09:14:24.415] Stage 2/5: Layout Analysis — Identifying document structure
               ├── Detected: iGrafx process diagram (pages 2-8)
               ├── Detected: Swim lane structure (2 lanes: Customer, CSR)
               ├── Detected: Decision diamonds (8)
               ├── Detected: Process rectangles (7)
               ├── Detected: Start/End circles (2)
               ├── Detected: Subprocess reference (1)
               ├── Detected: Annotation notes (1)
               ├── Detected: Tabular data (pages 9-13)
               └── Detected: Version history table (page 11-13, 7 versions)

[09:14:25.891] Stage 3/5: Semantic NLP — Understanding content meaning
               ├── Document type: Process Map (Workflow Diagram)
               ├── Domain: Customer Authentication / Identity Verification
               ├── Regulatory domain mapping:
               │   ├── OCC Heightened Standards (primary)
               │   ├── FFIEC Authentication Guidance
               │   ├── Regulation E (electronic funds)
               │   ├── GLBA / Regulation P (privacy)
               │   ├── PCI DSS (card data handling implied by supplemental item #6)
               │   └── UDAAP (customer treatment)
               ├── Key entities extracted:
               │   ├── Control ID: CTL-CC-385650
               │   ├── Process name: Customer Verification – Personal Identifying Information
               │   ├── Subprocess: Customer Verification – One-time Passcode
               │   ├── Actors: Customer, Customer Service Representative
               │   └── Version: 0.0.7 (UNAPPROVED)
               └── Governance flags:
                   ├── FLAG-001: Document is UNAPPROVED (version 0.0.7)
                   ├── FLAG-002: 9-month gap between last approved (v0.0.6, Feb 2025) and current
                   └── FLAG-003: Single author across all 7 versions (no independent review evidence)

[09:14:27.334] Stage 4/5: Vector Embedding — Creating searchable representations
               ├── Generating embeddings for 19 shapes (individual shape embeddings)
               ├── Generating embeddings for verification item lists (2 list embeddings)
               ├── Generating embeddings for version history (1 table embedding)
               ├── Generating document-level embedding (holistic summary)
               ├── Embedding model: all-MiniLM-L6-v2 (384 dimensions, running locally)
               ├── Total vectors: 23
               └── Indexed in Vector DB with metadata tags

[09:14:28.901] Stage 5/5: Control Object Construction — Building structured representation
               └── See JSON output below
```

**Step 4: Structured Control Object (displayed in RIGHT panel)**

The system presents the fully parsed control object:

```json
{
  "control_id": "CTL-CC-385650",
  "process_name": "Customer Verification – Personal Identifying Information",
  "source": {
    "system": "manual_upload",
    "filename": "Customer Verification - Personal Identifying Information 127933.pdf",
    "sha256": "a3f9e72b...",
    "pages": 14,
    "upload_id": "ING-2026-0204-001"
  },
  "diagram_metadata": {
    "tool": "iGrafx",
    "version": "0.0.7",
    "approval_status": "UNAPPROVED",
    "last_modified": "2025-11-19T19:57:39Z",
    "modified_by": "Jhun Pratt Carag"
  },
  "structure": {
    "swim_lanes": [
      { "id": "lane-1", "actor": "Customer", "type": "external" },
      { "id": "lane-2", "actor": "Customer Service Representative", "type": "internal" }
    ],
    "shapes": {
      "total": 19,
      "start_end": 2,
      "decision": 8,
      "process": 7,
      "subprocess": 1,
      "annotation": 1
    },
    "paths": {
      "total_distinct": 7,
      "longest_path_nodes": 8,
      "shortest_path_nodes": 3,
      "cyclomatic_complexity": 9
    }
  },
  "decision_nodes": [
    {
      "id": "DN-01",
      "text": "Does customer need account-specific information or assistance?",
      "outcomes": ["YES → proceed to verification", "NO → bypass verification"],
      "risk_note": "Bypass path not clearly bounded — what constitutes non-account-specific?"
    },
    {
      "id": "DN-02",
      "text": "Is there a security word on file?",
      "outcomes": ["YES → Track B path", "NO → Track A path"],
      "risk_note": "Determines verification intensity — creates two distinct control populations"
    },
    {
      "id": "DN-03",
      "text": "Is the security word valid?",
      "outcomes": ["YES → collect 2 PII + security word", "NO → fall through to Track A (4 PII)"],
      "risk_note": "Failed security word does not trigger escalation — design gap"
    },
    {
      "id": "DN-04",
      "text": "Did the customer answer all verification questions correctly, without errors?",
      "outcomes": ["YES → fully verified", "NO → partial verification path"],
      "risk_note": "No definition of 'partial' correctness (3 of 4)"
    },
    {
      "id": "DN-05",
      "text": "Does the customer need to update contact information?",
      "outcomes": ["YES → OTP subprocess", "NO → close"],
      "risk_note": "OTP trigger condition — creates subprocess dependency"
    },
    {
      "id": "DN-06",
      "text": "Is the customer fully verified? (post-OTP)",
      "outcomes": ["YES → close", "NO → partial path"],
      "risk_note": "Post-OTP verification status — potential for customers to be stuck in loop"
    },
    {
      "id": "DN-07",
      "text": "Is the customer partially verified? (instance 1)",
      "outcomes": ["YES → limited assistance", "NO → deny service"],
      "risk_note": "No clear threshold for 'partial' — CSR discretion risk"
    },
    {
      "id": "DN-08",
      "text": "Is the customer partially verified? (instance 2)",
      "outcomes": ["YES → limited assistance", "NO → deny service"],
      "risk_note": "Duplicate decision diamond — potential design redundancy or contextual variation"
    }
  ],
  "verification_tracks": {
    "track_a": {
      "name": "Standard Verification (No Security Word)",
      "required_items": 4,
      "item_pool": "standard_pii + supplemental_pii (combined 10 items)",
      "note": "Any 4 from the combined pool of 10"
    },
    "track_b": {
      "name": "Enhanced Verification (Security Word Present)",
      "required_items": "1 security word + 2 PII items",
      "item_pool": "standard_pii + supplemental_pii (for the 2 PII items)",
      "hint_policy": "CSR may provide a hint for the security word if customer requests",
      "note": "Security word + 2 items = 3 total verification touchpoints (fewer than Track A's 4)"
    }
  },
  "subprocess_references": [
    {
      "name": "Customer Verification – One-time Passcode",
      "trigger_condition": "Customer needs to update contact information AND is fully verified",
      "return_path": "Returns to main process at DN-06 (post-OTP verification check)",
      "document_required": true,
      "document_status": "PENDING_RETRIEVAL"
    }
  ],
  "governance_flags": [
    {
      "flag_id": "GOV-001",
      "severity": "HIGH",
      "title": "Document UNAPPROVED",
      "detail": "Version 0.0.7 has not received formal approval. Last approved version: v0.0.6 (Feb 18, 2025).",
      "regulatory_reference": "OCC Heightened Standards §30.5(b)",
      "recommendation": "Process should not be in production without approval. Investigate whether v0.0.7 changes are operating in production."
    },
    {
      "flag_id": "GOV-002",
      "severity": "MEDIUM",
      "title": "Extended Version Gap",
      "detail": "9-month gap between v0.0.6 (approved Feb 2025) and v0.0.7 (unapproved Nov 2025). Raises question: Was the process stable for 9 months, or was maintenance neglected?",
      "regulatory_reference": "FFIEC IT Examination Handbook — Annual review expectation",
      "recommendation": "Document the reason for the gap. If stable, confirm via attestation. If neglected, add to remediation plan."
    },
    {
      "flag_id": "GOV-003",
      "severity": "MEDIUM",
      "title": "Single Author / No Independent Review",
      "detail": "All 7 versions authored by Jhun Pratt Carag. No evidence of independent review or approval by a second party.",
      "regulatory_reference": "COSO Principle 3 — Segregation of duties in control design",
      "recommendation": "Implement dual-review requirement for process map modifications."
    }
  ],
  "version_history": [
    { "version": "0.0.1", "date": "2025-01-21", "author": "Jhun Pratt Carag", "status": "APPROVED" },
    { "version": "0.0.2", "date": "2025-01-22", "author": "Jhun Pratt Carag", "status": "APPROVED" },
    { "version": "0.0.3", "date": "2025-01-28", "author": "Jhun Pratt Carag", "status": "APPROVED" },
    { "version": "0.0.4", "date": "2025-02-04", "author": "Jhun Pratt Carag", "status": "APPROVED" },
    { "version": "0.0.5", "date": "2025-02-05", "author": "Jhun Pratt Carag", "status": "APPROVED" },
    { "version": "0.0.6", "date": "2025-02-18", "author": "Jhun Pratt Carag", "status": "APPROVED" },
    { "version": "0.0.7", "date": "2025-11-19", "author": "Jhun Pratt Carag", "status": "UNAPPROVED" }
  ],
  "ingestion_timestamp": "2026-02-04T09:14:28.901Z",
  "ingestion_hash": "sha256:b7c4e8f1a2d5...",
  "agent_readiness": {
    "agent_1_evidence_complete": false,
    "agent_1_pending": ["OTP subprocess document not yet retrieved"],
    "agent_2_testable": true,
    "agent_3_assessable": true
  }
}
```

**Narration:** *"In under 5 seconds, the system has extracted the complete structure of your process. 19 shapes, 8 decision nodes, 2 verification tracks, all 7 version history entries, and — importantly — 3 governance flags that an auditor would want to know about before testing even begins. It also identified that this process references an OTP subprocess, and it's marked that document as pending retrieval. Agent 1 will autonomously go find that document next."*

---

## 3.2 Ingestion Method 2: iGrafx Automated Extraction

### Demo Narration Script

> *"Now let me show you the automated path. In production, you wouldn't be manually uploading PDFs — the system connects directly to your iGrafx platform."*

### Three Extraction Mechanisms

Goldenflitch supports three mechanisms for iGrafx integration, providing redundancy and flexibility:

#### Mechanism A: OData REST API (Primary — Recommended)

```
┌─────────────┐     HTTPS (TLS 1.3)     ┌──────────────────────┐
│  Agent 1    │ ──────────────────────►  │  iGrafx OData API    │
│  (Outbound) │                          │  /api/v2/repos/      │
│             │ ◄──────────────────────  │    {repoId}/         │
│             │     JSON Response         │    processes/         │
└─────────────┘                          │    {processId}        │
                                         └──────────────────────┘
```

**API Call Demonstrated in Demo:**

```http
GET /api/v2/repositories/{repoId}/processes/{processId}
    ?$select=name,version,modifiedDate,modifiedBy,status,shapes,connections
    &$expand=shapes($select=id,type,text,lane,position),
             connections($select=from,to,label),
             versions($select=version,date,author,status)
Host: igrafx.axos.internal
Authorization: Bearer {oauth2_token}
Accept: application/json
X-Request-ID: req-2026-0204-001
```

**Response (summarized):**

```json
{
  "@odata.context": "https://igrafx.axos.internal/api/v2/$metadata#processes/$entity",
  "processId": "127933",
  "name": "Customer Verification – Personal Identifying Information",
  "version": "0.0.7",
  "modifiedDate": "2025-11-19T19:57:39Z",
  "modifiedBy": "Jhun Pratt Carag",
  "status": "UNAPPROVED",
  "shapes": [ /* 19 shapes with id, type, text, lane, position */ ],
  "connections": [ /* 26 connections with from, to, label */ ],
  "versions": [ /* 7 version entries */ ]
}
```

**Narration:** *"This gives us native structured data — no OCR needed, no PDF parsing. The shapes, connections, and metadata come directly from iGrafx in JSON format. This is more reliable than PDF parsing and runs in under 1 second."*

**Advantages over PDF upload:**
- Native structured data (no OCR/parsing errors)
- Connection metadata (which shape connects to which)
- Real-time version information
- Richer metadata (shape positions, lane assignments)

#### Mechanism B: Webhook Trigger (Event-Driven)

```
┌──────────────────┐   POST /webhook/igrafx   ┌─────────────────────┐
│  iGrafx Server   │ ────────────────────────► │  Goldenflitch       │
│  (version save)  │                           │  Webhook Receiver   │
│                  │                           │  (inside Axos VPC)  │
└──────────────────┘                           └──────────┬──────────┘
                                                          │
                                                          │ Triggers
                                                          ▼
                                               ┌─────────────────────┐
                                               │  Agent 1 re-ingests │
                                               │  the updated process│
                                               └─────────────────────┘
```

**Webhook Payload:**

```json
{
  "event": "process.version.saved",
  "processId": "127933",
  "version": "0.0.8",
  "modifiedBy": "Jane Smith",
  "modifiedDate": "2026-02-10T14:22:00Z",
  "status": "APPROVED",
  "changesSummary": "Added escalation path for failed security word attempts"
}
```

**Narration:** *"When an Axos process analyst saves a new version in iGrafx, the system receives a webhook notification and automatically re-ingests the process. The agent compares the new version against the previous version and produces a change log. This means your control testing is always running against the latest process design — not a stale document."*

**Version Diff Output (Demo Mockup):**

```json
{
  "comparison": {
    "from_version": "0.0.7",
    "to_version": "0.0.8",
    "changes": [
      {
        "type": "SHAPE_ADDED",
        "shape_id": "SH-20",
        "shape_type": "Process",
        "text": "Escalate to supervisor if security word fails 3 times",
        "lane": "CSR",
        "impact_assessment": "Addresses GOV-FLAG related to missing escalation path. Agent 3 Gap #2 may be resolved."
      },
      {
        "type": "STATUS_CHANGED",
        "field": "approval_status",
        "from": "UNAPPROVED",
        "to": "APPROVED",
        "impact_assessment": "Resolves governance flag GOV-001."
      }
    ],
    "governance_flags_resolved": ["GOV-001"],
    "governance_flags_remaining": ["GOV-002", "GOV-003"],
    "recommendation": "Re-run Agent 3 TOD assessment to evaluate whether design gaps are addressed by v0.0.8 changes."
  }
}
```

#### Mechanism C: SFTP File Watcher (Fallback)

For environments where the iGrafx API is unavailable or restricted:

```
┌──────────────────┐   SFTP export (scheduled)  ┌─────────────────────┐
│  iGrafx Server   │ ──────────────────────────► │  Axos SFTP Server   │
│  (nightly export)│                             │  /exports/igrafx/   │
└──────────────────┘                             └──────────┬──────────┘
                                                            │
                                                            │ File watcher
                                                            │ (inotify/polling)
                                                            ▼
                                                 ┌─────────────────────┐
                                                 │  Agent 1 detects    │
                                                 │  new/modified file  │
                                                 │  → ingests          │
                                                 └─────────────────────┘
```

**Narration:** *"As a fallback, if iGrafx's API isn't available in your environment, we support SFTP file watching. iGrafx can export process definitions nightly to an SFTP directory, and our agent monitors that directory for new or modified files."*

---

## 3.3 Ingestion Method Comparison Table

| Capability | Manual PDF Upload | iGrafx OData API | Webhook Trigger | SFTP File Watcher |
|------------|-------------------|-------------------|-----------------|-------------------|
| **Latency** | On-demand (user-initiated) | On-demand or scheduled (polling interval configurable: 1 min to 24 hours) | Near-real-time (event-driven, < 5 sec) | Batch (typically nightly) |
| **Data Quality** | Good — OCR + NLP parsing | Excellent — native structured JSON | Excellent — native structured JSON + change event | Good — depends on export format (PDF/BPMN/XML) |
| **Version Tracking** | Extracted from document content (if present) | Native — full version history from API | Native — version event triggers re-ingestion | Derived — file timestamps + content comparison |
| **Connection Metadata** | Inferred from layout analysis (may miss edge cases) | Native — explicit from/to connections with labels | Native (same as API) | Depends on export format |
| **Change Detection** | Manual — user must re-upload | Polling-based (compares version numbers) | Instant — webhook fires on save | File-level (new file or modified timestamp) |
| **Setup Complexity** | None (drag-and-drop) | Medium (OAuth2 config, API endpoint registration) | Medium (webhook endpoint registration in iGrafx) | Low (SFTP credentials + directory path) |
| **Network Requirements** | None (file upload to local portal) | Outbound HTTPS to iGrafx server (inside Axos network) | Inbound webhook from iGrafx (inside Axos network) | SFTP access to export directory (inside Axos network) |
| **Recommended For** | Ad-hoc testing, initial onboarding, non-iGrafx documents | Primary production integration | Continuous monitoring of frequently-updated processes | Environments with restricted API access |

---

## 3.4 Supported Document Formats (Beyond iGrafx)

The RFP mentions iGrafx specifically, but Goldenflitch's ingestion engine is format-agnostic:

| Format | Parser | Confidence Level | Notes |
|--------|--------|-----------------|-------|
| **iGrafx PDF export** | OCR + Layout + NLP | High | Demonstrated in this demo |
| **iGrafx native (via API)** | Direct JSON | Very High | Preferred for production |
| **Visio (.vsdx)** | XML parser | High | Many banks export from Visio |
| **BPMN 2.0 (.bpmn)** | XML schema parser | Very High | Industry standard; richest metadata |
| **Lucidchart export (PDF/SVG)** | OCR + SVG parser | High | Growing adoption in financial services |
| **PowerPoint (.pptx)** | Shape extractor + NLP | Medium | Common for executive-level process docs |
| **Word (.docx) with embedded diagrams** | Text + image extraction | Medium | Requires OCR for embedded images |
| **Scanned paper documents (image PDF)** | OCR (Tesseract/PaddleOCR) | Medium | For legacy/archived processes |
| **Plain text process descriptions** | NLP only | Medium-Low | No visual structure; relies entirely on NLP |

---

## 3.5 Competitive Differentiation on Ingestion

| Capability | Goldenflitch | Competitor |
|------------|-------------|---------------------|
| **iGrafx native integration** | YES — OData API, Webhook, SFTP | NO — Their architecture document shows no iGrafx connector. Their API documentation lists only generic "document upload" endpoints. |
| **Ingestion runs on-premise** | YES — all parsing, OCR, NLP runs locally | NO — Documents are uploaded to their AWS cloud for processing. Document content traverses the network to AWS. |
| **Version tracking** | Automatic — from API or document content | Unknown — not described in their documentation |
| **Governance flags** | Automatic — approval status, version gaps, single author | Unknown — not described |
| **Subprocess discovery** | Automatic — Agent 1 identifies referenced documents | Unknown — not described |

**Presenter Talking Point:** *"You asked specifically about iGrafx. We built a native connector for iGrafx's OData API. Some solutions will tell you they support 'document upload' — which means manual PDF upload with no structured extraction, no version tracking, no change detection. That's not iGrafx integration — that's just a file upload button."*

---

*← Back to `02-Process-Map-Deep-Dive.md` | Next: `04-Agent-1-Documentation-Retrieval.md` →*
