/* ==========================================
   THEME STATE MANAGER
   ========================================== */

import { Storage } from '../utils/storage.js';

const THEME_KEY = 'study_abroad_theme';

export const ThemeState = {
    getTheme() {
        const saved = Storage.get(THEME_KEY);
        if (saved) return saved;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    },

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        Storage.set(THEME_KEY, theme);
        window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
    },

    toggleTheme() {
        const current = this.getTheme();
        const next = current === 'dark' ? 'light' : 'dark';
        this.setTheme(next);
        return next;
    },

    init() {
        const initialTheme = this.getTheme();
        document.documentElement.setAttribute('data-theme', initialTheme);

        // Listen for system theme changes if no explicit user preference is set
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!Storage.get(THEME_KEY)) {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }
};
