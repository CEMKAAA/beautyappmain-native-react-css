/**
 * Returns today's date as a YYYY-MM-DD string using the browser's local timezone.
 * Use this instead of `new Date().toISOString().split('T')[0]` to avoid UTC offset issues.
 * Example: At 01:00 AM on Feb 17 (UTC+3), toISOString gives "2026-02-16" (wrong),
 *          but localDateStr() correctly gives "2026-02-17".
 */
export function localDateStr(date) {
    const d = date || new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
