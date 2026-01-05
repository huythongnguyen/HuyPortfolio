/**
 * Bilingual Content - Zen Design
 * 
 * Renders Vietnamese as the central voice with English as a subtle companion.
 * Implements gradual reveal animations following Zen principles:
 *   - Seijaku (静寂): Stillness, content reveals peacefully
 *   - Ma (間): Breathing space between sections
 * 
 * Structure:
 *   1. Preamble - translator's introduction (always visible)
 *   2. Chapters - Vietnamese centered, English revealed on toggle
 */

import { scrollToSection, setupScrollSpy } from './navigation.js';
import { revealSection as revealSectionText, prepareSection } from './textReveal.js';
import { transformVideos, revealMediaAfterText } from './media.js';

// === MARKERS ===
const VIETNAMESE_MAIN = /^#\s+Kinh Kim Cang\s*$/m;
const ENGLISH_MAIN = /^#\s+The Diamond Sutra/m;

/**
 * Splits content into preamble, Vietnamese main section, and English main section.
 */
export function splitBilingualContent(markdown) {
    const vnMatch = markdown.match(VIETNAMESE_MAIN);
    const enMatch = markdown.match(ENGLISH_MAIN);

    if (!vnMatch || !enMatch) return null;

    const vnIndex = markdown.indexOf(vnMatch[0]);
    const enIndex = markdown.indexOf(enMatch[0]);

    return {
        preamble: markdown.substring(0, vnIndex).trim(),
        vietnamese: markdown.substring(vnIndex, enIndex).trim(),
        english: markdown.substring(enIndex).trim()
    };
}

/**
 * Extracts the main section header and intro (before first chapter).
 */
function extractMainSectionIntro(markdown, lang) {
    const chapterMarker = lang === 'vn'
        ? /^##\s+Chương\s+\d+/m
        : /^##\s+Chapter\s+\d+/m;

    const match = markdown.match(chapterMarker);
    if (!match) return markdown;

    return markdown.substring(0, markdown.indexOf(match[0])).trim();
}

/**
 * Parses chapters from a section.
 */
export function parseChapters(markdown, lang) {
    const chapters = [];

    const chapterPattern = lang === 'vn'
        ? /^##\s+Chương\s+(\d+)[:\.\s]*(.*)/gm
        : /^##\s+Chapter\s+(\d+)[:\.\s]*(.*)/gm;

    const headings = [];
    let match;
    while ((match = chapterPattern.exec(markdown)) !== null) {
        headings.push({
            number: parseInt(match[1]),
            title: match[2].trim(),
            index: match.index
        });
    }

    for (let i = 0; i < headings.length; i++) {
        const start = headings[i].index;
        const end = (i < headings.length - 1)
            ? headings[i + 1].index
            : markdown.length;

        chapters.push({
            number: headings[i].number,
            title: headings[i].title,
            content: markdown.substring(start, end).trim()
        });
    }

    return chapters;
}

/**
 * Renders bilingual content with Zen layout:
 *   - Vietnamese centered as primary
 *   - English collapsed, revealed on toggle
 *   - Gradual reveal animation on scroll/click
 */
export function renderBilingualContent(markdown) {
    const split = splitBilingualContent(markdown);
    if (!split) return false;

    const contentPanel = document.getElementById('content');
    contentPanel.innerHTML = '';
    contentPanel.classList.add('bilingual-mode');

    // 1. PREAMBLE (full-width, always visible)
    if (split.preamble) {
        const preambleSection = document.createElement('div');
        preambleSection.className = 'bilingual-preamble visible';
        preambleSection.id = 'preamble';
        preambleSection.innerHTML = DOMPurify.sanitize(marked.parse(split.preamble));
        contentPanel.appendChild(preambleSection);
    }

    // 2. MAIN SECTION (Vietnamese centered, English below)
    const vnIntro = extractMainSectionIntro(split.vietnamese, 'vn');
    const enIntro = extractMainSectionIntro(split.english, 'en');

    const mainSection = createZenSection('main-section', vnIntro, enIntro);
    mainSection.classList.add('bilingual-main-section');
    contentPanel.appendChild(mainSection);

    // 3. CHAPTERS (Vietnamese centered, English revealed on toggle)
    const vnChapters = parseChapters(split.vietnamese, 'vn');
    const enChapters = parseChapters(split.english, 'en');
    const maxChapters = Math.max(vnChapters.length, enChapters.length);

    for (let i = 0; i < maxChapters; i++) {
        const vnContent = vnChapters[i]?.content || '';
        const enContent = enChapters[i]?.content || '';

        const chapterSection = createZenSection(`chapter-${i + 1}`, vnContent, enContent);
        chapterSection.classList.add('bilingual-chapter');
        contentPanel.appendChild(chapterSection);
    }

    // Transform videos in the final content
    transformVideos(contentPanel);

    // Setup media reveal after text completes
    revealMediaAfterText(contentPanel);

    // Setup intersection observer for reveal animations
    setupRevealObserver();

    return true;
}

