import * as React from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "../../ui/utils";
import { mailSettingsPageTitle } from "./emailCuiData";

type DemoAccountEmail = {
  id: string;
  email: string;
  /** 紧挨邮箱的警示图标（演示：待验证/需关注） */
  showWarning?: boolean;
};

type DemoAccountGroup = {
  id: string;
  /** 分组标题 */
  label: string;
  /** 是否允许用户自行删除该组下的账号（仅个人邮箱可删） */
  allowDelete: boolean;
  emails: DemoAccountEmail[];
};

/** 演示：分组邮箱列表（与产品「邮箱管理」结构一致） */
const DEMO_ACCOUNT_GROUPS: DemoAccountGroup[] = [
  {
    id: "g-xiaoce",
    label: "小测科技",
    allowDelete: false,
    emails: [
      { id: "a1", email: "1212121@163.com", showWarning: true },
      { id: "a2", email: "1222@163.com", showWarning: true },
      { id: "a3", email: "it@pg.com.cn", showWarning: true },
      { id: "a4", email: "1@163.com", showWarning: true },
      { id: "a5", email: "yzhao@pg.com.cn", showWarning: true },
    ],
  },
  {
    id: "g-weiwei",
    label: "微微集团",
    allowDelete: false,
    emails: [{ id: "a6", email: "cf@coffee.com", showWarning: true }],
  },
  {
    id: "g-personal",
    label: "个人邮箱",
    allowDelete: true,
    emails: [{ id: "a7", email: "yinzhao@vv.cn", showWarning: false }],
  },
];

const sectionLabelClass =
  "m-0 px-[var(--space-300)] pt-[var(--space-300)] pb-[var(--space-100)] text-[length:var(--font-size-xs)] font-[var(--font-weight-medium)] text-text-tertiary";

/** 16×16 实心盾形 + 浅色问号笔画（Lucide shield-question 路径，盾体 fill、符号 stroke） */
function PendingActivationIcon() {
  return (
    <span
      className="inline-flex size-4 shrink-0 items-center justify-center text-[color:var(--color-warning)]"
      title="待激活（演示）"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        className="block"
        aria-hidden
      >
        <path
          fill="currentColor"
          d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"
        />
        <path
          d="M9.1 9a3 3 0 0 1 5.82 1c0 2-3 3-3 3"
          fill="none"
          stroke="white"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 17h.01"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

export function MailAccountsSettingsCard() {
  const handleAddAccount = () => {
    toast.info("添加账号（演示）：正式版将打开绑定流程或跳转至账号授权。");
  };

  const handleRemoveAccount = (email: string) => {
    toast.info(`移除账号（演示）：${email}。正式版将调用解绑接口。`);
  };

  return (
    <div
      className={cn(
        "relative flex w-full min-w-0 flex-col items-start gap-[var(--space-250)] rounded-[var(--radius-card)] bg-bg p-[var(--space-350)] shadow-elevation-sm"
      )}
    >
      <div className="relative flex w-full min-w-0 shrink-0 flex-col gap-[var(--space-200)]">
        <div className="flex min-w-0 flex-1 items-start gap-[var(--space-200)]">
          <div className="bg-primary h-[22px] w-[3px] shrink-0 self-start rounded-full" aria-hidden />
          <div className="flex min-w-0 flex-1 flex-col gap-[var(--space-100)]">
            <h3 className="m-0 min-w-0 text-[length:var(--font-size-md)] font-[var(--font-weight-medium)] leading-[22px] text-text">
              {mailSettingsPageTitle("accounts")}
            </h3>
            <p className="m-0 min-w-0 text-[length:var(--font-size-xs)] text-text-tertiary">
              已绑定的业务与个人邮箱
            </p>
          </div>
        </div>
      </div>

      <div className="w-full min-w-0 overflow-hidden rounded-[var(--radius-md)] border border-border bg-bg">
        <div className="flex flex-col">
          {DEMO_ACCOUNT_GROUPS.map((group, gi) => (
            <div key={group.id} className={cn(gi > 0 && "border-t border-border")}>
              <p className={sectionLabelClass}>{group.label}</p>
              <div className="flex flex-col divide-y divide-border">
                {group.emails.map((row) => (
                  <div
                    key={row.id}
                    className={cn(
                      "group/account-row flex min-w-0 items-center gap-[var(--space-200)] px-[var(--space-300)] py-[var(--space-250)]",
                      group.allowDelete && "justify-between"
                    )}
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-1.5">
                      <span className="min-w-0 break-all text-left text-[length:var(--font-size-sm)] font-[var(--font-weight-medium)] text-text">
                        {row.email}
                      </span>
                      {row.showWarning ? (
                        <span className="inline-flex shrink-0" aria-label="待激活">
                          <PendingActivationIcon />
                        </span>
                      ) : null}
                    </div>
                    {group.allowDelete ? (
                      <button
                        type="button"
                        onClick={() => handleRemoveAccount(row.email)}
                        className={cn(
                          "inline-flex size-8 shrink-0 items-center justify-center rounded-[var(--radius-md)] text-text-tertiary transition-colors",
                          "opacity-0 pointer-events-none group-hover/account-row:opacity-100 group-hover/account-row:pointer-events-auto",
                          "hover:bg-[var(--black-alpha-11)] hover:text-[color:var(--color-error)] focus-visible:opacity-100 focus-visible:pointer-events-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                        )}
                        aria-label={`删除 ${row.email}`}
                      >
                        <Trash2 className="size-4" strokeWidth={1.75} />
                      </button>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="border-t border-border">
            <button
              type="button"
              onClick={handleAddAccount}
              className="flex w-full min-w-0 items-center gap-[var(--space-200)] px-[var(--space-300)] py-[var(--space-250)] text-left transition-colors hover:bg-[var(--black-alpha-11)]"
            >
              <span
                className="flex size-7 shrink-0 items-center justify-center rounded-full border border-primary text-primary"
                aria-hidden
              >
                <Plus className="size-4" strokeWidth={2} />
              </span>
              <span className="text-[length:var(--font-size-sm)] font-[var(--font-weight-medium)] text-primary">
                添加账号
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
