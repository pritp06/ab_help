/* ==========================================
   PERSONALIZED DESTINATION & COURSE RECOMMENDER ENGINE
   ========================================== */

import { COUNTRIES } from './countries-data.js';
import { UNIVERSITIES } from './universities-data.js';
import { COURSES } from './courses-data.js';
import { QS_2026_TOP_250 } from './universities/qs-2026-top-250.js';
import { slugifyUniversityName } from '../utils/format.js';

export const COUNTRY_METRICS = [
    {
        id: 'germany',
        slug: 'germany',
        name: 'Germany',
        flag: '🇩🇪',
        region: 'Europe',
        tuitionTier: 'free', // free, budget, moderate, premium
        avgTuitionEur: 0,
        costOfLivingMonthlyEur: 930,
        prScore: 9, // 1-10 scale
        postStudyWorkYears: 1.5,
        prTimelineYears: 2, // PR after 2 years working on job visa
        englishProgramAvailability: 'High for Master’s (800+ English degrees), Moderate for Bachelor’s',
        languageRequirement: 'English B2/C1. German A1-B2 recommended for daily life & local job market.',
        climateCategory: 'moderate', // cold, moderate, sunny
        topFields: ['stem', 'business', 'law'],
        minRecommendedCgpa: 7.0,
        greRequired: false,
        summaryHighlights: [
            '€0 tuition fees at public universities (small ~€300/sem admin ticket fee)',
            'Fast-track Permanent Residency (PR) after 2 years of skilled work',
            '18-month Post-Study Job Seeker Visa with full work rights',
            'Europe’s strongest industrial economy & high tech demand'
        ]
    },
    {
        id: 'united-kingdom',
        slug: 'united-kingdom',
        name: 'United Kingdom',
        flag: '🇬🇧',
        region: 'Europe',
        tuitionTier: 'premium',
        avgTuitionEur: 22000,
        costOfLivingMonthlyEur: 1300,
        prScore: 6,
        postStudyWorkYears: 2.0,
        prTimelineYears: 5,
        englishProgramAvailability: '100% Native English instruction across all degrees',
        languageRequirement: 'No local language barrier. IELTS/TOEFL required.',
        climateCategory: 'moderate',
        topFields: ['business', 'law', 'arts', 'humanities', 'stem', 'medicine'],
        minRecommendedCgpa: 6.5,
        greRequired: false,
        summaryHighlights: [
            '1-year intensive Master’s programs for fast career entry & lower living cost',
            '2-Year Graduate Route post-study work visa (3 years for PhD)',
            'World-class prestige (Oxford, Cambridge, Imperial, KCL, UCL)',
            'Global financial & tech hub in London and Manchester'
        ]
    },
    {
        id: 'canada',
        slug: 'canada',
        name: 'Canada',
        flag: '🇨🇦',
        region: 'North America',
        tuitionTier: 'moderate',
        avgTuitionEur: 17000,
        costOfLivingMonthlyEur: 1200,
        prScore: 10,
        postStudyWorkYears: 3.0,
        prTimelineYears: 2,
        englishProgramAvailability: '100% English native instruction (French optional in Quebec)',
        languageRequirement: 'English IELTS/PTE. No secondary language needed.',
        climateCategory: 'cold',
        topFields: ['stem', 'business', 'medicine', 'humanities'],
        minRecommendedCgpa: 7.0,
        greRequired: false,
        summaryHighlights: [
            'Most transparent & straightforward Express Entry / PNP Permanent Residency pathway',
            'Up to 3-Year Post-Graduation Work Permit (PGWP)',
            'High quality of life, multicultural safety, & strong tech hubs (Toronto, Vancouver)',
            'Spouse open work permit allowed during studies'
        ]
    },
    {
        id: 'australia',
        slug: 'australia',
        name: 'Australia',
        flag: '🇦🇺',
        region: 'Oceania',
        tuitionTier: 'premium',
        avgTuitionEur: 24000,
        costOfLivingMonthlyEur: 1400,
        prScore: 8,
        postStudyWorkYears: 3.0,
        prTimelineYears: 3,
        englishProgramAvailability: '100% Native English instruction',
        languageRequirement: 'English IELTS/PTE required.',
        climateCategory: 'sunny',
        topFields: ['medicine', 'stem', 'business', 'arts'],
        minRecommendedCgpa: 6.5,
        greRequired: false,
        summaryHighlights: [
            '2 to 4-year Post-Study Work Visa (extra 1-2 years in regional areas)',
            'High student minimum wage & 48 hrs/fortnight working allowance during term',
            'Sunny lifestyle, top beaches, & high safety index (Sydney, Melbourne, Brisbane)',
            'Subclass 190 / 491 State Nominated Permanent Residency pathways'
        ]
    },
    {
        id: 'ireland',
        slug: 'ireland',
        name: 'Ireland',
        flag: '🇮🇪',
        region: 'Europe',
        tuitionTier: 'moderate',
        avgTuitionEur: 15000,
        costOfLivingMonthlyEur: 1250,
        prScore: 8,
        postStudyWorkYears: 2.0,
        prTimelineYears: 5,
        englishProgramAvailability: '100% Native English-speaking EU nation',
        languageRequirement: 'English IELTS/TOEFL required.',
        climateCategory: 'moderate',
        topFields: ['stem', 'business', 'medicine'],
        minRecommendedCgpa: 6.5,
        greRequired: false,
        summaryHighlights: [
            'European headquarters for Google, Apple, Meta, Pfizer, and Stripe (Silicon Docks)',
            '2-Year Third Level Graduate Work Scheme for Master’s graduates',
            'Only native English-speaking country remaining in the European Union',
            'Critical Skills Employment Permit leading to Stamp 4 Permanent Residence'
        ]
    },
    {
        id: 'netherlands',
        slug: 'netherlands',
        name: 'Netherlands',
        flag: '🇳🇱',
        region: 'Europe',
        tuitionTier: 'budget',
        avgTuitionEur: 11000,
        costOfLivingMonthlyEur: 1100,
        prScore: 7,
        postStudyWorkYears: 1.0,
        prTimelineYears: 5,
        englishProgramAvailability: 'Over 2,100+ fully English-taught degree courses',
        languageRequirement: '95% of population speaks fluent English. Dutch optional.',
        climateCategory: 'moderate',
        topFields: ['stem', 'business', 'arts', 'humanities'],
        minRecommendedCgpa: 7.0,
        greRequired: false,
        summaryHighlights: [
            'Top-ranked research universities in Continental Europe (TU Delft, UvA)',
            '1-Year Orientation Year Visa (Zoekjaar) for university graduates',
            '95% English proficiency nationwide makes social integration effortless',
            'High starting salaries in engineering, logistics, and fintech'
        ]
    },
    {
        id: 'sweden',
        slug: 'sweden',
        name: 'Sweden',
        flag: '🇸🇪',
        region: 'Europe',
        tuitionTier: 'budget',
        avgTuitionEur: 12000,
        costOfLivingMonthlyEur: 1050,
        prScore: 7,
        postStudyWorkYears: 1.0,
        prTimelineYears: 4,
        englishProgramAvailability: 'High English program availability for Master’s & Research',
        languageRequirement: 'English IELTS. Swedish is optional.',
        climateCategory: 'cold',
        topFields: ['stem', 'arts', 'business'],
        minRecommendedCgpa: 7.0,
        greRequired: false,
        summaryHighlights: [
            'Nordic welfare model, flat hierarchy, & sustainable innovation (KTH, Lund)',
            '1-year post-study residence permit to seek employment or start a business',
            'Ph.D. studies are fully funded with employee salary status',
            'Work permit leads to permanent residence after 4 years'
        ]
    },
    {
        id: 'united-states',
        slug: 'united-states',
        name: 'United States',
        flag: '🇺🇸',
        region: 'North America',
        tuitionTier: 'premium',
        avgTuitionEur: 32000,
        costOfLivingMonthlyEur: 1500,
        prScore: 4,
        postStudyWorkYears: 3.0, // 3 years for STEM OPT
        prTimelineYears: 6,
        englishProgramAvailability: '100% Native English instruction',
        languageRequirement: 'IELTS/TOEFL. GRE/GMAT often required for top Master’s.',
        climateCategory: 'sunny',
        topFields: ['stem', 'business', 'medicine', 'arts', 'law'],
        minRecommendedCgpa: 7.5,
        greRequired: true,
        summaryHighlights: [
            'Highest global starting salaries & tech/finance industry scale (Silicon Valley, NYC)',
            'Up to 3-Year STEM OPT (Optional Practical Training) work authorization',
            'Home to Ivy League & premier research universities (MIT, Stanford, Harvard)',
            'Unmatched venture capital & startup incubation opportunities'
        ]
    }
];

