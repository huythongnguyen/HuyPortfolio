# Question 3: GenAI APIs System

## Problem Statement
Design a system to serve LLM inference at scale (like OpenAI API, Anthropic API). Support 1B+ tokens/day, <500ms latency, handle streaming + batching, implement safety layers, optimize cost, prevent abuse.

---

## L5 Answer (Senior ML Engineer)

### Clarification Questions
- Expected traffic? (Requests/sec, tokens/day)
- Model requirements? (GPT-4 class, smaller models)
- Latency SLA? (<500ms p99)
- Safety requirements? (Content moderation, PII filtering)
- Multi-tenancy? (Rate limits per user, billing)

### High-Level Architecture
```
API Gateway → Load Balancer → Inference Cluster → Model Serving
    ↓             ↓                   ↓                 ↓
Rate Limit   Route Requests      vLLM Servers      GPU Pool
```

**Components:**
- **Gateway:** Handle auth, rate limiting, token counting
- **Inference:** vLLM V1 for continuous batching (3-4x throughput)
- **GPUs:** A100 pool with PagedAttention (50% memory savings)
- **Monitoring:** Latency, throughput, cost tracking

### Model Serving
- **Choice:** vLLM for serving (vs TensorRT-LLM, Text Generation Inference)
- **Rationale:** Continuous batching (60+ tokens/sec on A100), PagedAttention reduces OOM, production-proven
- **Batching:** Continuous vs static (requests exit mid-inference, 3-4x throughput gain)

### Safety Layers
- **Input:** Prompt injection detection, jailbreak filtering
- **Output:** Content moderation (hate speech, violence detection)
- **Tools:** Lakera Guard for prompt injection, OpenAI Moderation API

### Cost Optimization
- Token counting (track input/output separately, output 2-5x costlier)
- Prompt caching (75% cost reduction for reused context)
- Model routing (90% queries to small models, 10% to large)

### Evaluation Metrics
- Latency: TTFT <100ms, inter-token <50ms, p99 <500ms
- Throughput: Tokens/sec per GPU
- Cost: Per-request, per-token
- Safety: PII detection F1, toxicity rate

### Tradeoffs
- **Streaming vs Batch:** Real-time (better UX) vs batch (50% discount, 24h delay)
- **Model Size:** Large (quality) vs small (cost, latency)
- **Safety:** Strict filtering (safe, 10% FP) vs permissive (risky, better UX)

---

## L6 Answer (Staff ML Engineer)

### Production-Specific Clarifications
- Peak traffic patterns? (Burst capacity 2x average? Auto-scaling strategy)
- GPU availability? (Shortages? Multi-cloud strategy like Anthropic)
- Compliance? (Data residency EU/US, HIPAA, SOC2)
- Billing model? (Per-token, per-request, subscription tiers)

### Architecture (Production-Grade)

**Disaggregated Prefill/Decode (2025 Pattern):**
```
Request → Classifier → Route
                         ↓
         ┌───────────────┴───────────────┐
         ↓                                ↓
  Prefill Cluster                   Decode Cluster
  (Compute-bound)                   (Memory-bound)
  A100 80GB                         A100 40GB
  Batch=32                          Batch=128
         ↓                                ↓
         └───────────────┬───────────────┘
                         ↓
                   Response Streaming
```

**Why Disaggregation:**
- Prefill: Compute-bound (high FLOPS), benefits from larger batches
- Decode: Memory-bound (KV cache), benefits from smaller GPUs
- **Result:** 1.7x speedup (vLLM V1 benchmarks), 40% cost reduction

### Infrastructure Deep Dive

**GPU Allocation:**
- Dedicated pools per model tier (Claude Haiku, Sonnet, Opus)
- PagedAttention: Virtual memory-style KV cache blocks (50% waste reduction)
- Dynamic batching: Requests added/removed mid-inference

**Multi-Cloud Strategy (Anthropic Pattern):**
- Split workloads: GCP (primary), AWS (overflow), Azure (Europe residency)
- **Why:** Avoid single-vendor GPU shortages, redundancy, geo-compliance
- **Observation:** 2024 H100 shortages forced multi-cloud for 99.9% uptime

### Safety Architecture (Production)

**Three-Layer Defense:**
1. **Input Layer:** Prompt injection (Lakera Guard, 82% attack reduction), jailbreak filtering
2. **Processing:** PII scrubbing pre-model (F1≈0.95), context length limits
3. **Output Layer:** Content moderation (hate speech, violence), hallucination checks (optional)

**Tools:** Lakera Guard (real-time), AWS Bedrock Guardrails, OpenAI Moderation API (async)
**Metrics:** 75% toxic output reduction, <5% false positive rate

### Cost Optimization (Deep)

**Token Economics:**
- Count input/output separately (output 2-5x multiplier)
- Output limits > input reduction (focus optimization efforts)
- **2025 Pricing:** $0.25-$15/M input, $1.25-$75/M output

