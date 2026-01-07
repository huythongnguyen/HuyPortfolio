# Question 5: WordLen (Picture Translation App)

## Problem Statement
Design a mobile app taking pictures of text and translating in real-time (like Google Lens). Support OCR (100+ languages), neural translation, on-device inference (offline mode), <500ms latency, handle camera variance (blur, orientation).

---

## L5 Answer (Senior ML Engineer)

### Clarification Questions
- Target platforms? (iOS, Android, both)
- Offline requirement? (Full offline vs online fallback)
- Language coverage? (100+ or top 20)
- Latency SLA? (<500ms confirmed)
- Quality threshold? (OCR accuracy, translation BLEU)

### High-Level Architecture
```
Camera → OCR Model → Language Detection → Translation Model → Display
  ↓          ↓              ↓                    ↓               ↓
Frame   PP-OCRv5       FastText             Llama 3.2 3B     UI
```

**Components:**
- **OCR:** PaddleOCR v5 (9.6MB mobile, 100+ languages)
- **Translation:** Llama 3.2 3B quantized (4-bit, 1.2GB)
- **Language Detection:** FastText (5MB)
- **Deployment:** CoreML (iOS), TFLite (Android)

### Model Selection
- **OCR Choice:** PP-OCRv5
  - **Rationale:** 9.6MB size, 100 languages, 13pp accuracy gain vs v4, handles curved/rotated text
- **Translation Choice:** Llama 3.2 3B (4-bit quantized)
  - **Rationale:** 1.2GB (fits mobile RAM), 68.6% size reduction, <0.5 BLEU loss (INT4 vs FP16)

### Pipeline
1. Frame preprocessing (CLAHE contrast, adaptive binarization)
2. Text detection (CRAFT-style region proposals)
3. OCR recognition (CNN-based character recognition)
4. Language detection (FastText)
5. Translation (quantized NMT model)

### Evaluation Metrics
- OCR: CER <3%, WER on ICDAR benchmarks
- Translation: COMET >0.75, BLEU baseline
- Latency: OCR 50-80ms, translation 200-300ms (cloud) or 400-600ms (edge)
- Model size: <500MB on-device

### Tradeoffs
- **On-Device vs Cloud:** Speed/privacy vs quality
- **Model Size:** 3B (1.2GB) vs 7B (2.8GB, better BLEU, exceeds RAM)
- **Quantization:** INT8 (<0.5 BLEU loss) vs INT4 (2-3 BLEU loss, 50% memory savings)

---

## L6 Answer (Staff ML Engineer)

### Production Clarifications
- User distribution? (High-resource vs low-resource languages)
- Battery constraints? (Continuous scanning vs tap-to-translate)
- Quality SLA? (Consumer vs professional translator accuracy)
- Offline coverage? (All 100 languages or top 20)

### Architecture (Hybrid Edge-Cloud)

**Tiered Deployment Strategy:**
```
Camera Frame → Quality Filter → Edge OCR → Route Decision
                                     ↓              ↓
                                     └──────┬───────┘
                                            ↓
                         ┌──────────────────┴──────────────────┐
                         ↓                                      ↓
                    Edge NMT (Offline)                   Cloud NMT (Online)
                    Llama 3.2 3B (4-bit)                Google Translate API
                    400-600ms, COMET 0.70               200-300ms, COMET 0.85
                         ↓                                      ↓
                         └──────────────────┬──────────────────┘
                                            ↓
                                     Display Result
```

**Routing Logic:**
```python
if offline_mode or latency_critical:
    use_edge_model()
elif low_resource_language(src, tgt):  # <100k parallel sentences
    use_cloud_api()  # Quantized model degrades >3 BLEU
else:
    use_cloud_api()  # Premium quality for online users
```

### OCR Deep Dive (PaddleOCR v5)

**Pipeline:**
1. **Text Detection:** CRAFT-style bounding boxes
2. **Recognition:** CNN-based character-level model
3. **Preprocessing:** CLAHE contrast → adaptive binarization → perspective correction

**Scene Text Challenges:**
- Curved text (street signs, product labels)
- Extreme aspect ratios (vertical signs)
- Blur detection: Pre-filter frames <0.7 sharpness (Laplacian variance)

**Why PP-OCRv5 over Tesseract:**
- Accuracy: 13pp gain on scene text benchmarks
- Size: 9.6MB vs 60MB (Tesseract + language data)
- Speed: 7-10ms on Neural Engine (A17) vs 50-80ms (Tesseract CPU)

### Translation Model Optimization

**Quantization Trade-off:**
- FP16: 12GB, BLEU 32.5, 800-1000ms
- INT8: 6GB, BLEU 32.0 (-0.5), 400-600ms
- INT4: 4GB, BLEU 29.5 (-3.0), 400-600ms
- **Decision:** INT4 for offline (acceptable quality), cloud for premium

**Mobile Deployment:**
- CoreML (iOS): Neural Engine acceleration, 7-10ms OCR
- TFLite (Android): Hardware acceleration, batch size 1
- **Energy:** 4-bit quantization cuts 79% battery vs FP16

### Production Challenges

**Camera Quality Variance:**
- **Problem:** Noise, blur, low-light conditions
- **Solution:** Frame selection (queue 1 frame/sec, pick best sharpness score)
- **Metrics:** Reject frames <0.7 Laplacian variance (blur threshold)

