/* ==========================================
   FILTER SIDEBAR & MOBILE BOTTOM SHEET COMPONENT
   ========================================== */

export function renderFilterSidebar({ containerId, onFilterChange, initialFilters = {} }) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <!-- Desktop Filter Sidebar -->
        <div class="card desktop-only" style="padding: var(--space-6);">
            <div class="flex items-center justify-between" style="margin-bottom: var(--space-6);">
                <h3 class="text-h4">Filters</h3>
                <button class="btn btn-ghost btn-sm" id="filter-reset-btn">Reset</button>
            </div>

            <div class="flex flex-col gap-5">
                <div class="form-group">
                    <label class="form-label">Country</label>
                    <select class="select" id="filter-country">
                        <option value="all">All Countries</option>
                        <option value="germany">Germany</option>
                        <option value="united-kingdom">United Kingdom</option>
                        <option value="netherlands">Netherlands</option>
                        <option value="australia">Australia</option>
                        <option value="italy">Italy</option>
                    </select>
                </div>

                <div class="form-group">
                    <label class="form-label">Field of Study</label>
                    <select class="select" id="filter-field">
                        <option value="all">All Fields</option>
                        <option value="Computer Science">Computer Science</option>
                        <option value="Data Science">Data Science</option>
                        <option value="Engineering">Engineering</option>
                    </select>
                </div>

                <div class="form-group">
                    <label class="form-label">Degree Level</label>
                    <select class="select" id="filter-degree">
                        <option value="all">All Degrees</option>
                        <option value="Master's">Master's Degree</option>
                        <option value="Bachelor's">Bachelor's Degree</option>
                    </select>
                </div>

                <div class="form-group">
                    <label class="form-label">Teaching Language</label>
                    <select class="select" id="filter-language">
                        <option value="all">All Languages</option>
                        <option value="English">English</option>
                        <option value="German">German</option>
                    </select>
                </div>
            </div>
        </div>

        <!-- Mobile Filter Button & Bottom Sheet -->
        <div class="mobile-only" style="margin-bottom: var(--space-4);">
            <button class="btn btn-secondary btn-full" id="mobile-filter-trigger">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/></svg>
                <span>Filter Results</span>
            </button>

            <div class="sheet-backdrop" id="mobile-filter-backdrop"></div>
            <div class="sheet-panel" id="mobile-filter-panel">
                <div class="sheet-handle"></div>
                <div class="flex items-center justify-between" style="margin-bottom: var(--space-6);">
                    <h3 class="text-h3">Filters</h3>
                    <button class="btn btn-ghost btn-sm" id="mobile-filter-close">Done</button>
                </div>
                <div class="flex flex-col gap-4">
                    <div class="form-group">
                        <label class="form-label">Country</label>
                        <select class="select" id="m-filter-country">
                            <option value="all">All Countries</option>
                            <option value="germany">Germany</option>
                            <option value="united-kingdom">United Kingdom</option>
                            <option value="netherlands">Netherlands</option>
                            <option value="australia">Australia</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Field of Study</label>
                        <select class="select" id="m-filter-field">
                            <option value="all">All Fields</option>
                            <option value="Computer Science">Computer Science</option>
                            <option value="Data Science">Data Science</option>
                            <option value="Engineering">Engineering</option>
                        </select>
                    </div>

                    <button class="btn btn-primary btn-full" id="mobile-filter-apply" style="margin-top: var(--space-4);">Apply Filters</button>
                </div>
            </div>
        </div>
    `;

    // Listeners
    const countrySel = document.getElementById('filter-country');
    const fieldSel = document.getElementById('filter-field');
    const degreeSel = document.getElementById('filter-degree');
    const langSel = document.getElementById('filter-language');

    const getFilterValues = () => ({
        countrySlug: countrySel?.value || 'all',
        field: fieldSel?.value || 'all',
        degreeType: degreeSel?.value || 'all',
        language: langSel?.value || 'all'
    });

    const triggerChange = () => {
        if (onFilterChange) onFilterChange(getFilterValues());
    };

    countrySel?.addEventListener('change', triggerChange);
    fieldSel?.addEventListener('change', triggerChange);
    degreeSel?.addEventListener('change', triggerChange);
    langSel?.addEventListener('change', triggerChange);

    document.getElementById('filter-reset-btn')?.addEventListener('click', () => {
        if (countrySel) countrySel.value = 'all';
        if (fieldSel) fieldSel.value = 'all';
        if (degreeSel) degreeSel.value = 'all';
        if (langSel) langSel.value = 'all';
        triggerChange();
    });

    // Mobile filter handlers
    const mobileBtn = document.getElementById('mobile-filter-trigger');
    const mBackdrop = document.getElementById('mobile-filter-backdrop');
    const mPanel = document.getElementById('mobile-filter-panel');

    mobileBtn?.addEventListener('click', () => {
        mBackdrop?.classList.add('is-open');
        mPanel?.classList.add('is-open');
    });

    const closeMobileFilter = () => {
        mBackdrop?.classList.remove('is-open');
        mPanel?.classList.remove('is-open');
    };

    mBackdrop?.addEventListener('click', closeMobileFilter);
    document.getElementById('mobile-filter-close')?.addEventListener('click', closeMobileFilter);
    document.getElementById('mobile-filter-apply')?.addEventListener('click', () => {
        const mCountry = document.getElementById('m-filter-country')?.value;
        const mField = document.getElementById('m-filter-field')?.value;
        if (countrySel && mCountry) countrySel.value = mCountry;
        if (fieldSel && mField) fieldSel.value = mField;
        closeMobileFilter();
        triggerChange();
    });
}
