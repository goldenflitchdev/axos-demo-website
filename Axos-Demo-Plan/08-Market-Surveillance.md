# 08 — Market Surveillance

*← Back to `07-Agent-4-Supervisory-Agent.md` | Next: `09-Extension-Capabilities.md` →*

---

> **RFP Requirement (Section IV — Market Surveillance):** "Explanation detailing support of Market Surveillance (Does not need a demo of a functional UI)."
>
> **Demo Brief:** "Including: (A) A user configurable rule engine using 12 Axos defined rules, (B) Ingestion of Market Data sources to enrich rules, (C) Daily alert engine — how the components above will be used to generate alerts to be fed into an AI-driven workflow supporting investigations and SAR filings."

---

## 8.1 Market Surveillance Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        MARKET SURVEILLANCE SYSTEM                           │
│                                                                             │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐   ┌────────────┐  │
│  │ DATA INGESTION│   │ RULE ENGINE  │   │ ALERT ENGINE │   │ INVESTIGAT.│  │
│  │ LAYER        │──►│              │──►│              │──►│ & SAR      │  │
│  │              │   │ 12 Axos Rules│   │ Daily Batch + │   │ WORKFLOW   │  │
│  │ Internal +   │   │ + Custom     │   │ Real-time     │   │            │  │
│  │ External Data│   │              │   │ Triage        │   │ AI-Driven  │  │
│  └──────────────┘   └──────────────┘   └──────────────┘   └────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 8.2 Component A: User-Configurable Rule Engine (12 Axos-Defined Rules)

### Rule Configuration Format

Each rule is defined in YAML and can be modified by authorized users (MANAGER or ADMIN role) without code changes:

### The 12 Rules

