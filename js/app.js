/* ==========================================
   GLOBAL BOOTSTRAP & APPLICATION ENTRY POINT
   ========================================== */

import { ThemeState } from './state/theme.js';
import { AuthState } from './state/auth.js';
import { renderNavbar } from './components/navbar.js';
import { initGlobalSearch } from './components/search.js';
import { initCompareTray } from './components/compare-tray.js';

// Page Controller Imports
import { initHomePage } from './pages/home.js';
import { initCountriesPage } from './pages/countries.js';
import { initCountryDetailPage } from './pages/country.js';
import { initUniversitiesPage } from './pages/universities.js';
import { initUniversityDetailPage } from './pages/university.js';
import { initCoursesPage } from './pages/courses.js';
import { initCourseDetailPage } from './pages/course.js';
import { initComparePage } from './pages/compare.js';
import { initShortlistPage } from './pages/shortlist.js';
import { initProfilePage } from './pages/profile.js';
import { initPlannerPage } from './pages/planner.js';
import { initAuthPage } from './pages/auth.js';

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Initialize Theme (Light / Dark)
    ThemeState.init();

    // 2. Load Auth Session from Backend (/api/v1/auth/me)
    await AuthState.loadCurrentUser();

    // 3. Render Global Navbar
    renderNavbar();

    // 4. Initialize Cmd+K Search Overlay
    initGlobalSearch();

    // 5. Initialize Compare Tray
    initCompareTray();

    // 6. Page-specific controller bootstrap based on data-page attribute
    const page = document.body.dataset.page;

    switch (page) {
        case 'home':
            initHomePage();
            break;
        case 'countries':
            initCountriesPage();
            break;
        case 'country-detail':
            initCountryDetailPage();
            break;
        case 'universities':
            initUniversitiesPage();
            break;
        case 'university-detail':
            initUniversityDetailPage();
            break;
        case 'courses':
            initCoursesPage();
            break;
        case 'course-detail':
            initCourseDetailPage();
            break;
        case 'compare':
            initComparePage();
            break;
        case 'shortlist':
            initShortlistPage();
            break;
        case 'profile':
            initProfilePage();
            break;
        case 'planner':
            initPlannerPage();
            break;
        case 'auth':
            initAuthPage();
            break;
        default:
            break;
    }
});
