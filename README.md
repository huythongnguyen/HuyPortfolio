# Zen Markdown Portfolio

A minimalist portfolio website that renders markdown documents with Zen aesthetics, Vietnamese language support, and meditative reading experience.

**Data Location:** `data/`

## Design Philosophy

This design follows four core Zen principles:

### Ma (間) — Negative Space
Space is not empty; it is the primary design element. Generous whitespace creates breathing room, directing attention to content without visual competition. Tabs hide until needed, appearing only when you approach the top of the screen.

### Kanso (簡素) — Simplicity  
Maximum simplicity through removal. No decorative borders, no toggle arrows, minimal icons. Speed control uses dots (`·` `··` `···` `○`) instead of emojis. Every element must have purpose or be removed.

### Shizen (自然) — Naturalness
Design should feel effortless and unforced. Subtle transitions, natural color palette (ink, stone, mist, paper, sand), typography that doesn't demand attention. Text reveals word by word like a peaceful unfolding.

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
│   spy    │                      │               │
│  active  │   word-by-word       │      [·]     │  ← Speed control
│          │   reveal             │               │
│          │     [PDF] [MD]       │               │  ← Actions fade in
└──────────┴──────────────────────┴───────────────┘
```

### Areas
- **Tabs**: Document switcher (Resume, Diamond Sutra) — hidden by default, appears on hover near top
- **TOC**: Table of Contents on left — scroll spy highlights current section with left border
- **Content**: Main reading area — centered, word-by-word text reveal
- **Theme Toggle**: Light/dark mode — respects system preference, persists choice
- **Speed Control**: Reading pace — cycles through slow/medium/fast/instant
- **Actions**: Download buttons — appear on hover, minimal styling

---

## Features

### 🌓 Light/Dark Mode
- Toggle with button (top right)
- Respects `prefers-color-scheme` system preference
- Smooth transitions between themes
- Persists preference in localStorage
- Softer text in dark mode for comfortable reading

### ✨ Word-by-Word Text Reveal
- Text appears gradually as sections scroll into view
- Creates meditative, contemplative reading experience
- Speed control with 4 levels:
  - `·` **Slow** (150ms) — contemplative
  - `··` **Medium** (80ms) — balanced
  - `···` **Fast** (40ms) — quick read
  - `○` **Instant** (0ms) — no animation
- Speed preference persists in localStorage

### 📍 Scroll Spy TOC
- Current section highlighted with left border
- TOC auto-scrolls to keep active item visible
- Works on both Resume and Diamond Sutra pages

### 🎯 Auto-Hide Tabs
- Tabs hidden by default for distraction-free reading
- Appear when mouse moves to top 60px of screen
- Small indicator line hints at hidden navigation
- Smooth slide-down animation

### 🇻🇳 Bilingual Mode
For documents with Vietnamese and English translations:

```
┌────────────────────────────────────────────────────────────┐
│                      PREAMBLE (full-width)                 │
│   Translator's introduction, context, attribution...       │
├────────────────────────────────────────────────────────────┤
│                                                            │
│                 Vietnamese (centered)                      │
│                                                            │
│                    [ENGLISH] button                        │
│                                                            │
│              English (collapsed, italic)                   │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

- Vietnamese text centered as primary voice
- English revealed via toggle button (follows Kanso — show only when needed)
- Word-by-word reveal for both languages

---

## Color Palette

### Light Mode
| Variable | Hex | Use |
|----------|-----|-----|
| `--ink` | #1a1a1a | Primary text, active states |
| `--stone` | #555 | Secondary text, blockquotes |
| `--mist` | #888 | Muted text, TOC, placeholders |
| `--paper` | #fdfcfb | Background |
| `--sand` | #f5f3f0 | Code blocks, subtle accents |

### Dark Mode
| Variable | Hex | Use |
|----------|-----|-----|
| `--ink` | #c5c0b8 | Primary text (softer white) |
| `--stone` | #a09b93 | Secondary text |
| `--mist` | #777 | Muted text |
| `--paper` | #1c1b1a | Background |
| `--sand` | #2a2826 | Code blocks, subtle accents |

