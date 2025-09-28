import { createContext, useContext, useState, type ReactNode } from 'react';

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
};

const Ctx = createContext<Ctx | null>(null);

export function useSignupData() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useSignupData must be used within <SignupDataProvider/>');
  return ctx;
}

export function SignupDataProvider({ children }: { children: ReactNode }) {
  const [data, set] = useState<SignupData>(initial);
  const setData = (patch: Partial<SignupData>) => set((prev) => ({ ...prev, ...patch }));
  return <Ctx.Provider value={{ data, setData }}>{children}</Ctx.Provider>;
}
