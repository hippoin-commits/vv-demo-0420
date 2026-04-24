import * as React from "react";
import { buildInitialDemoSignaturesByMailbox, type DemoMailSignature } from "./emailCuiData";

type MailSignatureDemoState = {
  byMailbox: Record<string, DemoMailSignature[]>;
  setByMailbox: React.Dispatch<React.SetStateAction<Record<string, DemoMailSignature[]>>>;
};

const MailSignatureDemoStateContext = React.createContext<MailSignatureDemoState | null>(null);

export function MailSignatureDemoStateProvider({ children }: { children: React.ReactNode }) {
  const [byMailbox, setByMailbox] = React.useState<Record<string, DemoMailSignature[]>>(
    buildInitialDemoSignaturesByMailbox
  );
  const value = React.useMemo(() => ({ byMailbox, setByMailbox }), [byMailbox]);
  return (
    <MailSignatureDemoStateContext.Provider value={value}>{children}</MailSignatureDemoStateContext.Provider>
  );
}

export function useMailSignatureDemoState(): MailSignatureDemoState {
  const ctx = React.useContext(MailSignatureDemoStateContext);
  if (!ctx) {
    throw new Error("useMailSignatureDemoState must be used within MailSignatureDemoStateProvider");
  }
  return ctx;
}
