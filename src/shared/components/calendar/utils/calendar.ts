import type { MarkerTone } from '@components/calendar/types/calendar';

export const WEEK_LABELS: ReadonlyArray<string> = ['일', '월', '화', '수', '목', '금', '토'];

export function pad2(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

export function toKey(d: Date): string {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

export function addMonths(base: Date, delta: number): Date {
  const next = new Date(base.getFullYear(), base.getMonth() + delta, 1);
  const last = new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate();
  next.setDate(Math.min(base.getDate(), last));
  return next;
}

export function startOfCalendarGrid(d: Date): Date {
  const first = new Date(d.getFullYear(), d.getMonth(), 1);
  const start = new Date(first);
  start.setDate(first.getDate() - first.getDay());
  return new Date(start.getFullYear(), start.getMonth(), start.getDate());
}

export function buildGrid(view: Date): Date[] {
  const start = startOfCalendarGrid(view);
  const arr: Date[] = [];
  for (let i = 0; i < 42; i += 1) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    arr.push(d);
  }
  return arr;
}

export function inRange(d: Date, min?: Date, max?: Date): boolean {
  if (min && d < new Date(min.getFullYear(), min.getMonth(), min.getDate())) return false;
  if (max && d > new Date(max.getFullYear(), max.getMonth(), max.getDate())) return false;
  return true;
}

export function sameDate(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function toneBg(tone?: MarkerTone): string {
  switch (tone) {
    case 'warning':
      return 'bg-system-warning';
    case 'success':
      return 'bg-system-success';
    case 'error':
      return 'bg-system-error';
    case 'primary':
      return 'bg-primary-700';
    default:
      return 'bg-system-info';
  }
}
