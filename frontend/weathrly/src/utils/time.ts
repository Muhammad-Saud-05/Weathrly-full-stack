// "just now", "5m ago", "3h ago", "2d ago"
export function timeAgo(iso: string, now: number = Date.now()): string {
  // the API sends UTC timestamps without a zone suffix
  const parsed = Date.parse(/(Z|[+-]\d{2}:?\d{2})$/.test(iso) ? iso : `${iso}Z`);
  if (Number.isNaN(parsed)) return "";

  const seconds = Math.max(0, Math.round((now - parsed) / 1000));
  if (seconds < 60) return "just now";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  return `${Math.floor(hours / 24)}d ago`;
}
