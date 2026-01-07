/**
 * Simple Linear Text Reveal
 * 
 * gradually reveals text from beginning to end.
 */

let isRevealing = false;
let stopReveal = false;
let revealSpeed = 30; // ms per word (Default: Medium)

const SPEEDS = {
    fast: 20,    // For rapid overview
    medium: 60,
    slow: 100,
    slower: 140, // Balanced contemplative speed
    meditative: 250,
    instant: 0
};

export function initTextReveal() {
    // Reset state
    stopReveal = false;
    isRevealing = false;

    // Zen Logic: Mobile readers often appreciate a much slower pace to avoid dizziness and foster stillness
    const isMobile = window.innerWidth <= 900;
    revealSpeed = isMobile ? SPEEDS.medium * 1.8 : SPEEDS.medium;
}

export function setRevealSpeed(speed) {
    if (typeof speed === 'string' && SPEEDS.hasOwnProperty(speed)) {
        revealSpeed = SPEEDS[speed];
    } else if (typeof speed === 'number') {
        revealSpeed = speed;
    }
}

/**
 * Smart Reveal: Prepares content based on length.
 * For short content (like cover page), it uses word-by-word.
 * For long content, it uses block-by-block (paragraphs).
 */
export function prepareSmartReveal(container, forceBlocks = false, forceWordByWord = false) {
    const wordCount = container.innerText.split(/\s+/).length;

    // Zen Logic: 
    // forceWordByWord takes precedence (for sacred texts)
    // Otherwise, if it's a lot of text, reveal by blocks
    // If it's sparse, reveal word-by-word
    if (forceWordByWord) {
        return prepareContentForReveal(container);
    }

    if (wordCount > 150 || forceBlocks) {
        return prepareBlocksForReveal(container);
    } else {
        return prepareContentForReveal(container);
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

/**
 * Prepares blocks (p, li, h1-6) for fade-in reveal.
 */
export function prepareBlocksForReveal(container) {
    const blocks = container.querySelectorAll('h1, h2, h3, p, li, blockquote, pre, img, table');
    blocks.forEach(b => {
        b.style.opacity = '0';
        b.style.transition = `opacity 1s ease, transform 1s ease`;
        b.style.transform = 'translateY(10px)';
        b.classList.add('reveal-block');
    });
    return Array.from(blocks);
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

    // Check for instant mode preference
    if (isInstantMode()) {
        elements.forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
            el.classList.add('revealed');
            handleParentReveal(el);
        });
        updateMandalaRotation(1);
        if (onComplete) onComplete();
        return;
    }

    isRevealing = true;
    stopReveal = false;

    // Provide a way to skip mid-animation
    showSkipButton(() => {
        elements.forEach(el => {
            if (!el.classList.contains('revealed')) {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
                el.classList.add('revealed');
                handleParentReveal(el);
            }
        });
        updateMandalaRotation(1);
        stopReveal = true;
        if (onComplete) onComplete();
    });

    const total = elements.length;
    let revealedCount = 0;

    // --- REACH/CATCH-UP LOGIC ---
    // If the user scrolls ahead, we should reveal everything they bring into view
    const catchUpListener = () => {
        const viewportBottom = window.scrollY + window.innerHeight;
        elements.forEach((el, index) => {
            if (!el.classList.contains('revealed')) {
                const rect = el.getBoundingClientRect();
                const absoluteTop = rect.top + window.scrollY;

                // If it's already on screen or behind us, reveal it instantly
                if (absoluteTop < viewportBottom + 100) {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                    el.classList.add('revealed');
                    handleParentReveal(el);
                }
            }
        });
    };

    window.addEventListener('scroll', catchUpListener);

    for (const el of elements) {
        if (stopReveal) break;

        // Skip if already revealed by catch-up or skip
        if (el.classList.contains('revealed')) {
            revealedCount++;
            continue;
        }

        const isBlock = el.classList.contains('reveal-block');

        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
        el.classList.add('revealed');
        revealedCount++;

        // Update Mandala rotation as percentage of progress
        updateMandalaRotation(revealedCount / total);

        // Handle special parent elements (LI, A)
        handleParentReveal(el);

        // Zen Timing: 
        // Blocks (paragraphs) deserve more "digestion" time than words
        const delay = isBlock ? 400 : revealSpeed;
        await new Promise(r => setTimeout(r, delay));

        // Auto-scroll if near bottom AND user hasn't scrolled manually recently
        const timeSinceLastScroll = Date.now() - userLastScrollTime;
        if (timeSinceLastScroll > 2000) {
            ensureVisible(el);
        }
    }

    window.removeEventListener('scroll', catchUpListener);
    isRevealing = false;
    hideSkipButton();
    if (onComplete && !stopReveal) onComplete();
}

