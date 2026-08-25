/* ==========================================
   UNIFIED DATA SERVICE (MOCK & API ABSTRACTION)
   ========================================== */

import { COUNTRIES } from './countries-data.js';
import { UNIVERSITIES } from './universities-data.js';
import { COURSES } from './courses-data.js';
import { getTopUniversities } from './university-data.js';
import { slugifyUniversityName } from '../utils/format.js';

// Simulated delay helper
const delay = (ms = 50) => new Promise(resolve => setTimeout(resolve, ms));

export const MockDataService = {
    // ----------------------------------------
    // GLOBAL SEARCH
    // ----------------------------------------
    async searchAll(query) {
        await delay(30);
        if (!query || query.trim().length === 0) {
            return { countries: [], universities: [], courses: [] };
        }

        const q = query.toLowerCase().trim();

        const matchedCountries = COUNTRIES.filter(c => 
            c.name.toLowerCase().includes(q) || 
            c.region.toLowerCase().includes(q)
        ).slice(0, 3);

        // Search QS 2026 Top 250 dataset
        const qs2026Results = await getTopUniversities({ query: q });
        const matchedQSUnis = qs2026Results.map(u => ({
            id: `qs-${u.rank}`,
            name: u.name,
            slug: slugifyUniversityName(u.name),
            qsWorldRanking: u.rankDisplay,
            qsYear: 2026
        }));

        // Merge with existing universities array (deduplicating by slug)
        const seenSlugs = new Set();
        const combinedUnis = [];

        for (const u of matchedQSUnis) {
            if (!seenSlugs.has(u.slug)) {
                seenSlugs.add(u.slug);
                combinedUnis.push(u);
            }
        }

        for (const u of UNIVERSITIES) {
            if (combinedUnis.length >= 6) break;
            if (!seenSlugs.has(u.slug) && (
                u.name.toLowerCase().includes(q) || 
                u.shortName.toLowerCase().includes(q) || 
                u.city.toLowerCase().includes(q)
            )) {
                seenSlugs.add(u.slug);
                combinedUnis.push(u);
            }
        }

        const matchedCourses = COURSES.filter(co => 
            co.title.toLowerCase().includes(q) || 
            co.universityName.toLowerCase().includes(q) || 
            co.field.toLowerCase().includes(q) || 
            co.countryName.toLowerCase().includes(q)
        ).slice(0, 5);

        return {
            countries: matchedCountries,
            universities: combinedUnis.slice(0, 6),
            courses: matchedCourses
        };
    },

    // ----------------------------------------
    // COUNTRIES
    // ----------------------------------------
    async getCountries(filters = {}) {
        await delay(30);
        let results = [...COUNTRIES];
        if (filters.region && filters.region !== 'all') {
            results = results.filter(c => c.region.toLowerCase() === filters.region.toLowerCase());
        }
        return results;
    },

    async getCountryBySlug(slug) {
        await delay(30);
        return COUNTRIES.find(c => c.slug === slug) || null;
    },

    // ----------------------------------------
    // UNIVERSITIES
    // ----------------------------------------
    async getUniversities(filters = {}) {
        await delay(30);
        let results = [...UNIVERSITIES];
        if (filters.countrySlug) {
            results = results.filter(u => u.countrySlug === filters.countrySlug);
        }
        return results;
    },

    async getUniversityBySlug(slug) {
        await delay(30);
        return UNIVERSITIES.find(u => u.slug === slug) || null;
    },

    // ----------------------------------------
    // COURSES
    // ----------------------------------------
    async getCourses(filters = {}) {
        await delay(30);
        let results = [...COURSES];

        if (filters.search) {
            const q = filters.search.toLowerCase();
            results = results.filter(c => 
                c.title.toLowerCase().includes(q) || 
                c.universityName.toLowerCase().includes(q) || 
                c.field.toLowerCase().includes(q)
            );
        }

        if (filters.countrySlug) {
            results = results.filter(c => c.countrySlug === filters.countrySlug);
        }

        if (filters.degreeLevel && filters.degreeLevel !== 'all') {
            results = results.filter(c => c.degreeLevel.toLowerCase() === filters.degreeLevel.toLowerCase());
        }

        if (filters.field && filters.field !== 'all') {
            results = results.filter(c => c.field.toLowerCase() === filters.field.toLowerCase());
        }

        return results;
    },

    async getCourseById(id) {
        await delay(30);
        return COURSES.find(c => c.id === id) || null;
    }
};
