# Question 4: Prompt Suggestion System

## Problem Statement
Design a system suggesting relevant prompts to users (like ChatGPT suggestions, Claude prompt library). Support contextual recommendations, auto-complete, personalization based on user history. <120ms latency, high click-through rate.

---

## L5 Answer (Senior ML Engineer)

### Clarification Questions
- Expected users? (Scale, concurrent usage)
- Prompt library size? (1K, 100K templates)
- Personalization level? (Per-user, per-session)
- Latency SLA? (<120ms confirmed)
- Cold start strategy? (New users)

### High-Level Architecture
```
User Input → Embedding → Candidate Retrieval → Ranking → Top-K
                ↓              ↓                   ↓         ↓
         SBERT model      Vector DB          Neural Ranker  UI
```

**Components:**
- **Embedding:** Sentence-BERT v3 for query encoding
- **Retrieval:** Milvus vector DB (ANN search <20ms)
- **Ranking:** 4-layer MLP (relevance + diversity)
- **Serving:** Redis caching (80% cache hits)

### Model Selection
- **Embedding:** SBERT (384-dim, <10ms inference)
- **Ranking:** Neural ranker (DeepFM, trained on CTR data)
- **Alternative:** LLM-based generation (GPT-3.5, high latency but diverse)

### Ranking Strategy
```
Score = 0.7 * Relevance + 0.15 * Diversity + 0.15 * Freshness
```
- Relevance: Embedding similarity + CTR context match
- Diversity: Penalize similar prompts (DPP)
- Freshness: Boost new high-quality prompts

### Evaluation Metrics
- CTR (click-through rate) >10%
- Adoption rate >5% (user completes task with suggestion)
- Latency p99 <120ms
- Coverage >80% (queries with relevant candidate)

### Tradeoffs
- **Embedding vs LLM:** Fast retrieval vs diverse generation
- **Diversity vs Relevance:** Echo chamber vs user satisfaction
- **Caching vs Real-time:** Latency vs personalization freshness

---

## L6 Answer (Staff ML Engineer)

### Production Clarifications
- Traffic patterns? (Peak 5x average? Auto-scaling)
- User segments? (Technical vs non-technical, different prompt needs)
- Feedback loop? (Implicit clicks vs explicit ratings)
- A/B testing infra? (Multi-armed bandit for prompt ranking)

### Architecture (Two-Stage Production)

**Candidate Generation → Ranking:**
```
Query → Two-Tower Model → ANN Search → Candidate Pool (100-500)
          ↓                    ↓
  User Tower + Prompt Tower   Milvus HNSW
                              (<10ms retrieval)
          ↓
    Ranking Model (DeepFM) → Top-K (80ms inference)
          ↓
    Diversity Re-ranker (DPP) → Final Results
```

**Why Two-Tower:**
- Separate user context encoding + prompt template encoding
- Pre-compute prompt embeddings (batch job nightly)
- Real-time user encoding (low latency)
- **Observation:** Meta/Instagram Explore use identical architecture (proven at scale)

### Ranking Deep Dive

**Neural Ranker (DeepFM):**
- Features: Embedding similarity, conversation history, user profile, temporal signals
- Loss: Listwise LTR (optimizes full ranking order, not pairwise)
- Training: Weekly on click/dwell-time data, online learning for drift

**Multi-Objective Optimization:**
```python
score = 0.70 * relevance_model(query, prompt) \
      + 0.15 * diversity_penalty(prompt, top_k) \
      + 0.15 * freshness_boost(prompt.created_at)
```

**Why Listwise LTR:**
- Pairwise LTR: Ignores ranking order (only pair preference)
- Listwise: Optimizes full top-K order (NDCG metric)
- **Result:** +8% CTR improvement (A/B tested)

### Serving Optimization

**Caching Strategy:**
- **Semantic Cache:** Cache embeddings of recent queries (86% cost reduction)
- **Result Cache:** Popular prompts served from Redis (80% cache hit)
- **Pre-computation:** Batch embed all templates nightly

**Latency Breakdown (<120ms):**
- Embedding generation: <10ms (GPU batch inference)
- ANN search: <20ms (Milvus HNSW, quantization)
- Ranking inference: <80ms (distilled model, TensorFlow Serving)
- Network overhead: <10ms

