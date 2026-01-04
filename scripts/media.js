/**
 * Media Showcase Module
 * 
 * Lazy-loading video gallery with Zen aesthetics.
 * Videos load only when scrolled into view (Ma principle).
 * 
 * Best Practices Implemented:
 * - Lazy loading via IntersectionObserver
 * - Preload="none" to prevent initial bandwidth use
 * - Click-to-play with poster fallback
 * - Progressive enhancement for reduced motion
 */

/**
 * Media configuration for work showcases
 * Maps section identifiers to their media assets
 */
export const MEDIA_CONFIG = {
    'google-multimodal-embedding': {
        title: 'Visual Demonstrations',
        items: [
            {
                src: 'huythong-nguyen/media/google-multimodal-embedding/RichVisualOffering.mp4',
                title: 'Rich Visual Offering',
                description: 'Enhanced photo/video coverage and relevance on Google Maps'
            },
            {
                src: 'huythong-nguyen/media/google-multimodal-embedding/LocalSearchOnMaps.mp4',
                title: 'Local Search on Maps',
                description: 'Visual content discovery for local places via multimodal embeddings'
            },
            {
                src: 'huythong-nguyen/media/google-multimodal-embedding/LocalSearchOnSearch.mp4',
                title: 'Local Search on Google Search',
                description: 'Photo/video retrieval for local queries on Search'
            }
        ]
    }
};

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
    
    // Gallery title
    const title = document.createElement('h4');
    title.className = 'media-gallery-title';
    title.textContent = config.title;
    gallery.appendChild(title);
    
    // Media items container
    const itemsContainer = document.createElement('div');
    itemsContainer.className = 'media-items';
    
    config.items.forEach((item, index) => {
        const mediaItem = createMediaItem(item, index);
        itemsContainer.appendChild(mediaItem);
    });
    
    gallery.appendChild(itemsContainer);
    
    // Setup lazy loading after adding to DOM
    requestAnimationFrame(() => {
        setupLazyLoading(gallery);
    });
    
    return gallery;
}

/**
 * Creates a single media item element
 * 
 * @param {Object} item - Media item configuration
 * @param {number} index - Item index for staggered animation
 * @returns {HTMLElement} - The media item element
 */
function createMediaItem(item, index) {
    const mediaItem = document.createElement('div');
    mediaItem.className = 'media-item';
    mediaItem.style.transitionDelay = `${index * 100}ms`;
    
    // Video container with poster overlay
    const videoContainer = document.createElement('div');
    videoContainer.className = 'media-video-container';
    
    // Video element (lazy loaded)
    const video = document.createElement('video');
    video.className = 'media-video';
    video.setAttribute('preload', 'none');
    video.setAttribute('playsinline', '');
    video.setAttribute('controls', '');
    video.setAttribute('data-src', item.src);
    video.muted = true; // Muted for autoplay policies
    
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
            // Video already loaded, just play
            poster.classList.add('hidden');
            try {
                await video.play();
            } catch (e) {
                // Autoplay blocked, show controls
                video.controls = true;
            }
            return;
        }
        
        // Show loading state
        loading.classList.add('active');
        
        // Load video source
        video.src = video.getAttribute('data-src');
        
        video.addEventListener('loadeddata', async () => {
            loading.classList.remove('active');
            video.classList.add('loaded');
            poster.classList.add('hidden');
            try {
                await video.play();
            } catch (e) {
                // Autoplay blocked
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
    videoContainer.addEventListener('click', (e) => {
        if (e.target === videoContainer && !video.src) {
            handlePlay();
        }
    });
    
    videoContainer.appendChild(video);
    videoContainer.appendChild(poster);
    videoContainer.appendChild(loading);
    
    // Caption
    const caption = document.createElement('div');
    caption.className = 'media-caption';
    
    const captionTitle = document.createElement('div');
    captionTitle.className = 'media-caption-title';
    captionTitle.textContent = item.title;
    
    const captionDesc = document.createElement('div');
    captionDesc.className = 'media-caption-desc';
    captionDesc.textContent = item.description;
    
    caption.appendChild(captionTitle);
    caption.appendChild(captionDesc);
    
    mediaItem.appendChild(videoContainer);
    mediaItem.appendChild(caption);
    
    return mediaItem;
}

/**
 * Sets up IntersectionObserver for lazy loading and reveal animation
 * 
 * @param {HTMLElement} gallery - The gallery element to observe
 */
function setupLazyLoading(gallery) {
    const items = gallery.querySelectorAll('.media-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('media-visible');
                // Stop observing once revealed
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -10% 0px'
    });
    
    items.forEach(item => observer.observe(item));
}

/**
 * Injects a media gallery after a specific heading in rendered content
 * 
 * @param {HTMLElement} container - The content container
 * @param {string} headingText - Text of the heading to find
 * @param {string} sectionId - The section ID for MEDIA_CONFIG
 */
export function injectMediaAfterHeading(container, headingText, sectionId) {
    const headings = container.querySelectorAll('h2, h3');
    
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

