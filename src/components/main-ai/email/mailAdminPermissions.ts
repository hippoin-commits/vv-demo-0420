import type { MailAdminPanelKind } from "./emailCuiData";

const STORAGE_KEY = "yz_mail_admin_grants_v1";

type GrantRecord = Record<string, boolean>;

function grantKey(userId: string, tenantId: string, kind: MailAdminPanelKind): string {
  return `${userId}::${tenantId}::${kind}`;
}

function readGrants(): GrantRecord {
  if (typeof localStorage === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as GrantRecord;
  } catch {
    return {};
  }
}

function writeGrants(g: GrantRecord): void {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(g));
}

/**
 * 各租户默认是否具备邮箱管理权限（演示数据；接入后端后改为接口返回）。
 * - xiaoce：两项均有
 * - default：均无（用于演示无权限 + 申请）
 * - test：仅有业务邮箱管理
 */
const TENANT_DEFAULTS: Record<string, { business: boolean; staff: boolean }> = {
  xiaoce: { business: true, staff: true },
  default: { business: false, staff: false },
  test: { business: true, staff: false },
};

function defaultHas(tenantId: string, kind: MailAdminPanelKind): boolean {
  const def = TENANT_DEFAULTS[tenantId];
  if (!def) return false;
  return kind === "business" ? def.business : def.staff;
}

/** 当前用户在某租户下是否具备指定邮箱管理权限（含申请通过后本地记录） */
export function hasMailAdminPermission(
  userId: string,
  tenantId: string,
  kind: MailAdminPanelKind
): boolean {
  if (!tenantId) return false;
  const grants = readGrants();
  if (grants[grantKey(userId, tenantId, kind)]) return true;
  return defaultHas(tenantId, kind);
}

/** 用户点击「申请权限」后写入本地（演示：视为审批已通过；接入后端后改为仅记录申请单 id） */
export function grantMailAdminPermissionAfterApply(
  userId: string,
  tenantId: string,
  kind: MailAdminPanelKind
): void {
  const grants = readGrants();
  grants[grantKey(userId, tenantId, kind)] = true;
  writeGrants(grants);
}