```yaml
# ═══════════════════════════════════════════════════
# RULE 1: INSIDER TRADING DETECTION
# ═══════════════════════════════════════════════════
- rule_id: MSR-001
  name: "Insider Trading Detection"
  category: "Market Abuse"
  regulatory_reference: "Securities Exchange Act §10(b), Rule 10b-5; FINRA Rule 2010"
  description: >
    Detects trading activity in securities where Axos or its affiliates
    may possess material non-public information (MNPI). Cross-references
    employee/affiliate trading against: (a) Axos's restricted list,
    (b) pending corporate actions, (c) research department coverage,
    and (d) information barrier crossing events.
  trigger_conditions:
    - condition: "trade.security_id IN restricted_list.securities"
      action: "ALERT (CRITICAL)"
    - condition: "trade.account.is_employee = true AND trade.executed_within_days(corporate_action.announcement_date, 14)"
      action: "ALERT (HIGH)"
    - condition: "trade.account.is_affiliate = true AND trade.security IN research_coverage.pending_reports"
      action: "ALERT (HIGH)"
    - condition: "information_barrier.crossing_event.date WITHIN 7_days_before(trade.date)"
      action: "ALERT (MEDIUM)"
  parameters:
    restricted_list_source: "compliance_restricted_list_api"
    lookback_window_days: 30
    pre_announcement_window_days: 14
    post_announcement_window_days: 5
    affiliate_definition: "Axos employees, board members, >10% shareholders, immediate family"
    minimum_trade_value_usd: 5000
  watchlist:
    type: "dynamic"
    sources: ["restricted_list", "pending_corporate_actions", "research_coverage"]
    refresh_frequency: "real-time for restricted list; daily for corporate actions"
  false_positive_filters:
    - "Exclude pre-approved 10b5-1 plan trades"
    - "Exclude index fund rebalancing trades"
    - "Exclude dividend reinvestment plan (DRIP) trades"

# ═══════════════════════════════════════════════════
# RULE 2: FRONT-RUNNING DETECTION
# ═══════════════════════════════════════════════════
- rule_id: MSR-002
  name: "Front-Running Detection"
  category: "Market Abuse"
  regulatory_reference: "Securities Exchange Act §15(c)(1); FINRA Rules 5270, 5310"
  description: >
    Detects proprietary or employee trades that precede large customer
    orders in the same security, suggesting knowledge of pending orders.
  trigger_conditions:
    - condition: "prop_trade.time < customer_order.time AND prop_trade.security = customer_order.security AND customer_order.size >= large_order_threshold AND time_gap < max_gap_minutes"
      action: "ALERT (HIGH)"
  parameters:
    large_order_threshold_shares: 10000
    large_order_threshold_usd: 250000
    max_gap_minutes: 60
    lookback_days: 30

# ═══════════════════════════════════════════════════
# RULE 3: MARKET MANIPULATION (WASH TRADING)
# ═══════════════════════════════════════════════════
- rule_id: MSR-003
  name: "Wash Trading Detection"
  category: "Market Manipulation"
  regulatory_reference: "Securities Exchange Act §9(a)(1); FINRA Rule 2020"
  description: >
    Detects buy-sell patterns in the same security within the same account
    or related accounts that appear designed to create artificial volume
    without genuine change in beneficial ownership.
  trigger_conditions:
    - condition: "account.buy(security, quantity) AND account.sell(security, quantity) WITHIN wash_window AND net_position_change < threshold"
      action: "ALERT (HIGH)"
    - condition: "related_accounts.buy(security) AND related_accounts.sell(security) WITHIN wash_window"
      action: "ALERT (MEDIUM)"
  parameters:
    wash_window_minutes: 30
    net_position_change_threshold_percent: 5
    related_account_detection: "same address, same SSN last 4, same phone, designated related in CRM"

# ═══════════════════════════════════════════════════
# RULE 4: SPOOFING / LAYERING DETECTION
# ═══════════════════════════════════════════════════
- rule_id: MSR-004
  name: "Spoofing / Layering Detection"
  category: "Market Manipulation"
  regulatory_reference: "Dodd-Frank Act §747; FINRA Rule 6140"
  description: >
    Detects patterns of order placement and rapid cancellation designed
    to create false impression of supply/demand.
  trigger_conditions:
    - condition: "order.placed AND order.cancelled WITHIN cancel_window AND cancel_rate > threshold"
      action: "ALERT (HIGH)"
    - condition: "multiple_orders.same_side(security) WITHIN layer_window AND subsequent_cancel_rate > layer_threshold"
      action: "ALERT (HIGH)"
  parameters:
    cancel_window_seconds: 5
    cancel_rate_threshold_percent: 90
    layer_window_seconds: 10
    layer_threshold_order_count: 5
    minimum_order_value_usd: 10000

# ═══════════════════════════════════════════════════
# RULE 5: CHURNING DETECTION
# ═══════════════════════════════════════════════════
- rule_id: MSR-005
  name: "Churning Detection"
  category: "Suitability / Customer Protection"
  regulatory_reference: "FINRA Rules 2111, 2010; SEC Rule 15c1-7"
  description: >
    Detects excessive trading in customer accounts relative to account
    size and stated investment objectives, suggesting commission-driven activity.
  trigger_conditions:
    - condition: "account.turnover_ratio > turnover_threshold AND account.cost_equity_ratio > cost_equity_threshold"
      action: "ALERT (HIGH)"
  parameters:
    turnover_ratio_threshold: 6.0
    cost_equity_ratio_threshold_percent: 20
    evaluation_period_months: 12
    exclude_self_directed_accounts: true

# ═══════════════════════════════════════════════════
# RULE 6: MARKING THE CLOSE
# ═══════════════════════════════════════════════════
- rule_id: MSR-006
  name: "Marking the Close"
  category: "Market Manipulation"
  regulatory_reference: "FINRA Rule 2020; SEC Rule 10b-5"
  description: >
    Detects large orders placed in the final minutes of trading designed
    to influence the closing price of a security.
  trigger_conditions:
    - condition: "order.time WITHIN close_window AND order.size > size_threshold AND order.price_impact > impact_threshold"
      action: "ALERT (HIGH)"
  parameters:
    close_window_minutes: 10
    size_threshold_percent_adv: 5
    impact_threshold_percent: 0.5

# ═══════════════════════════════════════════════════
# RULE 7: LATE TRADING / MARKET TIMING (FUNDS)
# ═══════════════════════════════════════════════════
- rule_id: MSR-007
  name: "Late Trading / Market Timing"
  category: "Fund Abuse"
  regulatory_reference: "Investment Company Act §22(c); SEC Rule 22c-1"
  description: >
    Detects mutual fund orders received after the 4 PM ET cutoff that
    are processed at the day's NAV, and frequent round-trip transactions
    indicating market timing strategies.
  trigger_conditions:
    - condition: "fund_order.received_time > '16:00 ET' AND fund_order.priced_at = 'same_day_nav'"
      action: "ALERT (CRITICAL)"
    - condition: "account.fund_round_trips > trip_threshold WITHIN period"
      action: "ALERT (HIGH)"
  parameters:
    cutoff_time: "16:00 ET"
    round_trip_threshold: 4
    round_trip_period_months: 6

# ═══════════════════════════════════════════════════
# RULE 8: BEST EXECUTION MONITORING
# ═══════════════════════════════════════════════════
- rule_id: MSR-008
  name: "Best Execution Monitoring"
  category: "Order Handling"
  regulatory_reference: "FINRA Rule 5310; SEC Rules 606, 607"
  description: >
    Monitors whether customer orders are executed at the best available
    price, considering the NBBO at time of execution.
  trigger_conditions:
    - condition: "execution.price < nbbo.bid (for sells) OR execution.price > nbbo.ask (for buys)"
      action: "ALERT (MEDIUM)"
    - condition: "execution.price_improvement < peer_average AND volume > threshold"
      action: "ALERT (LOW)"
  parameters:
    nbbo_tolerance_cents: 1
    peer_comparison_source: "FINRA ATS data"
    minimum_order_value_usd: 5000

# ═══════════════════════════════════════════════════
# RULE 9: UNAUTHORIZED TRADING
# ═══════════════════════════════════════════════════
- rule_id: MSR-009
  name: "Unauthorized Trading"
  category: "Customer Protection"
  regulatory_reference: "FINRA Rules 3110, 2010"
  description: >
    Detects trades executed without prior customer authorization or
    outside the scope of discretionary authority granted.
  trigger_conditions:
    - condition: "trade.authorization_type = 'none' AND account.discretionary = false"
      action: "ALERT (CRITICAL)"
    - condition: "trade.size > discretionary_limit AND trade.pre_approval = false"
      action: "ALERT (HIGH)"
  parameters:
    require_documented_authorization: true
    discretionary_override_requires: "written_pre_approval"

# ═══════════════════════════════════════════════════
# RULE 10: CONCENTRATION RISK / UNSUITABLE ALLOCATION
# ═══════════════════════════════════════════════════
- rule_id: MSR-010
  name: "Concentration Risk Detection"
  category: "Suitability"
  regulatory_reference: "FINRA Rules 2111, 2090; Regulation Best Interest"
  description: >
    Detects accounts with excessive concentration in a single security,
    sector, or asset class relative to the customer's risk profile.
  trigger_conditions:
    - condition: "account.single_security_weight > concentration_threshold"
      action: "ALERT (HIGH)"
    - condition: "account.sector_weight > sector_threshold AND customer.risk_tolerance = 'conservative'"
      action: "ALERT (HIGH)"
  parameters:
    single_security_concentration_threshold_percent: 25
    sector_concentration_threshold_percent: 40
    check_against_risk_profile: true

# ═══════════════════════════════════════════════════
# RULE 11: SUSPICIOUS WIRE / MONEY MOVEMENT
# ═══════════════════════════════════════════════════
- rule_id: MSR-011
  name: "Suspicious Wire / Money Movement"
  category: "AML / BSA"
  regulatory_reference: "BSA/AML; FinCEN SAR requirements; FINRA Rule 3310"
  description: >
    Detects unusual money movement patterns associated with potential
    money laundering, terrorist financing, or fraud.
  trigger_conditions:
    - condition: "wire.amount > ctr_threshold AND wire.destination.country IN high_risk_countries"
      action: "ALERT (CRITICAL)"
    - condition: "account.wire_frequency > frequency_threshold WITHIN period AND wire.amounts.structuring_pattern = true"
      action: "ALERT (CRITICAL)"
    - condition: "account.deposit_then_wire WITHIN rapid_window AND amount > threshold"
      action: "ALERT (HIGH)"
  parameters:
    ctr_threshold_usd: 10000
    high_risk_countries: "FATF grey list + OFAC sanctioned"
    structuring_detection: true
    structuring_window_days: 7
    structuring_aggregate_threshold_usd: 10000
    rapid_deposit_wire_window_hours: 48

# ═══════════════════════════════════════════════════
# RULE 12: COMMUNICATION SURVEILLANCE (ELECTRONIC)
# ═══════════════════════════════════════════════════
- rule_id: MSR-012
  name: "Electronic Communication Surveillance"
  category: "Supervision"
  regulatory_reference: "FINRA Rules 3110(b)(4), 2210; SEC Rule 17a-4"
  description: >
    NLP-based surveillance of electronic communications (email, chat,
    social media) for indicators of market abuse, customer complaints,
    unauthorized promises, and MNPI sharing.
  trigger_conditions:
    - condition: "communication.nlp_score('insider_trading_intent') > nlp_threshold"
      action: "ALERT (HIGH)"
    - condition: "communication.nlp_score('customer_complaint') > complaint_threshold"
      action: "ALERT (MEDIUM)"
    - condition: "communication.nlp_score('guaranteed_returns') > guarantee_threshold"
      action: "ALERT (HIGH)"
    - condition: "communication.contains_security_ticker AND communication.recipient.external = true"
      action: "ALERT (MEDIUM) — potential MNPI leak"
  parameters:
    nlp_model: "Llama 3 70B (local, fine-tuned on compliance lexicon)"
    nlp_threshold: 0.75
    complaint_threshold: 0.70
    guarantee_threshold: 0.80
    communication_sources: ["email", "bloomberg_chat", "ms_teams", "slack"]
    retention_period_years: 7
```