**Caching Strategy:**
```python
# Prompt caching (75% reduction)
cache_prefix = system_prompt + context_docs  # Reused across requests
if cache_hit(cache_prefix):
    cost_reduction = 0.75

# Semantic caching (86% reduction per AWS study)
if semantic_similarity(query, cached_query) > 0.95:
    return cached_response
```

**Model Routing (87% Cost Savings):**
- 90% queries → Mistral 7B ($0.2/M)
- 7% queries → Claude Haiku ($0.25/M)
- 3% complex → Claude Sonnet ($3/M)

### Production Experience

"At [Company], shipped GenAI API serving 500M tokens/day:
1. Disaggregated P/D reduced latency p99 from 800ms → 450ms
2. Prompt caching saved $15K/month (60% reduction)
3. Multi-cloud prevented 3 outages (GPU shortages GCP→AWS failover)
4. Lakera Guard blocked 12K+ jailbreak attempts/week (82% attack rate)"

---

## L7 Answer (Senior Staff ML Engineer)

### Strategic Scope

**Scale:** 1B tokens/day, 100K concurrent users, multi-year initiative
**Business:** API-first SaaS ($0.25/M input, $1.25/M output pricing, target 40% gross margin)
**Team:** 8 engineers (2 ML, 3 infra, 2 platform, 1 security)

### Multi-Year Roadmap

**Phase 1 (MVP, 4 months):** Single model (Claude Haiku), basic rate limiting
**Phase 2 (Scale, 8 months):** Model routing, caching, batch API, 99.9% uptime
**Phase 3 (Enterprise, 16 months):** Multi-cloud, custom models, compliance (HIPAA, SOC2)

### Cost-Efficiency at Scale

**Infrastructure Cost Breakdown ($100K/month at 1B tokens/day):**
- GPU compute: $60K (40x A100 80GB @ $1.5K/month)
- Networking: $15K (egress, regional peering)
- Storage: $5K (KV cache state, logs)
- Monitoring: $3K (Prometheus, Grafana, Datadog)
- Safety: $7K (Lakera Guard, moderation APIs)
- Multi-cloud overhead: $10K (redundancy, failover)

**Revenue: $1.25M/month (1B tokens @ $1.25/M output) → 92% gross margin**

**Why not 100% self-hosted:**
- Break-even: 1B tokens/day justifies GPU cluster vs API resale
- Ops burden: 24/7 on-call, GPU cluster management vs API
- Decision: Hybrid (self-host base models, upstream GPT-4 for premium tier)

### Technical Risk & Mitigation (Board-Level)

| Risk | Financial Impact | Probability | Mitigation | Budget |
|------|------------------|-------------|-----------|---------|
| GPU shortage (H100 supply) | $50K/month lost revenue | 20% | Multi-cloud (GCP+AWS+Azure), 6-month contracts | $10K/mo |
| KV cache OOM crash | 99.9%→99% uptime (-$125K SLA) | 15% | Disaggregated P/D, PagedAttention, strict limits | $0 |
| Jailbreak → legal exposure | $500K+ (reputation, lawsuit) | 5% | Lakera Guard, content moderation, insurance | $7K/mo |
| Cost runaway (2x spike) | -20% margin | 10% | Hard token limits/user, billing alerts, circuit breaker | $0 |

### Org-Wide Impact

**Cross-Functional Coordination:**
- **Sales:** Enterprise SLA tiers (99.9% vs 99.5%, pricing delta)
- **Legal:** Data residency (EU servers for GDPR), audit logging (7-year retention)
- **Finance:** Gross margin targets (40% minimum), dynamic pricing based on GPU costs
- **Security:** Quarterly pen-testing, SOC2 compliance timeline (18 months)

### Strategic Decisions (Deep Why)

**Why vLLM over TensorRT-LLM:**
- Maturity: vLLM production-proven (Anthropic, Anyscale), TRT-LLM experimental
- Continuous batching: vLLM V1 delivers 1.7x speedup, TRT lacks this feature
- Community: 10K+ GitHub stars, active issues resolution
- Decision: vLLM until TRT-LLM matures (revisit Q3 2025)

**Why multi-cloud over single-vendor:**
- Risk: 2024 H100 shortages caused 2-week delays on GCP
- Cost: AWS spot instances 40% cheaper for overflow traffic
- Compliance: Azure required for EU data residency (GDPR)
- Decision: GCP primary (60%), AWS overflow (30%), Azure EU (10%)

**Why disaggregated P/D:**
- Latency: TTFT <100ms critical for UX (1.7x faster)
- Cost: Prefill uses 80GB GPUs (expensive), decode uses 40GB (cheaper)
- Complexity: Requires state transfer between clusters (+50 lines code)
- Decision: Complexity justified by 40% cost reduction at 1B tokens/day

**Unresolved Strategic Questions:**
1. When to build custom silicon (Google TPU model) vs continue GPU reliance?
2. On-device edge deployment for latency-critical apps (vs cloud-only)?
3. Multi-modal API expansion timeline (image/video inputs)?
