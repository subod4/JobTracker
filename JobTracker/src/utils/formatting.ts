/**
 * Shared formatting utilities for the application
 */

/**
 * Format a date string to a readable format
 * @param dateStr - Date string to format
 * @returns Formatted date string
 */
export function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr + (dateStr.includes('T') ? '' : 'T12:00:00'));
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

/**
 * Get Tailwind CSS classes for job type badge styling
 * @param type - Job type (e.g., 'Internship', 'Part-time', etc.)
 * @returns CSS class string for badge styling
 */
export function getJobTypeBadgeClasses(type: string): string {
  switch (type) {
    case 'Internship':
      return 'bg-violet-50 text-violet-700 border-violet-200';
    case 'Part-time':
      return 'bg-sky-50 text-sky-700 border-sky-200';
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200';
  }
}
