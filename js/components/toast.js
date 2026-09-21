/* ==========================================
   TOAST NOTIFICATION COMPONENT
   ========================================== */

export function showToast(message, type = 'info', duration = 3000) {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.style.cssText = 'position: fixed; bottom: 24px; right: 24px; z-index: 2000; display: flex; flex-direction: column; gap: 8px;';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast card card-body badge-${type}`;
    toast.style.cssText = `
        padding: 12px 20px;
        box-shadow: var(--shadow-lg);
        border: 1px solid var(--color-border);
        background-color: var(--color-surface);
        color: var(--color-text-primary);
        font-weight: var(--font-semibold);
        border-left: 4px solid ${type === 'error' ? 'var(--color-danger)' : type === 'success' ? 'var(--color-success)' : 'var(--color-accent-primary)'};
        animation: fadeIn 0.2s ease-out;
    `;

    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.2s ease';
        setTimeout(() => toast.remove(), 200);
    }, duration);
}
