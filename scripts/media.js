/**
 * Media Showcase Module - Zen Design (禅)
 * 
 * Collapsible galleries with arrow navigation and sequential reveal.
 * Media appears only after preceding text finishes its reveal animation.
 * 
 * Features:
 *   - Collapsible showcase ("▼ View demos" / "▲ Close demos")
 *   - Arrow navigation (◄/►) for gallery items
 *   - Horizontal swipe gallery with scroll-snap
 *   - Scroll indicator dots for direct access
 *   - Lazy loading - GIFs load on gallery expand
 *   - Sequential reveal - waits for text animation
 * 
 * Philosophy:
 *   - Ma (間): Breathing space, fixed 400px height
 *   - Kanso (簡素): Simple text triggers, no ornament
 *   - Seijaku (静寂): Peaceful reveal after text
 *   - Shizen (自然): GIFs flow naturally, auto-playing
 */

// ===================================================================
// CONFIGURATION
// ===================================================================

/**
 * Media configuration for work showcases.
 * Maps section identifiers to their media assets.
 */
export const MEDIA_CONFIG = {
    'google-multimodal-embedding': {
        title: 'Visual Demonstrations',
        items: [
            {
                src: 'huythong-nguyen/media/google-multimodal-embedding/RichVisualOffering.gif',
                title: 'Rich Visual Offering',
                description: 'Enhanced photo/video coverage on Google Maps—my embeddings power topic-based discovery'
            },
            {
                src: 'huythong-nguyen/media/google-multimodal-embedding/PlaceAnswers.gif',
                title: 'Place Answers & Magi Q&A',
                description: 'Photo retrieval for local place questions—3× coverage via my multimodal system'
            },
            {
                src: 'huythong-nguyen/media/google-multimodal-embedding/LocalSearchOnSearch.gif',
                title: 'Local Search on Google Search',
                description: 'Photo/video retrieval for local queries—powered by my embedding infrastructure'
            },
            {
                src: 'huythong-nguyen/media/google-multimodal-embedding/LocalSearchOnMaps.gif',
                title: 'Local Search on Maps',
                description: 'Visual content discovery via my multimodal embeddings architecture'
            },
        ]
    }
};

// ===================================================================
// SHOWCASE CREATION
// ===================================================================

/**
 * Creates a collapsible media showcase.
 * 
 * Toggle states:
 *   - Collapsed: "▼ View demos" with dashed border
 *   - Expanded: "▲ Close demos" with gallery visible
 * 
 * @param {HTMLElement} galleryContent - The gallery content to wrap
 * @returns {HTMLElement} - The showcase element
 */
export function createMediaShowcase(galleryContent) {
    const showcase = document.createElement('div');
    showcase.className = 'media-showcase';

    // Symbol trigger button - shows "View demos ▼" when collapsed
    // Starts HIDDEN until text reveal completes
    const trigger = document.createElement('button');
    trigger.className = 'media-trigger'; // Not active by default
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-label', 'View media content');
    trigger.innerHTML = '<span class="media-trigger-symbol"></span>';

    // Collapsible content wrapper - HIDDEN by default (reveals after text)
    const collapsible = document.createElement('div');
    collapsible.className = 'media-collapsible'; // Not revealed by default
    collapsible.appendChild(galleryContent);

    // Toggle interaction
    trigger.addEventListener('click', () => {
        const isRevealed = collapsible.classList.contains('revealed');

        if (isRevealed) {
            // Collapse the gallery
            collapsible.classList.remove('revealed');
            trigger.classList.remove('active');
            trigger.setAttribute('aria-expanded', 'false');
            trigger.setAttribute('aria-label', 'View media content');
        } else {
            // Expand the gallery
            collapsible.classList.add('revealed');
            trigger.classList.add('active');
            trigger.setAttribute('aria-expanded', 'true');
            trigger.setAttribute('aria-label', 'Hide media content');

            // Trigger lazy loading for items inside
            requestAnimationFrame(() => {
                setupLazyLoading(collapsible);
            });
        }
    });

    showcase.appendChild(trigger);
    showcase.appendChild(collapsible);

    return showcase;
}

/**
 * Creates a media gallery element for a given section
 * 
 * @param {string} sectionId - The section identifier matching MEDIA_CONFIG keys
 * @returns {HTMLElement|null} - The gallery element or null if no config exists
 */
