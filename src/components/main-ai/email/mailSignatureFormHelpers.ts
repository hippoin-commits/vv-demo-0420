import type { DemoMailSignature } from "./emailCuiData";

export function setDefaultInList(list: DemoMailSignature[], signatureId: string): DemoMailSignature[] {
  return list.map((s) => ({ ...s, isDefault: s.id === signatureId }));
}

export function afterDelete(list: DemoMailSignature[], removedId: string): DemoMailSignature[] {
  const next = list.filter((s) => s.id !== removedId);
  if (next.length === 0) return next;
  if (!next.some((s) => s.isDefault)) {
    return next.map((s, idx) => ({ ...s, isDefault: idx === 0 }));
  }
  return next;
}

export function insertSignature(list: DemoMailSignature[], sig: DemoMailSignature): DemoMailSignature[] {
  let base = list;
  if (sig.isDefault) {
    base = base.map((s) => ({ ...s, isDefault: false }));
  }
  return [...base, sig];
}
