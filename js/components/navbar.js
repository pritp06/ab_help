/* ==========================================
   GLOBAL NAVBAR COMPONENT
   ========================================== */

import { ThemeState } from '../state/theme.js';
import { AuthState } from '../state/auth.js';

export function renderNavbar() {
    const mount = document.getElementById('navbar-mount');
    if (!mount) return;

    const currentPath = window.location.pathname;
    const user = AuthState.getUser();

    mount.innerHTML = `
        <header class="navbar-sticky">
            <div class="container navbar-inner">
                <!-- Logo -->
                <a href="/" class="navbar-logo">
                    <span class="navbar-logo-icon">S</span>
                    <span>StudyBuddy</span>
                </a>

                <!-- Nav Links -->
                <nav class="hidden md:flex items-center gap-1">
                    <a href="/" class="nav-link ${currentPath === '/' || currentPath === '/index.html' ? 'is-active' : ''}">Home</a>
                    <a href="/countries.html" class="nav-link ${currentPath.includes('countr') ? 'is-active' : ''}">Countries</a>
                    <a href="/universities.html" class="nav-link ${currentPath.includes('universit') ? 'is-active' : ''}">Top Universities</a>
                    <a href="/courses.html" class="nav-link ${currentPath.includes('course') ? 'is-active' : ''}">Courses</a>
                    <a href="/compare.html" class="nav-link ${currentPath.includes('compare') ? 'is-active' : ''}">Compare</a>
                    <a href="/quiz.html" class="nav-link ${currentPath.includes('quiz') ? 'is-active' : ''}" style="color: var(--color-accent-primary); font-weight: var(--font-bold);">
                        Destination Test 🎯
                    </a>
                </nav>

                <!-- Right Actions: Search + Theme + Auth -->
                <div class="flex items-center gap-3">
                    <button type="button" class="btn btn-outline btn-sm hidden sm:flex items-center gap-2" id="nav-search-btn" aria-label="Open search">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                        <span>Search</span>
                        <kbd style="font-size: 10px; padding: 2px 5px; background: var(--color-surface-hover); border-radius: 4px; border: 1px solid var(--color-border);">⌘K</kbd>
                    </button>

                    <button type="button" class="btn btn-ghost btn-sm" id="nav-theme-btn" aria-label="Toggle theme">
                        ${ThemeState.isDark() ? '🌙' : '☀️'}
                    </button>

                    ${user ? `
                        <a href="/profile.html" class="btn btn-primary btn-sm flex items-center gap-2">
                            <span>👤 ${user.first_name || 'Profile'}</span>
                        </a>
                    ` : `
                        <a href="/auth.html" class="btn btn-primary btn-sm">
                            Sign In
                        </a>
                    `}
                </div>
            </div>
        </header>
    `;

    // Theme toggle handler
    document.getElementById('nav-theme-btn')?.addEventListener('click', () => {
        ThemeState.toggle();
        renderNavbar();
    });

    // Search trigger handler
    document.getElementById('nav-search-btn')?.addEventListener('click', () => {
        const searchInput = document.getElementById('global-search-input');
        const backdrop = document.getElementById('global-search-backdrop');
        if (backdrop && searchInput) {
            backdrop.style.display = 'flex';
            searchInput.focus();
        }
    });
}