### Rule Configuration UI (Described, Not Demoed)

> *"Each rule is a YAML configuration file. No code changes required. Your compliance team can modify thresholds, add watchlist entries, enable/disable rules, and add new rules entirely through the configuration interface. Every change is version-controlled and audited."*

---

## 8.3 Component B: Market Data Ingestion

### Data Source Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     DATA INGESTION LAYER                         │
│                                                                  │
│  INTERNAL SOURCES (Axos-owned)                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  ■ Trade Blotter (OMS/EMS)     — Real-time via FIX/API  │   │
│  │  ■ Order Management System     — Real-time via API       │   │
│  │  ■ Account Master              — Daily batch via SQL      │   │
│  │  ■ Customer Profiles           — Daily batch via SQL      │   │
│  │  ■ Employee/Affiliate Register — Daily batch via HR API   │   │
│  │  ■ Restricted List             — Real-time via API        │   │
│  │  ■ Wire Transfer System        — Real-time via SWIFT/API  │   │
│  │  ■ Communication Archive       — Daily batch via IMAP/API │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  EXCHANGE / MARKET DATA (Licensed by Axos)                      │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  ■ Bloomberg Terminal / B-PIPE  — Real-time market data   │   │
│  │  ■ Reuters/Refinitiv Eikon     — Real-time market data    │   │
│  │  ■ NYSE/NASDAQ direct feeds    — Level 2 order book       │   │
│  │  ■ NBBO data                   — Best bid/offer           │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  REFERENCE DATA                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  ■ Security Master (CUSIP/SEDOL/ISIN)                    │   │
│  │  ■ Corporate Actions Calendar                             │   │
│  │  ■ OFAC/SDN Sanctions List     — Daily update from OFAC   │   │
│  │  ■ FATF Country Risk List      — Monthly update           │   │
│  │  ■ Peer Execution Data (FINRA ATS)                       │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  REGULATORY DATA                                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  ■ FinCEN data (SAR status, CTR history)                 │   │
│  │  ■ SEC EDGAR (corporate filings, insider trades)         │   │
│  │  ■ FINRA BrokerCheck data                                │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Unified Trade Event Schema

