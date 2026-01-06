/**
 * Unified Renderer
 * 
 * Renders pre-parsed documents with consistent section structure.
 * Both standard and bilingual documents use the same reveal system.
 * 
 * Pre-parsed sections are stored and accessible for TOC navigation.
 */

import { setupScrollSpy } from '../navigation/scrollSpy.js';
import { createTOCClickHandler } from '../navigation/tocHandler.js';
import { prepareSection, revealSection, queueSectionReveal } from '../core/textReveal.js';
import { transformVideos, revealMediaAfterText } from '../utils/media.js';

// Store parsed sections for TOC access
let currentSections = [];

/**
 * Gets all pre-parsed sections (for TOC handler)
 */
export function getParsedSections() {
    return currentSections;
}

/**
 * Gets section DOM elements in order
 */
export function getSectionElements() {
    return currentSections.map(s => document.getElementById(s.id)).filter(Boolean);
}

// =============================================================================
// STANDARD RENDERING
// =============================================================================

/**
 * Renders a standard document from parsed sections.
 */
export function renderStandardDocument(parsedDoc) {
    const contentPanel = document.getElementById('content');
    contentPanel.innerHTML = '';
    contentPanel.classList.remove('bilingual-mode');

    // Store sections for TOC access
    currentSections = parsedDoc.sections;

    // Render each section
    parsedDoc.sections.forEach(section => {
        const sectionDiv = document.createElement('div');
        sectionDiv.className = 'content-section';
        sectionDiv.id = section.id;
        sectionDiv.innerHTML = section.html;
        contentPanel.appendChild(sectionDiv);
    });

    // Transform videos
    transformVideos(contentPanel);

    // Setup media reveal
    revealMediaAfterText(contentPanel);

    // Setup reveal observer
    setupStandardRevealObserver();
}

/**
 * Builds TOC for standard document.
 */
export function buildStandardTOC(parsedDoc) {
    const tocContainer = document.getElementById('toc');
    tocContainer.innerHTML = '';

    const ul = document.createElement('ul');
    ul.className = 'toc-list';

    parsedDoc.tocItems.forEach(item => {
        const li = createTOCItemWithChildren(item);
        ul.appendChild(li);
    });

    tocContainer.appendChild(ul);
    setupScrollSpy();
}

/**
 * Creates TOC item with nested children.
 */
function createTOCItemWithChildren(item) {
    const li = document.createElement('li');
    li.className = 'toc-item';

    const a = document.createElement('a');
    a.href = `#${item.id}`;
    a.className = `toc-link toc-h${item.level}`;
    a.textContent = item.title;
    a.addEventListener('click', createTOCClickHandler(item.id));
    li.appendChild(a);

    if (item.children && item.children.length > 0) {
        const childUl = document.createElement('ul');
        childUl.className = 'toc-children';

        item.children.forEach(child => {
            childUl.appendChild(createTOCItemWithChildren(child));
        });

        li.appendChild(childUl);
    }

    return li;
}

/**
 * Sets up intersection observer for standard content.
 * Uses queueSectionReveal for sequential reveal (Zen: one section at a time).
 */
function setupStandardRevealObserver() {
    const sectionElements = getSectionElements();

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('text-revealed')) {
                // Queue for sequential reveal (Seijaku - tranquility)
                queueSectionReveal(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -20% 0px'
    });

    sectionElements.forEach(section => {
        prepareSection(section);
        observer.observe(section);
    });

    // Queue first section immediately (will start revealing right away)
    if (sectionElements.length > 0) {
        queueSectionReveal(sectionElements[0]);
    }
}

// =============================================================================
// BILINGUAL RENDERING
// =============================================================================

/**
 * Renders a bilingual document from parsed sections.
 */
export function renderBilingualDocument(parsedDoc) {
    const contentPanel = document.getElementById('content');
    contentPanel.innerHTML = '';
    contentPanel.classList.add('bilingual-mode');

    // Store sections for TOC access
    currentSections = parsedDoc.sections;

    // Render each section
    parsedDoc.sections.forEach(section => {
        let sectionDiv;

        if (section.isBilingual) {
            sectionDiv = createBilingualSection(section);
        } else {
            // Preamble or non-bilingual section
            sectionDiv = document.createElement('div');
            sectionDiv.className = 'bilingual-preamble visible';
            sectionDiv.id = section.id;
            sectionDiv.innerHTML = section.html;
        }

        contentPanel.appendChild(sectionDiv);
    });

    // Transform videos
    transformVideos(contentPanel);

    // Setup media reveal
    revealMediaAfterText(contentPanel);

    // Setup reveal observer
    setupBilingualRevealObserver();
}

/**
 * Creates a bilingual section with Vietnamese primary and English collapsible.
 */
function createBilingualSection(section) {
    const div = document.createElement('div');
    div.id = section.id;
    div.className = section.type === 'chapter' ? 'bilingual-chapter' : 'bilingual-main-section';

    // Vietnamese - primary
    const vnDiv = document.createElement('div');
    vnDiv.className = 'bilingual-vn';
    vnDiv.innerHTML = section.vnHtml;
    div.appendChild(vnDiv);

    // English toggle
    if (section.enHtml) {
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'en-toggle';
        toggleBtn.textContent = 'English';
        toggleBtn.setAttribute('aria-expanded', 'false');

        const enDiv = document.createElement('div');
        enDiv.className = 'bilingual-en';
        enDiv.innerHTML = section.enHtml;

        toggleBtn.addEventListener('click', () => {
            const isRevealed = enDiv.classList.contains('revealed');
            enDiv.classList.toggle('revealed', !isRevealed);
            toggleBtn.classList.toggle('active', !isRevealed);
            toggleBtn.setAttribute('aria-expanded', !isRevealed ? 'true' : 'false');
        });

        div.appendChild(toggleBtn);
        div.appendChild(enDiv);
    }

    return div;
}

/**
 * Builds TOC for bilingual document.
 */
export function buildBilingualTOC(parsedDoc) {
    const tocContainer = document.getElementById('toc');
    tocContainer.innerHTML = '';

    const ul = document.createElement('ul');
    ul.className = 'toc-list';

    parsedDoc.tocItems.forEach(item => {
        const li = createTOCItemWithChildren(item);
        ul.appendChild(li);
    });

    tocContainer.appendChild(ul);
    setupScrollSpy();
}

/**
 * Sets up intersection observer for bilingual content.
 */
function setupBilingualRevealObserver() {
    const sections = document.querySelectorAll('.bilingual-chapter, .bilingual-main-section');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('visible')) {
                entry.target.classList.add('visible');
                // Queue for sequential reveal (Zen: one section at a time)
                queueSectionReveal(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    sections.forEach(section => {
        prepareSection(section);
        observer.observe(section);
    });

    // Reveal preamble immediately
    const preamble = document.querySelector('.bilingual-preamble');
    if (preamble) {
        prepareSection(preamble);
        revealSection(preamble);
    }
}