export function evaluateQuizAnswers(answers) {
    // Default fallback answers if partially filled
    const userAnswers = {
        field: answers.field || 'stem',
        budget: answers.budget || 'budget',
        prPriority: answers.prPriority || 'high',
        languagePref: answers.languagePref || 'english_only',
        degreeLevel: answers.degreeLevel || 'masters',
        climate: answers.climate || 'moderate',
        cgpa: answers.cgpa || 'good',
        experience: answers.experience || 'fresh',
        testStatus: answers.testStatus || 'no_gre',
        careerGoal: answers.careerGoal || 'pr_settlement'
    };

    const scoredCountries = COUNTRY_METRICS.map(country => {
        let score = 50; // base score out of 100
        const rationale = [];

        // 1. Budget Fit (Weight 20%)
        if (userAnswers.budget === 'free') {
            if (country.tuitionTier === 'free') {
                score += 25;
                rationale.push(`Matches your zero-tuition preference (${country.name} public universities charge €0 tuition).`);
            } else if (country.tuitionTier === 'budget') {
                score += 15;
                rationale.push(`Offers affordable low tuition fees (avg €${country.avgTuitionEur.toLocaleString()}/yr).`);
            } else {
                score -= 15;
            }
        } else if (userAnswers.budget === 'budget') {
            if (['free', 'budget'].includes(country.tuitionTier)) {
                score += 20;
                rationale.push(`Fits well within your budget limit (< €12k/yr tuition).`);
            } else if (country.tuitionTier === 'moderate') {
                score += 10;
            } else {
                score -= 10;
            }
        } else if (userAnswers.budget === 'moderate') {
            if (['budget', 'moderate'].includes(country.tuitionTier)) {
                score += 20;
            } else {
                score += 10;
            }
        } else { // premium
            score += 15; // User has high budget, all countries accessible
            if (['premium', 'moderate'].includes(country.tuitionTier)) {
                rationale.push(`Unlocks top-tier premium institutions & high-resource campuses.`);
            }
        }

        // 2. PR Priority (Weight 20%)
        if (userAnswers.prPriority === 'high') {
            if (country.prScore >= 8) {
                score += 25;
                rationale.push(`High PR Suitability (${country.prScore}/10 PR index, ${country.postStudyWorkYears}-year work visa).`);
            } else if (country.prScore >= 6) {
                score += 10;
            } else {
                score -= 15;
                rationale.push(`Stricter long-term PR pathways compared to Canada or Germany.`);
            }
        } else if (userAnswers.prPriority === 'moderate') {
            if (country.prScore >= 6) score += 15;
        } else { // low
            score += 10; // PR not important
        }

        // 3. Language Preference (Weight 15%)
        if (userAnswers.languagePref === 'english_only') {
            if (['united-kingdom', 'canada', 'australia', 'ireland', 'united-states'].includes(country.id)) {
                score += 20;
                rationale.push(`100% native English environment with zero foreign language barrier.`);
            } else if (['netherlands', 'sweden'].includes(country.id)) {
                score += 15;
                rationale.push(`Nationwide English fluency (90%+) and 1,000+ English degree programs.`);
            } else if (country.id === 'germany') {
                score += 10;
                rationale.push(`Over 800+ English Master’s degrees available.`);
            }
        } else if (userAnswers.languagePref === 'open_local') {
            if (['germany', 'netherlands', 'sweden'].includes(country.id)) {
                score += 20;
                rationale.push(`Great fit: Rewards students open to learning local languages with better job prospects.`);
            }
        }

        // 4. Field of Study Alignment (Weight 15%)
        if (country.topFields.includes(userAnswers.field)) {
            score += 15;
            rationale.push(`Strong academic ecosystem & high job market demand for ${userAnswers.field.toUpperCase()}.`);
        }

        // 5. Climate & Lifestyle (Weight 10%)
        if (userAnswers.climate === country.climateCategory) {
            score += 10;
            rationale.push(`Matches your preferred ${country.climateCategory} climate and lifestyle.`);
        }

        // 6. Test Status & CGPA (Weight 10%)
        if (userAnswers.testStatus === 'no_gre' && !country.greRequired) {
            score += 10;
            rationale.push(`No GRE/GMAT required for most admissions.`);
        } else if (userAnswers.testStatus === 'gre_ready' && country.greRequired) {
            score += 10;
            rationale.push(`Leverages your GRE score for high-prestige admissions.`);
        }

        // Clamp score between 40% and 98% for realistic feel
        const finalScore = Math.min(98, Math.max(42, Math.round(score)));

        return {
            ...country,
            matchScore: finalScore,
            rationale: rationale.slice(0, 3)
        };
    });

    // Sort countries by match score descending
    scoredCountries.sort((a, b) => b.matchScore - a.matchScore);

    const topRecommendedCountry = scoredCountries[0];

    // Find recommended universities matching top recommended countries & user's field
    const recommendedUniversities = QS_2026_TOP_250.filter(uni => {
        const uniNameLower = uni.name.toLowerCase();
        if (topRecommendedCountry.id === 'germany') {
            return uniNameLower.includes('munich') || uniNameLower.includes('aachen') || uniNameLower.includes('berlin') || uniNameLower.includes('heidelberg');
        } else if (topRecommendedCountry.id === 'united-kingdom') {
            return uniNameLower.includes('oxford') || uniNameLower.includes('imperial') || uniNameLower.includes('cambridge') || uniNameLower.includes('manchester');
        } else if (topRecommendedCountry.id === 'canada') {
            return uniNameLower.includes('toronto') || uniNameLower.includes('mcgill') || uniNameLower.includes('british columbia') || uniNameLower.includes('waterloo');
        } else if (topRecommendedCountry.id === 'australia') {
            return uniNameLower.includes('melbourne') || uniNameLower.includes('sydney') || uniNameLower.includes('monash') || uniNameLower.includes('queensland');
        } else {
            return uni.rank <= 50;
        }
    }).slice(0, 4).map(uni => ({
        ...uni,
        slug: slugifyUniversityName(uni.name)
    }));

    // Find recommended courses matching user's field
    const recommendedCourses = COURSES.filter(c => {
        const fieldMatch = c.field.toLowerCase() === userAnswers.field || c.title.toLowerCase().includes(userAnswers.field);
        return fieldMatch;
    }).slice(0, 4);

    return {
        userAnswers,
        topCountry: topRecommendedCountry,
        allCountries: scoredCountries,
        recommendedUniversities,
        recommendedCourses
    };
}
