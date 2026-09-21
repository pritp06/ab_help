/* ==========================================
   THEME STATE MANAGER (LIGHT / DARK)
   ========================================== */

const STORAGE_KEY = 'study_abroad_theme';

export const ThemeState = {
    current: 'light',

    init() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            this.current = saved;
        } else {
            const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            this.current = prefersDark ? 'dark' : 'light';
        }
        this.apply();
    },

    toggle() {
        this.current = this.current === 'dark' ? 'light' : 'dark';
        localStorage.setItem(STORAGE_KEY, this.current);
        this.apply();
    },

    isDark() {
        return this.current === 'dark';
    },

    apply() {
        document.documentElement.setAttribute('data-theme', this.current);
    }
};
