/* ==========================================
   APPLICATION PLANNER PAGE CONTROLLER
   ========================================== */

import { PlannerState } from '../state/planner.js';
import { showToast } from '../components/toast.js';

export function initPlannerPage() {
    const board = document.getElementById('planner-board-mount');
    if (!board) return;

    const render = () => {
        const plans = PlannerState.getAll();

        const stages = ['Shortlisted', 'Preparing', 'Applied', 'Accepted'];

        board.innerHTML = stages.map(stage => {
            const stagePlans = plans.filter(p => p.stage === stage);
            return `
                <div class="planner-column">
                    <div class="planner-column-header">
                        <span class="planner-column-title">${stage}</span>
                        <span class="badge badge-neutral">${stagePlans.length}</span>
                    </div>

                    <div class="flex flex-col gap-4">
                        ${stagePlans.length === 0 ? `
                            <div class="text-small text-muted text-center" style="padding: var(--space-6) 0;">
                                No applications in this stage
                            </div>
                        ` : stagePlans.map(plan => `
                            <div class="planner-item-card">
                                <div class="flex items-center justify-between" style="margin-bottom: var(--space-2);">
                                    <span class="badge badge-info" style="font-size: 0.75rem;">Deadline: ${plan.deadline}</span>
                                    <select class="select" data-plan-stage="${plan.id}" style="height: 30px; font-size: 0.75rem; width: auto; padding: 0 8px;">
                                        ${stages.map(s => `<option value="${s}" ${s === plan.stage ? 'selected' : ''}>${s}</option>`).join('')}
                                    </select>
                                </div>

                                <h3 class="text-h4" style="margin-bottom: 2px;">
                                    <a href="/course.html?slug=${plan.courseSlug}">${plan.courseTitle}</a>
                                </h3>
                                <div class="text-small text-secondary" style="margin-bottom: var(--space-3);">${plan.universityName}</div>

                                <div style="border-top: 1px solid var(--border-subtle); padding-top: var(--space-3);">
                                    <div class="text-meta" style="font-weight:600; margin-bottom: 6px;">Document Checklist</div>
                                    <div class="flex flex-col gap-1">
                                        ${plan.checklist.map(item => `
                                            <label class="checklist-item ${item.completed ? 'is-completed' : ''}">
                                                <input type="checkbox" data-plan-id="${plan.id}" data-check-id="${item.id}" ${item.completed ? 'checked' : ''} />
                                                <span>${item.label}</span>
                                            </label>
                                        `).join('')}
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }).join('');

        // Listeners for stage updates
        board.querySelectorAll('[data-plan-stage]').forEach(select => {
            select.addEventListener('change', (e) => {
                const planId = e.target.getAttribute('data-plan-stage');
                const newStage = e.target.value;
                PlannerState.updateStage(planId, newStage);
                showToast(`Moved application to "${newStage}"`, 'info');
                render();
            });
        });

        // Listeners for checklist toggles
        board.querySelectorAll('input[data-check-id]').forEach(chk => {
            chk.addEventListener('change', (e) => {
                const planId = e.target.getAttribute('data-plan-id');
                const checkId = e.target.getAttribute('data-check-id');
                PlannerState.toggleChecklist(planId, checkId);
                render();
            });
        });
    };

    render();
}
