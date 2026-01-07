# Question 1: Chat Summary System

## Problem Statement
Design a system to summarize Slack/Discord/Teams chat conversations. Support on-demand thread summaries (<2s) and daily digests (batch processing). Handle 10K+ messages/day per workspace, maintain factuality, extract action items and decisions.

---

## L5 Answer (Senior ML Engineer)

### Clarification Questions
- What's the expected message volume? (10K+/day confirmed)
- Latency requirements? (<2s on-demand, 1-5min batch)
- Thread length distribution? (50-5000 messages)
- Language support? (English primary, multilingual optional)
- Privacy constraints? (PII handling, data residency)

### High-Level Design
```
Chat API → Kafka Queue → Preprocessing → Summarization Service → Cache/DB
                                              ↓
                                        Claude-3.5-Haiku
```

**Components:**
- **Ingestion:** Kafka for streaming (ordering guarantee)
- **Storage:** PostgreSQL for conversation state, Redis cache (24h TTL)
- **Model:** Claude-3.5-Haiku for cost efficiency
- **API:** FastAPI endpoint for on-demand, CronJob for batch

### Model Selection
- **Choice:** Claude-3.5-Haiku (200K context window)
- **Rationale:** Balance cost ($0.25/M input) vs quality, handles long threads, abstractive summarization
- **Alternative:** Llama 3.2 3B for on-prem deployment (privacy-critical orgs)

### Data Pipeline
1. Message deduplication (hash-based)
2. Thread grouping (thread_id)
3. Semantic chunking (300-500 tokens, sentence-transformers)
4. Context compression (metadata extraction)

### Evaluation Metrics
- ROUGE-1/L >0.35 (n-gram overlap)
- BERTScore >0.85 (semantic similarity)
- Latency p99 <2s
- Cost <$0.01/summary

### Tradeoffs
- **Small vs Large Models:** Haiku (fast, cheap) vs Sonnet (better quality, 5x cost)
- **Chunking Strategy:** Fixed (simple) vs semantic (better quality, +30% ROUGE)
- **Caching:** Redis vs DynamoDB (speed vs durability)

---

## L6 Answer (Staff ML Engineer)

### Strategic Clarifications
- Scale trajectory? (10K→100K msgs/day in 6 months? Affects architecture)
- Business-critical use cases? (Legal compliance needs hallucination <1%)
- Existing infra? (Cloud provider, GPU availability, budget constraints)
- Success metrics alignment? (User satisfaction, time saved, decision quality)

### Architecture (Production-Grade)

**Hybrid Streaming + Batch:**
```
Slack API → Kafka (1h buffer) → Chunking Service → Model Router → Cache Layer
                                       ↓                  ↓
                                  PostgreSQL         Haiku (95%)
                                                     Sonnet (5%)
```

**Why Kafka vs alternatives:**
- Kafka: Exactly-once semantics, replayability for debugging, proven at scale (Discord uses for 1B+ msgs/day)
- vs RabbitMQ: Lower throughput, no built-in replay
- vs Pub/Sub: Vendor lock-in, cost unpredictable at scale

**Model Routing Strategy (Cost Optimization):**
```python
if token_count < 3000 and complexity_score < 0.4:
    route_to("claude-3.5-haiku")  # 99% cost reduction
elif high_stakes or token_count > 200K:
    route_to("claude-3.5-sonnet") + HHEM_verification
else:
    map_reduce_pattern()  # Recursive summarization
```

### Deep Tech Choices

**Chunking: Semantic vs Fixed**
- **Decision:** Semantic chunking via sentence-transformers
- **Why:** 30% ROUGE improvement, handles variable message length
- **Cost:** +50ms latency, acceptable for 2s SLA
- **Implementation:** Encode messages, split at similarity drop >0.3 threshold

**Hallucination Mitigation (Production-Critical):**
- SCRPO training (self-critique framework, 20-30% reduction, zero inference overhead)
- HHEM evaluation model (Vectara, <2% false positive rate)
- Grounding verification (sentence-level source attribution)
- **Observation:** Small models hallucinate 20-30% less than large LLMs on factual extraction

### Failure Modes & Handling
- Timeout (>5s): Extractive fallback (top-N sentence selection)
- Hallucination detected: Flag for human review, don't auto-serve
- Cost spike (>$100/day): Circuit breaker, alert, queue backlog
- Cache miss spike: Scale Redis replicas, investigate invalidation pattern

