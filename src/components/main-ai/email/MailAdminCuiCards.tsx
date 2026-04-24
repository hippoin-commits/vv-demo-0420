import * as React from "react";
import { Building2, ShieldAlert, Users } from "lucide-react";
import { Button } from "../../ui/button";
import { cn } from "../../ui/utils";
import type { MailAdminPanelKind } from "./emailCuiData";
import { MailAdminManageList } from "./MailAdminManagePanels";
import {
  grantMailAdminPermissionAfterApply,
  hasMailAdminPermission,
} from "./mailAdminPermissions";

export function MailTenantPickForAdminCard({
  pending,
  organizations,
  onPickTenant,
}: {
  pending: MailAdminPanelKind;
  organizations: Array<{ id: string; name: string; icon?: string }>;
  onPickTenant: (tenantId: string) => void;
}) {
  const title =
    pending === "business"
      ? "管理业务邮箱需指定租户"
      : "管理员工邮箱需指定租户";
  const subtitle =
    "当前为「全部」或「个人」视角，请先选择要管理的组织。选择后将切换到该租户的邮箱对话。";

  return (
    <div
      className={cn(
        "w-full max-w-[min(100%,520px)] rounded-[var(--radius-lg)] border border-border bg-bg shadow-elevation-sm",
        "flex flex-col gap-[var(--space-300)] p-[var(--space-400)]"
      )}
    >
      <div className="flex flex-col gap-[var(--space-100)]">
        <p className="text-[length:var(--font-size-md)] font-[var(--font-weight-semibold)] text-text">
          {title}
        </p>
        <p className="text-[length:var(--font-size-sm)] text-text-secondary leading-relaxed">{subtitle}</p>
      </div>
      <ul className="flex flex-col gap-[var(--space-150)] min-w-0">
        {organizations.map((org) => (
          <li key={org.id} className="min-w-0">
            <button
              type="button"
              onClick={() => onPickTenant(org.id)}
              className={cn(
                "flex w-full items-center gap-[var(--space-250)] rounded-[var(--radius-md)] border border-border",
                "px-[var(--space-300)] py-[var(--space-200)] text-left transition-colors",
                "hover:bg-[var(--black-alpha-11)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
              )}
            >
              {org.icon ? (
                <img src={org.icon} alt="" className="size-9 shrink-0 rounded-[var(--radius-sm)] object-cover" />
              ) : (
                <div className="size-9 shrink-0 rounded-[var(--radius-sm)] bg-[var(--black-alpha-9)] border border-border" />
              )}
              <span className="min-w-0 flex-1 truncate text-[length:var(--font-size-base)] text-text font-[var(--font-weight-medium)]">
                {org.name}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function MailMailAdminPanelCard({
  kind,
  tenantName,
  tenantId,
  userId,
}: {
  kind: MailAdminPanelKind;
  tenantName: string;
  tenantId: string;
  userId: string;
}) {
  const Icon = kind === "business" ? Building2 : Users;
  const title = kind === "business" ? "管理业务邮箱" : "管理员工邮箱";

  const [allowed, setAllowed] = React.useState(() =>
    hasMailAdminPermission(userId, tenantId, kind)
  );
  /** 仅当用户在本卡片内点击「申请权限」通过后为 true，用于展示演示提示 */
  const [showApplyGrantedHint, setShowApplyGrantedHint] = React.useState(false);

  React.useEffect(() => {
    setAllowed(hasMailAdminPermission(userId, tenantId, kind));
    setShowApplyGrantedHint(false);
  }, [userId, tenantId, kind]);

  const handleRequestAccess = () => {
    grantMailAdminPermissionAfterApply(userId, tenantId, kind);
    setAllowed(true);
    setShowApplyGrantedHint(true);
  };

  return (
    <div
      className={cn(
        "w-full max-w-[min(100%,720px)] rounded-[var(--radius-lg)] border border-border bg-bg shadow-elevation-sm",
        "flex flex-col gap-[var(--space-300)] p-[var(--space-400)]"
      )}
    >
      <div className="flex items-start gap-[var(--space-250)]">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--black-alpha-9)] border border-border">
          <Icon className="size-5 text-text-secondary" strokeWidth={2} />
        </div>
        <div className="min-w-0 flex-1 flex flex-col gap-[var(--space-100)]">
          <p className="text-[length:var(--font-size-md)] font-[var(--font-weight-semibold)] text-text">{title}</p>
          <p className="text-[length:var(--font-size-xs)] text-text-secondary">
            租户：<span className="text-text font-[var(--font-weight-medium)]">{tenantName}</span>
          </p>
        </div>
      </div>

      {!allowed ? (
        <div
          className={cn(
            "flex flex-col items-center justify-center gap-[var(--space-300)] py-[var(--space-500)] px-[var(--space-200)]",
            "rounded-[var(--radius-md)] border border-dashed border-border bg-[var(--black-alpha-6)]"
          )}
        >
          <div className="flex flex-col items-center gap-[var(--space-150)] text-center">
            <ShieldAlert className="size-10 text-text-tertiary" strokeWidth={1.5} />
            <p className="text-[length:var(--font-size-sm)] text-text-secondary leading-relaxed">
              暂无权限访问「{title}」
            </p>
            <p className="text-[length:var(--font-size-xs)] text-text-tertiary max-w-[320px]">
              该功能需由租户管理员授权。你可提交权限申请，审批通过后即可管理列表。
            </p>
          </div>
          <Button type="button" variant="default" onClick={handleRequestAccess}>
            申请权限
          </Button>
        </div>
      ) : (
        <>
          {showApplyGrantedHint ? (
            <p className="text-[length:var(--font-size-xs)] text-[var(--color-success-text,#15803d)]">
              权限申请已通过（演示环境）。下方列表为本地演示数据。
            </p>
          ) : null}
          <MailAdminManageList kind={kind} tenantName={tenantName} />
        </>
      )}
    </div>
  );
}
