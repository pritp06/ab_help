/* ==========================================
   GLOBAL NAVBAR COMPONENT (REAL AUTH INTEGRATED)
   ========================================== */

import { ThemeState } from '../state/theme.js';
import { AuthState } from '../state/auth.js';
import { ShortlistState } from '../state/shortlist.js';
import { CompareState } from '../state/compare.js';
import { showToast } from './toast.js';

export function renderNavbar() {
    const navContainer = document.getElementById('navbar-mount');
    if (!navContainer) return;

    const render = () => {
        const currentPath = window.location.pathname;
        const shortlistCount = ShortlistState.getAll().length;
        const compareCount = CompareState.getAll().length;
        const user = AuthState.getUser();

        navContainer.innerHTML = `
            <nav class="navbar" id="main-navbar">
                <div class="container navbar-inner">
                    <a href="/" class="navbar-brand">
                        <div class="navbar-logo-icon">S</div>
                        <span>StudyBuddy</span>
                    </a>

                    <div class="navbar-nav navbar-nav-desktop">
                        <a href="/countries.html" class="nav-link ${currentPath.includes('countr') ? 'active' : ''}">Countries</a>
                        <a href="/universities.html" class="nav-link ${currentPath.includes('universit') ? 'active' : ''}">Universities</a>
                        <a href="/courses.html" class="nav-link ${currentPath.includes('course') ? 'active' : ''}">Courses</a>
                        <a href="/compare.html" class="nav-link ${currentPath.includes('compare') ? 'active' : ''}">
                            Compare ${compareCount > 0 ? `<span class="badge badge-neutral">${compareCount}</span>` : ''}
                        </a>
                        <a href="/shortlist.html" class="nav-link ${currentPath.includes('shortlist') ? 'active' : ''}">
                            Shortlist ${shortlistCount > 0 ? `<span class="badge badge-neutral">${shortlistCount}</span>` : ''}
                        </a>
                        <a href="/planner.html" class="nav-link ${currentPath.includes('planner') ? 'active' : ''}">Planner</a>
                    </div>

                    <div class="navbar-actions">
                        <button class="search-trigger-btn" id="nav-search-trigger" aria-label="Search universities and courses">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                            <span class="desktop-only">Search...</span>
                            <span class="search-kbd-shortcut desktop-only">⌘K</span>
                        </button>

                        <button class="theme-toggle-btn" id="nav-theme-toggle" aria-label="Toggle light/dark theme">
                            <svg class="theme-sun-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>
                        </button>

                        ${user ? `
                            <a href="/profile.html" class="btn btn-secondary btn-sm">
                                <span>${user.first_name || 'Profile'}</span>
                            </a>
                            <button class="btn btn-ghost btn-sm" id="nav-logout-btn">
                                Logout
                            </button>
                        ` : `
                            <a href="/login.html" class="btn btn-primary btn-sm">
                                <span>Sign In</span>
                            </a>
                        `}

                        <button class="mobile-menu-btn" id="nav-mobile-toggle" aria-label="Open mobile menu">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
                        </button>
                    </div>
                </div>
            </nav>

            <!-- Mobile Drawer Menu -->
            <div class="sheet-backdrop" id="mobile-menu-backdrop"></div>
            <div class="sheet-panel" id="mobile-menu-panel">
                <div class="sheet-handle"></div>
                <div class="flex flex-col gap-4" style="padding-top: var(--space-4);">
                    <a href="/countries.html" class="nav-link text-large">Countries</a>
                    <a href="/universities.html" class="nav-link text-large">Universities</a>
                    <a href="/courses.html" class="nav-link text-large">Courses</a>
                    <a href="/compare.html" class="nav-link text-large">Compare (${compareCount})</a>
                    <a href="/shortlist.html" class="nav-link text-large">Shortlist (${shortlistCount})</a>
                    <a href="/planner.html" class="nav-link text-large">Application Planner</a>
                    <a href="/profile.html" class="nav-link text-large">Student Profile</a>
                    <div style="margin-top: var(--space-6);">
                        ${user ? `
                            <button class="btn btn-outline btn-full" id="mobile-logout-btn">Logout</button>
                        ` : `
                            <a href="/login.html" class="btn btn-primary btn-full">Sign In</a>
                        `}
                    </div>
                </div>
            </div>
        `;

        // Event listeners
        const navbarEl = document.getElementById('main-navbar');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 20) {
                navbarEl?.classList.add('is-scrolled');
            } else {
                navbarEl?.classList.remove('is-scrolled');
            }
        });

        document.getElementById('nav-theme-toggle')?.addEventListener('click', () => {
            ThemeState.toggleTheme();
        });

        const handleLogout = async () => {
            await AuthState.logout();
            showToast('Logged out successfully.', 'info');
            setTimeout(() => {
                window.location.href = '/';
            }, 300);
        };

        document.getElementById('nav-logout-btn')?.addEventListener('click', handleLogout);
        document.getElementById('mobile-logout-btn')?.addEventListener('click', handleLogout);

        // Mobile drawer handlers
        const mobileBtn = document.getElementById('nav-mobile-toggle');
        const backdrop = document.getElementById('mobile-menu-backdrop');
        const panel = document.getElementById('mobile-menu-panel');

        const toggleMobileMenu = (open) => {
            if (open) {
                backdrop?.classList.add('is-open');
                panel?.classList.add('is-open');
            } else {
                backdrop?.classList.remove('is-open');
                panel?.classList.remove('is-open');
            }
        };

        mobileBtn?.addEventListener('click', () => toggleMobileMenu(true));
        backdrop?.addEventListener('click', () => toggleMobileMenu(false));
    };

    render();

    // Re-render navbar whenever authStateChanged fires
    window.addEventListener('authStateChanged', render);
}