export function createMediaGallery(sectionId) {
    const config = MEDIA_CONFIG[sectionId];
    if (!config) return null;

    const gallery = document.createElement('div');
    gallery.className = 'media-gallery';
    gallery.setAttribute('data-section', sectionId);

    // Gallery title (optional, shown inside collapsible)
    if (config.title) {
        const title = document.createElement('h4');
        title.className = 'media-gallery-title';
        title.textContent = config.title;
        gallery.appendChild(title);
    }

    // Wrapper for relative positioning of arrows
    const wrapper = document.createElement('div');
    wrapper.className = 'media-gallery-wrapper';

    // Media items container
    const itemsContainer = document.createElement('div');
    itemsContainer.className = 'media-items';

    config.items.forEach((item, index) => {
        const mediaItem = createMediaItem(item, index, config.items.length);
        itemsContainer.appendChild(mediaItem);
    });

    wrapper.appendChild(itemsContainer);

    // Add arrow navigation if multiple items
    if (config.items.length > 1) {
        const { prevBtn, nextBtn } = createArrowButtons(itemsContainer);
        wrapper.appendChild(prevBtn);
        wrapper.appendChild(nextBtn);
    }

    gallery.appendChild(wrapper);

    // Scroll indicator dots
    if (config.items.length > 1) {
        const indicators = createScrollIndicators(config.items.length, itemsContainer);
        gallery.appendChild(indicators);
    }

    // Wrap in collapsible showcase
    const showcase = createMediaShowcase(gallery);

    return showcase;
}

/**
 * Creates scroll indicator dots for navigation
 * 
 * @param {number} count - Number of items
 * @param {HTMLElement} scrollContainer - The scrollable container
 * @returns {HTMLElement} - The indicators element
 */
function createScrollIndicators(count, scrollContainer) {
    const indicators = document.createElement('div');
    indicators.className = 'media-scroll-indicators';

    for (let i = 0; i < count; i++) {
        const dot = document.createElement('button');
        dot.className = 'media-scroll-dot';
        dot.setAttribute('aria-label', `Go to item ${i + 1}`);
        if (i === 0) dot.classList.add('active');

        dot.addEventListener('click', () => {
            const items = scrollContainer.querySelectorAll('.media-item');
            if (items[i]) {
                items[i].scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'center'
                });
            }
        });

        indicators.appendChild(dot);
    }

    // Update active dot on scroll
    scrollContainer.addEventListener('scroll', () => {
        updateActiveIndicator(scrollContainer, indicators);
    }, { passive: true });

    return indicators;
}

/**
 * Creates arrow navigation buttons for the gallery
 * 
 * @param {HTMLElement} scrollContainer - The scrollable items container
 * @returns {Object} - Object with prevBtn and nextBtn elements
 */
function createArrowButtons(scrollContainer) {
    const prevBtn = document.createElement('button');
    prevBtn.className = 'media-arrow prev';
    prevBtn.innerHTML = '◄';
    prevBtn.setAttribute('aria-label', 'Previous item');

    const nextBtn = document.createElement('button');
    nextBtn.className = 'media-arrow next';
    nextBtn.innerHTML = '►';
    nextBtn.setAttribute('aria-label', 'Next item');

    // Get current visible item index
    const getCurrentIndex = () => {
        const items = scrollContainer.querySelectorAll('.media-item');
        const containerRect = scrollContainer.getBoundingClientRect();
        const containerCenter = containerRect.left + containerRect.width / 2;

        let closestIndex = 0;
        let closestDistance = Infinity;

        items.forEach((item, index) => {
            const itemRect = item.getBoundingClientRect();
            const itemCenter = itemRect.left + itemRect.width / 2;
            const distance = Math.abs(containerCenter - itemCenter);

            if (distance < closestDistance) {
                closestDistance = distance;
                closestIndex = index;
            }
        });

        return closestIndex;
    };

    // Navigate to specific item
    const goToItem = (index) => {
        const items = scrollContainer.querySelectorAll('.media-item');
        if (items[index]) {
            items[index].scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
            });
        }
    };

    prevBtn.addEventListener('click', () => {
        const currentIndex = getCurrentIndex();
        if (currentIndex > 0) {
            goToItem(currentIndex - 1);
        }
    });

    nextBtn.addEventListener('click', () => {
        const currentIndex = getCurrentIndex();
        const items = scrollContainer.querySelectorAll('.media-item');
        if (currentIndex < items.length - 1) {
            goToItem(currentIndex + 1);
        }
    });

    return { prevBtn, nextBtn };
}

