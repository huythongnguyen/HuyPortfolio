/**
 * Scroll Spy
 * 
 * Tracks visible sections and highlights corresponding TOC links.
 * Updates as user scrolls through the document.
 */

let scrollSpyObserver = null;

/**
 * Sets up scroll spy to highlight current section in TOC.
 * Call this after building the TOC.
 */
export function setupScrollSpy() {
    if (scrollSpyObserver) {
        scrollSpyObserver.disconnect();
    }

    // Target specific content containers for tracking, not everything with an ID
    const sections = document.querySelectorAll('.content-section, .bilingual-chapter, .bilingual-main-section, .bilingual-preamble');
    const tocLinks = document.querySelectorAll('#toc .toc-link');

    const sectionMap = new Map();
    tocLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
            const id = href.substring(1);
            sectionMap.set(id, link);
            // Support both standard ID and 'section-' prefixed ID
            if (!id.startsWith('section-')) {
                sectionMap.set(`section-${id}`, link);
            }
        }
    });

    const visibleSections = new Set();

    scrollSpyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const id = entry.target.id;

            if (entry.isIntersecting) {
                visibleSections.add(id);
            } else {
                visibleSections.delete(id);
            }
        });

        updateActiveTOCLink(visibleSections, sectionMap);
    }, {
        // Broad zone: any section on screen is considered
        rootMargin: '0px',
        threshold: 0
    });

    sections.forEach(section => {
        if (sectionMap.has(section.id)) {
            scrollSpyObserver.observe(section);
        }
    });
}

/**
 * Updates which TOC link is highlighted based on visible sections.
 */
function updateActiveTOCLink(visibleSections, sectionMap) {
    if (visibleSections.size === 0) return;

    const allSections = Array.from(document.querySelectorAll('.content-section, .bilingual-chapter, .bilingual-main-section, .bilingual-preamble'));

    // Zen Focus Line: We track based on what's at the top of the viewport (roughly 15% down)
    const focalPoint = window.innerHeight * 0.15;
    let bestSectionId = null;

    // First, find the section that is currently crossing the focus line
    for (const section of allSections) {
        if (!visibleSections.has(section.id)) continue;

        const rect = section.getBoundingClientRect();

        // If this section crosses the focus line, it's our primary candidate
        if (rect.top <= focalPoint && rect.bottom >= focalPoint) {
            bestSectionId = section.id;
            break;
        }
    }

    // If no section crosses the focus line (e.g. gaps or at end), 
    // fallback to the first visible section
    if (!bestSectionId) {
        for (const section of allSections) {
            if (visibleSections.has(section.id)) {
                bestSectionId = section.id;
                break;
            }
        }
    }

    if (!bestSectionId) return;

    // Track back to heading ID if it's a content section
    let trackingId = bestSectionId;
    if (trackingId.endsWith('-content')) {
        trackingId = trackingId.replace('-content', '');
    }
    // Handle specific intro case
    if (trackingId === 'section-intro') trackingId = 'intro';

    if (sectionMap.has(trackingId)) {
        // Only update if changed to avoid unnecessary re-scrolling of TOC
        const link = sectionMap.get(trackingId);
        if (!link.classList.contains('active')) {
            sectionMap.forEach(l => l.classList.remove('active'));
            allSections.forEach(s => s.classList.remove('active'));

            link.classList.add('active');

            // Highlight the section element too if it matches the current section exactly
            const activeSection = document.getElementById(bestSectionId);
            if (activeSection) activeSection.classList.add('active');

            scrollTOCIntoView(link);
        }
    }
}

/**
 * Scrolls the sidebar TOC to keep the active link visible.
 */
function scrollTOCIntoView(activeLink) {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;

    const linkRect = activeLink.getBoundingClientRect();
    const sidebarRect = sidebar.getBoundingClientRect();

    if (linkRect.top < sidebarRect.top + 50 || linkRect.bottom > sidebarRect.bottom - 50) {
        activeLink.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

/**
 * Updates scroll progress indicator.
 */
export function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    document.body.style.setProperty('--scroll-progress', `${progress}%`);
}
