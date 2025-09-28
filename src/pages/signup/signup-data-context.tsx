import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type SignupData = {
  name: string;
  nickname: string;
  email: string;
  emailCode: string;
  zip: string;
  addr1: string;
  addr2: string;
  phone: string;
  password: string;
  passwordConfirm: string;
};

const initial: SignupData = {
  name: '',
  nickname: '',
  email: '',
  emailCode: '',
  zip: '',
  addr1: '',
  addr2: '',
  phone: '',
  password: '',
  passwordConfirm: '',
};

type Ctx = {
  data: SignupData;
  setData: (patch: Partial<SignupData>) => void;
  reset: () => void;
};

const Ctx = createContext<Ctx | null>(null);

const STORAGE_KEY = 'signup_draft';

export function SignupDataProvider({ children }: { children: ReactNode }) {
  const [data, set] = useState<SignupData>(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return initial;
      const parsed = JSON.parse(raw) as unknown;
      if (parsed && typeof parsed === 'object') {
        return { ...initial, ...(parsed as Record<string, unknown>) } as SignupData;
      }
      return initial;
    } catch {
      return initial;
    }
  });

  const setData: Ctx['setData'] = (patch) => {
    set((prev) => {
      const next = { ...prev, ...patch };
      let same = true;
      (Object.keys(next) as (keyof SignupData)[]).forEach((k) => {
        if (prev[k] !== next[k]) same = false;
      });
      return same ? prev : next;
    });
  };

  const reset = () => set(initial);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {}
  }, [data]);

  const value = useMemo<Ctx>(() => ({ data, setData, reset }), [data]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSignupData() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useSignupData must be used within <SignupDataProvider/>');
  return ctx;
}
