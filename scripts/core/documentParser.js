/**
 * Document Parser - Unified Section Pre-Parser
 * 
 * Pre-parses all documents into a consistent section structure.
 * Both standard and bilingual documents get the same section format,
 * making reveal logic uniform and predictable.
 * 
 * Structure:
 *   ParsedDocument {
 *     type: 'standard' | 'bilingual',
 *     sections: Section[],
 *     tocItems: TOCItem[]
 *   }
 * 
 *   Section {
 *     id: string,
 *     type: 'preamble' | 'main' | 'chapter' | 'h1' | 'h2',
 *     title: string,
 *     html: string,
 *     vnHtml?: string,    // For bilingual
 *     enHtml?: string     // For bilingual
 *   }
 * 
 *   TOCItem {
 *     id: string,
 *     title: string,
 *     level: 1 | 2 | 3,
 *     children?: TOCItem[]
 *   }
 */

// =============================================================================
// STANDARD DOCUMENT PARSER
// =============================================================================

/**
 * Parses a standard markdown document into sections.
 * Strategies:
 * - Headings (H1-H3) become standalone sections.
 * - Content between headings becomes 'content' sections.
 * This ensures headings can be revealed instantly while content is queued.
 */
export function parseStandardDocument(markdown) {
    const html = DOMPurify.sanitize(marked.parse(markdown));
    const temp = document.createElement('div');
    temp.innerHTML = html;

    const sections = [];
    const tocItems = [];

    // Track heading counts for IDs
    let h1Count = 0, h2Count = 0, h3Count = 0;
    let currentH1Toc = null, currentH2Toc = null;

    Array.from(temp.children).forEach(child => {
        const tagName = child.tagName;

        if (['H1', 'H2', 'H3'].includes(tagName)) {
            // --- HEADING SECTION ---

            // 1. Determine ID and Level
            let id, level;
            if (tagName === 'H1') {
                h1Count++; h2Count = 0; h3Count = 0;
                id = `section-h1-${h1Count}`;
                level = 1;
            } else if (tagName === 'H2') {
                h2Count++; h3Count = 0;
                id = `section-h2-${h1Count}-${h2Count}`;
                level = 2;
            } else {
                h3Count++;
                id = `section-h3-${h1Count}-${h2Count}-${h3Count}`;
                level = 3;
            }

            const headingId = id.replace('section-', '');
            child.id = headingId;

            // 2. Create Heading Section
            sections.push({
                id: id,
                headingId: headingId,
                type: tagName.toLowerCase(),
                title: child.textContent.trim(),
                level: level,
                html: child.outerHTML // Section contains ONLY the header
            });

            // 3. Build TOC
            const tocItem = {
                id: headingId,
                title: child.textContent.trim(),
                level: level,
                children: []
            };

            if (level === 1) {
                tocItems.push(tocItem);
                currentH1Toc = tocItem;
                currentH2Toc = null;
            } else if (level === 2 && currentH1Toc) {
                currentH1Toc.children.push(tocItem);
                currentH2Toc = tocItem;
            } else if (level === 3) {
                if (currentH2Toc) currentH2Toc.children.push(tocItem);
                else if (currentH1Toc) currentH1Toc.children.push(tocItem);
            }

        } else {
            // --- CONTENT SECTION ---

            // Check if we need to start a new content section
            let lastSection = sections[sections.length - 1];

            // If strictly following a heading, or if previous section wasn't content/intro
            if (!lastSection || (lastSection.type !== 'content' && lastSection.type !== 'intro')) {
                const isIntro = sections.length === 0;
                const type = isIntro ? 'intro' : 'content';
                const sectionId = isIntro ? 'section-intro' : `${lastSection.id}-content`;

                lastSection = {
                    id: sectionId,
                    type: type,
                    title: isIntro ? 'Introduction' : '',
                    level: 0,
                    html: ''
                };
                sections.push(lastSection);
            }

            // Append content
            lastSection.html += child.outerHTML;
        }
    });

    return {
        type: 'standard',
        sections: sections,
        tocItems: tocItems
    };
}

