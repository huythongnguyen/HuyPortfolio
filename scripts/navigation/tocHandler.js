/**
 * TOC Click Handler (Unified)
 * 
 * Handles TOC link clicks using pre-parsed sections.
 * Works identically for both standard and bilingual content.
 * Simply scrolls to the target section.
 */

import { getSectionElements } from '../renderers/unified.js';
import { stopCurrentReveal, revealAllImmediately } from '../core/textReveal.js';

/**
 * Finds the section element containing a target element.
 */
function findContainingSection(targetId) {
    const target = document.getElementById(targetId);
    if (!target) return null;

    // Check if target IS a section
    if (target.classList.contains('content-section') ||
        target.classList.contains('bilingual-chapter') ||
        target.classList.contains('bilingual-main-section') ||
        target.classList.contains('bilingual-preamble')) {
        return target;
    }

    // Check if target is INSIDE a section
    return target.closest('.content-section, .bilingual-chapter, .bilingual-main-section, .bilingual-preamble');
}

/**
 * Creates a TOC click handler for a specific target.
 * 
 * @param {string} targetId - ID of the target element
 * @returns {Function} Click handler
 */
export function createTOCClickHandler(targetId) {
    return (event) => {
        event.preventDefault();

        // If user clicks TOC, stop slow reveal and show everything so they can read what they clicked
        stopCurrentReveal();
        revealAllImmediately(document.getElementById('content'));

        const targetSection = findContainingSection(targetId);

        // Scroll to target element (may be heading inside section)
        const targetElement = document.getElementById(targetId);
        if (targetElement || targetSection) {
            (targetElement || targetSection).scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }

        // Update TOC active state
        document.querySelectorAll('#toc .toc-link').forEach(a => a.classList.remove('active'));
        event.target.classList.add('active');
    };
}

/**
 * Direct scroll-to-section handler for event listeners.
 * Uses getAttribute to get target from href.
 */
export function scrollToSection(event) {
    event.preventDefault();

    const href = event.target.getAttribute('href');
    if (!href) return;

    const targetId = href.substring(1); // Remove #
    const handler = createTOCClickHandler(targetId);
    handler(event);
}