All data sources are normalized into a unified event schema:

```json
{
  "trade_event": {
    "event_id": "TRD-2026-0204-004521",
    "event_type": "EXECUTION",
    "timestamp": "2026-02-04T10:23:45.123Z",
    "account": {
      "account_id": "ACC-789012",
      "account_type": "individual_brokerage",
      "is_employee": false,
      "is_affiliate": false,
      "risk_profile": "moderate",
      "discretionary": false
    },
    "security": {
      "symbol": "AAPL",
      "cusip": "037833100",
      "security_type": "equity",
      "exchange": "NASDAQ"
    },
    "order": {
      "order_id": "ORD-2026-0204-009876",
      "side": "BUY",
      "quantity": 500,
      "order_type": "limit",
      "limit_price": 185.50,
      "time_in_force": "DAY"
    },
    "execution": {
      "fill_price": 185.48,
      "fill_quantity": 500,
      "venue": "NASDAQ",
      "nbbo_at_execution": { "bid": 185.47, "ask": 185.49 },
      "price_improvement_cents": 1
    },
    "enrichment": {
      "restricted_list_check": false,
      "corporate_action_proximity_days": null,
      "ofac_check": "CLEAR",
      "related_accounts": []
    }
  }
}
```

**Data Residency:** All market data is processed and stored on-premise. Bloomberg and Reuters data feeds terminate at Axos's market data infrastructure — the surveillance system connects to Axos's local data stores, not to external APIs.

