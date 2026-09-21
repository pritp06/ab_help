/* ==========================================
   PERSONALIZED DESTINATION MATCHER QUIZ CONTROLLER
   ========================================== */

import { QuizState } from '../state/quiz.js';
import { slugifyUniversityName } from '../utils/format.js';

export const QUIZ_QUESTIONS = [
    {
        id: 'field',
        title: 'Question 1 of 10: Field of Study',
        question: 'What is your primary field of study or course interest?',
        subtitle: 'We match this against active industry growth, research funding, and post-study job markets.',
        options: [
            { value: 'stem', label: 'STEM & Engineering', desc: 'Computer Science, AI, Robotics, Data Science, Mechanical, Biotech', icon: '🔬' },
            { value: 'business', label: 'Business & Management', desc: 'MBA, Finance, Fintech, Marketing, Supply Chain, Entrepreneurship', icon: '💼' },
            { value: 'medicine', label: 'Healthcare & Medicine', desc: 'Pharmacy, Nursing, Public Health, Biomedical Science, Dentistry', icon: '🏥' },
            { value: 'arts', label: 'Arts, Design & Media', desc: 'Architecture, UX/UI, Graphic Design, Film, Fashion, Journalism', icon: '🎨' },
            { value: 'humanities', label: 'Humanities & Social Sciences', desc: 'Psychology, Economics, International Relations, Sociology', icon: '📚' },
            { value: 'law', label: 'Law & Public Policy', desc: 'LL.M., Corporate Law, Public Administration, Environmental Policy', icon: '⚖️' }
        ]
    },
    {
        id: 'budget',
        title: 'Question 2 of 10: Annual Tuition Budget',
        question: 'What is your annual tuition fee comfort range?',
        subtitle: 'We factor in public university subsidies, scholarships, and living expense requirements.',
        options: [
            { value: 'free', label: 'Zero / Subsidized (< €2,000 / year)', desc: 'Public universities with €0 tuition (e.g., Germany, Scandinavia)', icon: '💶' },
            { value: 'budget', label: 'Budget Friendly (€2,000 – €10,000 / year)', desc: 'Affordable European & Asian research institutions', icon: '💵' },
            { value: 'moderate', label: 'Moderate (€10,000 – €25,000 / year)', desc: 'Standard UK, Irish, and Canadian postgraduate fees', icon: '💳' },
            { value: 'premium', label: 'Premium (€25,000+ / year)', desc: 'Unrestricted access to US Ivy League & top Australian degrees', icon: '💎' }
        ]
    },
    {
        id: 'prPriority',
        title: 'Question 3 of 10: Post-Graduation PR & Work Visa',
        question: 'How important is Permanent Residency (PR) or long-term work visa after graduation?',
        subtitle: 'Countries vary widely in post-study work permits (from 1 year up to 3-4 years).',
        options: [
            { value: 'high', label: 'High Priority (Must have fast PR pathway)', desc: 'Seek straightforward Express Entry, PNP, or EU permanent settlement', icon: '🏆' },
            { value: 'moderate', label: 'Moderate (Want 2–3 year work visa)', desc: 'Desire global work experience before deciding long-term residence', icon: '🚀' },
            { value: 'low', label: 'Low / Flexible (Not primary focus)', desc: 'Focus is on degree quality, prestige, or returning home post-study', icon: '✈️' }
        ]
    },
    {
        id: 'languagePref',
        title: 'Question 4 of 10: Language Preference',
        question: 'What is your language preference for academic instruction & daily life?',
        subtitle: 'We evaluate English-taught degree availability versus local language requirements.',
        options: [
            { value: 'english_only', label: '100% Native English Environments', desc: 'UK, USA, Canada, Australia, Ireland — zero foreign language barrier', icon: '🇬🇧' },
            { value: 'open_local', label: 'English Degree + Open to Local Language', desc: 'Germany, Netherlands, Sweden (English Master’s + learn basic A1/B1 local)', icon: '🌐' },
            { value: 'non_english_native', label: 'Native Non-English Immersion', desc: 'Open to full bilingual immersion programs', icon: '🌍' }
        ]
    },
    {
        id: 'degreeLevel',
        title: 'Question 5 of 10: Target Degree Level',
        question: 'Which degree level are you planning to pursue?',
        subtitle: 'Admission criteria and work permit durations differ by level.',
        options: [
            { value: 'bachelors', label: 'Bachelor’s Degree (Undergraduate)', desc: '3 to 4 year foundational degree programs', icon: '🎓' },
            { value: 'masters', label: 'Master’s Degree (Postgraduate)', desc: '1 to 2 year advanced specialization or MBA', icon: '📜' },
            { value: 'phd', label: 'Ph.D. / Doctorate Research', desc: 'Fully funded research, stipend, and academic path', icon: '🔬' },
            { value: 'diploma', label: 'Postgraduate Diploma / Certificate', desc: '1-year practical vocational or career conversion course', icon: '📄' }
        ]
    },
    {
        id: 'climate',
        title: 'Question 6 of 10: Preferred Climate & Lifestyle',
        question: 'What climate and living environment do you prefer?',
        subtitle: 'Living comfort plays a key role in long-term study success.',
        options: [
            { value: 'cold', label: 'Cold / Nordic & Alpine Climate', desc: 'Snowy winters, high quality of life (Sweden, Finland, Canada)', icon: '❄️' },
            { value: 'moderate', label: 'Moderate Continental Climate', desc: 'Four distinct seasons, mild summers (Germany, UK, Netherlands, Ireland)', icon: '🌤️' },
            { value: 'sunny', label: 'Sunny & Coastal Sunbelt', desc: 'Warm weather, beaches, outdoors (Australia, US Sunbelt)', icon: '☀️' }
        ]
    },
    {
        id: 'cgpa',
        title: 'Question 7 of 10: Academic CGPA / Grade',
        question: 'What is your current or estimated Academic CGPA bracket?',
        subtitle: 'Used to filter universities where your admission probability is strong.',
        options: [
            { value: 'top', label: 'Outstanding (> 8.5/10 CGPA or > 3.5 GPA)', desc: 'Eligible for top-tier competitive & Ivy League admissions', icon: '🌟' },
            { value: 'good', label: 'Good (7.0 – 8.5/10 CGPA or 3.0 – 3.5 GPA)', desc: 'Strong fit for top public research universities worldwide', icon: '📈' },
            { value: 'average', label: 'Average (6.0 – 7.0/10 CGPA or 2.5 – 3.0 GPA)', desc: 'Good fit for flexible entry and applied science universities', icon: '🎯' },
            { value: 'diploma', label: 'Flexible / Diploma Level Entry', desc: 'Focus on practical skills and pathway programs', icon: '📋' }
        ]
    },
    {
        id: 'experience',
        title: 'Question 8 of 10: Work Experience Level',
        question: 'How many years of full-time work experience do you have?',
        subtitle: 'Some Master’s & MBA programs require 2+ years of industry experience.',
        options: [
            { value: 'fresh', label: 'Fresh Graduate / 0 – 1 Year', desc: 'Direct entry from Bachelor’s to Master’s', icon: '🌱' },
            { value: 'mid', label: '2 – 5 Years Professional Experience', desc: 'Ideal for specialized Master’s, Tech, and MBA', icon: '💼' },
            { value: 'senior', label: '5+ Years Senior / Leadership Experience', desc: 'Qualifies for Executive MBA, Senior pathways & management', icon: '🏢' }
        ]
    },
    {
        id: 'testStatus',
        title: 'Question 9 of 10: Standardized Exams',
        question: 'What is your standardized test readiness status?',
        subtitle: 'We filter out unnecessary entrance exam burdens where possible.',
        options: [
            { value: 'no_gre', label: 'Prefer No GRE/GMAT Required', desc: 'Focus on IELTS/TOEFL + Academic Transcripts', icon: '📝' },
            { value: 'gre_ready', label: 'GRE / GMAT Ready or Taken', desc: 'Targeting US & competitive quantitative programs', icon: '📊' },
            { value: 'no_ielts', label: 'Prefer English Medium Waiver', desc: 'Targeting universities accepting English MOI certificates', icon: '🗣️' }
        ]
    },
    {
        id: 'careerGoal',
        title: 'Question 10 of 10: Primary Career Goal',
        question: 'What is your single most important career goal after graduation?',
        subtitle: 'Final weighting factor for our destination matching algorithm.',
        options: [
            { value: 'pr_settlement', label: 'Permanent Settlement & High Quality of Life', desc: 'Focus on permanent residency, safety, and long-term family security', icon: '🏡' },
            { value: 'max_salary', label: 'Maximum Industry Salary & Tech ROI', desc: 'Focus on highest starting salary & venture capital hubs', icon: '💰' },
            { value: 'research', label: 'Academic Research & PhD Progression', desc: 'Focus on lab facilities, grants, and doctoral research', icon: '🧬' },
            { value: 'global_exposure', label: 'International Exposure & Mobility', desc: 'Focus on global brand prestige and multinational networking', icon: '🌐' }
        ]
    }
];

