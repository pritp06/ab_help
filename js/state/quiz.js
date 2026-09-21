/* ==========================================
   QUIZ STATE MANAGER (DESTINATION MATCHER)
   ========================================== */

import { evaluateQuizAnswers } from '../data/recommender-engine.js';

const STORAGE_KEY = 'study_abroad_quiz_state';

const DEFAULT_STATE = {
    currentStep: 0,
    answers: {
        field: 'stem',
        budget: 'free',
        prPriority: 'high',
        languagePref: 'english_only',
        degreeLevel: 'masters',
        climate: 'moderate',
        cgpa: 'good',
        experience: 'fresh',
        testStatus: 'no_gre',
        careerGoal: 'pr_settlement'
    },
    results: null,
    isCompleted: false
};

export const QuizState = {
    state: { ...DEFAULT_STATE },
    listeners: [],

    init() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                this.state = { ...DEFAULT_STATE, ...parsed };
            }
        } catch (e) {
            this.state = { ...DEFAULT_STATE };
        }
    },

    save() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
        } catch (e) {}
        this.notify();
    },

    setAnswer(key, value) {
        this.state.answers[key] = value;
        this.save();
    },

    setStep(stepIndex) {
        this.state.currentStep = Math.max(0, Math.min(9, stepIndex));
        this.save();
    },

    nextStep() {
        if (this.state.currentStep < 9) {
            this.state.currentStep++;
            this.save();
        } else {
            this.calculateResults();
        }
    },

    prevStep() {
        if (this.state.currentStep > 0) {
            this.state.currentStep--;
            this.save();
        }
    },

    calculateResults() {
        const results = evaluateQuizAnswers(this.state.answers);
        this.state.results = results;
        this.state.isCompleted = true;
        this.save();
        return results;
    },

    reset() {
        this.state = { ...DEFAULT_STATE, answers: { ...DEFAULT_STATE.answers } };
        localStorage.removeItem(STORAGE_KEY);
        this.notify();
    },

    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    },

    notify() {
        this.listeners.forEach(l => l(this.state));
    }
};