### Production Challenges

**Cold Start:**
- **Problem:** New users have no history
- **Solution:** Content-based fallback (task type match), hybrid approach (10 interactions threshold)
- **Metrics:** Cold-start CTR 5% vs personalized 12%

**Real-Time Personalization:**
- **Problem:** Model retraining every 24h lags user behavior
- **Solution:** Feature store (Feast) for low-latency lookups, online A/B testing
- **Result:** +15% adoption rate vs batch-only

**Quality Control:**
- Auto-remove toxic/low-CTR prompts (<2% CTR threshold)
- Human review loop for edge cases (weekly 100-sample audit)
- Monitor CTR, completion rate weekly

---

## L7 Answer (Senior Staff ML Engineer)

### Strategic Scope

**Scale:** 10M users, 1B prompts/day, multi-year initiative
**Business:** Drive user engagement (+20% session length), reduce churn (-15%)
**Team:** 6 engineers (2 ML, 2 backend, 1 data, 1 PM)

### Multi-Year Roadmap

**Phase 1 (MVP, 3 months):** Embedding similarity only, popular prompts
**Phase 2 (Personalization, 6 months):** Neural ranker, user history, diversity
**Phase 3 (Advanced, 12 months):** Multi-armed bandit, real-time learning, generative suggestions

### Cost-Efficiency Analysis

**Infrastructure Cost ($15K/month at 1B prompts/day):**
- Embedding inference: $3K (GPU batch serving, 10M embeddings/day)
- Vector DB: $4K (Milvus cluster, 100M vectors)
- Ranking inference: $2K (TensorFlow Serving, CPU-only)
- Redis cache: $3K (ElastiCache r6g.xlarge)
- Monitoring: $1K (Prometheus + Grafana)
- Buffer: $2K

**ROI Calculation:**
- Engagement lift: +20% session length = +15% revenue ($500K/month)
- Cost: $15K/month
- **ROI:** 3,233% (gross profit increase vs infra cost)

### Technical Risk Matrix

| Risk | Impact | Mitigation | Owner |
|------|--------|-----------|-------|
| Diversity collapse (echo chamber) | High (user churn) | DPP re-ranker, A/B test diversity weight | ML Lead |
| Latency p99 >200ms (UX degradation) | Medium | Pre-computation, caching, model distillation | ML Eng |
| Cold start <3% CTR (abandonment) | Medium | Hybrid approach, content fallback, onboarding flow | Data Sci |
| Prompt quality drift (toxic/spam) | High (reputation) | Weekly human audit, auto-removal <2% CTR | Prod Mgr |

### Org-Wide Impact

**Cross-Functional:**
- **Product:** Define "relevant" (user study, 5-week research)
- **Content:** Curate prompt library (200 templates initially, 50/month growth)
- **Legal:** Toxic prompt detection (compliance, brand safety)
- **Analytics:** A/B testing framework (multi-armed bandit)

### Strategic Decisions (Deep Why)

**Why Two-Tower over Single Encoder:**
- Latency: Pre-compute prompt embeddings (batch) vs real-time encoding
- Scale: 100M prompts × 384 dim = 38GB (fits memory) vs 10M users × real-time (infeasible)
- Quality: Separate towers learn user context vs prompt semantics (better representation)
- **Observation:** Instagram Explore uses Two-Tower at 2B+ users

**Why Neural Ranker over Embedding-Only:**
- Embedding: Shallow semantics (cosine similarity)
- Neural: Cross-features (user × prompt interactions, temporal, diversity)
- **A/B Test Result:** +8% CTR (neural) vs baseline (embedding-only)
- Decision: 80ms latency acceptable for +8% engagement

**Why Listwise LTR over Pointwise:**
- Pointwise: Predict relevance independently (ignores order)
- Listwise: Optimize full ranking (NDCG@K metric)
- **Paper:** Listwise LTR outperforms pairwise by 12% NDCG (Cornell study)

**Unresolved Strategic Questions:**
1. Generative prompts (LLM-based) vs retrieval-only (cost-benefit at scale)
2. Multi-modal suggestions (image-based prompts for design tasks)
3. Real-time feedback loop (online learning) vs batch retraining (stability)
