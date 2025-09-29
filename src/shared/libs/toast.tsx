import { useEffect, useSyncExternalStore, useId } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { cn } from '@libs/cn';
import Icon from '@components/icon';

type ToastKind = 'info' | 'success' | 'error';

type ToastItem = {
  id: string;
  kind: ToastKind;
  message: string;
  durationMs: number;
};

type Snapshot = {
  list: ReadonlyArray<ToastItem>;
  bottomRem: number;
};

const DEFAULT_MS = 3000;

const store = (() => {
  let list: ToastItem[] = [];
  let bottomRem = 2; // 기본 2rem
  let snapshot: Snapshot = { list, bottomRem };
  const listeners = new Set<() => void>();
  const timers: Record<string, number> = {};

  const updateSnapshot = () => {
    snapshot = { list, bottomRem };
  };

  const emit = () => listeners.forEach((fn) => fn());

  const add = (item: ToastItem) => {
    list = [...list, item];
    updateSnapshot();
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
    updateSnapshot();
    emit();
  };

  const setBottom = (rem?: number) => {
    if (typeof rem === 'number' && Number.isFinite(rem) && rem >= 0) {
      bottomRem = rem;
      updateSnapshot();
      emit();
    }
  };

  const subscribe = (fn: () => void) => {
    listeners.add(fn);
    return () => listeners.delete(fn);
  };

  const getSnapshot = () => snapshot;

  return { add, remove, setBottom, subscribe, getSnapshot };
})();

type RootHost = HTMLElement & { __BOOKLINK_TOAST_ROOT__?: Root };

function ensureHost() {
  const el: RootHost =
    (document.getElementById('toast-portal') as RootHost) ??
    (() => {
      const n = document.createElement('div') as RootHost;
      n.id = 'toast-portal';
      document.body.appendChild(n);
      return n;
    })();

  if (!el.__BOOKLINK_TOAST_ROOT__) {
    el.__BOOKLINK_TOAST_ROOT__ = createRoot(el);
    // 최초 1회만 렌더
    el.__BOOKLINK_TOAST_ROOT__!.render(<ToastViewport />);
  }
}

function makeId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  const rnd = Math.floor(Math.random() * 1_000_000).toString(36);
  return `t_${Date.now()}_${rnd}`;
}

function show(kind: ToastKind, message: string, bottomRemArg?: number) {
  ensureHost();
  store.setBottom(bottomRemArg);
  store.add({ id: makeId(), kind, message, durationMs: DEFAULT_MS });
}

export const toast = {
  info: (msg: string, bottomRem?: number) => show('info', msg, bottomRem),
  success: (msg: string, bottomRem?: number) => show('success', msg, bottomRem),
  error: (msg: string, bottomRem?: number) => show('error', msg, bottomRem),
};

function useToasts(): Snapshot {
  return useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);
}

function ToastViewport() {
  const { list, bottomRem } = useToasts();
  const liveId = useId();

  useEffect(() => {}, []);

  return (
    <div
      id={liveId}
      aria-live='polite'
      aria-atomic='false'
      className={cn('pointer-events-none fixed inset-x-0 z-[var(--z-modal)]', 'flex-col-center gap-[1.2rem]')}
      style={{ bottom: `${bottomRem}rem` }}
    >
      {list.map((t) => (
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
