/* ==========================================
   FORMATTING UTILITIES
   ========================================== */

export function formatCurrency(amount, currency = 'EUR') {
    if (amount === 0) return '€0 (Tuition Free)';
    if (!amount) return 'N/A';

    const symbols = { EUR: '€', GBP: '£', USD: '$', CAD: 'CA$', AUD: 'AU$' };
    const symbol = symbols[currency] || `${currency} `;
    return `${symbol}${amount.toLocaleString()}`;
}

export function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function truncateText(text, maxLength = 120) {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '…';
}
