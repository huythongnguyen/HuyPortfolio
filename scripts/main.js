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
 * - Smooth scroll navigation with parallel text reveal
 * - PDF and Markdown download
 * - Scroll progress indicator
 * 
 * Architecture:
 *   core/
 *     config.js       - Document configuration
 *     textReveal.js   - Text reveal animation system
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
import { renderDocumentTabs, loadDocument } from './navigation/documentTabs.js';
import { updateScrollProgress } from './navigation/scrollSpy.js';
import { downloadAsMarkdown, downloadAsPDF } from './utils/download.js';
import { initTheme } from './utils/theme.js';
import { initTextReveal } from './core/textReveal.js';

/**
 * Initializes the application when the DOM is ready.
 */
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize theme system (light/dark mode)
    initTheme();

    // Initialize text reveal system (speed control)
    initTextReveal();

    // Render navigation tabs
    renderDocumentTabs();

    // Load initial document
    await loadDocument(FILES[0]);

    // Attach download handlers
    document.getElementById('download-md').addEventListener('click', downloadAsMarkdown);
    document.getElementById('download-pdf').addEventListener('click', downloadAsPDF);

    // Track scroll progress
    window.addEventListener('scroll', updateScrollProgress);

    // Setup tab auto-hide behavior
    initTabAutoHide();
});

/**
 * Tab Auto-Hide
 * 
 * Tabs are hidden by default, appearing when:
 *   - Mouse moves near the top of the screen (within 60px)
 *   - Mouse hovers directly on the tabs
 * 
 * Follows Ma (間) principle: show only when needed.
 */
function initTabAutoHide() {
    const tabs = document.getElementById('top-tabs');
    const TRIGGER_ZONE = 60;
    let hideTimeout = null;

    document.addEventListener('mousemove', (e) => {
        if (e.clientY <= TRIGGER_ZONE) {
            showTabs();
        }
    });

    tabs.addEventListener('mouseenter', showTabs);

    tabs.addEventListener('mouseleave', () => {
        hideTimeout = setTimeout(hideTabs, 400);
    });

    document.addEventListener('mousemove', (e) => {
        if (e.clientY <= TRIGGER_ZONE && hideTimeout) {
            clearTimeout(hideTimeout);
            hideTimeout = null;
        }
    });

    function showTabs() {
        if (hideTimeout) {
            clearTimeout(hideTimeout);
            hideTimeout = null;
        }
        tabs.classList.add('visible');
    }

    function hideTabs() {
        tabs.classList.remove('visible');
        hideTimeout = null;
    }
}
