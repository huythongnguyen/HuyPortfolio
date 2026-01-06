/**
 * Document Tabs
 * 
 * Handles document switching via top tabs.
 * Uses the unified parser and renderer for consistent behavior.
 */

import { FILES, setCurrentDocument, setCurrentFileConfig } from '../core/config.js';
import { setSpeed, clearRevealQueue } from '../core/textReveal.js';
import { parseDocument, isBilingualMarkdown } from '../core/documentParser.js';
import {
    renderStandardDocument,
    buildStandardTOC,
    renderBilingualDocument,
    buildBilingualTOC
} from '../renderers/unified.js';

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
    const markdown = await fetchMarkdown(fileInfo.path);
    setCurrentDocument({ name: fileInfo.name, markdown });
    setCurrentFileConfig(fileInfo);  // Store config for tocRevealMode access

    if (fileInfo.defaultSpeed) {
        setSpeed(fileInfo.defaultSpeed);
    }

    // Parse the document into sections
    const parsedDoc = parseDocument(markdown);

    // Render and build TOC based on document type
    if (parsedDoc.type === 'bilingual') {
        renderBilingualDocument(parsedDoc);
        buildBilingualTOC(parsedDoc);
    } else {
        renderStandardDocument(parsedDoc);
        buildStandardTOC(parsedDoc);
    }
}

/**
 * Switches to a different document by tab index.
 */
export async function switchDocument(index) {
    clearRevealQueue();
    document.querySelectorAll('.doc-tab').forEach((tab, i) => {
        tab.classList.toggle('active', i === index);
        tab.setAttribute('aria-selected', i === index ? 'true' : 'false');
    });

    await loadDocument(FILES[index]);
}

/**
 * Renders the document tab buttons.
 */
export function renderDocumentTabs() {
    const tabsContainer = document.getElementById('top-tabs');
    tabsContainer.innerHTML = '';

    FILES.forEach((file, index) => {
        const button = document.createElement('button');
        button.className = 'doc-tab';
        button.textContent = file.name;
        button.dataset.index = index;
        button.setAttribute('role', 'tab');
        button.setAttribute('aria-selected', index === 0 ? 'true' : 'false');

        if (index === 0) button.classList.add('active');

        button.addEventListener('click', () => switchDocument(index));
        button.addEventListener('keydown', handleTabKeydown);
        tabsContainer.appendChild(button);
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