/**
 * Updates the active scroll indicator based on scroll position
 * 
 * @param {HTMLElement} container - The scroll container
 * @param {HTMLElement} indicators - The indicators container
 */
function updateActiveIndicator(container, indicators) {
    const items = container.querySelectorAll('.media-item');
    const dots = indicators.querySelectorAll('.media-scroll-dot');
    const containerRect = container.getBoundingClientRect();
    const containerCenter = containerRect.left + containerRect.width / 2;

    let closestIndex = 0;
    let closestDistance = Infinity;

    items.forEach((item, index) => {
        const itemRect = item.getBoundingClientRect();
        const itemCenter = itemRect.left + itemRect.width / 2;
        const distance = Math.abs(containerCenter - itemCenter);

        if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = index;
        }
    });

    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === closestIndex);
    });
}

/**
 * Checks if a file is an animated image (GIF, WebP)
 * 
 * @param {string} src - The source URL
 * @returns {boolean} - True if animated image
 */
function isAnimatedImage(src) {
    if (!src) return false;
    const ext = src.toLowerCase();
    return ext.endsWith('.gif') || ext.endsWith('.webp');
}

/**
 * Creates a single media item element
 * 
 * Zen Philosophy: GIFs flow naturally like water (自然 - Shizen)
 * They require no interaction—presence manifests immediately.
 * Videos invite contemplation before engagement.
 * 
 * @param {Object} item - Media item configuration
 * @param {number} index - Item index for staggered animation
 * @param {number} total - Total number of items
 * @returns {HTMLElement} - The media item element
 */
export function createMediaItem(item, index, total = 1) {
    const mediaItem = document.createElement('div');
    mediaItem.className = 'media-item';
    mediaItem.style.transitionDelay = `${index * 80}ms`;

    // Check if this is an animated image (GIF/WebP) or video
    const isGif = isAnimatedImage(item.src);

    // Media container
    const mediaContainer = document.createElement('div');
    mediaContainer.className = 'media-video-container';

    if (isGif) {
        // === GIF: Display as auto-looping image (Shizen - natural flow) ===
        const img = document.createElement('img');
        img.className = 'media-gif';
        img.setAttribute('loading', 'lazy');
        img.setAttribute('alt', item.title);
        img.src = item.src;

        // Show loaded state once image is ready
        img.addEventListener('load', () => {
            img.classList.add('loaded');
        }, { once: true });

        img.addEventListener('error', () => {
            console.error(`Failed to load GIF: ${item.src}`);
        }, { once: true });

        mediaContainer.appendChild(img);
    } else {
        // === VIDEO: Click-to-play with poster overlay ===
        const video = document.createElement('video');
        video.className = 'media-video';
        video.setAttribute('preload', 'none');
        video.setAttribute('playsinline', '');
        video.setAttribute('controls', '');
        video.setAttribute('data-src', item.src);
        video.muted = true;

        // Poster overlay (shows before video loads)
        const poster = document.createElement('div');
        poster.className = 'media-poster';

        const playBtn = document.createElement('button');
        playBtn.className = 'media-play-btn';
        playBtn.setAttribute('aria-label', `Play ${item.title}`);
        poster.appendChild(playBtn);

        // Loading indicator
        const loading = document.createElement('div');
        loading.className = 'media-loading';

        // Click handler for play
        const handlePlay = async () => {
            if (video.src) {
                poster.classList.add('hidden');
                try {
                    await video.play();
                } catch (e) {
                    video.controls = true;
                }
                return;
            }

            loading.classList.add('active');
            video.src = video.getAttribute('data-src');

            video.addEventListener('loadeddata', async () => {
                loading.classList.remove('active');
                video.classList.add('loaded');
                poster.classList.add('hidden');
                try {
                    await video.play();
                } catch (e) {
                    video.controls = true;
                }
            }, { once: true });

            video.addEventListener('error', () => {
                loading.classList.remove('active');
                console.error(`Failed to load video: ${item.src}`);
            }, { once: true });

            video.load();
        };

        poster.addEventListener('click', handlePlay);
        mediaContainer.addEventListener('click', (e) => {
            if (e.target === mediaContainer && !video.src) {
                handlePlay();
            }
        });

        mediaContainer.appendChild(video);
        mediaContainer.appendChild(poster);
        mediaContainer.appendChild(loading);
    }

    // Caption with index
    const caption = document.createElement('div');
    caption.className = 'media-caption';

    // Index number (e.g., "1 of 4")
    if (total > 1) {
        const captionIndex = document.createElement('div');
        captionIndex.className = 'media-caption-index';
        captionIndex.textContent = `${index + 1} of ${total}`;
        caption.appendChild(captionIndex);
    }

    const captionTitle = document.createElement('div');
    captionTitle.className = 'media-caption-title';
    captionTitle.textContent = item.title;

    const captionDesc = document.createElement('div');
    captionDesc.className = 'media-caption-desc';
    captionDesc.textContent = item.description;

    caption.appendChild(captionTitle);
    caption.appendChild(captionDesc);

    mediaItem.appendChild(mediaContainer);
    mediaItem.appendChild(caption);

    return mediaItem;
}

