/* ==========================================
   SAFE LOCALSTORAGE WRAPPER
   ========================================== */

export const Storage = {
    get(key, fallback = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : fallback;
        } catch (e) {
            console.warn(`[Storage] Failed to get key "${key}":`, e);
            return fallback;
        }
    },

    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.warn(`[Storage] Failed to set key "${key}":`, e);
            return false;
        }
    },

    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            console.warn(`[Storage] Failed to remove key "${key}":`, e);
            return false;
        }
    }
};
