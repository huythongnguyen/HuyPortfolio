/**
 * Mobile Menu Toggle
 * 
 * Handles the mobile-only sidebar toggle button.
 */

export function initMobileMenu() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;

    // Create toggle button
    const menuBtn = document.createElement('button');
    menuBtn.id = 'mobile-menu-toggle';
    menuBtn.ariaLabel = 'Toggle navigation menu';
    menuBtn.innerHTML = `
        <svg class="menu-icon" viewBox="0 0 24 24" width="24" height="24">
            <path class="line line-top" d="M3,6h18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path class="line line-mid" d="M3,12h18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path class="line line-bot" d="M3,18h18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
    `;

    document.body.appendChild(menuBtn);

    menuBtn.addEventListener('click', () => {
        const isOpen = sidebar.classList.contains('open');
        sidebar.classList.toggle('open', !isOpen);
        menuBtn.classList.toggle('active', !isOpen);
    });

    // Close when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (sidebar.classList.contains('open')) {
            if (!sidebar.contains(e.target) && !menuBtn.contains(e.target)) {
                sidebar.classList.remove('open');
                menuBtn.classList.remove('active');
            }
        }
    });
}

export function closeMobileMenu() {
    const sidebar = document.getElementById('sidebar');
    const menuBtn = document.getElementById('mobile-menu-toggle');
    if (sidebar) sidebar.classList.remove('open');
    if (menuBtn) menuBtn.classList.remove('active');
}
