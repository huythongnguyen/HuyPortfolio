/**
 * Text Reveal Animation
 * 
 * Gradually reveals text word by word, creating a meditative reading experience.
 * Following Zen principle: Seijaku (静寂) - stillness, peaceful unfolding.
 * 
 * Speed levels:
 *   - slow: 150ms per word (contemplative)
 *   - medium: 80ms per word (balanced)
 *   - fast: 40ms per word (quick read)
 *   - instant: no animation
 */

const SPEEDS = {
    slow: 150,
    medium: 80,
    fast: 40,
    instant: 0
};

let currentSpeed = 'slow';

// ============================================================================
// SEQUENTIAL REVEAL QUEUE
// ============================================================================
// Zen principle: Seijaku (静寂) — Only one section reveals at a time.
// Each section deserves its own moment of arrival before the next begins.

let revealQueue = [];
let isRevealing = false;
let interactiveMode = false;  // Tracks if user has scrolled/clicked (vs initial load)

/**
 * Enables interactive mode (scrolling reveals immediately, not queued).
 * Called after initial page load completes or user interacts.
 */
export function enableInteractiveMode() {
    interactiveMode = true;
}

/**
 * Disables interactive mode (back to sequential queue).
 * Called when switching documents.
 */
export function disableInteractiveMode() {
    interactiveMode = false;
}

/**
 * Adds a section to the reveal queue (for scroll-triggered reveals).
 * Sections reveal one at a time, in order.
 * 
 * In interactive mode, reveals immediately instead of queueing.
 */
export function queueSectionReveal(section) {
    // Skip if already revealed or revealing
    if (section.classList.contains('text-revealed') ||
        section.classList.contains('text-revealing')) {
        return;
    }

    // In interactive mode (after user scroll/click), reveal immediately
    if (interactiveMode) {
        revealSection(section);
        return;
    }

    // Otherwise, use sequential queue (initial page load)
    if (revealQueue.includes(section)) return;

    revealQueue.push(section);
    processRevealQueue();
}

/**
 * Processes the reveal queue sequentially.
 */
