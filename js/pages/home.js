/* ==========================================
   HOMEPAGE CONTROLLER (QS 2026 TOP 5 PREVIEW)
   ========================================== */

import { getUniversitiesUpToRank } from '../data/university-data.js';
import { slugifyUniversityName } from '../utils/format.js';

export async function initHomePage() {
    const topMount = document.getElementById('home-top-universities-mount');
    if (!topMount) return;

    const top5 = await getUniversitiesUpToRank(5);

    if (top5.length > 0) {
        topMount.innerHTML = `
            <div class="card" style="overflow: hidden;">
                <div style="padding: var(--space-6); background-color: var(--color-surface-hover); border-bottom: 1px solid var(--color-border);" class="flex items-center justify-between flex-wrap gap-3">
                    <div>
                        <span class="badge badge-accent mb-1">QS World University Rankings 2026</span>
                        <h3 class="text-h3" style="color: var(--color-text-primary);">Top Universities Preview</h3>
                    </div>
                    <a href="/universities.html" class="btn btn-primary btn-sm">
                        View all →
                    </a>
                </div>
                <div class="divide-y divide-border">
                    ${top5.map(item => {
                        const slug = slugifyUniversityName(item.name);
                        return `
                            <div class="flex items-center justify-between" style="padding: var(--space-4) var(--space-6);">
                                <div class="flex items-center gap-4">
                                    <div class="text-h3 font-bold text-accent" style="min-width: 45px; text-align: center;">
                                        #${item.rankDisplay}
                                    </div>
                                    <div>
                                        <a href="/university.html?slug=${slug}" class="text-large font-bold" style="text-decoration: none; color: var(--color-text-primary);">
                                            ${item.name}
                                        </a>
                                        <div class="text-caption text-secondary">
                                            QS World University Rankings 2026
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <a href="/university.html?slug=${slug}" class="btn btn-outline btn-sm">
                                        View Entry
                                    </a>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }
}
