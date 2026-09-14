const currencyFmt = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
});

const dateFmt = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
});

export function formatCurrency(amount: number): string {
  return currencyFmt.format(amount);
}

export function formatDate(isoDate: string): string {
  return dateFmt.format(new Date(isoDate + 'T00:00:00'));
}

export function formatDaysHeld(days: number): string {
  if (days < 1) return 'Today';
  if (days === 1) return '1 day';
  if (days < 30) return `${days} days`;
  const months = Math.floor(days / 30);
  if (months < 12) return months === 1 ? '1 month' : `${months} months`;
  const years = Math.floor(days / 365);
  const remaining = Math.floor((days % 365) / 30);
  if (remaining === 0) return years === 1 ? '1 year' : `${years} years`;
  return `${years}y ${remaining}m`;
}
