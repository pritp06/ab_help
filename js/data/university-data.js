/* ==========================================
   QS 2026 TOP 250 UNIVERSITY DATA SERVICE
   ========================================== */

import { QS_2026_TOP_250 } from './universities/qs-2026-top-250.js';
import { slugifyUniversityName } from '../utils/format.js';

/**
 * Validate dataset at service initialization time.
 * Returns validation stats: records count, valid count, error count.
 */
export function validateTop250Dataset() {
    const records = QS_2026_TOP_250;
    const errors = [];

    records.forEach((item, index) => {
        if (!item.rank || typeof item.rank !== 'number' || item.rank <= 0) {
            errors.push(`Row ${index}: Invalid rank ${item.rank}`);
        }
        if (!item.name || typeof item.name !== 'string' || item.name.trim() === '') {
            errors.push(`Row ${index}: Empty or invalid name`);
        }
        if (!item.rankDisplay || typeof item.rankDisplay !== 'string') {
            errors.push(`Row ${index}: Invalid rankDisplay`);
        }
    });

    return {
        total: records.length,
        valid: records.length - errors.length,
        errors: errors.length,
        errorList: errors
    };
}

/**
 * Get Top Universities from QS 2026 dataset with optional maxRank and query search filters.
 */
export async function getTopUniversities(options = {}) {
    let list = [...QS_2026_TOP_250];

    // Filter by maxRank (e.g. Top 10, Top 50, Top 100, Top 200, Top 250)
    if (options.maxRank && typeof options.maxRank === 'number') {
        list = list.filter(item => item.rank <= options.maxRank);
    }

    // Filter by query string (case-insensitive, whitespace-tolerant)
    if (options.query && typeof options.query === 'string' && options.query.trim()) {
        const q = options.query.trim().toLowerCase();
        list = list.filter(item => item.name.toLowerCase().includes(q));
    }

    // Always preserve official rank order (rank ascending)
    return list.sort((a, b) => a.rank - b.rank);
}

/**
 * Get universities up to a specific max rank (e.g. 50, 100, 250).
 */
export async function getUniversitiesUpToRank(maxRank = 250) {
    return getTopUniversities({ maxRank });
}

/**
 * Search universities by name query.
 */
export async function searchUniversities(query = '') {
    return getTopUniversities({ query });
}

/**
 * Get university record by slug.
 */
export async function getUniversityBySlug(slug) {
    if (!slug) return null;
    const normalizedSlug = slug.trim().toLowerCase();

    return QS_2026_TOP_250.find(item => {
        const itemSlug = slugifyUniversityName(item.name);
        return itemSlug === normalizedSlug;
    }) || null;
}
