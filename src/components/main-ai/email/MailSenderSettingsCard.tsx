import * as React from "react";
import { toast } from "sonner";
import { cn } from "../../ui/utils";

const tableHeadClass =
  "text-left text-[length:var(--font-size-xs)] font-[var(--font-weight-medium)] text-text-secondary px-[var(--space-300)] py-[var(--space-200)]";
const tableCellClass =
  "px-[var(--space-300)] py-[var(--space-250)] text-[length:var(--font-size-sm)] text-text align-middle";

type DemoSenderRow = {
  id: string;
  email: string;
  company: string;
  /** 待激活：不可设为默认发件箱 */
  pendingActivation?: boolean;
};

/** 演示数据（协同邮箱默认发件地址） */
const DEMO_SENDER_ROWS: DemoSenderRow[] = [
  { id: "snd-1", email: "yinzhao@vv.cn", company: "微微集团" },
  { id: "snd-2", email: "yzhao@pg.com.cn", company: "PG科技", pendingActivation: true },
  { id: "snd-3", email: "zhangsan.work@company.com", company: "微微集团" },
  { id: "snd-4", email: "product@company.com", company: "PG科技" },
];

const defaultTagClass =
  "inline-flex items-center rounded-[var(--radius-full)] px-[var(--space-150)] py-[var(--space-50)] text-[length:var(--font-size-xs)] font-[var(--font-weight-medium)] text-[color:var(--color-success)] bg-[color-mix(in_srgb,var(--color-success)_14%,transparent)]";

const pendingTagClass =
  "inline-flex shrink-0 items-center rounded-[var(--radius-full)] px-[var(--space-150)] py-[var(--space-50)] text-[length:var(--font-size-xxs)] font-[var(--font-weight-medium)] text-[color:var(--color-warning)] bg-[color-mix(in_srgb,var(--color-warning)_14%,transparent)]";

export function MailSenderSettingsCard() {
  const [defaultSenderId, setDefaultSenderId] = React.useState<string>(() => DEMO_SENDER_ROWS[0]?.id ?? "");

  const setAsDefault = (id: string) => {
    const row = DEMO_SENDER_ROWS.find((r) => r.id === id);
    if (!row || row.pendingActivation) {
      toast.error("该邮箱未激活，无法设为默认（演示）");
      return;
    }
    setDefaultSenderId(id);
    toast.success("已设为默认发件箱（演示）");
  };

  return (
    <div
      className={cn(
        "relative flex w-full min-w-0 flex-col items-start gap-[var(--space-250)] rounded-[var(--radius-card)] bg-bg p-[var(--space-350)] shadow-elevation-sm"
      )}
    >
      <div className="relative flex w-full min-w-0 shrink-0 flex-col gap-[var(--space-200)] border-b border-border pb-[var(--space-300)]">
        <div className="flex min-w-0 flex-1 items-start gap-[var(--space-200)]">
          <div className="bg-primary h-[22px] w-[3px] shrink-0 self-start rounded-full" aria-hidden />
          <div className="flex min-w-0 flex-1 flex-col gap-[var(--space-100)]">
            <h3 className="m-0 min-w-0 text-[length:var(--font-size-md)] font-[var(--font-weight-medium)] leading-[22px] text-text">
              发件人设置
            </h3>
            <p className="m-0 min-w-0 text-[length:var(--font-size-xs)] text-text-tertiary">
              协同邮箱默认发件地址
            </p>
          </div>
        </div>
      </div>

      <div className="w-full min-w-0 overflow-hidden rounded-[var(--radius-md)] border border-border bg-bg">
        <table className="w-full min-w-0 border-collapse table-fixed">
          <thead>
            <tr className="border-b border-border bg-bg-secondary/50">
              <th className={cn(tableHeadClass, "w-[38%]")}>邮箱账号</th>
              <th className={cn(tableHeadClass, "w-[32%]")}>归属行政公司</th>
              <th className={cn(tableHeadClass, "w-[30%] text-right")}>操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {DEMO_SENDER_ROWS.map((row) => {
              const isDefault = row.id === defaultSenderId;
              return (
                <tr key={row.id}>
                  <td className={tableCellClass}>
                    <div className="flex min-w-0 flex-wrap items-center gap-[var(--space-150)]">
                      <span className="break-all font-[var(--font-weight-medium)]">{row.email}</span>
                      {row.pendingActivation ? (
                        <span className={pendingTagClass}>待激活</span>
                      ) : null}
                    </div>
                  </td>
                  <td className={cn(tableCellClass, "text-text-secondary")}>{row.company}</td>
                  <td className={cn(tableCellClass, "text-right")}>
                    {row.pendingActivation ? (
                      <span className="text-[length:var(--font-size-xs)] text-text-tertiary">—</span>
                    ) : isDefault ? (
                      <span className={defaultTagClass}>默认发件箱</span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setAsDefault(row.id)}
                        className="border-0 bg-transparent p-0 text-[length:var(--font-size-sm)] text-primary underline-offset-2 hover:underline cursor-pointer"
                      >
                        设为默认
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