---

## 8.4 Component C: Daily Alert Engine

### End-to-End Alert Flow

```
PHASE 1: RULE EVALUATION (Daily 6:00 AM ET — Batch)
  │
  ├── Load previous day's trade data (T-1)
  ├── Load real-time data accumulated since last batch
  ├── For each of 12 rules:
  │   ├── Apply rule conditions to trade universe
  │   ├── Generate raw alerts (typically 200-500 per day)
  │   └── Attach rule metadata (rule_id, severity, conditions matched)
  │
  └── Raw alert count: ~350 (typical day)

PHASE 2: ALERT TRIAGE (Automated — 6:15 AM ET)
  │
  ├── De-duplication
  │   ├── Same account + same security + same rule within 24h → merge into single alert
  │   └── Reduces count by ~30% (350 → ~245)
  │
  ├── False Positive Pre-Filter
  │   ├── Check against known false positive patterns (maintained by compliance)
  │   ├── Check 10b5-1 plan exclusions
  │   ├── Check index fund rebalancing exclusions
  │   ├── Check DRIP exclusions
  │   └── Reduces count by ~40% (245 → ~147)
  │
  ├── ML Priority Scoring
  │   ├── Each alert scored 0-100 by ML model trained on historical disposition data
  │   ├── Features: rule type, account history, trade size, timing, market context
  │   ├── Model: Gradient Boosted Trees (XGBoost, trained on 18 months of historical alerts)
  │   └── Output: Prioritized alert queue
  │
  ├── Severity Classification
  │   ├── CRITICAL: Score ≥ 85 OR rule severity = CRITICAL → 5-10 per day
  │   ├── HIGH: Score 65-84 → 15-25 per day
  │   ├── MEDIUM: Score 40-64 → 40-60 per day
  │   └── LOW: Score < 40 → 50-80 per day (auto-documented, human review optional)
  │
  └── Triaged alert count: ~147 (CRITICAL: 7, HIGH: 20, MEDIUM: 50, LOW: 70)

PHASE 3: AI-DRIVEN INVESTIGATION (7:00 AM ET — Analyst begins review)
  │
  ├── For each CRITICAL / HIGH alert:
  │   │
  │   ├── Step 1: Context Gathering (AI-automated)
  │   │   ├── Pull 90-day trading history for the account
  │   │   ├── Pull account profile and risk assessment
  │   │   ├── Pull related accounts and relationship map
  │   │   ├── Pull relevant communications (if Rule 12 triggered)
  │   │   ├── Pull market data context (price movements, volume, news)
  │   │   └── Pull prior alert history for this account
  │   │
  │   ├── Step 2: AI Analysis (Llama 3 70B — local)
  │   │   ├── Analyze trading pattern against rule conditions
  │   │   ├── Identify aggravating factors (multiple rules triggered, prior alerts)
  │   │   ├── Identify mitigating factors (pre-approved plan, market-wide movement)
  │   │   ├── Compare against similar historical cases and their dispositions
  │   │   └── Generate structured investigation narrative
  │   │
  │   ├── Step 3: Investigation Narrative (AI-drafted, human-reviewed)
  │   │   └── See sample below
  │   │
  │   └── Step 4: Analyst Review & Disposition
  │       ├── Options: (a) Close — No Action, (b) Close — Documented, (c) Escalate,
  │       │            (d) Refer to SAR Filing, (e) Refer to Legal
  │       └── Analyst adds comments, approves or modifies AI narrative
  │
  └── Average investigation time: 15 min/alert (AI-assisted) vs. 45-60 min (manual)

PHASE 4: SAR FILING (If warranted)
  │
  ├── AI Draft SAR Narrative
  │   ├── Populate FinCEN SAR form fields automatically
  │   ├── Generate narrative section using investigation findings
  │   ├── Map activity to FinCEN suspicious activity categories
  │   └── Compile supporting evidence package
  │
  ├── Dual-Approval Gate
  │   ├── First review: Investigating analyst
  │   ├── Second review: BSA Officer or designated approver
  │   └── Both must approve before filing
  │
  ├── FinCEN Filing
  │   ├── Submit via FinCEN BSA E-Filing System (API or batch upload)
  │   ├── Receive FinCEN acknowledgment number
  │   └── Store in immutable audit log with hash chain
  │
  └── Post-Filing Monitoring
      ├── Account placed on enhanced monitoring list
      ├── Subsequent alerts for this account auto-escalated to HIGH
      └── 90-day follow-up review scheduled
```