export function initQuizPage() {
    QuizState.init();

    const mount = document.getElementById('quiz-mount');
    if (!mount) return;

    function render() {
        const { currentStep, answers, results, isCompleted } = QuizState.state;

        if (isCompleted && results) {
            renderResults(mount, results);
        } else {
            renderWizard(mount, currentStep, answers);
        }
    }

    QuizState.subscribe(() => {
        render();
    });

    render();
}

function renderWizard(container, currentStep, answers) {
    const questionObj = QUIZ_QUESTIONS[currentStep];
    const currentVal = answers[questionObj.id];
    const progressPct = Math.round(((currentStep + 1) / QUIZ_QUESTIONS.length) * 100);

    container.innerHTML = `
        <div class="quiz-wizard-card card" style="max-width: 860px; margin: 0 auto; overflow: hidden; border: 1px solid var(--color-border); box-shadow: var(--shadow-md);">
            <!-- Wizard Header & Progress Bar -->
            <div style="padding: var(--space-6); background-color: var(--color-surface-hover); border-bottom: 1px solid var(--color-border);">
                <div class="flex items-center justify-between gap-4 mb-2">
                    <span class="text-caption font-bold text-accent" style="letter-spacing: 0.05em; text-transform: uppercase;">
                        ${questionObj.title}
                    </span>
                    <span class="badge badge-neutral" style="font-feature-settings: 'tnum';">
                        ${currentStep + 1} of ${QUIZ_QUESTIONS.length} (${progressPct}%)
                    </span>
                </div>
                <div class="quiz-progress-track" style="width: 100%; height: 6px; background-color: var(--color-border); border-radius: var(--radius-full); overflow: hidden;">
                    <div class="quiz-progress-fill" style="width: ${progressPct}%; height: 100%; background-color: var(--color-accent-primary); transition: width 0.3s ease;"></div>
                </div>
            </div>

            <!-- Question Body -->
            <div style="padding: var(--space-8);">
                <h2 class="text-h2" style="color: var(--color-text-primary); margin-bottom: var(--space-2);">
                    ${questionObj.question}
                </h2>
                <p class="text-large text-secondary" style="margin-bottom: var(--space-6);">
                    ${questionObj.subtitle}
                </p>

                <!-- Option Cards Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4" id="quiz-options-grid">
                    ${questionObj.options.map(opt => {
                        const isSelected = currentVal === opt.value;
                        return `
                            <button type="button" class="quiz-option-btn card card-body flex items-start gap-4 text-left ${isSelected ? 'is-selected' : ''}" data-value="${opt.value}" style="cursor: pointer; transition: all var(--transition-fast); border: ${isSelected ? '2px solid var(--color-accent-primary)' : '1px solid var(--color-border)'}; background-color: ${isSelected ? 'var(--color-surface-hover)' : 'var(--color-surface)'}; text-align: left; width: 100%;">
                                <span style="font-size: 24px; line-height: 1;">${opt.icon}</span>
                                <div>
                                    <div class="font-bold text-large" style="color: ${isSelected ? 'var(--color-accent-primary)' : 'var(--color-text-primary)'}; margin-bottom: 2px;">
                                        ${opt.label}
                                    </div>
                                    <div class="text-caption text-secondary">
                                        ${opt.desc}
                                    </div>
                                </div>
                            </button>
                        `;
                    }).join('')}
                </div>
            </div>

            <!-- Wizard Footer Navigation Controls -->
            <div class="flex items-center justify-between" style="padding: var(--space-6); background-color: var(--color-surface-hover); border-top: 1px solid var(--color-border);">
                <div>
                    ${currentStep > 0 ? `
                        <button type="button" class="btn btn-outline btn-sm" id="quiz-prev-btn">
                            ← Previous
                        </button>
                    ` : `
                        <a href="/" class="btn btn-ghost btn-sm text-secondary">
                            Cancel
                        </a>
                    `}
                </div>
                <div class="flex items-center gap-3">
                    <button type="button" class="btn btn-primary" id="quiz-next-btn">
                        ${currentStep === QUIZ_QUESTIONS.length - 1 ? 'Calculate My Matches 🎯' : 'Next Question →'}
                    </button>
                </div>
            </div>
        </div>
    `;

    // Bind event handlers for option selection
    const optionBtns = container.querySelectorAll('.quiz-option-btn');
    optionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const val = btn.dataset.value;
            QuizState.setAnswer(questionObj.id, val);
        });
    });

    // Prev & Next handlers
    container.querySelector('#quiz-prev-btn')?.addEventListener('click', () => {
        QuizState.prevStep();
    });

    container.querySelector('#quiz-next-btn')?.addEventListener('click', () => {
        QuizState.nextStep();
    });
}

