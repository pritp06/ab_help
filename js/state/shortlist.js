/* ==========================================
   SHORTLIST STATE MANAGER
   ========================================== */

import { Storage } from '../utils/storage.js';

const SHORTLIST_KEY = 'study_abroad_shortlist';

export const ShortlistState = {
    getAll() {
        return Storage.get(SHORTLIST_KEY, ['msc-computer-science-tum', 'msc-data-engineering-tum']);
    },

    has(slug) {
        const list = this.getAll();
        return list.includes(slug);
    },

    toggle(slug) {
        let list = this.getAll();
        const exists = list.includes(slug);

        if (exists) {
            list = list.filter(item => item !== slug);
        } else {
            list.push(slug);
        }

        Storage.set(SHORTLIST_KEY, list);
        window.dispatchEvent(new CustomEvent('shortlistChanged', { detail: { list, slug, added: !exists } }));
        return !exists;
    },

    remove(slug) {
        let list = this.getAll();
        list = list.filter(item => item !== slug);
        Storage.set(SHORTLIST_KEY, list);
        window.dispatchEvent(new CustomEvent('shortlistChanged', { detail: { list, slug, added: false } }));
    }
};