### Sample Investigation Narrative (AI-Generated)

```
INVESTIGATION REPORT
Alert ID: MSR-ALT-2026-0204-0031
Rule Triggered: MSR-001 (Insider Trading Detection)
Severity: HIGH
Account: ACC-456789 (John Doe, Individual Brokerage)
Date: February 4, 2026

SUMMARY:
On January 28, 2026, account ACC-456789 (John Doe) purchased 2,500 shares
of XYZ Corp (CUSIP: 123456789) at $45.20/share ($113,000 total). On
February 3, 2026, XYZ Corp announced a merger agreement with ABC Holdings
at $62.00/share. Mr. Doe's position increased in value by approximately
$42,000 (37.2%) in 6 calendar days.

RULE CONDITIONS MET:
■ Trade occurred within 14-day pre-announcement window (6 days before)
■ Account holder is NOT an Axos employee but IS flagged as an affiliate
  (spouse of board member Sarah Doe)
■ XYZ Corp was NOT on the restricted list at time of trade (added Feb 1)

AGGRAVATING FACTORS:
■ Mr. Doe has no prior trading history in XYZ Corp (first-time purchase)
■ Trade size ($113K) is 3.2× his average trade size ($35K)
■ No analyst coverage or research reports available that would explain
  the investment thesis
■ Mrs. Doe (board member) attended a board meeting on January 25, 2026
  where the merger was discussed (per board meeting minutes)

MITIGATING FACTORS:
■ XYZ Corp was covered in several financial media articles in January
  speculating about M&A activity in the sector
■ Mr. Doe's account shows a general pattern of value investing
  (buys during dips)
■ XYZ Corp's stock had declined 12% in the prior 30 days, consistent
  with a value thesis

AI RECOMMENDATION: ESCALATE to Legal/Compliance for further investigation.
The combination of affiliate status, first-time purchase, timing relative
to board meeting, and pre-announcement window warrants deeper review of
potential MNPI access.

DISPOSITION OPTIONS:
[ ] Close — No Action (with documented rationale)
[ ] Close — Documented Concern (monitoring enhanced)
[✓] Escalate to Legal/Compliance
[ ] Refer to SAR Filing
[ ] Refer to External Counsel
```

---

## 8.5 Key Differentiators for Market Surveillance

| Capability | Goldenflitch Approach | Significance |
|------------|----------------------|--------------|
| **NLP on local LLM** | Rule 12 (Communication Surveillance) uses Llama 3 70B locally | Employee communications never leave Axos's perimeter. Competitor solutions using cloud LLMs would send email/chat content to external APIs. |
| **Investigation narratives** | AI-generated by local Llama 3 70B | High-quality investigation writing without data egress. |
| **SAR drafting** | AI pre-populates FinCEN form + narrative | Reduces SAR preparation from 4-6 hours to 30-60 minutes. Dual-approval gate ensures human oversight. |
| **Configurable rules** | YAML-based, no-code, version-controlled | Compliance team can modify rules without IT involvement. Every change is audited. |
| **ML priority scoring** | XGBoost trained on historical dispositions | Reduces analyst workload by 60-70% by filtering low-priority alerts. Model retrains monthly on new disposition data. |

---

## 8.6 Implementation Timeline for Market Surveillance

| Phase | Timeline | Deliverables |
|-------|----------|-------------|
| Phase 2a: Foundation | Months 5-6 | Rule engine deployment (12 rules), internal data connectors, alert generation |
| Phase 2b: Enhancement | Months 6-7 | Market data integration, ML priority scoring, investigation workflow |
| Phase 2c: SAR Automation | Month 7 | SAR drafting, FinCEN API integration, dual-approval workflow |
| Ongoing | Month 8+ | Rule tuning based on false positive rates, model retraining, new rule development |

---

*← Back to `07-Agent-4-Supervisory-Agent.md` | Next: `09-Extension-Capabilities.md` →*
