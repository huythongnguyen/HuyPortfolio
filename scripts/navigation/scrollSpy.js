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
    sectionMap.forEach(link => link.classList.remove('active'));

    // Also remove active from sections
    const allSections = Array.from(document.querySelectorAll('.content-section, .bilingual-chapter, .bilingual-main-section, .bilingual-preamble'));
    allSections.forEach(s => s.classList.remove('active'));

    if (visibleSections.size === 0) return;

    for (const section of allSections) {
        if (visibleSections.has(section.id) && sectionMap.has(section.id)) {
            const link = sectionMap.get(section.id);
            link.classList.add('active');
            section.classList.add('active'); // Synchronize content
            scrollTOCIntoView(link);
            break;
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
