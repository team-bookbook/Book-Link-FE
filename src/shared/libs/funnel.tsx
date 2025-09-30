import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

type StepKey = string;

type FunnelCtx = {
  steps: StepKey[];
  step: StepKey;
  index: number;
  goNext: () => void;
  goPrev: () => void;
  to: (key: StepKey) => void;
  isFirst: boolean;
  isLast: boolean;
};

const Ctx = createContext<FunnelCtx | null>(null);

export function useFunnel() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useFunnel must be used within <Funnel/>');
  return ctx;
}

type FunnelProps = {
  steps: StepKey[];
  initial: StepKey;
  children: ReactNode;
};

export function Funnel({ steps, initial, children }: FunnelProps) {
  const [step, setStep] = useState<StepKey>(initial);
  const index = useMemo(() => steps.findIndex((s) => s === step), [steps, step]);

  const goNext = useCallback(() => {
    setStep((prev) => {
      const i = steps.findIndex((s) => s === prev);
      return i >= 0 && i < steps.length - 1 ? steps[i + 1] : prev;
    });
  }, [steps]);

  const goPrev = useCallback(() => {
    setStep((prev) => {
      const i = steps.findIndex((s) => s === prev);
      return i > 0 ? steps[i - 1] : prev;
    });
  }, [steps]);

  const to = useCallback(
    (key: StepKey) => {
      if (steps.includes(key)) setStep(key);
    },
    [steps]
  );

  const value: FunnelCtx = {
    steps,
    step,
    index,
    goNext,
    goPrev,
    to,
    isFirst: index === 0,
    isLast: index === steps.length - 1,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

type ViewProps = { when: StepKey; children: ReactNode };
export function StepView({ when, children }: ViewProps) {
  const { step } = useFunnel();
  if (step !== when) return null;
  return <>{children}</>;
}
