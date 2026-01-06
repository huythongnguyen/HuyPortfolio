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
- **Punctuation-aware timing**: Pause longer after `.` `!` `?` for natural rhythm (Seijaku)

#### Sequential vs Interactive Reveal

**Initial Page Load** (Sequential Queue):
- Sections reveal **one at a time**, in order
- Seijaku (静寂) — Only one section speaks at a time
- Each section completes before the next begins
- **Auto-scroll**: After an **H1 section** finishes, gently scrolls to show next H1 section
- H2/H3 subsections stay in place (focused reading, no distraction)
- Creates peaceful, guided journey through the document

**After Interaction** (Interactive Mode):
- User scrolls or clicks TOC → enables interactive mode
- Sections reveal **immediately** when they enter viewport
- Shizen (自然) — Natural exploration, content ready when you need it
- No waiting for queue processing
- No auto-scroll (user is in control)

### 🎯 TOC Navigation & Zen Reveal Modes

When clicking a TOC item, the system uses **document-type aware** reveal behavior:

#### Mode: `instant-skip` (Resume)

Best for professional documents where navigation is purposeful.
Shizen (自然) — Feels like opening a book to a chapter.

```
TOC Click on Resume:
┌─────────────────────────────────────────────────────────────────┐
│  Section 1  │  Already revealed?  → Keep as is                 │
│  Section 2  │  Not revealed?      → Reveal INSTANTLY ──────────│── Skipped
│  Section 3  │  Not revealed?      → Reveal INSTANTLY ──────────│── Skipped
│  Section 4  │  ← TARGET           → Reveal WORD-BY-WORD ───────│── Focus
└─────────────────────────────────────────────────────────────────┘
                        ↓
              Page scrolls to Section 4
```

**Why instant-skip?**
- User explicitly chose a destination; respect their intent
- Skipped sections become visible *space* — acknowledged but not forced
- Target section receives the full contemplative experience

#### Mode: `parallel` (Diamond Sutra)

Best for sacred texts where every word matters.
Seijaku (静寂) — Peaceful, contemplative unfolding.

```
TOC Click on Diamond Sutra:
┌─────────────────────────────────────────────────────────────────┐
│  Section 1  │  Already revealed?   → Keep as is                │
│  Section 2  │  Not revealed?       → Start animation ──────────│
│  Section 3  │  Not revealed?       → Start animation ──────────│── All animate
│  Section 4  │  ← TARGET            → Start animation ──────────│── in parallel
└─────────────────────────────────────────────────────────────────┘
                        ↓
              Page scrolls to Section 4
```

**Why parallel?**
- Every word in sacred texts carries meaning
- Parallel animation prevents long waits while honoring content
- Already-revealing sections continue naturally (not restarted)

#### Configuration

```javascript
// scripts/core/config.js
export const FILES = [
    {
        name: 'Resume',
        path: 'data/Resume.md',
        tocRevealMode: 'instant-skip'  // Professional navigation
    },
    {
        name: 'Diamond Sutra',
        path: 'data/KinhKimCang.md',
        tocRevealMode: 'parallel'      // Sacred text reverence
    }
];
```

### 🏗️ Pre-Parsed Document Architecture

Both standard and bilingual documents are **pre-parsed into sections** before rendering:

```
Markdown → Parser → Sections[] → Renderer → DOM
              ↓
          ┌────────────────────────────────────┐
          │  ParsedDocument {                  │
          │    type: 'standard' | 'bilingual', │
          │    sections: Section[],            │
          │    tocItems: TOCItem[]             │
          │  }                                 │
          └────────────────────────────────────┘
```

**Benefits:**
- **Consistent structure**: Both document types use identical section format
- **Predictable TOC**: Section IDs are known before DOM rendering
- **Unified reveal logic**: Same code path for Resume and Diamond Sutra
- **Fast navigation**: Sections array enables O(1) index lookup for TOC clicks
- **Granular sections**: H1, H2, and **H3** all create independent sections

**Section Boundaries:**
| Heading Level | Creates Section? | Use Case |
|---------------|------------------|----------|
| H1 | ✓ | Major topics (Professional Experience, Education) |
| H2 | ✓ | Subtopics (Individual companies, degrees) |
| H3 | ✓ | Fine-grained sections (Specific projects, skills) |

**Section Types:**
| Document Type | Section Classes |
|---------------|-----------------|
| Standard | `.content-section` (created by H1, H2, or H3) |
| Bilingual | `.bilingual-preamble`, `.bilingual-main-section`, `.bilingual-chapter` |

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

### 🎋 Media Showcase (Collapsible Gallery)

The **Visual Demonstrations** showcase follows Zen design principles with intentional UX:

#### Design Principles

| Principle | Implementation |
|-----------|----------------|
| **Ma (間)** — Space | Fixed 400px height creates visual rhythm |
| **Kanso (簡素)** — Simplicity | Minimal text triggers, no decoration |
| **Seijaku (静寂)** — Tranquility | Sequential reveal—text first, then media |
| **Shizen (自然)** — Naturalness | GIFs auto-play like flowing water |