async function processRevealQueue() {
    if (isRevealing || revealQueue.length === 0) return;

    isRevealing = true;

    while (revealQueue.length > 0) {
        const section = revealQueue.shift();

        // Skip if already revealed while waiting
        if (section.classList.contains('text-revealed')) continue;

        await revealSectionInternal(section);

        // Auto-scroll to next section if one exists
        // Shizen (自然) — Gentle guidance through content
        if (revealQueue.length > 0 && !interactiveMode) {
            const nextSection = revealQueue[0];

            // Only auto-scroll for H1 sections (top-most TOC items)
            // H2/H3 sections stay in place (focused reading)
            const isTopLevel = nextSection.id && nextSection.id.includes('section-h1-');

            if (isTopLevel) {

                // Small delay before scroll (let user appreciate the completed section)
                await new Promise(resolve => setTimeout(resolve, 300));

                // Smooth scroll to next section
                nextSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // Wait for scroll to settle before revealing next section
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }
    }

    isRevealing = false;

    // After initial load completes, enable interactive mode
    // (subsequent scroll reveals will be immediate, not queued)
    enableInteractiveMode();
}

/**
 * Clears the reveal queue (used when switching documents).
 */
export function clearRevealQueue() {
    revealQueue = [];
    isRevealing = false;
    interactiveMode = false;  // Reset to initial load mode
}

// ============================================================================
// SPEED CONTROL
// ============================================================================

export function getSpeedMs() {
    return SPEEDS[currentSpeed];
}

export function setSpeed(speed) {
    if (SPEEDS.hasOwnProperty(speed)) {
        currentSpeed = speed;
        updateSpeedButton();
        localStorage.setItem('zen-reveal-speed', speed);
    }
}

export function cycleSpeed() {
    const speeds = ['slow', 'medium', 'fast', 'instant'];
    const currentIndex = speeds.indexOf(currentSpeed);
    const nextIndex = (currentIndex + 1) % speeds.length;
    setSpeed(speeds[nextIndex]);
}

function updateSpeedButton() {
    const btn = document.getElementById('speed-control');
    if (!btn) return;

    const labels = {
        slow: '·',
        medium: '··',
        fast: '···',
        instant: '○'
    };

    btn.textContent = labels[currentSpeed];
    btn.title = `${currentSpeed}`;
}

// ============================================================================
// WORD WRAPPING
// ============================================================================

function wrapWords(element) {
    const walker = document.createTreeWalker(
        element,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );

    const textNodes = [];
    let node;
    while (node = walker.nextNode()) {
        if (node.textContent.trim()) {
            textNodes.push(node);
        }
    }

    textNodes.forEach(textNode => {
        const words = textNode.textContent.split(/(\s+)/);
        const fragment = document.createDocumentFragment();

        words.forEach(word => {
            if (word.trim()) {
                const span = document.createElement('span');
                span.className = 'reveal-word';
                span.textContent = word;
                fragment.appendChild(span);
            } else if (word) {
                fragment.appendChild(document.createTextNode(word));
            }
        });

        textNode.parentNode.replaceChild(fragment, textNode);
    });
}

export function prepareSection(section) {
    const elements = section.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, blockquote, td, th, figcaption, dd, dt');
    elements.forEach(el => {
        if (!el.classList.contains('words-wrapped')) {
            wrapWords(el);
            el.classList.add('words-wrapped');
        }
    });
}

// ============================================================================
// ELEMENT REVEAL
// ============================================================================

/**
 * Checks if a word ends with sentence-ending punctuation.
 * Zen timing: pause longer after natural breaks.
 */
function endsWithPause(wordText) {
    return /[.!?。！？]$/.test(wordText.trim());
}

/**
 * Reveals words in an element, one by one.
 * Zen principle: Kanso (簡素) - Simplicity in execution.
 */
function revealElement(element) {
    return new Promise(resolve => {
        const speed = getSpeedMs();

        // Instant reveal: no animation
        if (speed === 0) {
            element.querySelectorAll('.reveal-word').forEach(word => {
                word.classList.add('revealed');
            });
            if (element.tagName === 'LI') {
                element.classList.add('revealed-marker');
            }
            resolve();
            return;
        }

        // Gradual reveal: word by word
        const words = element.querySelectorAll('.reveal-word:not(.revealed)');
        let index = 0;

        const revealNext = () => {
            if (index >= words.length) {
                // Complete: add list marker if needed
                if (element.tagName === 'LI') {
                    element.classList.add('revealed-marker');
                }
                resolve();
                return;
            }

            // Reveal current word
            const word = words[index];
            word.classList.add('revealed');

            // Calculate next delay: pause longer after sentence endings
            // Seijaku (静寂) — Stillness at natural breaks
            const isPause = endsWithPause(word.textContent);
            const delay = isPause ? speed * 2 : speed;

            index++;
            setTimeout(revealNext, delay);
        };

        revealNext();
    });
}

// ============================================================================
// SECTION REVEAL
// ============================================================================

/**
 * Internal: Reveals a section's content gradually with animation.
 * Zen principle: Shizen (自然) - Natural, organic flow.
 */
async function revealSectionInternal(section) {
    // Skip if already revealing or revealed
    if (section.classList.contains('text-revealed') ||
        section.classList.contains('text-revealing')) {
        return;
    }

    // Prepare section for reveal
    prepareSection(section);
    section.classList.add('text-revealing');

    // Get all revealable elements
    const elements = section.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, blockquote, td, th, figcaption, dd, dt');

    // Reveal each element with natural pauses
    const speed = getSpeedMs();
    for (const element of elements) {
        await revealElement(element);

        // Pause between elements (only if animated)
        // Yohaku (余白) - Breathing space between thoughts
        if (speed > 0) {
            await new Promise(resolve => setTimeout(resolve, speed * 2));
        }
    }

    // Mark as complete
    section.classList.remove('text-revealing');
    section.classList.add('text-revealed');
}

/**
 * Reveals a section's content gradually with animation.
 * Safe to call multiple times - will not restart if already revealing.
 * 
 * For TOC clicks and direct reveals (bypasses queue).
 */
export async function revealSection(section) {
    return revealSectionInternal(section);
}

/**
 * Instantly reveals a section without animation.
 */
export function revealSectionInstant(section) {
    if (section.classList.contains('text-revealed')) return;

    prepareSection(section);

    section.querySelectorAll('.reveal-word').forEach(word => {
        word.classList.add('revealed');
    });

    section.querySelectorAll('li').forEach(li => {
        li.classList.add('revealed-marker');
    });

    section.classList.remove('text-revealing');
    section.classList.add('text-revealed');
}

export function revealAllInstant() {
    document.querySelectorAll('.reveal-word').forEach(word => {
        word.classList.add('revealed');
    });

    const allSections = document.querySelectorAll(
        '.content-section, .bilingual-chapter, .bilingual-main-section, .bilingual-preamble'
    );
    allSections.forEach(section => {
        section.classList.add('text-revealed');
        section.classList.remove('text-revealing');
    });
}

// ============================================================================
// SECTION HELPERS
// ============================================================================

/**
 * Gets all sections in document order.
 * Works for both standard and bilingual content.
 */
export function getAllSections() {
    let sections = Array.from(document.querySelectorAll('.content-section'));

    if (sections.length === 0) {
        sections = Array.from(document.querySelectorAll(
            '.bilingual-preamble, .bilingual-main-section, .bilingual-chapter'
        ));
    }

    return sections;
}

/**
 * Finds the parent section for a given element.
 */
export function findParentSection(element) {
    let section = element.closest('.content-section');
    if (section) return section;

    section = element.closest('.bilingual-chapter, .bilingual-main-section, .bilingual-preamble');
    if (section) return section;

    const id = element.id;
    if (id) {
        section = document.getElementById(`section-${id}`);
        if (section) return section;
    }

    return null;
}

// ============================================================================
// INITIALIZATION
// ============================================================================

export function initTextReveal() {
    const saved = localStorage.getItem('zen-reveal-speed');
    if (saved && SPEEDS.hasOwnProperty(saved)) {
        currentSpeed = saved;
    }

    const btn = document.getElementById('speed-control');
    if (btn) {
        btn.addEventListener('click', cycleSpeed);
        updateSpeedButton();
    }
}
