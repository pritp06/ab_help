/* ==========================================
   REUSABLE RANKING ITEM COMPONENT
   ========================================== */

import { slugifyUniversityName } from '../utils/format.js';

export function createRankingItemHTML(university) {
    const slug = slugifyUniversityName(university.name);
    const isTied = university.rankDisplay && university.rankDisplay.startsWith('=');
    const displayRank = university.rankDisplay || (university.rank < 10 ? `0${university.rank}` : `${university.rank}`);

    return `
        <div class="ranking-item-row grid grid-cols-12 gap-4 items-center" style="padding: var(--space-4) var(--space-6); transition: background-color var(--transition-fast); border-bottom: 1px solid var(--color-border);">
            <!-- Rank Number -->
            <div class="col-span-3 md:col-span-2 text-center flex flex-col items-center justify-center">
                <span class="text-h3" style="font-weight: var(--font-bold); color: ${isTied ? 'var(--color-accent-primary)' : 'var(--color-text-primary)'}; font-feature-settings: 'tnum';">
                    ${displayRank}
                </span>
                ${isTied ? `<span class="badge badge-accent" style="font-size: 10px; padding: 2px 6px; margin-top: 2px;">Tied</span>` : ''}
            </div>

            <!-- University Name -->
            <div class="col-span-9 md:col-span-8">
                <a href="/university.html?slug=${slug}" class="text-large font-bold ranking-uni-link" style="color: var(--color-text-primary); text-decoration: none; display: block; line-height: 1.3;">
                    ${university.name}
                </a>
                <div class="text-caption text-secondary" style="margin-top: 4px;">
                    QS World University Rankings 2026
                </div>
            </div>

            <!-- Action Button -->
            <div class="hidden md:block md:col-span-2 text-right">
                <a href="/university.html?slug=${slug}" class="btn btn-outline btn-sm">
                    View Entry →
                </a>
            </div>
        </div>
    `;
}