#### User Experience Flow

```
┌─────────────────────────────────────────────────────┐
│   Spearheaded strategy and development...           │  ← Text reveals word-by-word
│                                                     │
│                         ▼ View demos ──────────────│  ← Collapsed trigger (right-aligned)
│                                                     │
└─────────────────────────────────────────────────────┘
          ↓  (user clicks)  ↓
┌─────────────────────────────────────────────────────┐
│   Spearheaded strategy and development...           │
│                                                     │
│                         ▲ Close demos ─────────────│  ← Expanded trigger
│                                                     │
│  ◄ ┌────────────┐  ┌────────────┐  ┌────────────┐ ► │  ← Arrow navigation
│    │ Rich Visual│  │LocalSearch │  │LocalSearch │   │
│    │  Offering  │  │  on Maps   │  │ on Search  │   │  ← Horizontal GIF gallery (90% visible)
│    │   (GIF)    │  │   (GIF)    │  │   (GIF)    │   │
│    └────────────┘  └────────────┘  └────────────┘   │
│              ●         ○             ○          ○   │  ← Scroll indicator dots
└─────────────────────────────────────────────────────┘
```

#### Features

| Feature | Details |
|---------|---------|
| **Sequential Reveal** | Media appears only after preceding text finishes revealing |
| **Toggle Text** | "▼ View demos" (collapsed) ↔ "▲ Close demos" (expanded) |
| **Dashed Border** | Collapsed state shows dashed border for discoverability |
| **Arrow Navigation** | Left/right arrows (◄/►) appear on hover for gallery navigation |
| **GIF Cropping** | Shows 90% of content—hides phone clock/navigation UI |
| **Scroll Dots** | Clickable indicators for direct item access |
| **Lazy Loading** | GIFs load only when gallery is expanded |

#### Implementation

Media is embedded using standard Markdown image syntax:

```markdown
![Title](path/to/video.gif "Description text")
![Local Search on Maps](media/LocalSearchOnMaps.gif "Visual content discovery")
```

Supported formats: `.gif`, `.webp`, `.mp4`, `.webm`, `.mov`

The system automatically:
1. Groups consecutive media into a single gallery
2. Wraps in collapsible showcase with toggle
3. Adds arrow navigation and scroll dots
4. Sets up lazy loading and reveal timing

#### English Translation (Diamond Sutra)

English text is hidden beneath each Vietnamese section with a minimal text toggle:

```
┌─────────────────────────────────────────────────────┐
│        Bấy giờ, trong đại chúng...                 │  ← Vietnamese (centered)
│                  [ENGLISH]                          │  ← Text toggle button
├ ─ ─ ─ ─ ─ ─ ─ ─ (hidden) ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┤
│      At that time, in the great assembly...         │  ← English (italic, revealed)
└─────────────────────────────────────────────────────┘
```

Both patterns use the same CSS collapsible structure with `max-height` transitions.


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
├── server/                 # Development server
│   ├── serve.py           # Python server (cross-platform)
│   ├── serve.sh           # Bash wrapper (Mac/Linux)
│   └── serve.ps1          # PowerShell wrapper (Windows)
├── styles/
│   ├── main.css           # Entry point (imports all modules)
│   ├── base.css           # Reset, variables, body, dark mode
│   ├── layout.css         # Grid structure
│   ├── tabs.css           # Auto-hide document switcher
│   ├── sidebar.css        # TOC with scroll spy
│   ├── typography.css     # Headings, text, links
│   ├── actions.css        # Download buttons, theme toggle
│   ├── bilingual.css      # Zen bilingual layout, text reveal
│   ├── media.css          # Collapsible gallery, arrows, GIF display
│   └── responsive.css     # Media queries
├── scripts/
│   ├── main.js            # Entry point, tab auto-hide
│   ├── core/
│   │   ├── config.js      # Document configuration
│   │   ├── documentParser.js  # Unified pre-parser for all documents
│   │   └── textReveal.js  # Word-by-word animation system
│   ├── navigation/
│   │   ├── documentTabs.js    # Tab switching and document loading
│   │   ├── tocHandler.js      # Unified TOC click with parallel reveal
│   │   └── scrollSpy.js       # Section tracking and TOC highlighting
│   ├── renderers/
│   │   ├── unified.js     # Pre-parsed section renderer (both types)
│   │   └── bilingual.js   # Vietnamese/English layout (legacy)
│   └── utils/
│       ├── media.js       # Collapsible gallery, arrows, reveal timing
│       ├── theme.js       # Light/dark mode toggle
│       └── download.js    # PDF and Markdown export
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

## Development Server

```bash
python server/serve.py
```

Opens at `http://localhost:8000` with cache-busting enabled.

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
3. **Embed Media:**
   Simply use standard Markdown image syntax with `.mp4`, `.webm`, or `.mov` files to automatically render high-quality, lazy-loading video showcases:
   ```markdown
   ![Title](path/to/video.mp4 "Optional Description")
   ```
4. Start the development server (see above)

---

*Less is more. Space is design. Stillness is interaction. Words unfold like morning mist.*
