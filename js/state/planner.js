/* ==========================================
   APPLICATION PLANNER STATE MANAGER
   ========================================== */

import { Storage } from '../utils/storage.js';

const PLANNER_KEY = 'study_abroad_planner';

const DEFAULT_PLANNER = [
    {
        id: 'plan-1',
        courseSlug: 'msc-computer-science-tum',
        courseTitle: 'MSc Computer Science',
        universityName: 'Technical University of Munich',
        stage: 'Preparing',
        deadline: '2025-05-31',
        checklist: [
            { id: 'c1', label: 'Passport Copy', completed: true },
            { id: 'c2', label: 'Bachelor Transcript', completed: true },
            { id: 'c3', label: 'Motivation Letter (SOP)', completed: false },
            { id: 'c4', label: 'Academic CV', completed: true },
            { id: 'c5', label: 'IELTS Score Report', completed: false }
        ]
    },
    {
        id: 'plan-2',
        courseSlug: 'msc-robotic-systems-rwth',
        courseTitle: 'MSc Robotic Systems Engineering',
        universityName: 'RWTH Aachen University',
        stage: 'Shortlisted',
        deadline: '2025-03-01',
        checklist: [
            { id: 'c1', label: 'Passport Copy', completed: true },
            { id: 'c2', label: 'GRE Score Report', completed: false },
            { id: 'c3', label: 'Letter of Recommendation 1', completed: false }
        ]
    }
];

export const PlannerState = {
    getAll() {
        return Storage.get(PLANNER_KEY, DEFAULT_PLANNER);
    },

    updateStage(planId, newStage) {
        const list = this.getAll();
        const item = list.find(p => p.id === planId);
        if (item) {
            item.stage = newStage;
            Storage.set(PLANNER_KEY, list);
            window.dispatchEvent(new CustomEvent('plannerUpdated', { detail: { list } }));
        }
    },

    toggleChecklist(planId, checklistId) {
        const list = this.getAll();
        const item = list.find(p => p.id === planId);
        if (item) {
            const check = item.checklist.find(c => c.id === checklistId);
            if (check) {
                check.completed = !check.completed;
                Storage.set(PLANNER_KEY, list);
                window.dispatchEvent(new CustomEvent('plannerUpdated', { detail: { list } }));
            }
        }
    },

    addCourseToPlanner(course) {
        const list = this.getAll();
        if (list.some(p => p.courseSlug === course.slug)) {
            return false; // Already in planner
        }

        const newPlan = {
            id: `plan-${Date.now()}`,
            courseSlug: course.slug,
            courseTitle: course.title,
            universityName: course.universityName,
            stage: 'Shortlisted',
            deadline: course.deadlineDate || '2025-05-31',
            checklist: (course.documents || ['Passport', 'Transcripts', 'SOP']).map((doc, idx) => ({
                id: `c-${idx}`,
                label: doc,
                completed: false
            }))
        };

        list.push(newPlan);
        Storage.set(PLANNER_KEY, list);
        window.dispatchEvent(new CustomEvent('plannerUpdated', { detail: { list } }));
        return true;
    }
};
