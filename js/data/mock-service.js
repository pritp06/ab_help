/* ==========================================
   UNIFIED DATA SERVICE (MOCK & API ABSTRACTION)
   ========================================== */

import { COUNTRIES } from './countries-data.js';
import { UNIVERSITIES } from './universities-data.js';
import { COURSES } from './courses-data.js';

// Simulated delay helper
const delay = (ms = 80) => new Promise(resolve => setTimeout(resolve, ms));

export const MockDataService = {
    // ----------------------------------------
    // GLOBAL SEARCH
    // ----------------------------------------
    async searchAll(query) {
        await delay(50);
        if (!query || query.trim().length === 0) {
            return { countries: [], universities: [], courses: [] };
        }

        const q = query.toLowerCase().trim();

        const matchedCountries = COUNTRIES.filter(c => 
            c.name.toLowerCase().includes(q) || 
            c.region.toLowerCase().includes(q)
        ).slice(0, 3);

        const matchedUniversities = UNIVERSITIES.filter(u => 
            u.name.toLowerCase().includes(q) || 
            u.shortName.toLowerCase().includes(q) || 
            u.city.toLowerCase().includes(q)
        ).slice(0, 4);

        const matchedCourses = COURSES.filter(co => 
            co.title.toLowerCase().includes(q) || 
            co.universityName.toLowerCase().includes(q) || 
            co.field.toLowerCase().includes(q) || 
            co.countryName.toLowerCase().includes(q)
        ).slice(0, 5);

        return {
            countries: matchedCountries,
            universities: matchedUniversities,
            courses: matchedCourses
        };
    },

    // ----------------------------------------
    // COUNTRIES
    // ----------------------------------------
    async getCountries(filters = {}) {
        await delay(50);
        let results = [...COUNTRIES];
        if (filters.region && filters.region !== 'all') {
            results = results.filter(c => c.region.toLowerCase() === filters.region.toLowerCase());
        }
        return results;
    },

    async getCountryBySlug(slug) {
        await delay(50);
        return COUNTRIES.find(c => c.slug === slug) || null;
    },

    // ----------------------------------------
    // UNIVERSITIES
    // ----------------------------------------
    async getUniversities(filters = {}) {
        await delay(50);
        let results = [...UNIVERSITIES];
        
        if (filters.countrySlug && filters.countrySlug !== 'all') {
            results = results.filter(u => u.countrySlug === filters.countrySlug);
        }
        if (filters.field && filters.field !== 'all') {
            results = results.filter(u => u.popularFields.some(f => f.toLowerCase() === filters.field.toLowerCase()));
        }
        if (filters.query) {
            const q = filters.query.toLowerCase();
            results = results.filter(u => u.name.toLowerCase().includes(q) || u.city.toLowerCase().includes(q));
        }

        return results;
    },

    async getUniversityBySlug(slug) {
        await delay(50);
        return UNIVERSITIES.find(u => u.slug === slug) || null;
    },

    // ----------------------------------------
    // COURSES
    // ----------------------------------------
    async getCourses(filters = {}) {
        await delay(50);
        let results = [...COURSES];

        if (filters.countrySlug && filters.countrySlug !== 'all') {
            results = results.filter(c => c.countrySlug === filters.countrySlug);
        }
        if (filters.universitySlug && filters.universitySlug !== 'all') {
            results = results.filter(c => c.universitySlug === filters.universitySlug);
        }
        if (filters.degreeType && filters.degreeType !== 'all') {
            results = results.filter(c => c.degreeType === filters.degreeType);
        }
        if (filters.field && filters.field !== 'all') {
            results = results.filter(c => c.field.toLowerCase() === filters.field.toLowerCase());
        }
        if (filters.language && filters.language !== 'all') {
            results = results.filter(c => c.language.toLowerCase() === filters.language.toLowerCase());
        }
        if (filters.maxTuition) {
            results = results.filter(c => c.tuitionAnnual <= Number(filters.maxTuition));
        }
        if (filters.query) {
            const q = filters.query.toLowerCase();
            results = results.filter(c => 
                c.title.toLowerCase().includes(q) || 
                c.universityName.toLowerCase().includes(q) ||
                c.countryName.toLowerCase().includes(q)
            );
        }

        return results;
    },

    async getCourseBySlug(slug) {
        await delay(50);
        return COURSES.find(c => c.slug === slug) || null;
    },

    async getCoursesBySlugs(slugs = []) {
        await delay(50);
        return COURSES.filter(c => slugs.includes(c.slug));
    }
};
