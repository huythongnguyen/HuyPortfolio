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
 */
export function createMediaShowcase(galleryContent) {
    const showcase = document.createElement('div');
    showcase.className = 'media-showcase';

    const trigger = document.createElement('button');
    trigger.className = 'media-trigger';
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-label', 'View media content');
    trigger.innerHTML = '<span class="media-trigger-symbol"></span>';

    const collapsible = document.createElement('div');
    collapsible.className = 'media-collapsible';
    collapsible.appendChild(galleryContent);

    trigger.addEventListener('click', () => {
        const isRevealed = collapsible.classList.contains('revealed');

        if (isRevealed) {
            collapsible.classList.remove('revealed');
            trigger.classList.remove('active');
            trigger.setAttribute('aria-expanded', 'false');
            trigger.setAttribute('aria-label', 'View media content');
        } else {
            collapsible.classList.add('revealed');
            trigger.classList.add('active');
            trigger.setAttribute('aria-expanded', 'true');
            trigger.setAttribute('aria-label', 'Hide media content');

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
 */
export function createMediaGallery(sectionId) {
    const config = MEDIA_CONFIG[sectionId];
    if (!config) return null;

    const gallery = assembleGalleryDOM(config.items, sectionId, config.title);
    return createMediaShowcase(gallery);
}

/**
 * Assembles the gallery DOM structure with items, arrows, and indicators.
 */
function assembleGalleryDOM(items, sectionId = '', titleText = '') {
    const gallery = document.createElement('div');
    gallery.className = 'media-gallery';
    if (sectionId) gallery.setAttribute('data-section', sectionId);

    if (titleText) {
        const title = document.createElement('h4');
        title.className = 'media-gallery-title';
        title.textContent = titleText;
        gallery.appendChild(title);
    }

    const wrapper = document.createElement('div');
    wrapper.className = 'media-gallery-wrapper';

    const itemsContainer = document.createElement('div');
    itemsContainer.className = 'media-items';

    items.forEach((item, index) => {
        const mediaItem = createMediaItem(item, index, items.length);
        itemsContainer.appendChild(mediaItem);
    });

    wrapper.appendChild(itemsContainer);

    if (items.length > 1) {
        const { prevBtn, nextBtn } = createArrowButtons(itemsContainer);
        wrapper.appendChild(prevBtn);
        wrapper.appendChild(nextBtn);
    }

    gallery.appendChild(wrapper);

    if (items.length > 1) {
        const indicators = createScrollIndicators(items.length, itemsContainer);
        gallery.appendChild(indicators);
    }

    return gallery;
}

/**
 * Creates scroll indicator dots for navigation
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

    scrollContainer.addEventListener('scroll', () => {
        updateActiveIndicator(scrollContainer, indicators);
    }, { passive: true });

    return indicators;
}

/**
 * Creates arrow navigation buttons for the gallery
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
 */
function isAnimatedImage(src) {
    if (!src) return false;
    const ext = src.toLowerCase();
    return ext.endsWith('.gif') || ext.endsWith('.webp');
}

/**
 * Creates a single media item element
 */
export function createMediaItem(item, index, total = 1) {
    const mediaItem = document.createElement('div');
    mediaItem.className = 'media-item';
    mediaItem.style.transitionDelay = `${index * 80}ms`;

    const isGif = isAnimatedImage(item.src);

    const mediaContainer = document.createElement('div');
    mediaContainer.className = 'media-video-container';

    if (isGif) {
        const img = document.createElement('img');
        img.className = 'media-gif';
        img.setAttribute('loading', 'lazy');
        img.setAttribute('alt', item.title);
        img.src = item.src;

        img.addEventListener('load', () => {
            img.classList.add('loaded');
        }, { once: true });

        img.addEventListener('error', () => {
            console.error(`Failed to load GIF: ${item.src}`);
        }, { once: true });

        mediaContainer.appendChild(img);
    } else {
        const video = document.createElement('video');
        video.className = 'media-video';
        video.setAttribute('preload', 'none');
        video.setAttribute('playsinline', '');
        video.setAttribute('controls', '');
        video.setAttribute('data-src', item.src);
        video.muted = true;

        const poster = document.createElement('div');
        poster.className = 'media-poster';

        const playBtn = document.createElement('button');
        playBtn.className = 'media-play-btn';
        playBtn.setAttribute('aria-label', `Play ${item.title}`);
        poster.appendChild(playBtn);

        const loading = document.createElement('div');
        loading.className = 'media-loading';

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

    const caption = document.createElement('div');
    caption.className = 'media-caption';

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
 */
export function injectMediaAfterHeading(container, headingText, sectionId) {
    const headings = container.querySelectorAll('h2, h3, h4');

    for (const heading of headings) {
        if (heading.textContent.trim().toLowerCase().includes(headingText.toLowerCase())) {
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
 */
export function transformVideos(container) {
    const videoExtensions = ['.mp4', '.webm', '.mov', '.gif', '.webp'];
    const images = Array.from(container.querySelectorAll('img'));

    const groups = [];
    let currentGroup = [];
    let lastParent = null;

    images.forEach(img => {
        const src = img.getAttribute('src');
        const isVideo = src && videoExtensions.some(ext => src.toLowerCase().endsWith(ext));

        if (isVideo) {
            const parent = img.parentElement;

            if (currentGroup.length > 0 && parent === lastParent) {
                currentGroup.push(img);
            } else if (currentGroup.length > 0) {
                groups.push([...currentGroup]);
                currentGroup = [img];
            } else {
                currentGroup.push(img);
            }
            lastParent = parent;
        }
    });

    if (currentGroup.length > 0) {
        groups.push(currentGroup);
    }

    groups.forEach(group => {
        const items = group.map(img => ({
            src: img.getAttribute('src'),
            title: img.getAttribute('alt') || 'Media',
            description: img.getAttribute('title') || ''
        }));

        const gallery = assembleGalleryDOM(items);
        const showcase = createMediaShowcase(gallery);
        const firstImg = group[0];

        const insertPoint = firstImg.parentElement.tagName === 'P'
            ? firstImg.parentElement
            : firstImg;

        insertPoint.parentNode.insertBefore(showcase, insertPoint);

        group.forEach(img => {
            const parent = img.parentElement;
            img.remove();
            if (parent.tagName === 'P' && parent.childNodes.length === 0) {
                parent.remove();
            }
        });
    });
}

/**
 * Auto-reveals media showcases after text reveal completes.
 */
/**
 * Auto-reveals media showcases immediately when they enter the viewport.
 */
export function revealMediaAfterText(container) {
    const showcases = container.querySelectorAll('.media-showcase');

    const showcaseObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const showcase = entry.target;
            const trigger = showcase.querySelector('.media-trigger');
            const collapsible = showcase.querySelector('.media-collapsible');

            if (trigger && collapsible && !collapsible.classList.contains('revealed')) {
                trigger.click();
            }

            showcaseObserver.unobserve(showcase);
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px 50px 0px'
    });

    showcases.forEach(showcase => {
        showcaseObserver.observe(showcase);
    });
}

export { createScrollIndicators };
