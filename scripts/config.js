/**
 * Configuration for the Zen Markdown Viewer
 * 
 * This file defines the documents available in the portfolio and their settings.
 * Each document can optionally enable bilingual mode for side-by-side translation.
 */

export const FILES = [
    {
        name: 'Resume',
        path: 'data/ResumeHuyThongNguyen2026.md',
        bilingual: false,
        defaultSpeed: 'fast'  // Changed from 'instant' to 'fast'
    },
    {
        name: 'Diamond Sutra',
        path: 'data/KinhKimCang.md',
        bilingual: true,  // Enables Vietnamese/English side-by-side display
        defaultSpeed: 'medium'  // Changed from 'instant' to 'fast'
    }
];

/**
 * Current document state
 * Stores the active document's name and raw markdown for download functionality
 */
export let currentDocument = null;

export function setCurrentDocument(doc) {
    currentDocument = doc;
}

