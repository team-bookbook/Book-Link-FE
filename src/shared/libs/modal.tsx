import { useEffect, useId, useSyncExternalStore, useState } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { cn } from '@libs/cn';
import Button from '@components/button/button';
import Input from '@components/input/input';

type ModalVariant = 'primary' | 'danger';
type Result<T> = { ok: boolean; value?: T };

type BaseConfig = {
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: ModalVariant;
  dismissOnOverlay?: boolean;
};

type ConfirmConfig = BaseConfig;

type PromptConfig = BaseConfig & {
  placeholder?: string;
  // 비밀번호 입력 여부
  password?: boolean;
  maxLength?: number;
};

type ModalKind =
  | { type: 'confirm'; cfg: ConfirmConfig; resolve: (r: Result<undefined>) => void }
  | { type: 'prompt'; cfg: PromptConfig; resolve: (r: Result<string>) => void };

type ModalItem = { id: string; kind: ModalKind };

const store = (() => {
  let stack: ModalItem[] = [];
  const listeners = new Set<() => void>();
  const emit = () => listeners.forEach((fn) => fn());
  const subscribe = (fn: () => void) => {
    listeners.add(fn);
    return () => listeners.delete(fn);
  };
  const getSnapshot = () => stack;
  const push = (m: ModalItem) => {
    stack = [...stack, m];
    emit();
  };
  const pop = (id: string) => {
    stack = stack.filter((x) => x.id !== id);
    emit();
  };
  return { subscribe, getSnapshot, push, pop };
})();

type RootHost = HTMLElement & { __BOOKLINK_MODAL_ROOT__?: Root };

function ensureHost() {
  const el: RootHost =
    (document.getElementById('modal-portal') as RootHost) ??
    (() => {
      const n = document.createElement('div') as RootHost;
      n.id = 'modal-portal';
      document.body.appendChild(n);
      return n;
    })();
  if (!el.__BOOKLINK_MODAL_ROOT__) {
    el.__BOOKLINK_MODAL_ROOT__ = createRoot(el);
  }
  el.__BOOKLINK_MODAL_ROOT__!.render(<ModalViewport />);
}

function makeId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  const r = Math.floor(Math.random() * 1_000_000).toString(36);
  return `m_${Date.now()}_${r}`;
}

export const modal = {
  confirm(cfg: ConfirmConfig): Promise<Result<undefined>> {
    ensureHost();
    return new Promise((resolve) => {
      store.push({ id: makeId(), kind: { type: 'confirm', cfg, resolve } });
    });
  },
  prompt(cfg: PromptConfig): Promise<Result<string>> {
    ensureHost();
    return new Promise((resolve) => {
      store.push({ id: makeId(), kind: { type: 'prompt', cfg, resolve } });
    });
  },
};

function useModals(): ModalItem[] {
  return useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);
}

function ModalViewport() {
  const stack = useModals();
  const current = stack[stack.length - 1];

  useEffect(() => {
    const prev = document.body.style.overflow;
    if (current) document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [current]);

  if (!current) return null;

  const { id, kind } = current;
  const cfg = kind.cfg;

  const close = () => store.pop(id);

  const onEsc: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.key === 'Escape') {
      if (kind.type === 'confirm') kind.resolve({ ok: false });
      else kind.resolve({ ok: false, value: '' });
      close();
    }
  };

  const confirmVariant = cfg.confirmVariant ?? (kind.type === 'confirm' ? 'danger' : 'primary');
  const confirmColor: 'danger' | 'primary' = confirmVariant === 'danger' ? 'danger' : 'primary';

  const onOverlayClick = () => {
    if (cfg.dismissOnOverlay) {
      if (kind.type === 'confirm') kind.resolve({ ok: false });
      else kind.resolve({ ok: false, value: '' });
      close();
    }
  };

  return (
    <div
      role='dialog'
      aria-modal='true'
      onKeyDown={onEsc}
      className={cn('fixed inset-0 z-[var(--z-modal)]', 'flex-row-center')}
    >
      <div className='bg-opacity-light absolute inset-0' onClick={onOverlayClick} />
      <div className={cn('relative mx-[4rem] w-[min(43rem,calc(100vw-8rem))]', 'bg-gray-white rounded-[16px]')}>
        {kind.type === 'confirm' ? (
          <ConfirmContent cfg={cfg} onClose={close} onResolve={(r) => kind.resolve(r)} confirmColor={confirmColor} />
        ) : (
          <PromptContent cfg={cfg} onClose={close} onResolve={(r) => kind.resolve(r)} confirmColor={confirmColor} />
        )}
      </div>
    </div>
  );
}

