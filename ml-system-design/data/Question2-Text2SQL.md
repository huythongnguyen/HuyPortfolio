# Question 2: Text2SQL System

## Problem Statement
Design a system converting natural language questions to executable SQL queries for enterprise data warehouses (Snowflake, BigQuery). Support 1000+ table schemas, complex JOINs, ensure safety (prevent SQL injection), achieve 85%+ execution accuracy.

---

## L5 Answer (Senior ML Engineer)

### Clarification Questions
- Database scale? (Tables, columns, daily query volume)
- User expertise? (Technical vs non-technical users)
- Latency SLA? (<500ms for BI tools)
- Safety requirements? (Read-only vs allow temp tables)
- Existing semantic models? (DBT, Tableau metadata)

### High-Level Architecture
```
User Query → Schema Retriever → LLM Generator → SQL Validator → DB Executor
                ↓                     ↓                ↓
           Vector DB            GPT-4/Llama        AST Parser
```

### Model Selection
- **Choice:** Fine-tuned Llama 3 70B on Spider dataset
- **Rationale:** 85% execution accuracy, open-source (cost control), 128K context for large schemas
- **Alternative:** GPT-4 via API (faster MVP, 90% accuracy, $0.03/1K tokens)

### Schema Linking Strategy
- Embed schema (tables, columns, descriptions) using bge-large-en-v1.5
- Store in Pinecone/Weaviate (vector DB)
- Retrieve top-k relevant tables via cosine similarity
- **Why:** Schema linking errors cause >60% failures (LinkAlign paper)

### Query Validation
- Parse generated SQL using sqlparse (Python)
- Check: SELECT-only, no DROP/DELETE/ALTER
- Prepared statements to prevent injection
- Execute in isolated read-only account

### Evaluation Metrics
- Execution accuracy >85% (query runs + returns correct result)
- SQL validity >95% (parses without syntax error)
- Latency <500ms (interactive BI requirement)
- False positive rate <5% (safe queries rejected)

### Tradeoffs
- **Fine-tuning vs Prompt Engineering:** 90% accuracy (7 days training) vs 70% (hours to implement)
- **Model Size:** 70B (better) vs 3B (faster, cheaper, 60% accuracy)
- **Safety:** Strict (SELECT-only, safe) vs Permissive (allow CTEs, riskier)

---

## L6 Answer (Staff ML Engineer)

### Production-Oriented Clarifications
- Schema evolution frequency? (Weekly updates require hot-reload strategy)
- Multi-database scenario? (Federate queries across Snowflake + BigQuery?)
- Compliance needs? (Audit logging, row-level security enforcement)
- Existing query patterns? (Train on historical queries for in-context learning)

### Architecture (Production System)

**Two-Stage Pipeline:**
```
Query → Intent Classification → Schema Linking → Query Generation → Validation → Execution
  ↓           ↓                       ↓                 ↓              ↓           ↓
Simple    Complexity         bge-large-en-v1.5    Llama 3 70B    AST Parser   Sandbox
Complex   Routing            (Weaviate)           Fine-tuned     (sqlparse)   (Docker)
```

**Schema Linking Deep Dive (Critical Bottleneck):**
- **Problem:** >60% failures due to wrong table/column selection
- **Solution:** LinkAlign framework
  - Database retrieval (multi-DB filter via embedding similarity)
  - Schema grounding (column-level retrieval, handle 1000+ columns)
  - Achieves: Spider 86.4%, BIRD 83.4%
- **Tech:** Pre-compute embeddings nightly, cache in Weaviate, top-15 retrieval

### Fine-Tuning Strategy (Production Standard 2024+)

**Dataset:** Spider 2.0 (600 enterprise workflows) + internal query logs
**Training:**
- Supervised fine-tuning on Llama 3 70B (7 days, 8xA100)
- Few-shot in-context learning (5 examples per query)
- Execution-guided self-correction (retry if query fails)
- **Cost:** $2K training (one-time) vs $0.03/query ongoing API cost

**Why fine-tuning vs prompt engineering:**
- Accuracy: 85-90% vs 65-75%
- Latency: 200-500ms vs 100-200ms (larger model overhead acceptable for quality)
- Decision: Fine-tune for production, use prompting for rapid prototyping

### Safety Architecture (Multi-Layer)

**Defense in Depth:**
1. **AST Parsing:** tree-sitter-sql (detects injection patterns keyword filters miss)
2. **Parameterized Queries:** Bind variables prevent injection via user input
3. **DB Privileges:** Query account SELECT-only on analytics views
4. **Execution Sandbox:** Docker containers, prevent lateral movement
5. **Audit Logging:** All queries logged, compliance requirement

**Why AST vs regex:**
- Regex: Brittle, bypassed via encoding tricks (e.g., `DR/**/OP`)
- AST: Structural validation, catches malicious patterns reliably
- **Observation:** 6.7% OSS CVEs are SQL injection (CISA 2024), requires design-phase elimination

