# Video Optimization Guide for Portfolio Deployment

## Current Video Sizes
- `RichVisualOffering.mp4`: 19.58 MB
- `LocalSearchOnMaps.mp4`: 24.67 MB  
- `LocalSearchOnSearch.mp4`: 45.42 MB
- **Total**: ~90 MB

## Best Practices Implemented

### 1. Lazy Loading (Already Done ✓)
Videos use `preload="none"` and only load when user clicks play, preventing unnecessary bandwidth consumption on page load.

### 2. Click-to-Play Pattern (Already Done ✓)
Videos don't autoplay. A minimal play button invites interaction following the Ma (間) principle.

### 3. Progressive Enhancement (Already Done ✓)
- Respects `prefers-reduced-motion` for accessibility
- Graceful fallback if video fails to load

---

## Deployment Options

### Option A: Self-Host (Current Setup)
**Pros**: Full control, no external dependencies
**Cons**: Large file sizes impact hosting bandwidth

**Recommended Actions**:
```bash
# Install FFmpeg (Windows via Chocolatey)
choco install ffmpeg

# Compress videos (reduces size by 50-70%)
ffmpeg -i input.mp4 -c:v libx264 -crf 28 -preset slow -c:a aac -b:a 128k output.mp4

# Create WebM fallback for better browser support
ffmpeg -i input.mp4 -c:v libvpx-vp9 -crf 30 -b:v 0 -c:a libopus output.webm
```

### Option B: GitHub LFS (For GitHub Pages)
If deploying to GitHub Pages with large files:
```bash
git lfs install
git lfs track "*.mp4"
git add .gitattributes
git add huythong-nguyen/media/**/*.mp4
git commit -m "Add video files with LFS"
```

### Option C: External Video Hosting (Recommended for Production)
Upload to a CDN or video platform and reference URLs:

**Free Options**:
- **Cloudflare R2**: Free egress, pay only for storage (~$0.015/GB/month)
- **Backblaze B2 + Cloudflare**: Free bandwidth with Cloudflare CDN
- **YouTube Unlisted**: Free, but less control over player

**Update media.js**:
```javascript
export const MEDIA_CONFIG = {
    'google-multimodal-embedding': {
        title: 'Visual Demonstrations',
        items: [
            {
                src: 'https://your-cdn.com/RichVisualOffering.mp4',
                // ... rest stays same
            }
        ]
    }
};
```

### Option D: Generate Video Thumbnails
Create poster images for better initial appearance:
```bash
# Extract frame at 1 second as thumbnail
ffmpeg -i video.mp4 -ss 00:00:01 -vframes 1 video-poster.jpg
```

Then update the media item:
```javascript
{
    src: 'path/to/video.mp4',
    poster: 'path/to/video-poster.jpg',  // Add poster support
    title: 'Video Title',
    description: 'Description'
}
```

---

## Compression Quick Reference

| Quality Level | CRF Value | Size Reduction | Use Case |
|---------------|-----------|----------------|----------|
| High          | 18-23     | 30-40%         | Detailed visuals |
| Medium        | 24-28     | 50-60%         | **Recommended** |
| Low           | 29-35     | 70-80%         | Quick previews |

---

## Implementation Checklist

- [x] Lazy loading implemented
- [x] Click-to-play pattern
- [x] Loading states
- [x] Zen-style design
- [ ] Compress videos with FFmpeg
- [ ] Generate poster thumbnails
- [ ] Consider CDN hosting for production

