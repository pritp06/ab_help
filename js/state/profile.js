/* ==========================================
   STUDENT PROFILE STATE MANAGER (BACKEND INTEGRATED)
   ========================================== */

import { getUserProfile, updateUserProfile } from '../api/auth.js';
import { AuthState } from './auth.js';

let profileData = null;

const DEFAULT_PROFILE = {
    degreeType: "Bachelor's",
    degreeField: "Computer Science",
    cgpa: 7.4,
    cgpaMax: 10.0,
    ieltsScore: 7.0,
    toeflScore: 95,
    hasGre: false,
    greQuantScore: 162,
    greVerbalScore: 154,
    annualBudget: 15000,
    preferredCountries: ['germany', 'united-kingdom', 'netherlands'],
    isOnboarded: true
};

export const ProfileState = {
    async loadProfile() {
        if (!AuthState.isLoggedIn()) {
            profileData = DEFAULT_PROFILE;
            return profileData;
        }

        try {
            const data = await getUserProfile();
            profileData = {
                ...DEFAULT_PROFILE,
                firstName: data.first_name,
                lastName: data.last_name,
                degreeType: data.current_degree || DEFAULT_PROFILE.degreeType,
                degreeField: data.field || DEFAULT_PROFILE.degreeField,
                cgpa: data.gpa ? parseFloat(data.gpa) : DEFAULT_PROFILE.cgpa,
                cgpaMax: data.gpa_scale ? parseFloat(data.gpa_scale) : DEFAULT_PROFILE.cgpaMax,
                annualBudget: data.budget_amount || DEFAULT_PROFILE.annualBudget,
                isOnboarded: true
            };
        } catch (e) {
            profileData = DEFAULT_PROFILE;
        }
        return profileData;
    },

    getProfile() {
        return profileData || DEFAULT_PROFILE;
    },

    async saveProfile(data) {
        if (AuthState.isLoggedIn()) {
            const payload = {
                first_name: data.firstName,
                last_name: data.lastName,
                current_degree: data.degreeType,
                field: data.degreeField,
                gpa: data.cgpa,
                gpa_scale: data.cgpaMax || 10.0,
                budget_amount: data.annualBudget,
                budget_currency: 'EUR'
            };
            const updatedBackend = await updateUserProfile(payload);
            profileData = {
                ...DEFAULT_PROFILE,
                firstName: updatedBackend.first_name,
                lastName: updatedBackend.last_name,
                degreeType: updatedBackend.current_degree,
                degreeField: updatedBackend.field,
                cgpa: updatedBackend.gpa ? parseFloat(updatedBackend.gpa) : 7.4,
                annualBudget: updatedBackend.budget_amount,
                isOnboarded: true
            };
        } else {
            profileData = { ...DEFAULT_PROFILE, ...data, isOnboarded: true };
        }

        window.dispatchEvent(new CustomEvent('profileUpdated', { detail: { profile: profileData } }));
        return profileData;
    }
};
