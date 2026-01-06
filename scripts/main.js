/**
 * Zen Markdown Viewer - Main Entry Point
 * 
 * A minimalist portfolio viewer that renders markdown documents with
 * Zen aesthetics. Supports bilingual (Vietnamese/English) side-by-side
 * display for translated content.
 * 
 * Features:
 * - Tab-based document switching
 * - Automatic Table of Contents generation
 * - Bilingual side-by-side rendering
 * - PDF and Markdown download
 * - Scroll progress indicator
 * 
 * Architecture:
 *   core/
 *     config.js       - Document configuration
 *   navigation/
 *     documentTabs.js - Tab switching and document loading
 *     tocHandler.js   - Unified TOC click handling
 *     scrollSpy.js    - Section tracking and TOC highlighting
 *   renderers/
 *     standard.js     - Standard markdown rendering
 *     bilingual.js    - Vietnamese/English parser and renderer
 *   utils/
 *     media.js        - Media showcase and gallery
 *     theme.js        - Light/dark mode
 *     download.js     - Export functionality
 *   main.js           - Application initialization
 * 
 * @author Huy Thong Nguyen
 * @version 3.0.0
 */

import { FILES } from './core/config.js';
import { renderDocumentTabs, loadDocument, initTabAutoHide } from './navigation/documentTabs.js';
import { updateScrollProgress } from './navigation/scrollSpy.js';

import { initTheme } from './utils/theme.js';
import { initTextReveal } from './core/textReveal.js';

/**
 * Initializes the high-level application flow.
 */
export async function initApp(files = FILES) {
    // 1. Core Systems
    initTheme();
    initTextReveal();

    // 2. UI/Navigation
    renderDocumentTabs(files);
    initTabAutoHide();

    // 3. Initial Load
    await loadDocument(files[0]);

    // 4. Interaction
    window.addEventListener('scroll', updateScrollProgress);
}

/**
 * Global entry point.
 */
document.addEventListener('DOMContentLoaded', async () => {
    if (!window.MANUAL_INIT) {
        initApp();
    }
});
