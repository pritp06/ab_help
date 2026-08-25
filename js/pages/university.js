/* ==========================================
   UNIVERSITY DETAIL PAGE CONTROLLER (QS 2026)
   ========================================== */

import { getUniversityBySlug } from '../data/university-data.js';
import { UNIVERSITIES } from '../data/universities-data.js';

export async function initUniversityDetailPage() {
    const mount = document.getElementById('university-detail-mount');
    if (!mount) return;

    const params = new URLSearchParams(window.location.search);
    const slug = params.get('slug') || '';

    const crumbEl = document.getElementById('uni-name-crumb');

    if (!slug) {
        renderNotFound(mount, crumbEl);
        return;
    }

    // Lookup in QS 2026 Top 250 dataset
    const qsRecord = await getUniversityBySlug(slug);

    if (!qsRecord) {
        renderNotFound(mount, crumbEl, slug);
        return;
    }

    if (crumbEl) crumbEl.textContent = qsRecord.name;

    // Check if additional rich metadata exists in existing dataset
    const richData = UNIVERSITIES.find(u => u.slug === slug || u.name.toLowerCase() === qsRecord.name.toLowerCase());

    const isTied = qsRecord.rankDisplay && qsRecord.rankDisplay.startsWith('=');

    mount.innerHTML = `
        <!-- Main Card Banner -->
        <div class="card" style="margin-bottom: var(--space-8);">
            <div class="flex justify-between items-start flex-wrap gap-4" style="margin-bottom: var(--space-4);">
                <div>
                    <h1 class="text-h1" style="color: var(--color-text-primary);">${qsRecord.name}</h1>
                    ${richData ? `<p class="text-large text-secondary" style="margin-top: 4px;">${richData.city}, ${richData.countryName}</p>` : ''}
                </div>
                <div class="flex items-center gap-3">
                    <span class="badge badge-accent" style="font-size: 14px; padding: 6px 12px;">
                        QS World Ranking 2026: #${qsRecord.rankDisplay} ${isTied ? '(Tied)' : ''}
                    </span>
                </div>
            </div>

            <div style="padding: var(--space-4); background-color: var(--color-surface-hover); border-radius: var(--radius-md); border-left: 4px solid var(--color-accent-primary); margin-bottom: var(--space-6);">
                <div class="text-caption text-secondary" style="font-weight: var(--font-semibold); text-transform: uppercase; letter-spacing: 0.05em;">Official Ranking Source</div>
                <div class="text-large font-bold" style="color: var(--color-text-primary); margin-top: 2px;">
                    QS World University Rankings 2026
                </div>
                <div class="text-caption text-secondary" style="margin-top: 2px;">
                    Rank Position: #${qsRecord.rankDisplay}
                </div>
            </div>

            ${richData && richData.overview ? `
                <p class="text-body text-secondary" style="margin-bottom: var(--space-6); max-width: 800px;">
                    ${richData.overview}
                </p>
            ` : ''}

            ${richData && richData.website ? `
                <div style="text-align: right;">
                    <a href="${richData.website}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm">
                        Visit Official Website ↗
                    </a>
                </div>
            ` : ''}
        </div>

        <!-- Placeholder Notice for Unavailable Sections -->
        <div class="card card-body text-center text-secondary" style="padding: var(--space-8); background-color: var(--color-surface-hover);">
            <div class="badge badge-neutral mb-2">Notice</div>
            <p class="text-large font-semibold" style="color: var(--color-text-primary); margin-bottom: var(--space-2);">
                University details are being added.
            </p>
            <p class="text-caption" style="max-width: 500px; margin: 0 auto;">
                Course modules, entry standards, tuition breakdowns, and application deadlines for ${qsRecord.name} are currently being compiled.
            </p>
        </div>
    `;
}

function renderNotFound(mount, crumbEl, slug = '') {
    if (crumbEl) crumbEl.textContent = 'Not Found';

    mount.innerHTML = `
        <div class="card card-body text-center" style="padding: var(--space-12);">
            <h2 class="text-h2" style="margin-bottom: var(--space-2);">University Not Found</h2>
            <p class="text-large text-secondary" style="margin-bottom: var(--space-6); max-width: 500px; margin-left: auto; margin-right: auto;">
                The university you're looking for could not be found in the QS World University Rankings 2026 dataset.
            </p>
            <a href="universities.html" class="btn btn-primary">
                ← Back to Top Universities
            </a>
        </div>
    `;
}
