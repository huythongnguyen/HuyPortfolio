/**
 * Theme Management
 * 
 * Handles light/dark mode switching with:
 * - User preference persistence (localStorage)
 * - System preference detection
 * - Smooth visual transitions
 * 
 * Following Zen principle: Seijaku (静寂) - stillness in transition
 */

const STORAGE_KEY = 'zen-theme-preference';

/**
 * Detects the user's preferred theme.
 * Priority: localStorage > system preference > dark (default)
 * @returns {'light' | 'dark'}
 */
function getPreferredTheme() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') {
        return stored;
    }

    // Respect system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        return 'light';
    }

    return 'dark';
}

/**
 * Applies the specified theme to the document.
 * @param {'light' | 'dark'} theme
 */
function applyTheme(theme) {
    if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.removeAttribute('data-theme');
    }
    updateToggleButton(theme);
}

/**
 * Updates the toggle button's visual state and accessibility label.
 * @param {'light' | 'dark'} theme
 */
function updateToggleButton(theme) {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;
    
    if (theme === 'dark') {
        btn.textContent = '☀';
        btn.setAttribute('aria-label', 'Switch to light mode');
        btn.title = 'Switch to light mode';
    } else {
        btn.textContent = '☾';
        btn.setAttribute('aria-label', 'Switch to dark mode');
        btn.title = 'Switch to dark mode';
    }
}

/**
 * Toggles between light and dark themes.
 */
function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const newTheme = current === 'dark' ? 'light' : 'dark';
    
    applyTheme(newTheme);
    localStorage.setItem(STORAGE_KEY, newTheme);
}

/**
 * Initializes theme system.
 * Called once on page load.
 */
export function initTheme() {
    // Apply saved or system preference immediately
    const theme = getPreferredTheme();
    applyTheme(theme);
    
    // Attach toggle handler
    const btn = document.getElementById('theme-toggle');
    if (btn) {
        btn.addEventListener('click', toggleTheme);
    }
    
    // Listen for system preference changes
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            // Only auto-switch if user hasn't set a preference
            if (!localStorage.getItem(STORAGE_KEY)) {
                applyTheme(e.matches ? 'dark' : 'light');
            }
        });
    }
}

