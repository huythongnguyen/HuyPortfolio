# ML System Design Questions
## Level-Specific Answers (L5/L6/L7)

**Date:** 2025-12-28
**Purpose:** Interview preparation guide with progressive depth across seniority levels

---

## Understanding Level Expectations

| Level | Title | Key Distinction |
|-------|-------|-----------------|
| **L5** | Senior ML Engineer | Solid technical execution, justify choices, ask clarifying questions |
| **L6** | Staff ML Engineer | Production experience, deep "why" on tech choices, shipped similar systems |
| **L7** | Senior Staff ML Engineer | Strategic thinking, large-scope initiatives, cost/efficiency optimization at scale |

---

## Interview Questions Overview

This guide contains 5 comprehensive ML system design questions with answers tailored for different seniority levels:

### 1. Chat Summary System
Design a system to summarize Slack/Discord/Teams chat conversations. Support on-demand thread summaries (<2s) and daily digests (batch processing).

### 2. Text2SQL System
Design a system converting natural language questions to executable SQL queries for enterprise data warehouses (Snowflake, BigQuery).

### 3. GenAI APIs System
Design a system to serve LLM inference at scale (like OpenAI API, Anthropic API). Support 1B+ tokens/day, <500ms latency.

### 4. Prompt Suggestion System
Design a system suggesting relevant prompts to users (like ChatGPT suggestions, Claude prompt library). Support contextual recommendations and personalization.

### 5. WordLen (Picture Translation App)
Design a mobile app taking pictures of text and translating in real-time (like Google Lens). Support OCR (100+ languages) and on-device inference.

---

## How to Use This Guide

**For L5 (Senior ML Engineer):**
- Master 6-phase framework (clarification → monitoring)
- Justify all tech choices with reasoning
- Ask detailed clarifying questions
- Present clear tradeoffs

**For L6 (Staff ML Engineer):**
- Demonstrate production experience ("At [Company], shipped X...")
- Deep "why" on tech choices (Kafka vs RabbitMQ, vLLM vs TRT-LLM)
- Quantify tradeoffs with metrics (87% cost savings, +8% CTR)
- Discuss failure modes and handling

**For L7 (Senior Staff ML Engineer):**
- Strategic thinking (multi-year roadmap, phases)
- Cost-efficiency analysis (ROI, gross margin, break-even)
- Org-wide coordination (cross-functional dependencies)
- Risk matrices (financial impact, probability, mitigation)
- Unresolved questions (show depth of thinking)

---

## Cross-Level Comparison Summary

| Dimension | L5 (Senior) | L6 (Staff) | L7 (Senior Staff) |
|-----------|-------------|-----------|------------------|
| **Clarifications** | Ask detailed questions | Production-specific questions | Strategic assumptions + justify |
| **Architecture** | High-level components | Production patterns + why not alternatives | Multi-year roadmap, phases |
| **Tech Choices** | Justify model selection | Deep "why" specific tech over alternatives | Cost-benefit analysis, ROI |
| **Tradeoffs** | Present options | Quantify tradeoffs with metrics | Strategic risk matrix, financial impact |
| **Experience** | Mention relevant knowledge | Cite shipped systems, specific metrics | Org-wide impact, cross-functional coordination |
| **Scope** | Single system | Production system with scale | Multi-year initiative, team structure |
| **Depth** | Correct technical approach | Shipped experience, production pitfalls | Strategic decisions, unresolved questions |

---

**Document Status:** Complete
**Next Review:** 2025-06 (update with new research, benchmarks)
