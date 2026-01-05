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

let currentSpeed = 'slow'; // Default to slow for contemplative reading
let isRevealing = false;
let revealQueue = [];

/**
 * Gets current speed in milliseconds
 */
export function getSpeedMs() {
    return SPEEDS[currentSpeed];
}

/**
 * Sets the reveal speed
 * @param {'slow' | 'medium' | 'fast' | 'instant'} speed
 */
export function setSpeed(speed) {
    if (SPEEDS.hasOwnProperty(speed)) {
        currentSpeed = speed;
        updateSpeedButton();
        localStorage.setItem('zen-reveal-speed', speed);
    }
}

/**
 * Cycles through speed options
 */
export function cycleSpeed() {
    const speeds = ['slow', 'medium', 'fast', 'instant'];
    const currentIndex = speeds.indexOf(currentSpeed);
    const nextIndex = (currentIndex + 1) % speeds.length;
    setSpeed(speeds[nextIndex]);
}

/**
 * Updates the speed button display
 * Using minimal Zen-like symbols: dots representing pace
 */
function updateSpeedButton() {
    const btn = document.getElementById('speed-control');
    if (!btn) return;
    
    // Zen-style minimal indicators
    const labels = {
        slow: '·',      // Single dot - contemplative
        medium: '··',   // Two dots - balanced
        fast: '···',    // Three dots - flowing
        instant: '○'    // Circle - complete/instant
    };
    
    btn.textContent = labels[currentSpeed];
    btn.title = `${currentSpeed}`;
}

/**
 * Wraps each word in a span for animation
 * @param {HTMLElement} element
 */
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

/**
 * Reveals words in an element one by one
 * @param {HTMLElement} element
 * @returns {Promise}
 */
export function revealElement(element) {
    return new Promise(resolve => {
        const speed = getSpeedMs();

        // If instant, just show everything
        if (speed === 0) {
            element.querySelectorAll('.reveal-word').forEach(word => {
                word.classList.add('revealed');
            });
            // Show marker for list items
            if (element.tagName === 'LI') {
                element.classList.add('revealed-marker');
            }
            resolve();
            return;
        }

        const words = element.querySelectorAll('.reveal-word:not(.revealed)');
        let index = 0;

        function revealNext() {
            if (index < words.length) {
                words[index].classList.add('revealed');
                index++;
                setTimeout(revealNext, speed);
            } else {
                // Show marker for list items when done
                if (element.tagName === 'LI') {
                    element.classList.add('revealed-marker');
                }
                resolve();
            }
        }

        revealNext();
    });
}

/**
 * Prepares a section for gradual reveal
 * @param {HTMLElement} section
 */
export function prepareSection(section) {
    // Prepare all text-containing elements for reveal (globally applicable)
    const elements = section.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, blockquote, td, th, figcaption, dd, dt');
    elements.forEach(el => {
        if (!el.classList.contains('words-wrapped')) {
            wrapWords(el);
            el.classList.add('words-wrapped');
        }
    });
}

/**
 * Reveals a section's content gradually
 * @param {HTMLElement} section
 */
export async function revealSection(section) {
    if (section.classList.contains('text-revealed')) return;

    prepareSection(section);
    section.classList.add('text-revealing');

    // Reveal all text-containing elements (globally applicable)
    const elements = section.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, blockquote, td, th, figcaption, dd, dt');

    for (const el of elements) {
        await revealElement(el);
        // Small pause between elements
        if (getSpeedMs() > 0) {
            await new Promise(r => setTimeout(r, getSpeedMs() * 2));
        }
    }

    section.classList.remove('text-revealing');
    section.classList.add('text-revealed');
}

/**
 * Instantly reveals all content (for skip functionality)
 */
export function revealAllInstant() {
    document.querySelectorAll('.reveal-word').forEach(word => {
        word.classList.add('revealed');
    });
    document.querySelectorAll('.bilingual-chapter, .bilingual-main-section, .bilingual-preamble').forEach(section => {
        section.classList.add('text-revealed');
        section.classList.remove('text-revealing');
    });
}

/**
 * Initializes the text reveal system
 */
export function initTextReveal() {
    // Load saved speed preference
    const saved = localStorage.getItem('zen-reveal-speed');
    if (saved && SPEEDS.hasOwnProperty(saved)) {
        currentSpeed = saved;
    }
    
    // Setup speed control button
    const btn = document.getElementById('speed-control');
    if (btn) {
        btn.addEventListener('click', cycleSpeed);
        updateSpeedButton();
    }
}

