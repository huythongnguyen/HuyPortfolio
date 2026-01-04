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
 * - Smooth scroll navigation
 * - PDF and Markdown download
 * - Scroll progress indicator
 * 
 * Architecture:
 *   config.js     - Document configuration
 *   bilingual.js  - Vietnamese/English parser and renderer
 *   renderer.js   - Standard markdown rendering
 *   navigation.js - Tabs, TOC, and scroll handling
 *   download.js   - Export functionality
 *   main.js       - Application initialization
 * 
 * @author Huy Thong Nguyen
 * @version 2.0.0
 */

import { FILES } from './config.js';
import { renderDocumentTabs, loadDocument, updateScrollProgress } from './navigation.js';
import { downloadAsMarkdown, downloadAsPDF } from './download.js';
import { initTheme } from './theme.js';
import { initTextReveal } from './textReveal.js';

/**
 * Initializes the application when the DOM is ready.
 * 
 * 1. Initializes theme (light/dark mode)
 * 2. Initializes text reveal system (gradual word-by-word)
 * 3. Renders document tabs (auto-hide, reveals on hover)
 * 4. Loads the first document
 * 5. Attaches download button handlers
 * 6. Sets up scroll progress tracking
 * 7. Sets up tab auto-hide behavior
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
    const TRIGGER_ZONE = 60; // pixels from top
    let hideTimeout = null;
    
    // Show tabs when mouse is near top
    document.addEventListener('mousemove', (e) => {
        if (e.clientY <= TRIGGER_ZONE) {
            showTabs();
        }
    });
    
    // Keep tabs visible while hovering on them
    tabs.addEventListener('mouseenter', showTabs);
    
    // Hide tabs when mouse leaves (with delay)
    tabs.addEventListener('mouseleave', () => {
        hideTimeout = setTimeout(hideTabs, 400);
    });
    
    // Cancel hide if mouse returns to trigger zone
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

