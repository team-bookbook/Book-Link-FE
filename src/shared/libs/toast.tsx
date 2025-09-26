import { useEffect, useSyncExternalStore, useId } from 'react';
import { createRoot } from 'react-dom/client';
import { cn } from '@libs/cn';
import Icon from '@components/icon';

type ToastKind = 'info' | 'success' | 'error';

type ToastItem = {
  id: string;
  kind: ToastKind;
  message: string;
  durationMs: number;
};

const store = (() => {
  let list: ToastItem[] = [];
  const listeners = new Set<() => void>();
  const timers: Record<string, number> = {};

  const emit = () => listeners.forEach((fn) => fn());

  const add = (item: ToastItem) => {
    list = [...list, item];
    emit();
    const tid = window.setTimeout(() => remove(item.id), item.durationMs);
    timers[item.id] = tid;
  };

  const remove = (id: string) => {
    list = list.filter((t) => t.id !== id);
    const tid = timers[id];
    if (typeof tid === 'number') {
      window.clearTimeout(tid);
      delete timers[id];
    }
    emit();
  };

  const subscribe = (fn: () => void) => {
    listeners.add(fn);
    return () => listeners.delete(fn);
  };

  const getSnapshot = () => list;

  return { add, remove, subscribe, getSnapshot };
})();

let mounted = false;

function ensureHost() {
  if (mounted) return;
  const rootEl =
    document.getElementById('toast-portal') ??
    (() => {
      const el = document.createElement('div');
      el.id = 'toast-portal';
      document.body.appendChild(el);
      return el;
    })();
  createRoot(rootEl).render(<ToastViewport />);
  mounted = true;
}

function makeId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  const rnd = Math.floor(Math.random() * 1_000_000).toString(36);
  return `t_${Date.now()}_${rnd}`;
}

const DEFAULT_MS = 3000;

function show(kind: ToastKind, message: string, durationMs?: number) {
  ensureHost();
  const id = makeId();
  store.add({ id, kind, message, durationMs: durationMs ?? DEFAULT_MS });
  return id;
}

export const toast = {
  info: (msg: string, ms?: number) => show('info', msg, ms),
  success: (msg: string, ms?: number) => show('success', msg, ms),
  error: (msg: string, ms?: number) => show('error', msg, ms),
};

function useToasts(): ToastItem[] {
  return useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);
}

function ToastViewport() {
  const toasts = useToasts();
  const liveId = useId();
  useEffect(() => {}, []);
  return (
    <div
      id={liveId}
      aria-live='polite'
      aria-atomic='false'
      className={cn(
        'pointer-events-none fixed inset-x-0 bottom-[2rem] z-[var(--z-modal)]',
        'flex-col-center gap-[1.2rem]'
      )}
    >
      {toasts.map((t) => (
        <ToastCard key={t.id} toast={t} />
      ))}
    </div>
  );
}

function ToastCard({ toast: t }: { toast: ToastItem }) {
  const palette =
    t.kind === 'info'
      ? { icon: 'toast-info', text: 'text-gray-white' }
      : t.kind === 'success'
        ? { icon: 'toast-success', text: 'text-gray-white' }
        : { icon: 'toast-error', text: 'text-gray-white' };

  return (
    <div className='pointer-events-auto w-[min(90vw,40rem)]' role='status' aria-atomic='true'>
      <div
        className={cn(
          'flex items-center gap-[1rem]',
          'px-[2rem] py-[1.4rem]',
          'bg-opacity-dark',
          'rounded-[6px]',
          'backdrop-blur-[0.2rem]',
          'shadow-md',
          palette.text
        )}
      >
        <Icon name={palette.icon} size={2.0} ariaHidden />
        <p className='body5 flex-1'>{t.message}</p>
      </div>
    </div>
  );
}
