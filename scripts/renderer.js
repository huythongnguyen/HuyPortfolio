/**
 * Standard Markdown Renderer
 * 
 * Handles rendering of regular (non-bilingual) markdown documents.
 * Parses markdown, adds navigation IDs to headings, and builds
 * a hierarchical Table of Contents.
 */

import { scrollToSection, setupScrollSpy } from './navigation.js';
import { prepareSection, revealSection } from './textReveal.js';
import { injectMediaAfterHeading, transformVideos, revealMediaAfterText } from './media.js';

/**
 * Renders markdown content with auto-generated heading IDs.
 * Also sets up gradual word-by-word reveal animation.
 * 
 * Heading ID format:
 *   h1-1, h1-2, ...
 *   h2-1-1, h2-1-2, ... (nested under h1-1)
 *   h3-1-1-1, h3-1-1-2, ... (nested under h2-1-1)
 * 
 * @param {string} markdown - Raw markdown content
 */
export function renderFullContent(markdown) {
    const html = DOMPurify.sanitize(marked.parse(markdown));
    const temp = document.createElement('div');
    temp.innerHTML = html;

    // Generate hierarchical IDs for headings
    let h1Count = 0, h2Count = 0, h3Count = 0;

    temp.querySelectorAll('h1, h2, h3').forEach(heading => {
        const level = heading.tagName.toLowerCase();
        let id;

        if (level === 'h1') {
            h1Count++;
            h2Count = 0;
            h3Count = 0;
            id = `h1-${h1Count}`;
        } else if (level === 'h2') {
            h2Count++;
            h3Count = 0;
            id = `h2-${h1Count}-${h2Count}`;
        } else {
            h3Count++;
            id = `h3-${h1Count}-${h2Count}-${h3Count}`;
        }

        heading.id = id;
    });

    const contentPanel = document.getElementById('content');
    contentPanel.innerHTML = '';
    contentPanel.classList.remove('bilingual-mode');

    contentPanel.appendChild(temp);

    // Setup gradual text reveal
    setupTextReveal(contentPanel);

    // Inject media galleries for specific sections
    injectMediaGalleries(contentPanel);

    // Transform videos in the final content
    transformVideos(contentPanel);

    // Setup media reveal after text completes
    revealMediaAfterText(contentPanel);
}

/**
 * Injects media galleries into appropriate sections.
 * Currently supports:
 * - Google Multimodal Embeddings showcase
 * 
 * @param {HTMLElement} container - The content container
 */
function injectMediaGalleries(container) {
    // Media can now be injected via standard Markdown syntax:
    // ![alt](path/to/video.mp4 "description")
}

/**
 * Sets up word-by-word text reveal for standard content.
 * Uses IntersectionObserver to reveal sections as they scroll into view.
 */
function setupTextReveal(container) {
    // Group content by sections (h1, h2 based)
    const sections = [];
    let currentSection = null;

    Array.from(container.children).forEach(child => {
        if (child.tagName === 'H1' || child.tagName === 'H2') {
            if (currentSection) {
                sections.push(currentSection);
            }
            currentSection = document.createElement('div');
            currentSection.className = 'content-section';
            currentSection.id = child.id ? `section-${child.id}` : null;
        }

        if (currentSection) {
            currentSection.appendChild(child.cloneNode(true));
        } else {
            // Content before first heading
            if (!sections.length) {
                currentSection = document.createElement('div');
                currentSection.className = 'content-section';
            }
            currentSection.appendChild(child.cloneNode(true));
        }
    });

    if (currentSection) {
        sections.push(currentSection);
    }

    // Replace content with sectioned version
    container.innerHTML = '';
    sections.forEach(section => {
        container.appendChild(section);
        prepareSection(section);
    });

    // Setup intersection observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('text-revealed')) {
                revealSection(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -20% 0px'
    });

    sections.forEach(section => observer.observe(section));

    // Reveal first section immediately
    if (sections.length > 0) {
        revealSection(sections[0]);
    }
}

/**
 * Builds a hierarchical Table of Contents from markdown headings.
 * 
 * Structure:
 *   - H1 items at root level
 *     - H2 items nested under H1
 *       - H3 items nested under H2
 * 
 * @param {string} markdown - Raw markdown content
 */
export function buildTOC(markdown) {
    const html = DOMPurify.sanitize(marked.parse(markdown));
    const temp = document.createElement('div');
    temp.innerHTML = html;

    const tocContainer = document.getElementById('toc');
    tocContainer.innerHTML = '';

    const ul = document.createElement('ul');
    ul.className = 'toc-list';

    let h1Count = 0, h2Count = 0, h3Count = 0;
    let currentH1Li = null, currentH2Li = null;

    temp.querySelectorAll('h1, h2, h3').forEach(heading => {
        const level = heading.tagName.toLowerCase();
        const text = heading.textContent.trim();

        if (level === 'h1') {
            h1Count++;
            h2Count = 0;
            h3Count = 0;

            currentH1Li = createTOCItemWithChildren(text, `#h1-${h1Count}`, 'toc-h1');
            ul.appendChild(currentH1Li);
            currentH2Li = null;

        } else if (level === 'h2' && currentH1Li) {
            h2Count++;
            h3Count = 0;

            const h2Ul = currentH1Li.querySelector('.toc-children');
            currentH2Li = createTOCItemWithChildren(text, `#h2-${h1Count}-${h2Count}`, 'toc-h2');
            h2Ul.appendChild(currentH2Li);

        } else if (level === 'h3' && currentH2Li) {
            h3Count++;

            const h3Ul = currentH2Li.querySelector('.toc-children');
            const h3Li = createTOCItem(text, `#h3-${h1Count}-${h2Count}-${h3Count}`, 'toc-h3');
            h3Ul.appendChild(h3Li);
        }
    });

    tocContainer.appendChild(ul);

    // Setup scroll spy after TOC is built
    setupScrollSpy();
}

/**
 * Creates a TOC item with a nested children container.
 * Used for H1 and H2 items that may have nested children.
 * 
 * @param {string} text - Link text
 * @param {string} href - Link href
 * @param {string} className - CSS class
 * @returns {HTMLElement} - List item with nested ul
 */
function createTOCItemWithChildren(text, href, className) {
    const li = document.createElement('li');
    li.className = 'toc-item';

    const a = document.createElement('a');
    a.href = href;
    a.className = `toc-link ${className}`;
    a.textContent = text;
    a.addEventListener('click', scrollToSection);

    const childUl = document.createElement('ul');
    childUl.className = 'toc-children';

    li.appendChild(a);
    li.appendChild(childUl);

    return li;
}

/**
 * Creates a simple TOC item without children container.
 * 
 * @param {string} text - Link text
 * @param {string} href - Link href
 * @param {string} className - CSS class
 * @returns {HTMLElement} - List item
 */
function createTOCItem(text, href, className) {
    const li = document.createElement('li');
    li.className = 'toc-item';

    const a = document.createElement('a');
    a.href = href;
    a.className = `toc-link ${className}`;
    a.textContent = text;
    a.addEventListener('click', scrollToSection);

    li.appendChild(a);
    return li;
}