/**
 * Sets up IntersectionObserver for lazy loading and reveal animation
 * 
 * @param {HTMLElement} container - The container element to observe
 */
function setupLazyLoading(container) {
    const items = container.querySelectorAll('.media-item');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('media-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '50px'
    });

    items.forEach(item => {
        if (!item.classList.contains('media-visible')) {
            observer.observe(item);
        }
    });
}

/**
 * Injects a media gallery after a specific heading in rendered content
 * 
 * @param {HTMLElement} container - The content container
 * @param {string} headingText - Text of the heading to find
 * @param {string} sectionId - The section ID for MEDIA_CONFIG
 */
export function injectMediaAfterHeading(container, headingText, sectionId) {
    const headings = container.querySelectorAll('h2, h3, h4');

    for (const heading of headings) {
        if (heading.textContent.trim().toLowerCase().includes(headingText.toLowerCase())) {
            // Find the end of this section (next heading of same or higher level)
            let insertPoint = heading.nextElementSibling;
            const headingLevel = parseInt(heading.tagName[1]);

            while (insertPoint) {
                const next = insertPoint.nextElementSibling;
                if (!next) break;

                const nextLevel = next.tagName.match(/^H([1-6])$/);
                if (nextLevel && parseInt(nextLevel[1]) <= headingLevel) {
                    break;
                }
                insertPoint = next;
            }

            const gallery = createMediaGallery(sectionId);
            if (gallery && insertPoint) {
                insertPoint.parentNode.insertBefore(gallery, insertPoint.nextSibling);
                return true;
            }
            break;
        }
    }
    return false;
}

/**
 * Scans a container for <img> tags that point to video files 
 * and transforms them into Zen collapsible showcases.
 * Groups consecutive videos into a single showcase.
 * 
 * @param {HTMLElement} container - The container to scan
 */
export function transformVideos(container) {
    const videoExtensions = ['.mp4', '.webm', '.mov', '.gif', '.webp'];
    const images = Array.from(container.querySelectorAll('img'));

    // Group consecutive video images
    const groups = [];
    let currentGroup = [];
    let lastParent = null;

    images.forEach(img => {
        const src = img.getAttribute('src');
        const isVideo = src && videoExtensions.some(ext => src.toLowerCase().endsWith(ext));

        if (isVideo) {
            const parent = img.parentElement;

            // Check if this is consecutive with the last video
            if (currentGroup.length > 0 && parent === lastParent) {
                currentGroup.push(img);
            } else if (currentGroup.length > 0) {
                // Save previous group and start new one
                groups.push([...currentGroup]);
                currentGroup = [img];
            } else {
                currentGroup.push(img);
            }
            lastParent = parent;
        }
    });

    // Don't forget the last group
    if (currentGroup.length > 0) {
        groups.push(currentGroup);
    }

    // Transform each group into a collapsible showcase
    groups.forEach(group => {
        const items = group.map(img => ({
            src: img.getAttribute('src'),
            title: img.getAttribute('alt') || 'Media',
            description: img.getAttribute('title') || ''
        }));

        // Create gallery content
        const gallery = document.createElement('div');
        gallery.className = 'media-gallery';

        // Wrapper for relative positioning of arrows
        const wrapper = document.createElement('div');
        wrapper.className = 'media-gallery-wrapper';

        const itemsContainer = document.createElement('div');
        itemsContainer.className = 'media-items';

        items.forEach((item, index) => {
            const mediaItem = createMediaItem(item, index, items.length);
            itemsContainer.appendChild(mediaItem);
        });

        wrapper.appendChild(itemsContainer);

        // Add arrow navigation if multiple items
        if (items.length > 1) {
            const { prevBtn, nextBtn } = createArrowButtons(itemsContainer);
            wrapper.appendChild(prevBtn);
            wrapper.appendChild(nextBtn);
        }

        gallery.appendChild(wrapper);

        // Add scroll indicators if multiple items
        if (items.length > 1) {
            const indicators = createScrollIndicators(items.length, itemsContainer);
            gallery.appendChild(indicators);
        }

        // Create showcase with symbol trigger (no text label)
        const showcase = createMediaShowcase(gallery);
        const firstImg = group[0];

        // Find the best insertion point
        const insertPoint = firstImg.parentElement.tagName === 'P'
            ? firstImg.parentElement
            : firstImg;

        insertPoint.parentNode.insertBefore(showcase, insertPoint);

        // Remove all original images and empty paragraphs
        group.forEach(img => {
            const parent = img.parentElement;
            img.remove();
            // Remove empty paragraph
            if (parent.tagName === 'P' && parent.childNodes.length === 0) {
                parent.remove();
            }
        });
    });
}

