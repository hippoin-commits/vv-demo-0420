import type { TaskFormSnapshot } from "./task-detail/TaskFormFields";

const STORAGE_KEY = "cui-task-drafts-v1";

export type StoredTaskDraft = {
  id: string;
  /** 列表展示用，通常取表单任务名称 */
  title: string;
  savedAt: number;
  snapshot: TaskFormSnapshot;
};

function readRaw(): StoredTaskDraft[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (x): x is StoredTaskDraft =>
        x &&
        typeof x === "object" &&
        typeof (x as StoredTaskDraft).id === "string" &&
        typeof (x as StoredTaskDraft).savedAt === "number" &&
        (x as StoredTaskDraft).snapshot &&
        typeof (x as StoredTaskDraft).snapshot === "object"
    );
  } catch {
    return [];
  }
}

function writeRaw(list: StoredTaskDraft[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    /* ignore quota */
  }
  window.dispatchEvent(new CustomEvent("cui-task-drafts-changed"));
}

export function listTaskDrafts(): StoredTaskDraft[] {
  return readRaw().sort((a, b) => b.savedAt - a.savedAt);
}

export function getTaskDraftById(id: string): StoredTaskDraft | undefined {
  return readRaw().find((d) => d.id === id);
}

export function upsertTaskDraft(
  draftId: string | undefined,
  snapshot: TaskFormSnapshot
): StoredTaskDraft {
  const list = readRaw();
  const title = snapshot.name?.trim() || "未命名草稿";
  const now = Date.now();
  const id = draftId && list.some((d) => d.id === draftId) ? draftId : `draft-${now}`;
  const next: StoredTaskDraft = { id, title, savedAt: now, snapshot };
  const without = list.filter((d) => d.id !== id);
  writeRaw([next, ...without]);
  return next;
}

export function removeTaskDraft(id: string) {
  const list = readRaw().filter((d) => d.id !== id);
  writeRaw(list);
}
