import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

interface EnquiryValue {
  plan: string | null;
  service: string | null;
  selectPlan: (plan: string) => void;
  selectService: (service: string) => void;
  clear: () => void;
}

const EnquiryContext = createContext<EnquiryValue>({
  plan: null,
  service: null,
  selectPlan: () => {},
  selectService: () => {},
  clear: () => {},
});

export function EnquiryProvider({ children }: { children: ReactNode }) {
  const [plan, setPlan] = useState<string | null>(null);
  const [service, setService] = useState<string | null>(null);

  const value = useMemo<EnquiryValue>(
    () => ({
      plan,
      service,
      selectPlan: (p) => {
        setPlan(p);
        setService(null);
      },
      selectService: (s) => {
        setService(s);
        setPlan(null);
      },
      clear: () => {
        setPlan(null);
        setService(null);
      },
    }),
    [plan, service],
  );

  return <EnquiryContext.Provider value={value}>{children}</EnquiryContext.Provider>;
}

export function useEnquiry() {
  return useContext(EnquiryContext);
}