/**
 * Finds the previous heading element
 * 
 * @param {HTMLElement} element - Starting element
 * @returns {HTMLElement|null} - Previous heading or null
 */
function findPreviousHeading(element) {
    let current = element.previousElementSibling;

    // Check parent's previous siblings too
    if (!current && element.parentElement) {
        current = element.parentElement.previousElementSibling;
    }

    while (current) {
        if (/^H[1-6]$/.test(current.tagName)) {
            return current;
        }
        current = current.previousElementSibling;
    }

    return null;
}

/**
 * Auto-reveals media showcases after text reveal completes.
 * 
 * Uses IntersectionObserver to watch showcases entering viewport,
 * then waits for preceding text to finish animating before expanding.
 * 
 * @param {HTMLElement} container - Container to watch for text reveals
 */
export function revealMediaAfterText(container) {
    const showcases = container.querySelectorAll('.media-showcase');

    // Use IntersectionObserver - only act when showcase is visible
    const showcaseObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const showcase = entry.target;
            const trigger = showcase.querySelector('.media-trigger');
            const collapsible = showcase.querySelector('.media-collapsible');

            if (!trigger || !collapsible || collapsible.classList.contains('revealed')) {
                showcaseObserver.unobserve(showcase);
                return;
            }

            // Find the parent section (content-section class)
            const parentSection = showcase.closest('.content-section');

            // Function to check if we should reveal
            const tryRevealMedia = () => {
                // Check if parent section has finished text reveal
                if (parentSection && parentSection.classList.contains('text-revealed')) {
                    // Text is done - reveal immediately
                    if (!collapsible.classList.contains('revealed')) {
                        trigger.click();
                    }
                    showcaseObserver.unobserve(showcase);
                    return true;
                }

                // Find previous text element
                let textEl = showcase.previousElementSibling;
                while (textEl && !textEl.matches('p, ul, ol, h1, h2, h3, h4, h5, h6')) {
                    textEl = textEl.previousElementSibling;
                }

                if (textEl) {
                    // Check if all words in the text element are revealed
                    const words = textEl.querySelectorAll('.reveal-word');
                    const revealedWords = textEl.querySelectorAll('.reveal-word.revealed');

                    if (words.length > 0 && words.length === revealedWords.length) {
                        // Text finished - reveal media
                        setTimeout(() => {
                            if (!collapsible.classList.contains('revealed')) {
                                trigger.click();
                            }
                        }, 300);
                        showcaseObserver.unobserve(showcase);
                        return true;
                    }
                }

                return false;
            };

            // Try immediately
            if (tryRevealMedia()) return;

            // Watch for text reveal changes
            const textObserver = new MutationObserver(() => {
                if (tryRevealMedia()) {
                    textObserver.disconnect();
                }
            });

            // Observe the parent section for class changes
            if (parentSection) {
                textObserver.observe(parentSection, {
                    subtree: true,
                    attributes: true,
                    attributeFilter: ['class']
                });
            }

            // Fallback timeout - but longer since we need to wait for scroll
            setTimeout(() => {
                textObserver.disconnect();
                showcaseObserver.unobserve(showcase);
                if (!collapsible.classList.contains('revealed')) {
                    trigger.click();
                }
            }, 10000);
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -10% 0px'
    });

    // Start observing all showcases
    showcases.forEach(showcase => {
        showcaseObserver.observe(showcase);
    });
}

/**
 * Creates scroll indicators for a container
 * Exported for external use
 */
export { createScrollIndicators };