function renderResults(container, results) {
    const { topCountry, allCountries, recommendedUniversities, recommendedCourses } = results;

    container.innerHTML = `
        <div style="max-width: 1000px; margin: 0 auto;" class="animate-fade-in">
            <!-- Results Header Banner -->
            <div class="card card-body" style="border-left: 6px solid var(--color-accent-primary); margin-bottom: var(--space-8); background-color: var(--color-surface);">
                <div class="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <span class="badge badge-accent mb-2">Algorithm Evaluation Complete</span>
                        <h1 class="text-h1">Your Top Match: ${topCountry.flag} ${topCountry.name}</h1>
                        <p class="text-large text-secondary" style="margin-top: 4px; max-width: 700px;">
                            Based on your tuition budget, PR requirements, language preference, and field of study, <strong>${topCountry.name}</strong> ranks as your #1 destination.
                        </p>
                    </div>
                    <div class="text-center" style="padding: var(--space-4) var(--space-6); background-color: var(--color-surface-hover); border-radius: var(--radius-lg); border: 1px solid var(--color-border);">
                        <div class="text-h1 font-bold text-accent" style="font-size: 42px; line-height: 1;">${topCountry.matchScore}%</div>
                        <div class="text-caption font-semibold text-secondary" style="margin-top: 4px;">Destination Match Score</div>
                    </div>
                </div>

                <!-- Top Country Key Rationale Highlights -->
                <div style="margin-top: var(--space-6); border-top: 1px solid var(--color-border); padding-top: var(--space-4);">
                    <div class="text-caption font-bold text-secondary uppercase mb-3" style="letter-spacing: 0.05em;">Why ${topCountry.name} fits your profile best:</div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                        ${topCountry.rationale.map(r => `
                            <div class="flex items-start gap-2 text-small text-primary">
                                <span style="color: var(--color-accent-primary);">✓</span>
                                <span>${r}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="flex items-center gap-3" style="margin-top: var(--space-6);">
                    <a href="/country.html?slug=${topCountry.slug}" class="btn btn-primary">
                        Explore ${topCountry.name} Guide →
                    </a>
                    <button type="button" class="btn btn-outline" id="quiz-retake-btn">
                        🔄 Retake Test
                    </button>
                </div>
            </div>

            <!-- All Destination Match Rankings -->
            <div style="margin-bottom: var(--space-10);">
                <h2 class="text-h2" style="margin-bottom: var(--space-4);">All Country Suitability Scores</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    ${allCountries.map((c, idx) => `
                        <div class="card card-body flex items-center justify-between gap-4">
                            <div class="flex items-center gap-3">
                                <span style="font-size: 28px;">${c.flag}</span>
                                <div>
                                    <a href="/country.html?slug=${c.slug}" class="text-large font-bold" style="text-decoration: none; color: var(--color-text-primary);">
                                        ${idx + 1}. ${c.name}
                                    </a>
                                    <div class="text-caption text-secondary">
                                        Tuition: ${c.avgTuitionEur === 0 ? '€0 (Subsidized)' : `~€${c.avgTuitionEur.toLocaleString()}/yr`} · PR Index: ${c.prScore}/10
                                    </div>
                                </div>
                            </div>
                            <div class="text-right">
                                <span class="badge ${c.matchScore >= 80 ? 'badge-accent' : 'badge-neutral'}" style="font-size: 14px; font-weight: var(--font-bold);">
                                    ${c.matchScore}% Match
                                </span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- Recommended Universities Grid -->
            <div style="margin-bottom: var(--space-10);">
                <div class="flex items-center justify-between mb-4">
                    <h2 class="text-h2">Recommended Institutions in ${topCountry.name}</h2>
                    <a href="/universities.html" class="btn btn-ghost btn-sm">View Top 250 →</a>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    ${recommendedUniversities.map(u => `
                        <div class="card card-body flex flex-col justify-between">
                            <div>
                                <span class="badge badge-accent mb-2">QS 2026 #${u.rankDisplay}</span>
                                <h3 class="text-h3 mb-1">
                                    <a href="/university.html?slug=${u.slug}" style="text-decoration: none; color: var(--color-text-primary);">
                                        ${u.name}
                                    </a>
                                </h3>
                                <p class="text-caption text-secondary">Official QS World University Rankings 2026</p>
                            </div>
                            <div style="margin-top: var(--space-4); text-align: right;">
                                <a href="/university.html?slug=${u.slug}" class="btn btn-sm btn-outline">
                                    University Details →
                                </a>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- Recommended Degree Courses Grid -->
            <div style="margin-bottom: var(--space-10);">
                <div class="flex items-center justify-between mb-4">
                    <h2 class="text-h2">Top Recommended Degree Courses</h2>
                    <a href="/courses.html" class="btn btn-ghost btn-sm">Browse All Courses →</a>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    ${recommendedCourses.map(co => `
                        <div class="card card-body flex flex-col justify-between">
                            <div>
                                <span class="badge badge-neutral mb-2">${co.degreeLevel} · ${co.field}</span>
                                <h3 class="text-h3 mb-1">${co.title}</h3>
                                <p class="text-caption text-secondary">${co.universityName} · ${co.countryName}</p>
                            </div>
                            <div class="flex items-center justify-between pt-4" style="border-top: 1px solid var(--color-border); margin-top: var(--space-4);">
                                <span class="font-bold text-accent">${co.tuitionPerYearEur ? `€${co.tuitionPerYearEur.toLocaleString()}/yr` : '€0 Tuition'}</span>
                                <a href="/course.html?id=${co.id}" class="btn btn-sm btn-outline">Course Details</a>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;

    container.querySelector('#quiz-retake-btn')?.addEventListener('click', () => {
        QuizState.reset();
    });
}
