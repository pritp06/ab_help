/* ==========================================
   STUDENT PROFILE & ONBOARDING CONTROLLER (REAL API)
   ========================================== */

import { ProfileState } from '../state/profile.js';
import { AuthState } from '../state/auth.js';
import { showToast } from '../components/toast.js';

export async function initProfilePage() {
    const form = document.getElementById('profile-form');
    if (!form) return;

    // Load profile from backend if logged in
    const profile = await ProfileState.loadProfile();

    // Populate initial form fields
    const degreeSel = document.getElementById('prof-degree');
    const fieldInput = document.getElementById('prof-field');
    const cgpaInput = document.getElementById('prof-cgpa');
    const ieltsInput = document.getElementById('prof-ielts');
    const toeflInput = document.getElementById('prof-toefl');
    const greCheck = document.getElementById('prof-has-gre');
    const greQuantInput = document.getElementById('prof-gre-quant');
    const budgetInput = document.getElementById('prof-budget');

    if (degreeSel) degreeSel.value = profile.degreeType || "Bachelor's";
    if (fieldInput) fieldInput.value = profile.degreeField || "Computer Science";
    if (cgpaInput) cgpaInput.value = profile.cgpa || 7.4;
    if (ieltsInput) ieltsInput.value = profile.ieltsScore || 7.0;
    if (toeflInput) toeflInput.value = profile.toeflScore || 95;
    if (greCheck) greCheck.checked = profile.hasGre || false;
    if (greQuantInput) greQuantInput.value = profile.greQuantScore || 162;
    if (budgetInput) budgetInput.value = profile.annualBudget || 15000;

    const submitBtn = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        submitBtn.disabled = true;
        submitBtn.textContent = 'Saving to Database...';

        const updatedData = {
            degreeType: degreeSel?.value,
            degreeField: fieldInput?.value,
            cgpa: parseFloat(cgpaInput?.value || 0),
            ieltsScore: parseFloat(ieltsInput?.value || 0),
            toeflScore: parseInt(toeflInput?.value || 0, 10),
            hasGre: greCheck?.checked || false,
            greQuantScore: parseInt(greQuantInput?.value || 0, 10),
            annualBudget: parseInt(budgetInput?.value || 0, 10)
        };

        try {
            await ProfileState.saveProfile(updatedData);
            showToast('Academic profile updated and saved!', 'success');
        } catch (err) {
            showToast(err.message || 'Failed to save profile.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Save & Update Eligibility Assessments';
        }
    });
}