function ConfirmContent({
  cfg,
  onClose,
  onResolve,
  confirmColor,
}: {
  cfg: ConfirmConfig;
  onClose: () => void;
  onResolve: (r: { ok: boolean }) => void;
  confirmColor: 'primary' | 'danger';
}) {
  const titleId = useId();

  const onConfirm = () => {
    onResolve({ ok: true });
    onClose();
  };
  const onCancel = () => {
    onResolve({ ok: false });
    onClose();
  };

  return (
    <div aria-labelledby={titleId} className='p-[2rem]'>
      <div className='flex flex-col items-center gap-[1.2rem] text-center'>
        <h2 id={titleId} className='title6 whitespace-pre-line text-gray-900'>
          {cfg.title}
        </h2>
        {cfg.description && <p className='body4 whitespace-pre-line text-gray-900'>{cfg.description}</p>}
      </div>
      <div className='mt-[2rem] flex items-center gap-[0.8rem]'>
        <Button variant='outline' fullWidth roundStyle='rounded-[12px]' typoStyle='button3' onClick={onCancel}>
          {cfg.cancelText ?? '취소'}
        </Button>
        <Button
          variant={confirmColor === 'danger' ? 'danger' : 'primary'}
          fullWidth
          roundStyle='rounded-[12px]'
          typoStyle='button3'
          onClick={onConfirm}
        >
          {cfg.confirmText ?? '확인'}
        </Button>
      </div>
    </div>
  );
}

function PromptContent({
  cfg,
  onClose,
  onResolve,
  confirmColor,
}: {
  cfg: PromptConfig;
  onClose: () => void;
  onResolve: (r: { ok: boolean; value: string }) => void;
  confirmColor: 'primary' | 'danger';
}) {
  const titleId = useId();
  const [val, setVal] = useState('');

  const onConfirm = () => {
    onResolve({ ok: true, value: val });
    onClose();
  };
  const onCancel = () => {
    onResolve({ ok: false, value: '' });
    onClose();
  };

  return (
    <div aria-labelledby={titleId} className='p-[2rem]'>
      <div className='flex flex-col items-center gap-[1.2rem] text-center'>
        <h2 id={titleId} className='title6 whitespace-pre-line text-gray-900'>
          {cfg.title}
        </h2>
        {cfg.description && <p className='body4 whitespace-pre-line text-gray-900'>{cfg.description}</p>}
      </div>

      <div className='mt-[1.6rem]'>
        <Input
          id='modal-prompt-input'
          type={cfg.password ? 'password' : 'text'}
          placeholder={cfg.placeholder ?? ''}
          maxLength={cfg.maxLength ?? 50}
          value={val}
          onChange={(e) => setVal(e.currentTarget.value)}
        />
      </div>

      <div className='mt-[2rem] flex items-center gap-[0.8rem]'>
        <Button variant='outline' fullWidth roundStyle='rounded-[12px]' typoStyle='button3' onClick={onCancel}>
          {cfg.cancelText ?? '취소'}
        </Button>
        <Button
          variant={confirmColor === 'danger' ? 'danger' : 'primary'}
          fullWidth
          roundStyle='rounded-[12px]'
          typoStyle='button3'
          onClick={onConfirm}
        >
          {cfg.confirmText ?? '확인'}
        </Button>
      </div>
    </div>
  );
}
