# Portals of Presence: The Zen Markdown Engine

A minimalist, dual-experience web platform that explores the intersection of professional identity and contemplative practice. Powered by a custom-built Zen Markdown Engine, it prioritizes **stillness**, **space**, and **intentionality**.

---

## 🌌 The Dual Experience

This repository serves as a unified core for two distinct digital realms, accessible through a [central portal](https://huythongnguyen.github.io/HuyPortfolio/):

| Realm | Focus | Aesthetic |
| :--- | :--- | :--- |
| **Huy Thong Nguyen** | Engineering & Innovation | Sophisticated, High-Tech Zen, Professional |
| **Inner Compassion** | Philosophy & Meditation | Serene, Organic, Contemplative |

---

## 🎋 Zen Design Philosophy (Dojo)

We move beyond mere "minimalism" into the territory of traditional Japanese aesthetics, applied to modern digital interfaces.

### 1. Ma (間) — The Art of Space
In this engine, whitespace is not empty—it is structural. We use generous margins to prevent visual fatigue and ensure that every word carries weight.
*   **Invisible UI**: Navigation tabs vanish when not in use, appearing only when the user reaches for them at the top of the screen.

### 2. Kanso (簡素) — Radical Simplicity
We eliminate the unnecessary to amplify the essential.
*   **Zero Decoration**: No borders, no drop shadows, no unnecessary icons. The beauty comes from typography and proportion.
*   **Unified Rendering**: A single, clean pipeline converts complex Markdown into a structured, serene reading experience.

### 3. Shizen (自然) — Spontaneous Growth
Interaction should feel like a natural phenomenon.
*   **The Unfolding Word**: Texts don't just "load"; they emerge. Our text reveal engine animates words at a rhythmic, contemplative pace, mimicking the natural flow of thought.
*   **Autocue-style Flow**: The interface breathes with you, gently auto-scrolling to maintain your focus as the text unfolds.

### 4. Seijaku (静寂) — Deep Stillness
The engine is designed to lower the reader's heart rate.
*   **Living Index (Scroll-Sync)**: The Table of Contents is a living mirror of your position. As you scroll, the engine meticulously tracks your location and highlights the relevant section in the sidebar, providing a constant, quiet anchor.
     *   **Meditative Mode**: Extra-slow reveal for sacred texts (Kinh Kim Cang), fostering deep contemplation.
     *   **Overview Mode**: Rapid content "roll-out" for professional docs, auto-populating the TOC before returning you to the top of the page.

### 5. Mobile-First Zen
Design that flows across any screen without losing its soul.
*   **The Mandala Anchor**: A grand, sacred geometry trigger (The Mandala of Universal Reveal) resides at the right midpoint. It serves as a symbolic shortcut to fully unfold the document, with intricate rotation and "blossom" animations that respond to the user's focus.
*   **The Index Drawer**: On mobile, the TOC transforms into a minimalist navigation drawer, easily summoned and dismissed via a floating "Index" button.
*   **Touch-Optimized Tabs**: Document switchers are horizontally scrollable and touch-ready, ensuring the "Too Wide" problem of desktop layouts is naturally resolved.
*   **Responsive Scaling**: Typography and bilingual layouts automatically adjust their breathing room (*Ma*) to feel as native on an iPhone as they do on an iMac.

### 6. Principle of Dynamic Presence (Ma & Seijaku)
Our navigation is designed to be an echo, not a noise.
*   **Non-Overlapping Flow**: The Top-Bar and main content share a respectful boundary. To preserve stillness, the content only shifts its position once the navigation is **Permanently Rendered** (reveal complete). Temporary hovers do not shift the text canvas, ensuring zero visual "jumps" during exploration.
*   **Scroll-Driven Recessional**: As you descend into the document, the Top-Bar recedes (slides up) to grant the mind full-screen stillness.
*   **Strict Emergence**: The navigation reveals **only** when the reader hovers (touch) at the absolute top of the screen or once the document's text reveal is fully complete. It remains hidden during the sacred unfolding process.
*   **Unified Gestures**: Whether through a mouse-flick on desktop or a swipe on mobile, the UI responds with a consistent "Zen Slide" that feels natural and effortless.

---

## 🛠️ Technical Architecture

The platform is designed with a **Shared Core, Distributed Content** model.

### The Stack
- **Engine**: Vanilla JavaScript (ES6 Modules)
- **Styling**: Pure CSS (Modular imports)
- **Parsing**: `marked.js` + `DOMPurify`
- **Typography**: Source Serif 4 (Reading) & Source Sans 3 (Functional)

### Directory Structure
```text
├── huythong-nguyen/    # Professional Site (Independent config & content)
├── inner-compassion/   # Spiritual Site (Independent config & content)
├── assets/             # Shared high-fidelity portal imagery
├── scripts/            # Shared engine logic (Text reveal, Document parsing)
├── styles/             # Shared aesthetic modules (Zen tokens, Typography)
└── index.html          # The central Entrance Portal
```

---

## 🚀 Getting Started

### Local Development
1.  Clone the repository.
2.  Run the lightweight Python server:
    ```bash
    python server/serve.py
    ```
3.  Visit `http://localhost:8000` to see the portal.

### Adding Content
- **Markdown-first**: All content lives in `.md` files in the respective `data/` folders.
- **Config-driven**: Update the site's local `config.js` to add new tabs or change text reveal speeds.
- **Media**: Simply use `![title](video.mp4)` syntax. The engine automatically detects video files and creates a sleek, Zen-inspired media showcase.

---

> "Less is more. Space is design. Stillness is interaction."

*Crafted with intention by Huy Thong Nguyen.*
