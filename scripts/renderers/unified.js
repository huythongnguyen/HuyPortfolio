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
import { transformVideos, revealMediaAfterText } from '../utils/media.js';
import {
    prepareSmartReveal,
    startLinearReveal,
    stopCurrentReveal,
    scrollToTop,
    setRevealSpeed
} from '../core/textReveal.js';
import { currentFileConfig } from '../core/config.js';

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
// UNIFIED RENDERING
// =============================================================================

/**
 * Renders any document from parsed sections.
 */
export function renderDocument(parsedDoc) {
    const contentPanel = document.getElementById('content');

    // 1. Initial Reset
    stopCurrentReveal();
    contentPanel.innerHTML = '';
    currentSections = parsedDoc.sections;

    // 2. Set mode classes
    if (parsedDoc.type === 'bilingual') {
        contentPanel.classList.add('bilingual-mode');
    } else {
        contentPanel.classList.remove('bilingual-mode');
    }

    // 3. Render Sections
    parsedDoc.sections.forEach(section => {
        let sectionDiv;
        if (parsedDoc.type === 'bilingual') {
            sectionDiv = section.isBilingual
                ? createBilingualSection(section)
                : createPreambleSection(section);
        } else {
            sectionDiv = createStandardSection(section);
        }
        contentPanel.appendChild(sectionDiv);
    });

    // 4. Global Transforms
    transformVideos(contentPanel);

    // 5. Setup Text Reveal
    const revealElements = collectRevealElements(contentPanel, parsedDoc.type);
    const isOverview = currentFileConfig?.initialMode === 'overview';

    // Save original speed if in overview mode
    const originalSpeed = currentFileConfig?.defaultSpeed || 'medium';

    if (isOverview) {
        setRevealSpeed('fast');
    }

    startLinearReveal(revealElements, () => {
        scrollToTop('smooth');
        if (isOverview) {
            setRevealSpeed(originalSpeed);
        }
        revealTabs();
    });

    // 6. Setup Secondary Reveal (Media)
    revealMediaAfterText(contentPanel);
}

/**
 * Standardizes TOC building for all document types.
 */
export function buildTOC(parsedDoc) {
    const tocContainer = document.getElementById('toc');
    tocContainer.innerHTML = '';

    const ul = document.createElement('ul');
    ul.className = 'toc-list';

    parsedDoc.tocItems.forEach(item => {
        ul.appendChild(createTOCItemWithChildren(item));
    });

    tocContainer.appendChild(ul);
    setupScrollSpy();
}

// =============================================================================
// SECTION HELPERS
// =============================================================================

function createStandardSection(section) {
    const div = document.createElement('div');
    div.className = 'content-section visible';
    div.id = section.id;
    div.innerHTML = section.html;
    return div;
}

function createPreambleSection(section) {
    const div = document.createElement('div');
    div.className = 'bilingual-preamble visible';
    div.id = section.id;
    div.innerHTML = section.html;
    return div;
}

function createBilingualSection(section) {
    const div = document.createElement('div');
    div.id = section.id;
    div.className = (section.type === 'chapter' ? 'bilingual-chapter' : 'bilingual-main-section') + ' visible';

    // Vietnamese - primary
    const vnDiv = document.createElement('div');
    vnDiv.className = 'bilingual-vn';
    vnDiv.innerHTML = section.vnHtml;
    div.appendChild(vnDiv);

    // English collapsible
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

// =============================================================================
// REVEAL HELPERS
// =============================================================================

/**
 * Collects elements that should participate in the word-by-word reveal.
 */
function collectRevealElements(container, type) {
    const totalWordCount = container.innerText.split(/\s+/).length;
    const forceBlocks = totalWordCount > 300;
    const isMeditative = currentFileConfig?.defaultSpeed === 'slower' || currentFileConfig?.defaultSpeed === 'meditative';

    if (type !== 'bilingual') {
        return prepareSmartReveal(container, forceBlocks, isMeditative);
    }

    // Bilingual logic: skip hidden English, only reveal Vietnamese/Preamble
    const targets = container.querySelectorAll('.bilingual-preamble, .bilingual-vn');
    let elements = [];
    targets.forEach(target => {
        elements = elements.concat(prepareSmartReveal(target, forceBlocks, isMeditative));
    });
    return elements;
}

/**
 * Helper to reveal tabs after text animation.
 */
function revealTabs() {
    const tabs = document.getElementById('top-tabs');
    if (tabs) {
        tabs.classList.add('visible');
        tabs.classList.add('perma-visible');
    }
}

/**
 * Recursive TOC item creation.
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
