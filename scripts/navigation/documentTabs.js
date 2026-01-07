/**
 * Document Tabs
 * 
 * Handles document switching via top tabs.
 * Uses the unified parser and renderer for consistent behavior.
 */

import { setCurrentDocument, setCurrentFileConfig } from '../core/config.js';
import { parseDocument } from '../core/documentParser.js';
import { renderDocument, buildTOC } from '../renderers/unified.js';
import { stopCurrentReveal, setRevealSpeed } from '../core/textReveal.js';

let appFiles = [];

/**
 * Fetches a markdown file from the server.
 */
export async function fetchMarkdown(filepath) {
    try {
        const response = await fetch(filepath);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.text();
    } catch (error) {
        console.error('Fetch error:', error);
        return `# Error\n\nFailed to load: ${filepath}\n\n${error.message}`;
    }
}

/**
 * Loads and renders a document using the unified system.
 */
export async function loadDocument(fileInfo) {
    stopCurrentReveal();

    const tabs = document.getElementById('top-tabs');
    if (tabs) {
        tabs.classList.remove('perma-visible');
        tabs.classList.remove('visible');
    }

    // Return to top instantly
    window.scrollTo({ top: 0, behavior: 'instant' });
    const sidebar = document.getElementById('sidebar');
    if (sidebar) sidebar.scrollTo({ top: 0, behavior: 'instant' });

    if (fileInfo.defaultSpeed) {
        setRevealSpeed(fileInfo.defaultSpeed);
    }

    const markdown = await fetchMarkdown(fileInfo.path);
    setCurrentDocument({ name: fileInfo.name, markdown });
    setCurrentFileConfig(fileInfo);  // Store config for tocRevealMode access

    // Parse the document into sections
    const parsedDoc = parseDocument(markdown);

    // Render and build TOC
    renderDocument(parsedDoc);
    buildTOC(parsedDoc);
}

/**
 * Switches to a different document by tab index.
 */
export async function switchDocument(index) {
    document.querySelectorAll('.doc-tab').forEach((tab, i) => {
        tab.classList.toggle('active', i === index);
        tab.setAttribute('aria-selected', i === index ? 'true' : 'false');
    });

    await loadDocument(appFiles[index]);

}

export function renderDocumentTabs(files) {
    if (files) appFiles = files;
    const tabsContainer = document.getElementById('top-tabs');

    // Use an internal track for scrolling so theme-toggle can stay pinned
    let track = tabsContainer.querySelector('.tabs-track');
    if (!track) {
        track = document.createElement('div');
        track.className = 'tabs-track';
        // Insert at the beginning so toggle (if added) is always at the end in DOM
        // but styling will handle visual pinning
        tabsContainer.insertBefore(track, tabsContainer.firstChild);
    }
    track.innerHTML = '';

    appFiles.forEach((file, index) => {
        const button = document.createElement('button');
        button.className = 'doc-tab';
        button.textContent = file.name;
        button.dataset.index = index;
        button.setAttribute('role', 'tab');
        button.setAttribute('aria-selected', index === 0 ? 'true' : 'false');

        if (index === 0) button.classList.add('active');

        button.addEventListener('click', () => switchDocument(index));
        button.addEventListener('keydown', handleTabKeydown);
        track.appendChild(button);
    });
}

/**
 * Handles keyboard navigation between tabs.
 */
function handleTabKeydown(event) {
    const tabs = Array.from(document.querySelectorAll('.doc-tab'));
    const currentIndex = tabs.indexOf(event.target);
    let targetIndex;

    switch (event.key) {
        case 'ArrowLeft':
            event.preventDefault();
            targetIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
            tabs[targetIndex].click();
            tabs[targetIndex].focus();
            break;
        case 'ArrowRight':
            event.preventDefault();
            targetIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
            tabs[targetIndex].click();
            tabs[targetIndex].focus();
            break;
    }
}

/**
 * Initializes the auto-hide/reveal behavior for top tabs.
 */
export function initTabAutoHide() {
    const tabs = document.getElementById('top-tabs');
    if (!tabs) return;

    const TRIGGER_ZONE = 60;
    let lastScrollY = window.scrollY;
    let scrollUpAmount = 0;

    // Desktop: Mouse hover near top
    document.addEventListener('mousemove', (e) => {
        // If tabs are permanently visible (render complete), we still allow hiding/showing via scroll
        // but mouse hover always brings them back
        if (e.clientY <= TRIGGER_ZONE) {
            tabs.classList.add('visible');
        } else if (window.scrollY > 100 && !tabs.classList.contains('perma-visible')) {
            // Only hide if we aren't at the very top and not in perma-visible mode
            tabs.classList.remove('visible');
        }
    });

    // Unified Scroll Logic: Hide on scroll down, only show at very top
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        const delta = currentScrollY - lastScrollY;

        if (delta > 2 && currentScrollY > 100) {
            // Scrolling down: recede to grant focus
            tabs.classList.remove('visible');
            tabs.classList.remove('perma-visible');
        }

        // Only auto-show if we reach the absolute top of the page
        if (currentScrollY < 10) {
            tabs.classList.add('visible');
        }

        lastScrollY = currentScrollY;
    }, { passive: true });

    // Mobile: Swipe handling
    let touchStartY = 0;
    tabs.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    tabs.addEventListener('touchmove', (e) => {
        const touchY = e.touches[0].clientY;
        const deltaY = touchStartY - touchY;

        // Swipe up on the tab bar itself to hide it
        if (deltaY > 20) {
            tabs.classList.remove('visible');
            tabs.classList.remove('perma-visible');
        }
    }, { passive: true });
}
