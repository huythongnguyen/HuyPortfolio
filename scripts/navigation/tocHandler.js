/**
 * TOC Click Handler (Unified)
 * 
 * Handles TOC link clicks using pre-parsed sections.
 * Works identically for both standard and bilingual content.
 * 
 * Zen TOC Reveal Philosophy:
 * 
 *   'instant-skip' mode (Resume):
 *     - Previous sections (revealed): Keep as is — respect completed journeys
 *     - Previous sections (unrevealed): Reveal INSTANTLY — they are "passed through"
 *     - Target section: Reveal word-by-word — honor the destination
 *     Shizen (自然) — Feels like opening a book to a chapter
 * 
 *   'parallel' mode (Diamond Sutra):
 *     - All unrevealed sections start animating together
 *     - Every word matters in sacred texts
 *     Seijaku (静寂) — Peaceful, contemplative unfolding
 */

import { getSectionElements } from '../renderers/unified.js';
import { revealSection, revealSectionInstant, enableInteractiveMode } from '../core/textReveal.js';
import { getTocRevealMode } from '../core/config.js';

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
 * Checks if a section has started or completed reveal.
 */
function isRevealed(section) {
    return section.classList.contains('text-revealed') ||
        section.classList.contains('text-revealing');
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

        // TOC click = user is actively exploring, enable interactive mode
        enableInteractiveMode();

        const targetSection = findContainingSection(targetId);
        if (!targetSection) return;

        const allSections = getSectionElements();
        const targetIndex = allSections.indexOf(targetSection);
        const revealMode = getTocRevealMode();

        if (targetIndex >= 0) {
            if (revealMode === 'instant-skip') {
                // Zen 'instant-skip' mode:
                // Skipped sections reveal instantly, target reveals word-by-word
                // Shizen (自然) — Feels like opening a book to a chapter

                for (let i = 0; i < targetIndex; i++) {
                    const section = allSections[i];
                    if (!isRevealed(section)) {
                        revealSectionInstant(section);  // Instant for skipped
                    }
                }

                // Target section gets the full contemplative experience
                revealSection(allSections[targetIndex]);

            } else {
                // Zen 'parallel' mode:
                // All unrevealed sections start animating together
                // Seijaku (静寂) — Every word matters in sacred texts

                for (let i = 0; i <= targetIndex; i++) {
                    revealSection(allSections[i]);  // Animated (parallel)
                }
            }
        } else {
            // Fallback: reveal target section
            revealSection(targetSection);
        }

        // Scroll to target element (may be heading inside section)
        const targetElement = document.getElementById(targetId);
        setTimeout(() => {
            (targetElement || targetSection).scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }, 50);

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
