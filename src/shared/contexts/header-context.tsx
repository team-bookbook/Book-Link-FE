import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { ActionId } from '@layouts/header';

export interface HeaderOverride {
  left?: 'back';
  safeTop?: boolean;
  title?: string;
  actions?: ActionId[];
  onAction?: (action: ActionId) => void;
}

interface HeaderContextValue {
  override: HeaderOverride | null;
  setOverride: (config: HeaderOverride | null) => void;
}

const HeaderContext = createContext<HeaderContextValue | undefined>(undefined);

export function HeaderProvider({ children }: { children: ReactNode }) {
  const [override, setOverride] = useState<HeaderOverride | null>(null);

  return <HeaderContext.Provider value={{ override, setOverride }}>{children}</HeaderContext.Provider>;
}

export function useHeaderContext() {
  const context = useContext(HeaderContext);
  if (context === undefined) {
    throw new Error('useHeaderContext must be used within HeaderProvider');
  }
  return context;
}

export function useHeaderOverride(config: HeaderOverride | null) {
  const { setOverride } = useHeaderContext();

  useEffect(() => {
    setOverride(config);
    return () => setOverride(null);
  }, [config, setOverride]);
}
