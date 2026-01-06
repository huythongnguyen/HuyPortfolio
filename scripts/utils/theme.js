/**
 * Theme Management
 * 
 * Handles light/dark mode switching with:
 * - User preference persistence (localStorage)
 * - System preference detection
 * - Smooth visual transitions
 */

const STORAGE_KEY = 'zen-theme-preference';

function getPreferredTheme() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') {
        return stored;
    }
    return 'dark';
}

function applyTheme(theme) {
    if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.removeAttribute('data-theme');
    }
    updateToggleButton(theme);
}

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

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const newTheme = current === 'dark' ? 'light' : 'dark';

    applyTheme(newTheme);
    localStorage.setItem(STORAGE_KEY, newTheme);
}

export function initTheme() {
    const theme = getPreferredTheme();
    applyTheme(theme);

    const btn = document.getElementById('theme-toggle');
    if (btn) {
        btn.addEventListener('click', toggleTheme);
    }

    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem(STORAGE_KEY)) {
                applyTheme(e.matches ? 'dark' : 'light');
            }
        });
    }
}