let userLastScrollTime = 0;
let lastAutoScrollTime = 0;

window.addEventListener('scroll', () => {
    // We only track manual scrolls if NOT currently auto-scrolling
    if (Date.now() - lastAutoScrollTime > 1000) {
        userLastScrollTime = Date.now();
    }
}, { passive: true });

function updateMandalaRotation(progress) {
    // Rotate up to 360 degrees based on completion
    const rotation = progress * 360;
    document.documentElement.style.setProperty('--reveal-rotate', `${rotation}deg`);
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
    hideSkipButton();
}

const REVEAL_PREF_KEY = 'zen-reveal-instant';

export function isInstantMode() {
    return localStorage.getItem(REVEAL_PREF_KEY) === 'true';
}

export function toggleInstantMode() {
    const newVal = !isInstantMode();
    localStorage.setItem(REVEAL_PREF_KEY, newVal);
    return newVal;
}

function showSkipButton(onSkip) {
    let btn = document.getElementById('skip-reveal');
    if (!btn) {
        btn = document.createElement('button');
        btn.id = 'skip-reveal';
        btn.ariaLabel = 'Infinite Unfold';
        // Zen Mandala (Multi-layered sacred geometry)
        btn.innerHTML = `
            <svg viewBox="0 0 100 100" width="100" height="100" fill="none" stroke="currentColor" stroke-width="0.6">
                <!-- Outer "Void" Ring -->
                <circle class="mandala-ring ring-outer" cx="50" cy="50" r="48" />
                <!-- Inner Rotating Geometry -->
                <g class="mandala-core">
                    <circle cx="50" cy="50" r="15" stroke-width="0.3" stroke-dasharray="2 2" />
                    <!-- Satellite Dot (Orbital) -->
                    <circle cx="50" cy="15" r="2.5" fill="currentColor" class="mandala-satellite" />
                    
                    <path class="mandala-petal" d="M50 10 Q 55 30 50 50 Q 45 30 50 10" />
                    <path class="mandala-petal" d="M50 90 Q 55 70 50 50 Q 45 70 50 90" />
                    <path class="mandala-petal" d="M10 50 Q 30 55 50 50 Q 30 45 10 50" />
                    <path class="mandala-petal" d="M90 50 Q 70 55 50 50 Q 70 45 90 50" />
                    <!-- Diagonal Petals -->
                    <g transform="rotate(45 50 50)">
                        <path class="mandala-petal" d="M50 15 Q 55 35 50 50 Q 45 35 50 15" />
                        <path class="mandala-petal" d="M50 85 Q 55 65 50 50 Q 45 65 50 85" />
                        <path class="mandala-petal" d="M15 50 Q 35 55 50 50 Q 35 45 15 50" />
                        <path class="mandala-petal" d="M85 50 Q 65 55 50 50 Q 65 45 85 50" />
                    </g>
                </g>
            </svg>
        `;
        document.body.appendChild(btn);
    }
    btn.onclick = () => {
        onSkip();
        hideSkipButton();
    };
    btn.classList.add('visible');
}

function hideSkipButton() {
    const btn = document.getElementById('skip-reveal');
    if (btn) btn.classList.remove('visible');
}

/**
 * Reveals everything immediately.
 */
export function revealAllImmediately(container) {
    stopReveal = true;
    const words = container.querySelectorAll('.reveal-word, .reveal-block');
    words.forEach(w => {
        w.style.opacity = '1';
        w.style.transform = 'translateY(0)';
        w.classList.add('revealed');
        handleParentReveal(w);
    });
}

/**
 * Scrolls to the top of the page smoothly.
 */
export function scrollToTop(behavior = 'smooth') {
    window.scrollTo({ top: 0, behavior });
}

let lastScrollTime = 0;

function ensureVisible(element) {
    const now = Date.now();
    // Throttle scrolling to ensure previous smooth scroll completes (avoid zigzag)
    if (now - lastAutoScrollTime < 800) return;

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
            lastAutoScrollTime = now;
        }
    }
}