// =============================================================================
// BILINGUAL DOCUMENT PARSER
// =============================================================================

const VIETNAMESE_MAIN = /^#\s+Kinh Kim Cang\s*$/m;
const ENGLISH_MAIN = /^#\s+The Diamond Sutra/m;

/**
 * Splits bilingual markdown into parts.
 */
function splitBilingualMarkdown(markdown) {
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
 * Extracts intro before first chapter.
 */
function extractIntro(markdown, lang) {
    const chapterMarker = lang === 'vn'
        ? /^##\s+Chương\s+\d+/m
        : /^##\s+Chapter\s+\d+/m;

    const match = markdown.match(chapterMarker);
    if (!match) return markdown;
    return markdown.substring(0, markdown.indexOf(match[0])).trim();
}

/**
 * Parses chapters from markdown.
 */
function parseChapters(markdown, lang) {
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
        const end = (i < headings.length - 1) ? headings[i + 1].index : markdown.length;

        chapters.push({
            number: headings[i].number,
            title: headings[i].title,
            content: markdown.substring(start, end).trim()
        });
    }

    return chapters;
}

/**
 * Parses a bilingual document into sections.
 */
export function parseBilingualDocument(markdown) {
    const split = splitBilingualMarkdown(markdown);
    if (!split) return null;

    const sections = [];
    const tocItems = [];

    // 1. PREAMBLE
    if (split.preamble) {
        sections.push({
            id: 'preamble',
            type: 'preamble',
            title: 'Lời Mở Đầu',
            level: 1,
            html: DOMPurify.sanitize(marked.parse(split.preamble)),
            isBilingual: false
        });

        tocItems.push({
            id: 'preamble',
            title: 'Lời Mở Đầu',
            level: 1,
            children: []
        });
    }

    // 2. MAIN SECTION
    const vnIntro = extractIntro(split.vietnamese, 'vn');
    const enIntro = extractIntro(split.english, 'en');

    sections.push({
        id: 'main-section',
        type: 'main',
        title: 'Kinh Kim Cang',
        level: 1,
        vnHtml: DOMPurify.sanitize(marked.parse(vnIntro)),
        enHtml: DOMPurify.sanitize(marked.parse(enIntro)),
        isBilingual: true
    });

    const mainToc = {
        id: 'main-section',
        title: 'Kinh Kim Cang',
        level: 1,
        children: []
    };
    tocItems.push(mainToc);

    // 3. CHAPTERS
    const vnChapters = parseChapters(split.vietnamese, 'vn');
    const enChapters = parseChapters(split.english, 'en');
    const maxChapters = Math.max(vnChapters.length, enChapters.length);

    for (let i = 0; i < maxChapters; i++) {
        const vnContent = vnChapters[i]?.content || '';
        const enContent = enChapters[i]?.content || '';
        const chapterNum = i + 1;

        sections.push({
            id: `chapter-${chapterNum}`,
            type: 'chapter',
            title: vnChapters[i]?.title || `Chapter ${chapterNum}`,
            number: chapterNum,
            level: 2,
            vnHtml: DOMPurify.sanitize(marked.parse(vnContent)),
            enHtml: DOMPurify.sanitize(marked.parse(enContent)),
            isBilingual: true
        });

        mainToc.children.push({
            id: `chapter-${chapterNum}`,
            title: `${chapterNum}. ${vnChapters[i]?.title || ''}`,
            level: 2,
            children: []
        });
    }

    return {
        type: 'bilingual',
        sections: sections,
        tocItems: tocItems
    };
}

// =============================================================================
// UNIFIED PARSER
// =============================================================================

/**
 * Parses any document - detects type automatically.
 */
export function parseDocument(markdown) {
    // Try bilingual first
    const bilingual = parseBilingualDocument(markdown);
    if (bilingual) return bilingual;

    // Fallback to standard
    return parseStandardDocument(markdown);
}

/**
 * Checks if markdown is bilingual format.
 */
export function isBilingualMarkdown(markdown) {
    return VIETNAMESE_MAIN.test(markdown) && ENGLISH_MAIN.test(markdown);
}
