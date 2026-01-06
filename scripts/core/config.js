/**
 * Configuration for the Zen Markdown Viewer
 * 
 * This file defines the documents available in the portfolio and their settings.
 * Each document can optionally enable bilingual mode for side-by-side translation.
 */

/**
 * TOC Reveal Modes (Zen Philosophy):
 * 
 *   - 'instant-skip': Skipped sections reveal instantly, target reveals word-by-word.
 *                     Best for professional docs (Resume) where navigation is purposeful.
 *                     Shizen (自然) - Feels like opening a book to a chapter.
 * 
 *   - 'parallel':     All unrevealed sections animate in parallel, target included.
 *                     Best for sacred texts (Diamond Sutra) where every word matters.
 *                     Seijaku (静寂) - Peaceful, contemplative experience.
 */

export const FILES = [
    {
        name: 'Resume',
        path: 'data/ResumeHuyThongNguyen2026.md',
        bilingual: false,
        defaultSpeed: 'medium',
        tocRevealMode: 'instant-skip'  // Professional: instant skip, target reveals
    },
    {
        name: 'Diamond Sutra',
        path: 'data/KinhKimCang.md',
        bilingual: true,
        defaultSpeed: 'medium',
        tocRevealMode: 'parallel'      // Sacred: all animate together
    }
];

/**
 * Current document state
 * Stores the active document's name and raw markdown for download functionality
 */
export let currentDocument = null;

/**
 * Current file configuration (for runtime access to tocRevealMode, etc.)
 */
export let currentFileConfig = null;

export function setCurrentDocument(doc) {
    currentDocument = doc;
}

export function setCurrentFileConfig(config) {
    currentFileConfig = config;
}

export function getTocRevealMode() {
    return currentFileConfig?.tocRevealMode || 'parallel';
}