### Production Challenges (Shipped Experience)

**Challenge: Schema Drift**
- **Problem:** Weekly table additions break embeddings
- **Solution:** Hot-reload embedding cache, version semantic models, monitor embedding staleness
- **Metrics:** Re-embed schemas nightly, <5 min downtime, A/B test accuracy impact

**Challenge: Complex JOINs**
- **Problem:** LLMs confuse foreign key relationships
- **Solution:** Explicit join paths in schema metadata, graph representation of tables
- **Result:** JOIN accuracy improved from 65% → 82%

**Challenge: Ambiguity ("Q3 sales")**
- **Solution:** Semantic models (Snowflake YAML) normalize to fiscal_quarter, user confirmation prompt
- **Tradeoff:** UX friction vs accuracy (chose accuracy for enterprise)

---

## L7 Answer (Senior Staff ML Engineer)

### Strategic Assumptions & Scope

**Scale:** 10K queries/day across 100+ databases, 12-month initiative, 4-engineer team
**Business Context:** Replace Tableau manual SQL writing (save 20 hrs/week per analyst)
**Critical Success Metric:** 90%+ execution accuracy (below triggers user abandonment)

### Multi-Year Roadmap

**Phase 1 (MVP, 3 months):** Single-DB, prompt engineering, 70% accuracy
**Phase 2 (Production, 6 months):** Fine-tuned model, 85% accuracy, schema linking
**Phase 3 (Enterprise, 12 months):** Multi-DB federation, 90% accuracy, self-correction

### Cost-Efficiency Architecture

**Hybrid Model Strategy (Cost Optimization):**
```python
if query_complexity < 0.3:  # Simple SELECT, 1-2 tables
    route_to(llama_3b)  # $0.2/M tokens, 60% accuracy, <200ms
elif query_complexity < 0.7:
    route_to(llama_70b)  # $1/M tokens, 85% accuracy, <500ms
else:  # Complex JOINs, subqueries
    route_to(gpt4_finetuned)  # $0.03/1K tokens, 90% accuracy, <1s
```

**Cost Analysis:**
- 10K queries/day, 90% to 3B, 7% to 70B, 3% to GPT-4
- Daily cost: $0.02 (3B) + $0.70 (70B) + $9 (GPT-4) = ~$10/day = $300/month
- vs GPT-4 only: ~$300/day = $9K/month (96.7% savings)

**Break-Even Analysis (Self-Hosted):**
- Self-hosted 70B: 8xA100 = $4K/month vs $21/month API cost (70B tier)
- Decision: API until >50K queries/day, then consider self-host

### Technical Risk Matrix

| Risk | Impact | Mitigation | Owner |
|------|--------|-----------|-------|
| Schema drift breaks prod | High | Nightly embedding refresh, canary test queries, rollback | Data Eng |
| SQL injection (legal exposure) | Critical | AST parser, prepared statements, pen-test quarterly | Security |
| Fine-tuning degrades <80% | High | Holdout validation, shadow deployment, A/B test 2 weeks | ML Lead |
| Query latency >1s (BI UX) | Medium | Model routing, caching common queries, Llama 3B tier | ML Eng |

### Org-Wide Dependencies

**Product:** Define "correct" query (semantic vs syntactic match)
**Data Eng:** Schema metadata quality (descriptions, examples, FK relationships)
**Security:** Approve AST validation rules, conduct pen-testing
**Legal:** Data access logging (GDPR compliance), audit trail retention

### Strategic Decisions (Deep Why)

**Why fine-tuning over prompt engineering long-term:**
- Accuracy ceiling: Prompting plateaus at 75%, fine-tuning reaches 90%
- Cost: $2K one-time vs $0.03/query adds up (break-even at 70K queries)
- IP protection: Model weights on-prem (vs queries sent to OpenAI)
- Decision: Prompt for MVP validation, fine-tune post-PMF

**Why Llama 3 over CodeLlama:**
- Spider 2.0 benchmark: Llama 3 70B fine-tuned = 85%, CodeLlama 34B = 78%
- Context window: 128K (Llama) vs 16K (CodeLlama) handles large schemas
- Community: Llama 3 better fine-tuning recipes, broader support

**Why bge-large-en-v1.5 over OpenAI embeddings:**
- Accuracy: LinkAlign shows bge achieves 86.4% vs ada-002 at 81%
- Cost: Open-source (free inference) vs $0.0001/1K tokens
- Privacy: On-prem embeddings (compliance requirement)

**Unresolved Strategic Questions:**
1. Multi-cloud embedding sync strategy (Snowflake + BigQuery metadata divergence)
2. Real-time user feedback for active learning (vs batch retraining quarterly)
3. Cross-database federation (JOIN across Snowflake + Postgres) cost-benefit
