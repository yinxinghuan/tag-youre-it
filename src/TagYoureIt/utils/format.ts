export function relativeTime(ts: number, now = Date.now()): string {
  const diff = Math.max(0, now - ts);
  const s = Math.floor(diff / 1000);
  if (s < 60) return 'just now';
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d`;
  const w = Math.floor(d / 7);
  return `${w}w`;
}

let counter = 0;
export function generateTagId(): string {
  const r = Math.random().toString(36).slice(2, 8);
  counter = (counter + 1) % 0xffff;
  return `${Date.now().toString(36)}-${r}-${counter.toString(36)}`;
}