---

## Typography

### Font Choices
- **Headings**: Source Serif 4 — elegant serif with excellent Vietnamese diacritic support
- **Body**: Source Sans 3 — clean sans-serif, highly readable for both English and Vietnamese

### Why These Fonts?
Vietnamese requires fonts with:
- Proper diacritic spacing (ả, ệ, ư, ờ, etc.)
- Clear rendering at small sizes
- Good x-height for readability

Source Serif 4 and Source Sans 3 are specifically designed with extended Latin support, making Vietnamese text clear and beautiful.

---

## Technical

### Dependencies
- **marked.js** — Markdown parsing
- **DOMPurify** — HTML sanitization
- **Google Fonts** — Source Serif 4, Source Sans 3

### File Structure
```
├── index.html              # Minimal HTML structure
├── styles/
│   ├── main.css           # Entry point (imports all modules)
│   ├── base.css           # Reset, variables, body, dark mode
│   ├── layout.css         # Grid structure
│   ├── tabs.css           # Auto-hide document switcher
│   ├── sidebar.css        # TOC with scroll spy
│   ├── typography.css     # Headings, text, links
│   ├── actions.css        # Download buttons, theme toggle
│   ├── bilingual.css      # Zen bilingual layout, text reveal
│   └── responsive.css     # Media queries
├── scripts/
│   ├── main.js            # Entry point, tab auto-hide
│   ├── config.js          # Document configuration
│   ├── navigation.js      # Tabs, scroll spy, TOC
│   ├── renderer.js        # Standard markdown + text reveal
│   ├── bilingual.js       # Vietnamese/English parser
│   ├── textReveal.js      # Word-by-word animation system
│   ├── theme.js           # Light/dark mode toggle
│   └── download.js        # PDF and Markdown export
└── data/
    ├── ResumeHuyThongNguyen2026.md
    └── KinhKimCang.md
```

### Browser Support
Modern browsers with CSS Grid and IntersectionObserver support. Tested in Chrome, Firefox, Safari, Edge.

---

## What's Included
- ✓ Centered content layout with TOC on left
- ✓ Vietnamese-optimized typography
- ✓ Bilingual rendering (Vietnamese centered, English collapsed)
- ✓ Word-by-word text reveal animation
- ✓ Configurable reading speed (slow/medium/fast/instant)
- ✓ Light/dark mode with system preference detection
- ✓ Scroll spy TOC with active section highlighting
- ✓ Auto-hiding tabs (appear on hover)
- ✓ Smooth scroll navigation
- ✓ Keyboard accessible (arrow keys for tabs)
- ✓ Responsive design (mobile hides TOC)
- ✓ Print-optimized styles
- ✓ PDF and Markdown downloads
- ✓ Scroll progress indicator (subtle 1px line)

## What's Removed (Intentionally)
- ✗ Site header (name appears in content)
- ✗ "Table of Contents" label (obvious from context)
- ✗ Emojis on speed control (dots are more Zen)
- ✗ Toggle arrows in TOC (children always visible)
- ✗ Borders (space separates elements)
- ✗ Box shadows and transform effects (stillness preferred)
- ✗ Busy hover animations (subtle color change only)
- ✗ Always-visible navigation (hidden until needed)

---

## Usage

1. Place markdown files in `data/` directory
2. Update `FILES` array in `scripts/config.js`:
   ```javascript
   export const FILES = [
       { name: 'Document Name', path: 'data/filename.md', bilingual: false },
       { name: 'Translated Doc', path: 'data/translated.md', bilingual: true }
   ];
   ```
3. Serve with any static file server:
   ```bash
   npx serve -l 3000
   # or
   python -m http.server 3000
   ```
4. Open `http://localhost:3000`

---

*Less is more. Space is design. Stillness is interaction. Words unfold like morning mist.*