/**
 * Creates a Zen-style section with Vietnamese centered and English collapsed.
 */
function createZenSection(id, vnContent, enContent) {
    const section = document.createElement('div');
    section.id = id;

    // Vietnamese - primary, centered
    const vnDiv = document.createElement('div');
    vnDiv.className = 'bilingual-vn';
    vnDiv.innerHTML = DOMPurify.sanitize(marked.parse(vnContent));
    section.appendChild(vnDiv);

    // English toggle button
    if (enContent) {
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'en-toggle';
        toggleBtn.textContent = 'English';
        toggleBtn.setAttribute('aria-expanded', 'false');
        toggleBtn.addEventListener('click', () => toggleEnglish(toggleBtn, enDiv));
        section.appendChild(toggleBtn);

        // English - collapsed by default
        var enDiv = document.createElement('div');
        enDiv.className = 'bilingual-en';
        enDiv.innerHTML = DOMPurify.sanitize(marked.parse(enContent));
        section.appendChild(enDiv);
    }

    return section;
}

/**
 * Toggles English section visibility.
 */
function toggleEnglish(button, enDiv) {
    const isRevealed = enDiv.classList.contains('revealed');

    if (isRevealed) {
        enDiv.classList.remove('revealed');
        button.classList.remove('active');
        button.setAttribute('aria-expanded', 'false');
    } else {
        enDiv.classList.add('revealed');
        button.classList.add('active');
        button.setAttribute('aria-expanded', 'true');
    }
}

/**
 * Sets up intersection observer for gradual reveal animations.
 * When a section comes into view, it triggers word-by-word text reveal.
 */
function setupRevealObserver() {
    const sections = document.querySelectorAll('.bilingual-chapter, .bilingual-main-section');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('visible')) {
                entry.target.classList.add('visible');
                // Trigger word-by-word text reveal
                revealSectionText(entry.target);
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

    // Also prepare and reveal preamble immediately
    const preamble = document.querySelector('.bilingual-preamble');
    if (preamble) {
        prepareSection(preamble);
        revealSectionText(preamble);
    }
}

/**
 * Reveals a specific section with animation.
 * Called when clicking TOC links.
 */
export function revealSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section && !section.classList.contains('visible')) {
        section.classList.add('visible');
        // Trigger word-by-word text reveal
        revealSectionText(section);
    }
}

/**
 * Builds TOC for bilingual documents.
 */
export function buildBilingualTOC(markdown) {
    const split = splitBilingualContent(markdown);
    if (!split) return false;

    const vnChapters = parseChapters(split.vietnamese, 'vn');

    const tocContainer = document.getElementById('toc');
    tocContainer.innerHTML = '';

    const ul = document.createElement('ul');
    ul.className = 'toc-list';

    // Preamble link
    if (split.preamble) {
        ul.appendChild(createTOCItem('Lời Mở Đầu', '#preamble', 'toc-h1'));
    }

    // Main section link
    ul.appendChild(createTOCItem('Kinh Kim Cang', '#main-section', 'toc-h1'));

    // Chapter links (nested under main section)
    const mainLi = ul.lastChild;
    const chaptersUl = document.createElement('ul');
    chaptersUl.className = 'toc-children';

    vnChapters.forEach(chapter => {
        const text = `${chapter.number}. ${chapter.title}`;
        chaptersUl.appendChild(createTOCItem(text, `#chapter-${chapter.number}`, 'toc-h2'));
    });

    mainLi.appendChild(chaptersUl);
    tocContainer.appendChild(ul);

    // Setup scroll spy after TOC is built
    setupScrollSpy();

    return true;
}

/**
 * Creates a TOC list item with reveal animation on click.
 */
function createTOCItem(text, href, className) {
    const li = document.createElement('li');
    li.className = 'toc-item';

    const a = document.createElement('a');
    a.href = href;
    a.className = `toc-link ${className}`;
    a.textContent = text;

    a.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = href.replace('#', '');

        // Reveal the section first
        revealSection(targetId);

        // Then scroll to it
        const target = document.getElementById(targetId);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });

    li.appendChild(a);
    return li;
}
