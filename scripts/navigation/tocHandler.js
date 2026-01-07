/**
 * TOC Click Handler (Unified)
 * 
 * Handles TOC link clicks using pre-parsed sections.
 * Works identically for both standard and bilingual content.
 * Simply scrolls to the target section.
 */

import { getSectionElements } from '../renderers/unified.js';
import { stopCurrentReveal, revealAllImmediately } from '../core/textReveal.js';
import { closeMobileMenu } from './mobileMenu.js';
import { setupScrollSpy } from './scrollSpy.js';

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

        const targetElement = document.getElementById(targetId);
        const scrollTarget = targetElement || targetSection;

        if (scrollTarget) {
            scrollTarget.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });

            // "Extra effort": Add a temporary pulse to show where we've landed
            const section = findContainingSection(targetId);
            if (section) {
                section.classList.add('jump-pulse');
                setTimeout(() => section.classList.remove('jump-pulse'), 2000);
            }
        }

        // Update TOC active state
        document.querySelectorAll('#toc .toc-link').forEach(a => a.classList.remove('active'));
        event.target.classList.add('active');

        // Close mobile menu if open
        closeMobileMenu();

        // Reset scroll spy to ensure proper TOC tracking after navigation
        setTimeout(() => setupScrollSpy(), 300);
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
