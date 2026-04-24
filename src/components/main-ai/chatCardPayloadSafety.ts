/**
 * 会话内「卡片 marker + JSON」载荷的防御性解析（演示态亦按不可信输入处理）。
 * - 限制 JSON 体积，减轻 DoS
 * - 白名单字段，避免 JSON 原型污染与多余键干扰逻辑
 * - 字符串截断；URL 仅允许 http(s) / 相对安全 data:image
 */

import type { MailFolderId, MailListFilter, MailScope, MailSettingsPageId } from "./email/emailCuiData";

const MAX_MARKER_JSON_CHARS = 65536;
const MAX_SHORT_STR = 500;
const MAX_LONG_STR = 20000;
const MAX_ID_STR = 80;

const SAFE_ID_RE = /^[a-zA-Z0-9_-]{1,80}$/;

function safeJsonParseRecord(jsonStr: string): Record<string, unknown> | null {
  if (jsonStr.length > MAX_MARKER_JSON_CHARS) return null;
  try {
    const v = JSON.parse(jsonStr) as unknown;
    if (v === null || typeof v !== "object" || Array.isArray(v)) return null;
    return v as Record<string, unknown>;
  } catch {
    return null;
  }
}

function str(v: unknown, max: number): string | undefined {
  if (typeof v !== "string") return undefined;
  return v.length > max ? v.slice(0, max) : v;
}

function optSafeId(v: unknown): string | undefined {
  const s = str(v, MAX_ID_STR);
  if (!s || !SAFE_ID_RE.test(s)) return undefined;
  return s;
}

/** 允许作为 <img src> 的 URL（阻断 javascript: 等） */
export function isSafeHttpOrImageDataUrl(raw: string): boolean {
  if (raw.length > 4000) return false;
  const t = raw.trim();
  if (t.startsWith("//")) return false;
  if (t.startsWith("data:image/")) {
    return t.length <= 120_000 && /^data:image\/[\w.+-]+;base64,/.test(t);
  }
  try {
    const u = new URL(t);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

const MAIL_FOLDERS = new Set(["inbox", "sent", "drafts", "trash"]);

export type ParsedGenericCardPayload = {
  title: string;
  description?: string;
  detail?: string;
  imageSrc?: string;
};

/** <<<RENDER_GENERIC_CARD>>>: 后的 JSON 串 */
export function parseGenericCardPayloadJson(jsonStr: string): ParsedGenericCardPayload | null {
  const o = safeJsonParseRecord(jsonStr);
  if (!o) return null;
  const title = str(o.title, MAX_SHORT_STR);
  if (!title) return null;
  const description = str(o.description, MAX_LONG_STR);
  const detail = str(o.detail, MAX_LONG_STR);
  let imageSrc: string | undefined;
  const img = str(o.imageSrc, 4000);
  if (img && isSafeHttpOrImageDataUrl(img)) imageSrc = img;
  return { title, description, detail, imageSrc };
}

export type ParsedMailMailboxPayload = {
  variant?: string;
  folder: MailFolderId;
  scope: MailScope;
  personalMailboxId?: string;
  businessMailboxId?: string;
  listFilter: MailListFilter;
  cardTitle?: string;
};

/** MAIL_MAILBOX_MARKER 后的 JSON（非法或过大时回退默认，不抛错） */
export function parseMailMailboxMarkerJson(jsonStr: string): ParsedMailMailboxPayload {
  const o = safeJsonParseRecord(jsonStr);
  if (!o) {
    return {
      folder: "inbox",
      scope: "all",
      listFilter: "all",
    };
  }
  let folder: MailFolderId = "inbox";
  if (typeof o.folder === "string" && MAIL_FOLDERS.has(o.folder)) {
    folder = o.folder as MailFolderId;
  }
  let scope: MailScope = "all";
  if (o.scope === "all" || o.scope === "personal") {
    scope = o.scope;
  } else if (typeof o.scope === "string" && SAFE_ID_RE.test(o.scope)) {
    scope = o.scope;
  }
  let listFilter: MailListFilter = "all";
  if (o.listFilter === "unread" || o.listFilter === "all") listFilter = o.listFilter;

  const variant = str(o.variant, 64);
  const cardTitle = str(o.cardTitle, MAX_SHORT_STR);
  const personalMailboxId = optSafeId(o.personalMailboxId);
  const businessMailboxId = optSafeId(o.businessMailboxId);

  return {
    variant,
    folder,
    scope,
    personalMailboxId,
    businessMailboxId,
    listFilter,
    cardTitle,
  };
}

export type ParsedMailComposePayload = {
  defaultPersonalMailboxId?: string;
  defaultBusinessMailboxId?: string;
  draftMailId?: string;
  composeAction?: "reply" | "replyAll" | "forward";
  sourceMailId?: string;
};

function optComposeAction(v: unknown): "reply" | "replyAll" | "forward" | undefined {
  if (v === "reply" || v === "replyAll" || v === "forward") return v;
  return undefined;
}

export function parseMailComposeMarkerJson(jsonStr: string): ParsedMailComposePayload {
  const o = safeJsonParseRecord(jsonStr);
  if (!o) return {};
  return {
    defaultPersonalMailboxId: optSafeId(o.defaultPersonalMailboxId),
    defaultBusinessMailboxId: optSafeId(o.defaultBusinessMailboxId),
    draftMailId: optSafeId(o.draftMailId),
    composeAction: optComposeAction(o.composeAction),
    sourceMailId: optSafeId(o.sourceMailId),
  };
}

export type ParsedMailReadInChatPayload = {
  mailId?: string;
};

/** MAIL_READ_IN_CHAT_MARKER 后的 JSON（仅白名单 mailId） */
export function parseMailReadInChatMarkerJson(jsonStr: string): ParsedMailReadInChatPayload {
  const o = safeJsonParseRecord(jsonStr);
  if (!o) return {};
  return {
    mailId: optSafeId(o.mailId),
  };
}

export type ParsedMailSignatureEditorPayload = {
  mode: "create" | "edit";
  mailboxId?: string;
  signatureId?: string;
};

function optSignatureEditorMode(v: unknown): "create" | "edit" | undefined {
  if (v === "create" || v === "edit") return v;
  return undefined;
}

/** MAIL_SIGNATURE_EDITOR_MARKER 后的 JSON */
export function parseMailSignatureEditorMarkerJson(
  jsonStr: string
): ParsedMailSignatureEditorPayload {
  const o = safeJsonParseRecord(jsonStr);
  if (!o) return { mode: "create" };
  const mode = optSignatureEditorMode(o.mode) ?? "create";
  return {
    mode,
    mailboxId: optSafeId(o.mailboxId),
    signatureId: optSafeId(o.signatureId),
  };
}

const SETTINGS_PAGES = new Set<MailSettingsPageId>(["accounts", "signature", "sender"]);

export function parseMailSettingsMarkerJson(jsonStr: string): MailSettingsPageId {
  const o = safeJsonParseRecord(jsonStr);
  if (!o) return "accounts";
  const p = o.page;
  if (typeof p === "string" && SETTINGS_PAGES.has(p as MailSettingsPageId)) {
    return p as MailSettingsPageId;
  }
  return "accounts";
}
