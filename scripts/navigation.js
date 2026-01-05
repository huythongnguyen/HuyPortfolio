/**
 * Navigation and User Interaction
 * 
 * Handles document tab switching, TOC scroll behavior,
 * keyboard navigation, and scroll progress tracking.
 */

import { FILES, currentDocument, setCurrentDocument } from './config.js';
import { splitBilingualContent, renderBilingualContent, buildBilingualTOC } from './bilingual.js';
import { renderFullContent, buildTOC } from './renderer.js';
import { setSpeed } from './textReveal.js';

/**
 * Fetches a markdown file from the server.
 * 
 * @param {string} filepath - Path to the markdown file
 * @returns {Promise<string>} - Markdown content or error message
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
 * Loads and renders a document.
 * Automatically detects bilingual content and uses appropriate renderer.
 * Applies document-specific settings like reveal speed.
 * 
 * @param {Object} fileInfo - Document config { name, path, bilingual, defaultSpeed }
 */
export async function loadDocument(fileInfo) {
    const markdown = await fetchMarkdown(fileInfo.path);
    setCurrentDocument({ name: fileInfo.name, markdown });

    // Apply document-specific reveal speed if configured
    if (fileInfo.defaultSpeed) {
        setSpeed(fileInfo.defaultSpeed);
    }

    // Use bilingual renderer if enabled and content has English section
    if (fileInfo.bilingual && splitBilingualContent(markdown)) {
        renderBilingualContent(markdown);
        buildBilingualTOC(markdown);
    } else {
        renderFullContent(markdown);
        buildTOC(markdown);
    }
}

/**
 * Switches to a different document by tab index.
 * Updates tab states and loads the selected document.
 * 
 * @param {number} index - Index in FILES array
 */
export async function switchDocument(index) {
    document.querySelectorAll('.doc-tab').forEach((tab, i) => {
        tab.classList.toggle('active', i === index);
        tab.setAttribute('aria-selected', i === index ? 'true' : 'false');
    });

    await loadDocument(FILES[index]);
}

/**
 * Renders the document tab buttons.
 * Each tab corresponds to a document in the FILES config.
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
 * Arrow keys move between tabs with wraparound.
 * 
 * @param {KeyboardEvent} event
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
 * Scrolls smoothly to a section when clicking a TOC link.
 * Also updates the active state in the TOC.
 * 
 * @param {Event} event - Click event
 */
export function scrollToSection(event) {
    event.preventDefault();
    const targetId = event.target.getAttribute('href').substring(1);
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Update active state in TOC
        document.querySelectorAll('#toc .toc-link').forEach(a => a.classList.remove('active'));
        event.target.classList.add('active');
    }
}

/**
 * Updates the scroll progress indicator.
 * Sets a CSS variable that controls the progress bar width.
 */
export function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    document.body.style.setProperty('--scroll-progress', `${progress}%`);
}

/**
 * Scroll Spy - Tracks current section and highlights TOC
 * 
 * Watches for sections entering/leaving viewport and updates
 * the corresponding TOC link to show current reading position.
 */
let scrollSpyObserver = null;

/**
 * Sets up scroll spy to highlight current section in TOC.
 * Call this after building the TOC.
 */
export function setupScrollSpy() {
    // Clean up existing observer
    if (scrollSpyObserver) {
        scrollSpyObserver.disconnect();
    }

    // Find all sections that have corresponding TOC links
    const sections = document.querySelectorAll('[id]');
    const tocLinks = document.querySelectorAll('#toc .toc-link');

    // Create a map of section IDs to TOC links
    const sectionMap = new Map();
    tocLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
            const id = href.substring(1);
            sectionMap.set(id, link);
        }
    });

    // Track which sections are visible
    const visibleSections = new Set();

    scrollSpyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const id = entry.target.id;

            if (entry.isIntersecting) {
                visibleSections.add(id);
            } else {
                visibleSections.delete(id);
            }
        });

        // Find the topmost visible section
        updateActiveTOCLink(visibleSections, sectionMap);
    }, {
        rootMargin: '-10% 0px -70% 0px', // Trigger when section is in top 30% of viewport
        threshold: 0
    });

    // Observe all sections that have TOC links
    sections.forEach(section => {
        if (sectionMap.has(section.id)) {
            scrollSpyObserver.observe(section);
        }
    });
}

/**
 * Updates which TOC link is highlighted based on visible sections.
 * Highlights the topmost visible section.
 */
function updateActiveTOCLink(visibleSections, sectionMap) {
    // Remove all active states
    sectionMap.forEach(link => link.classList.remove('active'));

    if (visibleSections.size === 0) return;

    // Get all sections in document order
    const allSections = Array.from(document.querySelectorAll('[id]'));

    // Find the first visible section (topmost)
    for (const section of allSections) {
        if (visibleSections.has(section.id) && sectionMap.has(section.id)) {
            const link = sectionMap.get(section.id);
            link.classList.add('active');

            // Scroll the TOC to show the active link
            scrollTOCIntoView(link);
            break;
        }
    }
}

/**
 * Scrolls the sidebar TOC to keep the active link visible.
 */
function scrollTOCIntoView(activeLink) {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;

    const linkRect = activeLink.getBoundingClientRect();
    const sidebarRect = sidebar.getBoundingClientRect();

    // Check if the link is outside the visible area of the sidebar
    if (linkRect.top < sidebarRect.top + 50 || linkRect.bottom > sidebarRect.bottom - 50) {
        activeLink.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