**Orientation Handling:**
- **Problem:** Upside-down text, rotated signs
- **Solution:** EXIF rotation + CTC loss reweighting for rotation invariance
- **Result:** 15% accuracy gain on rotated text

**Low-Resource Languages:**
- **Problem:** Hmong, Kinyarwanda have <10k parallel sentences
- **Solution:** Pivot languages (Hmong→English→Target), multilingual models share parameters
- **Result:** +5 BLEU vs direct pair model (limited data)

**Shipped Experience:**
"At [Company], shipped similar OCR+NMT app (5M+ users):
1. Hybrid edge-cloud reduced latency 43% vs cloud-only (arxiv/2501.18842)
2. 4-bit quantization fit 3B model in 2GB RAM (vs 7B 2.8GB exceeded budget)
3. Frame filtering rejected 60% blurry frames, improved OCR accuracy 12%
4. Pivot translation (low-resource) saved $20K fine-tuning costs"

---

## L7 Answer (Senior Staff ML Engineer)

### Strategic Scope

**Scale:** 10M users, 100M translations/month, multi-year initiative
**Business:** Freemium model (free offline, $5/month premium cloud quality)
**Team:** 7 engineers (2 ML, 2 mobile, 1 backend, 1 data, 1 PM)

### Multi-Year Roadmap

**Phase 1 (MVP, 4 months):** Edge OCR + cloud translation, top 20 languages
**Phase 2 (Offline, 8 months):** Quantized on-device NMT, 50 languages
**Phase 3 (Enterprise, 14 months):** Real-time video translation, AR overlay, 100+ languages

### Cost-Efficiency at Scale

**Infrastructure Cost ($25K/month at 100M translations):**
- Cloud NMT API: $15K (30% use cloud, $0.05/translation)
- Edge models: $0 (on-device, user compute)
- Backend: $5K (API gateway, user management)
- Storage: $2K (user data, logs)
- Monitoring: $1K (Crashlytics, analytics)
- Buffer: $2K

**Revenue: $50K/month (10% conversion, 100K users × $5/month) → 50% gross margin**

**Why Hybrid vs Cloud-Only:**
- User demand: 60% prefer offline (privacy, no data plan)
- Cost: Cloud-only = $75K/month (vs $15K hybrid, 80% savings)
- Latency: Edge 43% faster (arxiv study)
- Decision: Hybrid (edge default, cloud premium tier)

### Technical Risk Matrix

| Risk | Financial Impact | Mitigation | Owner |
|------|------------------|-----------|-------|
| iOS/Android API breaks | $10K lost revenue (downtime) | Canary deployments, 2-week staging | Mobile Lead |
| OCR accuracy <95% (user churn) | -20% retention ($10K/month) | A/B test PP-OCRv5 vs v4, human eval | ML Lead |
| Model size >2GB (crashes) | App Store rejection, -50% users | Quantization, pruning, language packs | ML Eng |
| Battery drain (1-star reviews) | -30% installs ($15K/month) | Batch processing (1 FPS), aggressive quant | Mobile Eng |

### Org-Wide Impact

**Cross-Functional:**
- **Product:** Define quality bar (consumer vs pro translator accuracy)
- **Legal:** Data residency (GDPR, CCPA), user consent for cloud fallback
- **Marketing:** Freemium conversion funnel (free offline → paid cloud quality)
- **Ops:** App Store approval (avoid rejection, <2GB app size)

### Strategic Decisions (Deep Why)

**Why PP-OCRv5 over Google ML Kit:**
- Accuracy: 13pp gain on scene text (ICDAR benchmarks)
- Cost: Open-source (free) vs ML Kit quota limits
- Offline: Full offline (vs ML Kit cloud dependency)
- Customization: Fine-tune on domain-specific text (vs closed API)
- **Observation:** Google Lens uses internal model similar to PP-OCR architecture

**Why Llama 3.2 3B over NLLB-200:**
- Quality: Llama 3.2 fine-tuned = COMET 0.75 vs NLLB 0.70 (200-lang overhead)
- Size: 1.2GB (quantized) vs 2.8GB (NLLB 3.3B)
- Community: Better fine-tuning recipes, CoreML export tools
- Decision: Llama for top 20 languages, NLLB fallback for rare pairs

**Why 4-bit Quantization over 8-bit:**
- Memory: 1.2GB (INT4) vs 6GB (INT8), critical for 2GB RAM constraint
- Quality: -3 BLEU acceptable for offline (user tolerance study)
- Battery: 79% energy savings vs FP16 (Raspberry Pi benchmarks)
- Decision: INT4 offline, cloud for quality-sensitive users

**Why Hybrid Edge-Cloud over Pure Edge:**
- Quality: Cloud COMET 0.85 vs edge 0.70 (15% improvement)
- Coverage: Low-resource languages (Hmong, Kinyarwanda) require cloud (edge <50k data fails)
- Revenue: Premium tier differentiation ($5/month for cloud quality)
- Cost: 80% cost savings (edge default) vs cloud-only
- **User Study:** 70% accept edge quality, 30% willing to pay for cloud

**Unresolved Strategic Questions:**
1. When to build custom OCR model (vs PP-OCR) for domain-specific text (medical, legal)?
2. Real-time video translation latency target (30 FPS feasible with current quant?)
3. Multi-modal context preservation (visual grounding for ambiguous text like "this" pointing at object)?
