# Zen Markdown Portfolio

A minimalist portfolio platform that renders markdown documents with Zen aesthetics, supporting multiple independent sites with shared core logic.

## Sites

This repository hosts two distinct experiences:

1.  **Huy Thong Nguyen Portfolio** (`huythong-nguyen/`)
    *   Professional portfolio, resume, and technical showcases.
    *   Focus on clarity, depth, and professional journey.

2.  **Inner Compassion** (`inner-compassion/`)
    *   Spiritual translations and contemplative texts.
    *   Focus on tranquility, bilingual presentation, and reflection.

## Design Philosophy

This design follows four core Zen principles:

### Ma (間) — Negative Space
Space is not empty; it is the primary design element. Generous whitespace creates breathing room, directing attention to content without visual competition. Tabs hide until needed, appearing only when you approach the top of the screen.

### Kanso (簡素) — Simplicity
Maximum simplicity through removal. No decorative borders, no toggle arrows, minimal icons. Every element must have purpose or be removed.

### Shizen (自然) — Naturalness
Design should feel effortless and unforced. Subtle transitions, natural color palette (ink, stone, mist, paper, sand). Text reveals word by word in a continuous, linear flow, like a thought unfolding.

### Seijaku (静寂) — Tranquility
Stillness in interaction. Words appear gradually at a contemplative pace. The TOC quietly tracks your reading position. Light and dark modes transition smoothly.

---

## Layout Structure

```
┌─────────────────────────────────────────────────┐
│              TABS (hidden until hover)          │  ← Auto-hide navigation
├──────────┬──────────────────────┬───────────────┤
│          │                      │               │
│   TOC    │      CONTENT         │    (space)    │  ← Content centered
│          │                      │               │
│  scroll  │   max-width: 800px   │      [☀/☾]   │  ← Theme toggle
│   spy    │   word-by-word       │               │
│  active  │   reveal             │               │
│          │     [PDF] [MD]       │               │  ← Actions fade in
└──┴──────────┴──────────────────────┴───────────────┘
```

### Areas
- **Tabs**: Site-specific document switcher — hidden by default, appears on hover near top.
- **TOC**: Table of Contents on left — scroll spy highlights current section.
- **Content**: Main reading area — centered, word-by-word text reveal.
- **Theme Toggle**: Light/dark mode — persists preference.

---

## Features

### 🌓 Light/Dark Mode
- Toggle with button (top right)
- Respects `prefers-color-scheme` system preference
- Smooth transitions between themes
- Softer text in dark mode for comfortable reading

### ✨ Word-by-Word Text Reveal
- **Linear Flow**: Text reveals strictly sequentially from start to finish, ensuring a focused reading path.
- **Autocue-style Scrolling**: As text reveals near the bottom, the page gently scrolls up to keep the active line in a comfortable reading zone.
- **Instant Control**: Users can click "Stop" or switch tabs to instantly view content if desired.

### 🏗️ Pre-Parsed Document Architecture

Documents are pre-parsed to separate structure from presentation:

```
Markdown → Parser → Sections[] → Renderer → DOM
```

**Benefits:**
- **Consistent structure**: Standard and Bilingual documents share the same core logic.
- **Granular sections**: H1, H2, and **H3** all create independent sections for precise TOC navigation.
- **Unified Logic**: One renderer handles both site types.

### 📍 Scroll Spy TOC
- Current section highlighted with left border.
- TOC auto-scrolls to keep active item visible.

### 🎯 Auto-Hide Tabs
- Tabs hidden by default for distraction-free reading.
- Appear when mouse moves to top 60px of screen.

### 🇻🇳 Bilingual Mode
For documents in `inner-compassion/`:
- **Vietnamese (Primary)**: Centered and revealed automatically.
- **English (Secondary)**: Hidden by default, toggled via button.
- Follows *Kanso* — secondary information is available but unobtrusive.

---

## Technical

### Dependencies
- **marked.js** — Markdown parsing
- **DOMPurify** — HTML sanitization
- **Google Fonts** — Source Serif 4, Source Sans 3

### File Structure
```
├── huythong-nguyen/        # Professional Site
│   ├── config.js          # Site specific config (documents, speeds)
│   ├── index.html         # Entry point
│   └── data/              # Markdown content (Resume, etc.)
│
├── inner-compassion/       # Spiritual Site
│   ├── config.js          # Site specific config
│   ├── index.html         # Entry point
│   └── data/              # Markdown content (Sutras, etc.)
│
├── server/                 # Shared Development server
├── styles/                 # Shared CSS modules
└── scripts/                # Shared JavaScript modules
    ├── main.js            # Entry point
    ├── core/
    │   ├── textReveal.js  # Linear text reveal engine
    │   └── ...
    └── renderers/
        └── unified.js     # Universal renderer
```

### Browser Support
Modern browsers with CSS Grid and IntersectionObserver support. Tested in Chrome, Firefox, Safari, Edge.

---

## Usage

1.  **Start Server:**
    ```bash
    python server/serve.py
    ```
    - `http://localhost:8000/huythong-nguyen/`
    - `http://localhost:8000/inner-compassion/`

2.  **Add Content:**
    - Place markdown files in the respective `data/` folder of the site.
    - Update the `config.js` in that site's folder to include the new file.

3.  **Embed Media:**
    Use standard Markdown image syntax with video extensions (`.mp4`, `.webm`, `.mov`) for auto-generated galleries.

---

*Less is more. Space is design. Stillness is interaction. Words unfold like morning mist.*
