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

    const sections = document.querySelectorAll('[id]');
    const tocLinks = document.querySelectorAll('#toc .toc-link');

    const sectionMap = new Map();
    tocLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
            const id = href.substring(1);
            sectionMap.set(id, link);
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
        rootMargin: '-10% 0px -70% 0px',
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

    if (visibleSections.size === 0) return;

    const allSections = Array.from(document.querySelectorAll('[id]'));

    for (const section of allSections) {
        if (visibleSections.has(section.id) && sectionMap.has(section.id)) {
            const link = sectionMap.get(section.id);
            link.classList.add('active');
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
