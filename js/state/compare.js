/* ==========================================
   COMPARE TRAY STATE MANAGER
   ========================================== */

import { Storage } from '../utils/storage.js';

const COMPARE_KEY = 'study_abroad_compare';
const MAX_COMPARE = 3;

export const CompareState = {
    getAll() {
        return Storage.get(COMPARE_KEY, []);
    },

    has(slug) {
        return this.getAll().includes(slug);
    },

    toggle(slug) {
        let list = this.getAll();
        const exists = list.includes(slug);

        if (exists) {
            list = list.filter(item => item !== slug);
        } else {
            if (list.length >= MAX_COMPARE) {
                return { success: false, reason: `Maximum ${MAX_COMPARE} courses can be compared at once.` };
            }
            list.push(slug);
        }

        Storage.set(COMPARE_KEY, list);
        window.dispatchEvent(new CustomEvent('compareChanged', { detail: { list, slug, added: !exists } }));
        return { success: true, added: !exists };
    },

    remove(slug) {
        let list = this.getAll().filter(item => item !== slug);
        Storage.set(COMPARE_KEY, list);
        window.dispatchEvent(new CustomEvent('compareChanged', { detail: { list, slug, added: false } }));
    },

    clear() {
        Storage.set(COMPARE_KEY, []);
        window.dispatchEvent(new CustomEvent('compareChanged', { detail: { list: [], slug: null, added: false } }));
    }
};