### Production Experience
"At [Company], shipped similar system processing 50K+ messages/day. Key learnings:
1. Model routing saved 87% cost vs Claude-3.5-Sonnet-only
2. Semantic chunking required A/B test to validate ROUGE gain
3. Redis cache hit rate >60% critical for cost control
4. HHEM <2% hallucination threshold validated via human eval (500 samples)"

---

## L7 Answer (Senior Staff ML Engineer)

### Strategic Decision Framework

**Immediate Assumptions (Justify Later):**
- Assume 100K msgs/day scale within 12 months (plan for 10x growth)
- Critical path: hallucination <1% (legal/compliance orgs)
- Cost constraint: <$500/month infra budget (startup scenario)
- Multi-tenant: 50+ workspaces, privacy isolation required

### System Architecture (Multi-Year Initiative)

**Phase 1 (MVP, 3 months):** Single-model Haiku + basic caching
**Phase 2 (Scale, 6 months):** Model routing, batch optimization, HHEM integration
**Phase 3 (Advanced, 12 months):** Cross-channel decision threading, multilingual

```
Edge: Rate Limiting → Gateway: Model Router → Orchestrator
                                                    ↓
                     ┌──────────────────────────────┴──────────────┐
                     ↓                                              ↓
              Haiku Cluster (95%)                         Sonnet Pool (5%)
              - Spot instances                            - On-demand GPUs
              - KV-cache reuse                            - HHEM verification
              - Batch processing                          - Priority queue
                     ↓                                              ↓
                     └─────────────────┬──────────────────────────┘
                                       ↓
                             Multi-Tier Cache (Redis + S3)
```

### Deep Cost/Efficiency Analysis

**Budget Breakdown ($500/month):**
- Claude API: $150 (15M tokens/month, 95% Haiku routing)
- Redis: $50 (ElastiCache r6g.large)
- PostgreSQL: $80 (RDS db.t4g.medium)
- Kafka: $70 (MSK t3.small x2)
- Monitoring: $30 (CloudWatch + Datadog lite)
- Buffer: $120

**Cost Optimization Levers (Priority Order):**
1. Model routing (87% savings proven)
2. Prompt caching (75% reduction for repeated threads)
3. Batch API (50% discount on async digests)
4. Context compression (Map-Reduce for >200K token threads)

**Why not self-hosted LLM:**
- Break-even: ~5M tokens/month for Llama 3 70B (8xA100 = $4K/month vs $150 API)
- Risk: Ops overhead, latency variance, uptime SLA
- Decision: API-first until 30M+ tokens/month

### Technical Risks & Mitigation

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|-----------|
| Hallucination lawsuit | Critical | 5% | HHEM <1%, human-in-loop for legal threads, audit logging |
| Cost overrun (10x spike) | High | 15% | Circuit breaker at $50/day, alert CTO, model downgrade |
| Kafka outage (data loss) | High | 3% | Replication factor 3, S3 backup, 7-day retention |
| Cache stampede | Medium | 20% | Probabilistic early expiration, request coalescing |

### Org-Level Impact

**Cross-Functional Dependencies:**
- **Product:** Define "good summary" via user research (5-week study)
- **Legal:** PII redaction requirements (GDPR/CCPA compliance)
- **Sales:** Enterprise tier differentiation (Haiku vs Sonnet SLA)

**Team Structure (12-month roadmap):**
- ML Lead (own model routing, evaluation)
- ML Engineer (chunking, preprocessing)
- Data Engineer (Kafka, PostgreSQL optimization)
- DevOps (infra, monitoring, cost dashboards)

### Decision Rationale (Strategic)

**Why hybrid streaming+batch vs batch-only:**
- User research: 70% value instant thread summaries (on-demand)
- Cost: Batch digests amortize API calls (50% discount)
- Decision: Hybrid satisfies both UX and cost constraints

**Why Claude vs OpenAI:**
- Context window: 200K (Claude) vs 128K (GPT-4 Turbo)
- Cost: $0.25/M (Haiku) vs $10/M (GPT-4o mini)
- Hallucination: Claude <2% (HHEM leaderboard) vs GPT-4 4-5%

**Unresolved Strategic Questions:**
1. Multi-cloud deployment? (Vendor lock-in vs complexity trade-off)
2. Build vs buy semantic chunking? (LangChain vs custom solution)
3. Real-time user feedback loop for continuous improvement? (10% lift possible but 3-month delay)
