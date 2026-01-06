/**
 * Simple Linear Text Reveal
 * 
 * gradually reveals text from beginning to end.
 */

let isRevealing = false;
let stopReveal = false;
let revealSpeed = 30; // ms per word (Default: Medium)

const SPEEDS = {
    fast: 40,
    medium: 60, // Was the previous requested speed
    slow: 80,
    slower: 100,
    instant: 0
};

export function initTextReveal() {
    // Reset state
    stopReveal = false;
    isRevealing = false;
    revealSpeed = SPEEDS.medium;
}

export function setRevealSpeed(speed) {
    if (typeof speed === 'string' && SPEEDS.hasOwnProperty(speed)) {
        revealSpeed = SPEEDS[speed];
    } else if (typeof speed === 'number') {
        revealSpeed = speed;
    }
}

/**
 * Prepares the content for reveal by wrapping words in spans.
 * Returns the array of word elements to reveal.
 */
export function prepareContentForReveal(container) {
    // 1. Wrap words
    processNode(container);

    // 2. Hide everything initially
    const words = container.querySelectorAll('.reveal-word');
    words.forEach(w => w.style.opacity = '0');

    return Array.from(words);
}

function processNode(node) {
    if (node.nodeType === Node.TEXT_NODE) {
        if (node.textContent.trim().length > 0) {
            const span = document.createElement('span');
            span.innerHTML = node.textContent.split(/\s+/).map(word => {
                if (word.length === 0) return '';
                return `<span class="reveal-word">${word} </span>`;
            }).join('');
            node.parentNode.replaceChild(span, node);
        }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
        // Skip already processed or specific tags
        if (node.classList.contains('reveal-word') ||
            ['SCRIPT', 'STYLE', 'BUTTON'].includes(node.tagName)) {
            return;
        }

        // Convert live list to array to avoid issues during replacement
        const children = Array.from(node.childNodes);
        children.forEach(child => processNode(child));
    }
}

/**
 * Starts the sequential reveal of the provided elements.
 */
export async function startLinearReveal(elements, onComplete) {
    if (isRevealing) return;
    isRevealing = true;
    stopReveal = false;

    for (const el of elements) {
        if (stopReveal) break;

        el.style.opacity = '1';
        el.classList.add('revealed');

        // Handle special parent elements (LI, A)
        handleParentReveal(el);

        // Wait for simple delay
        await new Promise(r => setTimeout(r, revealSpeed));

        // Auto-scroll if near bottom
        ensureVisible(el);
    }

    isRevealing = false;
    if (onComplete && !stopReveal) onComplete();
}

function handleParentReveal(el) {
    // Reveal list markers
    const li = el.closest('li');
    if (li && !li.classList.contains('revealed-marker')) {
        li.classList.add('revealed-marker');
    }

    // Reveal links
    const a = el.closest('a');
    if (a && !a.classList.contains('link-revealed')) {
        a.classList.add('link-revealed');
    }
}

export function stopCurrentReveal() {
    stopReveal = true;
    isRevealing = false; // Force allow new reveal to start immediately
}

/**
 * Reveals everything immediately.
 */
export function revealAllImmediately(container) {
    stopReveal = true;
    const words = container.querySelectorAll('.reveal-word');
    words.forEach(w => {
        w.style.opacity = '1';
        w.classList.add('revealed');
        handleParentReveal(w);
    });
}

let lastScrollTime = 0;

function ensureVisible(element) {
    const now = Date.now();
    // Throttle scrolling to ensure previous smooth scroll completes (avoid zigzag)
    if (now - lastScrollTime < 800) return;

    const rect = element.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    // Start scrolling when text gets within 20% of the bottom
    const scrollThreshold = viewportHeight - (viewportHeight * 0.2);

    if (rect.bottom > scrollThreshold) {
        // Scroll so the active line moves up to ~65% of viewport height
        // This creates a smooth, periodic "slide up" rather than a jump
        const targetVisualPosition = viewportHeight * 0.65;
        const scrollAmount = rect.bottom - targetVisualPosition;

        if (scrollAmount > 0) {
            window.scrollBy({
                top: scrollAmount,
                behavior: 'smooth'
            });
            lastScrollTime = now;
        }
    }
}
