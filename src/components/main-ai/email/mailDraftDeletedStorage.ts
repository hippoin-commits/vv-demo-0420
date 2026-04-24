/**
 * 演示：用户从草稿箱删除的邮件 id（本地持久化，刷新后仍隐藏）。
 * 正式接入后端后改为调用删除草稿接口并失效列表。
 */

const STORAGE_KEY = "cui-mail-demo-deleted-draft-ids-v1";

const SAFE_ID_RE = /^[a-zA-Z0-9_-]{1,80}$/;

export function getDeletedDraftMailIds(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as unknown;
    if (!Array.isArray(arr)) return new Set();
    const out = new Set<string>();
    for (const x of arr) {
      if (typeof x === "string" && SAFE_ID_RE.test(x)) out.add(x);
    }
    return out;
  } catch {
    return new Set();
  }
}

export function addDeletedDraftMailId(id: string): void {
  if (typeof window === "undefined" || !SAFE_ID_RE.test(id)) return;
  const next = getDeletedDraftMailIds();
  next.add(id);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
}
